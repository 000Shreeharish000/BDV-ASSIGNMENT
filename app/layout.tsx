import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hospital Patient Admission & Disease Distribution Analytics | SRM IST",
  description:
    "Big Data Visualization Course Project (21CSE423T) - Continuous Learning Assessment 2, SRM Institute of Science and Technology, Tiruchirappalli. Faculty Handling: Dr. Ganagavalli K.",
  authors: [{ name: "Big Data Analytics - SRM IST Tiruchirappalli" }],
  keywords: [
    "Hospital Analytics",
    "Big Data Visualization",
    "D3.js",
    "Healthcare Informatics",
    "SRM IST",
    "21CSE423T",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}

