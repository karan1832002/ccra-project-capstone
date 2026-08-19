import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import ChatWidget from "@/components/ui/ChatWidget";
import { CartProvider } from "@/app/context/CartContext";
import Footer from "@/components/footer/footer";
import Script from "next/script";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="set-dark-mode"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Prior explicit choice, if any
                const stored = localStorage.getItem('theme');

                // Fallback: system dark mode setting
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                // Set before paint to avoid a flash of the wrong theme
                if (stored === 'dark' || (!stored && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
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

      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <ChatWidget />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
