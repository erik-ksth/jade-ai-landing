import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

// A highlight steps through the nodes in order, so the flow reads at a glance
const pulse = (step: number): CSSProperties => ({ ["--pulse-delay" as string]: `${step * 0.55}s` });

function Node({ title, file, step, accent = false }: { title: string; file: string; step: number; accent?: boolean }) {
  return (
    <div
      style={pulse(step)}
      className={cn(
        "pipeline-node rounded-xl border px-4 py-3",
        accent ? "border-jade-700/30 bg-jade-100" : "border-rule bg-white"
      )}
    >
      <p className="text-[15px] font-medium leading-snug text-ink">{title}</p>
      <p className="mt-1 font-mono text-[11px] leading-none text-jade-700">{file}</p>
    </div>
  );
}

function Arrow({ step, className }: { step: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 12"
      style={pulse(step)}
      className={cn("pipeline-arrow h-3 w-6 shrink-0 text-ink/25", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M0 6h22M17 1l5 5-5 5" />
    </svg>
  );
}

function Lane({ label, note, children }: { label: string; note: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/15 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm font-medium text-jade-700">{label}</p>
        <p className="text-xs text-ink-soft">{note}</p>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">{children}</div>
    </div>
  );
}

/**
 * The LangGraph workflow behind every chat message: classify, then either the
 * multi-pass cleaning loop or a single generate → run → summarize pass, then
 * stream back to the workspace.
 */
export default function Pipeline() {
  return (
    <figure>
      <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,10rem)_auto_minmax(0,11rem)_auto_minmax(0,1fr)_auto_minmax(0,10rem)]">
        <Node title="Your message" file="POST /chat/stream" step={0} />
        <Arrow step={0.5} className="mx-auto rotate-90 lg:rotate-0" />
        <Node title="Classify intent" file="intent_classifier.py" step={1} accent />
        <Arrow step={1.5} className="mx-auto rotate-90 lg:rotate-0" />

        <div className="flex flex-col gap-3">
          <Lane label="Broad cleaning" note="Repeats until clean · stops when a pass makes no progress">
            <Node title="Assess quality" file="quality_assessor.py" step={2} />
            <Arrow step={2.5} className="rotate-90 self-center sm:rotate-0" />
            <Node title="Write the fix" file="code_generator.py" step={3} />
            <Arrow step={3.5} className="rotate-90 self-center sm:rotate-0" />
            <Node title="Run pandas" file="code_executor.py" step={4} />
          </Lane>
          <Lane label="Transform · analyze · chart" note="One pass">
            <Node title="Write code" file="code_generator.py" step={2} />
            <Arrow step={2.5} className="rotate-90 self-center sm:rotate-0" />
            <Node title="Run pandas" file="code_executor.py" step={3} />
            <Arrow step={3.5} className="rotate-90 self-center sm:rotate-0" />
            <Node title="Summarize" file="response_generator.py" step={4} />
          </Lane>
        </div>

        <Arrow step={4.5} className="mx-auto rotate-90 lg:rotate-0" />
        <Node title="Stream to the workspace" file="server-sent events" step={5} accent />
      </div>
      <figcaption className="mt-6 max-w-[62ch] text-sm leading-relaxed text-ink-soft">
        Each request is routed by intent. Broad cleaning runs a quality check, writes a fix, runs it, and checks again.
        Tokens stream to the chat as they are generated; the updated table and any chart arrive when the run finishes.
      </figcaption>
    </figure>
  );
}
