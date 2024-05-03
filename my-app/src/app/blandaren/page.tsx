"use client"; // This is a client component now?? idk what this does but makes usestate work lol
import React, { useState } from "react";

const bandaren = () => {
  let [src, setSrc] = useState("");
  const blandareSrc = [
    "https://drive.google.com/file/d/1JPa7dWMnDWhr2SQGAxBmsu2_V7wrA1eK/preview",
    "https://drive.google.com/file/d/1qxA7i03r321s75o40tkikrfBcV1yZCFS/preview",
    "https://drive.google.com/file/d/13-T1G_GvUnaoNuar0Tu0nCMESF_NOG30/preview",
    "https://drive.google.com/file/d/1ki9EqjMnet-W0SngkLTb_-FzzteRPn9D/preview",
    "https://drive.google.com/file/d/1jj7NWLqLNXlSvGQPZbUCWWQrfHTY8aIo/preview",
  ];
  return (
    <div>
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
