'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { db} from '../lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import LogoutButton from "../components/LogoutBtn";
import useAuth from "../components/useAuth";
const gasqueImage = "/gasqueImg.png";


export default function Home() {
    // check if user is logged in
    const { user }= useAuth();
    // if user is not logged in, redirect to login page
    if (!user){ return <h1>Please login</h1>;}
    return (
        <main className="debug flex min-h-screen flex-col items-center">
            <div className="debug flex w-11/12 flex-col mt-3"> {/* EVENT MODULE */}
                <p className="font-semibold">Nästa event</p>
                <div className="flex w-full flex-row border border-black rounded-lg">
                    <div className="flex w-1/3 relative mr-3">
                        <Image alt="Preview image of event" src={gasqueImage} fill={true} objectFit="cover"></Image>
                    </div>
                    <div className="flex w-2/3 flex-col">
                        <p className="font-semibold">Neverland Gasque</p>
                        <p>Fredag 17-00</p>
                        <p>META</p>
                        <p>Kostar</p>
                    </div>
                </div>

            </div>
            <div className="debug flex mt-3"> {/* ANNOUNCEMENTS MODULE */}
                <p className="font-semibold">Senaste anslag</p>
            </div>
        </main>
    );
}
