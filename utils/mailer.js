import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendApplicationEmail = async ({ to, fullname, link }) => {
  return transporter.sendMail({
    from: `"JobLink Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Application Received – Upload Proof",
    html: `
      <p>Hello <b>${fullname}</b>,</p>
      <p>Your application was received successfully.</p>
      <p><b>Please upload your documents using the link below:</b></p>
      <p><a href="${link}" target="_blank">${link}</a></p>
      <p>This link expires in 48 hours.</p>
      <p>Regards,<br/>JobLink Admin</p>
    `,
  });
};