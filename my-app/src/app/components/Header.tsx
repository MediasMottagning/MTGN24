"use client";
import React, { useState } from "react";
import LogoutButton from "./LogoutBtn";
import Link from "next/link";
import Image from "next/image";

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
            <Link href="/home" className="flex items-center text-2xl font-bold" onClick={closeMenu}>            
                <Image src="/logo.png" alt="MTGN24" width={32} height={32} className='mr-2 ml-4'/>
                MTGN24
            </Link>
            <button className="md:hidden portrait:block" onClick={toggleMenu}>
                {/* hamburger icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
            {/* dropdown menu, phone om ni ska lägga in nya länkar lägg in de i bägge menyerna dvs. dropdown och landscape*/}
            <div className={`absolute top-full right-0 w-full bg-white shadow-md z-10`}>
                <div className={`transition-all delay-150 duration-200 overflow-hidden w-full ${isMenuOpen ? "max-h-[20rem]" : "max-h-0"}`}>
                    <div className="flex justify-between items-center flex-col">
                    <Link href="/profil" className="hover:text-blue-700 py-2" onClick={closeMenu}>Profil</Link>
                    <Link href="/event" className="hover:text-blue-700 py-2" onClick={closeMenu}>Galleri</Link>
                    <Link href="/n0llan" className="hover:text-blue-700 py-2" onClick={closeMenu}>nØllan</Link>
                    <Link href="/phosare" className="hover:text-blue-700 py-2" onClick={closeMenu}>Phösare</Link>
                    <Link href="/blandaren" className="hover:text-blue-700 py-2" onClick={closeMenu}>Bländare</Link>
                    <Link href="/calandar" className="hover:text-blue-700 py-2" onClick={closeMenu}>Calendar</Link>
                    <div className="py-1"></div>
                    <LogoutButton onClose={closeMenu}/>
                    <div className="py-2"></div>
                    </div>
                    
                </div>
            </div>
            {/* landscape menu, computer*/}
            <div className="hidden landscape:flex items-center gap-4">
                <Link href="/profil" className="text-blue-500 hover:text-blue-700">Profil</Link>
                <Link href="/event" className="text-blue-500 hover:text-blue-700">Galleri</Link>
                <Link href="/n0llan" className="text-blue-500 hover:text-blue-700">nØllan</Link>
                <Link href="/phosare" className="text-blue-500 hover:text-blue-700">Phösare</Link>
                <Link href="/blandaren" className="text-blue-500 hover:text-blue-700">Bländare</Link>
                <Link href="/calandar" className="text-blue-500 hover:text-blue-700">Calendar</Link>
                <LogoutButton/>
            </div>
        </header>
    );
};
