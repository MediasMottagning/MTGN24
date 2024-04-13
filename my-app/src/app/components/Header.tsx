// components/LogoutButton.tsx
import React from 'react';
import LogoutButton from './LogoutBtn';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">My App</h1>
        <div className='flex justify-between items-right p-4 gap-4'>
            <Link href="/profil">Profil</Link>
            <LogoutButton />
        </div>
        
        </header>
    );
};