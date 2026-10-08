"use client";

// Adapted from React Bits "ScrollVelocity" (https://reactbits.dev, MIT).
// Changes: the row component lives at module scope (it was redefined on every
// render), typography comes from the caller, and rows stand still for
// reduced-motion users.

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

interface RowProps {
  children: ReactNode;
  baseVelocity: number;
  className?: string;
  copies?: number;
}

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

function VelocityRow({ children, baseVelocity, className = "", copies = 4 }: RowProps) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });

  const copyRef = useRef<HTMLSpanElement>(null);
  const [copyWidth, setCopyWidth] = useState(0);
  useLayoutEffect(() => {
    const el = copyRef.current;
    if (!el) return;
    const update = () => setCopyWidth(el.offsetWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const x = useTransform(baseX, (v) => (copyWidth === 0 ? "0px" : `${wrap(-copyWidth, 0, v)}px`));
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;
    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="relative overflow-hidden">
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        {Array.from({ length: copies }, (_, i) => (
          <span key={i} ref={i === 0 ? copyRef : undefined} className={`shrink-0 ${className}`} aria-hidden={i > 0}>
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

interface ScrollVelocityProps {
  rows: ReactNode[];
  velocity?: number;
  className?: string;
}

export default function ScrollVelocity({ rows, velocity = 40, className }: ScrollVelocityProps) {
  return (
    <div>
      {rows.map((row, i) => (
        <VelocityRow key={i} baseVelocity={i % 2 ? -velocity : velocity} className={className}>
          {row}
        </VelocityRow>
      ))}
    </div>
  );
}
