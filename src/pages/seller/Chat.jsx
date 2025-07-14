import React from 'react';
import { MessageCircle, Sparkles, Bot, RefreshCw } from 'lucide-react';
import ChatInterface from '../../components/chat/ChatInterface';
import { useChat } from '../../context/ChatContext';

const Chat = () => {
  const { refreshConversations, loading } = useChat();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Support</h1>
              <p className="text-gray-600">Chat with customers and get AI-powered response suggestions</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-blue-600">
                <Sparkles size={20} />
                <span className="text-sm font-medium">AI Powered</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <Bot size={20} />
                <span className="text-sm font-medium">Agent Mode Available</span>
              </div>
              <button
                onClick={refreshConversations}
                disabled={loading}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                title="Refresh conversations"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        <div className="h-[calc(100vh-200px)]">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Chat; 