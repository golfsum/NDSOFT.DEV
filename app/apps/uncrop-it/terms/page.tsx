import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Uncrop It Terms of Service',
  description: 'Terms of Service for the Uncrop It app by ND Software LLC.',
};

const EFFECTIVE_DATE = 'June 18, 2026';

export default function UncropItTermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 prose-legal">
      <header className="mb-10">
        <div className="text-xs font-medium text-[var(--color-brand)] uppercase tracking-wider">
          Uncrop It
        </div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-[var(--color-text)]">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-[var(--color-text-dim)]">
          Effective {EFFECTIVE_DATE}
        </p>
      </header>

      <p>
        These Terms of Service (the &ldquo;Terms&rdquo;) are a binding
        agreement between you and ND Software LLC, an Arizona limited
        liability company (&ldquo;ND Software,&rdquo; &ldquo;we,&rdquo;
        &ldquo;us,&rdquo; or &ldquo;our&rdquo;), governing your access to and
        use of the Uncrop It app and the website at{' '}
        <a href="https://ndsoftware.dev">ndsoftware.dev</a> (together with the
        app, the &ldquo;Services&rdquo;). By using the Services, you agree to
        these Terms. If you do not agree, do not use the Services.
      </p>

      <h2>1. License</h2>
      <p>
        Subject to your compliance with these Terms, ND Software grants you a
        limited, non-exclusive, non-transferable, revocable license to
        install and use Uncrop It on Apple-branded devices you own or control,
        solely for your personal or internal business use. This license is
        governed by{' '}
        <a
          href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Apple&rsquo;s Licensed Application End User License Agreement
        </a>{' '}
        except where these Terms provide otherwise. You may not reverse
        engineer, decompile, redistribute, sublicense, or resell the
        Services, except to the extent that applicable law expressly permits
        such actions notwithstanding this restriction.
      </p>

      <h2>2. Purchases &amp; Subscriptions</h2>
      <p>
        Some features of Uncrop It may require a paid plan or purchase. Where the
        app offers paid options, these may include auto-renewing{' '}
        <strong>subscriptions</strong> and/or one-time{' '}
        <strong>purchases</strong>, as presented within the app. All
        transactions are processed by Apple through the App Store and managed by
        RevenueCat on our behalf. Pricing and availability are set in App Store
        Connect and may be shown in your local currency. By making a purchase,
        you authorize Apple to charge the payment method on file with your
        Apple ID.
      </p>
      <p>
        <strong>Subscriptions.</strong> Auto-renewing subscriptions are charged
        to your Apple ID at confirmation of purchase, and renew for the same
        duration at the then-current price unless auto-renewal is turned off at
        least 24 hours before the end of the current period. You can manage or
        cancel subscriptions at any time in{' '}
        <a
          href="https://apps.apple.com/account/subscriptions"
          target="_blank"
          rel="noopener noreferrer"
        >
          Settings &rarr; Apple ID &rarr; Subscriptions
        </a>
        . Cancellation takes effect at the end of the current billing period;
        partial-period refunds are governed by Apple&rsquo;s policies.
      </p>
      <p>
        <strong>One-time purchases.</strong> A non-consumable one-time purchase
        carries no recurring charge. It is tied to your Apple ID and restores
        automatically on devices signed in with that Apple ID.
      </p>
      <p>
        <strong>Refunds.</strong> All refunds are handled by Apple according
        to Apple&rsquo;s refund policy. Because we do not process payments
        directly, we cannot issue refunds ourselves. You can request a refund
        through Apple at{' '}
        <a
          href="https://reportaproblem.apple.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          reportaproblem.apple.com
        </a>
        .
      </p>

      <h2>3. Your Content</h2>
      <p>
        Uncrop It operates on content you provide, for example the photos you
        choose to uncrop, resize, or animate. To deliver these features, that
        content is uploaded to our backend and sent to our AI processing
        providers to generate a result, as described in our{' '}
        <a href="/apps/uncrop-it/privacy">Privacy Policy</a>. You retain
        ownership of the content you provide, and you grant us the limited rights
        necessary to host and process it solely to deliver the Services to you.
      </p>
      <p>
        You are solely responsible for the content you submit. You represent
        that you have the rights to the photos and other content you upload and
        that doing so does not violate the law or the rights of any third party.
        You must not upload content that is illegal, infringing, or that depicts
        another person without the necessary rights or consent.
      </p>

      <h2>4. Acceptable Use</h2>
      <p>You agree not to use the Services to:</p>
      <ul>
        <li>Violate any law, regulation, or the rights of any third party.</li>
        <li>
          Attempt to disrupt, overload, or probe the security of the Services
          or any related systems (including Apple&rsquo;s or
          RevenueCat&rsquo;s).
        </li>
        <li>
          Use the Services in a manner that violates Apple&rsquo;s developer
          agreements or App Store guidelines.
        </li>
        <li>
          Misrepresent your identity, affiliation, or the origin of content
          you submit.
        </li>
      </ul>

      <h2>5. Intellectual Property</h2>
      <p>
        The Services, including all software, source code, graphics, text,
        logos, and other content we provide, are owned by ND Software or our
        licensors and are protected by intellectual-property laws. Except for
        the limited license in Section 1, we grant you no rights in our
        intellectual property.
      </p>

      <h2>6. Changes to the Services</h2>
      <p>
        We may modify, add, or discontinue features of the Services at any
        time. We may also release updates to Uncrop It; by continuing to use
        the app after an update, you agree to the updated version.
      </p>

      <h2>7. Disclaimers</h2>
      <p>
        THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
        AVAILABLE,&rdquo; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.
        TO THE FULLEST EXTENT PERMITTED BY LAW, ND SOFTWARE DISCLAIMS ALL
        WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
        FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT
        THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE FROM
        HARMFUL COMPONENTS, OR THAT ANY DATA TRANSMITTED THROUGH THE SERVICES
        WILL BE SECURE OR ACCURATE.
      </p>
      <p>
        The Services rely on third-party platforms and APIs (including
        Apple&rsquo;s services and the AI inference providers that power our
        editing features) that may change, become unavailable, produce
        inaccurate or unexpected results, or rate-limit requests at any time. We
        are not responsible for the availability or accuracy of those
        third-party services.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL ND SOFTWARE
        BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
        PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, DATA, GOODWILL, OR
        OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH YOUR
        USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY
        OF SUCH DAMAGES.
      </p>
      <p>
        OUR TOTAL AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR
        RELATING TO THE SERVICES IS LIMITED TO THE GREATER OF (a) THE AMOUNT
        YOU PAID US (IF ANY) IN THE TWELVE MONTHS PRECEDING THE CLAIM OR (b)
        USD $10.
      </p>

      <h2>9. Indemnification</h2>
      <p>
        You agree to indemnify and hold ND Software and its affiliates,
        officers, and employees harmless from any claim, demand, or expense
        (including reasonable attorneys&rsquo; fees) arising out of your use
        of the Services, your violation of these Terms, or your violation of
        any rights of a third party.
      </p>

      <h2>10. Governing Law; Venue</h2>
      <p>
        These Terms are governed by the laws of the State of Arizona, USA,
        without regard to conflict-of-laws principles. Any dispute arising
        out of or relating to these Terms or the Services will be resolved
        exclusively in the state or federal courts located in Maricopa
        County, Arizona, and you consent to the personal jurisdiction of
        those courts.
      </p>

      <h2>11. Termination</h2>
      <p>
        We may suspend or terminate your access to the Services at any time
        for any reason, including if we believe you have violated these
        Terms. You may stop using the Services at any time. Sections that by
        their nature should survive termination (including intellectual
        property, disclaimers, limitation of liability, indemnification, and
        governing law) will survive.
      </p>

      <h2>12. Miscellaneous</h2>
      <p>
        These Terms are the entire agreement between you and ND Software
        regarding the Services and supersede any prior agreements. If any
        provision of these Terms is held unenforceable, the remaining
        provisions will remain in full force. Our failure to enforce any
        right is not a waiver of that right. You may not assign these Terms;
        we may assign them without restriction.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions about these Terms can be directed to:
      </p>
      <p>
        ND Software LLC
        <br />
        Arizona, USA
        <br />
        <a href="mailto:support@ndsoft.dev">support@ndsoft.dev</a>
      </p>

      <p className="mt-10 text-sm">
        See also the{' '}
        <a href="/apps/uncrop-it/privacy">Uncrop It Privacy Policy</a>.
      </p>
    </article>
  );
}
