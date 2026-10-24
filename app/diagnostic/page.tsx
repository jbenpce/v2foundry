import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Diagnostic",
  description:
    "Nineteen questions. Five minutes. A Position, an Energy Index, and three moves — stated plainly. No account to see the result.",
};

export default function DiagnosticLandingPage() {
  return (
    <main className="vf-diag vf-diag--landing">
      <p className="vf-diag__eyebrow">Phase 0 · Free</p>
      <p className="vf-diag__brand">V2 Foundry</p>
      <h1 className="vf-diag__title">See your position.</h1>
      <p className="vf-diag__lede">
        Nineteen questions. Five minutes. A Position, an Energy Index, and three
        moves you can run this quarter — stated plainly.
      </p>
      <div className="vf-diag__actions">
        <Link href="/diagnostic/run" className="vf-btn vf-btn--primary">
          Start the diagnostic
        </Link>
        <Link href="/doctrine/ladder-broke-at-the-bottom" className="vf-btn vf-btn--secondary">
          What this is
        </Link>
      </div>
      <p className="vf-diag__foot">
        No account to see results. Email only if you want to save a re-read.
      </p>
    </main>
  );
}
