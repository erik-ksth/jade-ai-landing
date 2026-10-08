import Hero from "@/components/Hero";
import Closing from "@/components/Closing";
import CleanupStory from "@/components/CleanupStory";
import Pipeline from "@/components/Pipeline";
import ScrollVelocity from "@/components/react-bits/ScrollVelocity";

const PROMPTS = [
  ["Clean up missing and invalid values", "Remove duplicate rows", "Fill blanks with the median"],
  ["Chart total sales by item", "Which payment method sells most?", "Add a temp_f column"],
];

const STACK = [
  { name: "Next.js + React", role: "The workspace: AG Grid table, chat, and a Chart.js dashboard." },
  { name: "FastAPI", role: "File parsing with pandas, and chat responses streamed over SSE." },
  { name: "LangGraph", role: "Routes each request and runs the multi-pass cleaning loop." },
  { name: "Groq · gpt-oss-120b", role: "Fast generation for the pandas code and the result summaries." },
];

function PromptRow({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item) => (
        <span key={item} className="inline-flex items-center">
          <span className="px-6 sm:px-10">{item}</span>
          <span aria-hidden className="inline-block size-3 rounded-full bg-jade-400 sm:size-4" />
        </span>
      ))}
    </>
  );
}

export default function Home() {
  return (
    <>
      <Hero />

      <main>
        <CleanupStory />

        {/* Things you can ask */}
        <section aria-labelledby="prompts-title" className="overflow-hidden bg-surface pb-28 pt-24 sm:pb-36 sm:pt-32">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
            <h2 id="prompts-title" className="max-w-[24ch] text-lg leading-relaxed text-ink-soft sm:text-xl">
              No query language, no notebook. Ask the way you&apos;d ask an analyst:
            </h2>
          </div>
          <div className="mt-12 space-y-3 sm:mt-16 sm:space-y-5">
            <ScrollVelocity
              velocity={36}
              className="font-display text-[clamp(2.4rem,6vw,5.25rem)] leading-[1.15]"
              rows={PROMPTS.map((items, i) => (
                <span key={i} className={i % 2 ? "text-ink/35" : "text-ink"}>
                  <PromptRow items={items} />
                </span>
              ))}
            />
          </div>
        </section>

        {/* Under the hood */}
        <section id="under-the-hood" className="border-t border-rule bg-surface">
          <div className="mx-auto max-w-[1320px] px-5 py-24 sm:px-8 lg:py-32">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
              <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-[0.98] lg:col-span-6">Under the hood</h2>
              <p className="max-w-[52ch] text-lg leading-relaxed text-ink-soft lg:col-span-6">
                A LangGraph workflow decides what you are asking for, writes pandas code, runs it against your data, and
                checks the result before it answers.
              </p>
            </div>

            <div className="mt-14 lg:mt-20">
              <Pipeline />
            </div>

            <dl className="mt-20 grid gap-x-10 gap-y-8 border-t border-rule pt-10 sm:grid-cols-2 lg:grid-cols-4">
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

      <Closing />
    </>
  );
}
