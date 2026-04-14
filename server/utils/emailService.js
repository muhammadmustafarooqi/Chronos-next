import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

function loadTemplate(templateName, variables) {
    const templatePath = path.join(__dirname, '../templates/emails', templateName);
    let html = fs.readFileSync(templatePath, 'utf-8');
    
    // Replace all variables in template
    Object.entries(variables).forEach(([key, value]) => {
        // Using replaceAll or regex to replace all instances
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, value ?? '');
    });
    
    return html;
}

export async function sendEmail({ to, subject, template, variables }) {
    try {
        const html = loadTemplate(template, variables);
        
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            html,
        });
    } catch (err) {
        console.error('[EmailService] Failed to send email:', err.message);
        // Never throw — email failure must never break the main request
    }
}
