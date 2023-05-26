// cSpell: disable
"use client";

import { useState } from "react";
import { Sheet } from "./sheet";

export default function Page() {
  const [state, setState] = useState<"CLOSED" | "MIDDLE" | "FULL">("CLOSED");
  return (
    <main className="flex h-[640px] w-[360px] flex-col bg-yellow-900">
      <div className="flex w-20 flex-row gap-2 p-2">
        <button
          className={`rounded bg-white px-2 py-1 transition-all ${
            state === "CLOSED" ? "translate-y-1 bg-yellow-300" : ""
          }`}
          onClick={() => setState("CLOSED")}
        >
          CLOSED
        </button>
        <button
          className={`rounded bg-white px-2 py-1 transition-all ${
            state === "MIDDLE" ? "translate-y-1 bg-yellow-300" : ""
          }`}
          onClick={() => setState("MIDDLE")}
        >
          MIDDLE
        </button>
        <button
          className={`rounded bg-white px-2 py-1 transition-all ${
            state === "FULL" ? "translate-y-1 bg-yellow-300" : ""
          }`}
          onClick={() => setState("FULL")}
        >
          FULL
        </button>
      </div>
      <Sheet middleHeight={320} setState={setState} state={state}>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">Sheet</h1>
          <p className="text-xl">Drag the sheet up and down</p>
        </div>
      </Sheet>
    </main>
  );
}
