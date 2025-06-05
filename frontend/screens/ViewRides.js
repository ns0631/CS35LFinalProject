import React, { useEffect, useState } from 'react';
import { Text, View, Button, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '@env';

export default function ViewRides({ navigation }) {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      setError(null);
      try {
        const userData = JSON.parse(await AsyncStorage.getItem('userToken'));
        const token = userData['token'];
        const response = await fetch(`${BACKEND_URL}/api/rides/myrides`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': token,
          },
        });
        let rawText = await response.text();
        let json;
        try {
          json = JSON.parse(rawText);
        } catch (parseErr) {
          setError('Server response was not JSON.');
          setLoading(false);
          return;
        }
        if (json.success) {
          setRides(json.data);
        } else {
          setError(json.message || 'Failed to fetch rides');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch rides');
      }
      setLoading(false);
    };
    fetchRides();
  }, []);

  console.log(rides);
  return (
    <View style={{ flex: 1, paddingTop: 40, paddingHorizontal: 16, backgroundColor: '#fff' }}>
      <Text style={styles.title}>My Posted Rides</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#003f5c" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={{ color: 'red', margin: 20 }}>{error}</Text>
      ) : rides.length === 0 ? (
        <Text style={{ margin: 20, color: '#888' }}>You have not posted any rides yet.</Text>
      ) : (
        <ScrollView style={{ width: '100%' }}>
          {rides.map((ride, idx) => (
            <View key={ride._id || idx} style={styles.rideCard}>
              <Text style={styles.rideLabel}>From: <Text style={styles.rideValue}>{ride.origin}</Text></Text>
              <Text style={styles.rideLabel}>To: <Text style={styles.rideValue}>{ride.destination}</Text></Text>
              <Text style={styles.rideLabel}>Date: <Text style={styles.rideValue}>{ride.timeLeaving ? new Date(ride.timeLeaving).toLocaleString() : 'N/A'}</Text></Text>
              <Text style={styles.rideLabel}>Capacity: <Text style={styles.rideValue}>{ride.capacity || 'N/A'}</Text></Text>
              <Text style={styles.rideLabel}>Notes: <Text style={styles.rideValue}>{ride.notes || 'None'}</Text></Text>
            </View>
          ))}
        </ScrollView>
      )}
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003f5c',
    alignSelf: 'center',
    marginBottom: 12,
  },
  rideCard: {
    backgroundColor: '#f6fafd',
    borderRadius: 12,
    padding: 18,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  rideLabel: {
    fontWeight: 'bold',
    color: '#003f5c',
    marginBottom: 2,
  },
  rideValue: {
    fontWeight: 'normal',
    color: '#222',
  },
});