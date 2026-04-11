"use client";

interface Track {
  id: string;
  title: string;
  artist: string;
  filename: string;
  fileUrl: string;
  createdAt: string;
}

export default function TrackCard({ track }: { track: Track }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{track.title}</h3>
        <p className="text-sm text-gray-500">{track.artist}</p>
      </div>

      <audio controls loop className="w-full h-10" src={track.fileUrl} />

      <a
        href={track.fileUrl}
        download={track.filename}
        className="inline-flex items-center justify-center gap-2 bg-black text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Telecharger
      </a>
    </div>
  );
}
