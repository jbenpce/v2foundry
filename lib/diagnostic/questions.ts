import type { FieldId, QuestionDef, SheetId } from "./types";

export const SHEET_META: Record<
  SheetId,
  { label: string; subline: string; footer?: string }
> = {
  work: {
    label: "Work",
    subline: "Task surface, trust, ownership.",
  },
  capital: {
    label: "Capital",
    subline: "Runway and structure. Education, not advice.",
    footer:
      "These questions map structure. They are not personalised financial advice.",
  },
  body: {
    label: "Body",
    subline: "The base every other sheet draws on.",
  },
  mind: {
    label: "Mind",
    subline: "Attention, direction, who you decide with.",
  },
};

/** Points tables from diagnostic-spec-notes.md */
export const POINTS: Record<FieldId, Record<string, number>> = {
  w1_role: {
    employee_contractor: 2,
    freelancer_solo: 3,
    founder_equity: 4,
    between_roles: 1,
    studying: 2,
    not_earning: 1,
  },
  w2_task_surface: {
    most_gte_75: 0,
    about_half: 2,
    minority_lte_25: 3,
    almost_none_judgment: 4,
    unknown: 1,
  },
  w3_senior_review: {
    nearly_everything: 1,
    important_pieces: 3,
    rarely: 3,
    nothing_last_stop: 4,
    na: 2,
  },
  w4_ownership: {
    yes_material: 4,
    small_symbolic: 2,
    no: 0,
    unsure: 1,
  },
  w5_trust_vouch: {
    none: 0,
    one_or_two: 2,
    small_circle_3_5: 3,
    wider_set: 4,
  },
  c1_tax_residence: { us: 0, uk: 0, europe: 0, elsewhere: 0 },
  c2_citizenship: { us: 0, uk: 0, other: 0, prefer_not: 0 },
  c3_runway: {
    lt_1: 0,
    m1_3: 1,
    m3_6: 2,
    m6_12: 3,
    gt_12: 4,
    unknown: 1,
  },
  c4_savings_rate: {
    negative: 0,
    none: 1,
    under_10: 2,
    p10_20: 3,
    over_20: 4,
    irregular: 1,
  },
  c5_debt: {
    none_worry: 4,
    manageable: 3,
    heavy: 1,
    distressed: 0,
    prefer_not: 2,
  },
  c6_compounds_wrappers: {
    both: 4,
    compounds_only: 3,
    wrappers_only: 2,
    neither: 0,
    unknown: 1,
  },
  b1_sleep_hours: {
    under_6: 0,
    h6_7: 2,
    h7_8: 4,
    over_8: 3,
    inconsistent: 1,
  },
  b2_sleep_consistency: {
    d0_1: 0,
    d2_3: 2,
    d4_5: 3,
    d6_7: 4,
  },
  b3_training_days: {
    d0: 0,
    d1_2: 2,
    d3_4: 4,
    d5_plus: 3,
  },
  b4a_hard_day_capacity: {
    rarely: 0,
    some_weeks: 2,
    most_days: 3,
    nearly_always: 4,
  },
  b4b_alcohol_dull_evenings: {
    d0: 0,
    d1_2: -1,
    d3_4: -2,
    d5_plus: -3,
    prefer_not: -1,
  },
  m1_attention_block: {
    under_20m: 0,
    m20_45: 2,
    m45_90: 3,
    over_90m: 4,
    none_protected: 0,
  },
  m2_direction: {
    clear: 4,
    rough: 2,
    competing: 1,
    none_reactive: 0,
  },
  m3_decision_partners: {
    nobody: 0,
    partner_family: 2,
    peers: 3,
    one_senior: 4,
    circle: 4,
  },
  m4_story_strain: {
    i_am_the_problem: 1,
    system_pointless: 0,
    weather_next_move: 4,
    unstable: 2,
  },
};

export const SHEET_MAX: Record<SheetId, number> = {
  work: 20,
  capital: 16,
  body: 16,
  mind: 16,
};

