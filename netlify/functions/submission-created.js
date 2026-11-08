/**
 * submission-created — Netlify event-triggered function.
 *
 * Netlify invokes this automatically after a Netlify Forms submission passes
 * spam filtering. Netlify blocks direct HTTP calls to event-triggered
 * functions (403), so the public cannot hit it with arbitrary POSTs. The checks
 * below are defense in depth: only a well-formed event for the
 * "download-form" form, on this site, with one valid address, sends anything.
 *
 * Privacy: subscriber addresses are never written to logs or returned.
 */
const nodemailer = require('nodemailer');

const FORM_NAME = 'download-form';
// Canonical public URL used in email links. Hard-coded on purpose: variables in
// netlify.toml are not visible to functions at runtime, and a stale dashboard
// SITE_URL would send readers to an old domain.
const SITE_URL = 'https://the-ghosts-we-carry.com';
const MAX_EMAIL_LENGTH = 254;
// Single address only: no whitespace, commas, semicolons, angle brackets or line breaks.
const EMAIL_RE = /^[^\s@,;<>"'()\\]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/;

const respond = (statusCode, message) => ({
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
});

function hostOf(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
    } catch (e) {
        return '';
    }
}

exports.handler = async (event) => {
    if (event.httpMethod && event.httpMethod !== 'POST') {
        return respond(405, 'Method not allowed');
    }

    let submission;
    try {
        submission = JSON.parse(event.body || '{}').payload;
    } catch (e) {
        console.warn('submission-created: unparseable body');
        return respond(400, 'Bad request');
    }

    // Only accept the Netlify Forms event shape for our form.
    if (!submission || typeof submission !== 'object' || submission.form_name !== FORM_NAME) {
        console.warn('submission-created: ignored event (unexpected form or shape)');
        return respond(200, 'Ignored');
    }

    // Honeypot: Netlify normally drops these, but never mail a bot.
    const data = submission.data || {};
    if (data['bot-field']) {
        console.warn('submission-created: honeypot triggered');
        return respond(200, 'Ignored');
    }

    const siteUrl = SITE_URL;

    // If Netlify reports the submitting site, it must be ours.
    const allowedHosts = new Set(
        [hostOf(SITE_URL), hostOf(process.env.URL || ''), 'bogoodski-book.netlify.app'].filter(Boolean)
    );
    if (submission.site_url && !allowedHosts.has(hostOf(submission.site_url))) {
        console.warn('submission-created: ignored event from unexpected site');
        return respond(200, 'Ignored');
    }

    const email = typeof data.email === 'string' ? data.email.trim() : '';
    if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(email)) {
        console.warn('submission-created: invalid or missing email');
        return respond(400, 'Invalid email');
    }

    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
    if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
        console.error('submission-created: email service not configured');
        return respond(500, 'Service unavailable');
    }

    const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: parseInt(EMAIL_PORT, 10) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: { user: EMAIL_USER, pass: EMAIL_PASS }
    });

    const pdfUrl = `${siteUrl}/The%20Ghosts%20We%20Carry.pdf`;
    const readUrl = `${siteUrl}/read/`;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thanks for subscribing</title>
