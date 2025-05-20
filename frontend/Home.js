import React from 'react';
import { styles } from './styles';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function HomePage({ navigation }) {
    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <>
            <Button
              onPress={() => navigation.navigate('Login')}
              title="Log In"
              color="#000"
              />
            <Button
              onPress={() => navigation.navigate('Signup')}
              title="Sign Up"
              color="#000"
            />
            </>
          ),
        });
      }, [navigation]);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Home Page!</Text>
        </View>
    );
}