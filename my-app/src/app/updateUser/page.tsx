"use client"
import { useState, FormEvent } from 'react';


/* THIS IS A ADMIN PAGE USED TO GIVE USERS DISPLAYNAMES IN FIREBASE */
/* Om ngn har tid och orkar: Fixa så att bara vi i webbgruppen kan accessa denna sidan */
const UpdateUser = () => {
  const [uid, setUid] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/updateDisplayName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, displayName }),
      });
  
      if (!response.ok) {
        console.error("HTTP error", response.status);
        alert('Failed to update user: ' + response.statusText);
        return;
      }
  
      const data = await response.json();
      console.log('Success:', data);
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update user: ' + error.message);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="uid">User ID:
        <input
            className="border border-gray-300 rounded-lg p-2 text-black"
            type="text"
            id="uid"
            value={uid}
            onChange={e => setUid(e.target.value)}
            required
        />
      </label>
      <label htmlFor="displayName">Display Name:
        <input
            className="border border-gray-300 rounded-lg p-2 text-black"
            type="text"
            id="displayName"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            required
        />
      </label>
      <button className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30" type="submit">Update User</button>
    </form>
  );
};

export default UpdateUser;
