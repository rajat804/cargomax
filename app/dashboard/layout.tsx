import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Fleet Status Dashboard | CargoMax - Real-time Vehicle Tracking & Management",
  description:
    "Monitor your entire fleet with real-time status updates, vehicle tracking, maintenance schedules, and performance analytics. Track fuel efficiency, maintenance costs, and vehicle locations across your logistics operations.",
  keywords: [
    "fleet management",
    "vehicle tracking",
    "fleet status dashboard",
    "maintenance scheduling",
    "fuel efficiency tracking",
    "logistics dashboard",
    "vehicle monitoring",
    "fleet analytics",
    "transportation management",
    "cargo tracking",
    "fleet optimization",
    "vehicle maintenance",
    "real-time tracking",
    "fleet performance",
    "logistics software",
  ],
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default DashboardLayout;
