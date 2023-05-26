import { useSpring, a } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { match } from "ts-pattern";
import type { ReactNode } from "react";

const FULL_HEIGHT = 640;

const config = {
  slow: {
    tension: 240,
    friction: 30,
  },
};

type SheetProps = {
  children: ReactNode;
  middleHeight: number;
  state: "CLOSED" | "MIDDLE" | "FULL";
  setState: (state: "CLOSED" | "MIDDLE" | "FULL") => void;
  top?: number;
};
export function Sheet({
  children,
  middleHeight,
  state,
  setState,
  top,
}: SheetProps) {
  const [{ y }, api] = useSpring(() => ({ y: FULL_HEIGHT }));

  function toFull() {
    api.start({
      y: 0,
      immediate: false,
      config: config.slow,
    });
  }

  function toMiddle() {
    api.start({
      y: middleHeight,
      immediate: false,
      config: config.slow,
    });
  }

  function toClose(velocity = 0) {
    api.start({
      y: FULL_HEIGHT,
      immediate: false,
      config: { ...config.slow, velocity },
    });
  }

  function handleFull() {
    console.log("handleFull");
    setState("FULL");
    toFull();
  }

  function handleMiddle() {
    console.log("handleMiddle");
    setState("MIDDLE");
    toMiddle();
  }

  function handleClose(velocity = 0) {
    console.log("handleClose");
    setState("CLOSED");
    toClose(velocity);
  }

  match(state)
    .with("CLOSED", () => {
      toClose();
    })
    .with("MIDDLE", () => {
      toMiddle();
    })
    .with("FULL", () => {
      toFull();
    })
    .exhaustive();

  const bind = useDrag(
    ({ last, velocity: [, vy], direction: [, dy], movement: [, my] }) => {
      // when the user releases the sheet, we check whether it passed
      // the threshold for it to close, or if we reset it to its open position
      if (last) {
        match(state)
          .with("CLOSED", () => {})
          .with("MIDDLE", () => {
            const shouldClose = my > FULL_HEIGHT * 0.7 || (vy > 0.5 && dy > 0);
            const shouldFull = my < FULL_HEIGHT * 0.3 || (vy < -0.5 && dy < 0);

            if (shouldClose) {
              handleClose(vy);
            } else if (shouldFull) {
              handleFull();
            } else {
              handleMiddle();
            }
          })
          .with("FULL", () => {
            const shouldClose = my > FULL_HEIGHT * 0.6;
            const shouldMiddle =
              (my > FULL_HEIGHT * 0.3 && my < FULL_HEIGHT * 0.7) ||
              (vy > 0.5 && dy > 0);

            if (shouldClose) {
              handleClose(vy);
            } else if (shouldMiddle) {
              handleMiddle();
            } else {
              handleFull();
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
            api.start({ y: my + middleHeight, immediate: true });
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
    <div className="pointer-events-none fixed flex h-screen w-screen flex-col overflow-hidden">
      <a.div
        className={`h-[calc(${FULL_HEIGHT}px+100px)] z-100 pointer-events-auto absolute w-full touch-none select-none rounded-t-xl bg-white shadow-2xl shadow-yellow-900/70`}
        //             calc(640px + 100px)
        {...bind()}
        style={{
          display,
          bottom: `calc(-${FULL_HEIGHT}px + ${FULL_HEIGHT - 100}px)`,
          y,
          height: `calc(${FULL_HEIGHT}px + ${
            top !== undefined ? 100 - top : 100
          }px)`,
        }}
      >
        <div className="flex p-4">{children}</div>
      </a.div>
    </div>
  );
}
