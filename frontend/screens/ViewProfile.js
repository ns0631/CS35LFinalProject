import React from 'react';
import { Text, View, Button } from 'react-native';

export default function ViewProfile({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>My Profile</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}