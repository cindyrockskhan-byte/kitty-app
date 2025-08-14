import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import { uploadToCloudinary } from '../utils/cloudinaryUploads'; // We'll create this next
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ReturnRequestScreen() {
  const [reason, setReason] = useState('');
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const { itemId, buyerId, sellerId } = route.params;

  const pickMedia = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 0.6,
      videoMaxDuration: 15,
    });

    if (!result.canceled) {
      setMedia(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!media) {
      Alert.alert('Please add photo or video proof');
      return;
    }

    setLoading(true);

    try {
      const mediaUrl = await uploadToCloudinary(media);

      const { error } = await supabase.from('returns').insert({
        item_id: itemId,
        buyer_id: buyerId,
        seller_id: sellerId,
        return_requested_at: new Date().toISOString(),
        return_reason: reason,
        return_media_url: mediaUrl,
      });

      if (error) throw error;

      Alert.alert('Return request submitted.');
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Error submitting return');
    }

    setLoading(false);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Why do you want to return this item?</Text>
      <TextInput
        placeholder="(Optional)"
        value={reason}
        onChangeText={setReason}
        multiline
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 8,
          height: 100,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={pickMedia}
        style={{
          backgroundColor: '#eee',
          padding: 12,
          borderRadius: 8,
          marginBottom: 20,
          alignItems: 'center',
        }}
      >
        <Text>{media ? 'Media selected ✅' : 'Add Photo or Video'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#aaa' : '#000',
          padding: 14,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff' }}>Submit Return</Text>}
      </TouchableOpacity>
    </View>
  );
}