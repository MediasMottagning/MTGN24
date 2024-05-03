// components/LogoutButton.tsx
import React from "react";
import LogoutButton from "./LogoutBtn";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1 className="text-2xl font-bold"></h1>
      <LogoutButton />
    </header>
  );
}
