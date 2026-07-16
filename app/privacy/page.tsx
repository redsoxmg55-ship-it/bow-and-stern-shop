import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';

export const metadata = { title: 'Privacy Policy — Bow & Stern Soap Co.' };

export default function PrivacyPage() {
  return (
    <>
      <SiteNav />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '120px 24px 80px' }}>
        <div className="crumbs" style={{ marginBottom: 40 }}>
          <Link href="/">Home</Link> &nbsp;/&nbsp; Privacy Policy
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: 48 }}>
          Effective date: June 24, 2025 &nbsp;·&nbsp; Last updated: June 24, 2025
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, color: 'var(--text-mid)', lineHeight: 1.8 }}>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>1. Who We Are</h2>
            <p>Bow &amp; Stern Soap Co. (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is a handcrafted soap company based in New England, USA. We operate the website at this domain and can be reached at <a href="mailto:bowandsternsoapco@gmail.com" style={{ color: 'var(--gold)' }}>bowandsternsoapco@gmail.com</a>.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>2. What Information We Collect</h2>
            <p style={{ marginBottom: 12 }}>We collect information you provide directly when placing an order or submitting a private client inquiry:</p>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li><strong>Contact information</strong> — first name, last name, email address, phone number</li>
              <li><strong>Shipping information</strong> — mailing address, city, state, ZIP code</li>
              <li><strong>Order details</strong> — product selections, quantities, customization choices (color, scent, engraving)</li>
              <li><strong>Logo or artwork files</strong> — only if you choose to upload one for a private client order</li>
            </ul>
            <p style={{ marginTop: 12 }}>We do <strong>not</strong> collect payment card numbers directly. Payment is handled via your chosen payment provider.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>3. How We Use Your Information</h2>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>To process and fulfill your order</li>
              <li>To contact you about your order status</li>
              <li>To respond to inquiries and private client requests</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p style={{ marginTop: 12 }}>We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>4. How We Store Your Information</h2>
            <p>Order information submitted through this site is sent directly to our business email via Gmail (Google Workspace). We do not operate a customer database. Your cart data is stored only in your browser&rsquo;s <code>localStorage</code> and is never transmitted to our servers unless you complete a checkout.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>5. Cookies &amp; Local Storage</h2>
            <p>This site does not use tracking cookies or advertising pixels. We use browser <code>localStorage</code> solely to remember your cart contents between page visits. This data stays on your device and is not accessible to us until you submit an order.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>6. Third-Party Services</h2>
            <p>We use Gmail (Google) to receive order notification emails. Google&rsquo;s privacy policy applies to data processed through their services. We do not use analytics platforms, advertising networks, or social tracking pixels on this site.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>7. Your Rights</h2>
            <p style={{ marginBottom: 12 }}>Depending on where you live, you may have the right to:</p>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Object to or restrict how we use your data</li>
              <li>Lodge a complaint with a supervisory authority (EU/UK residents)</li>
            </ul>
            <p style={{ marginTop: 12 }}>To exercise any of these rights, email us at <a href="mailto:bowandsternsoapco@gmail.com" style={{ color: 'var(--gold)' }}>bowandsternsoapco@gmail.com</a>.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>8. Children&rsquo;s Privacy</h2>
            <p>This site is not directed to children under 13. We do not knowingly collect personal information from children.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. The effective date at the top of this page will reflect the most recent revision. Continued use of the site after any changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>10. Contact Us</h2>
            <p>Questions or concerns? Reach us at:</p>
            <p style={{ marginTop: 8 }}>
              Bow &amp; Stern Soap Co.<br />
              New England, USA<br />
              <a href="mailto:bowandsternsoapco@gmail.com" style={{ color: 'var(--gold)' }}>bowandsternsoapco@gmail.com</a><br />
              <a href="tel:6176317175" style={{ color: 'var(--gold)' }}>617-631-7175</a>
            </p>
          </section>

        </div>
      </div>
      <SiteFooter />
    </>
  );
}
