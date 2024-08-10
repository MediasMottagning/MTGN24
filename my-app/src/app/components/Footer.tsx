'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex flex-wrap justify-start items-center">
                <p className="pr-2">&copy; {new Date().getFullYear()} MTGN24. All rights reserved.</p>
                <p className="pr-2">Sponsorer:</p>
                <div className="flex flex-wrap">
                    <Image className="pr-2 mb-2" src="/skry.svg" alt="SKRY" width={80} height={50} />
                    <Image className="pr-2 mb-2" src="/si.png" alt="Sveriges Ingenjörer" width={120} height={50} />
                    <Image className="pr-2 mb-2" src="/svt.png" alt="SVT" width={50} height={50} />
                    <Image className="pr-2 mb-2" src="/mpya.svg" alt="MPYA" width={50} height={50} />
                </div>
            </div>
        </footer>
    );
}
