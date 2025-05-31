import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../App';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome back,</Text>
        <Text style={styles.userName}>{user?.firstName || 'UCLA Student'}!</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <Text style={styles.title}>UCLA Rideshare</Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ShareRide')}>
          <Text style={styles.buttonText}>Share a Ride</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FindRide')}>
          <Text style={styles.buttonText}>Find a Ride</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ViewRides')}>
          <Text style={styles.buttonText}>View My Rides</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.buttonText}>My Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 60, 
    paddingHorizontal: 20,
    alignItems: 'center', 
    backgroundColor: '#fff' 
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcome: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003f5c',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#888',
  },
  title: { 
    fontSize: 28, 
    marginBottom: 40, 
    fontWeight: 'bold',
    color: '#003f5c',
  },
  buttonGroup: { 
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#003f5c',
    padding: 18,
    borderRadius: 12,
    marginVertical: 8,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { 
    color: 'white', 
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ff4444',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    width: '60%',
    maxWidth: 200,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
  },
});