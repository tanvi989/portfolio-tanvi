import { NextResponse } from "next/server";

// Define the interface for the request body
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  botField?: string; // honeypot field
}

// Define the interface for Resend API response
interface ResendEmailData {
  from: string;
  to: string[];
  subject: string;
  reply_to: string;
  text: string;
}

export async function POST(req: Request) {
  try {
    const { name, email, subject, message, botField }: ContactFormData = await req.json();

    // Honeypot check - if bot field is filled, it's likely spam
    if (botField) return NextResponse.json({ ok: true }, { status: 200 });

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    // --- Send email with Resend (or swap to your provider) ---
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // In dev, return success without sending to avoid failures
      console.warn("RESEND_API_KEY not set. Skipping send.");
      return NextResponse.json({ ok: true });
    }

    const emailData: ResendEmailData = {
      from: "Portfolio <no-reply@your-domain.com>",
      to: ["you@example.com"],
      subject: `[Portfolio] ${subject}`,
      reply_to: email,
      text: `From: ${name} <${email}>\n\n${message}`,
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: txt || "Send failed." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    // Properly handle the error without using 'any'
    const errorMessage = error instanceof Error ? error.message : "Unexpected error.";
    console.error("Contact form error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}