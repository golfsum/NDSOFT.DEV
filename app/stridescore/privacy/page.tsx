export default function Page() {
  return (
    <div className="ss-shell ss-legal">
      <header className="ss-nav">
        <a className="ss-brand" href="/"><span className="ss-icon" aria-hidden="true">↗</span><span>StrideScore</span></a>
      </header>
      <main>
        <p className="ss-kicker">StrideScore</p>
        <h1>Privacy Policy</h1>
        <p className="ss-updated">Last updated September 18, 2026</p>
        <section><h2>Overview</h2><p>StrideScore is provided by ND SOFT LLC. We collect only the information needed to provide the app, maintain accounts, and support the features you choose to use.</p></section>
        <section><h2>Account information</h2><p>If you create an account, authentication providers may provide information such as your email address, display name, or provider identifier. Authentication is used to sign you in and sync account features.</p></section>
        <section><h2>Activity and motion data</h2><p>StrideScore may use motion and fitness data, such as steps recorded during an active session, to calculate and display your activity. The app is designed around session tracking rather than collecting your entire daily step history.</p></section>
        <section><h2>Location</h2><p>Location access is optional and is used when you choose route tracking. StrideScore can be used without enabling location. Location permission can be changed at any time in iOS Settings.</p></section>
        <section><h2>Photos</h2><p>If you choose a profile photo, the app may access the photo you select or the camera when you choose to take a new photo.</p></section>
        <section><h2>Data use</h2><p>Information is used to provide StrideScore, sync your account, show your activity history, troubleshoot problems, prevent abuse, and improve reliability. We do not sell personal information.</p></section>
        <section><h2>Data retention and deletion</h2><p>We retain account information for as long as needed to provide the service or meet legal obligations. For account or data deletion requests, contact StrideScore@ndsoft.dev.</p></section>
        <section><h2>Contact</h2><p>Questions about this policy can be sent to <a href="mailto:StrideScore@ndsoft.dev">StrideScore@ndsoft.dev</a>.</p></section>
      </main>
      <footer className="ss-footer">
        <span>© 2026 ND SOFT LLC</span>
        <div><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/support">Support</a></div>
      </footer>
    </div>
  );
}
