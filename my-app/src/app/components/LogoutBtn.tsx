"use client";
import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
  onClose?: () => void; // prop for a function to call on logout, used to close dropdown on click
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onClose }) => {
  const router = useRouter();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log('User signed out');
      onClose?.(); 
      router.push('/'); // redirect to login page
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;