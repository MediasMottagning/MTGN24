'use client';

import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import useAuth from '../components/useAuth';
import Modal from '../components/Modal';
import Link from 'next/link';

interface EventData {
    event: string;
    imageUrls: string[];
}

export default function Event() {
    const { user } = useAuth();
    const [events, setEvents] = useState<EventData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState<string>('');
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
                //console.log('Data:', data.events);
                setEvents(data.events);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, [user]);

    const openModal = (imageUrl: string) => {
        setModalImageUrl(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalImageUrl('');
    };

    if (!user) {
        return <h1>Please login</h1>;
    }

    return (
        <main className="min-h-screen bg-gradient-to-r from-[#A5CACE] to-[#4FC0A0]">
            <div className='flex flex-col items-center mx-7 sm:mx-16 md:mx-32 lg:mx-64 xl:mx-96'>
                {events.map(event => (
                    <div className='w-full mb-8' key={event.event}>
                        <Link href={`/event/${event.event}`}>
                            <h2 className='bg-white text-black font-normal text-center text-xl mt-4 rounded-lg py-4 whitespace-nowrap drop-shadow hover:bg-slate-200 w-full' style={{ cursor: 'pointer' }}>
                                {event.event}
                            </h2>
                        </Link>
                        <div className="grid grid-cols-3 gap-4 lg:grid-cols-4 2xl:grid-cols-5">
                            {event.imageUrls.slice(1).map((url, index) => (
                                <img 
                                    key={index} 
                                    src={url} 
                                    alt={`Event ${event.event} Image ${index + 1}`} 
                                    onClick={() => openModal(url)}
                                    style={{ cursor: 'pointer' }} 
                                    className='object-cover h-20 w-full rounded-lg shadow-lg mt-2'
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} imageUrl={modalImageUrl} />
        </main>
    );
}
