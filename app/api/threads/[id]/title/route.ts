import { NextRequest, NextResponse } from "next/server";
import { mockThreadsDb } from "../../mockDb";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const { messages } = await req.json();

  if (!mockThreadsDb[id]) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  // Generate a mock title based on the first message
  let title = "New Thread";
  if (messages && messages.length > 0) {
    const firstMessage = messages[0];
    if (firstMessage.content) {
      title = firstMessage.content.substring(0, 50);
    }
  }

  return NextResponse.json({ title });
}
