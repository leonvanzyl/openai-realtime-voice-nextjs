import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.NEXT_PUBLIC_OPENAI_REALTIME_MODEL!,
          voice: process.env.NEXT_PUBLIC_OPENAI_REALTIME_VOICE!,
          instructions: "You are a helpful assistant called Verse",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate ephemeral token");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generating ephemeral token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
