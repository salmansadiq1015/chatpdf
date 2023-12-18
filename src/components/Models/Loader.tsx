import { Loader2 } from "lucide-react";
import React from "react";

export default function Loader() {
  return (
    <div className="h-full flex flex-col gap-y-4 items-center justify-center">
      <div>
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
      <p className="font-medium animate-pulse">ChatDoc is thinking...</p>
    </div>
  );
}
