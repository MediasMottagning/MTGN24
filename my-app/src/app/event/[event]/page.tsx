'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useAuth from '../../components/useAuth';
import Modal from '../../components/Modal';
import Link from 'next/link';

interface EventData {
    event: string;
    imageUrls: string[];
}

const EventPage = () => {
    const { event } = useParams();
    const { user } = useAuth();
    const router = useRouter();
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!event) return;
        if (!user) {
            return;
        }
        const fetchEventData = async () => {
            try {
                const token = await user.getIdToken();
                const response = await fetch('/api/getEventData', {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Event": event.toString(),
                    },
                });

                if (!response.ok) {
                    const errorMessage = `HTTP error! status: ${response.status}`;
                    console.error(errorMessage);
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                setEventData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching event data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchEventData();
    }, [event, user]);

    const openModal = (imageUrl: string) => {
        setModalImageUrl(imageUrl);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalImageUrl(null);
    };

    if (!user) {
        return <h1>Please login</h1>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!eventData) {
        return <div>No event data found</div>;
    }

    return (
        <main className="min-h-screen bg-gradient-to-r from-[#A5CACE] to-[#4FC0A0]">
            <div className='flex flex-col items-center mx-7 sm:mx-16 md:mx-32 lg:mx-64 xl:mx-96'>
                <div className="flex w-full gap-4 mt-4">
                    <Link href="/event" className="w-1/3">
                        <h1 className='bg-white text-black font-medium text-center text-2xl rounded-lg py-4 whitespace-nowrap drop-shadow hover:bg-slate-200 transition ease-in-out' style={{ cursor: 'pointer' }}>
                            Tillbaka
                        </h1>
                    </Link>
                    <h1 className='bg-white text-black font-medium text-center text-2xl rounded-lg py-4 whitespace-nowrap drop-shadow w-2/3'>
                        {eventData.event}
                    </h1>
                </div>
                <div className="grid grid-cols-4 gap-4 lg:grid-cols-4 2xl:grid-cols-5 mt-4">
                    {eventData.imageUrls.slice(1).map((url, index) => (
                        <img 
                            key={index} 
                            src={url} 
                            alt={`Event ${eventData.event} Image ${index + 1}`} 
                            onClick={() => openModal(url)}
                            style={{ cursor: 'pointer' }} 
                            className='object-cover h-20 w-full rounded-lg shadow-lg'
                        />
                    ))}
                </div>
            </div>
            {modalImageUrl && (
                <Modal isOpen={isModalOpen} onClose={closeModal} imageUrl={modalImageUrl} />
            )}
        </main>
    );
};

export default EventPage;
