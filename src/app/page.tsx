import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import DecryptedText from "@/components/react-bits/DecryptedText";
import HeroVideo from "@/components/HeroVideo";
import HowItWorks from "@/components/HowItWorks";
import Pipeline from "@/components/Pipeline";

const APP_URL = "https://jadeaiapp.vercel.app";
const REPO_URL = "https://github.com/erik-ksth/jade-ai";

const STACK = [
  { name: "Next.js + React", role: "The workspace: AG Grid table, chat, and a Chart.js dashboard." },
  { name: "FastAPI", role: "File parsing with pandas, and chat responses streamed over SSE." },
  { name: "LangGraph", role: "Routes each request and runs the multi-pass cleaning loop." },
  { name: "Groq · gpt-oss-120b", role: "Fast generation for the pandas code and the result summaries." },
];

function PrimaryLink({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <a
      href={APP_URL}
      target="_blank"
      rel="noreferrer"
      className={`group inline-flex h-12 items-center gap-2 rounded-full bg-surface pl-6 pr-5 font-medium text-jade-950 transition-[background-color,transform] duration-200 hover:bg-white active:scale-[0.98] ${className}`}
    >
      {children}
      <ArrowUpRight className="size-[18px] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

function SourceLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex h-12 items-center gap-2 px-2 font-medium text-jade-100 underline decoration-jade-100/30 underline-offset-[6px] transition-colors duration-200 hover:decoration-jade-100 ${className}`}
    >
      <Github className="size-[18px]" />
      Read the source
    </a>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero: jade band; the video frame runs past its lower edge */}
      <header className="relative isolate text-jade-100">
        <div className="grain absolute inset-x-0 top-0 -z-10 h-[calc(100%-clamp(6rem,14vw,13rem))] overflow-hidden bg-jade-900" />

        <nav className="mx-auto flex h-20 max-w-[1240px] items-center justify-between px-5 sm:px-8">
          <a href="#" className="flex items-center gap-2.5" aria-label="Jade AI home">
            <Image src="/icon.png" alt="" width={287} height={323} className="h-6 w-auto" priority />
            <span className="text-[19px] font-semibold tracking-[-0.02em] text-white">Jade AI</span>
          </a>
          <div className="flex items-center gap-1 sm:gap-2">
            <a href="#how-it-works" className="hidden px-3 py-2 text-[15px] text-jade-100/70 transition-colors hover:text-white md:block">
              How it works
            </a>
            <a href="#under-the-hood" className="hidden px-3 py-2 text-[15px] text-jade-100/70 transition-colors hover:text-white md:block">
              Under the hood
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Source code on GitHub"
              className="flex size-10 items-center justify-center rounded-full text-jade-100/70 transition-colors hover:text-white"
            >
              <Github className="size-5" />
            </a>
            <a
              href={APP_URL}
              target="_blank"
              rel="noreferrer"
              className="ml-1 inline-flex h-9 items-center rounded-full px-4 text-[15px] font-medium text-white ring-1 ring-white/25 transition-colors hover:bg-white/10"
            >
              Open the app
            </a>
          </div>
        </nav>

        <div className="mx-auto max-w-[1240px] px-5 pt-12 sm:px-8 lg:pt-14">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="rise text-[clamp(3.25rem,8vw,6rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white lg:col-span-7">
              Ask for
              <br />
              <DecryptedText
                text="clean data."
                delay={350}
                speed={55}
                className="text-jade-300"
                encryptedClassName="font-mono font-normal text-jade-300/45"
              />
            </h1>

            <div className="lg:col-span-5 lg:pb-2">
              <p className="rise max-w-[40ch] text-lg leading-relaxed text-jade-100/80 [--delay:120ms] sm:text-xl">
                Jade is an AI data analyst. Drop in a messy spreadsheet, say what you need in plain English, and it
                writes and runs the pandas code, then charts the result.
              </p>
              <div className="rise mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 [--delay:200ms]">
                <PrimaryLink>Open the app</PrimaryLink>
                <SourceLink />
              </div>
              <p className="rise mt-6 text-sm text-jade-100/55 [--delay:260ms]">
                Winner, Best Use of Groq at Cal Hacks 12.0
              </p>
            </div>
          </div>

          <div className="rise mt-14 rounded-[22px] bg-jade-950/50 p-1.5 shadow-[0_60px_120px_-40px_oklch(0.16_0.04_165/0.7)] ring-1 ring-white/10 [--delay:320ms] sm:p-2 lg:mt-14">
            <HeroVideo />
          </div>
        </div>
      </header>

      <main>
        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-[1240px] scroll-mt-8 px-5 pb-20 pt-24 sm:px-8 lg:pb-12 lg:pt-36">
          <div className="max-w-[44rem]">
            <h2 className="text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              From a messy file to a chart you can trust.
            </h2>
            <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
              Real data arrives with gaps, typos, and placeholder junk. Jade handles the cleanup as a conversation, and
              shows its work at every step.
            </p>
          </div>
          <div className="mt-12 lg:mt-8">
            <HowItWorks />
          </div>
        </section>

        {/* Under the hood */}
        <section id="under-the-hood" className="bg-graphite text-white">
          <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:py-32">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <h2 className="text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] lg:col-span-6">
                Under the hood
              </h2>
              <p className="max-w-[52ch] text-lg leading-relaxed text-white/65 lg:col-span-6">
                A LangGraph workflow decides what you are asking for, writes pandas code, runs it against your data, and
                checks the result before it answers.
              </p>
            </div>

            <div className="mt-14 lg:mt-20">
              <Pipeline />
            </div>

            <dl className="mt-20 grid gap-x-10 gap-y-8 border-t border-graphite-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
              {STACK.map((item) => (
                <div key={item.name}>
                  <dt className="font-medium text-white">{item.name}</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-white/55">{item.role}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      {/* Closing band */}
      <footer className="grain relative isolate overflow-hidden bg-jade-900 text-jade-100">
        <div className="mx-auto max-w-[1240px] px-5 pb-10 pt-24 sm:px-8 lg:pt-32">
          <h2 className="max-w-[16ch] text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-white">
            Try it on the sample data.
          </h2>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-jade-100/75">
            No sign-up. Open the app, choose “Try sample data”, and ask Jade to clean it up.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
            <PrimaryLink>Open the app</PrimaryLink>
            <SourceLink />
          </div>

          <div className="mt-24 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-jade-100/55 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Jade AI</p>
            <p>Built at Cal Hacks 12.0 · Best Use of Groq</p>
          </div>
        </div>
      </footer>
    </>
  );
}
