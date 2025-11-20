import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tariq Ahmad - Full Stack Developer | React, TypeScript, Next.js",
  description: "Full-stack developer specializing in React, TypeScript, and Next.js. 3+ years building scalable web applications with modern technologies. View my portfolio and projects.",
  keywords: ["Tariq Ahmad", "Full Stack Developer", "React", "TypeScript", "Next.js", "Web Developer", "Software Engineer"],
  authors: [{ name: "Tariq Ahmad" }],
  openGraph: {
    title: "Tariq Ahmad - Full Stack Developer",
    description: "Full-stack developer specializing in React, TypeScript, and Next.js",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
