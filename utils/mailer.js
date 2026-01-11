import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendApplicationEmail = async ({ to, fullname, link }) => {
  const { data, error } = await resend.emails.send({
    from: "JobLink <no-reply@joblinknigeria.resend.app>",
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

  if (error) {
    console.error("❌ Resend error:", error);
    throw error;
  }

  console.log("✅ Resend email sent:", data?.id);
};