import { NextRequest, NextResponse } from "next/server";
import { mockThreadsDb, generateThreadId } from "./mockDb";

export async function GET() {
  const threads = Object.values(mockThreadsDb);
  return NextResponse.json(threads);
}

export async function POST(req: NextRequest) {
  const { localId } = await req.json();

  const id = generateThreadId();
  const external_id = localId;

  mockThreadsDb[id] = {
    id,
    external_id,
    title: undefined,
    is_archived: false,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({
    id,
    external_id,
  });
}
