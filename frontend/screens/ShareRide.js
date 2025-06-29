import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert, TextInput, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GOOGLE_MAPS_API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BACKEND_URL } from '@env';

// Address validation function using Google Geocoding API
const validateAddress = async (address) => {
  if (!address || address.length < 5) return null;
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();

    console.log(GOOGLE_MAPS_API_KEY);

    console.log(data);
    
    if (data.status === 'OK' && data.results.length > 0) {
      return {
        isValid: true,
        formattedAddress: data.results[0].formatted_address,
        location: data.results[0].geometry.location
      };
    }
    return { isValid: false };
  } catch (error) {
    console.error('Address validation error:', error);
    return null;
  }
};

// Custom Address Input component with validation
const AddressInput = ({ placeholder, onAddressChange, value }) => {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(null);
  const [validationTimeout, setValidationTimeout] = useState(null);

  const handleAddressChange = (text) => {
    onAddressChange(text);
    setIsValid(null);
    
    // Clear previous timeout
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }
    
    // Set new timeout for validation (debounce)
    const timeout = setTimeout(async () => {
      if (text.length > 5) {
        setIsValidating(true);
        const result = await validateAddress(text);
        setIsValidating(false);
        
        if (result) {
          setIsValid(result.isValid);
          if (result.isValid && result.formattedAddress !== text) {
            // Optionally update with formatted address
            onAddressChange(result.formattedAddress);
          }
        }
      }
    }, 1000);
    
    setValidationTimeout(timeout);
  };

  const getInputStyle = () => {
    let style = [styles.input];
    if (isValid === true) {
      style.push(styles.validInput);
    } else if (isValid === false) {
      style.push(styles.invalidInput);
    }
    return style;
  };

  return (
    <View style={styles.addressInputContainer}>
      <TextInput
        style={getInputStyle()}
        placeholder={placeholder}
        value={value}
        onChangeText={handleAddressChange}
        autoCapitalize="words"
        autoCorrect={false}
      />
      <View style={styles.validationIndicator}>
        {isValidating && <ActivityIndicator size="small" color="#003f5c" />}
        {isValid === true && <Text style={styles.validText}>✓ Valid</Text>}
        {isValid === false && <Text style={styles.invalidText}>⚠ Invalid address</Text>}
      </View>
    </View>
  );
};

export default function ShareRide({ navigation }) {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState(new Date());
  const [capacity, setCapacity] = useState(3);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);

  useEffect(() => {
    // Debug: Log the API key (first few characters for security)
    console.log('API Key exists:', !!GOOGLE_MAPS_API_KEY);
    console.log('API Key length:', GOOGLE_MAPS_API_KEY ? GOOGLE_MAPS_API_KEY.length : 0);
    
    // Validate API key on component mount
    if (!GOOGLE_MAPS_API_KEY) {
      Alert.alert(
        'Configuration Error',
        'Google Maps API key is not configured properly. Please check your environment variables.'
      );
    } else {
      setIsApiKeyValid(true);
    }
  }, []);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleSubmit = async () => {
    if (!pickup || !dropoff) {
      Alert.alert('Error', 'Please enter both pickup and dropoff locations');
      return;
    }

    if(!capacity){
      Alert.alert('Error', 'Please enter your car capacity.');
      return;
    }

    // Validate addresses before submitting
    const pickupValidation = await validateAddress(pickup);
    const dropoffValidation = await validateAddress(dropoff);

    if (!pickupValidation || !pickupValidation.isValid) {
      Alert.alert('Invalid Address', 'Please enter a valid departure address');
      return;
    }

    if (!dropoffValidation || !dropoffValidation.isValid) {
      Alert.alert('Invalid Address', 'Please enter a valid destination address');
      return;
    }

    setIsApiKeyValid(false);
    setShowDatePicker(false);
    setIsApiKeyValid(true);

    try {
      // Retrieve token from AsyncStorage
      const userDataString = await AsyncStorage.getItem('userToken');
      const userData = userDataString ? JSON.parse(userDataString) : null;
      const token = userData && userData.token ? userData.token : undefined;
      const driverId = userData && userData._id ? userData._id : undefined;
      console.log('JWT being sent:', token); // Debug log
      console.log('Sharing ride as driver:', driverId); // Debug log

      let serverResponse = await fetch(BACKEND_URL + "/api/rides/create", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token || '', // Always send a string, never undefined
        },
        body: JSON.stringify({
          origin: pickupValidation.formattedAddress,
          destination: dropoffValidation.formattedAddress,
          timeLeaving: date,
          driver: driverId,
          capacity: capacity,
        })
      });
      
      const responseText = await serverResponse.text();
      const responseJSON = JSON.parse(responseText);
      if(!responseJSON.success){
        Alert.alert('Rideshare Failed', responseJSON.message || 'Ride share failed. Please try again.');
        return;
      }

      console.log('Ride Shared:', { 
        pickup: pickupValidation.formattedAddress, 
        dropoff: dropoffValidation.formattedAddress, 
        date 
      });
      Alert.alert('Ride Shared', `Pickup: ${pickupValidation.formattedAddress}\nDropoff: ${dropoffValidation.formattedAddress}\nDate/time: ${date}`);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to share ride. Please try again.');
    }
  };

  if (!isApiKeyValid) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Google Maps API is not configured properly.</Text>
        <Text style={styles.errorText}>Please check your .env file and restart the app.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share a Ride</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Departure Address</Text>
        <AddressInput
          placeholder="Enter departure address"
          onAddressChange={setPickup}
          value={pickup}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Destination Address</Text>
        <AddressInput
          placeholder="Enter destination address"
          onAddressChange={setDropoff}
          value={dropoff}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Date & Time</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text>{date.toLocaleString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={onChangeDate}
          />
        )}
      </View>

      <View style={styles.fieldGroup}>
          <Text style={styles.label}>Capacity</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 3"
            keyboardType="numeric"
            value={capacity}
            onChangeText={setCapacity}
          />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Share Ride</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
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
    zIndex: 1,
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
  },
  validInput: {
    borderColor: '#4CAF50',
    backgroundColor: '#f8fff8',
  },
  invalidInput: {
    borderColor: '#f44336',
    backgroundColor: '#fff8f8',
  },
  addressInputContainer: {
    width: '100%',
  },
  validationIndicator: {
    marginTop: 5,
    height: 20,
    justifyContent: 'center',
  },
  validText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  invalidText: {
    color: '#f44336',
    fontSize: 12,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#003f5c',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});