import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,          // 👈 VERY IMPORTANT
  secure: true,       // 👈 MUST be true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

export const sendApplicationEmail = async ({ to, fullname, link }) => {
  try {
    const info = await transporter.sendMail({
      from: `JobLink <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your JobLink Application Was Received",
      html: `
        <h3>Hello ${fullname},</h3>
        <p>Your application has been received successfully.</p>
        <p>Please upload your documents using the link below:</p>
        <a href="${link}">${link}</a>
        <br /><br />
        <small>JobLink Team</small>
      `,
    });

    console.log("✅ SMTP Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ SMTP Email failed:", error);
    throw error;
  }
};