</head>
<body style="margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; background-color: #1a1a2e; color: #f5f5f0;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; padding-bottom: 30px; border-bottom: 1px solid rgba(201, 185, 154, 0.3);">
            <h1 style="font-size: 28px; font-weight: normal; color: #f5f5f0; margin: 0 0 10px 0; letter-spacing: 0.05em;">The Ghosts We Carry</h1>
            <p style="font-size: 14px; color: #c9b99a; font-style: italic; margin: 0;">From Combat to the Disconnected Generation</p>
        </div>

        <div style="padding: 40px 0;">
            <p style="font-size: 16px; line-height: 1.8; color: #f5f5f0; margin: 0 0 20px 0;">
                Thank you for subscribing to author updates for <em>The Ghosts We Carry</em>. I'll write only when there is real news: new drafts, publication, and events.
            </p>
            <p style="font-size: 16px; line-height: 1.8; color: #f5f5f0; margin: 0 0 30px 0;">
                The current draft is free to read now:
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="${readUrl}" style="display: inline-block; padding: 16px 32px; margin: 6px; background-color: #d4a853; color: #1a1a2e; text-decoration: none; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">Read Online</a>
                <a href="${pdfUrl}" style="display: inline-block; padding: 15px 31px; margin: 6px; border: 1px solid #d4a853; color: #d4a853; text-decoration: none; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">Download PDF</a>
            </div>

            <div style="background-color: rgba(45, 42, 36, 0.8); padding: 20px; margin: 30px 0; border-left: 3px solid #d4a853;">
                <p style="font-size: 14px; color: #c9b99a; margin: 0 0 10px 0;"><strong>Draft Status:</strong> Preliminary Final Draft</p>
                <p style="font-size: 14px; color: rgba(245, 245, 240, 0.7); margin: 0;">Last updated: January 11, 2026</p>
            </div>

            <p style="font-size: 16px; line-height: 1.8; color: #f5f5f0; margin: 30px 0 0 0;">
                Your feedback is invaluable. If you have thoughts on the manuscript, what works, what doesn't, or how the story affected you, I'd love to hear from you on <a href="https://www.linkedin.com/in/sbogucki12" style="color: #d4a853;">LinkedIn</a>.
            </p>
        </div>

        <div style="padding-top: 30px; border-top: 1px solid rgba(201, 185, 154, 0.15); text-align: center;">
            <p style="font-size: 12px; color: rgba(201, 185, 154, 0.6); margin: 0 0 15px 0;">
                You're receiving this because this address was entered at ${siteUrl}. Not you, or want to stop? Reply with "unsubscribe."
            </p>
            <div style="padding: 15px; background-color: rgba(15, 15, 26, 0.5); margin: 20px 0;">
                <p style="font-size: 11px; color: #c9b99a; margin: 0 0 5px 0;"><strong>If you're struggling:</strong></p>
                <p style="font-size: 11px; color: rgba(201, 185, 154, 0.6); margin: 0;">Veterans Crisis Line: 988 (press 1) · Crisis Text Line: Text HOME to 741741</p>
            </div>
            <p style="font-size: 11px; color: rgba(201, 185, 154, 0.4); margin: 20px 0 0 0;">&copy; 2026 Steve Bogucki</p>
        </div>
    </div>
</body>
</html>`;

    const textContent = `The Ghosts We Carry
From Combat to the Disconnected Generation

Thank you for subscribing to author updates for "The Ghosts We Carry." I'll write only when there is real news: new drafts, publication, and events.

The current draft is free to read now:
Read online: ${readUrl}
Download PDF: ${pdfUrl}

Draft Status: Preliminary Final Draft
Last updated: January 11, 2026

Your feedback is invaluable. Reach me on LinkedIn:
https://www.linkedin.com/in/sbogucki12

You're receiving this because this address was entered at ${siteUrl}.
Not you, or want to stop? Reply with "unsubscribe."

If you're struggling:
Veterans Crisis Line: 988 (press 1)
Crisis Text Line: Text HOME to 741741

(c) 2026 Steve Bogucki
`;

    try {
        await transporter.sendMail({
            from: `"The Ghosts We Carry" <${EMAIL_USER}>`,
            to: email,
            bcc: EMAIL_USER,
            subject: 'Thanks for subscribing: The Ghosts We Carry',
            text: textContent,
            html: htmlContent
        });
        console.log('submission-created: confirmation sent');
        return respond(200, 'OK');
    } catch (err) {
        // Log the error class/code only; SMTP errors can echo addresses.
        console.error('submission-created: send failed', err && (err.code || err.name));
        return respond(500, 'Send failed');
    }
};
