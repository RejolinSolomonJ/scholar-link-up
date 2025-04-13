
import { useState, useEffect } from 'react';
import { 
  getConversations, 
  getMessages, 
  sendMessage, 
  markMessagesAsRead, 
  subscribeToMessages 
} from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Conversation, Message } from '@/types/database.types';
import { toast } from 'sonner';

export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');

  // Fetch all conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const data = await getConversations(user.id);
        setConversations(data);
        
        // Select the first conversation by default if there is one
        if (data.length > 0 && !selectedConversationId) {
          setSelectedConversationId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast.error('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user?.id]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversationId || !user?.id) return;
      
      try {
        const data = await getMessages(selectedConversationId);
        setMessages(data);
        
        // Mark messages as read
        await markMessagesAsRead(selectedConversationId, user.id);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      }
    };

    fetchMessages();
  }, [selectedConversationId, user?.id]);

  // Subscribe to new messages
  useEffect(() => {
    if (!selectedConversationId) return;
    
    const subscription = subscribeToMessages(selectedConversationId, (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      
      // If the message is meant for the current user, mark it as read
      if (newMessage.recipient_id === user?.id) {
        markMessagesAsRead(selectedConversationId, user.id);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [selectedConversationId, user?.id]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId || !user?.id) return;
    
    try {
      const conversation = conversations.find(c => c.id === selectedConversationId);
      if (!conversation) return;
      
      const recipientId = conversation.student_id === user.id ? 
        conversation.tutor_id : conversation.student_id;
      
      await sendMessage({
        conversation_id: selectedConversationId,
        sender_id: user.id,
        recipient_id: recipientId,
        content: newMessage,
      });
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const selectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  return {
    conversations,
    selectedConversationId,
    messages,
    loading,
    newMessage,
    setNewMessage,
    handleSendMessage,
    selectConversation,
  };
};
