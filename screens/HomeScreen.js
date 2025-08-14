// screens/HomeScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setItems(data);
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ItemDetails', { item })}
    >
      <Image
        source={{ uri: item.photos?.[0] }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.price}>{item.price.toFixed(3)} KWD</Text>
        <Text style={styles.condition}>Condition: {item.condition}</Text>
        <Text style={styles.listed}>Listed {timeAgo(item.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );

  function timeAgo(date) {
    const diff = Math.floor((new Date() - new Date(date)) / 1000 / 60 / 60 / 24);
    if (diff === 0) return 'today';
    if (diff === 1) return '1 day ago';
    return `${diff} days ago`;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.newListingButton}
        onPress={() => navigation.navigate('CreateListing')}
      >
        <Text style={styles.newListingText}>+ New Listing</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  list: { padding: 16 },
  card: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  image: { width: '100%', height: 200 },
  info: { padding: 12 },
  price: { fontSize: 18, fontWeight: 'bold' },
  condition: { fontSize: 14, color: '#555', marginTop: 4 },
  listed: { fontSize: 12, color: 'gray', marginTop: 4 },
  newListingButton: {
    backgroundColor: '#009688',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    margin: 16,
  },
  newListingText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});