"use client";
import React, { useState } from "react";
import LogoutButton from "./LogoutBtn";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // toggle dropdown menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // close dropdown menu when a link is clicked
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
    return (
        <header className="flex justify-between items-center p-4 relative">
            <Link href="/home" className="text-2xl font-bold" onClick={closeMenu}>My App</Link>
            <button className="md:hidden portrait:block" onClick={toggleMenu}>
                {/* hamburger icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
            {/* dropdown menu, phone om ni ska lägga in nya länkar lägg in de i bägge menyerna dvs. dropdown och landscape*/}
            <div className={`absolute top-full right-0 mt-2 w-full bg-white shadow-md z-10 flex flex-col items-center gap-4 p-4 transition-opacity duration-300 portrait:flex ${isMenuOpen ? "opacity-100 portrait:block" : "opacity-0 hidden portrait:hidden"}`}>
                <Link href="/profil" className="py-2 text-blue-500 hover:text-blue-700" onClick={closeMenu}>Profil</Link>
                <Link href="/event" className="py-2 text-blue-500 hover:text-blue-700" onClick={closeMenu}>Event</Link>
                <LogoutButton onClose={closeMenu} />
            </div>
            {/* landscape menu, computer*/}
            <div className="hidden landscape:flex items-center gap-4">
                <Link href="/profil" className="text-blue-500 hover:text-blue-700">Profil</Link>
                <Link href="/event" className="text-blue-500 hover:text-blue-700">Event</Link>
                <LogoutButton />
            </div>
        </header>
    );
};