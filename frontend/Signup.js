import React, {useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import { styles } from './styles';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button} from 'react-native';

export default function SignupPage({ navigation }) {
  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const passwordInput = useRef(null);
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
  const handleSignup = () => {
    console.log('Signed Up!');
    console.log('Username:', username);
    console.log('Password:', password);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginWindow}>
        <Text style={styles.header}>Sign Up</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.inputField}
            onChangeText={onChangeUsername}
            value={username}
            placeholder="Username"
            keyboardType="default"
            returnKeyType='next'
            onSubmitEditing={() => passwordInput.current.focus()}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            ref={passwordInput}
            style={styles.inputField}
            onChangeText={onChangePassword}
            value={password}
            placeholder="Password"
            secureTextEntry={true}
            returnKeyType='done'
            onSubmitEditing={handleSignup}
          />
        </View>
        <Button title="Sign Up" onPress={handleSignup} />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}