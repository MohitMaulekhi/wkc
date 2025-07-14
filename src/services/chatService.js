import {
    collection,
    doc,
    addDoc,
    updateDoc,
    setDoc,
    getDocs,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

const AI_API_URL = import.meta.env.VITE_AI_API_URL;

export const chatService = {
    // Get chat history between buyer and seller using Firebase
    async getChatHistory(buyerId, sellerId) {
        try {
            const conversationId = this.getConversationId(buyerId, sellerId);
            const messagesRef = collection(db, 'conversations', conversationId, 'messages');
            const q = query(messagesRef, orderBy('timestamp', 'asc'));

            const querySnapshot = await getDocs(q);
            const messages = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp
            }));

            return { messages, conversation: { id: conversationId, buyerId, sellerId } };
        } catch (error) {
            console.error('Error fetching chat history:', error);
            // Return empty messages if conversation doesn't exist yet
            return { messages: [], conversation: { id: this.getConversationId(buyerId, sellerId), buyerId, sellerId } };
        }
    },

    // Listen to real-time messages
    subscribeToMessages(buyerId, sellerId, callback) {
        const conversationId = this.getConversationId(buyerId, sellerId);
        const messagesRef = collection(db, 'conversations', conversationId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp
            }));
            callback(messages);
        });
    },

    // Send a message using Firebase
    async sendMessage(messageData) {
        try {
            const conversationId = this.getConversationId(messageData.senderId, messageData.recipientId);

            // Add message to Firestore
            const messageRef = collection(db, 'conversations', conversationId, 'messages');
            const messageDoc = await addDoc(messageRef, {
                ...messageData,
                timestamp: serverTimestamp(),
                read: false
            });

            // Update conversation metadata (create if doesn't exist)
            const conversationRef = doc(db, 'conversations', conversationId);
            await setDoc(conversationRef, {
                buyerId: messageData.senderType === 'buyer' ? messageData.senderId : messageData.recipientId,
                sellerId: messageData.senderType === 'seller' ? messageData.senderId : messageData.recipientId,
                buyerName: messageData.senderType === 'buyer' ? messageData.senderName : 'Customer',
                sellerName: messageData.senderType === 'seller' ? messageData.senderName : 'Seller',
                lastMessage: messageData.content,
                lastMessageTime: serverTimestamp(),
                lastMessageSender: messageData.senderId,
                updatedAt: serverTimestamp(),
                createdAt: serverTimestamp()
            }, { merge: true });

            return { message: { id: messageDoc.id, ...messageData } };
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    // Get AI recommendations for seller responses
    async getRecommendations(message, context) {
        try {
            const response = await fetch(`${AI_API_URL}/api/recommendations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    context,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting AI recommendations:', error);
            throw error;
        }
    },

    // Get all conversations for a user using Firebase
    async getConversations(userId, userType) {
        try {
            const conversationsRef = collection(db, 'conversations');
            const q = query(
                conversationsRef,
                where(userType === 'seller' ? 'sellerId' : 'buyerId', '==', userId),
                orderBy('updatedAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const conversations = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                lastMessageTime: doc.data().lastMessageTime?.toDate?.() || doc.data().lastMessageTime
            }));

            return conversations;
        } catch (error) {
            console.error('Error fetching conversations:', error);
            throw error;
        }
    },

    // Listen to real-time conversations
    subscribeToConversations(userId, userType, callback) {
        const conversationsRef = collection(db, 'conversations');
        const q = query(
            conversationsRef,
            where(userType === 'seller' ? 'sellerId' : 'buyerId', '==', userId),
            orderBy('updatedAt', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const conversations = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                lastMessageTime: doc.data().lastMessageTime?.toDate?.() || doc.data().lastMessageTime
            }));
            callback(conversations);
        });
    },

    // Mark messages as read using Firebase
    async markAsRead(conversationId, userId) {
        try {
            const messagesRef = collection(db, 'conversations', conversationId, 'messages');
            const q = query(
                messagesRef,
                where('senderId', '!=', userId),
                where('read', '==', false)
            );

            const querySnapshot = await getDocs(q);
            const updatePromises = querySnapshot.docs.map(doc =>
                updateDoc(doc.ref, { read: true })
            );

            await Promise.all(updatePromises);
            return { success: true };
        } catch (error) {
            console.error('Error marking messages as read:', error);
            throw error;
        }
    },

    // Create or get conversation ID
    getConversationId(buyerId, sellerId) {
        // Create a consistent conversation ID regardless of who initiates
        const ids = [buyerId, sellerId].sort();
        return `${ids[0]}_${ids[1]}`;
    },

    // Initialize conversation in Firestore
    async initializeConversation(buyerId, sellerId, buyerName, sellerName) {
        try {
            const conversationId = this.getConversationId(buyerId, sellerId);
            const conversationRef = doc(db, 'conversations', conversationId);

            await setDoc(conversationRef, {
                buyerId,
                sellerId,
                buyerName,
                sellerName,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }, { merge: true });

            return conversationId;
        } catch (error) {
            console.error('Error initializing conversation:', error);
            throw error;
        }
    }
}; 