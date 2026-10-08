"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowDown, ArrowUpRight, Github } from "lucide-react";
import DecryptedText from "@/components/react-bits/DecryptedText";
import HeroFlow from "@/components/HeroFlow";
import HeroVideo from "@/components/HeroVideo";
import { APP_URL, REPO_URL } from "@/lib/links";

export default function Hero() {
  const frameRef = useRef<HTMLDivElement>(null);

  return (
    <header className="relative isolate overflow-hidden bg-stage text-on-stage">
      <HeroFlow target={frameRef} />

      <nav className="relative z-10 mx-auto flex h-20 max-w-[1320px] items-center justify-between px-5 sm:px-8">
        <a href="#" className="flex items-center gap-2.5" aria-label="Jade AI home">
          <Image src="/icon.png" alt="" width={287} height={323} className="h-6 w-auto" priority />
          <span className="font-display text-[17px] tracking-[-0.02em]">Jade AI</span>
        </a>
        <div className="flex items-center gap-1 sm:gap-2">
          <a href="#how-it-works" className="hidden px-3 py-2 text-[15px] text-on-stage-soft transition-colors hover:text-on-stage md:block">
            How it works
          </a>
          <a href="#under-the-hood" className="hidden px-3 py-2 text-[15px] text-on-stage-soft transition-colors hover:text-on-stage md:block">
            Under the hood
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Source code on GitHub"
            className="flex size-10 items-center justify-center rounded-full text-on-stage-soft transition-colors hover:text-on-stage"
          >
            <Github className="size-5" />
          </a>
          <a
            href={APP_URL}
            target="_blank"
            rel="noreferrer"
            className="ml-1 inline-flex h-9 items-center rounded-full px-4 text-[15px] font-medium ring-1 ring-on-stage/20 transition-colors hover:bg-on-stage/10"
          >
            Open the app
          </a>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-[1320px] px-5 pb-20 pt-10 text-center sm:px-8 sm:pb-28 lg:pt-14">
        <h1 className="font-display rise text-[clamp(2.9rem,7.6vw,6rem)] leading-[0.95]">
          Ask for{" "}
          <DecryptedText
            text="clean data."
            delay={500}
            speed={60}
            className="text-jade-300"
            encryptedClassName="font-mono font-normal text-amber/70"
          />
        </h1>
        <p className="rise mx-auto mt-6 max-w-[50ch] text-lg leading-relaxed text-on-stage-soft [--delay:140ms] sm:text-xl">
          Jade is an AI data analyst. Drop in a messy spreadsheet, ask in plain English, and it writes the pandas, runs
          it, and hands back clean data and charts.
        </p>
        <div className="rise mt-9 flex flex-wrap items-center justify-center gap-3 [--delay:220ms]">
          <a
            href={APP_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-jade-300 pl-6 pr-5 font-medium text-jade-950 transition-[background-color,transform] duration-200 hover:bg-jade-100 active:scale-[0.98]"
          >
            Open the app
            <ArrowUpRight className="size-[18px] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href="#how-it-works"
            className="inline-flex h-12 items-center gap-2 rounded-full px-5 font-medium text-on-stage ring-1 ring-on-stage/20 transition-colors hover:bg-on-stage/10"
          >
            See how it cleans
            <ArrowDown className="size-[18px]" />
          </a>
        </div>
        <p className="rise mt-6 text-sm text-on-stage-soft/80 [--delay:280ms]">Winner, Best Use of Groq at Cal Hacks 12.0</p>

        {/* The "machine": messy values flow into the demo and leave as clean rows */}
        <div className="relative mx-auto mt-14 max-w-[1040px] sm:mt-16">
          <span className="absolute right-full top-1/2 mr-5 hidden -translate-y-1/2 whitespace-nowrap font-mono text-xs text-amber lg:block">
            messy in →
          </span>
          <span className="absolute left-full top-1/2 ml-5 hidden -translate-y-1/2 whitespace-nowrap font-mono text-xs text-jade-300 lg:block">
            → clean out
          </span>
          <div
            ref={frameRef}
            className="rise rounded-[20px] bg-stage-raised p-1.5 text-left shadow-[0_50px_120px_-30px_oklch(0.05_0.02_165/0.9)] ring-1 ring-on-stage/10 [--delay:360ms] sm:p-2"
          >
            <HeroVideo />
          </div>
        </div>
      </div>
    </header>
  );
}
