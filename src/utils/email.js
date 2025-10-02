const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Greenwood Academy" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
};

// Welcome email template
const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to Greenwood Academy';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0891b2;">Welcome to Greenwood Academy!</h1>
      <p>Dear ${user.firstName} ${user.lastName},</p>
      <p>Your account has been created successfully with the following details:</p>
      <ul>
        <li><strong>Username:</strong> ${user.username}</li>
        <li><strong>Email:</strong> ${user.email}</li>
        <li><strong>Role:</strong> ${user.role}</li>
      </ul>
      <p>You can now log in to your account using your credentials.</p>
      <a href="${process.env.FRONTEND_URL}/login" 
         style="background-color: #0891b2; color: white; padding: 10px 20px; 
                text-decoration: none; border-radius: 5px; display: inline-block;">
        Login to Your Account
      </a>
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br>Greenwood Academy Team</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject,
    html,
  });
};

// Password reset email template
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const subject = 'Password Reset Request';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #0891b2;">Password Reset Request</h1>
      <p>Dear ${user.firstName} ${user.lastName},</p>
      <p>You have requested a password reset for your Greenwood Academy account.</p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetUrl}" 
         style="background-color: #dc2626; color: white; padding: 10px 20px; 
                text-decoration: none; border-radius: 5px; display: inline-block;">
        Reset Password
      </a>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this password reset, please ignore this email.</p>
      <p>For security reasons, this link can only be used once.</p>
      <p>Best regards,<br>Greenwood Academy Team</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject,
    html,
  });
};

// Password changed confirmation email
const sendPasswordChangedEmail = async (user) => {
  const subject = 'Password Changed Successfully';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #16a34a;">Password Changed Successfully</h1>
      <p>Dear ${user.firstName} ${user.lastName},</p>
      <p>Your password has been changed successfully.</p>
      <p>If you didn't make this change, please contact us immediately.</p>
      <p>For your security, you may want to:</p>
      <ul>
        <li>Review your account activity</li>
        <li>Enable two-factor authentication</li>
        <li>Update your security questions</li>
      </ul>
      <p>Best regards,<br>Greenwood Academy Team</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject,
    html,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
};