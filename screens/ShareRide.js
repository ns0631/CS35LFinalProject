import React from 'react';
import { Text, View, Button } from 'react-native';

export default function ShareRide({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Share a Ride</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}
