import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendApplicationEmail = async ({ to, fullname, link }) => {
  return resend.emails.send({
    from: "JobLink Nigeria <onboarding@resend.dev>",
    to,
    subject: "Application Received – Upload Proof",
    html: `
      <p>Hello <b>${fullname}</b>,</p>
      <p>Your application has been received.</p>
      <p>
        Click below to upload your proof and CV:
      </p>
      <p>
        <a href="${link}">${link}</a>
      </p>
      <p>This link expires in 48 hours.</p>
    `,
  });
};

console.log("RESEND_API_KEY =", process.env.RESEND_API_KEY);