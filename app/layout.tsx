import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ma Musique",
  description: "Ecoute et telecharge ma musique",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50">{children}</body>
    </html>
  );
}
