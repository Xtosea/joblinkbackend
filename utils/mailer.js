import SibApiV3Sdk from "sib-api-v3-sdk";

// Initialize API client
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();
const smsApi = new SibApiV3Sdk.TransactionalSMSApi();

/**
 * Send application received email
 */
export const sendApplicationEmail = async ({ to, fullname, link }) => {
  try {
    const emailData = {
      sender: { name: "JobLink", email: "no-reply@joblinknigeria.vercel.app" },
      to: [{ email: to, name: fullname }],
      subject: "JobLink Application Received",
      htmlContent: `
        <h3>Hello ${fullname},</h3>
        <p>Your application has been received successfully.</p>
        <p>Please upload your documents using the link below:</p>
        <a href="${link}">${link}</a>
        <br/><br/>
        <small>JobLink Team</small>
      `,
    };

    const response = await transactionalEmailsApi.sendTransacEmail(emailData);
    console.log("✅ Email sent successfully:", response);
  } catch (err) {
    console.error("❌ Email failed:", err);
  }
};

/**
 * Send SMS notification
 */
export const sendApplicationSMS = async ({ mobile, fullname, link }) => {
  try {
    const smsData = {
      sender: process.env.BREVO_SMS_SENDER,
      recipient: mobile,   // in international format e.g. +2348012345678
      content: `Hello ${fullname}, your JobLink application was received. Upload your documents here: ${link}`,
    };

    const response = await smsApi.sendTransacSms(smsData);
    console.log("✅ SMS sent successfully:", response);
  } catch (err) {
    console.error("❌ SMS failed:", err);
  }
};

/**
 * Combined helper for Email + SMS
 */
export const sendApplicationNotification = async ({ email, mobile, fullname, link }) => {
  await sendApplicationEmail({ to: email, fullname, link });
  await sendApplicationSMS({ mobile, fullname, link });
};