import type { Metadata } from 'next';
import Link from 'next/link';
import { APPS } from '@/lib/apps';

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'Privacy policies for ND Software LLC and each of its apps.',
};

export default function PrivacyIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Privacy</h1>
      <p className="mt-4 text-[var(--color-text-dim)] leading-relaxed max-w-2xl">
        Each ND Software app has its own privacy policy describing exactly what
        that app collects and how it&rsquo;s handled. Choose an app below.
      </p>

      <div className="mt-10 grid gap-4">
        {APPS.map((app) => (
          <Link
            key={app.slug}
            href={`/apps/${app.slug}/privacy`}
            className="group block p-6 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-brand)] transition"
          >
            <div className="font-bold text-lg">{app.name}</div>
            <div className="mt-1 text-sm text-[var(--color-text-dim)]">
              {app.tagline}
            </div>
            <div className="mt-4 text-sm font-medium text-[var(--color-brand)] group-hover:underline">
              Read the privacy policy →
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-sm text-[var(--color-text-dim)]">
        Questions about privacy at ND Software LLC?{' '}
        <a
          href="mailto:support@ndsoft.dev"
          className="text-[var(--color-brand)] hover:underline"
        >
          support@ndsoft.dev
        </a>
        .
      </p>
    </div>
  );
}
