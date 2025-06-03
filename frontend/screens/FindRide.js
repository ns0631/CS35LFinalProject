import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Keyboard, TouchableWithoutFeedback, Alert, ActivityIndicator, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
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

export default function FindRide({ navigation }) {
  const [origin, setOrigin] = useState('');
  const [originRadius, setOriginRadius] = useState('');
  const [destination, setDestination] = useState('');
  const [destinationRadius, setDestinationRadius] = useState('');
  const [leaveTime, setLeaveTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeRangeHours, setTimeRangeHours] = useState('');
  const [timeRangeMinutes, setTimeRangeMinutes] = useState('');
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);

  useEffect(() => {
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
    const currentDate = selectedDate || leaveTime;
    setShowDatePicker(Platform.OS === 'ios');
    setLeaveTime(currentDate);
  };

  const handleSubmit = async () => {
    if (!origin || !destination) {
      Alert.alert('Error', 'Please enter both departure and destination addresses');
      return;
    }

    // Validate addresses before submitting
    const originValidation = await validateAddress(origin);
    const destinationValidation = await validateAddress(destination);

    if (!originValidation || !originValidation.isValid) {
      Alert.alert('Invalid Address', 'Please enter a valid departure address');
      return;
    }

    if (!destinationValidation || !destinationValidation.isValid) {
      Alert.alert('Invalid Address', 'Please enter a valid destination address');
      return;
    }

    let userData = JSON.parse(await AsyncStorage.getItem('userToken'));
    let token = await userData['token'];
    delete userData['token'];
    // update API call
    console.log(BACKEND_URL + "/api/rides/getRides");
    let serverResponse = await fetch(BACKEND_URL + "/api/rides/getRides", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({timeLeaving: leaveTime})
    });
      
    const responseText = await serverResponse.text();
    const responseJSON = JSON.parse(responseText);
    if(!responseJSON.success){
      Alert.alert('Rideshare Failed', 'Ride share failed. Please try again.');
      return;
    }

    console.log('Server response:' + JSON.stringify(responseJSON.data));
    navigation.navigate('FindRide2', {
      origin: originValidation.formattedAddress,
      originRadius,
      destination: destinationValidation.formattedAddress,
      destinationRadius,
      leaveTime: leaveTime.toISOString(),
      timeRangeHours,
      timeRangeMinutes,
      filteredRides: responseJSON.data
    });
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
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Find a Ride</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Departure Address</Text>
        <AddressInput
          placeholder="Enter departure address"
          onAddressChange={setOrigin}
          value={origin}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Departure Radius (miles)</Text>
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
        <AddressInput
          placeholder="Enter destination address"
          onAddressChange={setDestination}
          value={destination}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    minHeight: '100%',
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
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
