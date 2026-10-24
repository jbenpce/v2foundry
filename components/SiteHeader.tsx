import Link from "next/link";

const links = [
  { href: "/doctrine", label: "Doctrine" },
  { href: "/diagnostic", label: "Diagnostic" },
  { href: "/cohort", label: "Cohort" },
] as const;

export function SiteHeader() {
  return (
    <header className="vf-nav">
      <Link href="/" className="vf-nav__mark" aria-label="V2 Foundry home">
        V2 Foundry
      </Link>
      <nav aria-label="Primary">
        <ul className="vf-nav__links">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
