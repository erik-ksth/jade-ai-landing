"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CLEAN_ROWS, DIRTY_ROWS, HEADERS, NOISE, isDirty } from "@/lib/cafe-data";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-driven story: values from the sample file start as chaos, settle into
 * a table, the broken cells get repaired one by one, and the scene moves from
 * dark to light as the data becomes clean.
 */

const STEPS = [
  {
    title: "Detect",
    body: "Every cell gets checked. Blanks, ERROR, UNKNOWN: 503 problems hiding in 500 rows.",
  },
  {
    title: "Repair",
    body: "Jade writes pandas to fix them. Totals are recalculated from quantity × price, and gaps it can't recover get labeled, not deleted.",
  },
  {
    title: "Verify",
    body: "Then it checks its own work. One pass, 497 of 500 rows kept, nothing left broken.",
  },
];

const WIDE_COLS = [0, 1, 2, 3, 4, 5, 6, 7];
const NARROW_COLS = [1, 2, 3, 4];
const COL_WEIGHTS = [1.35, 1.15, 0.55, 0.65, 0.65, 1.2, 1, 1.05];
const NUMERIC = new Set([2, 3, 4]);

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

interface Cell {
  row: number; // -1 = header
  col: number;
  dirtyText: string;
  cleanText: string;
  dirty: boolean;
  sx: number; // chaos position, as a fraction of the viewport
  sy: number;
  rot: number;
  delay: number;
  fixOrder: number;
  seed: number;
}

interface Noise {
  text: string;
  sx: number;
  sy: number;
  rot: number;
  drift: number;
  seed: number;
  dirty: boolean;
}

