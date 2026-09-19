export default function Page() {
  return (
    <div className="ss-shell ss-legal">
      <header className="ss-nav">
        <a className="ss-brand" href="/"><span className="ss-icon" aria-hidden="true">↗</span><span>StrideScore</span></a>
      </header>
      <main>
        <p className="ss-kicker">StrideScore</p>
        <h1>Terms of Use</h1>
        <p className="ss-updated">Last updated September 18, 2026</p>
        <section><h2>Using StrideScore</h2><p>StrideScore is provided for personal activity tracking and general informational purposes. You are responsible for how you use the app and for deciding what level of physical activity is appropriate for you.</p></section>
        <section><h2>Accounts</h2><p>You are responsible for maintaining access to your account and for providing accurate information. Do not use StrideScore in a way that interferes with the service or other users.</p></section>
        <section><h2>Subscriptions and purchases</h2><p>If paid features are offered through Apple, billing, renewals, cancellations, and refunds are handled according to the terms of the App Store and your Apple account.</p></section>
        <section><h2>Availability</h2><p>We may update, change, suspend, or discontinue features as the product evolves. We work to keep StrideScore available and reliable but do not guarantee uninterrupted operation.</p></section>
        <section><h2>No medical advice</h2><p>StrideScore is not a medical device and does not provide medical advice, diagnosis, or treatment.</p></section>
        <section><h2>Contact</h2><p>Questions about these terms can be sent to <a href="mailto:StrideScore@ndsoft.dev">StrideScore@ndsoft.dev</a>.</p></section>
      </main>
      <footer className="ss-footer">
        <span>© 2026 ND SOFT LLC</span>
        <div><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/support">Support</a></div>
      </footer>
    </div>
  );
}
