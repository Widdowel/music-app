import { prisma } from "./lib/prisma";
import TrackCard from "./components/TrackCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const tracks = await prisma.track.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ma Musique</h1>
        <Link
          href="/upload"
          className="bg-black text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          + Ajouter un track
        </Link>
      </div>

      {tracks.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">Aucun track pour le moment</p>
          <p className="text-sm mt-1">Commence par uploader ta musique !</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tracks.map((track) => (
            <TrackCard
              key={track.id}
              track={{
                ...track,
                createdAt: track.createdAt.toISOString(),
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
