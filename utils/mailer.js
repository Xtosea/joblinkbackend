import Resend from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendApplicationEmail = async ({ to, fullname, link }) => {
  await resend.emails.send({
    from: "JobLink Nigeria <onboarding@resend.dev>", 
    // ↑ works immediately without domain setup

    to,
    subject: "Application Received – Upload Your Documents",

    html: `
      <h2>Hello ${fullname},</h2>
      <p>Your job application has been received successfully.</p>

      <p>Please upload your required documents using the secure link below:</p>

      <p>
        <a href="${link}" style="color: blue;">
          Upload Documents
        </a>
      </p>

      <p>This link is private. Do not share it.</p>

      <br/>
      <p>— JobLink Nigeria Team</p>
    `,
  });
};