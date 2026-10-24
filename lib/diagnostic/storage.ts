import { DIAGNOSTIC_SCHEMA, type AnswerMap, type DiagnosticSave, type DiagnosticSubmission } from "./types";
import { deriveReading } from "./scoring";

const ANSWERS_KEY = "vf.diagnostic.answers.v1";
const STARTED_KEY = "vf.diagnostic.startedAt.v1";
const SAVE_KEY = "vf.diagnostic.saves.v1";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function loadAnswers(): AnswerMap {
  if (!canUseStorage()) return {};
  try {
    const raw = sessionStorage.getItem(ANSWERS_KEY);
    return raw ? (JSON.parse(raw) as AnswerMap) : {};
  } catch {
    return {};
  }
}

export function saveAnswers(answers: AnswerMap): void {
  if (!canUseStorage()) return;
  sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
}

export function loadStartedAt(): string {
  if (!canUseStorage()) return new Date().toISOString();
  const existing = sessionStorage.getItem(STARTED_KEY);
  if (existing) return existing;
  const now = new Date().toISOString();
  sessionStorage.setItem(STARTED_KEY, now);
  return now;
}

export function clearDiagnosticSession(): void {
  if (!canUseStorage()) return;
  sessionStorage.removeItem(ANSWERS_KEY);
  sessionStorage.removeItem(STARTED_KEY);
}

export function persistSaveStub(
  answers: AnswerMap,
  save: DiagnosticSave,
): DiagnosticSubmission {
  const submission: DiagnosticSubmission = {
    schema: DIAGNOSTIC_SCHEMA,
    startedAt: loadStartedAt(),
    completedAt: new Date().toISOString(),
    answers,
    derived: deriveReading(answers),
    save,
  };

  if (canUseStorage()) {
    const prevRaw = localStorage.getItem(SAVE_KEY);
    const prev: DiagnosticSubmission[] = prevRaw ? JSON.parse(prevRaw) : [];
    prev.push(submission);
    localStorage.setItem(SAVE_KEY, JSON.stringify(prev));
  }

  // Client stub — no email provider in PR-3
  console.info("[v2foundry] diagnostic save stub", {
    email: save.email,
    worryLength: save.worry?.length ?? 0,
    ageBand: save.ageBand,
    cohortInterest: save.cohortInterest,
    energyIndex: submission.derived.energyIndex,
  });

  return submission;
}
