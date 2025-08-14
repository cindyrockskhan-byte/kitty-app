import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();

  // Auto-skip to profile setup (or home) after 1 second
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('ProfileSetup');
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fake Login Bypass Active</Text>
      <Text style={styles.info}>You’ll be redirected shortly...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold' },
  info: { fontSize: 16, color: 'gray', marginTop: 10 },
});