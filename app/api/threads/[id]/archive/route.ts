import { NextRequest, NextResponse } from "next/server";
import { mockThreadsDb } from "../../mockDb";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!mockThreadsDb[id]) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  mockThreadsDb[id].is_archived = true;

  return NextResponse.json(mockThreadsDb[id]);
}
