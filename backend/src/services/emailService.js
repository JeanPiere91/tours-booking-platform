const { Resend } = require('resend');
const config = require('../config');

let client = null;
if (config.resend.apiKey) {
  client = new Resend(config.resend.apiKey);
}

function isEnabled() {
  return Boolean(client && config.resend.fromEmail);
}

function formatMoney(amount, currency = 'USD') {
  return `${currency} ${Number(amount).toLocaleString('en-US')}`;
}

function buildHtml(booking) {
  const { code, tour, date, departure, passengers, addons, totals, contact } = booking;
  const paxLine = `${passengers.adults} adult${passengers.adults !== 1 ? 's' : ''}`
    + (passengers.children ? ` · ${passengers.children} child${passengers.children !== 1 ? 'ren' : ''}` : '')
    + (passengers.infants ? ` · ${passengers.infants} infant${passengers.infants !== 1 ? 's' : ''}` : '');

  const addonsHtml = addons.length
    ? `<tr><td style="padding:6px 0;color:#8B7456;">Add-ons</td><td style="text-align:right;color:#4A2C12;">${addons.map((a) => `${a.name}${a.quantity > 1 ? ` × ${a.quantity}` : ''}`).join(' · ')}</td></tr>`
    : '';

  return `
  <div style="font-family:'Inter',Arial,sans-serif;background:#FDF8F1;padding:32px 16px;color:#2A1A0C;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #E7D9C2;border-radius:14px;overflow:hidden;">
      <tr>
        <td style="background:#4A2C12;padding:24px 28px;color:#FDF8F1;">
          <div style="font-family:Georgia,serif;font-size:20px;font-weight:600;">Inka Planet Adventure</div>
          <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#E97817;margin-top:4px;">Booking confirmed</div>
        </td>
      </tr>
      <tr>
        <td style="padding:28px;">
          <p style="margin:0 0 8px;">Hi ${contact.firstName || 'there'},</p>
          <p style="margin:0 0 18px;color:#6B4423;">Your booking request was received. Our team will reach out shortly to finalise the details.</p>

          <div style="border:1px dashed #E97817;border-radius:10px;padding:16px;text-align:center;margin-bottom:20px;">
            <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8B7456;">Booking code</div>
            <div style="font-family:Georgia,serif;font-size:24px;color:#4A2C12;letter-spacing:3px;margin-top:4px;">${code}</div>
          </div>

          <h2 style="font-family:Georgia,serif;font-size:18px;margin:0 0 12px;color:#4A2C12;">${tour.title}</h2>
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:6px 0;color:#8B7456;">Date</td><td style="text-align:right;color:#4A2C12;">${date} · ${departure}</td></tr>
            <tr><td style="padding:6px 0;color:#8B7456;">Passengers</td><td style="text-align:right;color:#4A2C12;">${paxLine}</td></tr>
            ${addonsHtml}
            <tr><td style="padding:6px 0;color:#8B7456;">Contact</td><td style="text-align:right;color:#4A2C12;">${contact.email}</td></tr>
          </table>

          <div style="border-top:1px dashed #E7D9C2;margin:18px 0 0;padding-top:14px;display:flex;justify-content:space-between;">
            <span style="color:#8B7456;font-size:13px;">Estimated total</span>
            <strong style="font-family:Georgia,serif;font-size:22px;color:#E97817;">${formatMoney(totals.total, totals.currency)}</strong>
          </div>
        </td>
      </tr>
      <tr>
        <td style="background:#FDF8F1;padding:16px 28px;font-size:12px;color:#8B7456;text-align:center;">
          Need to change something? Just reply to this email or write to us on WhatsApp.
        </td>
      </tr>
    </table>
  </div>`;
}

function buildSubject(booking) {
  return `Booking ${booking.code} — ${booking.tour.title}`;
}

async function sendBookingConfirmation(booking) {
  if (!isEnabled()) {
    return { sent: false, reason: 'resend-not-configured' };
  }

  const to = [booking.contact.email];
  if (config.resend.agencyEmail) to.push(config.resend.agencyEmail);

  try {
    const result = await client.emails.send({
      from: config.resend.fromEmail,
      to,
      subject: buildSubject(booking),
      html: buildHtml(booking),
    });

    if (result?.error) {
      console.error('[email] Resend returned an error:', result.error);
      return { sent: false, reason: 'resend-error', error: result.error };
    }
    return { sent: true, id: result?.data?.id };
  } catch (err) {
    console.error('[email] Failed to send booking email:', err);
    return { sent: false, reason: 'exception', error: err.message };
  }
}

module.exports = { sendBookingConfirmation, isEnabled };
