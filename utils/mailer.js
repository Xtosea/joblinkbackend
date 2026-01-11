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
        email: "no-reply@brevo.com", // ✅ SAFE DEFAULT SENDER
        name: "JobLink Nigeria",
      },
      to: [
        {
          email: email,
          name: fullname,
        },
      ],
      subject: "Complete Your Job Application",
      htmlContent: `
        <p>Hello <strong>${fullname}</strong>,</p>

        <p>Thank you for applying on <strong>JobLink Nigeria</strong>.</p>

        <p>Please complete your application using the link below:</p>

        <p>
          <a href="${link}" target="_blank">${link}</a>
        </p>

        <p><strong>Note:</strong> This link expires in 24 hours.</p>

        <hr />

        <p style="font-size:12px;color:#777;">
          If you did not request this email, please ignore it.
        </p>
      `,
    };

    await emailApi.sendTransacEmail(emailData);
    console.log("✅ Email sent to:", email);
  } catch (err) {
    console.error("❌ Email send failed:", err.response?.text || err);
  }
};