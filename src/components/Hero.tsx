import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import HeroVideo from "@/components/HeroVideo";
import { APP_URL, REPO_URL } from "@/lib/links";
import { cn } from "@/lib/utils";

// Panels of the recorded workspace, as a share of the frame width
const ANNOTATIONS = [
  { at: "8%", align: "start", title: "Files", body: "CSV and Excel, every sheet." },
  { at: "44%", align: "center", title: "Workspace", body: "Flags blanks and junk values; charts land on a dashboard." },
  { at: "86%", align: "end", title: "Assistant", body: "Writes and runs pandas, then explains the result." },
] as const;

export default function Hero() {
  return (
    <header className="relative">
      <nav className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-5 sm:px-8">
        <a href="#" className="flex items-center gap-2.5" aria-label="Jade AI home">
          <Image src="/icon.png" alt="" width={287} height={323} className="h-[22px] w-auto" priority />
          <span className="font-display text-lg font-semibold tracking-[-0.02em]">Jade AI</span>
        </a>
        <div className="flex items-center gap-1 sm:gap-2">
          <a href="#how-it-works" className="hidden px-3 py-2 text-[15px] text-ink-soft transition-colors hover:text-ink md:block">
            How it works
          </a>
          <a href="#under-the-hood" className="hidden px-3 py-2 text-[15px] text-ink-soft transition-colors hover:text-ink md:block">
            Under the hood
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Source code on GitHub"
            className="flex size-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:text-ink"
          >
            <Github className="size-5" />
          </a>
          <a
            href={APP_URL}
            target="_blank"
            rel="noreferrer"
            className="ml-1 inline-flex h-9 items-center rounded-full px-4 text-[15px] font-medium ring-1 ring-rule-strong transition-colors hover:bg-panel"
          >
            Open the app
          </a>
        </div>
      </nav>

      <div className="mx-auto max-w-[1240px] px-5 pt-12 sm:px-8 lg:pt-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <h1 className="rise text-[clamp(3rem,6.4vw,5.5rem)] font-medium leading-[0.96] tracking-[-0.035em] lg:col-span-7">
            Ask for clean data.
          </h1>
          <div className="lg:col-span-5 lg:pb-1.5">
            <p className="rise max-w-[44ch] text-lg leading-relaxed text-ink-soft [--delay:100ms]">
              Jade is an AI data analyst for messy spreadsheets. Describe the fix in plain English. Jade writes the pandas,
              runs it on your file, and shows its work.
            </p>
            <div className="rise mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 [--delay:180ms]">
              <a
                href={APP_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-ink pl-5 pr-4 font-medium text-paper transition-colors duration-200 hover:bg-ink/85"
              >
                Open the app
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline decoration-rule-strong underline-offset-[6px] transition-colors hover:decoration-ink"
              >
                Read the source
              </a>
            </div>
          </div>
        </div>

        <figure className="mt-14 lg:mt-20">
          {/* Annotations with leader lines into the figure (wide screens) */}
          <div aria-hidden className="relative z-10 hidden h-[5.5rem] lg:block">
            {ANNOTATIONS.map((a, i) => (
              <div
                key={a.title}
                className={cn(
                  "rise absolute bottom-0 flex flex-col [--delay:var(--d)]",
                  a.align === "start" && "items-start",
                  a.align === "center" && "-translate-x-1/2 items-center",
                  a.align === "end" && "-translate-x-full items-end"
                )}
                style={{ left: a.at, ["--d" as string]: `${420 + i * 90}ms` }}
              >
                <p className={cn("max-w-[15rem] text-sm leading-snug", a.align === "center" && "text-center", a.align === "end" && "text-right")}>
                  <span className="font-medium">{a.title}</span>
                  <span className="text-ink-soft"> — {a.body}</span>
                </p>
                <span
                  className="leader mt-2 block h-9 w-px bg-ink/30"
                  style={{ ["--delay" as string]: `${700 + i * 90}ms` }}
                />
                <span className="-mb-1 block size-[7px] rounded-full border border-paper bg-jade-bright" />
              </div>
            ))}
          </div>

          <div className="rise rounded-[16px] bg-night p-1.5 shadow-[0_40px_80px_-40px_oklch(0.2_0.02_165/0.55)] ring-1 ring-ink/10 [--delay:300ms]">
            <HeroVideo />
          </div>

          <figcaption className="mt-4 flex flex-col gap-3 font-mono text-xs leading-relaxed text-ink-faint sm:flex-row sm:justify-between">
            <span>Fig. 1 — The Jade workspace, recorded on the live app with its built-in sample file.</span>
            <span>Waiting on the model is sped up.</span>
          </figcaption>

          {/* Annotations as a list (small screens) */}
          <dl className="mt-8 grid gap-4 border-t border-rule pt-6 sm:grid-cols-3 lg:hidden">
            {ANNOTATIONS.map((a) => (
              <div key={a.title}>
                <dt className="text-sm font-medium">{a.title}</dt>
                <dd className="mt-1 text-sm text-ink-soft">{a.body}</dd>
              </div>
            ))}
          </dl>
        </figure>
      </div>
    </header>
  );
}
