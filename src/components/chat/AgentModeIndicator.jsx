import React from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const AgentModeIndicator = () => {
  const { agentMode, isTyping, toggleAgentMode } = useChat();

  return (
    <div className="flex items-center space-x-4">
      {/* Agent Mode Status */}
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
        agentMode
          ? 'bg-green-100 text-green-700 border border-green-200'
          : 'bg-gray-100 text-gray-500 border border-gray-200'
      }`}>
        <Bot size={16} />
        <span>{agentMode ? 'Agent Active' : 'Agent Inactive'}</span>
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
          <Loader2 size={16} className="animate-spin" />
          <span>AI is responding...</span>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleAgentMode}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          agentMode
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
      >
        {agentMode ? 'Disable Agent' : 'Enable Agent'}
      </button>
    </div>
  );
};

export default AgentModeIndicator; 