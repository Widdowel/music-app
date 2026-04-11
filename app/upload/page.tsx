"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "../api/uploadthing/core";

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{
    url: string;
    key: string;
    name: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title || !artist || !uploadedFile) return;
    setSaving(true);

    const res = await fetch("/api/tracks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        artist,
        filename: uploadedFile.name,
        fileUrl: uploadedFile.url,
        fileKey: uploadedFile.key,
      }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      alert("Erreur lors de la sauvegarde");
    }
    setSaving(false);
  }

  return (
    <main className="flex-1 max-w-xl mx-auto w-full px-4 py-12">
      <Link
        href="/"
        className="text-sm text-gray-500 hover:text-gray-900 mb-6 inline-block"
      >
        &larr; Retour
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Ajouter un track
      </h1>

      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Nom du track"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Artiste
          </label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Nom de l'artiste"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fichier audio
          </label>
          {uploadedFile ? (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              {uploadedFile.name}
            </div>
          ) : (
            <UploadButton<OurFileRouter, "audioUploader">
              endpoint="audioUploader"
              onClientUploadComplete={(res) => {
                if (res?.[0]) {
                  const data = res[0].serverData as { url: string; key: string; name: string };
                  setUploadedFile({
                    url: data.url,
                    key: data.key,
                    name: data.name,
                  });
                }
              }}
              onUploadError={(error: Error) => {
                alert(`Erreur: ${error.message}`);
              }}
            />
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={!title || !artist || !uploadedFile || saving}
          className="bg-black text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Sauvegarde..." : "Sauvegarder le track"}
        </button>
      </div>
    </main>
  );
}
