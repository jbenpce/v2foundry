import movesTable from "@/content/diagnostic/moves.phase0.json";
import { POINTS, SHEET_MAX } from "./questions";
import type {
  AnswerMap,
  DerivedReading,
  EnergyBand,
  FieldId,
  JurisdictionPack,
  MoveResult,
  RunwayCode,
  SheetId,
} from "./types";

const SHEET_FIELDS: Record<SheetId, FieldId[]> = {
  work: ["w1_role", "w2_task_surface", "w3_senior_review", "w4_ownership", "w5_trust_vouch"],
  capital: ["c3_runway", "c4_savings_rate", "c5_debt", "c6_compounds_wrappers"],
  body: [
    "b1_sleep_hours",
    "b2_sleep_consistency",
    "b3_training_days",
    "b4a_hard_day_capacity",
    "b4b_alcohol_dull_evenings",
  ],
  mind: ["m1_attention_block", "m2_direction", "m3_decision_partners", "m4_story_strain"],
};

const TIE_BREAK: SheetId[] = ["body", "mind", "work", "capital"];

const WRAPPERS: Record<JurisdictionPack, string[]> = {
  US: ["401(k)", "IRA", "HSA", "taxable brokerage"],
  UK: ["ISA", "SIPP", "workplace pension"],
  EU: ["Country-local pension", "Tax-advantaged savings (local labels)"],
};

type MovesJson = Record<
  SheetId,
  { _default: string } & Record<string, Record<string, string> | string>
>;

const MOVES = movesTable as MovesJson;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function pointsFor(field: FieldId, code: string | undefined): number {
  if (!code) return 0;
  return POINTS[field][code] ?? 0;
}

export function energyBandFor(score: number): EnergyBand {
  if (score <= 39) return "fragile";
  if (score <= 59) return "thin";
  if (score <= 79) return "steady";
  return "strong";
}

export function bandLabel(band: EnergyBand): string {
  return band.charAt(0).toUpperCase() + band.slice(1);
}

function scoreWork(answers: AnswerMap): number {
  let raw = 0;
  for (const field of SHEET_FIELDS.work) {
    raw += pointsFor(field, answers[field]);
  }
  return Math.round((100 * raw) / SHEET_MAX.work);
}

function scoreCapital(answers: AnswerMap): number {
  let raw = 0;
  for (const field of SHEET_FIELDS.capital) {
    raw += pointsFor(field, answers[field]);
  }
  return Math.round((100 * raw) / SHEET_MAX.capital);
}

function scoreBody(answers: AnswerMap): number {
  let raw =
    pointsFor("b1_sleep_hours", answers.b1_sleep_hours) +
    pointsFor("b2_sleep_consistency", answers.b2_sleep_consistency) +
    pointsFor("b3_training_days", answers.b3_training_days) +
    pointsFor("b4a_hard_day_capacity", answers.b4a_hard_day_capacity);
  raw += pointsFor("b4b_alcohol_dull_evenings", answers.b4b_alcohol_dull_evenings);
  raw = clamp(raw, 0, SHEET_MAX.body);
  return Math.round((100 * raw) / SHEET_MAX.body);
}

function scoreMind(answers: AnswerMap): number {
  let raw = 0;
  for (const field of SHEET_FIELDS.mind) {
    raw += pointsFor(field, answers[field]);
  }
  return Math.round((100 * raw) / SHEET_MAX.mind);
}

function jurisdictionPack(answers: AnswerMap): JurisdictionPack {
  const r = answers.c1_tax_residence;
  if (r === "us") return "US";
  if (r === "uk") return "UK";
  return "EU";
}

function taskSurfaceExposure(answers: AnswerMap): number {
  const base: Record<string, number> = {
    most_gte_75: 85,
    about_half: 55,
    minority_lte_25: 30,
    almost_none_judgment: 15,
    unknown: 50,
  };
  let n = base[answers.w2_task_surface ?? "unknown"] ?? 50;
  if (answers.w1_role === "founder_equity") n -= 10;
  if (answers.w1_role === "between_roles" || answers.w1_role === "not_earning") n += 5;
  return clamp(n, 0, 100);
}

function trustPremium(answers: AnswerMap): number {
  const base: Record<string, number> = {
    none: 10,
    one_or_two: 35,
    small_circle_3_5: 65,
    wider_set: 85,
  };
  let n = base[answers.w5_trust_vouch ?? "none"] ?? 10;
  const w3 = answers.w3_senior_review;
  const w5 = answers.w5_trust_vouch;
  if (w3 === "nearly_everything" && (w5 === "none" || w5 === "one_or_two")) n -= 10;
  if (w3 === "nothing_last_stop" && w5 === "wider_set") n += 5;
  return clamp(n, 0, 100);
}

function weakestSheet(sheets: Record<SheetId, number>): SheetId {
  let best: SheetId = "body";
  let bestScore = Infinity;
  for (const sheet of TIE_BREAK) {
    const s = sheets[sheet];
    if (s < bestScore) {
      bestScore = s;
      best = sheet;
    }
  }
  return best;
}

function lowestDriver(sheet: SheetId, answers: AnswerMap): FieldId {
  const fields = SHEET_FIELDS[sheet].filter((field) => {
    // Mild alcohol drag scores the sheet but only drives a move when it bites hard.
    if (field === "b4b_alcohol_dull_evenings") {
      const alc = answers.b4b_alcohol_dull_evenings;
      return Boolean(alc && pointsFor("b4b_alcohol_dull_evenings", alc) <= -2);
    }
    return true;
  });

  let bestField = fields[0] ?? SHEET_FIELDS[sheet][0];
  let bestPoints = Infinity;

  for (const field of fields) {
    const code = answers[field];
    if (!code) continue;
    const pts = pointsFor(field, code);
    if (pts < bestPoints) {
      bestPoints = pts;
      bestField = field;
    }
  }

  return bestField;
}

