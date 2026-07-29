import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZeroOrigin - One Origin Key. Infinite Credentials.",
  description: "Deterministic Password Generator - Generate passwords without storing them",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-black text-white font-mono">
        {children}
      </body>
    </html>
  );
}
