'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white p-4 mt-4">
            <div className="container mx-auto flex justify-between items-center">
                <p>&copy; {new Date().getFullYear()} MTGN24. All rights reserved.</p>
            </div>
        </footer>
    );
}
