export default function Page() {
  return (
    <div className="ss-shell ss-legal">
      <header className="ss-nav">
        <a className="ss-brand" href="/"><span className="ss-icon" aria-hidden="true">↗</span><span>StrideScore</span></a>
      </header>
      <main>
        <p className="ss-kicker">StrideScore</p>
        <h1>Support</h1>
        <p className="ss-updated">Help with StrideScore</p>
        <section><h2>Contact support</h2><p>Email <a href="mailto:StrideScore@ndsoft.dev">StrideScore@ndsoft.dev</a> for account access, sign-in problems, activity tracking questions, bug reports, or data deletion requests.</p></section>
        <section><h2>What to include</h2><p>For technical problems, include your iPhone model, iOS version, StrideScore app version, what you expected to happen, and what happened instead. Please do not send passwords or other sensitive credentials.</p></section>
        <section><h2>Sign-in help</h2><p>StrideScore supports the sign-in methods shown in the app. If a provider sign-in fails, try again with a stable connection and make sure you are using the same sign-in method you originally used for the account.</p></section>
      </main>
      <footer className="ss-footer">
        <span>© 2026 ND SOFT LLC</span>
        <div><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/support">Support</a></div>
      </footer>
    </div>
  );
}
