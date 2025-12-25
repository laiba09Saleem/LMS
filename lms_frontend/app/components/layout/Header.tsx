"use client";

import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#courses", label: "Courses" },
  { href: "#mentors", label: "Mentors" },
  { href: "#about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 text-lg font-semibold">
            L
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-50">
            LearnHub
          </span>
        </Link>

        <div className="hidden gap-6 text-sm font-medium text-slate-300 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-emerald-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-xs font-medium text-slate-300 hover:text-white"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/30 hover:bg-emerald-300"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
