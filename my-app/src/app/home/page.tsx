'use client'

import Image from "next/image";
import Link from "next/link";
import { FormEvent, use, useEffect, useState } from 'react';
import { db} from '../lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import LogoutButton from "../components/LogoutBtn";
import useAuth from "../components/useAuth";
import { set } from "firebase/database";
import { Post } from "../lib/definitions";
import EventCard from "../components/EventCard";

const gasqueImage = "/gasqueImg.png";
const clockIcon = "/clock-60.png";
const locationIcon = "/place-60.png";
const ticketIcon = "/ticket-48.png";


async function getCollectionData() {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data().username}`);
  });
}
// get posts from firestore
const getPosts = async (): Promise<Post[]> => {
    const postsSnapshot = await getDocs(collection(db, "posts"));
    const postsData = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Post[];
    return postsData;
};

export default function Home() {
    // check if user is logged in
    const { user }= useAuth();

    // get posts from firestore
    const [posts, setPosts] = useState<Post[]>([]);
    useEffect(() => {
        const fetchPosts = async () => {
            const postsArray = await getPosts();
            setPosts(postsArray);
        };
        fetchPosts();
    }, []);

    // if user is not logged in, redirect to login page
    if (!user){ return <h1>Please login</h1>;}


    return (
        <main className="debug flex min-h-screen flex-col items-center">
            <div className="debug flex w-11/12 flex-col mt-3"> {/* EVENT MODULE */}
                <p className="font-semibold">Nästa event</p>
                <EventCard title="Neverland Gasque"
                            time="Fredag 18:00"
                            location="META"
                            costs="150 kr"/>
            </div>
            <div className="debug flex mt-3"> {/* ANNOUNCEMENTS MODULE */}
                <p className="font-semibold">Senaste anslag</p>
            </div>
        </main>
    );
}
