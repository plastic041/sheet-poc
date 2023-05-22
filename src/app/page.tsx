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
import useMeasure from "react-use-measure";

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
  const [ref, { width }] = useMeasure();

  function handlePrev() {
    if (index > 0) {
      const newIndex = index - 1;
      setIndex(newIndex);
      animate(x, newIndex * -width);
    }
  }

  function handleNext() {
    if (index < COLORS.length - 1) {
      const newIndex = index + 1;
      setIndex(newIndex);
      animate(x, newIndex * -width);
    }
  }

  function onPan(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    x.set(-index * width + info.offset.x);
  }

  function onPanEnd(
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) {
    const OFFSET = width / 2;
    if (info.offset.x > OFFSET) {
      // if not at the end
      if (index > 0) {
        handlePrev();
      } else {
        animate(x, -index * width);
      }
    } else if (info.offset.x < -OFFSET) {
      // if not at the end
      if (index < COLORS.length - 1) {
        handleNext();
      } else {
        animate(x, -index * width);
      }
    } else {
      animate(x, -index * width);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-yellow-100 p-24">
      <h1 className="mb-8 text-4xl font-bold">{index}</h1>
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
          <div className="flex" ref={ref}>
            <motion.div
              className="flex h-64 w-64"
              style={{
                x: x,
                touchAction: "pan-y",
              }}
              onPan={onPan}
              onPanEnd={onPanEnd}
            >
              {COLORS.map((color) => (
                <div
                  key={color}
                  className={`${color} h-full w-full shrink-0`}
                />
              ))}
            </motion.div>
          </div>
        </section>
      </MotionConfig>
    </main>
  );
}
