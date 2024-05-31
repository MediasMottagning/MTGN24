'use client'
import { FormEvent, useEffect, useState } from 'react';
import useAuth from "../components/useAuth";
import { collection, getDocs } from 'firebase/firestore';
import { db} from '../lib/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from "firebase/storage"; // for profile pic

export default function N0llanGrupper(){
    
    const [userUrls, setUserUrls] = useState<string[]>([]);
    // check if user is logged in
    const { user }= useAuth();
    // if user is not logged in, redirect to login page
    if (!user){ return <h1>Please login :|</h1>;}

    useEffect(() => {
        if (user) {
            getCollectionData();
        }
    }, [user]);

    async function getCollectionData() {
        const urls: string[] = [];
        const querySnapshot = await getDocs(collection(db, "users"));
        const storage = getStorage();

        for (const userDoc of querySnapshot.docs) {
            const userProfileRef = doc(db, "users", userDoc.id);
            const docSnap = await getDoc(userProfileRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                const picUrl = userData.profilePic;

                if (picUrl) {
                    try {
                        const picRef = ref(storage, picUrl);
                        const url = await getDownloadURL(picRef);
                        urls.push(url);
                    } catch (error) {
                        console.error("Error fetching profile picture:", error);
                    }
                }
            }
        }
        setUserUrls(urls);
    }

    return (
        <main>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userUrls.map((url, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                        <img src={url} alt={`User ${index + 1}`} className="w-full h-auto" />
                    </div>
                ))}
            </div>
        </main>
    )
}