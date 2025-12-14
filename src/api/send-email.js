// api/send-email.js
import { Resend } from "resend";
import { render } from "@react-email/render";
import ContactMessage from "../emails/ContactMessage"; // Adjust path if needed

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendmail(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, message } = req.body;

  try {
    const emailHtml = render(
      <ContactMessage
        name={name}
        email={email}
        phone={phone}
        message={message}
      />
    );

    await resend.emails.send({
      from: "Website Contact <onboarding@resend.dev>", // Change after verifying domain
      to: "dev.empirek@hotmail.com",
      reply_to: email,
      subject: `New message from ${name}`,
      html: emailHtml,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`, // Fallback
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send" });
  }
}
