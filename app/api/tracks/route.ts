import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET() {
  const tracks = await prisma.track.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tracks);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, artist, filename, fileUrl, fileKey } = body;

  if (!title || !artist || !fileUrl) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  const track = await prisma.track.create({
    data: { title, artist, filename, fileUrl, fileKey },
  });

  return NextResponse.json(track, { status: 201 });
}
