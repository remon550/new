"use client";

import { useEffect, useMemo, useState } from "react";
import {
  renderHighlightedText,
  translate,
  type ReadingLevel
} from "./lib/translator";

const DEFAULT_INPUT =
  "GM! I'm thinking of staking on a L2 to avoid high gas fees. WAGMI?";

const EMPTY_OUTPUTS = {
  plain: "No output yet.",
  xReady: "No output yet.",
  newbie: "No output yet."
};

type OutputCardProps = {
  title: string;
  text: string;
  highlight: boolean;
  onCopy: () => void;
};

const OutputCard = ({ title, text, highlight, onCopy }: OutputCardProps) => {
  const html = useMemo(() => renderHighlightedText(text, highlight), [text, highlight]);

  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-xl shadow-slate-950/40">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:border-emerald-300/40 hover:text-emerald-200"
        >
          Copy
        </button>
      </div>
      <div
        className="min-h-[120px] whitespace-pre-wrap text-sm leading-relaxed text-slate-200"
        dangerouslySetInnerHTML={{ __html: html || "<span class='text-slate-500'>No output yet.</span>" }}
      />
      <div className="text-xs text-slate-400">
        {text.length} characters
      </div>
    </div>
  );
};

const ToggleButton = ({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
      active
        ? "border-emerald-300/70 bg-emerald-300/20 text-emerald-100"
        : "border-white/10 bg-white/5 text-slate-300 hover:border-white/30"
    }`}
  >
    {label}
  </button>
);

const SwitchToggle = ({
  label,
  enabled,
  onChange
}: {
  label: string;
  enabled: boolean;
  onChange: () => void;
}) => (
  <button
    type="button"
    onClick={onChange}
    className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
  >
    <span>{label}</span>
    <span
      className={`relative h-5 w-10 rounded-full transition ${
        enabled ? "bg-emerald-400/80" : "bg-white/10"
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
          enabled ? "left-5" : "left-1"
        }`}
      />
    </span>
  </button>
);

export default function Home() {
  const [inputText, setInputText] = useState(DEFAULT_INPUT);
  const [readingLevel, setReadingLevel] = useState<ReadingLevel>("simple");
  const [keepKeyTerms, setKeepKeyTerms] = useState(true);
  const [highlightTerms, setHighlightTerms] = useState(true);
  const [outputs, setOutputs] = useState(EMPTY_OUTPUTS);

  const runTranslation = () => {
    if (!inputText.trim()) {
      setOutputs(EMPTY_OUTPUTS);
      return;
    }

    const result = translate(inputText, { readingLevel, keepKeyTerms });
    setOutputs({
      plain: result.plain,
      xReady: result.xReady,
      newbie: result.newbie
    });
  };

  useEffect(() => {
    if (!inputText.trim()) {
      setOutputs(EMPTY_OUTPUTS);
      return;
    }

    const timer = window.setTimeout(() => {
      runTranslation();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [inputText, readingLevel, keepKeyTerms]);

  const handleTranslate = () => {
    runTranslation();
  };

  const handleClear = () => {
    setInputText("");
    setOutputs(EMPTY_OUTPUTS);
  };

  const handleCopy = async (text: string) => {
    if (!text) {
      return;
    }

    await navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 pb-16 pt-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-3 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-emerald-300/70">
            Say It Plain
          </p>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Say It Plain
          </h1>
          <p className="text-base text-slate-400">
            Turn crypto jargon into human language.
          </p>
        </header>

        <section className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Reading level
            </span>
            <ToggleButton
              label="Simple"
              active={readingLevel === "simple"}
              onClick={() => setReadingLevel("simple")}
            />
            <ToggleButton
              label="Normal"
              active={readingLevel === "normal"}
              onClick={() => setReadingLevel("normal")}
            />
          </div>
              <SwitchToggle
                label="Keep key terms"
                enabled={keepKeyTerms}
                onChange={() => setKeepKeyTerms((value) => !value)}
              />
              <SwitchToggle
                label="Highlight replaced terms"
                enabled={highlightTerms}
                onChange={() => setHighlightTerms((value) => !value)}
              />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/40">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Input</h2>
              <span className="text-xs text-slate-400">{inputText.length} characters</span>
            </div>
            <textarea
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              placeholder="Paste crypto jargon here..."
              className="min-h-[280px] flex-1 rounded-xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-100 focus:border-emerald-300/50 focus:outline-none"
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleTranslate}
                className="rounded-full bg-emerald-400/90 px-5 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
              >
                Translate
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/30"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="grid gap-6">
            <OutputCard
              title="Plain"
              text={outputs.plain}
              highlight={highlightTerms}
              onCopy={() => handleCopy(outputs.plain)}
            />
            <OutputCard
              title="X-ready"
              text={outputs.xReady}
              highlight={highlightTerms}
              onCopy={() => handleCopy(outputs.xReady)}
            />
            <OutputCard
              title="Newbie"
              text={outputs.newbie}
              highlight={highlightTerms}
              onCopy={() => handleCopy(outputs.newbie)}
            />
          </div>
        </section>
        <footer className="mt-8 text-center text-xs text-slate-500/80">
          Built by{" "}
          <a
            href="https://x.com/uiuxweb"
            target="_blank"
            rel="noreferrer"
            className="transition hover:underline"
          >
            @uiuxweb
          </a>
        </footer>
      </div>
    </main>
  );
}
