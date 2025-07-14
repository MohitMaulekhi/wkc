import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/UseAuth';

const MessageInput = ({ recipientId, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const { getRecommendations } = useChat();
  const textareaRef = useRef(null);

  const isSeller = currentUser?.role === 'seller';

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      await onSendMessage(message.trim(), recipientId);
      setMessage('');
      setRecommendations([]);
      setShowRecommendations(false);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleGetRecommendations = async () => {
    if (!message.trim() || !isSeller) return;

    setIsLoading(true);
    try {
      const data = await getRecommendations(message, {
        userType: 'seller',
        conversationContext: 'customer_support'
      });
      setRecommendations(data.recommendations || []);
      setShowRecommendations(true);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const useRecommendation = (recommendation) => {
    setMessage(recommendation);
    setShowRecommendations(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="border-t bg-white p-4">
      {/* AI Recommendations */}
      {isSeller && showRecommendations && recommendations.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium text-blue-800 mb-2">
            AI Suggestions:
          </div>
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <button
                key={index}
                onClick={() => useRecommendation(rec)}
                className="block w-full text-left p-2 text-sm bg-white border border-blue-200 rounded hover:bg-blue-50 transition-colors"
              >
                {rec}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="1"
            maxLength="500"
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {message.length}/500
          </div>
        </div>

        {/* AI Recommendations Button (for sellers) */}
        {isSeller && message.trim() && (
          <button
            onClick={handleGetRecommendations}
            disabled={isLoading}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            title="Get AI suggestions"
          >
            <Sparkles size={20} />
          </button>
        )}

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput; 