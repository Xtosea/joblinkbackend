// utils/mailer.js
import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// ================= SIMPLE LOGGER =================
const log = (type, message, err) => {
  const timestamp = new Date().toISOString();
  if (err) {
    console.error(`[${timestamp}] [${type}] ${message}`, err);
  } else {
    console.log(`[${timestamp}] [${type}] ${message}`);
  }
};

// ================= USER EMAIL =================
export const sendApplicationNotification = async ({ email, fullname, token }) => {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://joblinks.globelynks.com"
        : "http://localhost:5000";

    const link = `${baseUrl}/#/upload/${token}`;

    await emailApi.sendTransacEmail({
      sender: { email: "joblinkhelpdesk@gmail.com", name: "JobLink Nigeria" },
      to: [{ email, name: fullname }],
      subject: "Complete Your Job Application",
      htmlContent: `
        <p>Hello <strong>${fullname}</strong>,</p>
        <p>Your application was received successfully.</p>

        <p>To proceed, please:</p>
        <ol>
          <li>Prepare your CV (submit or request creation)</li>
          <li>Pay the service fee ₦10,000 to 7045544361 Opay Christopher Ikelegbe Isea</li>
          <li>Agree to the Terms & Conditions</li>
        </ol>

        <p>Once submitted, we will review your CV and apply for jobs on your behalf.</p>

        <p>Submit your proof of payment and CV by clicking the link below:</p>
        <a href="${link}">${link}</a>

        <p>Thank you for choosing JobLink.<br/>Best regards,<br/>JobLink Team</p>
      `,
    });

    log("INFO", `Application email sent to ${email}`);
  } catch (err) {
    log("ERROR", `Failed to send application email to ${email}`, err);
  }
};

// ================= ADMIN EMAIL =================
export const sendAdminNotification = async ({ fullname, email, jobType, jobPosition }) => {
  try {
    await emailApi.sendTransacEmail({
      sender: { email: "no-reply@brevo.com", name: "JobLink Nigeria" },
      to: [{ email: process.env.ADMIN_EMAIL, name: "Admin" }],
      subject: "📥 New Job Application Submitted",
      htmlContent: `
        <h3>New Application Received</h3>
        <p><strong>Name:</strong> ${fullname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Job Type:</strong> ${jobType}</p>
        <p><strong>Position:</strong> ${jobPosition}</p>
      `,
    });

    log("INFO", `Admin notified of new application by ${fullname}`);
  } catch (err) {
    log("ERROR", `Failed to notify admin about ${fullname}`, err);
  }
};