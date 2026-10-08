"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * How it works: one excerpt of the sample file that changes as the reader
 * scrolls through Detect → Repair → Verify. The rows are the first ten rows of
 * the app's sample file; repairs mirror what the cleaning pass does to them.
 */

type Cell = string | { dirty: string; clean: string; formula?: string };

const COLUMNS = ["Item", "Qty", "Price", "Total", "Payment", "Location"];
const NUMERIC = new Set([1, 2, 3]);
const NR = "Not recorded";

const ROWS: Cell[][] = [
  ["Coffee", "2", "2.0", "4.0", "Credit Card", "Takeaway"],
  ["Cake", "4", "3.0", "12.0", "Cash", "In-store"],
  ["Cookie", "4", "1.0", { dirty: "ERROR", clean: "4.0", formula: "= 4 × 1.0" }, "Credit Card", "In-store"],
  ["Salad", "2", "5.0", "10.0", { dirty: "UNKNOWN", clean: NR }, { dirty: "UNKNOWN", clean: NR }],
  ["Coffee", "2", "2.0", "4.0", "Digital Wallet", "In-store"],
  ["Smoothie", "5", "4.0", "20.0", "Credit Card", { dirty: "—", clean: NR }],
  [{ dirty: "UNKNOWN", clean: NR }, "3", "3.0", "9.0", { dirty: "ERROR", clean: NR }, "Takeaway"],
  ["Sandwich", "4", "4.0", "16.0", "Cash", { dirty: "UNKNOWN", clean: NR }],
  [{ dirty: "—", clean: NR }, "5", "3.0", "15.0", { dirty: "—", clean: NR }, "Takeaway"],
  ["Sandwich", "5", "4.0", "20.0", { dirty: "—", clean: NR }, "In-store"],
];

// Stagger repaired cells in reading order
let counter = 0;
const ORDER = ROWS.map((row) => row.map((cell) => (typeof cell === "string" ? 0 : counter++)));

const STEPS = [
  {
    title: "Detect",
    body: "Upload a CSV or Excel file. Jade checks every cell and flags blanks and placeholder junk like ERROR and UNKNOWN before you type a word.",
    status: "10 issues in these rows · 503 across the file",
  },
  {
    title: "Repair",
    body: "Ask it to clean up. Jade writes pandas for the fixes: totals are recalculated from quantity and price, and gaps it can't recover are labeled instead of guessed.",
    status: "1 value recalculated · 9 gaps labeled “Not recorded”",
  },
  {
    title: "Verify",
    body: "Then it re-checks the result and reports what changed. In the sample file, one request leaves no issues and keeps 497 of 500 rows.",
    status: "0 issues · 497 of 500 rows kept",
  },
];

function LedgerCell({ cell, col, step, order }: { cell: Cell; col: number; step: number; order: number }) {
  const numeric = NUMERIC.has(col);
  if (typeof cell === "string") {
    return <td className={cn("px-3 py-2.5 sm:px-4", numeric && "text-right")}>{cell}</td>;
  }

  const repaired = step >= 1;
  const value = repaired ? cell.clean : cell.dirty;
  const isLabel = repaired && cell.clean === NR;

  return (
    <td
      className={cn(
        "px-3 py-2.5 transition-colors duration-500 ease-out sm:px-4",
        numeric && "text-right",
        step === 0 && "bg-amber-soft text-amber",
        step === 1 && "bg-jade-soft",
        isLabel && "text-ink-faint italic"
      )}
      style={{ transitionDelay: `${order * 45}ms` }}
    >
      <span className="inline-flex items-baseline gap-2">
        {value}
        {repaired && cell.formula && (
          <span className={cn("text-[11px] text-jade transition-opacity duration-500", step === 2 && "opacity-70")}>
            {cell.formula}
          </span>
        )}
      </span>
    </td>
  );
}

export default function Ledger() {
  const [step, setStep] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setStep(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const figure = (
    <figure className="lg:sticky lg:top-[max(5rem,calc(50vh-15rem))]">
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-rule-strong">
        <div className="flex items-center justify-between border-b border-rule px-4 py-3 font-mono text-xs text-ink-soft">
          <span>cafe_sales.csv</span>
          <span>rows 1–10 of 500</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] whitespace-nowrap font-mono text-[12px] tabular-nums sm:text-[13px]">
            <thead>
              <tr className="border-b border-rule text-ink-faint">
                {COLUMNS.map((c, i) => (
                  <th key={c} scope="col" className={cn("px-3 py-2.5 font-normal sm:px-4", NUMERIC.has(i) ? "text-right" : "text-left")}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, r) => (
                <tr key={r} className="border-b border-rule last:border-0">
                  {row.map((cell, c) => (
                    <LedgerCell key={c} cell={cell} col={c} step={step} order={ORDER[r][c]} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className={cn(
            "flex items-center gap-2.5 border-t px-4 py-3 text-sm transition-colors duration-500",
            step === 0 ? "border-amber/20 bg-amber-soft/60" : "border-jade/15 bg-jade-soft/60"
          )}
          aria-live="polite"
        >
          {step === 2 ? (
            <Check className="size-4 text-jade" strokeWidth={2.5} />
          ) : (
            <span className={cn("size-2 rounded-full", step === 0 ? "bg-amber" : "bg-jade")} />
          )}
          <span className="font-medium">{STEPS[step].status}</span>
        </div>
      </div>
      <figcaption className="mt-4 font-mono text-xs leading-relaxed text-ink-faint">
        Fig. 3 — The first ten rows of the sample file, as Jade cleans them.
      </figcaption>
    </figure>
  );

  return (
    <div className="grid gap-x-16 lg:grid-cols-12">
      {/* Small screens: the reader picks the step */}
      <div className="lg:hidden">
        <div role="tablist" aria-label="Cleaning steps" className="grid grid-cols-3 rounded-full bg-panel p-1 ring-1 ring-rule">
          {STEPS.map((s, i) => (
            <button
              key={s.title}
              role="tab"
              aria-selected={step === i}
              onClick={() => setStep(i)}
              className={cn(
                "h-10 rounded-full text-sm font-medium transition-colors duration-200",
                step === i ? "bg-white text-ink shadow-sm ring-1 ring-rule" : "text-ink-soft"
              )}
            >
              {i + 1}. {s.title}
            </button>
          ))}
        </div>
        <p className="mt-5 min-h-[7.5rem] text-base leading-relaxed text-ink-soft">{STEPS[step].body}</p>
      </div>

      <div className="mt-2 lg:order-2 lg:col-span-7 lg:mt-0">{figure}</div>

      {/* Wide screens: scrolling through the steps drives the figure */}
      <ol className="hidden lg:order-1 lg:col-span-5 lg:block">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            data-index={i}
            className="flex min-h-[80vh] flex-col justify-center"
          >
            <p className={cn("font-mono text-sm transition-colors duration-300", step === i ? "text-jade" : "text-ink-faint")}>
              0{i + 1}
            </p>
            <h3
              className={cn(
                "mt-3 text-[clamp(2rem,3.4vw,2.75rem)] font-medium leading-none tracking-[-0.03em] transition-colors duration-300",
                step === i ? "text-ink" : "text-ink/30"
              )}
            >
              {s.title}
            </h3>
            <p className={cn("mt-4 max-w-[42ch] text-lg leading-relaxed transition-colors duration-300", step === i ? "text-ink-soft" : "text-ink-soft/50")}>
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
