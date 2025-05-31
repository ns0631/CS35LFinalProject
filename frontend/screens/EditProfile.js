import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../App';

// UCLA email validation function
const isValidUCLAEmail = (email) => {
  const uclaEmailRegex = /^[a-zA-Z0-9._%+-]+@(ucla\.edu|g\.ucla\.edu)$/;
  return uclaEmailRegex.test(email.toLowerCase());
};

export default function EditProfile({ navigation }) {
  const { user, login } = useAuth();
  
  // Initialize form state with user data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  // Track if user has made changes
  useEffect(() => {
    if (user) {
      const originalData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      };
      
      const currentData = { firstName, lastName, email, phone };
      
      const changed = JSON.stringify(originalData) !== JSON.stringify(currentData);
      setHasChanges(changed);
    }
  }, [firstName, lastName, email, phone, user]);

  const handleSave = async () => {
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

    // Check if email was changed
    const emailChanged = email.toLowerCase().trim() !== user.email.toLowerCase();
    
    if (emailChanged) {
      Alert.alert(
        'Email Change Detected',
        'Changing your email address will require re-verification. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => saveProfile(true) }
        ]
      );
    } else {
      saveProfile(false);
    }
  };

  const saveProfile = async (emailChanged) => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create updated user data
      const updatedUser = {
        ...user,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        updatedAt: new Date().toISOString(),
        // If email changed, mark as unverified
        ...(emailChanged && { isEmailVerified: false })
      };

      // Update user data in auth context
      await login(updatedUser);

      Alert.alert(
        'Profile Updated',
        emailChanged 
          ? 'Your profile has been updated. Please check your new email for verification.'
          : 'Your profile has been updated successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack()
          }
        ]
      );

    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { 
            text: 'Discard', 
            style: 'destructive',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || 'US';
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No user data available</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {getInitials(firstName, lastName)}
            </Text>
          </View>
          <Text style={styles.title}>Edit Profile</Text>
          <Text style={styles.subtitle}>Update your account information</Text>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          <View style={styles.nameContainer}>
            <View style={styles.nameInputContainer}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.nameInput}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
                autoCapitalize="words"
              />
            </View>
            <View style={styles.nameInputContainer}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.nameInput}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>UCLA Email</Text>
            <TextInput
              style={[
                styles.input,
                email && !isValidUCLAEmail(email) && styles.inputError
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="your.name@ucla.edu"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {email && !isValidUCLAEmail(email) && (
              <Text style={styles.errorText}>Must be a valid UCLA email (@ucla.edu or @g.ucla.edu)</Text>
            )}
            {email.toLowerCase().trim() !== user.email.toLowerCase() && (
              <Text style={styles.warningText}>⚠️ Changing email will require re-verification</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Phone Number (Optional)</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="(555) 123-4567"
              keyboardType="phone-pad"
            />
          </View>

          {/* Account Info */}
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Account Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Account Status:</Text>
              <Text style={[
                styles.infoValue,
                user.isEmailVerified ? styles.verified : styles.unverified
              ]}>
                {user.isEmailVerified ? 'Verified' : 'Unverified'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Member Since:</Text>
              <Text style={styles.infoValue}>
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              (!hasChanges || isLoading) && styles.buttonDisabled
            ]} 
            onPress={handleSave}
            disabled={!hasChanges || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={handleCancel}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#003f5c',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003f5c',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  formSection: {
    padding: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nameInputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
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
  warningText: {
    color: '#ff9800',
    fontSize: 12,
    marginTop: 4,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003f5c',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  verified: {
    color: '#4CAF50',
  },
  unverified: {
    color: '#ff9800',
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  saveButton: {
    backgroundColor: '#003f5c',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#666',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#003f5c',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
