"use client"
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './lib/firebaseConfig'; 


// function to generate an email from a username to login
const generateEmailForUsername = (username: string): string => {
  return `${username}@mtgn.nu`;
};

const Home: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);  // used for timeout on login button
  const router = useRouter();

  // login handler
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsDisabled(true);
    const email = generateEmailForUsername(username);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        // redirect to home page if login is successful
        router.push('/home'); 
      } catch (error: any) {
        // login error handler
        console.error("LOGIN ERROR: ",error.message);
        alert("Login failed. Please try again.");
      }
    // re-enable login button after 2 seconds
    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  };

  return (
    <main>
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
        <button type="submit" disabled={isDisabled}>Login</button>
      </form>
    </main>
  );
};

export default Home;
