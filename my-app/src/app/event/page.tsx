'use client';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Post } from '../lib/definitions';
import LogoutButton from '../components/LogoutBtn';
import useAuth from '../components/useAuth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { get } from 'http';
import { getDownloadURL } from "firebase/storage"; // for event pics
import { set } from 'firebase/database';


export default function Event() {
    const { user } = useAuth();
    const [events, setEvents] = useState([]); // state to hold events (array)
    const [images, setImages] = useState([]); // state to hold image URLs (array)
    const [loading, setLoading] = useState(true);
    const [url, setURL] = useState();
    const auth = getAuth();
    useEffect(() => {
        const fetchEvents = async () => {
            if (!user) {
                return;
            }
            
            try {
                const token = await user.getIdToken();
                const response = await fetch('/api/getEvents', {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    setImages(data.imageUrls); // Assuming this is how image URLs are returned
                    console.log(data.imageUrls[1]);
                    setURL(data.imageUrls[1]);  
                    //console.log("Image URL:", url);
                } else {
                    console.error('Failed to fetch events:', data.error);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user]);


    if (!user) {
        return <h1>Please login</h1>;
    }


    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1 className="text-4xl font-bold text-center">EVENTS</h1>
            <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
                {url && <img src={url} alt="Profile" />}
            </div>
        </main>
    );
}
