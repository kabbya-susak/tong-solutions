import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-headings",
  weight: ["400", "600", "700", "800"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tong Solutions",
  description: "Turn your final year project ideas and requirements into high-quality, submission-ready software systems. Tailored for university students with complete documentation.",
  keywords: "final year projects, university project maker, cs projects, software engineering projects, thesis documentation, Tong Solutions",
  openGraph: {
    title: "Tong Solutions",
    description: "Submit your project ideas and requirements. We help you create high-fidelity final year projects with source code, report documents, and viva preparations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
