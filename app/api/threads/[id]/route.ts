import { NextRequest, NextResponse } from "next/server";
import { mockThreadsDb } from "../mockDb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!mockThreadsDb[id]) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  return NextResponse.json(mockThreadsDb[id]);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { title } = await req.json();

  if (!mockThreadsDb[id]) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  mockThreadsDb[id].title = title;

  return NextResponse.json(mockThreadsDb[id]);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!mockThreadsDb[id]) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  delete mockThreadsDb[id];

  return NextResponse.json({ success: true });
}
