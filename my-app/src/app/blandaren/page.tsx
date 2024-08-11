"use client"; 
import React, { useEffect, useState } from "react";
import useAuth from "../components/useAuth";

const Bandaren = () => {
  const [src, setSrc] = useState("");
  const { user } = useAuth();
  const [blandare, setBlandare] = useState([]);

  useEffect(() => {
      const fetchBlandare = async () => {
          if (!user){ return <h1>Please login</h1>;} // If middleware.ts is working this should never be rendered
          const token = await user.getIdToken();
          try {
              const response = await fetch('/api/getBlandare', {
                  method: 'GET',
                  headers: {
                      'Authorization': `Bearer ${token}`
                  }
              });
              if (response.ok) {
                  const data = await response.json();
                  setBlandare(data[0].links);
              } else {
                  console.error('Failed to fetch blandare');
              }
          } catch (error) {
              console.error('Error fetching blandare:', error);
          }
        };
    fetchBlandare();
  }, [user]);

  if (!user) return <h1>Please login</h1>;

  return (
    <main className="flex min-h-screen min-w-80 flex-col items-center bg-gradient-to-r from-[#A5CACE] to-[#4FC0A0]">
    <div className="flex flex-col items-center w-full space-y-4 p-4">
      <div className="flex flex-wrap justify-center items-center w-full space-x-4 mb-4">
        {blandare.map((item, index) => (
          <button
            key={index}
            className="bg-green-600 active:bg-blue-700 focus:ring-white text-white font-semibold py-2 px-4 hover:border-transparent rounded focus:ring hover:bg-green-500 focus:ring-opacity-50 w-full sm:w-auto"
            onClick={() => setSrc(blandare[index])}
          >
            Bländaren {index + 1}
          </button>
        ))}
      </div>
      <iframe src={src} width="100%" height="700px" className="border rounded-lg shadow-lg" allow="autoplay"></iframe>
    </div>
    </main>
  );
};

export default Bandaren;