export default function CleanupStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const counterLabelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!section || !stage || !canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mono = getComputedStyle(document.body).getPropertyValue("--font-geist-mono") || "monospace";

    let width = 0, height = 0;
    let cols = WIDE_COLS;
    let rows = DIRTY_ROWS.length;
    let cells: Cell[] = [];
    let noise: Noise[] = [];
    let target = 0; // scroll progress
    let progress = 0; // smoothed
    let raf = 0;
    let running = false;

    const build = () => {
      const narrow = width < 768;
      cols = narrow ? NARROW_COLS : WIDE_COLS;
      rows = narrow ? 10 : DIRTY_ROWS.length;
      let fix = 0;
      cells = [];
      cols.forEach((col, ci) => {
        cells.push({
          row: -1, col, dirtyText: HEADERS[col], cleanText: HEADERS[col], dirty: false,
          sx: Math.random(), sy: Math.random(), rot: (Math.random() - 0.5) * 1.4,
          delay: ci * 0.01, fixOrder: 0, seed: Math.random() * 100,
        });
      });
      for (let r = 0; r < rows; r++) {
        cols.forEach((col, ci) => {
          const raw = DIRTY_ROWS[r][col];
          const dirty = isDirty(raw);
          cells.push({
            row: r, col,
            dirtyText: raw === "" ? "NaN" : raw,
            cleanText: CLEAN_ROWS[r][col],
            dirty,
            sx: Math.random() * 1.2 - 0.1,
            sy: Math.random() * 1.2 - 0.1,
            rot: (Math.random() - 0.5) * 1.6,
            delay: (r / rows) * 0.12 + (ci / cols.length) * 0.04 + Math.random() * 0.03,
            fixOrder: dirty ? fix++ : 0,
            seed: Math.random() * 100,
          });
        });
      }
      const fixCount = Math.max(1, fix);
      cells.forEach((c) => (c.fixOrder /= fixCount));
      noise = Array.from({ length: narrow ? 90 : 200 }, () => {
        const text = NOISE[Math.floor(Math.random() * NOISE.length)];
        return {
          text, dirty: isDirty(text),
          sx: Math.random() * 1.2 - 0.1, sy: Math.random() * 1.2 - 0.1,
          rot: (Math.random() - 0.5) * 1.8, drift: 0.4 + Math.random(), seed: Math.random() * 100,
        };
      });
    };

    const measure = () => {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const resized = Math.abs(rect.width - width) > 1;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (resized || cells.length === 0) build();
    };

    const layout = () => {
      const narrow = width < 768;
      const tableW = Math.min(1100, width - (narrow ? 32 : 96));
      const tableX = (width - tableW) / 2;
      const top = narrow ? height * 0.42 : height * 0.4;
      const rowH = Math.min(38, Math.max(26, (height - top - 48) / (rows + 1)));
      const weights = cols.map((c) => COL_WEIGHTS[c]);
      const total = weights.reduce((a, b) => a + b, 0);
      const starts: number[] = [];
      let acc = 0;
      for (const w of weights) {
        starts.push(acc);
        acc += (w / total) * tableW;
      }
      const widths = weights.map((w) => (w / total) * tableW);
      return { tableW, tableX, top, rowH, starts, widths, narrow };
    };

    type Palette = { text: number; header: number; fixed: number; rule: number; light: boolean };
    const DARK: Palette = { text: 0.9, header: 0.72, fixed: 0.8, rule: 0.32, light: false };
    const LIGHT: Palette = { text: 0.28, header: 0.5, fixed: 0.52, rule: 0.88, light: true };

    const draw = (time: number) => {
      const p = progress;
      const L = layout();
      const settleBase = (c: Cell) => easeOut(smooth(0.1 + c.delay, 0.4 + c.delay, p));
      const wobble = reduced ? 0 : 1;
      const fontSize = L.narrow ? 12 : 13.5;

      // A disc of light grows from the table and repaints what it covers
      const light = smooth(0.62, 0.82, p);
      const cx0 = width / 2;
      const cy0 = L.top + ((rows + 1) * L.rowH) / 2;
      const maxR = Math.hypot(Math.max(cx0, width - cx0), Math.max(cy0, height - cy0)) + 40;
      const radius = easeOut(light) * maxR;

      ctx.clearRect(0, 0, width, height);
      ctx.textBaseline = "middle";

      // Background noise drifts away as the table forms (dark layer only)
      const noiseOut = smooth(0.12, 0.42, p);
      ctx.font = `${fontSize}px ${mono}`;
      for (const n of noise) {
        const a = (1 - noiseOut) * 0.5;
        if (a < 0.01) break;
        const x = n.sx * width + Math.sin(time * 0.0003 + n.seed) * 18 * wobble + (n.sx - 0.5) * noiseOut * width * 0.6 * n.drift;
        const y = n.sy * height + Math.cos(time * 0.00025 + n.seed) * 14 * wobble + (n.sy - 0.5) * noiseOut * height * 0.6 * n.drift;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(n.rot * (1 - noiseOut * 0.5));
        ctx.fillStyle = n.dirty ? `oklch(0.82 0.15 72 / ${a})` : `oklch(0.86 0.02 160 / ${a * 0.7})`;
        ctx.fillText(n.text, 0, 0);
        ctx.restore();
      }

      const drawTable = (pal: Palette) => {
        // Row rules appear once the cells have landed
        const rules = smooth(0.36, 0.5, p);
        if (rules > 0) {
          ctx.fillStyle = `oklch(${pal.rule} 0.01 165 / ${rules})`;
          for (let r = 0; r <= rows; r++) {
            const y = L.top + (r + 0.5) * L.rowH;
            ctx.fillRect(L.tableX, Math.round(y), L.tableW * rules, 1);
          }
        }

        for (const c of cells) {
          const s = settleBase(c);
          const ci = cols.indexOf(c.col);
          const isHeader = c.row === -1;
          const fixT = c.dirty ? smooth(0.48 + c.fixOrder * 0.12, 0.52 + c.fixOrder * 0.12, p) : 0;
          const text = c.dirty && fixT > 0.5 ? c.cleanText : c.dirtyText;

          ctx.font = isHeader ? `500 ${fontSize - 1}px ${mono}` : `${fontSize}px ${mono}`;
          const tw = ctx.measureText(text).width;
          const cellX = L.tableX + L.starts[ci] + 12;
          const tx = NUMERIC.has(c.col) && !isHeader ? L.tableX + L.starts[ci] + L.widths[ci] - 14 - tw : cellX;
          const ty = L.top + (c.row + 1) * L.rowH;

          const cx = c.sx * width + Math.sin(time * 0.0004 + c.seed) * 22 * wobble;
          const cy = c.sy * height + Math.cos(time * 0.0003 + c.seed) * 16 * wobble;
          const x = mix(cx, tx, s);
          const y = mix(cy, ty, s);
          const rot = c.rot * (1 - s);

          // Amber when broken, jade as it gets fixed
          let color: string;
          if (c.dirty && fixT < 1) {
            color = `oklch(${mix(0.8, pal.fixed, fixT)} ${mix(0.15, 0.13, fixT)} ${mix(72, 155, fixT)})`;
          } else if (c.dirty) {
            color = `oklch(${pal.fixed} 0.13 155)`;
          } else if (isHeader) {
            color = `oklch(${pal.header} 0.015 165 / ${0.4 + s * 0.6})`;
          } else {
            color = `oklch(${pal.text} 0.015 165 / ${0.45 + s * 0.55})`;
          }

          // A small lift and a glow while a cell is being repaired
          const pop = c.dirty ? Math.sin(Math.PI * clamp01(fixT)) * 0.18 : 0;
          if (c.dirty && fixT > 0 && fixT < 1) {
            ctx.fillStyle = `oklch(0.72 0.12 157 / ${0.18 * Math.sin(Math.PI * fixT)})`;
            ctx.fillRect(L.tableX + L.starts[ci] + 4, ty - L.rowH / 2 + 3, L.widths[ci] - 8, L.rowH - 6);
          }

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(rot);
          ctx.scale(1 + pop, 1 + pop);
          ctx.fillStyle = color;
          ctx.fillText(text, 0, 0);
          ctx.restore();
        }
      };

      // Scrim behind the copy, painted under the light disc so the disc covers it
      const scrim = ctx.createLinearGradient(0, 0, 0, height * 0.42);
      scrim.addColorStop(0, "oklch(0.13 0.015 165)");
      scrim.addColorStop(0.55, "oklch(0.13 0.015 165 / 0.85)");
      scrim.addColorStop(1, "oklch(0.13 0.015 165 / 0)");
      ctx.fillStyle = scrim;
      ctx.fillRect(0, 0, width, height * 0.42);

      drawTable(DARK);
      if (radius > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx0, cy0, radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = "oklch(0.975 0.005 165)";
        ctx.fillRect(0, 0, width, height);
        drawTable(LIGHT);
        ctx.restore();
      }

      // Overlay copy and the counter
      const ranges = [[-1, 0.33], [0.33, 0.64], [0.64, 2]];
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const [a, b] = ranges[i];
        const v = smooth(a, a + 0.04, p) * (1 - smooth(b - 0.04, b, p));
        el.style.opacity = String(v);
        el.style.transform = `translateY(${(1 - v) * 12}px)`;
      });
      const broken = Math.round(503 * (1 - smooth(0.5, 0.66, p)));
      if (counterRef.current) counterRef.current.textContent = String(broken);
      if (counterLabelRef.current) {
        counterLabelRef.current.textContent = broken === 0 ? "broken cells · 497 of 500 rows kept" : "broken cells in the file";
      }
    };

    const loop = (now: number) => {
      progress += (target - progress) * (reduced ? 1 : 0.12);
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    measure();
    draw(performance.now());

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        target = self.progress;
      },
      onToggle: (self) => {
        if (self.isActive) return start();
        // Leaving: land exactly on the start or end state instead of mid-ease
        progress = target = self.progress;
        draw(performance.now());
        stop();
      },
    });
    // Also animate the chaos while the section approaches the viewport
    const near = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    near.observe(section);

    const resize = new ResizeObserver(() => {
      measure();
      draw(performance.now());
    });
    resize.observe(stage);

    return () => {
      stop();
      trigger.kill();
      near.disconnect();
      resize.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="relative h-[420vh]" aria-label="How Jade cleans a dataset">
      <div
        ref={stageRef}
        className="sticky top-0 h-svh overflow-hidden bg-stage"
      >
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0" />

        {/* Difference blending keeps the copy readable as the light passes behind it */}
        <div className="relative mx-auto flex max-w-[1240px] items-start justify-between gap-8 px-5 pt-[13vh] text-white mix-blend-difference sm:px-8 md:pt-[12vh]">
          <div className="relative min-h-[11rem] flex-1 sm:min-h-[9rem]">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className="absolute inset-x-0 top-0 will-change-transform"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <p className="font-mono text-sm opacity-60">0{i + 1} / 03</p>
                <h3 className="font-display mt-2 text-[clamp(2.25rem,5vw,4rem)] leading-none">{step.title}</h3>
                <p className="mt-4 max-w-[46ch] text-base leading-relaxed opacity-75 sm:text-lg">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="hidden shrink-0 text-right md:block">
            <span ref={counterRef} className="font-display block text-[clamp(3rem,6vw,5.5rem)] leading-none tabular-nums">
              503
            </span>
            <span ref={counterLabelRef} className="mt-2 block text-sm opacity-60">
              broken cells in the file
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
