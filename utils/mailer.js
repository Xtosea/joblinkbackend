import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendApplicationEmail = async ({ to, fullname, link }) => {
  return resend.emails.send({
    from: "JobLink Nigeria <onboarding@resend.dev>",
    to,
    subject: "Your Job Application – Next Steps",
    html: `
      <h2>Hello ${fullname},</h2>
      <p>Your application was received successfully.</p>
      <p>Please click the link below to upload your documents:</p>
      <a href="${link}">${link}</a>
      <br/><br/>
      <p>JobLink Nigeria</p>
    `,
  });
};