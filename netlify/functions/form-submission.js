const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    console.log('Form submission function triggered');
    console.log('Event body:', event.body);

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    let email;

    try {
        // Parse the request body
        const payload = JSON.parse(event.body);
        console.log('Parsed payload:', payload);

        // Extract email from various possible structures
        if (payload.payload && payload.payload.email) {
            // Netlify form submission webhook format
            email = payload.payload.email;
        } else if (payload.data && payload.data.email) {
            // Alternative Netlify format
            email = payload.data.email;
        } else if (payload.email) {
            // Direct submission
            email = payload.email;
        } else {
            console.log('Could not find email in payload');
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Email not found in request' })
            };
        }
    } catch (parseError) {
        console.error('Error parsing request body:', parseError);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid request body' })
        };
    }

    console.log('Processing email for:', email);

    // Validate environment variables
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, SITE_URL } = process.env;

    if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
        console.error('Missing email configuration');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Email service not configured' })
        };
    }

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: parseInt(EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });

    const siteUrl = SITE_URL || 'https://the-ghosts-we-carry.netlify.app';
    const pdfUrl = `${siteUrl}/The%20Ghosts%20We%20Carry.pdf`;

    // Email HTML content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; background-color: #1a1a2e; color: #f5f5f0;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; padding-bottom: 30px; border-bottom: 1px solid rgba(201, 185, 154, 0.3);">
            <h1 style="font-size: 28px; font-weight: normal; color: #f5f5f0; margin: 0 0 10px 0; letter-spacing: 0.05em;">
                The Ghosts We Carry
            </h1>
            <p style="font-size: 14px; color: #c9b99a; font-style: italic; margin: 0;">
                From Combat to the Disconnected Generation
            </p>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 0;">
            <p style="font-size: 16px; line-height: 1.8; color: #f5f5f0; margin: 0 0 20px 0;">
                Thank you for your interest in reading <em>The Ghosts We Carry</em>.
            </p>

            <p style="font-size: 16px; line-height: 1.8; color: #f5f5f0; margin: 0 0 30px 0;">
                Click the button below to download your copy of the manuscript:
            </p>

            <!-- Download Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="${pdfUrl}"
                   style="display: inline-block; padding: 16px 40px; background-color: #d4a853; color: #1a1a2e; text-decoration: none; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">
                    Download PDF
                </a>
            </div>

            <!-- Draft Note -->
            <div style="background-color: rgba(45, 42, 36, 0.8); padding: 20px; margin: 30px 0; border-left: 3px solid #d4a853;">
                <p style="font-size: 14px; color: #c9b99a; margin: 0 0 10px 0;">
                    <strong>Draft Status:</strong> Preliminary Final Draft
                </p>
                <p style="font-size: 14px; color: rgba(245, 245, 240, 0.7); margin: 0;">
                    Last updated: January 11, 2026
                </p>
            </div>

            <!-- Quote -->
            <div style="padding: 30px 0; text-align: center;">
                <p style="font-size: 18px; font-style: italic; color: #f5f5f0; line-height: 1.8; margin: 0;">
                    "At forty-two, he mastered the art of the exit.<br>
                    Now he's learning something harder: <span style="color: #d4a853;">how to stay in the room.</span>"
                </p>
            </div>

            <!-- Feedback Request -->
            <p style="font-size: 16px; line-height: 1.8; color: #f5f5f0; margin: 30px 0 0 0;">
                Your feedback is invaluable. If you have thoughts on the manuscript—what works, what doesn't, or how the story affected you—I'd love to hear from you. You can reach me on <a href="https://www.linkedin.com/in/sbogucki12" style="color: #d4a853;">LinkedIn</a>.
            </p>
        </div>

        <!-- Footer -->
        <div style="padding-top: 30px; border-top: 1px solid rgba(201, 185, 154, 0.15); text-align: center;">
            <p style="font-size: 12px; color: rgba(201, 185, 154, 0.6); margin: 0 0 15px 0;">
                You're receiving this because you requested a copy of the manuscript.
            </p>

            <!-- Crisis Resources -->
            <div style="padding: 15px; background-color: rgba(15, 15, 26, 0.5); margin: 20px 0;">
                <p style="font-size: 11px; color: #c9b99a; margin: 0 0 5px 0;">
                    <strong>If you're struggling:</strong>
                </p>
                <p style="font-size: 11px; color: rgba(201, 185, 154, 0.6); margin: 0;">
                    Veterans Crisis Line: 988 (press 1) · Crisis Text Line: Text HOME to 741741
                </p>
            </div>

            <p style="font-size: 11px; color: rgba(201, 185, 154, 0.4); margin: 20px 0 0 0;">
                &copy; 2026 Steve Bogucki
            </p>
        </div>
    </div>
</body>
</html>
`;

    // Plain text fallback
    const textContent = `
The Ghosts We Carry
From Combat to the Disconnected Generation

Thank you for your interest in reading "The Ghosts We Carry."

Download your copy here:
${pdfUrl}

Draft Status: Preliminary Final Draft
Last updated: January 11, 2026

---

"At forty-two, he mastered the art of the exit.
Now he's learning something harder: how to stay in the room."

---

Your feedback is invaluable. If you have thoughts on the manuscript, reach me on LinkedIn:
https://www.linkedin.com/in/sbogucki12

---

If you're struggling:
Veterans Crisis Line: 988 (press 1)
Crisis Text Line: Text HOME to 741741

© 2026 Steve Bogucki
`;

    try {
        // Send the email
        const info = await transporter.sendMail({
            from: `"The Ghosts We Carry" <${EMAIL_USER}>`,
            to: email,
            subject: 'Your Copy of "The Ghosts We Carry"',
            text: textContent,
            html: htmlContent
        });

        console.log('Email sent successfully:', info.messageId);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Email sent successfully',
                messageId: info.messageId
            })
        };

    } catch (emailError) {
        console.error('Error sending email:', emailError);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to send email',
                details: emailError.message
            })
        };
    }
};
