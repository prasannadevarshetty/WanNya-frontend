"use client";

import { useState } from "react";
import PawPrintLoader from "./PawPrintLoader";

export default function LoadingExample() {
  const [isLoading, setIsLoading] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Paw Print Loader Example</h2>
      
      <button
        onClick={simulateLoading}
        className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
      >
        {isLoading ? "Loading..." : "Start Loading"}
      </button>

      {isLoading && (
        <div className="mt-8">
          <PawPrintLoader />
        </div>
      )}
    </div>
  );
}
