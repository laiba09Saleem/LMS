"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/70 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-slate-950">
              <span className="text-lg font-semibold">L</span>
            </span>
            <span className="text-lg font-semibold text-slate-50">LearnHub</span>
          </Link>
          <p className="text-sm text-slate-400">
            Empowering learners with modern, practical courses and world-class mentors.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-slate-100">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/courses", label: "Courses" },
              { href: "/programs", label: "Programs" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-slate-400 transition hover:text-emerald-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-slate-100">Resources</h3>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/resources/notes", label: "Notes" },
              { href: "/resources/books", label: "Books" },
              { href: "/resources/past-papers", label: "Past Papers" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-slate-400 transition hover:text-emerald-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-slate-100">Contact</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <span className="text-slate-500">✉</span>
              support@learnhub.com
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-500">☎</span>
              +1 (555) 123-4567
            </li>
            <li className="flex items-center gap-2">
              <span className="text-slate-500">📍</span>
              123 Learning Avenue, Knowledge City
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-slate-500 md:flex-row">
          <p>© {currentYear} LearnHub. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-emerald-300">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-emerald-300">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
