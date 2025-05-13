import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function FindRide({ navigation }) {
  const [origin, setOrigin] = useState('');
  const [originRadius, setOriginRadius] = useState('');
  const [destination, setDestination] = useState('');
  const [destinationRadius, setDestinationRadius] = useState('');
  const [leaveTime, setLeaveTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeRangeHours, setTimeRangeHours] = useState('');
  const [timeRangeMinutes, setTimeRangeMinutes] = useState('');

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || leaveTime;
    setShowDatePicker(Platform.OS === 'ios');
    setLeaveTime(currentDate);
  };

  const handleSubmit = () => {
    console.log({
      origin,
      originRadius,
      destination,
      destinationRadius,
      leaveTime,
      timeRange: `${timeRangeHours}h ${timeRangeMinutes}m`
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find a Ride</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Departure Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter departure address"
          value={origin}
          onChangeText={setOrigin}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Depature Radius (miles)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 5"
          keyboardType="numeric"
          value={originRadius}
          onChangeText={setOriginRadius}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Destination Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          value={destination}
          onChangeText={setDestination}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Destination Radius (miles)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 10"
          keyboardType="numeric"
          value={destinationRadius}
          onChangeText={setDestinationRadius}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Time Leaving</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text>{leaveTime.toLocaleString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={leaveTime}
            mode="datetime"
            display="default"
            onChange={onChangeDate}
          />
        )}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Time Range</Text>
        <View style={styles.inlineInputs}>
          <TextInput
            style={styles.halfInput}
            placeholder="Hours"
            keyboardType="numeric"
            value={timeRangeHours}
            onChangeText={setTimeRangeHours}
          />
          <TextInput
            style={styles.halfInput}
            placeholder="Minutes"
            keyboardType="numeric"
            value={timeRangeMinutes}
            onChangeText={setTimeRangeMinutes}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Find Ride</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#003f5c',
  },
  fieldGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f9f9f9',
    width: '100%',
    marginBottom: 10,
  },
  inlineInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  halfInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f9f9f9',
    width: '48%',
  },
  button: {
    backgroundColor: '#003f5c',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
