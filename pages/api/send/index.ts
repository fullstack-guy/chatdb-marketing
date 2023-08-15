import { NextApiRequest, NextApiResponse } from "next";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  if (!req.body.email) {
    res.status(400).json({ message: "Missing email" });
    return;
  }

  const email = req.body.email;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ChatDB <onboarding@chatdb.ai>",
        to: [email],
        subject: "Welcome from the ChatDB Team 👋",
        reply_to: "cfahlgren1@gmail.com",
        html: `
            <h2 style={{ color: '#333' }}>Hey there!</h2>
            <p>
                Thank you for signing up to the ChatDB waitlist. We're thrilled to have you on board!
            </p>
            <p>
                Our team is working hard to provide you with the best chat database service. You'll be among the first to know when we launch.
            </p>
            <p>
                Thank you once again for your interest and support.
            </p>
            <p>
                Best regards,<br />
                The ChatDB Team
            </p>
            `,
      }),
    });

    if (!response.ok) {
      throw new Error("Unable to send email");
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
