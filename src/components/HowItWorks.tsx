"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Drop in a messy file",
    body: "Upload a CSV or Excel file, or start from the sample. Jade counts the empty cells and flags junk values like ERROR and UNKNOWN before you ask a thing.",
    image: "/product/messy-table.jpg",
    alt: "Jade's data table with 329 empty cells and 174 invalid values highlighted in amber",
  },
  {
    title: "Ask in plain English",
    body: "Say what you want. Jade writes pandas code, runs it on your data, checks the result, and keeps going until the issues are gone. Every line of code stays one click away.",
    image: "/product/cleaning-pass.jpg",
    alt: "The assistant panel showing a cleaning pass and the Python code Jade generated",
  },
  {
    title: "Get a dataset you can use",
    body: "Missing totals are recalculated from quantity and price instead of deleted, so 497 of 500 rows survive. Then ask for a chart and arrange it on a printable dashboard.",
    image: "/product/dashboard.jpg",
    alt: "A bar chart of total sales by item on Jade's dashboard",
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  // The step crossing the middle of the viewport drives the sticky image
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid gap-x-16 lg:grid-cols-12">
      <ol className="lg:col-span-5">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            data-index={i}
            className="flex flex-col justify-center border-t border-rule py-12 first:border-t-0 lg:min-h-[72vh] lg:border-t-0 lg:py-0"
          >
            <span
              className={cn(
                "text-sm font-medium tabular-nums transition-colors duration-300",
                active === i ? "text-jade-700" : "text-ink-soft/60 lg:text-ink-soft/40"
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3
              className={cn(
                "mt-3 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] transition-colors duration-300",
                active === i ? "text-ink" : "text-ink lg:text-ink/35"
              )}
            >
              {step.title}
            </h3>
            <p
              className={cn(
                "mt-4 max-w-[46ch] text-lg leading-relaxed transition-colors duration-300",
                active === i ? "text-ink-soft" : "text-ink-soft lg:text-ink-soft/50"
              )}
            >
              {step.body}
            </p>
            {/* Small screens: the image sits with its step */}
            <div className="mt-8 overflow-hidden rounded-2xl ring-1 ring-ink/10 lg:hidden">
              <Image src={step.image} alt={step.alt} width={1612} height={1280} className="h-auto w-full" />
            </div>
          </li>
        ))}
      </ol>

      <div className="hidden lg:col-span-7 lg:block">
        <div className="sticky top-[max(6rem,calc(50vh-17rem))]">
          <div className="relative aspect-[1612/1280] overflow-hidden rounded-[22px] bg-graphite shadow-[0_40px_80px_-40px_oklch(0.2_0.03_165/0.55)] ring-1 ring-ink/10">
            {STEPS.map((step, i) => (
              <Image
                key={step.image}
                src={step.image}
                alt={step.alt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className={cn(
                  "object-cover transition-[opacity,transform] duration-500 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
                  active === i ? "opacity-100 scale-100" : "opacity-0 scale-[1.015]"
                )}
                aria-hidden={active !== i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
