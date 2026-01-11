import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendApplicationNotification = async ({
  email,
  fullname,
  link,
}) => {
  try {
    const emailData = {
      sender: {
        email: "no-reply@joblinknigeria.com", // must be a valid sender
        name: "JobLink Nigeria",
      },
      to: [
        {
          email: email,      // 👈 THIS FIXES YOUR ERROR
          name: fullname,
        },
      ],
      subject: "Complete Your Job Application",
      htmlContent: `
        <p>Hello <strong>${fullname}</strong>,</p>
        <p>Thank you for applying.</p>
        <p>Please complete your application using the link below:</p>
        <p><a href="${link}">${link}</a></p>
        <p>This link expires in 24 hours.</p>
      `,
    };

    await emailApi.sendTransacEmail(emailData);
    console.log("✅ Email sent to:", email);
  } catch (err) {
    console.error("❌ Email send failed:", err.response?.text || err);
  }
};