"use client"; // This is a client component now?? idk what this does but makes usestate work lol
import React, { useState } from "react";

//Using drive embedd for now, not so practical for uploading its hardcoded lol and takes a while to load.
const bandaren = () => {
  let [src, setSrc] = useState("");
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
      <iframe src={src} width="100%" height="700px" allow="autoplay"></iframe>
    </div>
  );
};

export default bandaren;
