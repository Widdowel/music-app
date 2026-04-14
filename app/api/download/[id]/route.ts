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

  // Fetch the file from Uploadthing and stream it back with download headers
  const fileResponse = await fetch(track.fileUrl);
  const fileBuffer = await fileResponse.arrayBuffer();

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${track.filename}"`,
      "Content-Length": fileBuffer.byteLength.toString(),
    },
  });
}
