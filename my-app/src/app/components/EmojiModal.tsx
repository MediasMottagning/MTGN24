

export default function EmojiModal(params:any) {

    const emojiDict = {
        "🏃": "Sportigt event.",
        "🚶": "Man kommer gå omkring.",
        "🪑": "Lugn aktivtet.",
        "🎨": "Kreativt skapande.",
        "💬": "En bra möjlighet att socialisera.",
        "🥂": "Alkohol förekommer.",
        "🍽️": "Mat erbjuds.",
        "ℹ️": "Viktig information kommer att ges.",
        "✍️": "Ett bra tillfälle att plugga.",
        "🕺": "Gasque eller efterkör.",
        "☔": "Kläder efter väder.",
    }

    return (
        <>
            <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-20 z-50 backdrop-blur-sm animate-fadeInFast">
                <div className="flex flex-col mx-3 bg-white rounded-lg p-3 space-y-1">
                    <p className="text-lg text-center">Vad betyder alla emojis?</p>
                    {Object.entries(emojiDict).map(([key, value]) => (
                        <div key={key} className="flex p-1">
                            <p className="self-center mr-2">{key}</p>
                            <p>{value}</p>
                        </div>
                    ))}
                    <div className="flex justify-center pt-2">
                        <button className="drop-shadow-homeShadow w-2/3 text-white rounded-full py-2 bg-gradient-to-r from-[#A5CACE] to-[#4FC0A0]" onClick={params.onCloseClick}>Stäng</button>
                    </div>
                </div>
            </div>
        </>
    );
};
