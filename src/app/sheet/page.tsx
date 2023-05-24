"use client";

import { useState } from "react";
import useMeasure from "react-use-measure";
import { useSpring, animated } from "@react-spring/web";

export default function Page() {
  const [contentRef, { height }] = useMeasure();
  const [isOpen, setIsOpen] = useState(false);
  const [props, api];

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-yellow-700">
      <button
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Opened" : "Closed"}
      </button>
      {height}
      <div className="relative flex h-[640px] w-[360px] flex-col items-center justify-center overflow-hidden bg-yellow-100 shadow-2xl shadow-yellow-900/70">
        {/* <MotionConfig
          transition={{
            type: "tween",
            ease: "easeOut",
            duration: 0.5,
          }}
        > */}
        <motion.div
          className="absolute bottom-0 h-screen w-full rounded-t-xl bg-white shadow-lg"
          variants={{
            initial: {
              y: 1000,
            },
            opened: (height: number) => ({
              y: 640 + 16 + height,
            }),
            closed: (height: number) => ({
              y: 640 + (16 + height) * 2,
            }),
          }}
          custom={height}
          initial="initial"
          animate={isOpen ? "opened" : "closed"}
        >
          <div className="flex p-4" ref={contentRef}>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
        </motion.div>
        {/* </MotionConfig> */}
      </div>
    </main>
  );
}
