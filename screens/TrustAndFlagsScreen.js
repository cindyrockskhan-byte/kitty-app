import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../lib/supabaseClient';

export default function TrustAndFlagsScreen({ route }) {
  const [trustScore, setTrustScore] = useState(null);
  const [reason, setReason] = useState('');
  const [targetUserId, setTargetUserId] = useState(route?.params?.targetUserId || '');

  useEffect(() => {
    fetchTrustScore();
  }, []);

  async function fetchTrustScore() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('users')
      .select('trust_score')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      setTrustScore(data.trust_score);
    }
  }

  async function submitFlag() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!targetUserId || !reason.trim()) {
      return Alert.alert('Missing Info', 'Please enter both user ID and reason.');
    }

    const { error } = await supabase.from('flags').insert({
      flagged_by: user.id,
      flagged_user: targetUserId,
      reason
    });

    if (error) {
      console.error('Flag error:', error);
      Alert.alert('Error', 'Could not submit flag.');
    } else {
      Alert.alert('Flag Submitted', 'Thank you for reporting. Admin will review.');
      setReason('');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Your Trust Score: {trustScore ?? '...'}/100</Text>

      <Text style={styles.label}>Flag a User</Text>
      <TextInput
        style={styles.input}
        value={targetUserId}
        onChangeText={setTargetUserId}
        placeholder="User ID to report"
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        value={reason}
        onChangeText={setReason}
        multiline
        placeholder="Describe dishonest behavior..."
      />

      <TouchableOpacity onPress={submitFlag} style={styles.button}>
        <Text style={styles.buttonText}>Submit Flag</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  score: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 5,
    borderRadius: 6
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});