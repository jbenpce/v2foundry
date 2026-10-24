import Link from "next/link";

export default function HomePage() {
  return (
    <main className="vf-hero">
      <h1 className="vf-hero__wordmark">
        <span className="vf-hero__v2">V2</span>
        <span className="vf-ember-text">Foundry</span>
      </h1>
      <p className="vf-hero__headline">Build your next version.</p>
      <p className="vf-hero__support">
        The Foundry is where you go. Your v2 is what you build there.
      </p>
      <div className="vf-hero__ctas">
        <Link href="/diagnostic" className="vf-btn vf-btn--primary">
          Take the diagnostic
        </Link>
        <Link href="/doctrine" className="vf-btn vf-btn--secondary">
          Read the doctrine
        </Link>
      </div>
    </main>
  );
}
