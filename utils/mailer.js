import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendApplicationEmail = async ({ to, fullname, link }) => {
  try {
    const { data } = await resend.emails.send({
      from: "JobLink <onboarding@resend.dev>", // ✅ VERIFIED DOMAIN
      to,
      subject: "Your JobLink Application Was Received",
      html: `
        <h3>Hello ${fullname},</h3>
        <p>Your application has been received successfully.</p>
        <p>Please upload your documents using the link below:</p>
        <p>
          <a href="${link}" target="_blank">${link}</a>
        </p>
        <br />
        <small>— JobLink Team</small>
      `,
    });

    console.log("✅ Email sent successfully:", data?.id);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};