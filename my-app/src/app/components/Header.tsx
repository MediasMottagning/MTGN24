"use client"
import React, { useState } from 'react';
import LogoutButton from './LogoutBtn';
import Link from 'next/link';

export default function Header() {
    // state to manage dropdown menu visibility
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // function for dropdown menu visibility
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="flex justify-between items-center p-4 relative">
            <Link href="/home" className="text-2xl font-bold">My App</Link>
            <button className="md:hidden" onClick={toggleMenu}>
                {/* hamburger icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
            {/* conditionally rendered dropdown menu */}
            <div className={`absolute top-full right-0 mt-2 w-full bg-white shadow-md z-10 flex flex-col items-center gap-4 p-4 transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 hidden"}`}>
                <Link href="/profil" className="py-2 text-blue-500 hover:text-blue-700">Profil</Link>
                <LogoutButton />
            </div>
            {/* landscape menu */}
            <div className="hidden landscape:flex items-center gap-4">
                <Link href="/profil" className="text-blue-500 hover:text-blue-700">Profil</Link>
                <LogoutButton />
            </div>
        </header>
    );
};
