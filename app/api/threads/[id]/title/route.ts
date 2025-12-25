import { NextRequest, NextResponse } from "next/server";
import { mockThreadsDb } from "../../mockDb";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { messages } = await req.json();

  if (mockThreadsDb[id]) {
    return NextResponse.json({ title: mockThreadsDb[id].title });
  }

  // Generate a mock title based on the first message
  const title = "New Thread";
  if (messages && messages.length > 0) {
    const firstMessage = messages[0];
    if (firstMessage.content) {
      // title = firstMessage.content.substring(0, 50);
    }
  }

  return NextResponse.json({ title });
}
