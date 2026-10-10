import Link from "next/link";
import { Leaf } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      ["Ingredient Search", "/ingredients"],
      ["Compatibility Checker", "/compatibility"],
      ["Routine Builder", "/routine"],
      ["AI Assistant", "/assistant"],
    ],
  },
  {
    title: "Company",
    links: [["About Us", "/about"], ["Blog", "/blog"], ["Press", "/press"], ["Careers", "/careers"]],
  },
  {
    title: "Support",
    links: [
      ["Help Center", "/help"],
      ["Contact Us", "/contact"],
      ["Privacy Policy", "/privacy"],
      ["Terms of Use", "/terms"],
    ],
  },
] as const;

export default function SiteFooter() {
  return (
    <footer className="bg-[var(--sw-forest)] text-[var(--sw-soft)]">
      <div className="sw-container grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-white">
            <Leaf size={20} strokeWidth={1.75} className="text-[var(--sw-soft)]" aria-hidden />
            <span className="font-[family-name:var(--font-display)] text-lg font-semibold">SkinWise</span>
          </div>
          <p className="mt-4 max-w-[16rem] text-[0.9375rem] leading-relaxed opacity-80">
            Skincare intelligence for everyone — from first-time buyers to multi-step routine devotees.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="sw-eyebrow !text-[var(--sw-soft)]">{col.title}</h2>
            <ul className="mt-4 space-y-3">
              {col.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="sw-small opacity-80 transition-opacity hover:opacity-100">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="sw-container border-t border-white/10 py-6">
        <p className="sw-small opacity-60">© 2026 SkinWise. Not a substitute for professional dermatological advice.</p>
      </div>
    </footer>
  );
}