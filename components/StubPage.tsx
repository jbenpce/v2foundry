import Link from "next/link";

type StubPageProps = {
  label: string;
  title: string;
  body: string;
};

export function StubPage({ label, title, body }: StubPageProps) {
  return (
    <main className="vf-stub">
      <p className="vf-stub__label">{label}</p>
      <h1 className="vf-stub__title">{title}</h1>
      <p className="vf-stub__body">{body}</p>
      <Link href="/" className="vf-btn vf-btn--secondary">
        Back to home
      </Link>
    </main>
  );
}
