const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });
  } catch (error) {
    logger.error(`Send Mail Error: ${error.message}`);
    throw error;
  }
};

const sendResetCodeEmail = async (to, code) => {
  const html = `
    <div style="font-family: sans-serif;">
      <h2>BugSense AI — Password Reset</h2>
      <p>Your password reset code is:</p>
      <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${code}</p>
      <p>This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  await sendMail({
    to,
    subject: 'Your BugSense AI password reset code',
    html,
  });
};

module.exports = { sendMail, sendResetCodeEmail };
