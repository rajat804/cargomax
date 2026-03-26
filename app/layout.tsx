import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { DashboardShell } from "@/components/DashboardShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cargomax – Shipping & Logistics Admin Dashboard Next.js Template",
  description:
    "Cargomax is a modern and responsive Shipping & Logistics Admin Dashboard Template designed for cargo management, freight tracking, warehouse control, and logistics operations. Built with clean UI components and advanced features, Cargomax offers real-time shipment monitoring, driver assignments, order tracking, fleet status, and warehouse insights. Ideal for logistics companies, transportation services, and supply chain dashboards, this template ensures a seamless and intuitive admin experience. Fully responsive, customizable, and developer-friendly – boost your logistics platform with Cargomax today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DashboardShell>{children}</DashboardShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
