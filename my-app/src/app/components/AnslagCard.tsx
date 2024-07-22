"use client"

import Image from "next/image";


function getTimeSincePost(createdAt:Date) {
    
    const postTime = new Date(createdAt); // Idk why but createdAt needs to be re-cast as a Date object for this to work
    const currentTime = new Date();
    const diff = currentTime.getTime() - postTime.getTime(); 

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let timeSince = '';

    if (days > 0) {
        timeSince = `${days} dag${days > 1 ? 'ar' : ''} sedan`;
    } else if (hours > 0) {
        timeSince = `${hours} tim${hours > 1 ? 'mar' : 'me'} sedan`;
    } else if (minutes > 0) {
        timeSince = `${minutes} minut${minutes > 1 ? 'er' : ''} sedan`;
    } else {
        timeSince = `${seconds} sekund${seconds > 1 ? 'er' : ''} sedan`;
    }
    
    return timeSince;
}


export default function AnslagCard(params:any) {
    return (
        <div className="flex w-full flex-col bg-white drop-shadow-homeShadow rounded-lg p-1">
            <div className="flex w-full place-content-between">
                <p className="w-3/5 -mt-1 font-semibold break-words">{params.title || "Blog post title"}</p>
                <p className="text-xs text-right w-2/5 text-gray-700">{getTimeSincePost(params.createdAt)}</p>
            </div>
            <div className="flex w-full">
            </div>
                <p className="text-sm break-words">{params.description || "Bla bla bla..."}</p>
        </div>
    );
};
