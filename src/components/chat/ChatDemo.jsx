import React, { useState } from 'react';
import { useAuth } from '../../context/UseAuth';
import ChatInterface from './ChatInterface';
import AgentModeIndicator from './AgentModeIndicator';
import FirebaseTest from './FirebaseTest';

const ChatDemo = () => {
  const { currentUser } = useAuth();
  const [showChat, setShowChat] = useState(false);

  if (!currentUser) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Please log in to access chat</h2>
        <p className="text-gray-600">The chat feature requires authentication.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Chat Demo</h1>
          <p className="text-gray-600">
            Welcome, {currentUser.name || currentUser.email}! 
            Your role: {currentUser.role || 'buyer'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Chat Feature Status</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Chat components loaded successfully</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Authentication context available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Firebase real-time chat configured</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Agent mode available for sellers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>AI recommendations ready (requires VITE_AI_API_URL)</span>
            </div>
          </div>
        </div>

        {/* Agent Mode Controls - Only for sellers */}
        {currentUser?.role === 'seller' && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Agent Mode Controls</h3>
            <AgentModeIndicator />
            <p className="text-sm text-gray-600 mt-3">
              When agent mode is enabled, AI will automatically respond to customer messages.
            </p>
          </div>
        )}

        {/* Firebase Test */}
        <div className="mb-6">
          <FirebaseTest />
        </div>

        <button
          onClick={() => setShowChat(!showChat)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors mb-6"
        >
          {showChat ? 'Hide Chat Interface' : 'Show Chat Interface'}
        </button>

        {showChat && (
          <div className="h-[600px]">
            <ChatInterface />
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">How to Use</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p><strong>For Buyers:</strong> Navigate to /walmart/chat to start conversations with sellers</p>
            <p><strong>For Sellers:</strong> Navigate to /seller/chat to respond to customer inquiries with AI assistance</p>
            <p><strong>AI Features:</strong> Sellers can click the sparkles icon to get response suggestions</p>
            <p><strong>Mobile:</strong> The interface is fully responsive and works on all devices</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDemo; 