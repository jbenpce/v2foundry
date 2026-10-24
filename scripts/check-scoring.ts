import { TROUBLE_FIXTURE } from "../lib/diagnostic/fixture";
import { deriveReading, isComplete } from "../lib/diagnostic/scoring";

if (!isComplete(TROUBLE_FIXTURE)) {
  console.error("fixture incomplete");
  process.exit(1);
}

const r = deriveReading(TROUBLE_FIXTURE);
console.log(JSON.stringify({
  energyIndex: r.energyIndex,
  energyBand: r.energyBand,
  weakestSheet: r.weakestSheet,
  sheets: r.sheets,
  position: r.position,
  moves: r.moves.map((m) => `${m.sheet}: ${m.copy.slice(0, 60)}…`),
}, null, 2));

if (r.energyIndex > 60) {
  console.error("expected trouble fixture energy <= 60, got", r.energyIndex);
  process.exit(1);
}
if (r.position.taskSurfaceExposure < 70) {
  console.error("expected high task-surface exposure");
  process.exit(1);
}
if (r.position.runway !== "m1_3") {
  console.error("expected runway m1_3");
  process.exit(1);
}
if (r.moves.length !== 3) {
  console.error("expected 3 moves");
  process.exit(1);
}
console.log("ok");
