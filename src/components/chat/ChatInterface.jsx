import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MessageCircle, Bot, Loader2, RefreshCw } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/UseAuth';
import ConversationList from './ConversationList';
import Message from './Message';
import MessageInput from './MessageInput';

const ChatInterface = () => {
  const { currentUser } = useAuth();
  const {
    conversations,
    currentConversation,
    messages,
    loading,
    agentMode,
    isTyping,
    loadChatHistory,
    sendMessage,
    markAsRead,
    clearCurrentConversation,
    toggleAgentMode,
    refreshConversations
  } = useChat();

  const [showConversationList, setShowConversationList] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when conversation is active
  useEffect(() => {
    if (currentConversation?.id) {
      markAsRead(currentConversation.id);
    }
  }, [currentConversation, markAsRead]);

  const handleSelectConversation = async (buyerId, sellerId) => {
    await loadChatHistory(buyerId, sellerId);
    setShowConversationList(false);
  };

  const handleSendMessage = async (content, recipientId) => {
    await sendMessage(content, recipientId);
  };

  const getOtherParticipantName = () => {
    if (!currentConversation) return '';
    
    if (currentUser?.role === 'seller') {
      return currentConversation.buyerName || 'Customer';
    } else {
      return currentConversation.sellerName || 'Seller';
    }
  };

  const getRecipientId = () => {
    if (!currentConversation) return '';
    
    if (currentUser?.role === 'seller') {
      return currentConversation.buyerId;
    } else {
      return currentConversation.sellerId;
    }
  };

  return (
    <div className="flex h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Conversation List - Mobile */}
      <div className={`lg:hidden absolute inset-0 z-10 bg-white ${
        showConversationList ? 'block' : 'hidden'
      }`}>
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Messages</h2>
          <button
            onClick={refreshConversations}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh conversations"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        <ConversationList
          conversations={conversations}
          currentConversation={currentConversation}
          onSelectConversation={handleSelectConversation}
          loading={loading}
        />
      </div>

      {/* Conversation List - Desktop */}
      <div className="hidden lg:block w-80 border-r border-gray-200">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Messages</h2>
          <button
            onClick={refreshConversations}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh conversations"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        <ConversationList
          conversations={conversations}
          currentConversation={currentConversation}
          onSelectConversation={handleSelectConversation}
          loading={loading}
        />
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${
        showConversationList ? 'hidden lg:flex' : 'flex'
      }`}>
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowConversationList(true)}
                    className="lg:hidden p-1 hover:bg-gray-200 rounded"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {getOtherParticipantName().charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium">{getOtherParticipantName()}</h3>
                    <p className="text-sm text-gray-500">
                      {currentUser?.role === 'seller' ? 'Customer' : 'Seller'}
                    </p>
                  </div>
                </div>
                
                {/* Agent Mode Toggle - Only for sellers */}
                {currentUser?.role === 'seller' && (
                  <button
                    onClick={toggleAgentMode}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      agentMode
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    <Bot size={16} />
                    <span>{agentMode ? 'Agent Active' : 'Agent Mode'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <MessageCircle size={48} className="mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <Message
                      key={message.id || message.timestamp}
                      message={message}
                      isOwnMessage={message.senderId === currentUser?.uid}
                    />
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <Loader2 size={16} className="animate-spin text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {currentUser?.name || currentUser?.email} is typing...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <MessageInput
              recipientId={getRecipientId()}
              onSendMessage={handleSendMessage}
            />
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
              <p className="text-sm">Choose a conversation from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface; 