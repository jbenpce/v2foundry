import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
  {
    href: "https://substack.com/@genxalpha",
    label: "Substack",
    external: true,
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="vf-footer">
      <p className="vf-footer__tag">Build your next version.</p>
      <ul className="vf-footer__links">
        {links.map((link) => (
          <li key={link.href}>
            {"external" in link && link.external ? (
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ) : (
              <Link href={link.href}>{link.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </footer>
  );
}
