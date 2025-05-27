import React, {useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button} from 'react-native';

export default function Login() {
  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');
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
  const passwordInput = useRef(null);
  const handleLogin = () => {
    console.log('Username:', username);
    console.log('Password:', password);
    passed = verifyPassword(username, password);
    if (passed) {
      console.log('Login successful');
    } else {
      console.log('Login failed');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginWindow}>
        <Text style={styles.header}>Login</Text>
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
            onSubmitEditing={handleLogin}
          />
        </View>
        <Button style={styles.button} title="Log In" onPress={handleLogin} />
        <Button style={styles.button} title="Sign Up" onPress={() => navigation.navigate('Signup')} />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

verifyPassword = (username, password) => {
  if (username === 'test' && password === 'password') {
    return true;
  }
  return false;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loginWindow: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    marginBottom: 4,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    width: '100%',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  }
});