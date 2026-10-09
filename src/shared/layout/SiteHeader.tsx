"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Leaf, Menu, X } from "lucide-react";

export const NAV_LINKS = [
  { href: "/ingredients", label: "Ingredients" },
  { href: "/products", label: "Products" },
  { href: "/compatibility", label: "Compatibility Checker" },
  { href: "/assistant", label: "AI Assistant" },
  { href: "/routine", label: "Routine Builder" },
] as const;

export default function SiteHeader() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) =>
    `sw-small transition-colors hover:text-white ${
      pathname.startsWith(href) ? "text-white" : "text-[var(--sw-soft)]"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[var(--sw-forest)]">
      <div className="sw-container flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 text-white" aria-label="SkinWise home">
          <Leaf size={20} strokeWidth={1.75} className="text-[var(--sw-soft)]" aria-hidden />
          <span className="font-[family-name:var(--font-display)] text-lg font-semibold">SkinWise</span>
        </Link>

        {/* <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav> */}

        {/* <div className="flex items-center gap-3">
          <Link href="/login" className="sw-btn sw-btn-primary !px-4 !py-2">
            Log in / Sign up
          </Link>
          <button
            type="button"
            className="text-white md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div> */}
      </div>

      {open && (
        <nav aria-label="Mobile" className="flex flex-col gap-4 border-t border-white/10 px-6 py-5 md:hidden">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}