"use client";
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getRedirectResult, signInWithEmailAndPassword, signInWithRedirect } from 'firebase/auth';
import { auth, provider } from './lib/firebaseConfig'; 

const generateEmailForUsername = (username: string): string => {
  return `${username}@mtgn.nu`;
};

const Home: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  // TODO: ADD TIMER FOR LOGIN BUTTON
  const [isDisabled, setIsDisabled] = useState<boolean>(false);  // used for timeout on login button
  const router = useRouter();


  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault();
    setIsDisabled(true);
    
    try {
      const email = generateEmailForUsername(username);
      await signInWithEmailAndPassword(auth, email, password);
      
      // successful login
      const idToken = await auth.currentUser?.getIdToken();
      if (idToken) {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        
        if (response.status === 200) {
          //console.log(response);
          
          router.push("/home");
        }
      }
    } catch (error) {
      console.error("Error signing in: ", error);
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-[#A5CACE] to-[#4FC0A0]">
      <div className='flex items-center justify-center'>
      <form onSubmit={handleSignIn}>
        <div>
        <input
          className="border border-gray-300 rounded-lg p-2 text-black"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        </div>
        <div>
        <input
          className="border border-gray-300 rounded-lg p-2 text-black"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        </div>
        <button type="submit" disabled={isDisabled}>Login</button>
      </form>
      </div>
    </main>
  );
};

export default Home;
