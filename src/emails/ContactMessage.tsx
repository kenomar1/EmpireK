// src/emails/ContactMessage.tsx
import {
  Html,
  Head,
  Preview,
  Heading,
  Section,
  Text,
  Hr,
  Container,
} from "@react-email/components";

interface ContactMessageProps {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactMessage({
  name,
  email,
  phone,
  message,
}: ContactMessageProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Container
        style={{
          padding: "40px 20px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Heading style={{ color: "#333", fontSize: "24px" }}>
          New Message from Your Website
        </Heading>
        <Section
          style={{
            backgroundColor: "#fff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Text style={{ fontSize: "16px", margin: "0 0 10px" }}>
            <strong>Name:</strong> {name}
          </Text>
          <Text style={{ fontSize: "16px", margin: "0 0 10px" }}>
            <strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a>
          </Text>
          <Text style={{ fontSize: "16px", margin: "0 0 20px" }}>
            <strong>Phone:</strong> {phone}
          </Text>
          <Hr style={{ borderColor: "#eee", margin: "20px 0" }} />
          <Text style={{ fontSize: "16px", margin: "0 0 10px" }}>
            <strong>Message:</strong>
          </Text>
          <Text
            style={{
              fontSize: "16px",
              whiteSpace: "pre-wrap",
              backgroundColor: "#f4f4f4",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            {message}
          </Text>
        </Section>
        <Text style={{ marginTop: "30px", color: "#888", fontSize: "14px" }}>
          This message was sent from your website contact form.
        </Text>
      </Container>
    </Html>
  );
}
