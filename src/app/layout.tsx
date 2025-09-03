import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "CSGSA Welcome Event - Student Origins Map",
  description:
    "Computer Science Graduate Students Association welcome event registration and global student origins map. University of Minnesota - Twin Cities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
