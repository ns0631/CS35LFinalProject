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
  ActivityIndicator,
  ScrollView
} from 'react-native';

// UCLA email validation function
const isValidUCLAEmail = (email) => {
  const uclaEmailRegex = /^[a-zA-Z0-9._%+-]+@(ucla\.edu|g\.ucla\.edu)$/;
  return uclaEmailRegex.test(email.toLowerCase());
};

// Password validation function
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    errors: [
      ...(password.length < minLength ? ['At least 8 characters'] : []),
      ...(!hasUpperCase ? ['One uppercase letter'] : []),
      ...(!hasLowerCase ? ['One lowercase letter'] : []),
      ...(!hasNumbers ? ['One number'] : []),
      ...(!hasSpecialChar ? ['One special character'] : [])
    ]
  };
};

export default function Signup({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const handleSignup = async () => {
    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please enter your first and last name');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!isValidUCLAEmail(email)) {
      Alert.alert(
        'Invalid Email', 
        'Please use a valid UCLA email address ending with @ucla.edu or @g.ucla.edu'
      );
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      Alert.alert(
        'Weak Password', 
        'Password must contain:\n• ' + passwordValidation.errors.join('\n• ')
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate account creation API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create user data object
      const userData = {
        id: Date.now().toString(), // In real app, this would come from backend
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        createdAt: new Date().toISOString(),
        isEmailVerified: false
      };

      // Navigate to email verification
      navigation.navigate('EmailVerification', {
        email: userData.email,
        userData: userData
      });

    } catch (error) {
      Alert.alert('Sign Up Failed', 'An error occurred while creating your account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const passwordValidation = validatePassword(password);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.signupWindow}>
          <Text style={styles.header}>Join UCLA Rideshare</Text>
          <Text style={styles.subtitle}>Create your account with your UCLA email</Text>

          <View style={styles.nameContainer}>
            <View style={styles.nameInputContainer}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.nameInput}
                onChangeText={setFirstName}
                value={firstName}
                placeholder="First name"
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
            <View style={styles.nameInputContainer}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.nameInput}
                onChangeText={setLastName}
                value={lastName}
                placeholder="Last name"
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>UCLA Email</Text>
            <TextInput
              style={[
                styles.inputField,
                email && !isValidUCLAEmail(email) && styles.inputError
              ]}
              onChangeText={setEmail}
              value={email}
              placeholder="your.name@ucla.edu"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
            {email && !isValidUCLAEmail(email) && (
              <Text style={styles.errorText}>Must be a valid UCLA email (@ucla.edu or @g.ucla.edu)</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[
                styles.inputField,
                password && !passwordValidation.isValid && styles.inputError
              ]}
              onChangeText={setPassword}
              value={password}
              placeholder="Create a strong password"
              secureTextEntry={true}
              returnKeyType="next"
              onFocus={() => setShowPasswordRequirements(true)}
              onBlur={() => setShowPasswordRequirements(false)}
            />
            {(showPasswordRequirements || (password && !passwordValidation.isValid)) && (
              <View style={styles.passwordRequirements}>
                <Text style={styles.requirementsTitle}>Password must contain:</Text>
                {passwordValidation.errors.map((error, index) => (
                  <Text key={index} style={styles.requirementText}>• {error}</Text>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={[
                styles.inputField,
                confirmPassword && password !== confirmPassword && styles.inputError
              ]}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              placeholder="Confirm your password"
              secureTextEntry={true}
              returnKeyType="done"
              onSubmitEditing={handleSignup}
            />
            {confirmPassword && password !== confirmPassword && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginLink}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLinkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  signupWindow: {
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
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  nameInputContainer: {
    flex: 1,
    marginHorizontal: 4,
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
  nameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff3333',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: '#ff3333',
    fontSize: 12,
    marginTop: 4,
  },
  passwordRequirements: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e8ff',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
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
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLinkText: {
    fontSize: 16,
    color: '#003f5c',
    fontWeight: '600',
  },
});