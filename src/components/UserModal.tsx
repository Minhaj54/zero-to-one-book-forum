import React, { useState } from 'react';
import { useForumStore } from '../store/useForumStore';

export function UserModal() {
  const [username, setUsername] = useState('');
  const setCurrentUser = useForumStore((state) => state.setCurrentUser);
  const currentUser = useForumStore((state) => state.currentUser);

  if (currentUser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Welcome to Zero to One Forum</h2>
        <p className="mb-4 text-gray-600">Please enter your name to continue</p>
        
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-2 border rounded-lg mb-4"
          maxLength={30}
        />
        
        <button
          onClick={() => username.trim() && setCurrentUser(username.trim())}
          disabled={!username.trim()}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}