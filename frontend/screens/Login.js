import React, { useState } from 'react';
import { 
  StatusBar,
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../App';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For demo purposes, accept any email/password combination
      // In a real app, this would verify against your backend
      
      // Check if it's a UCLA email
      const uclaEmailRegex = /^[a-zA-Z0-9._%+-]+@(ucla\.edu|g\.ucla\.edu)$/;
      if (!uclaEmailRegex.test(email.toLowerCase())) {
        Alert.alert('Invalid Email', 'Please use your UCLA email address');
        setIsLoading(false);
        return;
      }

      // Mock user data - in real app this would come from backend
      const userData = {
        id: '12345',
        firstName: 'UCLA',
        lastName: 'Student',
        email: email.toLowerCase().trim(),
        isEmailVerified: true,
        loginAt: new Date().toISOString()
      };

      await login(userData);
      
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginWindow}>
        <Text style={styles.header}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to UCLA Rideshare</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>UCLA Email</Text>
          <TextInput
            style={styles.inputField}
            onChangeText={setEmail}
            value={email}
            placeholder="your.name@ucla.edu"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.inputField}
            onChangeText={setPassword}
            value={password}
            placeholder="Enter your password"
            secureTextEntry={true}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.signupLink}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={navigateToSignup}>
            <Text style={styles.signupLinkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demoInfo}>
          <Text style={styles.demoTitle}>Demo Login:</Text>
          <Text style={styles.demoText}>Use any UCLA email (@ucla.edu) and any password</Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loginWindow: {
    width: '90%',
    maxWidth: 400,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#003f5c',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#003f5c',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  signupLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signupText: {
    fontSize: 16,
    color: '#666',
  },
  signupLinkText: {
    fontSize: 16,
    color: '#003f5c',
    fontWeight: '600',
  },
  demoInfo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e8ff',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003f5c',
    marginBottom: 4,
  },
  demoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});