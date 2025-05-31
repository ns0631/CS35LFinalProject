import 'react-native-get-random-values';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import FirstPage from './screens/FirstPage';
import Login from './screens/Login';
import Signup from './screens/Signup.js';
import EmailVerification from './screens/EmailVerification';
import HomeScreen from './screens/HomeScreen';
import ShareRide from './screens/ShareRide';
import FindRide from './screens/FindRide';
import ViewRides from './screens/ViewRides';
import ViewProfile from './screens/ViewProfile';
import EditProfile from './screens/EditProfile.js';

// Authentication Context
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('userToken');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem('userToken', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const Stack = createNativeStackNavigator();

// Auth Stack (for unauthenticated users)
const AuthStack = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen 
      name="Login" 
      component={Login} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Signup" 
      component={Signup} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="EmailVerification" 
      component={EmailVerification} 
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// Main App Stack (for authenticated users)
const AppStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="ShareRide" component={ShareRide} />
    <Stack.Screen name="FindRide" component={FindRide} />
    <Stack.Screen name="ViewRides" component={ViewRides} />
    <Stack.Screen name="ViewProfile" component={ViewProfile} />
    <Stack.Screen name="EditProfile" component={EditProfile} />
  </Stack.Navigator>
);

// Root Navigator
const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading screen
  }

  return user ? <AppStack /> : <AuthStack />;
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}