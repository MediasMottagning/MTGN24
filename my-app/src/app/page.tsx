"use client"
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './lib/firebaseConfig'; // Adjust the import path as needed


// Function to generate an email from a username
const generateEmailForUsername = (username: string): string => {
  return `${username}@mtgn.nu`;
};

const Home: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = generateEmailForUsername(username);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // redirect to home page if login is successful
      router.push('/home'); 
    } catch (error: any) {
      console.error("LOGIN ERROR: ",error.message);
      // login error
    }
  };

  return (
    <main>
      {/* Your JSX structure */}
      <form onSubmit={handleLogin}>
        <input
          className="border border-gray-300 rounded-lg p-2 text-black"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          className="border border-gray-300 rounded-lg p-2 text-black"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </main>
  );
};

export default Home;
