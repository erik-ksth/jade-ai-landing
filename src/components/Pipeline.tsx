import { cn } from "@/lib/utils";

function Node({ title, file, accent = false }: { title: string; file: string; accent?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3",
        accent ? "border-jade-700 bg-jade-950/60" : "border-graphite-line bg-graphite-raised"
      )}
    >
      <p className="text-[15px] font-medium leading-snug text-white">{title}</p>
      <p className="mt-1 font-mono text-[11px] leading-none text-jade-300/70">{file}</p>
    </div>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 12"
      className={cn("h-3 w-6 shrink-0 text-white/35", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M0 6h22M17 1l5 5-5 5" />
    </svg>
  );
}

function Lane({ label, note, children }: { label: string; note: string; children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl border border-dashed border-graphite-line p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm font-medium text-jade-300">{label}</p>
        <p className="text-xs text-white/45">{note}</p>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">{children}</div>
    </div>
  );
}

/**
 * The LangGraph workflow behind every chat message, drawn left to right:
 * classify, then either the multi-pass cleaning loop or a single
 * generate → run → summarize pass, then stream back to the workspace.
 */
export default function Pipeline() {
  return (
    <figure>
      <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,10rem)_auto_minmax(0,11rem)_auto_minmax(0,1fr)_auto_minmax(0,10rem)]">
        <Node title="Your message" file="POST /chat/stream" />
        <Arrow className="mx-auto rotate-90 lg:rotate-0" />
        <Node title="Classify intent" file="intent_classifier.py" accent />
        <Arrow className="mx-auto rotate-90 lg:rotate-0" />

        <div className="flex flex-col gap-3">
          <Lane label="Broad cleaning" note="Repeats until clean · stops if a pass makes no progress">
            <Node title="Assess quality" file="quality_assessor.py" />
            <Arrow className="rotate-90 self-center sm:rotate-0" />
            <Node title="Write the fix" file="code_generator.py" />
            <Arrow className="rotate-90 self-center sm:rotate-0" />
            <Node title="Run pandas" file="code_executor.py" />
          </Lane>
          <Lane label="Transform · analyze · chart" note="One pass">
            <Node title="Write code" file="code_generator.py" />
            <Arrow className="rotate-90 self-center sm:rotate-0" />
            <Node title="Run pandas" file="code_executor.py" />
            <Arrow className="rotate-90 self-center sm:rotate-0" />
            <Node title="Summarize" file="response_generator.py" />
          </Lane>
        </div>

        <Arrow className="mx-auto rotate-90 lg:rotate-0" />
        <Node title="Stream to the workspace" file="server-sent events" accent />
      </div>
      <figcaption className="mt-6 max-w-[62ch] text-sm leading-relaxed text-white/55">
        Each request is routed by intent. Broad cleaning runs a quality check, writes a fix, runs it, and checks again.
        Tokens stream to the chat as they are generated; the updated table and any chart arrive when the run finishes.
      </figcaption>
    </figure>
  );
}
