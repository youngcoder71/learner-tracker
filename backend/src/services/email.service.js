const nodemailer = require("nodemailer");

const createTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

const sendPasswordEmail = async (to, password) => {
  const transporter = await createTransporter();
  const info = await transporter.sendMail({
    from: '"Learner Tracking System" <noreply@learnertracker.com>',
    to: to,
    subject: "Your Account Password - Learner Tracking System",
    html: `
      <h2>Learner Tracking System</h2>
      <p>Your account has been created successfully.</p>
      <p>Your password is: <strong>${password}</strong></p>
    `,
  });
  console.log("📧 Email preview URL:", nodemailer.getTestMessageUrl(info));
  return info;
};

const sendResetEmail = async (to, resetLink) => {
  const transporter = await createTransporter();
  const info = await transporter.sendMail({
    from: '"Learner Tracking System" <noreply@learnertracker.com>',
    to: to,
    subject: "Password Reset",
    html: `<p>Reset your password: <a href="${resetLink}">Click here</a></p>`,
  });
  console.log("📧 Email preview URL:", nodemailer.getTestMessageUrl(info));
  return info;
};

module.exports = { sendPasswordEmail, sendResetEmail };