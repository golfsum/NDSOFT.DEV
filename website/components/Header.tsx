import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          ND Software
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/apps/buildpad"
            className="text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition"
          >
            BuildPad
          </Link>
          <a
            href="mailto:support@ndsoft.dev"
            className="text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
