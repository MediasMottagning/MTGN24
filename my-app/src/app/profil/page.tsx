'use client'

import { FormEvent, useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { db } from '../lib/firebaseConfig';
import LogoutButton from "../components/LogoutBtn";
import useAuth from "../components/useAuth";

const Home = () => {
    const [funFact, setFunFact] = useState<string>(''); // Holds the displayed fun fact
    const [inputFact, setInputFact] = useState<string>(''); // Holds the current input from the form
    const { user } = useAuth();

    // Fetch the fun fact from the user's profile
    useEffect(() => {
        if (user) {
            const fetchFunFact = async () => {
                const userProfileRef = doc(db, "users", user.uid);
                try {
                    const docSnap = await getDoc(userProfileRef);
                    if (docSnap.exists()) {
                        const storedFact = docSnap.data().funFact || '';
                        setFunFact(storedFact);
                        setInputFact(storedFact);  // Set input to reflect the stored fun fact
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching fun fact: ", error);
                }
            };

            fetchFunFact();
        }
    }, [user]);

    if (!user) {
        return <h1>Please login to update your profile.</h1>;
    }

    const updateFunFact = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (user) {
            const userProfileRef = doc(db, "users", user.uid);
            try {
                await setDoc(userProfileRef, { funFact: inputFact }, { merge: true });
                setFunFact(inputFact); // Update displayed fact only on successful submit
                console.log("User fun fact updated!");
                alert("Fun fact updated successfully!");
            } catch (error) {
                console.error("Error updating fun fact: ", error);
                alert("Failed to update fun fact.");
            }
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>
                <h2>{user?.email}</h2>
                <h2>{user?.displayName}</h2>
                <h2>{funFact}</h2>
            </div>
            <form onSubmit={updateFunFact}>
                <input
                    className="border border-gray-300 rounded-lg p-2 text-black"
                    type="text"
                    value={inputFact}
                    onChange={(e) => setInputFact(e.target.value)}
                    placeholder="Fun Fact"
                    required
                />
                <button type="submit">Submit Fun Fact</button>
            </form>
            <LogoutButton />
        </main>
    );
};

export default Home;
