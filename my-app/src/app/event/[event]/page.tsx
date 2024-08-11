'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useAuth from '../../components/useAuth';
import Modal from '../../components/Modal';

interface EventData {
    event: string;
    imageUrls: string[];
}

const EventPage = () => {
    const { event } = useParams();
    const { user } = useAuth();
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
        return <h1>Please login</h1>; // If middleware.ts is working this should never be rendered
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
        <div>
            <h1>{eventData.event}</h1>
            <div>
                {eventData.imageUrls.slice(1).map((url, index) => (
                    <img 
                        key={index} 
                        src={url} 
                        alt={`Event ${eventData.event} Image ${index + 1}`} 
                        onClick={() => openModal(url)}
                        style={{ cursor: 'pointer' }} 
                    />
                ))}
            </div>
            {modalImageUrl && (
                <Modal isOpen={isModalOpen} onClose={closeModal} imageUrl={modalImageUrl} />
            )}
        </div>
    );
};

export default EventPage;
