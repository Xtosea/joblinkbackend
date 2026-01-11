import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendApplicationEmail = async ({ email, fullname, link }) => {
  return emailApi.sendTransacEmail({
    sender: {
      email: "no-reply@joblinknigeria.com",
      name: "JobLink Nigeria",
    },
    to: [
      {
        email: email,        // ✅ REQUIRED
        name: fullname || "Applicant",
      },
    ],
    subject: "Application Received",
    htmlContent: `
      <p>Hello ${fullname},</p>
      <p>Your application has been received.</p>
      <p>Please upload your documents using the link below:</p>
      <p><a href="${link}">${link}</a></p>
      <br/>
      <p>JobLink Nigeria</p>
    `,
  });
};