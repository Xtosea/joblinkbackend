import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendApplicationEmail = async ({ to, fullname, link }) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Your JobLink Application Was Received",
    html: `
      <h3>Hello ${fullname},</h3>
      <p>Your application has been received successfully.</p>
      <p>Please upload your documents using the link below:</p>
      <a href="${link}">${link}</a>
      <br/><br/>
      <small>JobLink Team</small>
    `,
  });

  console.log("✅ Brevo email sent:", info.messageId);
};