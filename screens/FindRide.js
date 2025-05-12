import React from 'react';
import { View, Text, Button } from 'react-native';

export default function FindRide({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Find a Ride</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}
