"use client";

import { useRef, useState } from "react";

interface Track {
  id: string;
  title: string;
  artist: string;
  filename: string;
  fileUrl: string;
  createdAt: string;
}

export default function TrackList({ tracks }: { tracks: Track[] }) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  function handlePlay(index: number) {
    // Pause all other tracks
    audioRefs.current.forEach((audio, i) => {
      if (audio && i !== index) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    setCurrentIndex(index);
  }

  function handleEnded(index: number) {
    const nextIndex = index + 1;
    if (nextIndex < tracks.length) {
      const nextAudio = audioRefs.current[nextIndex];
      if (nextAudio) {
        nextAudio.play();
        setCurrentIndex(nextIndex);
      }
    } else {
      // Revient au premier track (boucle la playlist)
      const firstAudio = audioRefs.current[0];
      if (firstAudio) {
        firstAudio.play();
        setCurrentIndex(0);
      }
    }
  }

  return (
    <div className="grid gap-4">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className={`bg-white rounded-xl shadow-sm border p-5 flex flex-col gap-3 hover:shadow-md transition-shadow ${
            currentIndex === index ? "border-black" : "border-gray-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-mono w-5">{index + 1}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{track.title}</h3>
              <p className="text-sm text-gray-500">{track.artist}</p>
            </div>
          </div>

          <audio
            ref={(el) => { audioRefs.current[index] = el; }}
            controls
            className="w-full h-10"
            src={track.fileUrl}
            onPlay={() => handlePlay(index)}
            onEnded={() => handleEnded(index)}
          />

          <a
            href={`/api/download/${track.id}`}
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
      ))}
    </div>
  );
}
