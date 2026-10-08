"use client";

// Adapted from React Bits "DecryptedText" (https://reactbits.dev, MIT).
// Trimmed to the reveal-on-load mode used here. Changes from the original:
// screen readers always get the real text, and reduced-motion users see the
// final text without the scramble.

import { useEffect, useRef, useState } from "react";

interface DecryptedTextProps {
  text: string;
  /** ms between frames */
  speed?: number;
  /** ms before the reveal starts */
  delay?: number;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&?!";

export default function DecryptedText({
  text,
  speed = 45,
  delay = 0,
  characters = DEFAULT_CHARS,
  className = "",
  encryptedClassName = "",
}: DecryptedTextProps) {
  // Server render and no-JS show the final text
  const [display, setDisplay] = useState(text);
  const [revealed, setRevealed] = useState(text.length);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scramble = (count: number) =>
      text
        .split("")
        .map((char, i) =>
          char === " " || i < count ? char : characters[Math.floor(Math.random() * characters.length)]
        )
        .join("");

    let count = 0;
    const start = setTimeout(() => {
      setRevealed(0);
      setDisplay(scramble(0));
      timer.current = setInterval(() => {
        count += 1;
        setRevealed(count);
        setDisplay(scramble(count));
        if (count >= text.length && timer.current) clearInterval(timer.current);
      }, speed);
    }, delay);

    return () => {
      clearTimeout(start);
      if (timer.current) clearInterval(timer.current);
    };
  }, [text, speed, delay, characters]);

  return (
    <span className="inline-block whitespace-pre-wrap">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {display.split("").map((char, i) => (
          <span key={i} className={i < revealed ? className : encryptedClassName}>
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}
