import { Resend } from "resend";

console.log("RESEND_API_KEY =", process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendApplicationEmail = async ({ to, fullname, link }) => {
  return await resend.emails.send({
    from: "JobLink <onboarding@resend.dev>",
    to,
    subject: "Your Job Application – Next Steps",
    html: `
      <h2>Hello ${fullname},</h2>
      <p>Your application was submitted successfully.</p>
      <p>Upload your documents here:</p>
      <a href="${link}">${link}</a>
      <br/><br/>
      <p>JobLink Team</p>
    `,
  });
};

console.log("RESEND_API_KEY =", process.env.RESEND_API_KEY);