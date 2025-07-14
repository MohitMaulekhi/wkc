import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { chatService } from '../services/chatService';
import { useAuth } from './UseAuth';
import toast from 'react-hot-toast';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [agentMode, setAgentMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Refs for cleanup
  const conversationsUnsubscribe = useRef(null);
  const messagesUnsubscribe = useRef(null);

  // Load conversations when user changes
  useEffect(() => {
    if (currentUser) {
      loadConversations();
      subscribeToConversations();
    }
    
    return () => {
      if (conversationsUnsubscribe.current) {
        conversationsUnsubscribe.current();
      }
    };
  }, [currentUser]);

  // Subscribe to real-time conversations
  const subscribeToConversations = () => {
    if (!currentUser) return;
    
    const userType = currentUser.role || 'buyer';
    conversationsUnsubscribe.current = chatService.subscribeToConversations(
      currentUser.uid,
      userType,
      (conversations) => {
        setConversations(conversations);
      }
    );
  };

  // Subscribe to real-time messages when conversation changes
  useEffect(() => {
    if (currentConversation && currentUser) {
      subscribeToMessages();
    }
    
    return () => {
      if (messagesUnsubscribe.current) {
        messagesUnsubscribe.current();
      }
    };
  }, [currentConversation]);

  const subscribeToMessages = () => {
    if (!currentConversation) return;
    
    messagesUnsubscribe.current = chatService.subscribeToMessages(
      currentConversation.buyerId,
      currentConversation.sellerId,
      (messages) => {
        setMessages(messages);
      }
    );
  };

  // Load conversations for the current user
  const loadConversations = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const userType = currentUser.role || 'buyer';
      const data = await chatService.getConversations(currentUser.uid, userType);
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  // Refresh conversations manually
  const refreshConversations = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const userType = currentUser.role || 'buyer';
      const data = await chatService.getConversations(currentUser.uid, userType);
      setConversations(data);
      toast.success('Conversations refreshed');
    } catch (error) {
      console.error('Error refreshing conversations:', error);
      toast.error('Failed to refresh conversations');
    } finally {
      setLoading(false);
    }
  };

  // Load chat history for a specific conversation
  const loadChatHistory = async (buyerId, sellerId) => {
    setLoading(true);
    try {
      const data = await chatService.getChatHistory(buyerId, sellerId);
      setMessages(data.messages || []);
      setCurrentConversation({
        buyerId,
        sellerId,
        ...data.conversation
      });
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast.error('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (content, recipientId) => {
    if (!currentUser) return;

    const messageData = {
      senderId: currentUser.uid,
      senderName: currentUser.name || currentUser.email,
      recipientId,
      content,
      timestamp: new Date().toISOString(),
      senderType: currentUser.role || 'buyer'
    };

    try {
      await chatService.sendMessage(messageData);
      
      // If in agent mode and user is a seller, auto-generate response
      if (agentMode && currentUser.role === 'seller') {
        await generateAgentResponse(content, recipientId);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  };

  // Generate agent response
  const generateAgentResponse = async (customerMessage, customerId) => {
    setIsTyping(true);
    try {
      const response = await chatService.getRecommendations(customerMessage, {
        userType: 'seller',
        conversationContext: 'customer_support',
        agentMode: true
      });
      
      if (response.recommendations && response.recommendations.length > 0) {
        // Use the first recommendation as auto-response
        const autoResponse = response.recommendations[0];
        
        setTimeout(async () => {
          const agentMessageData = {
            senderId: currentUser.uid,
            senderName: `${currentUser.name || currentUser.email} (AI Agent)`,
            recipientId: customerId,
            content: autoResponse,
            timestamp: new Date().toISOString(),
            senderType: 'seller',
            isAgentResponse: true
          };
          
          await chatService.sendMessage(agentMessageData);
          setIsTyping(false);
        }, 2000); // 2 second delay to simulate typing
      } else {
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error generating agent response:', error);
      setIsTyping(false);
    }
  };

  // Get AI recommendations for seller responses
  const getRecommendations = async (message, context = {}) => {
    try {
      const data = await chatService.getRecommendations(message, context);
      setRecommendations(data.recommendations || []);
      return data;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast.error('Failed to get recommendations');
      return { recommendations: [] };
    }
  };

  // Mark messages as read
  const markAsRead = async (conversationId) => {
    if (!currentUser) return;

    try {
      await chatService.markAsRead(conversationId, currentUser.uid);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Clear current conversation
  const clearCurrentConversation = () => {
    setCurrentConversation(null);
    setMessages([]);
    setRecommendations([]);
  };

  // Toggle agent mode
  const toggleAgentMode = () => {
    setAgentMode(!agentMode);
    if (!agentMode) {
      toast.success('Agent mode enabled - AI will auto-respond to customer messages');
    } else {
      toast.success('Agent mode disabled - Manual responses only');
    }
  };

  const value = {
    conversations,
    currentConversation,
    messages,
    loading,
    recommendations,
    agentMode,
    isTyping,
    loadConversations,
    loadChatHistory,
    sendMessage,
    getRecommendations,
    markAsRead,
    clearCurrentConversation,
    toggleAgentMode,
    refreshConversations
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}; 