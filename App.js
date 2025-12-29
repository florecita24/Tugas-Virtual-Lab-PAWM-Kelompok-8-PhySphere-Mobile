import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View, Linking } from 'react-native';

// Import screens
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import MateriScreen from './screens/MateriScreen';
import LabScreen from './screens/LabScreen';
import KuisScreen from './screens/KuisScreen';
import ProfileScreen from './screens/ProfileScreen';

// Import Supabase
import { supabase } from './services/supabaseClient';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Linking configuration for deep linking
const linking = {
  prefixes: ['physphere://', 'exp://127.0.0.1:8081'],
  config: {
    screens: {
      Auth: {
        screens: {
          Welcome: 'auth-callback',
        },
      },
      App: {
        screens: {
          Home: 'home',
        },
      },
    },
  },
};

// Auth Stack untuk welcome/login/register
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Main App Stack untuk navigasi utama
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Materi') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Lab') {
            iconName = focused ? 'flask' : 'flask-outline';
          } else if (route.name === 'Kuis') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#a855f7',
        tabBarInactiveTintColor: '#9ca3af',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Beranda' }} 
      />
      <Tab.Screen 
        name="Materi" 
        component={MateriScreen} 
        options={{ title: 'Materi' }} 
      />
      <Tab.Screen 
        name="Lab" 
        component={LabScreen} 
        options={{ title: 'PhySphere Lab' }} 
      />
      <Tab.Screen 
        name="Kuis" 
        component={KuisScreen} 
        options={{ title: 'Kuis' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profil' }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        dispatch({ type: 'RESTORE_TOKEN', token: session?.access_token });
      } catch (e) {
        console.error(e);
        dispatch({ type: 'RESTORE_TOKEN', token: null });
      }
    };

    bootstrapAsync();

    // Listen untuk perubahan auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.access_token) {
        dispatch({ type: 'SIGN_IN', token: session.access_token });
      } else {
        dispatch({ type: 'SIGN_OUT' });
      }
    });

    // Handle deep links for OAuth callback
    const handleDeepLink = (event) => {
      const url = event.url;
      if (url) {
        // Check if this is an auth callback
        let access_token, refresh_token;
        
        if (url.includes('#')) {
          const params = new URLSearchParams(url.split('#')[1]);
          access_token = params.get('access_token');
          refresh_token = params.get('refresh_token');
        }
        
        if (!access_token && url.includes('?')) {
          const params = new URLSearchParams(url.split('?')[1]);
          access_token = params.get('access_token');
          refresh_token = params.get('refresh_token');
        }
        
        if (access_token) {
          supabase.auth.setSession({
            access_token,
            refresh_token,
          });
        }
      }
    };

    // Listen for incoming deep links
    const linkingSubscription = Linking.addEventListener('url', handleDeepLink);

    // Check if app was opened with a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription?.unsubscribe();
      linkingSubscription?.remove();
    };
  }, []);

  if (state.isLoading || showSplash) {
    if (showSplash) {
      return <SplashScreen onFinish={() => setShowSplash(false)} />;
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#a855f7" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      {state.userToken == null ? <AuthStack /> : <AppTabs />}
    </NavigationContainer>
  );
}
