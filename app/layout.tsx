import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import ChatWidget from "../components/ui/ChatWidget";

export const metadata: Metadata = {
  title: "CCRA Rodeo",
  description:
    "Join the community. Track your events, manage entries, and follow the standings.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body>
        <Header />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
