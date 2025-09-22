import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message, botField } = await req.json();

    if (botField) return NextResponse.json({ ok: true }, { status: 200 }); // honeypot

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

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio <no-reply@your-domain.com>",
        to: ["you@example.com"],
        subject: `[Portfolio] ${subject}`,
        reply_to: email,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: txt || "Send failed." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unexpected error." }, { status: 500 });
  }
}
