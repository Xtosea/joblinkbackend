import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

export const sendApplicationEmail = async ({ to, fullname, link }) => {
  return transporter.sendMail({
    from: `"JobLink" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Application Received – Next Steps",
    html: `
      <p>Hello ${fullname},</p>
      <p>Your application was received successfully.</p>
      <p>Please upload your proof & CV using the link below:</p>
      <p><a href="${link}">${link}</a></p>
      <p><b>Note:</b> This link expires in 48 hours.</p>
    `,
  });
};

export const sendApplicationEmail = async ({ to, fullname, link }) => {
  return transporter.sendMail({
    from: `"JobLink Admin" <xto1971@gmail.com>`,
    to,
    subject: "Application Received – Upload Proof",
    html: `
      <p>Hello ${fullname},</p>
      <p>Your application has been received.</p>

      <p>
        👉 <b>Click the link below to upload your proof & CV and track your application:</b>
      </p>

      <p><a href="${link}">${link}</a></p>

      <p>This link expires in 48 hours.</p>

      <p>Regards,<br/>JobLink Admin</p>
    `,
  });
};