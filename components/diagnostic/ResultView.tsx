"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  bandLabel,
  deriveReading,
  isComplete,
  loadAnswers,
  persistSaveStub,
  runwayDisplay,
  type AgeBand,
  type AnswerMap,
  type DerivedReading,
  type SheetId,
} from "@/lib/diagnostic";

type GateState = "hidden" | "open" | "done" | "skipped";

const AGE_OPTIONS: { value: AgeBand; label: string }[] = [
  { value: "18_24", label: "18–24" },
  { value: "25_35", label: "25–35" },
  { value: "36_49", label: "36–49" },
  { value: "50_plus", label: "50+" },
];

function EnergyNumber({ value }: { value: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(value);
      return;
    }
    const start = performance.now();
    const duration = 400;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) * (1 - t);
      setShown(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <span className="vf-result-energy__num">{shown}</span>;
}

export function ResultView() {
  const [answers, setAnswers] = useState<AnswerMap | null>(null);
  const [gate, setGate] = useState<GateState>("hidden");
  const [email, setEmail] = useState("");
  const [worry, setWorry] = useState("");
  const [ageBand, setAgeBand] = useState<AgeBand | "">("");
  const [cohort, setCohort] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadAnswers();
    setAnswers(loaded);
    const t = window.setTimeout(() => {
      setGate((g) => (g === "hidden" ? "open" : g));
    }, 10000);
    return () => window.clearTimeout(t);
  }, []);

  const reading: DerivedReading | null = useMemo(() => {
    if (!answers || !isComplete(answers)) return null;
    return deriveReading(answers);
  }, [answers]);

  if (answers && !isComplete(answers)) {
    return (
      <main className="vf-diag">
        <p className="vf-diag__eyebrow">Diagnostic</p>
        <h1 className="vf-diag__title">No complete reading yet</h1>
        <p className="vf-diag__lede">
          Finish the nineteen questions to see Position, Energy Index, and three
          moves.
        </p>
        <Link href="/diagnostic/run" className="vf-btn vf-btn--primary">
          Continue diagnostic
        </Link>
      </main>
    );
  }

  if (!reading) {
    return (
      <main className="vf-diag">
        <p className="vf-diag__muted">Loading reading…</p>
      </main>
    );
  }

  const monthLabel = new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
  })
    .format(new Date())
    .toUpperCase();

  const sheetOrder: SheetId[] = ["work", "capital", "body", "mind"];

  function openSave() {
    setGate("open");
  }

  function skipSave() {
    setGate("skipped");
  }

  function submitSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email to save.");
      return;
    }
    if (worry.length > 500) {
      setError("Worry text max 500 characters.");
      return;
    }
    persistSaveStub(answers!, {
      email: trimmed,
      worry: worry.trim() || undefined,
      ageBand: ageBand || undefined,
      cohortInterest: cohort,
    });
    setGate("done");
  }

  return (
    <main className="vf-result">
      <header className="vf-result__top">
        <div>
          <p className="vf-result__brand">V2 Foundry</p>
          <p className="vf-result__reading">Your reading · {monthLabel}</p>
        </div>
        <button type="button" className="vf-btn vf-btn--secondary" onClick={openSave}>
          Save result
        </button>
      </header>

      <section className="vf-result-energy" aria-labelledby="energy-heading">
        <h2 id="energy-heading" className="vf-result__label">
          Energy Index
        </h2>
        <EnergyNumber value={reading.energyIndex} />
        <p className="vf-result-energy__band">
          <span className="vf-result-energy__bandword">
            {bandLabel(reading.energyBand)}
          </span>
          . {reading.energyCopy}
        </p>
      </section>

      <section className="vf-result-position" aria-labelledby="position-heading">
        <h2 id="position-heading" className="vf-result__label">
          Position
        </h2>
        <div className="vf-result-position__grid">
          <div className="vf-result-metric">
            <p className="vf-result-metric__name">Task-surface exposure</p>
            <p className="vf-result-metric__value">
              {reading.position.taskSurfaceExposure}
            </p>
            <p className="vf-result-metric__copy">{reading.positionCopy.taskSurface}</p>
          </div>
          <div className="vf-result-metric">
            <p className="vf-result-metric__name">Trust premium</p>
            <p className="vf-result-metric__value">{reading.position.trustPremium}</p>
            <p className="vf-result-metric__copy">{reading.positionCopy.trust}</p>
          </div>
          <div className="vf-result-metric">
            <p className="vf-result-metric__name">Runway</p>
            <p className="vf-result-metric__value">
              {runwayDisplay(reading.position.runway)}
            </p>
            <p className="vf-result-metric__copy">{reading.positionCopy.runway}</p>
          </div>
        </div>
      </section>

      <section className="vf-result-sheets" aria-label="Sheet scores">
        <h2 className="vf-result__label">Sheets</h2>
        <p className="vf-result-sheets__row">
          {sheetOrder.map((id, i) => (
            <span key={id}>
              {i > 0 ? " · " : null}
              <span className="vf-result-sheets__name">
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </span>{" "}
              {reading.sheets[id]}
            </span>
          ))}
        </p>
        {reading.wrapperGlossary.length > 0 ? (
          <p className="vf-result-sheets__glossary">
            {reading.jurisdictionPack} pack (education only):{" "}
            {reading.wrapperGlossary.join(", ")}. Not recommendations.
          </p>
        ) : null}
      </section>

      <section className="vf-result-moves" aria-labelledby="moves-heading">
        <h2 id="moves-heading" className="vf-result__label">
          Three moves this quarter
        </h2>
        <ol className="vf-result-moves__list">
          {reading.moves.map((move, i) => (
            <li key={`${move.sheet}-${i}`}>
              <span className="vf-result-moves__sheet">
                {move.sheet.charAt(0).toUpperCase() + move.sheet.slice(1)}
              </span>
              {" — "}
              {move.copy}
            </li>
          ))}
        </ol>
      </section>

      <p className="vf-result__disclaimer">
        This is a reading, not a verdict. Not advice. Re-run in a quarter when the
        facts change.
      </p>

      {(gate === "open" || gate === "done" || gate === "skipped") && (
        <section className="vf-save" aria-labelledby="save-heading">
          {gate === "done" ? (
            <>
              <h2 id="save-heading" className="vf-result__label">
                Saved
              </h2>
              <p className="vf-diag__lede">
                Stored locally for now (Phase 0 stub — no email provider yet). We
                will send a re-read in about ninety days once mail is wired.
              </p>
              {cohort ? (
                <p className="vf-diag__muted">
                  Noted: interested in a ten-week cohort later.
                </p>
              ) : null}
            </>
          ) : gate === "skipped" ? (
            <>
              <h2 id="save-heading" className="vf-result__label">
                Not saved
              </h2>
              <p className="vf-diag__lede">
                Your reading stays on this device until you clear it. You can save
                later.
              </p>
              <button type="button" className="vf-btn vf-btn--secondary" onClick={openSave}>
                Save this reading
              </button>
            </>
          ) : (
            <>
              <h2 id="save-heading" className="vf-result__label">
                Save this reading
              </h2>
              <p className="vf-diag__lede">
                Email so we can store this reading and send a re-read in about
                ninety days. Free-text is optional — and the part we actually read.
              </p>
              <form className="vf-save__form" onSubmit={submitSave}>
                <label className="vf-save__field">
                  <span>Email</span>
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </label>
                <label className="vf-save__field">
                  <span>What are you most worried about?</span>
                  <textarea
                    value={worry}
                    onChange={(e) => setWorry(e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder='e.g. “That my skills expire before I own anything.”'
                  />
                  <span className="vf-save__hint">
                    One or two sentences is enough. {worry.length}/500
                  </span>
                </label>
                <label className="vf-save__field">
                  <span>Age band (optional)</span>
                  <select
                    value={ageBand}
                    onChange={(e) => setAgeBand(e.target.value as AgeBand | "")}
                  >
                    <option value="">Prefer not to say</option>
                    {AGE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="vf-save__check">
                  <input
                    type="checkbox"
                    checked={cohort}
                    onChange={(e) => setCohort(e.target.checked)}
                  />
                  <span>Tell me if a paid ten-week cohort opens.</span>
                </label>
                {error ? <p className="vf-save__error">{error}</p> : null}
                <div className="vf-diag__actions">
                  <button type="submit" className="vf-btn vf-btn--primary">
                    Save this reading
                  </button>
                  <button
                    type="button"
                    className="vf-btn vf-btn--secondary"
                    onClick={skipSave}
                  >
                    Continue without saving
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      )}

      <div className="vf-diag__actions vf-result__nav">
        <Link href="/doctrine" className="vf-btn vf-btn--secondary">
          Read the doctrine
        </Link>
        <Link href="/diagnostic" className="vf-btn vf-btn--secondary">
          Start over
        </Link>
      </div>
    </main>
  );
}
