"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  // Reduced motion: start on the poster and let people press play
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current?.pause();
    }
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  return (
    <div className="group relative">
      <video
        ref={videoRef}
        className="block aspect-video w-full rounded-[11px] bg-night"
        src="/demo/jade-ai-demo.mp4"
        poster="/demo/poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label="Demo: Jade loads a messy cafe sales spreadsheet, cleans it through chat, and charts total sales by item"
      />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause demo video" : "Play demo video"}
        className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full bg-black/55 text-white opacity-70 backdrop-blur-md transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-100 sm:bottom-4 sm:right-4"
      >
        {playing ? <Pause className="size-4" fill="currentColor" /> : <Play className="size-4 translate-x-px" fill="currentColor" />}
      </button>
    </div>
  );
}
