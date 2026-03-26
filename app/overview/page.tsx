import OverviewPage from "@/components/overview/overviewPage";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Overview - Cargomax",
  description:
    "Cargomax is a modern and responsive Shipping & Logistics Admin Dashboard Template designed for cargo management, freight tracking, warehouse control, and logistics operations.",
};
const Overview = () => {
  return (
    <div>
      <OverviewPage />
    </div>
  );
};

export default Overview;
