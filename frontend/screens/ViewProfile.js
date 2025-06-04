import React from 'react';
import { Text, View, Button } from 'react-native';

export default function ViewProfile({ navigation, route }) {
  const user = route.params?.user;
  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No user data provided.</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{user.firstName} {user.lastName}</Text>
      <Text style={{ fontSize: 18, marginTop: 10 }}>Email: {user.email}</Text>
      {/* Add more fields as needed */}
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}