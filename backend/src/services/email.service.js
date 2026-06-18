const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "live.smtp.mailtrap.io",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  requireTLS: true,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordEmail = async (to, password) => {
  const info = await transporter.sendMail({
    from: '"Learner Tracking System" <hello@demomailtrap.co>',
    to: to,
    subject: "Your Account Password - Learner Tracking System",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #ff6b00;">Learner Tracking System</h2>
        <p>Your account has been created successfully.</p>
        <p>Use the password below to log in:</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <code style="font-size: 24px; font-weight: bold; letter-spacing: 3px;">${password}</code>
        </div>
        <p style="color: #e53935; font-size: 13px;">
          <strong>Important:</strong> Keep this password safe.
        </p>
      </div>
    `,
  });
  return info;
};

const sendResetEmail = async (to, resetLink) => {
  const info = await transporter.sendMail({
    from: '"Learner Tracking System" <hello@demomailtrap.co>',
    to: to,
    subject: "Password Reset - Learner Tracking System",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #ff6b00;">Password Reset</h2>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${resetLink}" style="background: #ff6b00; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Reset Password</a>
        </div>
        <p style="font-size: 13px; color: #999;">This link expires in 30 minutes.</p>
      </div>
    `,
  });
  return info;
};

module.exports = { sendPasswordEmail, sendResetEmail };