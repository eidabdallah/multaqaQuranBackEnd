import nodemailer from 'nodemailer';

export class EmailService {
    static async sendEmail(options: { to: string; subject: string; html: string }) {
        const { to, subject, html } = options;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.AdminEmail,
                pass: process.env.PASSWORDSENDER,
            },
        });

        const info = await transporter.sendMail({
            from: `ملتقى القران الكريم  <${process.env.AdminEmail}>`,
            to,
            subject,
            html,
        });

        console.log('Email sent: ', info.messageId);
    }
}
