
import nodemailer from 'nodemailer';

// Configure SMTP Transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendWelcomeEmail(toEmail: string, name: string) {
    if (!process.env.SMTP_USER) return; // Skip if no SMTP configured

    const mailOptions = {
        from: process.env.SMTP_FROM || '"Cofactor Club" <no-reply@cofactor.world>',
        to: toEmail,
        subject: 'Welcome to Cofactor Club',
        text: `Hi ${name},\n\nWelcome to Cofactor Club! We're excited to have you join our student ambassador network.\n\nStart referring friends and contributing to the Wiki to climb the leaderboard!\n\nBest,\nThe Cofactor Team`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1>Welcome to Cofactor Club! 🚀</h1>
                <p>Hi ${name},</p>
                <p>We're excited to have you join our student ambassador network.</p>
                <p><strong>Next Steps:</strong></p>
                <ul>
                    <li>Share your referral code to earn points.</li>
                    <li>Contribute to your university's wiki page.</li>
                    <li>Climb the leaderboard!</li>
                </ul>
                <p>Best,<br>The Cofactor Team</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${toEmail}`);
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
}

export async function sendPasswordResetEmail(toEmail: string, resetToken: string) {
    // Placeholder for future implementation
    console.log(`[Mock] Sending password reset to ${toEmail} with token ${resetToken}`);
}
