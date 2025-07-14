import nodemailer from 'nodemailer';
import { gmailConfig, timeZoneConfig } from '../config/credentials';

// Create a transporter for sending emails
const createTransporter = async () => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: gmailConfig.email,
      clientId: gmailConfig.clientId,
      clientSecret: gmailConfig.clientSecret,
      refreshToken: gmailConfig.refreshToken,
      accessToken: gmailConfig.apiKey
    }
  });
  
  return transporter;
};

// Format date for emails based on timezone
const formatDate = (date: Date): string => {
  return date.toLocaleString('en-US', { 
    timeZone: timeZoneConfig.timeZone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Send VIP request notification
export const sendVipRequestEmail = async (
  email: string,
  reason: string | null
): Promise<boolean> => {
  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: gmailConfig.email,
      to: gmailConfig.email, // Send to admin
      subject: `MONSTERWITH - New VIP Request from ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ccc; border-radius: 5px;">
          <h2 style="color: #7C4DFF;">New VIP Request</h2>
          <p><strong>From:</strong> ${email}</p>
          <p><strong>Date:</strong> ${formatDate(new Date())}</p>
          <p><strong>Reason:</strong> ${reason || 'No reason provided'}</p>
          <p>Please review this request in the admin dashboard.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This is an automated message from MONSTERWITH.</p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending VIP request email:', error);
    return false;
  }
};

// Send VIP approval notification
export const sendVipApprovalEmail = async (
  email: string
): Promise<boolean> => {
  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: gmailConfig.email,
      to: email,
      subject: 'MONSTERWITH - Your VIP Access has been Approved!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ccc; border-radius: 5px;">
          <h2 style="color: #7C4DFF;">VIP Access Approved!</h2>
          <p>Congratulations! Your request for VIP access to MONSTERWITH has been approved.</p>
          <p>You now have access to exclusive content, unlimited downloads, and other premium features.</p>
          <p>Log in to your account to start enjoying your VIP benefits.</p>
          <p style="margin-top: 20px;">
            <a href="https://monsterwith.replit.app/login" style="background-color: #7C4DFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Log In Now
            </a>
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This is an automated message from MONSTERWITH.</p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending VIP approval email:', error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<boolean> => {
  try {
    const transporter = await createTransporter();
    
    const resetLink = `https://monsterwith.replit.app/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    
    const mailOptions = {
      from: gmailConfig.email,
      to: email,
      subject: 'MONSTERWITH - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ccc; border-radius: 5px;">
          <h2 style="color: #7C4DFF;">Password Reset Request</h2>
          <p>We received a request to reset your password for MONSTERWITH.</p>
          <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
          <p style="margin-top: 20px;">
            <a href="${resetLink}" style="background-color: #7C4DFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p style="margin-top: 20px;">If you didn't request a password reset, you can safely ignore this email.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This is an automated message from MONSTERWITH.</p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

// Send contact form email
export const sendContactEmail = async (
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<boolean> => {
  try {
    const transporter = await createTransporter();
    
    const mailOptions = {
      from: gmailConfig.email,
      to: gmailConfig.email, // Send to admin
      subject: `MONSTERWITH Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ccc; border-radius: 5px;">
          <h2 style="color: #7C4DFF;">New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Date:</strong> ${formatDate(new Date())}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This is an automated message from MONSTERWITH.</p>
          </div>
        </div>
      `,
      replyTo: email // So admin can reply directly to the user
    };
    
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending contact email:', error);
    return false;
  }
};