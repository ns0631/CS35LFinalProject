/* import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FirstPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome To Carpool App</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 30 },
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

*/