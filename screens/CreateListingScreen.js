// screens/CreateListingScreen.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CreateListingScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Listing</Text>
      return (
  <View style={styles.container}>
    <Text style={styles.heading}>Create Listing</Text>

    <TouchableOpacity
      onPress={() => navigation.navigate('CameraTest')}
      style={{ padding: 20, backgroundColor: '#ccc', marginTop: 20, borderRadius: 10 }}
    >
      <Text style={{ fontSize: 16 }}>Test Camera</Text>
    </TouchableOpacity>
  </View>
);

      {/* TEMPORARY: Camera Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Camera')}
      >
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>

      {/* Add your real listing form below this */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#0a84ff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});