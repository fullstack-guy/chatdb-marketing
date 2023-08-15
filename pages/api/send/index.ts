import { NextResponse, NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

interface body {
  email: string;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;

async function streamToJSON(stream: ReadableStream<Uint8Array>): Promise<body> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value);
    }
  } catch (err) {
    throw new Error("Error reading from the stream");
  }

  try {
    return JSON.parse(result);
  } catch (err) {
    throw new Error("Error parsing the stream content as JSON");
  }
}

export default async function handler(req: NextRequest) {
  // This is test to see if we are running on the edge
  if (typeof global.EdgeRuntime === "string") {
    console.log("This code is running on", global.EdgeRuntime);
  }

  const { body } = req;

  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  let bodyJSON: body;

  try {
    bodyJSON = await streamToJSON(body);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  if (!bodyJSON.email) {
    return NextResponse.json({ message: "Missing email" }, { status: 400 });
  }

  const email = bodyJSON.email;

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

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
