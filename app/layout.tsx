import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tariq Ahmad - Cybersecurity Analyst | Penetration Testing & Security Operations",
  description: "Experienced cybersecurity analyst specializing in penetration testing, threat detection, and incident response. 5+ years protecting critical infrastructure from advanced threats. CISSP, CEH, OSCP certified.",
  keywords: ["Tariq Ahmad", "Cybersecurity Analyst", "Penetration Testing", "Ethical Hacking", "Security Operations", "Threat Detection", "Incident Response", "CISSP", "CEH", "OSCP"],
  authors: [{ name: "Tariq Ahmad" }],
  openGraph: {
    title: "Tariq Ahmad - Cybersecurity Analyst",
    description: "Protecting digital assets through advanced threat detection, penetration testing, and security architecture",
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
