"use client"

import Image from "next/image";

export default function AnslagCard(params:any) {
    return (
        <div className="flex w-full flex-col border border-black rounded-lg p-1">
            <div className="flex w-full place-content-between">
                <p className="font-semibold">{params.title || "Blog post title"}</p>
                <p className="text-sm">17 min</p>
            </div>
            <div className="flex w-full">
                <p className="text-sm">{params.desc || "Bla bla bla..."}</p>
            </div>
        </div>
    );
};
