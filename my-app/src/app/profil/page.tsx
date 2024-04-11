'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { db} from '../lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import LogoutButton from "../components/LogoutBtn";
import useAuth from "../components/useAuth";
import { getAuth } from "firebase/auth";


async function getCollectionData() {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().username}`);
    });
}

export default function Home() {
    // check if user is logged in
    const { user } = useAuth();
    // if user is not logged in, redirect to login page

    const auth = getAuth();
    const profile = auth.currentUser;
    if (profile !== null) {
        // The user object has basic properties such as display name, email, etc.
        const displayName = profile.displayName;
        const email = profile.email;
        const photoURL = profile.photoURL;
        const emailVerified = profile.emailVerified;

        // The user's ID, unique to the Firebase project. Do NOT use
        // this value to authenticate with your backend server, if
        // you have one. Use User.getToken() instead.
        const uid = profile.uid;
    }

    if (!user){ return <h1>Please login u dumb fuq</h1>;}
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
                <div
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                >
                    <h2 className={`mb-3 text-2xl font-semibold`}>
                        {profile?.email}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                        -&gt;
                        </span>
                    </h2>
                </div>

                <div
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                >
                    <h2 className={`mb-3 text-2xl font-semibold`}>
                        {profile?.displayName}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                        -&gt;
                        </span>
                    </h2>
                </div>
            </div>
        </main>
    );
}
