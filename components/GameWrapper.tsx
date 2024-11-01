"use client";

import dynamic from "next/dynamic";

// Dynamically import the Game component with ssr disabled
const Game = dynamic(() => import("./Game"), { ssr: false });

export default function GameWrapper() {
  return <Game />;
}
