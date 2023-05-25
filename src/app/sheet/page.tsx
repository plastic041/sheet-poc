// cSpell: disable
"use client";

import { useState } from "react";
import { Sheet } from "~/app/sheet/sheet";

export default function Page() {
  const [state, setState] = useState<"CLOSED" | "MIDDLE" | "FULL">("CLOSED");
  return (
    <main className="flex h-[640px] w-[360px] flex-col bg-yellow-900">
      <button onClick={() => setState("CLOSED")}>CLOSED</button>
      <button onClick={() => setState("MIDDLE")}>MIDDLE</button>
      <button onClick={() => setState("FULL")}>FULL</button>
      <Sheet middleHeight={320} setState={setState} state={state}>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">Sheet</h1>
          <p className="text-xl">Drag the sheet up and down</p>
        </div>
      </Sheet>
    </main>
  );
}
