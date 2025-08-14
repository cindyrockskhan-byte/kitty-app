import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabaseClient';

export default function MyListingsScreen() {
  const navigation = useNavigation();
  const [listings, setListings] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyListings();
  }, []);

  async function loadMyListings() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user.id);

    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load listings.');
    } else {
      setListings(data);
    }

    setLoading(false);
  }

  const renderItem = ({ item }) => {
    const showDisputeButton =
      item.return_status === 'returned_to_seller';

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.photo_url }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>{item.price.toFixed(3)} KWD</Text>
          {showDisputeButton && (
            <TouchableOpacity
              style={styles.disputeButton}
              onPress={() => navigation.navigate('ReturnCenter', { itemId: item.id })}
            >
              <Text style={styles.disputeText}>Dispute Tampering</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  return (
    <FlatList
      data={listings}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: { width: 100, height: 100 },
  details: { flex: 1, padding: 10 },
  title: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 14, marginVertical: 4 },
  disputeButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
    alignItems: 'center',
  },
  disputeText: { color: 'white', fontWeight: 'bold' },
});