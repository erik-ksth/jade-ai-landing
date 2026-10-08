"use client";

import { useEffect, useRef, type RefObject } from "react";
import { CLEAN_ROWS, NOISE } from "@/lib/cafe-data";

/**
 * The hero's "machine": messy values from the sample file drift into the demo
 * frame from one side and leave the other side as clean, aligned rows.
 * Horizontal on wide screens, vertical (top → bottom) on narrow ones.
 */

interface Props {
  /** The element the data flows into (the video frame) */
  target: RefObject<HTMLElement | null>;
  /** Scales how many messy values are in flight (1 = hero default) */
  density?: number;
}

interface Particle {
  kind: "messy" | "clean";
  text: string;
  dirty: boolean;
  u: number; // position along the flow axis
  v: number; // position across it
  vu: number;
  vv: number;
  rot: number;
  vrot: number;
  alpha: number;
  size: number;
  lane: number;
  seed: number;
}

const CLEAN_VALUES = CLEAN_ROWS.flat().filter((v) => v && v !== "Not recorded");
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export default function HeroFlow({ target, density = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mono = getComputedStyle(document.body).getPropertyValue("--font-geist-mono") || "monospace";

    let width = 0;
    let height = 0;
    let vertical = false;
    // Machine (video frame) bounds in flow coordinates
    let mStart = 0, mEnd = 0, mLo = 0, mHi = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    let last = performance.now();

    const toXY = (u: number, v: number): [number, number] => (vertical ? [v, u] : [u, v]);

    const measure = () => {
      const parent = canvas.parentElement!;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      vertical = width < 768;
      const t = target.current?.getBoundingClientRect();
      if (t) {
        const left = t.left - rect.left, top = t.top - rect.top;
        if (vertical) {
          mStart = top; mEnd = top + t.height; mLo = left; mHi = left + t.width;
        } else {
          mStart = left; mEnd = left + t.width; mLo = top; mHi = top + t.height;
        }
      }
    };

    const flowLength = () => (vertical ? height : width);
    const crossLength = () => (vertical ? width : height);
    const laneGap = () => (vertical ? 92 : 30);

    const spawnMessy = (anywhere = false): Particle => {
      const dirty = Math.random() < 0.22;
      return {
        kind: "messy",
        text: dirty ? pick(["ERROR", "UNKNOWN", "NaN", "ERROR", "—"]) : pick(NOISE),
        dirty,
        u: anywhere ? Math.random() * Math.max(mStart, 1) : -40 - Math.random() * 120,
        v: Math.random() * crossLength(),
        vu: 26 + Math.random() * 30,
        vv: (Math.random() - 0.5) * 20,
        rot: (Math.random() - 0.5) * 1.2,
        vrot: (Math.random() - 0.5) * 0.6,
        alpha: 0.25 + Math.random() * 0.55,
        size: 11 + Math.random() * 5,
        lane: 0,
        seed: Math.random() * 1000,
      };
    };

    const CLEAN_SPACING = 170;
    const cleanPeriod = () => Math.max(CLEAN_SPACING, Math.ceil((flowLength() - mEnd + 120) / CLEAN_SPACING) * CLEAN_SPACING);

    const makeClean = (lane: number, u: number): Particle => ({
      kind: "clean",
      text: pick(CLEAN_VALUES),
      dirty: false,
      u,
      v: mLo + laneGap() / 2 + lane * laneGap(),
      vu: 42,
      vv: 0,
      rot: 0,
      vrot: 0,
      alpha: 1,
      size: 13,
      lane,
      seed: Math.random() * 1000,
    });

    const populate = () => {
      const area = width * height;
      const messyCount = Math.round(Math.min(150, area / 6500) * density);
      // Clean values: a fixed-spacing conveyor per lane, each lane at its own phase
      const lanes = Math.max(1, Math.floor((mHi - mLo) / laneGap()));
      const period = cleanPeriod();
      const perLane = Math.round(period / CLEAN_SPACING);
      const clean: Particle[] = [];
      for (let lane = 0; lane < lanes; lane++) {
        const phase = Math.random() * CLEAN_SPACING;
        for (let k = 0; k < perLane; k++) clean.push(makeClean(lane, mEnd - 120 + phase + k * CLEAN_SPACING));
      }
      particles = [...Array.from({ length: messyCount }, () => spawnMessy(true)), ...clean];
    };

    const step = (dt: number, time: number) => {
      const center = (mLo + mHi) / 2;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.kind === "messy") {
          // Wander on a smooth noise field, pulled toward the machine's mouth
          const n = Math.sin(p.v * 0.011 + time * 0.0004 + p.seed) + Math.cos(p.u * 0.008 - time * 0.0003);
          p.vv += n * 14 * dt;
          const approach = Math.max(0, 1 - (mStart - p.u) / (mStart + 1));
          const targetV = center + (p.v - center) * (1 - approach * 0.85);
          p.vv += (targetV - p.v) * approach * 1.6 * dt;
          p.vv *= 0.96;
          p.u += p.vu * dt * (0.6 + approach * 1.2);
          p.v += p.vv * dt;
          p.rot += p.vrot * dt * (1 - approach);
          if (p.u > mStart + 6 && p.v > mLo && p.v < mHi) particles[i] = spawnMessy();
          else if (p.u > mStart + 40) particles[i] = spawnMessy();
        } else {
          p.u += p.vu * dt;
          p.v = mLo + laneGap() / 2 + p.lane * laneGap(); // follow the frame if it moved
          // Wrap around the conveyor; the value changes as it re-enters the machine
          const period = cleanPeriod();
          if (p.u > mEnd + period - 120) {
            p.u -= period;
            p.text = pick(CLEAN_VALUES);
          }
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.textBaseline = "middle";
      for (const p of particles) {
        const [x, y] = toXY(p.u, p.v);
        if (p.kind === "messy") {
          // Fade in at the edge, fade out just before the machine
          const edge = Math.min(1, (p.u + 40) / 160);
          const mouth = Math.min(1, Math.max(0, (mStart - p.u) / 60));
          // Stacked layouts run the flow behind the copy: keep it faint until it nears the machine
          const near = vertical ? 0.22 + 0.78 * Math.min(1, Math.max(0, 1 - (mStart - p.u) / 200)) : 1;
          const a = p.alpha * edge * mouth * near;
          if (a <= 0.01) continue;
          ctx.font = `${p.size}px ${mono}`;
          ctx.fillStyle = p.dirty ? `oklch(0.82 0.15 72 / ${a})` : `oklch(0.86 0.02 160 / ${a * 0.8})`;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(p.rot);
          ctx.fillText(p.text, 0, 0);
          ctx.restore();
        } else {
          if (p.u < mEnd) continue;
          const travel = (p.u - mEnd) / Math.max(1, flowLength() - mEnd);
          const a = Math.min(1, (p.u - mEnd) / 50) * Math.max(0, 1 - travel * 1.05);
          if (a <= 0.01) continue;
          ctx.font = `${p.size}px ${mono}`;
          ctx.fillStyle = `oklch(0.82 0.13 158 / ${a * 0.9})`;
          ctx.fillText(p.text, x, y);
        }
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      step(dt, now);
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    measure();
    populate();
    draw();
    start();
    // The frame rises into place on load; measure again once it has settled
    const settle = setTimeout(measure, 1400);

    const resize = new ResizeObserver(() => {
      measure();
      populate();
      draw();
    });
    resize.observe(canvas.parentElement!);

    // Only animate while the hero is on screen
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    visibility.observe(canvas);

    return () => {
      stop();
      clearTimeout(settle);
      resize.disconnect();
      visibility.disconnect();
    };
  }, [target, density]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0" />;
}
