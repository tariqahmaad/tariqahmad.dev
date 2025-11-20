import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tariq Ahmad - Software Developer | Computer Engineering Student",
  description: "Computer Engineering student at Istanbul Aydin University with expertise in full-stack development, networking, and AI. CGPA 3.36/4.0. Graduating July 2025. CCNA, MCSE, React Native certified.",
  keywords: ["Tariq Ahmad", "Software Developer", "Computer Engineering", "Full Stack Developer", "React Native", "Python", "Java", "Istanbul Aydin University", "CCNA", "MCSE", "Machine Learning"],
  authors: [{ name: "Tariq Ahmad" }],
  openGraph: {
    title: "Tariq Ahmad - Software Developer & Engineer",
    description: "Computer Engineering student with expertise in full-stack development, networking, and system architecture",
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
