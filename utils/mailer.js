// utils/mailer.js
import axios from "axios";
import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// ================= USER EMAIL =================
export const sendApplicationNotification = async ({
  email,
  fullname,
  link,
}) => {
  await emailApi.sendTransacEmail({
    await axios.post(
  `${API_BASE}/api/applications`,
  form,
  {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: false,
  }
);
    },
    to: [{ email, name: fullname }],
    subject: "Complete Your Job Application",
    htmlContent: `
      <p>Hello <strong>${fullname}</strong>,</p>
      <p>Please complete your application:</p>
      <a href="${link}">${link}</a>
    `,
  });
};

// ================= ADMIN EMAIL =================
export const sendAdminNotification = async ({
  fullname,
  email,
  jobType,
  jobPosition,
}) => {
  await emailApi.sendTransacEmail({
    sender: {
      email: "no-reply@brevo.com",
      name: "JobLink Nigeria",
    },
    to: [
      {
        email: process.env.ADMIN_EMAIL,
        name: "Admin",
      },
    ],
    subject: "📥 New Job Application Submitted",
    htmlContent: `
      <h3>New Application Received</h3>
      <p><strong>Name:</strong> ${fullname}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Job Type:</strong> ${jobType}</p>
      <p><strong>Position:</strong> ${jobPosition}</p>
    `,
  });
};