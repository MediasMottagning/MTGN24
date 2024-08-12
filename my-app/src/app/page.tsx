"use client";
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getRedirectResult, signInWithEmailAndPassword, signInWithRedirect } from 'firebase/auth';
import { auth, provider } from './lib/firebaseConfig'; 
import TemplateHome from './components/TemplateHome';


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
      alert("Inloggning misslyckades. \nKontrollera att du har skrivit användarnamn och lösenord rätt.");
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div className='relative'>
      <div className='blur-sm'>
        <TemplateHome />
      </div>

      <div className="absolute top-48 sm:top-80 inset-0 z-10 flex flex-col items-center rounded-t-2xl grow pt-10 sm:pt-16 space-y-4 border border-gray-50 bg-contain bg-repeat bg-[url('/white_plant_pattern.webp')] animate-fadeInFromBottom"> {/* Bottom half */}
        <p className='text-xl sm:text-2xl font-semibold bg-gradient-to-t to-[#A5CACE] from-[#4FC0A0] bg-clip-text text-transparent drop-shadow-sm'>Välkommen till Mottagningen!</p>
        <form onSubmit={handleSignIn} className='flex flex-col space-y-2 pt-4'>
          <input
            className="border border-gray-300 rounded-lg p-2 m-1"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Användarnamn"
            required
          />
          <input
            className="border border-gray-300 rounded-lg p-2 m-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Lösenord"
            required
          />
          <div className="flex justify-center pt-4">
            <button type="submit" disabled={isDisabled} className="drop-shadow-homeShadow w-2/3 text-white rounded-full py-3 bg-gradient-to-r from-[#A5CACE] to-[#4FC0A0]">Logga in</button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default Home;
