import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  Alert,
  Linking,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../services/supabaseClient';

WebBrowser.maybeCompleteAuthSession();

export default function WelcomeScreen({ navigation }) {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleGoogleLogin = async () => {
    try {
      // Show a loading state could be added here
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'exp://127.0.0.1:8081', // Expo Go development URL
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        Alert.alert('Error', error.message || 'Gagal memulai proses login Google.');
        return;
      }

      // Open the OAuth URL in browser
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          'exp://127.0.0.1:8081' // Redirect back to Expo Go
        );
        
        if (result.type === 'success') {
          // Handle the redirect URL
          const { url } = result;
          
          // Parse the URL to extract tokens
          let access_token, refresh_token;
          
          // Try to parse from hash fragment
          if (url.includes('#')) {
            const params = new URLSearchParams(url.split('#')[1]);
            access_token = params.get('access_token');
            refresh_token = params.get('refresh_token');
          }
          
          // Try to parse from query string
          if (!access_token && url.includes('?')) {
            const params = new URLSearchParams(url.split('?')[1]);
            access_token = params.get('access_token');
            refresh_token = params.get('refresh_token');
          }
          
          if (access_token) {
            // Set the session with the tokens
            const { error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            
            if (sessionError) {
              Alert.alert('Error', 'Gagal menyimpan sesi login.');
            } else {
              Alert.alert('Sukses', 'Login dengan Google berhasil!');
            }
          } else {
            Alert.alert('Error', 'Tidak dapat mengambil token dari Google.');
          }
        } else if (result.type === 'cancel') {
          Alert.alert('Dibatalkan', 'Login dengan Google dibatalkan.');
        }
      }
    } catch (err) {
      console.error('Google signin error', err);
      Alert.alert('Error', 'Terjadi kesalahan saat login dengan Google.');
    }
  };

  return (
    <LinearGradient
      colors={['#7c3aed', '#9333ea', '#a855f7', '#c084fc', '#f59e0b']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Animated Physics Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.physicsLogo}>
              <LinearGradient
                colors={['#7c3aed', '#f59e0b']}
                style={styles.nucleus}
              />
              <Animated.View style={[styles.orbit, { transform: [{ rotate: spin }] }]}>
                <View style={styles.electron} />
              </Animated.View>
              <Animated.View style={[styles.orbit, { transform: [{ rotate: '60deg' }, { rotate: spin }] }]}>
                <View style={styles.electron} />
              </Animated.View>
              <Animated.View style={[styles.orbit, { transform: [{ rotate: '120deg' }, { rotate: spin }] }]}>
                <View style={styles.electron} />
              </Animated.View>
            </View>
          </View>

          <Text style={styles.title}>Selamat datang di PhySphere</Text>
          <Text style={styles.subtitle}>
            Masuk untuk melanjutkan ke simulasi dan kuis interaktif.
          </Text>

          {/* Auth Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={() => navigation.navigate('Login')}
            >
              <LinearGradient
                colors={['#7c3aed', '#a855f7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonTextPrimary}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.buttonTextSecondary}>Register</Text>
            </TouchableOpacity>
          </View>

          {/* Google Login Button */}
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
            <Image
              source={require('../assets/google-logo.png')}
              style={styles.googleIcon}
              resizeMode="contain"
            />
            <Text style={styles.googleButtonText}>Login dengan Google</Text>
          </TouchableOpacity>

          <Text style={styles.footerNote}>
            Jika sudah login, Anda akan diarahkan otomatis ke halaman utama.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 40,
    paddingHorizontal: 32,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 60,
    elevation: 10,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  physicsLogo: {
    position: 'relative',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nucleus: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 5,
  },
  orbit: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(124,58,237,0.3)',
  },
  electron: {
    position: 'absolute',
    top: -4,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7c3aed',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6d28d9',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  buttonPrimary: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextPrimary: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: 'rgba(168,85,247,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(168,85,247,0.3)',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonTextSecondary: {
    color: '#7c3aed',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(168,85,247,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(168,85,247,0.3)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 10,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  googleButtonText: {
    color: '#7c3aed',
    fontSize: 14,
    fontWeight: '600',
  },
  footerNote: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
  },
});
