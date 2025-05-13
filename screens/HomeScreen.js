import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Ride Share App</Text>

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

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 80, alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 40, fontWeight: 'bold' },
  buttonGroup: { alignItems: 'center' },
  button: {
    backgroundColor: '#003f5c',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16 },
});