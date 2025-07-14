import React from 'react';
import { MessageCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/UseAuth';

const ConversationList = ({ conversations, currentConversation, onSelectConversation, loading }) => {
  const { currentUser } = useAuth();

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getOtherParticipantName = (conversation) => {
    if (currentUser?.role === 'seller') {
      return conversation.buyerName || 'Customer';
    } else {
      return conversation.sellerName || 'Seller';
    }
  };

  const getOtherParticipantId = (conversation) => {
    if (currentUser?.role === 'seller') {
      return conversation.buyerId;
    } else {
      return conversation.sellerId;
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium mb-2">No conversations yet</p>
        <p className="text-sm">Start a conversation to begin chatting</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => {
        const isActive = currentConversation?.id === conversation.id;
        const otherParticipantId = getOtherParticipantId(conversation);
        
        return (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.buyerId, conversation.sellerId)}
            className={`p-4 cursor-pointer transition-colors ${
              isActive 
                ? 'bg-blue-50 border-r-2 border-blue-500' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  {getOtherParticipantName(conversation).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {getOtherParticipantName(conversation)}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock size={12} />
                      <span>{formatLastMessageTime(conversation.lastMessageTime)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {conversation.lastMessage || 'No messages yet'}
                  </p>
                </div>
              </div>
              
              {/* Unread count badge */}
              {conversation.unreadCount > 0 && (
                <div className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList; 