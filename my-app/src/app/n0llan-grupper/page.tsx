'use client'
import { FormEvent, useEffect, useState } from 'react';
import useAuth from "../components/useAuth";
import { doc, getDoc, setDoc, collection, getDocs, DocumentData } from 'firebase/firestore';
import { db} from '../lib/firebaseConfig';
import { getStorage, ref, getDownloadURL } from "firebase/storage"; 
import { UserRecord } from 'firebase-admin/auth';

export default function N0llanGrupper(){
    
    const [userUrls, setUserUrls] = useState<string[]>([]);
    const [userData, setUserData] = useState<DocumentData[]>([]);
    const { user } = useAuth();
    const storage = getStorage();

    useEffect(() => {
        if (user) {
            getUserData();
        }
    }, [user]);

    async function getUserData() {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersDataArray = [];
        for (const userDoc of querySnapshot.docs) {
            const userProfileRef = doc(db, "users", userDoc.id);
            const docSnap = await getDoc(userProfileRef);
            if (docSnap.exists()) {
                usersDataArray.push(docSnap.data());
                //console.log(getPicture(docSnap.data().profilePic))
            }
        }
        setUserData(usersDataArray);
    }

    async function getPicture(picUrl: string){
        try {
            const picRef = ref(storage, picUrl);
            const url = await getDownloadURL(picRef);
            return url;
        } catch (error) {
            console.error("Error fetching profile picture:", error);
        }
    }

    async function test() {
        console.log(userData)
    }
    /*
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
    */
    if (!user){ return <h1>Please login :|</h1>;}

    return (
        <main>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {userUrls.map((url, index) => (
                    <div key={index} className="bg-red-100 p-4 rounded-lg shadow-md">
                        <img src={url} alt={`User ${index + 1}`} className="w-full h-auto" />
                    </div>
                ))}
            </div>
            <div>
                <button onClick={test}>test</button>
            </div>
        </main>
    )
}