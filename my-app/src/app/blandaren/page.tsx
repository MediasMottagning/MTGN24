"use client"; // This is a client component now?? idk what this does but makes usestate work lol
import React, { useState } from "react";

//Using drive embedd for now, not so practical for uploading its hardcoded lol and takes a while to load.
const bandaren = () => {
  let [src, setSrc] = useState("");
<<<<<<< Updated upstream
  const blandareSrc = [
    "https://drive.google.com/file/d/1igX4a-LWrupoznZTFC278uVrZITXJdFX/preview",
    "https://drive.google.com/file/d/1lUKOaq8uIg9T8lFDywh-nYtb5dqapLGM/preview",
  ];
  return (
    <div className="flexbox-container">
      {blandareSrc.map((item, index) => (
        <button
          className="btn bg-blue-600 active:bg-blue-700 focus:ring-white text-white font-semibold py-2 px-4  hover:border-transparent rounded focus:ring"
          onClick={() => setSrc(blandareSrc[index])}
        >
          Bländaren {index + 1}
        </button>
      ))}
=======
  const { user } = useAuth();
  const [blandare, setBlandare] = useState([]);

  useEffect(() => {
    const fetchBlandare = async () => {
      if (!user) {
        return <h1>Please login</h1>;
      }
      const token = await user.getIdToken();
      try {
        const response = await fetch("/api/getBlandare", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setBlandare(data[0].links);
        } else {
          console.error("Failed to fetch blandare");
        }
      } catch (error) {
        console.error("Error fetching blandare:", error);
      }
    };

    fetchBlandare();
  }, [user]);

  return (
    <div className="">
      <div className="flex flex-wrap justify-center">
        {blandare.map((item, index) => (
          <button
            key={index}
            className="btn bg-green-600 active:bg-green-700 focus:ring-white text-white font-semibold py-3 px-4 box-border hover:border-transparent rounded focus:ring m-1"
            onClick={() => setSrc(blandare[index])}
          >
            Bländaren {index + 1}
          </button>
        ))}
      </div>
>>>>>>> Stashed changes
      <iframe src={src} width="100%" height="700px" allow="autoplay"></iframe>
    </div>
  );
};

export default bandaren;
