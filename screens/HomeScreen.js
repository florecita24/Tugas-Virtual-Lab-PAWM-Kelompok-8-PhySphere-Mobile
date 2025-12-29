import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section dengan gradient purple-orange */}
      <LinearGradient
        colors={['rgba(124,58,237,0.95)', 'rgba(124,58,237,0.85)', 'rgba(245,158,11,0.85)']}
        start={{ x: 0.1, y: 0.2 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroTitle}>
          Pelajari <Text style={styles.underline}>Gerak Harmonik</Text> dengan PhySphere
        </Text>
        <Text style={styles.heroSubtitle}>
          Simulasi interaktif, kuis berbasis tugas, dan materi ringkas untuk membantu kamu menguasai konsep GHS dengan cepat.
        </Text>

        {/* Logo PhySphere Container */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/logo-physphere.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>
            Mulai jelajahi modul atau langsung coba kuis untuk menguji pemahamanmu.
          </Text>
        </View>
        
        {/* Tombol CTA */}
        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={styles.ctaPrimary}
            onPress={() => navigation.navigate('Materi')}
          >
            <Text style={styles.ctaPrimaryText}>Mulai Materi</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.ctaSecondary}
            onPress={() => navigation.navigate('Kuis')}
          >
            <Text style={styles.ctaSecondaryText}>Coba Kuis</Text>
          </TouchableOpacity>
        </View>
        
        {/* Feature Highlights Grid */}
        <View style={styles.highlightsRow}>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightTitle}>Interaktif</Text>
            <Text style={styles.highlightDesc}>Simulasi real-time & parameter</Text>
          </View>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightTitle}>Terukur</Text>
            <Text style={styles.highlightDesc}>Kuis dinilai & riwayat tersimpan</Text>
          </View>
          <View style={styles.highlightBox}>
            <Text style={styles.highlightTitle}>Ringkas</Text>
            <Text style={styles.highlightDesc}>Materi singkat & video</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Feature Cards Grid */}
      <View style={styles.featuresGrid}>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Simulasi Interaktif</Text>
          <Text style={styles.featureDesc}>
            Sesuaikan parameter dan amati perubahan gerak secara real-time pada lab kami.
          </Text>
        </View>
        
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Kuis dengan Riwayat</Text>
          <Text style={styles.featureDesc}>
            Uji pemahaman dan lihat riwayat serta nilai terbaikmu di profil.
          </Text>
        </View>
        
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Referensi Ringkas</Text>
          <Text style={styles.featureDesc}>
            Ringkasan rumus dan konsep yang mudah dibaca untuk tiap topik.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Made by Kelompok 8</Text>
        <Text style={styles.footerSubtext}>
          Florecita Natawirya (18223040) & Fhatika Adhalisman Ryanjani (18223062)
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  hero: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingTop: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 38,
    marginBottom: 16,
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationColor: '#fcd34d',
    textDecorationStyle: 'solid',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#e9d5ff',
    lineHeight: 24,
    marginBottom: 24,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  ctaPrimary: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ctaPrimaryText: {
    color: '#7c3aed',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  ctaSecondary: {
    flex: 1,
    backgroundColor: 'rgba(124,58,237,0.3)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  ctaSecondaryText: {
    color: '#fef3c7',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  highlightsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  highlightBox: {
    flex: 1,
    backgroundColor: 'rgba(124,58,237,0.3)',
    borderRadius: 12,
    padding: 12,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  highlightDesc: {
    fontSize: 11,
    color: '#e9d5ff',
    lineHeight: 14,
  },
  logoContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logoImage: {
    width: 320,
    height: 320,
    marginTop: -110,
    marginBottom: -110,
    opacity: 0.95,
  },
  logoText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  featuresGrid: {
    padding: 16,
    gap: 12,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7c3aed',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
