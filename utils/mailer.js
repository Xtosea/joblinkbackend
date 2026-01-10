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
      <p>Your application has been received successfully.</p>
      <p>
        👉 <b>Please click the link below to upload your proof of payment and CV:</b>
      </p>
      <p><a href="${link}" target="_blank">${link}</a></p>
      <p><b>Important:</b> This link expires in <b>48 hours</b>.</p>
      <p>Regards,<br/><b>JobLink Admin</b></p>
    `,
  });
};