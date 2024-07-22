"use client"

import Image from "next/image";

const lokeImage = "/Loke_i_Dubrovnik.png";
const clockIcon = "/clock-60.png";
const locationIcon = "/place-60.png";
const ticketIcon = "/ticket-48.png";

export default function EventCard(params:any) {
    return (
        <div className="flex w-full flex-row bg-white drop-shadow-homeShadow rounded-lg">
            <div className="flex w-1/3 relative mr-1">
                <Image alt="Preview image of event" src={params.image || lokeImage} fill={true} objectFit="cover" className="rounded-l-md"></Image>
            </div>
            <div className="flex w-2/3 flex-col space-y-1 p-1">
                <p className="font-semibold">{params.title || "Event title"}</p>
                <div className="flex flex-row">
                    <Image src={clockIcon} width={23} height={23} alt="" className="mr-1"/>
                    <p>{params.time || "?"}</p>
                </div>
                <div className="flex flex-row">
                    <Image src={locationIcon} width={23} height={23} alt="" className="mr-1"/>
                    <p>{params.location || "?"}</p>
                </div>
                <div className="flex flex-row">
                    <Image src={ticketIcon} width={23} height={23} alt="" className="mr-1"/>
                    <p>{params.costs || "?"}</p>
                </div>
            </div>
        </div>
    );
};
