import React from 'react';
import { Bot, Check } from 'lucide-react';

const Message = ({ message, isOwnMessage }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isAgentResponse = message.isAgentResponse;
  const isRead = message.read;

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isOwnMessage 
          ? 'bg-blue-500 text-white rounded-br-none' 
          : isAgentResponse
          ? 'bg-green-100 text-gray-800 rounded-bl-none border border-green-200'
          : 'bg-gray-200 text-gray-800 rounded-bl-none'
      }`}>
        <div className="flex items-center space-x-2 text-sm font-medium mb-1">
          {isAgentResponse && <Bot size={14} className="text-green-600" />}
          <span>{message.senderName}</span>
          {isAgentResponse && (
            <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
              AI Agent
            </span>
          )}
        </div>
        <div className="text-sm break-words">
          {message.content}
        </div>
        <div className={`flex items-center justify-between text-xs mt-1 ${
          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span>{formatTime(message.timestamp)}</span>
          {isOwnMessage && (
            <div className="flex items-center space-x-1">
              {isRead ? (
                <Check size={12} className="text-blue-200" />
              ) : (
                <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message; 