function lookupMove(sheet: SheetId, driverField: FieldId, answers: AnswerMap): MoveResult {
  const code = answers[driverField] ?? "";
  const sheetMoves = MOVES[sheet];
  const byField = sheetMoves[driverField];
  let copy = sheetMoves._default;
  if (byField && typeof byField === "object" && code in byField) {
    copy = byField[code];
  }
  return { sheet, driverField, copy };
}

function threeMoves(sheets: Record<SheetId, number>, answers: AnswerMap): MoveResult[] {
  const ranked = (Object.keys(sheets) as SheetId[]).sort((a, b) => {
    if (sheets[a] !== sheets[b]) return sheets[a] - sheets[b];
    return TIE_BREAK.indexOf(a) - TIE_BREAK.indexOf(b);
  });
  return ranked.slice(0, 3).map((sheet) => {
    const driver = lowestDriver(sheet, answers);
    return lookupMove(sheet, driver, answers);
  });
}

function runwayLabel(code: RunwayCode): string {
  switch (code) {
    case "lt_1":
      return "<1 month";
    case "m1_3":
      return "1–3 months";
    case "m3_6":
      return "3–6 months";
    case "m6_12":
      return "6–12 months";
    case "gt_12":
      return "12+ months";
    default:
      return "Unknown";
  }
}

function positionCopy(
  exposure: number,
  trust: number,
  runway: RunwayCode,
): DerivedReading["positionCopy"] {
  let taskSurface: string;
  if (exposure >= 70) {
    taskSurface =
      "Most of a typical week is first-pass production a model can already draft. That is exposure, not a moral failing — but it is not a moat.";
  } else if (exposure >= 45) {
    taskSurface =
      "A meaningful share of your week is still first-pass work. Cut exposure where you can; protect judgment time.";
  } else {
    taskSurface =
      "Your week leans toward judgment, relationships, or ownership. Protect that surface.";
  }

  let trustCopy: string;
  if (trust <= 30) {
    trustCopy =
      "Few people would stake a hard call on you yet. That is thin for the decisions you want next.";
  } else if (trust <= 55) {
    trustCopy = "A small set might vouch. Useful — still narrow for harder calls.";
  } else {
    trustCopy = "People have seen you decide under pressure. Convert trust into ownership.";
  }

  let runwayCopy: string;
  if (runway === "lt_1" || runway === "m1_3") {
    runwayCopy = "Short. Until this number moves, every other plan is optional.";
  } else if (runway === "unknown") {
    runwayCopy = "Unknown runway is itself a risk. Calculate it from cash you would actually use.";
  } else if (runway === "m3_6") {
    runwayCopy = "Workable short-term. Extending the floor still matters this quarter.";
  } else {
    runwayCopy = "You have room. Use it for structure, not drift.";
  }

  return { taskSurface, trust: trustCopy, runway: runwayCopy };
}

function energyCopy(weakest: SheetId): string {
  const sheetName = weakest.charAt(0).toUpperCase() + weakest.slice(1);
  const reasons: Record<SheetId, string> = {
    body: "sleep and capacity are capping the rest",
    mind: "attention and direction are capping execution",
    work: "task surface and trust are the constraint",
    capital: "runway and structure are the constraint",
  };
  return `Capacity is limited. Weakest sheet: ${sheetName} — ${reasons[weakest]}.`;
}

export function deriveReading(answers: AnswerMap): DerivedReading {
  const sheets = {
    work: scoreWork(answers),
    capital: scoreCapital(answers),
    body: scoreBody(answers),
    mind: scoreMind(answers),
  };

  const energyIndex = Math.round(
    0.25 * sheets.work + 0.25 * sheets.capital + 0.25 * sheets.body + 0.25 * sheets.mind,
  );
  const energyBand = energyBandFor(energyIndex);
  const weakest = weakestSheet(sheets);
  const exposure = taskSurfaceExposure(answers);
  const trust = trustPremium(answers);
  const runway = (answers.c3_runway as RunwayCode | undefined) ?? "unknown";
  const pack = jurisdictionPack(answers);

  return {
    sheets,
    energyIndex,
    energyBand,
    weakestSheet: weakest,
    position: {
      taskSurfaceExposure: exposure,
      trustPremium: trust,
      runway,
    },
    positionCopy: positionCopy(exposure, trust, runway),
    energyCopy: energyCopy(weakest),
    moves: threeMoves(sheets, answers),
    jurisdictionPack: pack,
    flags: { usPerson: answers.c2_citizenship === "us" },
    wrapperGlossary: WRAPPERS[pack],
  };
}

export function runwayDisplay(code: RunwayCode): string {
  return runwayLabel(code);
}

export function isComplete(answers: AnswerMap): boolean {
  const required: FieldId[] = [
    "w1_role",
    "w2_task_surface",
    "w3_senior_review",
    "w4_ownership",
    "w5_trust_vouch",
    "c1_tax_residence",
    "c2_citizenship",
    "c3_runway",
    "c4_savings_rate",
    "c5_debt",
    "c6_compounds_wrappers",
    "b1_sleep_hours",
    "b2_sleep_consistency",
    "b3_training_days",
    "b4a_hard_day_capacity",
    "b4b_alcohol_dull_evenings",
    "m1_attention_block",
    "m2_direction",
    "m3_decision_partners",
    "m4_story_strain",
  ];
  return required.every((id) => Boolean(answers[id]));
}
