import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '@env';
import StarRating from '../components/StarRating';

export default function ViewProfile({ navigation, route }) {
  const paramUser = route.params?.user;
  const [profile, setProfile] = useState(paramUser || null);
  const [average, setAverage] = useState(null);
  const [myRating, setMyRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Fetch latest profile (with average) when mounted
  useEffect(() => {
    if (paramUser && paramUser._id) {
      fetch(`${BACKEND_URL}/api/users/${paramUser._id}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            setProfile(json.data);
            setAverage(json.data.averageRating);
            // If you want to show user's previous rating, you could check here
          }
        });
    }
  }, [paramUser]);

  const handleSubmitRating = async () => {
    if (!profile || !profile._id || myRating < 1 || myRating > 5) return;
    setSubmitting(true);
    try {
      const userData = JSON.parse(await AsyncStorage.getItem('userToken'));
      const token = userData['token'];
      const response = await fetch(`${BACKEND_URL}/api/users/${profile._id}/rate`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ value: myRating })
      });
      let rawText = await response.text();
      let json;
      try {
        json = JSON.parse(rawText);
      } catch (parseErr) {
        console.log('Raw response text:', rawText);
        Alert.alert('Server Error', 'Response was not JSON. See console for details.');
        setSubmitting(false);
        return;
      }
      if (json.success) {
        setAverage(json.average);
        Alert.alert('Thank you!', 'Your rating was submitted.');
      } else {
        Alert.alert('Error', json.message || 'Failed to submit rating');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to submit rating');
    }
    setSubmitting(false);
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.noUserText}>No user data provided.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  console.log(profile.phone);
  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Image
          source={{ uri: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.firstName + ' ' + profile.lastName) + '&background=d5f7f7&color=003f5c&size=128' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{profile.firstName} {profile.lastName}</Text>
        <Text style={styles.email}>Email: {profile.email}</Text>
        <Text style={styles.email}>Phone: {profile.phone ? profile.phone : "Not given"}</Text>
        <View style={{ alignItems: 'center', marginVertical: 12 }}>
          <Text style={{ fontSize: 18, marginBottom: 4 }}>Average Rating:</Text>
          <StarRating rating={Number(average) || 0} setRating={() => {}} disabled={true} />
          <Text style={{ fontSize: 16, color: '#003f5c', marginTop: 2 }}>{average ? average : 'No ratings yet'}</Text>
        </View>
        <View style={{ alignItems: 'center', marginVertical: 12 }}>
          <Text style={{ fontSize: 16, marginBottom: 2 }}>Your Rating:</Text>
          <StarRating rating={myRating} setRating={setMyRating} disabled={submitting} />
          <TouchableOpacity style={[styles.button, { marginTop: 8, width: 140 }]} onPress={handleSubmitRating} disabled={submitting || myRating === 0}>
            <Text style={styles.buttonText}>{submitting ? 'Submitting...' : 'Submit Rating'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
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
  profileCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    marginTop: 40,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 20,
    backgroundColor: '#d5f7f7',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003f5c',
    marginBottom: 12,
  },
  email: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    backgroundColor: '#d5f7f7',
    padding: 8,
    borderRadius: 8,
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
  noUserText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
});