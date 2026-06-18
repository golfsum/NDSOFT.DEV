import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-24">
      <div className="mx-auto max-w-5xl px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-[var(--color-text-dim)]">
        <div>© {new Date().getFullYear()} ND Software LLC</div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/privacy" className="hover:text-[var(--color-text)] transition">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[var(--color-text)] transition">
            Terms
          </Link>
          <a href="mailto:support@ndsoft.dev" className="hover:text-[var(--color-text)] transition">
            support@ndsoft.dev
          </a>
        </nav>
      </div>
    </footer>
  );
}
