const testFlightUrl = "https://testflight.apple.com/join/kpGhqe6Z";
const features = [
  ["01", "A little time. A new best.", "Pick a timed challenge and see how many steps you can take. Your personal best gives you something to aim for the next time you head out."],
  ["02", "Walk at your own pace.", "Prefer to keep going? Stopwatch mode lets you take an open-ended walk while following your time, steps, and steps per minute."],
  ["03", "See where your steps take you.", "Turn on route tracking to record your walk and distance. Revisit saved sessions and watch your walking history grow."],
  ["04", "Keep your progress close.", "Follow your session on Apple Watch or glance at your timer and steps with Live Activity on your iPhone Lock Screen."],
  ["05", "Small wins add up.", "Build a streak, collect achievements, and compare your personal bests. Make your next walk a reason to keep showing up."],
  ["06", "A little friendly competition.", "Connect with friends, send a walking challenge, and compare scores. Choose whether to participate in the public leaderboard."],
];
export default function StrideScorePage() {
  return (
    <div className="ss-shell">
      <a className="ss-skip" href="#main">Skip to content</a>
      <header className="ss-nav">
        <a className="ss-brand" href="/" aria-label="StrideScore home"><img className="ss-app-icon" src="/stridescore/images/app-icon.png" width="42" height="42" alt="" /><span>StrideScore</span></a>
        <nav aria-label="Main navigation"><a href="#features">Features</a><a href="#beta" className="ss-nav-beta">Join the beta ↗</a></nav>
      </header>
      <main id="main">
        <section className="ss-hero ss-hero-grid">
          <div><p className="ss-kicker">A reason to take the long way.</p><h1>Make every<br />walk count.</h1>
            <p className="ss-lead">Turn a quick break or an evening walk into a challenge worth coming back to. Count your steps, beat your best, and see how far a little consistency takes you.</p>
            <div className="ss-actions"><a className="ss-badge" href={testFlightUrl}>Join on TestFlight ↗</a><a className="ss-link" href="#features">Explore the app ↓</a></div>
            <p className="ss-small">iPhone beta · Apple Watch companion</p>
          </div>
          <figure className="ss-art"><img src="/stridescore/images/walking-landscape.png" alt="StrideScore artwork: a sunlit desert city surrounded by mountains and saguaro cacti" width="1026" height="488" fetchPriority="high" /><figcaption><span>OUTSIDE IS CALLING</span><strong>Your next best starts<br />with a single step.</strong><span>Artwork from StrideScore</span></figcaption></figure>
        </section>
        <section className="ss-intro" id="features"><p className="ss-kicker">More than a daily step total</p><h2>A walk with a purpose.<br />Progress you can come back to.</h2><p>StrideScore is built around the walks you choose to take. Start a session, follow your progress, and finish with a score that belongs to that walk.</p></section>
        <section className="ss-grid" aria-label="StrideScore features">{features.map(([number, title, description]) => <article key={number}><span>{number}</span><h2>{title}</h2><p>{description}</p></article>)}</section>
        <section className="ss-how" aria-labelledby="how-title"><div><p className="ss-kicker">Your first walk</p><h2 id="how-title">Ready when you are.</h2><p>No complicated routine to plan. Just a little time and somewhere to walk.</p></div><ol><li><strong>Choose your way to walk</strong><p>Pick a timed challenge or start the stopwatch for a walk without a finish line.</p></li><li><strong>Start moving</strong><p>Follow your steps and pace. Enable route tracking when you want to save where you went.</p></li><li><strong>Make it a habit</strong><p>Review your session, celebrate a personal best, and come back for the next one.</p></li></ol></section>
        <section className="ss-note ss-beta" id="beta" aria-labelledby="beta-title"><img className="ss-beta-icon" src="/stridescore/images/app-icon.png" alt="StrideScore app icon" width="100" height="100" loading="lazy" /><div><p className="ss-kicker">Help shape StrideScore</p><h2 id="beta-title">Your next walk.<br />Our next chapter.</h2><p>Try the iPhone beta and tell us how it feels on your everyday walks. Your feedback helps improve the app before its public release.</p><a className="ss-badge" href={testFlightUrl}>Sign up for the TestFlight beta ↗</a><p className="ss-small">Open the link on your iPhone, install Apple’s TestFlight app if prompted, then accept the invitation and install StrideScore. Beta availability is shown on TestFlight.</p></div></section>
        <section className="ss-faq" aria-labelledby="faq-title"><div><p className="ss-kicker">A few things to know</p><h2 id="faq-title">Before your first step.</h2></div><div>
          <details><summary>Do I need an Apple Watch?</summary><p>No. You can start walking sessions on your iPhone. The Apple Watch companion gives you another way to keep your session close at hand.</p></details>
          <details><summary>Can I try it without creating an account?</summary><p>Yes. Guest mode supports local walking sessions. Sign in when you want to connect with friends and use social features.</p></details>
          <details><summary>What does StrideScore Pro add?</summary><p>The core walking experience includes timed challenges, stopwatch walks, step counting, and personal bests. Pro adds features including unlimited history, advanced stats, custom challenge lengths, and more achievements. Current offers and eligibility are shown in the app.</p></details>
          <details><summary>Do I have to share my route?</summary><p>No. Route tracking is optional, and session history and recorded routes are stored locally. You control social participation in your profile settings. Read our <a href="/privacy">privacy policy</a> for details.</p></details>
          <details><summary>How do I send beta feedback?</summary><p>Send feedback through TestFlight or email <a href="mailto:StrideScore@ndsoft.dev">StrideScore@ndsoft.dev</a>. Let us know what you were doing and what you expected to happen.</p></details>
        </div></section>
      </main>
      <footer className="ss-footer"><span>© 2026 ND SOFT LLC</span><div><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/support">Support</a></div></footer>
    </div>
  );
}
