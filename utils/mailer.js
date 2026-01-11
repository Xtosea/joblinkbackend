import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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
    console.error("❌ SMTP Email failed:", error.message);
    throw error;
  }
};