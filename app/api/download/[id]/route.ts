import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const track = await prisma.track.findUnique({ where: { id } });

  if (!track) {
    return NextResponse.json({ error: "Track introuvable" }, { status: 404 });
  }

  // Redirect to the Uploadthing file URL for download
  return NextResponse.redirect(track.fileUrl);
}
