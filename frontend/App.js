import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
//import FirstPage from './screens/FirstPage';
import Login from './screens/Login';
import Signup from './screens/Signup.js';
import HomeScreen from './screens/HomeScreen';
import ShareRide from './screens/ShareRide';
import FindRide from './screens/FindRide';
import ViewRides from './screens/ViewRides';
import ViewProfile from './screens/ViewProfile';
import EditProfile from './screens/EditProfile.js';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
{/* <Stack.Screen name="FirstPage" component={FirstPage} options={{ title: 'Welcome' }} /> */}
<Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ShareRide" component={ShareRide} />
      <Stack.Screen name="FindRide" component={FindRide} />
      <Stack.Screen name="ViewRides" component={ViewRides} />
      <Stack.Screen name="ViewProfile" component={ViewProfile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />

    </Stack.Navigator>
    </NavigationContainer>
  );
}