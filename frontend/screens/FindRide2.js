import React, { useState, useEffect } from 'react';
import { View, Alert, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { GOOGLE_MAPS_API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_URL } from '@env';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function FindRide2({ navigation, route }) {
  const handleJoin = (rideID) => {
    console.log("here");
      Alert.alert(
        'Join Ride',
        'Are you sure you want to join this ride?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Join', 
            style: 'destructive',
            onPress: async () => {
              const userData = JSON.parse(await AsyncStorage.getItem('userToken'));
              const token = await userData['token'];

              let serverResponse = await fetch(BACKEND_URL + `/api/rides/${rideID}/join`, {
                  method: 'PATCH',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "" + token,
                  },
                  body: JSON.stringify({userId: userData._id})
              });
              console.log(serverResponse);
              if(serverResponse.status == 200){
                Alert.alert(
                  'Ride joined',
                  "You've now joined this ride!",
                  [
                      { 
                        text: 'OK', 
                        onPress: () => navigation.goBack()
                      }
                  ]
                );
              } else{
                console.log("here");
                let errormessage;
                switch(serverResponse.status){
                  case 400:
                    errormessage = "Log back and log back in.";
                    break;
                  case 406:
                    errormessage = "You've already joined this ride.";
                    break;
                  case 404:
                    errormessage = "Ride doesn't exist.";
                    break;
                  case 403:
                    errormessage = "Ride is full.";
                    break;
                }
                console.log(serverResponse.message);
                Alert.alert(
                  'Ride join failed',
                  errormessage,
                  [
                      { 
                        text: 'OK', 
                        onPress: () => navigation.goBack()
                      }
                  ]
                );
              }
            }
          }
        ]
      );
    };

  const rides = route.params.filteredRides;
  // Filtering states (prefilled from route.params if available)
  const [origin] = useState(route?.params?.origin || '');
  const [destination] = useState(route?.params?.destination || '');
  const [originRadius, setOriginRadius] = useState(route?.params?.originRadius || 5);
  const [destinationRadius, setDestinationRadius] = useState(route?.params?.destinationRadius || 5);
  const [timeRangeHours, setTimeRangeHours] = useState(route?.params?.timeRangeHours || 0);
  const [timeRangeMinutes, setTimeRangeMinutes] = useState(route?.params?.timeRangeMinutes || 30);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filteredRides, setFilteredRides] = useState(rides);

  // Converts numeric degrees to radians
  function toRad(Value) 
  {
      return Value * Math.PI / 180;
  }

  function calcCrow(lat1, lon1, lat2, lon2) 
  {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
  }

  function metersToMiles(meters, miles){
    return meters / 1.609;
  }

  async function filterRides(){
    let filteredRides = [];
    const userSrc = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${origin}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const userDest = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${destination}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const userSrcInfo = await userSrc.json();
    const userDestInfo = await userDest.json();
    const userSrcLat = userSrcInfo.results[0].geometry.location.lat;
    const userSrcLng = userSrcInfo.results[0].geometry.location.lng;
    const userDestLat = userDestInfo.results[0].geometry.location.lat;
    const userDestLng = userDestInfo.results[0].geometry.location.lng;

    for(let ride of rides){
      try {
        let rideDepartureTime = new Date(ride.timeLeaving);
        const src = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${ride.origin}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const dest = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${ride.destination}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const srcinfo = await src.json();
        const destinfo = await dest.json();
        
        if (srcinfo.status === 'OK' && srcinfo.results.length > 0 && destinfo.status === 'OK' && destinfo.results.length > 0) {
          const srcLat = srcinfo.results[0].geometry.location.lat;
          const srcLng = srcinfo.results[0].geometry.location.lng;
          const destLat = destinfo.results[0].geometry.location.lat;
          const destLng = destinfo.results[0].geometry.location.lng;

          let originDist = metersToMiles(calcCrow(userSrcLat, userSrcLng, srcLat, srcLng));
          let destDist = metersToMiles(calcCrow(userDestLat, userDestLng, destLat, destLng));

          if(originDist < originRadius && destDist < destinationRadius){
            filteredRides.push(ride);
          }
        }
      } catch (error) {
        console.error('Address validation error:', error);
      }
    }
    return filteredRides;
  }

  if(!route.params.visited){
    filterRides().then((output) => {
      setFilteredRides(output);
    });
    route.params.visited = true;
  }

  useEffect(() =>{
    filterRides().then((output) => {
    setFilteredRides(output);
  });
  }, [originRadius, destinationRadius, timeRangeHours, timeRangeMinutes]);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Available Rides</Text>
        <TouchableOpacity style={styles.filterToggle} onPress={() => setFiltersVisible(v => !v)}>
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
              <View style={styles.rideCard}>
                <Text style={styles.rideText}>From: {item.origin}</Text>
                <Text style={styles.rideText}>To: {item.destination}</Text>
                <Text style={styles.rideText}>Time: {new Date(item.timeLeaving).toLocaleString("en-US", "America/Los_Angeles")}</Text>
                <Text style={styles.rideText}>Passengers: {item.passengers.length > 0 ? item.passengers.map((pass) => (pass.firstName + " " + pass.lastName)).join(", ") : "None"}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ViewProfile')}>
                  <Text style={styles.rideText}>Driver: {item.driver.firstName} {item.driver.lastName}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.joinButton} onPress={() => (handleJoin(item._id))}>
                  <Text style={styles.joinButtonText}>Join Ride</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#d5f7f7',
    padding: 5,
    borderRadius: 10,
  },
  joinButton: {
    backgroundColor: '#003f5c',
    padding: 10,
    borderRadius: 12,
    marginVertical: 8,
    width: '80%',
    maxWidth: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 400,
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