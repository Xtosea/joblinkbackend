// utils/mailer.js
import SibApiV3Sdk from "sib-api-v3-sdk";


const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// ================= USER EMAIL =================
export const sendApplicationNotification = async ({
  email,
  fullname,
  token, // the application public token
}) => {
  // Determine base URL dynamically
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://joblink.globelynks.com"
      : "http://localhost:5000";

  // Hash route ensures React Router works for both web & APK
  const link = `${baseUrl}/#/upload/${token}`;

  await emailApi.sendTransacEmail({
    sender: {
      email: "joblinkhelpdesk@gmail.com",
      name: "JobLink Nigeria",
    },
    to: [{ email, name: fullname }],
    subject: "Complete Your Job Application",
    htmlContent: `
      <p>Hello <strong>${fullname}</strong>,</p>
      <p>Your application was received successfully.</p>
      <p>
Thank you for applying to JobLink.

To proceed with your application and begin our job-hunting support for you, please carefully follow the steps below:

<strong>What You Need to Do</strong>

1. Prepare your CV
   - If you already have a CV, submit it.
   - If you do not have a CV, we will create one for you.

2. Make Payment
   - Pay the service fee of ₦10,000 (Ten Thousand Naira) to:
     7045544361 Opay Christopher Ikelegbe Isea
     
3. Agree to Our Terms
   - You must agree to JobLink’s Terms & Conditions before submission.

<strong>What We Will Do for You</strong>
- Review, update, or create your CV
- Hunt and apply for suitable job opportunities on your behalf
- Train you on how to prepare for and attend interviews

<strong>Important Notes</strong>
- Each applicant is entitled to three (3) interview opportunities per application.
- After the three interview slots are used, you will need to reapply and make a new payment if you wish to continue.
- JobLink does not guarantee employment, but we provide full support and preparation.

Once your documents are submitted and verified, we will begin processing your application.

Thank you for choosing JobLink.

Best regards,<br/>
JobLink Team

<p>Submit your proof of payment and CV by using this link below 👇</p>
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