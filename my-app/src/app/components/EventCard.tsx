"use client"

import Image from "next/image";

const lokeImage = "/Loke_i_Dubrovnik.png";
const clockIcon = "/clock-60.png";
const locationIcon = "/place-60.png";
const ticketIcon = "/ticket-48.png";

export default function EventCard(params:any) {
    return (
        <div className="flex w-full flex-row h-36 sm:h-48 bg-white drop-shadow-homeShadow rounded-lg animate-fadeIn">
            <div className="flex w-1/3 sm:w-2/5 relative mr-1">
                <Image alt="Preview image of event" src={params.image || lokeImage} fill={true} objectFit="cover" className="rounded-l-md"></Image>
            </div>
            <div className="flex w-2/3 sm:w-3/5 flex-col place-content-between p-2 sm:p-3">
                <p className="font-semibold sm:text-xl">{params.title || "Event title"}</p>
                
                <div className="flex flex-row">
                    <div className="mr-1 w-6 sm:w-7">
                        <Image src={clockIcon} width={36} height={36} alt="" className="object-cover"/>
                    </div>
                    <p className="sm:text-lg">{params.time || "?"}</p>
                </div>
                
                <div className="flex flex-row">
                    <div className="mr-1 w-6 sm:w-7">
                        <Image src={locationIcon} width={36} height={36} alt="" className="object-cover"/>
                    </div>
                    <p className="sm:text-lg">{params.location || "?"}</p>
                </div>

                <div className="flex flex-row">
                    <div className="mr-1 w-6 sm:w-7">
                        <Image src={ticketIcon} width={36} height={36} alt="" className="object-cover"/>
                    </div>
                    <p className="sm:text-lg">{params.costs || "?"}</p>
                </div>
            </div>
        </div>
    );
};
