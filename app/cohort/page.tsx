import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cohort",
  description:
    "Interest in a small paid cohort for people building their next version — capture comes after the diagnostic.",
};

export default function CohortPage() {
  return (
    <main className="vf-stub">
      <p className="vf-stub__label">Coming soon</p>
      <h1 className="vf-stub__title">Cohort interest</h1>
      <p className="vf-stub__body">
        A small paid group (~20 people, roughly 8–12 weeks). Soft interest capture
        lands with the diagnostic result — not a checkout, not a waitlist funnel.
      </p>
      <Link href="/" className="vf-btn vf-btn--secondary">
        Back to home
      </Link>
    </main>
  );
}
