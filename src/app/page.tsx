import { ArrowUpRight } from "lucide-react";
import Hero from "@/components/Hero";
import Ledger from "@/components/Ledger";
import Pipeline from "@/components/Pipeline";
import { APP_URL, REPO_URL } from "@/lib/links";

const RESULTS = [
  { label: "Rows", before: "500", after: "497" },
  { label: "Empty cells", before: "329", after: "0" },
  { label: "Invalid values", before: "174", after: "0" },
];

const STACK = [
  { name: "Next.js + React", role: "The workspace: AG Grid table, chat, and a Chart.js dashboard." },
  { name: "FastAPI", role: "File parsing with pandas, and chat responses streamed over SSE." },
  { name: "LangGraph", role: "Routes each request and runs the multi-pass cleaning loop." },
  { name: "Groq · gpt-oss-120b", role: "Fast generation for the pandas code and the result summaries." },
];

function SectionHeading({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-12">
      <h2 className="text-[clamp(2.25rem,4.4vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.03em] lg:col-span-7">{title}</h2>
      <p className="max-w-[48ch] text-lg leading-relaxed text-ink-soft lg:col-span-5">{children}</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Hero />

      <main>
        {/* One request, measured */}
        <section aria-labelledby="results-title" className="mx-auto max-w-[1240px] px-5 pb-24 pt-28 sm:px-8 lg:pb-32 lg:pt-40">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <h2 id="results-title" className="text-[clamp(2.25rem,4.4vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.03em]">
                One request, measured.
              </h2>
              <p className="mt-5 max-w-[42ch] text-lg leading-relaxed text-ink-soft">
                The sample file is 500 real-world cafe sales with the usual damage. One plain-English request, “Clean up
                missing and invalid values,” takes it from unusable to ready.
              </p>
            </div>
            <figure className="lg:col-span-7">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-rule-strong text-sm text-ink-faint">
                    <th scope="col" className="pb-3 font-normal">
                      <span className="sr-only">Measure</span>
                    </th>
                    <th scope="col" className="pb-3 text-right font-normal">
                      Uploaded
                    </th>
                    <th scope="col" className="pb-3 text-right font-normal">
                      After one request
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {RESULTS.map((r) => (
                    <tr key={r.label} className="border-b border-rule">
                      <th scope="row" className="py-5 text-base font-normal text-ink-soft">
                        {r.label}
                      </th>
                      <td className="py-5 text-right font-display text-[clamp(1.75rem,3vw,2.5rem)] tabular-nums text-ink-faint">
                        {r.before}
                      </td>
                      <td className="py-5 text-right font-display text-[clamp(1.75rem,3vw,2.5rem)] tabular-nums">
                        {r.after}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <figcaption className="mt-4 font-mono text-xs leading-relaxed text-ink-faint">
                Fig. 2 — The sample file before and after a single cleaning pass. Missing totals were recalculated, not
                dropped.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t border-rule">
          <div className="mx-auto max-w-[1240px] px-5 pt-24 sm:px-8 lg:pt-32">
            <SectionHeading title="How it works">
              Three steps you can watch: what was wrong, what changed, and proof that nothing is left broken.
            </SectionHeading>
            <div className="mt-12 pb-24 lg:mt-4 lg:pb-12">
              <Ledger />
            </div>
          </div>
        </section>

        {/* Under the hood */}
        <section id="under-the-hood" className="border-t border-rule bg-panel">
          <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:py-32">
            <SectionHeading title="Under the hood">
              A LangGraph workflow decides what you are asking for, writes pandas code, runs it against your data, and
              checks the result before it answers.
            </SectionHeading>

            <div className="mt-14 lg:mt-20">
              <Pipeline />
            </div>

            <dl className="mt-20 grid gap-x-10 gap-y-8 border-t border-rule-strong pt-10 sm:grid-cols-2 lg:grid-cols-4">
              {STACK.map((item) => (
                <div key={item.name}>
                  <dt className="font-medium">{item.name}</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-ink-soft">{item.role}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      {/* Closing */}
      <footer className="bg-night text-paper">
        <div className="mx-auto max-w-[1240px] px-5 pb-10 pt-24 sm:px-8 lg:pt-32">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
            <h2 className="text-[clamp(2.5rem,5.4vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.035em] lg:col-span-7">
              Try it on the sample file.
            </h2>
            <div className="lg:col-span-5 lg:pb-1.5">
              <p className="max-w-[42ch] text-lg leading-relaxed text-paper/65">
                No sign-up. Open the app, choose “Try sample data” or upload your own file, and ask Jade to clean it.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a
                  href={APP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex h-11 items-center gap-2 rounded-full bg-paper pl-5 pr-4 font-medium text-ink transition-colors duration-200 hover:bg-white"
                >
                  Open the app
                  <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline decoration-paper/30 underline-offset-[6px] transition-colors hover:decoration-paper"
                >
                  Read the source
                </a>
              </div>
            </div>
          </div>

          <div className="mt-24 flex flex-col gap-3 border-t border-paper/10 pt-8 text-sm text-paper/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Jade AI</p>
            <p>Built at Cal Hacks 12.0 · Winner, Best Use of Groq</p>
          </div>
        </div>
      </footer>
    </>
  );
}
