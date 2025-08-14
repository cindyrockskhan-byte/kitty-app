import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabaseClient';

export default function InboxScreen() {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  async function fetchConversations() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id,
        last_message,
        updated_at,
        buyer:buyer_id ( id, username ),
        seller:seller_id ( id, username )
      `)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
    } else {
      setChats(data);
    }

    setLoading(false);
  }

  function renderItem({ item }) {
    const { buyer, seller, last_message } = item;
    const user = supabase.auth.getUserSync().user;
    const otherUser = user.id === buyer.id ? seller : buyer;
    const name = otherUser.username || `User${otherUser.id.slice(0, 4)}`;

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigation.navigate('Chat', { conversationId: item.id })}
      >
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.preview} numberOfLines={1}>
          {last_message || 'No messages yet'}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="gray" />
      ) : chats.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 50 }}>No conversations yet.</Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  name: { fontWeight: 'bold', fontSize: 16 },
  preview: { color: '#666', marginTop: 4 }
});