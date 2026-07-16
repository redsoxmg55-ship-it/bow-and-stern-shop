import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const f = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });

    const row = (label: string, value: string) => value ? `
      <tr>
        <td style="padding:7px 0;color:#888;font-size:13px;width:160px;vertical-align:top;font-family:Georgia,serif;">${label}</td>
        <td style="padding:7px 0;color:#0D1F2D;font-size:13px;font-family:Georgia,serif;">${value}</td>
      </tr>` : '';

    const section = (num: string, title: string, rows: string) => `
      <div style="margin-bottom:32px;">
        <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#B8955A;font-family:monospace;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #e8e0d0;">${num} — ${title}</div>
        <table style="width:100%;border-collapse:collapse;">${rows}</table>
      </div>`;

    const html = `
      <div style="max-width:600px;margin:0 auto;font-family:Georgia,serif;color:#0D1F2D;background:#fff;padding:40px 32px;">
        <div style="text-align:center;margin-bottom:32px;border-bottom:1px solid #e8e0d0;padding-bottom:24px;">
          <h1 style="font-size:26px;letter-spacing:0.05em;margin:0 0 4px;">BOW &amp; STERN</h1>
          <p style="font-size:11px;letter-spacing:0.12em;color:#888;margin:0;text-transform:uppercase;">Private Client Order</p>
        </div>

        ${section('01', 'Contact', [
          row('Name', `${f.firstName} ${f.lastName}`),
          row('Email', f.email),
          row('Phone', f.phone),
        ].join(''))}

        ${section('02', 'Project Details', [
          row('Soap Form', f.soapForm),
          row('Quantity', f.qty ? `${f.qty} bars` : ''),
          row('Scent 1', f.scent1),
          row('Scent 2', f.scent2),
          row('Color / Aesthetic', f.color),
          row('Engraving Type', f.engraveMode === 'logo' ? 'Custom Logo (PNG uploaded)' : 'Text Stamp'),
          f.engraveMode === 'text' ? row('Engraving Text', f.engraving) : row('Logo File', f.logoFileName),
        ].join(''))}

        <div style="margin-top:40px;padding-top:24px;border-top:1px solid #e8e0d0;text-align:center;font-size:11px;color:#aaa;letter-spacing:0.08em;text-transform:uppercase;">
          Bow &amp; Stern Soap Co. · Private Client Program
        </div>
      </div>`;

    const attachments = f.engraveMode === 'logo' && f.logoBase64 && f.logoFileName
      ? [{ filename: f.logoFileName, content: f.logoBase64, encoding: 'base64' as const, contentType: 'image/png' }]
      : [];

    await transporter.sendMail({
      from: `"Bow & Stern Private" <${process.env.GMAIL_USER}>`,
      to: 'bowandsternsoapco@gmail.com',
      subject: `[PRIVATE CLIENT ORDER] ${f.firstName} ${f.lastName}`,
      html,
      attachments,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Private inquiry error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
