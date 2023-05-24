// cSpell: disable
"use client";

import { useSpring, a, config } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { match } from "ts-pattern";
import { Children, useState } from "react";

const FULL_HEIGHT = 640;

type SheetProps = {
  children: React.ReactNode;
  fullHeight?: number;
  middleHeight?: number;
};
export function Sheet({ children }: SheetProps) {
  const [{ y }, api] = useSpring(() => ({ y: FULL_HEIGHT }));
  const [state, setState] = useState<"CLOSED" | "MIDDLE" | "FULL">("CLOSED");

  function toFull(canceled: boolean = false) {
    // when cancel is true, it means that the user passed the upwards threshold
    // so we change the spring config to create a nice wobbly effect
    api.start({
      y: 0,
      immediate: false,
      config: canceled ? config.wobbly : config.stiff,
    });
  }

  function toMidlde() {
    api.start({
      y: FULL_HEIGHT / 2,
      //
      immediate: false,
      config: config.stiff,
    });
  }

  function toClose(velocity = 0) {
    api.start({
      y: FULL_HEIGHT,
      immediate: false,
      config: { ...config.stiff, velocity },
    });
  }

  function handleFull(canceled: boolean = false) {
    setState("FULL");
    toFull(canceled);
  }

  function handleMiddle() {
    setState("MIDDLE");
    toMidlde();
  }

  function handleClose(velocity = 0) {
    setState("CLOSED");
    toClose(velocity);
  }

  const bind = useDrag(
    ({
      last,
      velocity: [, vy],
      direction: [, dy],
      movement: [, my],
      cancel,
      canceled,
    }) => {
      // when the user releases the sheet, we check whether it passed
      // the threshold for it to close, or if we reset it to its open position
      if (last) {
        match(state)
          .with("CLOSED", () => {
            console.log("closed");
          })
          .with("MIDDLE", () => {
            console.log("middle");
            const shouldClose = my > FULL_HEIGHT * 0.7 || (vy > 0.5 && dy > 0);
            const shouldFull = my < FULL_HEIGHT * 0.3 || (vy < -0.5 && dy < 0);

            if (shouldClose) {
              handleClose(vy);
            } else if (shouldFull) {
              handleFull(canceled);
            } else {
              handleMiddle();
            }
          })
          .with("FULL", () => {
            console.log("full");
            const shouldClose = my > FULL_HEIGHT * 0.6;
            console.log({ vy, dy });
            const shouldMiddle =
              (my > FULL_HEIGHT * 0.3 && my < FULL_HEIGHT * 0.7) ||
              (vy > 0.5 && dy > 0);

            if (shouldClose) {
              handleClose(vy);
            } else if (shouldMiddle) {
              handleMiddle();
            } else {
              handleFull(canceled);
            }
          })
          .exhaustive();
      }
      // when the user keeps dragging, we just move the sheet according to
      // the cursor position
      else {
        match(state)
          .with("CLOSED", () => {})
          .with("MIDDLE", () => {
            api.start({ y: my + FULL_HEIGHT / 2, immediate: true });
          })
          .with("FULL", () => {
            api.start({ y: my, immediate: true });
          })
          .exhaustive();
      }
    },
    {
      from: () => [0, y.get()],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true,
    }
  );

  const display = y.to((py) => (py < FULL_HEIGHT * 2 ? "block" : "none"));

  return (
    <main className="flex h-screen w-screen flex-row items-center justify-center bg-yellow-700">
      <div className="flex gap-2">
        <button
          className="rounded bg-blue-200 px-4 py-2 text-blue-900 hover:bg-blue-400"
          onClick={() => {
            handleClose();
          }}
        >
          CLOSE
        </button>
        <button
          className="rounded bg-blue-200 px-4 py-2 text-blue-900 hover:bg-blue-400"
          onClick={() => {
            handleMiddle();
          }}
        >
          MIDDLE
        </button>
        <button
          className="rounded bg-blue-200 px-4 py-2 text-blue-900 hover:bg-blue-400"
          onClick={() => {
            handleFull();
          }}
        >
          FULL
        </button>
      </div>

      <div className="relative flex h-[640px] w-[360px] flex-col items-center justify-center overflow-hidden bg-yellow-100 shadow-2xl shadow-yellow-900/70">
        <a.div
          className="z-100 absolute h-[calc(640px+100px)] w-1/2 touch-none select-none rounded-t-xl bg-white shadow-2xl shadow-yellow-900/70"
          //                           calc(360px + 100px)
          {...bind()}
          // style={{ display, bottom: `calc(-360px + ${HEIGHT - 100}px)`, y }}
          style={{
            display,
            bottom: `calc(-640px + ${FULL_HEIGHT - 100}px)`,
            y,
          }}
        >
          <div className="flex p-4">{children}</div>
        </a.div>
      </div>
    </main>
  );
}
