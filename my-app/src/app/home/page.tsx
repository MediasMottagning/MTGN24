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
import AnslagCard from "../components/AnslagCard";
import { NextRequest, NextResponse } from "next/server";

const gasqueImage = "/gasqueImg.png";
const homeGradient = "/homeGradient.jpg"

/**
 * 
 * @param dateTime A string such as "2024-08-18T10:15:00+02:00"
 * @returns {string} A string such as "10:15 Söndag"
 */
function formatDateTime(dateTime: string): string {

    const weekdayMap: { [key: number]: string } = {
        1: "Måndag",
        2: "Tisdag",
        3: "Onsdag",
        4: "Torsdag",
        5: "Fredag",
        6: "Lördag",
        0: "Söndag",  
    };

    const dateObj = new Date(dateTime);

    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const weekday = weekdayMap[dateObj.getDay()];

    return `${hours}:${minutes} ${weekday}`;
}


export default function Home(request: NextRequest, response: NextResponse) {
    // check if user is logged in
    const { user } = useAuth();

    const [posts, setPosts] = useState<Post[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    

    useEffect(() => {
        
        const fetchPostsData = async () => {
            // if user is not logged in, redirect to login page
            if (!user){ return <h1>Please login</h1>;}
            const token = await user.getIdToken();
            const response = await fetch('/api/getPosts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                const sortedPosts = data.posts.sort((a: Post, b: Post) => { // Sort posts by when they were created. Newest first.
                    const createdAt_A = new Date(a.createdAt);
                    const createdAt_B = new Date(b.createdAt);
                    return createdAt_B.getTime() - createdAt_A.getTime();
                });
                setPosts(sortedPosts);
            }
            
        };
        fetchPostsData();

        const fetchNextEvents = async () => {
           
            const response = await fetch('/api/getCalendarEvents', {
                method: 'GET',
            });
            if (response.ok) {
                const data = await response.json();
                setEvents(data.items);
            }  
        };
        fetchNextEvents();

    }, [user]);

    useEffect(() => {
        console.log("Posts");
        console.log(posts);

    }, [posts]);

    useEffect(() => {
        console.log("Events");
        console.log(events);

    }, [events]);

    return (
        <main className="flex min-h-screen flex-col items-center bg-gradient-to-r from-[#A5CACE] to-[#4FC0A0]">
            <script src="https://apis.google.com/js/api.js" type="text/javascript"></script>
            <div className="flex w-11/12 flex-col mt-5 md:mt-9 max-w-2xl"> {/* EVENT MODULE */}
                <div className="flex flex-row">
                    <p className="font-semibold text-lg sm:text-2xl ml-1">Nästa event</p>
                    <p className="text-2xl sm:text-3xl ml-1">🥳</p>
                </div>
                <div className="flex flex-col space-y-5">
                    {events.map((event) => {
                        return (
                            <EventCard key={event.id}
                                title={event.summary}
                                time={formatDateTime(event.start.dateTime)}
                                location={event.location}
                                costs="150 kr"
                                image=""
                                />
                        );
                    })}
                </div>
            </div>
            <div className="flex w-11/12 flex-col mt-5 md:mt-9 max-w-2xl mb-5"> {/* EVENT MODULE */}
            <div className="flex flex-row">
                    <p className="font-semibold text-lg sm:text-2xl pl-1">Senaste anslag</p>
                    <p className="text-2xl sm:text-3xl ml-1">📣</p>
                </div>
                
                <div className="flex flex-col space-y-5">
                    {posts.slice(0, 3).map((post) => { // Render only the first x elements in 'posts'
                        return (
                            <AnslagCard key={post.id}
                                title={post.title}
                                description={post.description}
                                createdAt={post.createdAt}/>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
