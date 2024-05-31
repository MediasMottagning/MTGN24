'use client'

import Image from "next/image";
import Link from "next/link";
import { FormEvent, use, useEffect, useState } from 'react';
import { db} from '../lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import LogoutButton from "../components/LogoutBtn";
import useAuth from "../components/useAuth";
import { set } from "firebase/database";
import { Post } from "../lib/definitions";
import EventCard from "../components/EventCard";
import AnslagCard from "../components/AnslagCard";

const gasqueImage = "/gasqueImg.png";


export default function Home() {
    // check if user is logged in
    const { user }= useAuth();

    // if user is not logged in, redirect to login page
    if (!user){ return <h1>Please login</h1>;}


    return (
        <main className="flex min-h-screen flex-col items-center">
            <div className="flex w-11/12 flex-col mt-3"> {/* EVENT MODULE */}
                <p className="font-semibold pl-2">Nästa event</p>
                <div className="flex flex-col space-y-2">
                    <EventCard title="Neverland Gasque"
                                time="Fredag 18:00"
                                location="META"
                                costs="150 kr"
                                image={gasqueImage}/>

                    <EventCard title="Rundvandringen"
                                time="Måndag 09:00"
                                location="Borggården"
                                costs=""
                                image=""/>
                </div>
            </div>
            <div className="flex w-11/12 flex-col mt-3"> {/* EVENT MODULE */}
                <p className="font-semibold pl-2">Senaste anslag</p>
                <div className="flex flex-col space-y-2">
                    <AnslagCard title="Gratis pizza i D34"
                                desc="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."/>
                    <AnslagCard title="Ingen brainrot i korridoren"
                                desc="Snälla sluta skrika 'skibidi toilet' i korridoren. Phöseriets hjärnor hålla på smält "/>
                </div>
            </div>
        </main>
    );
}
