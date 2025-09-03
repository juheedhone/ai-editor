import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const { text } = await generateText({
    model: google("gemini-2.5-flash-lite"),
    messages: [
      {
        role: "system",
        content:
          "You are a helpful writing assistant. You have to shorten the user prompt. Give only one option.",
      },
      { role: "user", content: prompt },
    ],
  });

  return Response.json({ text });
}
