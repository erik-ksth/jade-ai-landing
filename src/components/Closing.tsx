"use client";

import { useRef } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import HeroFlow from "@/components/HeroFlow";
import { APP_URL, REPO_URL } from "@/lib/links";

/** Closing band: the same flow as the hero, now pouring into the call to action. */
export default function Closing() {
  const ctaRef = useRef<HTMLDivElement>(null);

  return (
    <footer className="relative isolate overflow-hidden bg-stage text-on-stage">
      <HeroFlow target={ctaRef} density={0.55} />

      <div className="relative z-10 mx-auto max-w-[1320px] px-5 pt-28 text-center sm:px-8 lg:pt-40">
        <p className="font-mono text-sm text-jade-300">500 rows · 503 broken cells · 1 request</p>
        <h2 className="font-display mx-auto mt-6 max-w-[14ch] text-[clamp(3rem,8vw,6rem)] leading-[0.92]">
          Your turn. Bring the mess.
        </h2>
        <p className="mx-auto mt-8 max-w-[46ch] text-lg leading-relaxed text-on-stage-soft">
          No sign-up. Open the app, choose “Try sample data” or upload your own file, and ask Jade to clean it.
        </p>
        <div ref={ctaRef} className="mx-auto mt-10 flex w-fit flex-wrap items-center justify-center gap-3">
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
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-stage px-5 font-medium ring-1 ring-on-stage/20 transition-colors hover:bg-stage-raised"
          >
            <Github className="size-[18px]" />
            Read the source
          </a>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-28 flex max-w-[1320px] flex-col gap-3 px-5 text-sm text-on-stage-soft sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} Jade AI</p>
        <p>Built at Cal Hacks 12.0 · Best Use of Groq</p>
      </div>

      {/* Oversized wordmark, cropped by the bottom edge */}
      <p
        aria-hidden
        className="font-display pointer-events-none relative z-0 -mb-[0.28em] mt-10 select-none whitespace-nowrap text-center text-[23vw] leading-none text-on-stage/[0.06]"
      >
        Jade AI
      </p>
    </footer>
  );
}
