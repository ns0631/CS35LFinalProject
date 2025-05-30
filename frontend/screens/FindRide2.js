import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Keyboard, TouchableWithoutFeedback } from 'react-native';

const placeholderRides = [
  { id: '1', origin: 'UCLA', destination: 'LAX', time: '2024-06-10 10:00', driver: 'Alice' },
  { id: '2', origin: 'UCLA', destination: 'Santa Monica', time: '2024-06-10 11:00', driver: 'Bob' },
  { id: '3', origin: 'Westwood', destination: 'LAX', time: '2024-06-10 12:00', driver: 'Charlie' },
  { id: '4', origin: 'UCLA', destination: 'Downtown', time: '2024-06-10 13:00', driver: 'Dana' },
];

export default function FindRide2({ navigation, route }) {
  // Filtering states (prefilled from route.params if available)
  const [origin] = useState(route?.params?.origin || '');
  const [destination] = useState(route?.params?.destination || '');
  const [originRadius, setOriginRadius] = useState(route?.params?.originRadius || '');
  const [destinationRadius, setDestinationRadius] = useState(route?.params?.destinationRadius || '');
  const [timeRangeHours, setTimeRangeHours] = useState(route?.params?.timeRangeHours || '');
  const [timeRangeMinutes, setTimeRangeMinutes] = useState(route?.params?.timeRangeMinutes || '');
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Filtering logic (placeholder logic, since rides don't have radius/time fields)
  const filteredRides = placeholderRides.filter(ride => {
    return (
      (origin === '' || ride.origin.toLowerCase().includes(origin.toLowerCase())) &&
      (destination === '' || ride.destination.toLowerCase().includes(destination.toLowerCase()))
    );
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Available Rides</Text>
        <TouchableOpacity
          style={styles.filterToggle}
          onPress={() => setFiltersVisible(v => !v)}
        >
          <Text style={styles.filterToggleText}>{filtersVisible ? 'Hide Filters' : 'Show Filters'}</Text>
        </TouchableOpacity>
        {filtersVisible && (
          <View style={styles.filterGroup}>
            <Text style={styles.label}>Departure Radius (miles)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 5"
              keyboardType="numeric"
              value={originRadius}
              onChangeText={setOriginRadius}
            />
            <Text style={styles.label}>Destination Radius (miles)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 10"
              keyboardType="numeric"
              value={destinationRadius}
              onChangeText={setDestinationRadius}
            />
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
        )}
        <FlatList
          data={filteredRides}
          keyExtractor={item => item.id}
          style={{ width: '100%' }}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('ViewProfile')}>
              <View style={styles.rideCard}>
                <Text style={styles.rideText}>From: {item.origin}</Text>
                <Text style={styles.rideText}>To: {item.destination}</Text>
                <Text style={styles.rideText}>Time: {item.time}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#003f5c',
  },
  rideCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  rideText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
    fontWeight: 'normal',
  },
  button: {
    backgroundColor: '#003f5c',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: 200,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  filterGroup: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
    fontWeight: 'normal',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f9f9f9',
    width: '100%',
    marginBottom: 16,
  },
  inlineInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
    marginBottom: 8,
  },
  halfInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f9f9f9',
    width: '48%',
  },
  filterToggle: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filterToggleText: {
    color: '#333',
    fontWeight: 'normal',
    fontSize: 16,
  },
}); 