export const QUESTIONS: QuestionDef[] = [
  {
    id: "w1_role",
    sheet: "work",
    scored: true,
    prompt: "What best describes your main paid work right now?",
    options: [
      { value: "employee_contractor", label: "Employee / contractor inside someone else’s firm" },
      { value: "freelancer_solo", label: "Freelancer / solo operator selling your own time" },
      { value: "founder_equity", label: "Founder or co-founder of something you own equity in" },
      { value: "between_roles", label: "Between roles / searching" },
      { value: "studying", label: "Studying or training full-time" },
      { value: "not_earning", label: "Not earning from work right now" },
    ],
  },
  {
    id: "w2_task_surface",
    sheet: "work",
    scored: true,
    prompt:
      "In a typical week, what share of your time is first-pass production a capable model could already draft — research, writing, comps, boilerplate, decks, summaries?",
    options: [
      { value: "most_gte_75", label: "Most of it (roughly three-quarters or more)" },
      { value: "about_half", label: "About half" },
      { value: "minority_lte_25", label: "A clear minority (roughly a quarter or less)" },
      {
        value: "almost_none_judgment",
        label: "Almost none — my week is judgment, relationships, or ownership decisions",
      },
      { value: "unknown", label: "I genuinely don’t know" },
    ],
  },
  {
    id: "w3_senior_review",
    sheet: "work",
    scored: true,
    prompt: "How much of what you ship is reviewed by someone more senior before it lands?",
    options: [
      { value: "nearly_everything", label: "Nearly everything" },
      { value: "important_pieces", label: "The important pieces" },
      { value: "rarely", label: "Rarely" },
      { value: "nothing_last_stop", label: "Nothing — I am the last stop, or there is no senior" },
      { value: "na", label: "Not applicable" },
    ],
  },
  {
    id: "w4_ownership",
    sheet: "work",
    scored: true,
    prompt:
      "Do you own any meaningful part of what you make — equity, IP, a book of business, a product, an audience with your name on it?",
    options: [
      { value: "yes_material", label: "Yes — material to my future if I left tomorrow" },
      { value: "small_symbolic", label: "Something small or symbolic" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Unsure what “own” means in my case" },
    ],
  },
  {
    id: "w5_trust_vouch",
    sheet: "work",
    scored: true,
    prompt:
      "How many people would vouch for your judgment — unprompted — if someone asked whether you can be trusted with a hard call?",
    options: [
      { value: "none", label: "None I can name" },
      { value: "one_or_two", label: "One or two" },
      { value: "small_circle_3_5", label: "A small circle (roughly three to five)" },
      { value: "wider_set", label: "A wider set who have seen me decide under pressure" },
    ],
  },
  {
    id: "c1_tax_residence",
    sheet: "capital",
    scored: false,
    prompt: "Where are you tax-resident for day-to-day purposes?",
    options: [
      { value: "us", label: "United States" },
      { value: "uk", label: "United Kingdom" },
      { value: "europe", label: "Elsewhere in Europe" },
      { value: "elsewhere", label: "Elsewhere" },
    ],
  },
  {
    id: "c2_citizenship",
    sheet: "capital",
    scored: false,
    prompt:
      "What is your citizenship for tax and filing purposes? (Select the one that creates the most ongoing obligation if more than one applies.)",
    options: [
      { value: "us", label: "United States (including dual citizens)" },
      { value: "uk", label: "United Kingdom" },
      { value: "other", label: "Other / none of the above" },
      { value: "prefer_not", label: "Prefer not to say" },
    ],
  },
  {
    id: "c3_runway",
    sheet: "capital",
    scored: true,
    prompt:
      "If income stopped tomorrow, how many months could you cover essential living costs from cash and near-cash you would actually use?",
    options: [
      { value: "lt_1", label: "Under 1 month" },
      { value: "m1_3", label: "1–3 months" },
      { value: "m3_6", label: "3–6 months" },
      { value: "m6_12", label: "6–12 months" },
      { value: "gt_12", label: "More than 12 months" },
      { value: "unknown", label: "I don’t know" },
    ],
  },
  {
    id: "c4_savings_rate",
    sheet: "capital",
    scored: true,
    prompt:
      "Over the last six months, roughly what share of take-home income did you keep (saved or invested), after essential costs?",
    options: [
      { value: "negative", label: "Negative — spending more than I earn" },
      { value: "none", label: "Roughly none" },
      { value: "under_10", label: "Under 10%" },
      { value: "p10_20", label: "About 10–20%" },
      { value: "over_20", label: "Over 20%" },
      { value: "irregular", label: "Irregular / can’t say" },
    ],
  },
  {
    id: "c5_debt",
    sheet: "capital",
    scored: true,
    prompt: "Which best describes your debt?",
    options: [
      { value: "none_worry", label: "No consumer or student debt that worries me" },
      { value: "manageable", label: "Manageable — payments fit; not growing" },
      { value: "heavy", label: "Heavy — payments constrain choices every month" },
      { value: "distressed", label: "Distressed — behind, or unsure how to clear it" },
      { value: "prefer_not", label: "Prefer not to say" },
    ],
  },
  {
    id: "c6_compounds_wrappers",
    sheet: "capital",
    scored: true,
    prompt:
      "Is any of your money in something that compounds by design (index funds, pension/retirement wrappers, ownership stake), and do you use any tax wrappers you can name?",
    options: [
      {
        value: "both",
        label: "Yes — compounding vehicles and at least one wrapper I can name",
      },
      { value: "compounds_only", label: "Compounding yes; wrappers no or unclear" },
      { value: "wrappers_only", label: "Wrappers yes; little or nothing that compounds" },
      { value: "neither", label: "Neither — cash or nothing structured" },
      { value: "unknown", label: "I don’t know what this is asking" },
    ],
  },
  {
    id: "b1_sleep_hours",
    sheet: "body",
    scored: true,
    prompt: "On a typical night, how much sleep do you get?",
    options: [
      { value: "under_6", label: "Under 6 hours" },
      { value: "h6_7", label: "About 6–7 hours" },
      { value: "h7_8", label: "About 7–8 hours" },
      { value: "over_8", label: "Over 8 hours" },
      { value: "inconsistent", label: "Wildly inconsistent — no typical night" },
    ],
  },
  {
    id: "b2_sleep_consistency",
    sheet: "body",
    scored: true,
    prompt:
      "How many nights a week is your sleep timing roughly stable (same window ±1 hour)?",
    options: [
      { value: "d0_1", label: "0–1" },
      { value: "d2_3", label: "2–3" },
      { value: "d4_5", label: "4–5" },
      { value: "d6_7", label: "6–7" },
    ],
  },
  {
    id: "b3_training_days",
    sheet: "body",
    scored: true,
    prompt:
      "How many days a week do you do deliberate physical training (strength, conditioning, sport — not walking to the shops)?",
    options: [
      { value: "d0", label: "0" },
      { value: "d1_2", label: "1–2" },
      { value: "d3_4", label: "3–4" },
      { value: "d5_plus", label: "5+" },
    ],
  },
  {
    id: "b4a_hard_day_capacity",
    sheet: "body",
    scored: true,
    pairWith: "b4b_alcohol_dull_evenings",
    prompt: "How often do you feel physically capable of a genuinely hard day?",
    options: [
      { value: "rarely", label: "Rarely" },
      { value: "some_weeks", label: "Some weeks" },
      { value: "most_days", label: "Most days" },
      { value: "nearly_always", label: "Nearly always" },
    ],
  },
  {
    id: "b4b_alcohol_dull_evenings",
    sheet: "body",
    scored: true,
    pairWith: "b4a_hard_day_capacity",
    prompt:
      "How many evenings a week do you drink enough that the next morning is dulled?",
    options: [
      { value: "d0", label: "0" },
      { value: "d1_2", label: "1–2" },
      { value: "d3_4", label: "3–4" },
      { value: "d5_plus", label: "5+" },
      { value: "prefer_not", label: "Prefer not to say" },
    ],
  },
  {
    id: "m1_attention_block",
    sheet: "mind",
    scored: true,
    prompt:
      "What is the longest unbroken block of deep attention you reliably get on a workday?",
    options: [
      { value: "under_20m", label: "Under 20 minutes" },
      { value: "m20_45", label: "About 20–45 minutes" },
      { value: "m45_90", label: "About 45–90 minutes" },
      { value: "over_90m", label: "Over 90 minutes" },
      {
        value: "none_protected",
        label: "I protect almost none — everything is interrupt-driven",
      },
    ],
  },
  {
    id: "m2_direction",
    sheet: "mind",
    scored: true,
    prompt:
      "Can you name, in one sentence, what you are building toward over the next two to three years?",
    options: [
      {
        value: "clear",
        label: "Yes — clear enough that someone else would recognise it",
      },
      { value: "rough", label: "A rough direction, still foggy" },
      { value: "competing", label: "Several competing directions" },
      { value: "none_reactive", label: "No — I am reacting week to week" },
    ],
  },
  {
    id: "m3_decision_partners",
    sheet: "mind",
    scored: true,
    prompt: "Before a hard personal or career decision, who do you actually talk to?",
    options: [
      { value: "nobody", label: "Nobody — I decide alone" },
      { value: "partner_family", label: "Partner or family only" },
      {
        value: "peers",
        label: "One or two peers who have been through something similar",
      },
      {
        value: "one_senior",
        label: "At least one person with more scars than me (mentor, former boss, operator)",
      },
      { value: "circle", label: "A real circle — peers and someone senior" },
    ],
  },
  {
    id: "m4_story_strain",
    sheet: "mind",
    scored: true,
    prompt: "When a bad month hits, which story do you default to?",
    options: [
      { value: "i_am_the_problem", label: "I am behind and probably the problem" },
      { value: "system_pointless", label: "The system is broken; effort is mostly pointless" },
      { value: "weather_next_move", label: "This is weather — keep the next useful move" },
      { value: "unstable", label: "I don’t have a stable story; it depends on the day" },
    ],
  },
];

export const QUESTION_BY_ID: Record<FieldId, QuestionDef> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q]),
) as Record<FieldId, QuestionDef>;

/** Beats that count toward progress (19 interactive questions; B4 is one beat). */
export function buildQuestionBeats(): { fields: FieldId[]; sheet: SheetId }[] {
  const beats: { fields: FieldId[]; sheet: SheetId }[] = [];
  const seen = new Set<FieldId>();

  for (const q of QUESTIONS) {
    if (seen.has(q.id)) continue;
    if (q.pairWith) {
      beats.push({ fields: [q.id, q.pairWith], sheet: q.sheet });
      seen.add(q.id);
      seen.add(q.pairWith);
    } else {
      beats.push({ fields: [q.id], sheet: q.sheet });
      seen.add(q.id);
    }
  }
  return beats;
}

export const QUESTION_BEATS = buildQuestionBeats();
export const QUESTION_BEAT_COUNT = QUESTION_BEATS.length; // 19
