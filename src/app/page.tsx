"use client";

import {
  animate,
  AnimatePresence,
  useMotionValue,
  MotionConfig,
  type PanInfo,
  motion,
} from "framer-motion";
import { useState } from "react";

const COLORS: string[] = [
  "bg-red-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-pink-500",
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const x = useMotionValue(0);

  function handlePrev() {
    if (index > 0) {
      const newIndex = index - 1;
      setIndex(newIndex);
      animate(x, newIndex * -100);
    }
  }

  function handleNext() {
    if (index < COLORS.length - 1) {
      setIndex(index + 1);
    }
  }

  function onPan(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    // move the element horizontally according to cursor position calculated from `-index * 100%`
    // and the offset of the cursor from the initial position
    const OFFSET = 100;
    const x = `-${index * 100 + info.offset.x / 10}%`;
  }

  function onPanEnd(
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) {
    const OFFSET = 100;
    if (info.offset.x > OFFSET) {
      handlePrev();
    } else if (info.offset.x < OFFSET) {
      handleNext();
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-yellow-100 p-24">
      <MotionConfig
        transition={{
          duration: 1,
          ease: [0.32, 0.72, 0, 1],
        }}
      >
        <section className="relative overflow-hidden rounded-md bg-yellow-50 shadow-xl shadow-yellow-900/10">
          <div className="flex w-64">
            <div className="grid w-full grid-cols-2">
              <AnimatePresence initial={false}>
                {index > 0 && (
                  <motion.button
                    className="col-start-1 p-4"
                    onClick={handlePrev}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0, pointerEvents: "none" }}
                    whileHover={{ opacity: 1 }}
                  >
                    Prev
                  </motion.button>
                )}
              </AnimatePresence>
              <AnimatePresence initial={false}>
                {index < COLORS.length - 1 && (
                  <motion.button
                    className="col-start-2 p-4"
                    onClick={handleNext}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0, pointerEvents: "none" }}
                    whileHover={{ opacity: 1 }}
                  >
                    Next
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
          <motion.div
            className="flex h-64 w-64"
            animate={{
              x: `-${index * 100}%`,
            }}
            onPan={onPan}
            onPanEnd={onPanEnd}

            // drag="x"
            // dragControls={dragControls}
            // dragConstraints={{ left: 0, right: 0 }}
            // dragElastic={0.1}
            // dragMomentum={false}
            // onDragEnd={(event, info) => {
            //   const OFFSET = 100;
            //   if (info.offset.x > OFFSET) {
            //     handlePrev();
            //   } else if (info.offset.x < OFFSET) {
            //     handleNext();
            //   }
            // }}
          >
            {COLORS.map((color) => (
              <div key={color} className={`${color} h-full w-full shrink-0`} />
            ))}
          </motion.div>
        </section>
      </MotionConfig>
    </main>
  );
}
