import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BuildPad',
  description:
    'Every TestFlight build across all your apps, in one view. Sort by expiry, see review status, copy public links. Monthly, yearly, or lifetime.',
  openGraph: {
    title: 'BuildPad · ND Software',
    description:
      'Every TestFlight build across all your apps, in one view.',
    url: 'https://ndsoftware.dev/apps/buildpad',
  },
};

const features = [
  {
    icon: '🚀',
    title: 'Unlimited apps',
    body: 'Free tier shows one app. Unlock to track every app on your App Store Connect account — no caps, no throttling.',
  },
  {
    icon: '⏱️',
    title: 'Live expiry countdowns',
    body: 'See exactly when each build expires, with color-coded badges that turn orange at 14 days and red under 3.',
  },
  {
    icon: '🟢',
    title: 'Real-time status',
    body: 'Processing state, Beta App Review status, and tester counts for every build — refreshed automatically.',
  },
  {
    icon: '🔗',
    title: 'Public link quick-share',
    body: "One tap to copy a build's TestFlight public link. Send it to testers without ever opening a browser.",
  },
  {
    icon: '📊',
    title: 'Global dashboard',
    body: 'Flatten every build across every app into one list, sorted by which one expires soonest.',
  },
  {
    icon: '🔒',
    title: 'Bring your own key',
    body: 'BuildPad uses your own App Store Connect API key, stored in the iOS Keychain. Your credentials never touch our servers — we don\u2019t have any.',
  },
];

export default function BuildPadPage() {
  return (
    <div className="mx-auto max-w-4xl px-6">
      <section className="pt-20 pb-12">
        <div className="text-xs font-medium text-[var(--color-brand)] uppercase tracking-wider">
          iOS · iPhone & iPad
        </div>
        <h1 className="mt-3 text-5xl sm:text-6xl font-bold tracking-tight">
          BuildPad
        </h1>
        <p className="mt-6 text-xl sm:text-2xl text-[var(--color-text-dim)] max-w-2xl leading-snug">
          Every TestFlight build. One screen. Sorted by what's expiring next.
        </p>
      </section>

      <section className="pb-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]"
            >
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 font-bold text-[var(--color-text)]">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-text-dim)] leading-relaxed">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <div className="mb-6">
          <div className="text-xs font-medium text-[var(--color-brand)] uppercase tracking-wider">
            BuildPad Pro
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold">
            Pick the plan that fits.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <PriceCard
            tier="Monthly"
            price="$2.99"
            period="/ month"
            blurb="Flexible. Cancel anytime."
          />
          <PriceCard
            tier="Yearly"
            price="$19.99"
            period="/ year"
            blurb="Save 44% vs. monthly."
            highlight="Best value"
          />
          <PriceCard
            tier="Lifetime"
            price="$49.99"
            period="one-time"
            blurb="Pay once. Yours forever."
            highlight="No subscription"
          />
        </div>

        <a
          href="#"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-brand)] text-white font-semibold hover:opacity-90 transition"
        >
          Download on the App Store
        </a>
        <p className="mt-4 text-xs text-[var(--color-text-dim)]">
          Free tier shows one app — no purchase required to try it out.
          Subscriptions auto-renew until cancelled in your Apple ID settings.
        </p>
      </section>

      <section className="mb-24">
        <h2 className="text-sm uppercase tracking-widest text-[var(--color-text-dim)] mb-4">
          How it works
        </h2>
        <div className="space-y-4 text-[var(--color-text-dim)] leading-relaxed">
          <p>
            BuildPad connects directly to your App Store Connect account using
            a standard API key you generate yourself in the{' '}
            <a
              href="https://appstoreconnect.apple.com/access/integrations/api"
              className="text-[var(--color-brand)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              App Store Connect integrations page
            </a>
            .
          </p>
          <p>
            Your key is stored on your device using the iOS Keychain. It never
            touches our servers — because we don't have any. Every request goes
            straight from your iPhone to Apple.
          </p>
          <p>
            Questions?{' '}
            <a
              href="mailto:support@ndsoft.dev"
              className="text-[var(--color-brand)] hover:underline"
            >
              support@ndsoft.dev
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

function PriceCard({
  tier,
  price,
  period,
  blurb,
  highlight,
}: {
  tier: string;
  price: string;
  period: string;
  blurb: string;
  highlight?: string;
}) {
  return (
    <div
      className={`relative p-6 rounded-xl border ${
        highlight === 'Best value'
          ? 'bg-[var(--color-card)] border-[var(--color-brand)]'
          : 'bg-[var(--color-card)] border-[var(--color-border)]'
      }`}
    >
      {highlight ? (
        <div className="absolute -top-2 left-4 px-2 py-0.5 rounded-full bg-[var(--color-brand)] text-white text-[10px] font-bold uppercase tracking-wider">
          {highlight}
        </div>
      ) : null}
      <div className="text-sm font-semibold text-[var(--color-text-dim)]">
        {tier}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-[var(--color-text)]">
          {price}
        </span>
        <span className="text-sm text-[var(--color-text-dim)]">{period}</span>
      </div>
      <p className="mt-3 text-sm text-[var(--color-text-dim)]">{blurb}</p>
    </div>
  );
}
