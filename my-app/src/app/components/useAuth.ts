import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebaseConfig'; // Adjust the import path as needed
import { onAuthStateChanged } from 'firebase/auth';

const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true to check auth state


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user); // user is null if no user is logged in
        setLoading(false); // set loading to false once the check is complete
        if (!user) {
            // if user is not logged in redirect default page to force login
            router.push('/');
        }
    });

    // cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);
  return { user, loading }; // return the user and loading state
};

export default useAuth;
