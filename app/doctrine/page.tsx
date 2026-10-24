import type { Metadata } from "next";
import Link from "next/link";
import { formatDoctrineDate, getAllDoctrineEssays } from "@/lib/doctrine";

export const metadata: Metadata = {
  title: "Doctrine",
  description:
    "GenXAlpha writing — free, always. Worldview before product. Canonical on v2foundry.com.",
};

export default function DoctrineIndexPage() {
  const essays = getAllDoctrineEssays();

  return (
    <main className="vf-doctrine">
      <header className="vf-doctrine__header">
        <p className="vf-doctrine__eyebrow">Doctrine</p>
        <h1 className="vf-doctrine__title">GenXAlpha</h1>
        <p className="vf-doctrine__lede">
          Free writing on the ladder, the four sheets, and what stays scarce.
          No paywall. No email gate on the prose.
        </p>
      </header>

      {essays.length === 0 ? (
        <p className="vf-doctrine__empty">
          Essays are on the way. The first argument lands here first, then
          syndicates out.
        </p>
      ) : (
        <ul className="vf-doctrine__list">
          {essays.map((essay) => (
            <li key={essay.slug} className="vf-doctrine__item">
              <Link href={`/doctrine/${essay.slug}`} className="vf-doctrine__link">
                {essay.argument != null ? (
                  <span className="vf-doctrine__arg">Argument {essay.argument}</span>
                ) : null}
                <span className="vf-doctrine__item-title">{essay.title}</span>
                <span className="vf-doctrine__item-desc">{essay.description}</span>
                <span className="vf-doctrine__item-meta">
                  {essay.byline} · {formatDoctrineDate(essay.date)} ·{" "}
                  {essay.readingMinutes} min
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
