import React, { useState } from 'react';
import { MessageCircle, Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/UseAuth';
import ChatInterface from '../../components/chat/ChatInterface';
import { chatService } from '../../services/chatService';
import { useChat } from '../../context/ChatContext';
import toast from 'react-hot-toast';

const Chat = () => {
  const { currentUser } = useAuth();
  const { refreshConversations, loading: chatLoading } = useChat();
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [sellerId, setSellerId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStartNewChat = async () => {
    if (!sellerId.trim()) {
      toast.error('Please enter a seller ID');
      return;
    }

    setLoading(true);
    try {
      // Send initial message (this will create the conversation automatically)
      const messageData = {
        senderId: currentUser.uid,
        senderName: currentUser.name || currentUser.email,
        recipientId: sellerId,
        content: 'Hello! I would like to start a conversation.',
        timestamp: new Date().toISOString(),
        senderType: 'buyer'
      };

      await chatService.sendMessage(messageData);
      toast.success('Conversation started!');
      setShowNewChatModal(false);
      setSellerId('');
      
      // The conversation will appear in the list automatically via real-time subscription
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to start conversation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600">Chat with sellers about products and orders</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={refreshConversations}
                disabled={chatLoading}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
                title="Refresh conversations"
              >
                <RefreshCw size={16} className={chatLoading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus size={20} />
                <span>New Chat</span>
              </button>
            </div>
          </div>
        </div>

        <div className="h-[calc(100vh-200px)]">
          <ChatInterface />
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Start New Conversation</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seller ID
              </label>
              <input
                type="text"
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
                placeholder="Enter seller ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowNewChatModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStartNewChat}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Starting...' : 'Start Chat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat; 