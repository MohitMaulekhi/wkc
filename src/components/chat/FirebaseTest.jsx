import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/UseAuth';
import { chatService } from '../../services/chatService';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

const FirebaseTest = () => {
  const { currentUser } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setTestResults([]);
    
    const results = [];

    try {
      // Test 1: Firebase connection
      try {
        const conversationsRef = collection(db, 'conversations');
        await getDocs(conversationsRef);
        results.push({ test: 'Firebase Connection', status: 'PASS', message: 'Successfully connected to Firestore' });
      } catch (error) {
        results.push({ test: 'Firebase Connection', status: 'FAIL', message: error.message });
      }

      // Test 2: Authentication
      if (currentUser) {
        results.push({ test: 'User Authentication', status: 'PASS', message: `User: ${currentUser.email}` });
      } else {
        results.push({ test: 'User Authentication', status: 'FAIL', message: 'No authenticated user' });
      }

      // Test 3: Chat service
      try {
        if (currentUser) {
          const conversations = await chatService.getConversations(currentUser.uid, currentUser.role || 'buyer');
          results.push({ test: 'Chat Service', status: 'PASS', message: `Found ${conversations.length} conversations` });
          
          // Test 4: Message sending (create test conversation)
          try {
            const testMessageData = {
              senderId: currentUser.uid,
              senderName: currentUser.name || currentUser.email,
              recipientId: 'test-seller-id',
              content: 'Test message from Firebase test',
              timestamp: new Date().toISOString(),
              senderType: currentUser.role || 'buyer'
            };
            
            await chatService.sendMessage(testMessageData);
            results.push({ test: 'Message Sending', status: 'PASS', message: 'Successfully sent test message' });
          } catch (error) {
            results.push({ test: 'Message Sending', status: 'FAIL', message: error.message });
          }
        } else {
          results.push({ test: 'Chat Service', status: 'SKIP', message: 'Skipped - no authenticated user' });
          results.push({ test: 'Message Sending', status: 'SKIP', message: 'Skipped - no authenticated user' });
        }
      } catch (error) {
        results.push({ test: 'Chat Service', status: 'FAIL', message: error.message });
        results.push({ test: 'Message Sending', status: 'SKIP', message: 'Skipped due to chat service failure' });
      }

      // Test 5: Environment variables
      const aiApiUrl = import.meta.env.VITE_AI_API_URL;
      if (aiApiUrl) {
        results.push({ test: 'AI API URL', status: 'PASS', message: 'AI API URL configured' });
      } else {
        results.push({ test: 'AI API URL', status: 'WARN', message: 'AI API URL not configured' });
      }

    } catch (error) {
      results.push({ test: 'General Test', status: 'FAIL', message: error.message });
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Firebase Integration Test</h3>
      
      <button
        onClick={runTests}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 mb-4"
      >
        {loading ? 'Running Tests...' : 'Run Tests'}
      </button>

      {testResults.length > 0 && (
        <div className="space-y-2">
          {testResults.map((result, index) => (
            <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
              result.status === 'PASS' ? 'bg-green-100 text-green-800' :
              result.status === 'FAIL' ? 'bg-red-100 text-red-800' :
              result.status === 'WARN' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                result.status === 'PASS' ? 'bg-green-500' :
                result.status === 'FAIL' ? 'bg-red-500' :
                result.status === 'WARN' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`}></div>
              <div>
                <div className="font-medium">{result.test}</div>
                <div className="text-sm opacity-75">{result.message}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FirebaseTest; 