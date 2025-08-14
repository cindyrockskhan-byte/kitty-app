import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { uploadToCloudinary } from '../lib/cloudinary';
import { useRoute } from '@react-navigation/native';
import CameraInput from '../components/CameraInput';

export default function ReturnCenterScreen() {
  const route = useRoute();
  const itemId = route?.params?.itemId;

  const [userId, setUserId] = useState(null);
  const [item, setItem] = useState(null);
  const [returnStatus, setReturnStatus] = useState(null);
  const [role, setRole] = useState(null); // 'buyer' or 'seller'
  const [loading, setLoading] = useState(true);

  const [returnReason, setReturnReason] = useState('');
  const [returnMediaUri, setReturnMediaUri] = useState(null);

  const [tamperReason, setTamperReason] = useState('');
  const [tamperMediaUri, setTamperMediaUri] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user.id);

    const { data: itemData } = await supabase
      .from('items')
      .select('*')
      .eq('id', itemId)
      .single();

    setItem(itemData);
    setRole(user.id === itemData.buyer_id ? 'buyer' : 'seller');

    const { data: status } = await supabase
      .from('returns')
      .select('*')
      .eq('item_id', itemId)
      .single();

    setReturnStatus(status);
    setLoading(false);
  }

  async function submitReturnRequest() {
    if (!returnReason || !returnMediaUri) {
      return Alert.alert('Missing info', 'Both reason and video are required.');
    }

    const mediaUrl = await uploadToCloudinary({ uri: returnMediaUri, type: 'video' });

    const { error } = await supabase.from('returns').insert({
      item_id: itemId,
      buyer_id: userId,
      reason: returnReason,
      media_url: mediaUrl,
      status: 'pending_admin',
    });

    if (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit return.');
    } else {
      Alert.alert('Submitted', 'Return request sent.');
      loadInitialData();
    }
  }

  async function submitTamperingDispute() {
    if (!tamperReason || !tamperMediaUri) {
      return Alert.alert('Missing info', 'Both reason and video are required.');
    }

    const mediaUrl = await uploadToCloudinary({ uri: tamperMediaUri, type: 'video' });

    const { error } = await supabase
      .from('tampering_reports')
      .insert({
        item_id: itemId,
        seller_id: userId,
        reason: tamperReason,
        media_url: mediaUrl,
      });

    if (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit tampering report.');
    } else {
      Alert.alert('Submitted', 'Tampering report sent to admin.');
      loadInitialData();
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {role === 'buyer' && !returnStatus && (
        <>
          <Text style={styles.header}>Request Return</Text>
          <TextInput
            placeholder="Enter reason"
            value={returnReason}
            onChangeText={setReturnReason}
            style={styles.input}
          />
          <CameraInput onMediaCaptured={setReturnMediaUri} />
          <TouchableOpacity onPress={submitReturnRequest} style={styles.button}>
            <Text style={styles.buttonText}>Submit Return</Text>
          </TouchableOpacity>
        </>
      )}

      {role === 'seller' && returnStatus?.status === 'returned_to_seller' && (
        <>
          <Text style={styles.header}>Dispute Tampering</Text>
          <TextInput
            placeholder="Enter reason"
            value={tamperReason}
            onChangeText={setTamperReason}
            style={styles.input}
          />
          <CameraInput onMediaCaptured={setTamperMediaUri} />
          <TouchableOpacity onPress={submitTamperingDispute} style={styles.button}>
            <Text style={styles.buttonText}>Submit Dispute</Text>
          </TouchableOpacity>
        </>
      )}

      {!role && (
        <Text style={{ textAlign: 'center', marginTop: 50 }}>
          Return center not available.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});