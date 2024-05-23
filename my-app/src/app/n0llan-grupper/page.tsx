'use client'
import { FormEvent, useEffect, useState } from 'react';
import useAuth from "../components/useAuth";
import { collection, getDocs } from 'firebase/firestore';
import { db} from '../lib/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from "firebase/storage"; // for profile pic

export default function N0llanGrupper(){
    
    var userUrls = new Array();
    // check if user is logged in
    const { user }= useAuth();
    // if user is not logged in, redirect to login page
    if (!user){ return <h1>Please login u dumb fuq</h1>;}

    async function getCollectionData() {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach(async (userDoc) => {
        const userProfileRef = doc(db, "users", userDoc.id);
                try {
                    const docSnap = await getDoc(userProfileRef);
                    if(docSnap.exists()){
                        const userData = docSnap.data();
                        const picUrl = userData.profilePic;
                        if (picUrl) {
                            const storage = getStorage();
                            const picRef = ref(storage, picUrl);
                            getDownloadURL(picRef)
                                .then((url) => {
                                    userUrls.push(url)
                                    console.log(userUrls)
                                })
                                .catch((error) => {
                                    console.error("Error fetching profile picture:", error);
                                });
                        }
                    }
                }
                catch{
                    console.log("Error");
                }
        });
      }

    return (
        <main>
            <div>test</div>
            <button onClick={getCollectionData}>test</button>
            
        </main>
    )
}