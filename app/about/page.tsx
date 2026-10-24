import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "V2 Foundry — a system for rebuilding work, capital, body and mind before the wealth arrives.",
};

export default function AboutPage() {
  return (
    <main className="vf-stub">
      <p className="vf-stub__label">About</p>
      <h1 className="vf-stub__title">Operator thesis, not a life OS brochure</h1>
      <p className="vf-stub__body">
        V2 Foundry gives geographically mobile 25–35 year olds the operating
        discipline wealthy families use — four sheets, an Energy Index, a short
        list of moves — before they have the wealth. Doctrine is GenXAlpha.
        Sibling to AEGISfo; different temperature.
      </p>
      <Link href="/diagnostic" className="vf-btn vf-btn--primary">
        Take the diagnostic
      </Link>
    </main>
  );
}
