// utils/mailer.js
import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// ================= USER EMAIL =================
export const sendApplicationNotification = async ({ email, fullname, link }) => {
  // Ensure HashRouter link works on Vercel
  const hashlink = link.replace("/upload/", "/#/upload/");

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
      <p>Thank you for applying to JobLink.</p>

      <h4>What You Need to Do</h4>
      <ol>
        <li><strong>Prepare your CV:</strong> Submit your existing CV or we will create one for you.</li>
        <li><strong>Make Payment:</strong> Pay ₦5,000 (Five Thousand Naira) to 7045544361 Opay Christopher Ikelegbe Isea</li>
        <li><strong>Agree to Terms:</strong> You must agree to JobLink’s Terms & Conditions before submission.</li>
      </ol>

      <h4>What We Will Do for You</h4>
      <ul>
        <li>Review, update, or create your CV</li>
        <li>Hunt and apply for suitable job opportunities on your behalf</li>
        <li>Train you on interview preparation</li>
      </ul>

      <p>Important Notes:</p>
      <ul>
        <li>Each applicant is entitled to up to 3 interview opportunities within a 3-month support period.
If you successfully pass any of the interviews, you will receive a congratulations message, and your application process with JobLink will be completed.
If you are not successful after 3 interview attempts within the 3-month period, you may reapply and continue with a new application and payment.
Please note that JobLink does not guarantee employment. However, we prepaid your CV and give you full interview training, and guidance to help improve your chances of securing a job.
If you have any questions, feel free to contact us. </ul>

      <p>Submit your proof of payment and CV by using this link below 👇</p>
      <a href="${hashlink}">${hashlink}</a>

      <p>Best regards,<br/>JobLink Team</p>
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
  try {
    console.log("Admin email:", process.env.ADMIN_EMAIL);

    const result = await emailApi.sendTransacEmail({
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

    console.log("Admin email sent successfully:", result);

  } catch (error) {
    console.error("Admin email failed:", error.response?.body || error);
  }
};