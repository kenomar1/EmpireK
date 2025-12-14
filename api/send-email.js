// api/send-email.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res
      .status(200)
      .setHeader("Access-Control-Allow-Origin", "*") // Or your specific domain for production
      .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type")
      .end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { name, email, phone, message } = req.body;

  // Add CORS headers to actual response too
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "dev.empirek@hotmail.com",
      reply_to: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}