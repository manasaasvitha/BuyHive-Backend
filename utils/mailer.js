const SibApiV3Sdk = require("sib-api-v3-sdk");
require("dotenv").config();

// Configure API key
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

// Create API instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Admin email (change this)
const ADMIN_EMAIL = "admin@gmail.com";

const sendEmail = async (userEmail, subject, htmlContent) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: {
        name: "BuyHive",
        email: "23cseb18manasaasvithackm@gmail.com", // MUST be verified in Brevo
      },

      // Send to BOTH user and admin
      to: [
        { email: userEmail },     // User
        { email: ADMIN_EMAIL },   // Admin
      ],

      subject: subject,
      htmlContent: htmlContent,
    });

    console.log("✅ Email sent to user & admin");
  } catch (err) {
    console.error("❌ Email send failed:", err.response?.body || err.message);
  }
};

module.exports = sendEmail;