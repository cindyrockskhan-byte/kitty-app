import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ProfileSetupScreen() {
  const [username, setUsername] = useState('');
  const navigation = useNavigation();

  const handleSave = () => {
    if (username.trim() === '') {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    // Here you'd normally save username to your DB
    Alert.alert('Profile setup complete', `Username: ${username}`);
    navigation.replace('Home'); // Navigate to Home screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your username</Text>
      <TextInput
        placeholder="Enter a username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#222',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});