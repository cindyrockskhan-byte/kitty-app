// screens/ItemDetailsScreen.js

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ItemDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;

  const handleChat = () => {
    navigation.navigate('Chat', {
      item,
      otherUserId: item.seller_id, // Make sure this is present in your item object
    });
  };

  const handleBuy = () => {
    Alert.alert('Buy Now', 'This will initiate the purchase process.');
  };

  const handleReport = () => {
    Alert.alert('Report', 'This will report the item/seller to the admin.');
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: item.photos?.[0] }} style={styles.image} />

      <View style={styles.details}>
        <Text style={styles.price}>{item.price.toFixed(3)} KWD</Text>
        <Text style={styles.condition}>Condition: {item.condition}</Text>
        {item.description ? (
          <Text style={styles.description}>{item.description}</Text>
        ) : null}
        <Text style={styles.trustScore}>
          Seller Trust: {item.seller_trust || 'N/A'}/100
        </Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
          <Text style={styles.buttonText}>Chat with Seller</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
          <Text style={styles.reportText}>Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ItemDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 300, resizeMode: 'cover' },
  details: { padding: 16 },
  price: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  condition: { fontSize: 16, marginBottom: 8 },
  description: { fontSize: 16, marginBottom: 12 },
  trustScore: { fontSize: 14, color: 'gray' },
  buttons: { paddingHorizontal: 16, paddingBottom: 30 },
  chatButton: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#009688',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  reportButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  reportText: { color: 'red', fontSize: 14 },
});