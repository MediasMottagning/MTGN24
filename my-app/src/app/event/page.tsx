'use client';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Post } from '../lib/definitions';
import LogoutButton from '../components/LogoutBtn';
import useAuth from '../components/useAuth';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { get } from 'http';

export default function Event() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();
    useEffect(() => {
        const fetchPosts = async () => {
            if (!user) {
                return;
            }
            
            try {
                const token = await user.getIdToken();
                const response = await fetch('/api/getPosts', {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setPosts(data.posts);
                } else {
                    console.error('Failed to fetch posts:', data.error);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user]);


    if (!user) {
        return <h1>Please login</h1>;
    }


    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1 className="text-4xl font-bold text-center">EVENTS</h1>
            <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
                {posts.map(post => (
                    <div
                        key={post.id}
                        className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    >
                        <h2 className="mb-3 text-2xl font-semibold">
                            {post.title}
                            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                                -&gt;
                            </span>
                        </h2>
                        <p className="m-0 max-w-[30ch] text-sm opacity-50">
                            {post.description}
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
}
