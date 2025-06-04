import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  SafeAreaView,
  ActivityIndicator 
} from 'react-native';
import { useAuth } from '../App';

export default function EmailVerification({ navigation, route }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { login } = useAuth();
  
  // Get email from route params (passed from signup)
  const { email, userData } = route.params || {};

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Simulate sending verification email
  const sendVerificationCode = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate a random 6-digit code for demo
      const code = Math.floor(100000 + Math.random() * 900000);
      console.log(`Verification code sent to ${email}: ${code}`);
      
      // In a real app, this would be sent via email service
      Alert.alert(
        'Verification Code Sent',
        `A verification code has been sent to ${email}.\n\nFor demo purposes, the code is: ${code}`,
        [{ text: 'OK' }]
      );
      
      setCountdown(60); // 60 second cooldown
      setIsLoading(false);
    }, 2000);
  };

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter a 6-digit verification code');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate verification API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // After verification, perform a real login to get the JWT token
      const serverResponse = await fetch(BACKEND_URL + "/api/users/login", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userData.email, password: userData.password })
      });
      const responseText = await serverResponse.text();
      const responseJSON = JSON.parse(responseText);
      if (!responseJSON.success) {
        Alert.alert('Verification Failed', 'Automatic login after verification failed. Please log in manually.');
        setIsLoading(false);
        return;
      }
      await login(responseJSON.data); // Now AsyncStorage has a JWT!

      Alert.alert(
        'Success!',
        'Your UCLA email has been verified. Welcome to UCLA Rideshare!',
        [{ text: 'Continue', onPress: () => {/* Navigation handled by auth context */} }]
      );
    } catch (error) {
      Alert.alert('Verification Failed', 'Invalid verification code or network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    // Automatically send verification code when screen loads
    if (email) {
      sendVerificationCode();
    }
  }, [email]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify Your UCLA Email</Text>
        
        <Text style={styles.subtitle}>
          We've sent a verification code to:
        </Text>
        <Text style={styles.email}>{email}</Text>
        
        <Text style={styles.instruction}>
          Enter the 6-digit code to complete your registration
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder="000000"
            keyboardType="numeric"
            maxLength={6}
            autoFocus
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, (!verificationCode || isLoading) && styles.buttonDisabled]}
          onPress={verifyCode}
          disabled={!verificationCode || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify Email</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <TouchableOpacity
            onPress={sendVerificationCode}
            disabled={countdown > 0 || isLoading}
            style={styles.resendButton}
          >
            <Text style={[
              styles.resendButtonText, 
              (countdown > 0 || isLoading) && styles.resendButtonDisabled
            ]}>
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back to Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003f5c',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003f5c',
    marginBottom: 30,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 20,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#fff',
    letterSpacing: 8,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#003f5c',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  resendButton: {
    padding: 8,
  },
  resendButtonText: {
    color: '#003f5c',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButtonDisabled: {
    color: '#ccc',
  },
  backButton: {
    padding: 15,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
}); 