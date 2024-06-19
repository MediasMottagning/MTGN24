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
import { NextRequest, NextResponse } from "next/server";


export default function Home(request: NextRequest, response: NextResponse) {
    // check if user is logged in
    const { user }= useAuth();

    // if user is not logged in, redirect to login page
    if (!user){ return <h1>Please login</h1>;}


    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1 className="text-4xl font-bold text-center">Posts</h1>
                <div className="grid grid-cols-1 gap-4 mt-8">

                </div>
            <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
                <button
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                >
                <h2 className={`mb-3 text-2xl font-semibold`}>
                    Print shit{" "}
                    <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                    -&gt;
                    </span>
                </h2>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                    BIIIIIIIIIIIIG TESET.
                </p>
                </button>

                <a
                href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                target="_blank"
                rel="noopener noreferrer"
                >
                <h2 className={`mb-3 text-2xl font-semibold`}>
                    Learn{" "}
                    <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                    -&gt;
                    </span>
                </h2>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                    Learn about Next.js in an interactive course with&nbsp;quizzes!
                </p>
                </a>
            </div>
        </main>
    );
}
