import React from 'react';
import { Text, View, Button } from 'react-native';

export default function ViewRides({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>View My Rides</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}