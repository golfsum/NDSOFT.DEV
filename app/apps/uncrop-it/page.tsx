import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Uncrop It',
  description:
    'Extend any photo beyond its edges with AI outpainting and reframe it for any social platform, all from your iPhone or iPad.',
  openGraph: {
    title: 'Uncrop It · ND Software',
    description:
      'Extend any photo beyond its edges with AI, then reframe it to fit anywhere.',
    url: 'https://ndsoftware.dev/apps/uncrop-it',
  },
};

const features = [
  {
    icon: '🖼️',
    title: 'AI uncrop',
    body: 'Pick any photo and Uncrop It extends the scene naturally past its original frame, with photorealistic fill, seamless edges, and no awkward borders.',
  },
  {
    icon: '📐',
    title: 'Fit any platform',
    body: 'One-tap export sizes for Instagram, TikTok, YouTube, X, Facebook, LinkedIn, Pinterest, and the App Store. Reframe a shot instead of cropping it.',
  },
  {
    icon: '🎯',
    title: 'Pixel-perfect presets',
    body: 'Stories, reels, thumbnails, channel art, covers, and app icons. Every preset lands on the exact dimensions each platform expects.',
  },
  {
    icon: '📲',
    title: 'Sign in your way',
    body: 'Continue with Apple, continue with Google, or keep it anonymous. Your work stays tied to your account across devices.',
  },
  {
    icon: '🔒',
    title: 'Only when you ask',
    body: 'Your photo is uploaded securely only to run the edit you requested, processed, and handed right back. Nothing is sold, shared, or used to train models.',
  },
];

export default function UncropItPage() {
  return (
    <div className="mx-auto max-w-4xl px-6">
      <section className="pt-20 pb-12">
        <div className="text-xs font-medium text-[var(--color-brand)] uppercase tracking-wider">
          iOS · iPhone & iPad
        </div>
        <h1 className="mt-3 text-5xl sm:text-6xl font-bold tracking-tight">
          Uncrop It
        </h1>
        <p className="mt-6 text-xl sm:text-2xl text-[var(--color-text-dim)] max-w-2xl leading-snug">
          Extend any photo past its edges with AI, then reframe it to fit
          anywhere.
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
        <h2 className="text-sm uppercase tracking-widest text-[var(--color-text-dim)] mb-4">
          How it works
        </h2>
        <ol className="space-y-4 text-[var(--color-text-dim)] leading-relaxed list-decimal pl-5">
          <li>Choose a photo from your library or snap a new one.</li>
          <li>
            Set how far to expand it, or pick a platform preset like a 9:16
            story or a square post.
          </li>
          <li>
            Uncrop It extends and reframes the shot in seconds. Save the result
            straight back to your photo library.
          </li>
        </ol>
      </section>

      <section className="mb-16">
        <div className="p-7 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)]">
          <h2 className="text-2xl font-bold">Coming soon to the App Store</h2>
          <p className="mt-3 text-sm text-[var(--color-text-dim)] leading-relaxed max-w-xl">
            Uncrop It is in the final stretch of development for iPhone and iPad.
            Want to know the moment it launches?{' '}
            <a
              href="mailto:support@ndsoft.dev?subject=Notify%20me%20about%20Uncrop%20It"
              className="text-[var(--color-brand)] hover:underline"
            >
              Email us
            </a>{' '}
            and we&rsquo;ll let you know.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-dim)] font-semibold cursor-not-allowed">
            Download on the App Store (soon)
          </span>
        </div>
      </section>

      <section className="mb-24">
        <h2 className="text-sm uppercase tracking-widest text-[var(--color-text-dim)] mb-4">
          Privacy
        </h2>
        <div className="space-y-4 text-[var(--color-text-dim)] leading-relaxed">
          <p>
            Uncrop It runs its AI in the cloud, so the photo you choose to edit
            is uploaded securely to our backend, processed, and returned to you.
            We don&rsquo;t sell or share your images, and we don&rsquo;t use them
            to train AI models.
          </p>
          <p>
            For the full details, see the Uncrop It{' '}
            <a
              href="/apps/uncrop-it/privacy"
              className="text-[var(--color-brand)] hover:underline"
            >
              Privacy Policy
            </a>{' '}
            and{' '}
            <a
              href="/apps/uncrop-it/terms"
              className="text-[var(--color-brand)] hover:underline"
            >
              Terms of Service
            </a>
            . Questions?{' '}
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
