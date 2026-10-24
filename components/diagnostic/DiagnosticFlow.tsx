"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  QUESTION_BEAT_COUNT,
  QUESTION_BEATS,
  QUESTION_BY_ID,
  SHEET_META,
  type AnswerMap,
  type FieldId,
  type SheetId,
  loadAnswers,
  loadStartedAt,
  saveAnswers,
} from "@/lib/diagnostic";
import { OptionList } from "./OptionList";

type Phase = "intro" | "questions" | "compute";

export function DiagnosticFlow() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [beatIndex, setBeatIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    loadStartedAt();
    setAnswers(loadAnswers());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveAnswers(answers);
  }, [answers, hydrated]);

  const beat = QUESTION_BEATS[beatIndex];
  const sheet: SheetId | null = beat?.sheet ?? null;
  const meta = sheet ? SHEET_META[sheet] : null;

  const draft = useMemo(() => {
    if (!beat) return {} as AnswerMap;
    const next: AnswerMap = {};
    for (const id of beat.fields) {
      if (answers[id]) next[id] = answers[id];
    }
    return next;
  }, [answers, beat]);

  const [local, setLocal] = useState<AnswerMap>({});

  useEffect(() => {
    setLocal(draft);
  }, [draft, beatIndex]);

  function setField(id: FieldId, value: string) {
    setLocal((prev) => ({ ...prev, [id]: value }));
  }

  function beatComplete(): boolean {
    if (!beat) return false;
    return beat.fields.every((id) => Boolean(local[id]));
  }

  function continueFromIntro() {
    setPhase("questions");
    setBeatIndex(0);
  }

  function skipIntro() {
    continueFromIntro();
  }

  function goNext() {
    if (!beat || !beatComplete()) return;
    const merged = { ...answers, ...local };
    setAnswers(merged);
    if (beatIndex >= QUESTION_BEAT_COUNT - 1) {
      setPhase("compute");
      window.setTimeout(() => {
        router.push("/diagnostic/result");
      }, 900);
      return;
    }
    setBeatIndex((i) => i + 1);
  }

  function goBack() {
    if (phase === "questions" && beatIndex === 0) {
      setPhase("intro");
      return;
    }
    if (beatIndex > 0) {
      setBeatIndex((i) => i - 1);
    }
  }

  if (!hydrated) {
    return (
      <main className="vf-diag">
        <p className="vf-diag__muted">Loading…</p>
      </main>
    );
  }

  if (phase === "compute") {
    return (
      <main className="vf-diag vf-diag--compute">
        <p className="vf-diag__eyebrow">Reading</p>
        <h1 className="vf-diag__title">Drawing your position</h1>
        <div className="vf-diag-ember" aria-hidden="true" />
        <p className="vf-diag__muted">Rules only. No black box.</p>
      </main>
    );
  }

  if (phase === "intro") {
    return (
      <main className="vf-diag">
        <p className="vf-diag__eyebrow">Four sheets</p>
        <h1 className="vf-diag__title">Work · Capital · Body · Mind</h1>
        <p className="vf-diag__lede">
          You will get a Position, an Energy Index, and three moves. Nineteen
          questions. About five minutes. No account to see the result.
        </p>
        <ul className="vf-diag-sheetmap">
          {(Object.keys(SHEET_META) as SheetId[]).map((id) => (
            <li key={id}>
              <span className="vf-diag-sheetmap__label">{SHEET_META[id].label}</span>
              <span className="vf-diag-sheetmap__sub">{SHEET_META[id].subline}</span>
            </li>
          ))}
        </ul>
        <div className="vf-diag__actions">
          <button type="button" className="vf-btn vf-btn--primary" onClick={continueFromIntro}>
            Continue
          </button>
          <button type="button" className="vf-btn vf-btn--secondary" onClick={skipIntro}>
            Skip intro
          </button>
        </div>
        <p className="vf-diag__foot">
          <Link href="/diagnostic">Back to start</Link>
        </p>
      </main>
    );
  }

  const progressLabel = `${beatIndex + 1} / ${QUESTION_BEAT_COUNT}`;

  return (
    <main className="vf-diag">
      <div className="vf-diag-chrome">
        <p className="vf-diag__eyebrow">{meta?.label}</p>
        <p className="vf-diag-chrome__progress" aria-live="polite">
          {progressLabel}
        </p>
      </div>
      {meta?.subline ? <p className="vf-diag__subline">{meta.subline}</p> : null}

      {beat.fields.map((fieldId) => {
        const q = QUESTION_BY_ID[fieldId];
        return (
          <section key={fieldId} className="vf-diag-q">
            <h1 className="vf-diag-q__prompt">{q.prompt}</h1>
            <OptionList
              name={q.id}
              options={q.options}
              value={local[fieldId]}
              onChange={(v) => setField(fieldId, v)}
            />
          </section>
        );
      })}

      {meta?.footer ? <p className="vf-diag__legal">{meta.footer}</p> : null}

      <div className="vf-diag__actions">
        <button type="button" className="vf-btn vf-btn--secondary" onClick={goBack}>
          Back
        </button>
        <button
          type="button"
          className="vf-btn vf-btn--primary"
          onClick={goNext}
          disabled={!beatComplete()}
        >
          {beatIndex >= QUESTION_BEAT_COUNT - 1 ? "See result" : "Continue"}
        </button>
      </div>
    </main>
  );
}
