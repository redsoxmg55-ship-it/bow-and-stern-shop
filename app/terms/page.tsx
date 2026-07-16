import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';

export const metadata = { title: 'Terms of Service — Bow & Stern Soap Co.' };

export default function TermsPage() {
  return (
    <>
      <SiteNav />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '120px 24px 80px' }}>
        <div className="crumbs" style={{ marginBottom: 40 }}>
          <Link href="/">Home</Link> &nbsp;/&nbsp; Terms of Service
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: 48 }}>
          Effective date: June 24, 2025 &nbsp;·&nbsp; Last updated: June 24, 2025
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, color: 'var(--text-mid)', lineHeight: 1.8 }}>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>1. Acceptance of Terms</h2>
            <p>By accessing or using the Bow &amp; Stern Soap Co. website and placing an order, you agree to be bound by these Terms of Service. If you do not agree, please do not use this site.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>2. Products &amp; Pricing</h2>
            <p>All prices are listed in US dollars and are exclusive of applicable taxes and shipping unless otherwise stated. We reserve the right to update pricing at any time. Prices shown at the time of your order submission are the prices that apply to that order.</p>
            <p style={{ marginTop: 12 }}>Product photos are representative. Handcrafted items may vary slightly in color, texture, and finish — this is a natural characteristic of small-batch production.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>3. Minimum Order Quantity</h2>
            <p>Bulk and private client orders carry a minimum order quantity (MOQ) of 100 bars at $5.50 per bar. Single-bar orders are available at $7.00 per bar. MOQ requirements are clearly noted at checkout.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>4. Custom &amp; Private Client Orders</h2>
            <p>Custom logo or engraving design work carries a one-time $35 design fee per unique design. This fee covers the creation of a new custom design. Once a design is approved and on file, it may be reused in future orders at no additional design fee.</p>
            <p style={{ marginTop: 12 }}>Custom orders are non-refundable once production has begun. Please review all customization details carefully before submitting your request.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>5. Order Processing</h2>
            <p>Orders submitted through this site are received via email and processed manually by our team. You will receive a confirmation and follow-up communication within 1–2 business days. Submission of an order does not constitute a binding contract until we confirm acceptance.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>6. Shipping</h2>
            <p>Shipping costs and timelines are calculated at the time of order confirmation. We ship within the United States. International shipping inquiries may be directed to <a href="mailto:bowandsternsoapco@gmail.com" style={{ color: 'var(--gold)' }}>bowandsternsoapco@gmail.com</a>.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>7. Returns &amp; Refunds</h2>
            <p>Due to the handcrafted and perishable nature of our products, we do not accept returns on opened or used soap. If your order arrives damaged or incorrect, please contact us within 7 days of delivery and we will make it right.</p>
            <p style={{ marginTop: 12 }}>Custom and bulk orders are non-refundable once production has started.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>8. Intellectual Property</h2>
            <p>All content on this site — including text, images, logos, and design — is the property of Bow &amp; Stern Soap Co. and may not be reproduced without written permission. Customer-submitted logos and artwork remain the property of the customer.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>9. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, Bow &amp; Stern Soap Co. shall not be liable for any indirect, incidental, or consequential damages arising from use of our products or this website. Our total liability for any claim shall not exceed the amount paid for the order in question.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>10. Governing Law</h2>
            <p>These terms are governed by the laws of the Commonwealth of Massachusetts, USA, without regard to conflict of law principles.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>11. Changes to These Terms</h2>
            <p>We reserve the right to update these Terms at any time. The effective date at the top of this page reflects the most recent revision. Continued use of the site constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 12 }}>12. Contact</h2>
            <p>Questions about these terms? Contact us:</p>
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
