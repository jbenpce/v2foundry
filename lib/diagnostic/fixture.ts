import type { AnswerMap } from "./types";

/** Sample persona from phase-0-diagnostic-design.md §4 — short runway, poor sleep, high task surface. */
export const TROUBLE_FIXTURE: AnswerMap = {
  w1_role: "freelancer_solo",
  w2_task_surface: "most_gte_75",
  w3_senior_review: "rarely",
  w4_ownership: "no",
  w5_trust_vouch: "one_or_two",
  c1_tax_residence: "uk",
  c2_citizenship: "uk",
  c3_runway: "m1_3",
  c4_savings_rate: "under_10",
  c5_debt: "manageable",
  c6_compounds_wrappers: "neither",
  b1_sleep_hours: "under_6",
  b2_sleep_consistency: "d0_1",
  b3_training_days: "d0",
  b4a_hard_day_capacity: "rarely",
  b4b_alcohol_dull_evenings: "d1_2",
  m1_attention_block: "m20_45",
  m2_direction: "rough",
  m3_decision_partners: "peers",
  m4_story_strain: "unstable",
};
