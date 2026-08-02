import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contact, shipping, items, subtotal, shippingCost, total } = body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'bowandsternsoapco@gmail.com',
        pass: 'qijjkjaevmgzqkxr',
      },
    });

    const itemRows = items.map((it: {
      name: string;
      form: string;
      qty: number;
      price: number;
      orderType?: string;
      engrave?: string;
      color?: string;
      scent?: string;
    }) => `
      <tr style="border-bottom:1px solid #e8e0d0;">
        <td style="padding:12px 0;">
          <strong style="font-family:Georgia,serif;color:#0D1F2D;">${it.name}</strong><br/>
          <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">${it.form}</span>
          ${it.color ? `<br/><span style="font-size:12px;color:#888;">Color: ${it.color}</span>` : ''}
          ${it.scent ? `<br/><span style="font-size:12px;color:#888;">Scent: ${it.scent}</span>` : ''}
          ${it.engrave ? `<br/><span style="font-size:12px;color:#B8955A;">Engraving: "${it.engrave}"</span>` : ''}
          ${it.orderType === 'bulk' ? `<br/><span style="font-size:12px;color:#B8955A;">Bulk Order · ${it.qty} bars @ $4.55/bar</span>` : `<br/><span style="font-size:12px;color:#888;">Qty: ${it.qty}</span>`}
        </td>
        <td style="padding:12px 0;text-align:right;font-family:Georgia,serif;color:#B8955A;font-size:15px;">
          $${(it.price * it.qty).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const html = `
      <div style="max-width:600px;margin:0 auto;font-family:Georgia,serif;color:#0D1F2D;background:#fff;padding:40px 32px;">
        <div style="text-align:center;margin-bottom:32px;border-bottom:1px solid #e8e0d0;padding-bottom:24px;">
          <h1 style="font-size:28px;letter-spacing:0.05em;margin:0 0 4px;">BOW &amp; STERN</h1>
          <p style="font-size:12px;letter-spacing:0.12em;color:#888;margin:0;text-transform:uppercase;">New Order Received</p>
        </div>

        <h2 style="font-size:16px;letter-spacing:0.08em;text-transform:uppercase;color:#888;margin:0 0 16px;font-weight:400;">Customer</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:32px;font-size:14px;">
          <tr><td style="padding:4px 0;color:#888;width:120px;">Name</td><td>${contact.firstName} ${contact.lastName}</td></tr>
          <tr><td style="padding:4px 0;color:#888;">Email</td><td>${contact.email}</td></tr>
          ${contact.phone ? `<tr><td style="padding:4px 0;color:#888;">Phone</td><td>${contact.phone}</td></tr>` : ''}
        </table>

        <h2 style="font-size:16px;letter-spacing:0.08em;text-transform:uppercase;color:#888;margin:0 0 16px;font-weight:400;">Ship To</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:32px;font-size:14px;">
          <tr><td style="padding:4px 0;color:#888;width:120px;">Address</td><td>${shipping.address1}${shipping.address2 ? ', ' + shipping.address2 : ''}</td></tr>
          <tr><td style="padding:4px 0;color:#888;">City</td><td>${shipping.city}, ${shipping.state} ${shipping.zip}</td></tr>
          <tr><td style="padding:4px 0;color:#888;">Country</td><td>${shipping.country}</td></tr>
        </table>

        <h2 style="font-size:16px;letter-spacing:0.08em;text-transform:uppercase;color:#888;margin:0 0 16px;font-weight:400;">Order</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          ${itemRows}
        </table>

        <table style="width:100%;border-collapse:collapse;font-size:14px;border-top:1px solid #0D1F2D;padding-top:16px;">
          <tr><td style="padding:6px 0;color:#888;">Subtotal</td><td style="text-align:right;">$${subtotal.toFixed(2)}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Shipping</td><td style="text-align:right;">$${shippingCost.toFixed(2)}</td></tr>
          <tr>
            <td style="padding:10px 0 0;font-size:16px;font-weight:bold;">Total</td>
            <td style="padding:10px 0 0;text-align:right;font-size:16px;color:#B8955A;font-weight:bold;">$${total.toFixed(2)}</td>
          </tr>
        </table>

        <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e8e0d0;text-align:center;font-size:11px;color:#aaa;letter-spacing:0.08em;text-transform:uppercase;">
          Bow &amp; Stern Soap Co. · bowandsternsoapco@gmail.com
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Bow & Stern Orders" <${process.env.GMAIL_USER}>`,
      to: 'bowandsternsoapco@gmail.com',
      subject: `New Order — ${contact.firstName} ${contact.lastName}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Order email error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
