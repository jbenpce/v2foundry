export const DIAGNOSTIC_SCHEMA = "phase0.diagnostic.v1" as const;

export type SheetId = "work" | "capital" | "body" | "mind";

export type FieldId =
  | "w1_role"
  | "w2_task_surface"
  | "w3_senior_review"
  | "w4_ownership"
  | "w5_trust_vouch"
  | "c1_tax_residence"
  | "c2_citizenship"
  | "c3_runway"
  | "c4_savings_rate"
  | "c5_debt"
  | "c6_compounds_wrappers"
  | "b1_sleep_hours"
  | "b2_sleep_consistency"
  | "b3_training_days"
  | "b4a_hard_day_capacity"
  | "b4b_alcohol_dull_evenings"
  | "m1_attention_block"
  | "m2_direction"
  | "m3_decision_partners"
  | "m4_story_strain";

export type AgeBand = "18_24" | "25_35" | "36_49" | "50_plus";

export type EnergyBand = "fragile" | "thin" | "steady" | "strong";

export type RunwayCode = "lt_1" | "m1_3" | "m3_6" | "m6_12" | "gt_12" | "unknown";

export type JurisdictionPack = "US" | "UK" | "EU";

export type AnswerMap = Partial<Record<FieldId, string>>;

export type QuestionOption = {
  value: string;
  label: string;
  points?: number;
};

export type QuestionDef = {
  id: FieldId;
  sheet: SheetId;
  prompt: string;
  options: QuestionOption[];
  /** When true, this field shares a screen with its pairId. */
  pairWith?: FieldId;
  scored: boolean;
};

export type Beat =
  | { kind: "landing" }
  | { kind: "intro" }
  | { kind: "question"; fields: FieldId[]; sheet: SheetId; index: number; total: number }
  | { kind: "compute" }
  | { kind: "result" }
  | { kind: "save" }
  | { kind: "done" };

export type MoveResult = {
  sheet: SheetId;
  driverField: FieldId;
  copy: string;
};

export type DerivedReading = {
  sheets: Record<SheetId, number>;
  energyIndex: number;
  energyBand: EnergyBand;
  weakestSheet: SheetId;
  position: {
    taskSurfaceExposure: number;
    trustPremium: number;
    runway: RunwayCode;
  };
  positionCopy: {
    taskSurface: string;
    trust: string;
    runway: string;
  };
  energyCopy: string;
  moves: MoveResult[];
  jurisdictionPack: JurisdictionPack;
  flags: { usPerson: boolean };
  wrapperGlossary: string[];
};

export type DiagnosticSave = {
  email: string;
  worry?: string;
  ageBand?: AgeBand;
  cohortInterest?: boolean;
};

export type DiagnosticSubmission = {
  schema: typeof DIAGNOSTIC_SCHEMA;
  startedAt: string;
  completedAt: string;
  answers: AnswerMap;
  derived: DerivedReading;
  save?: DiagnosticSave;
};
