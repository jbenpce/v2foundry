import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Diagnostic",
  description:
    "Five minutes across work, capital, body and mind. No account required to see your position.",
};

export default function DiagnosticPage() {
  return (
    <main className="vf-stub">
      <p className="vf-stub__label">Coming soon</p>
      <h1 className="vf-stub__title">Diagnostic</h1>
      <p className="vf-stub__body">
        One public tool. About five minutes. Four sheets, a free-text worry, then
        Position, Energy Index, and three moves. No account to see the result —
        the flow ships next.
      </p>
      <Link href="/doctrine" className="vf-btn vf-btn--secondary">
        Read the doctrine meanwhile
      </Link>
    </main>
  );
}
