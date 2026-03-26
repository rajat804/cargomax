"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart,
  Bell,
  BoxesIcon,
  Building2,
  Bus,
  Calendar,
  ClipboardList,
  Clock,
  ContactRound,
  Grid2x2,
  LayoutDashboard,
  LifeBuoy,
  LineChart,
  Mail,
  Map,
  Menu,
  MessageCircle,
  MessagesSquare,
  Navigation,
  PackagePlus,
  PieChart,
  PlusSquare,
  RotateCcw,
  Scroll,
  Settings,
  ShieldCheck,
  Ticket,
  Truck,
  UserCog,
  UserPlus,
  Users,
  Warehouse,
  Wrench,
  X,
  XSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export function Sidebar({ open, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  const navGroups: NavGroup[] = [
    {
      title: "Dashboard",
      items: [
        {
          title: "Overview",
          icon: LayoutDashboard,
          href: "/",
        },
        {
          title: "Live Shipment Map",
          icon: Map,
          href: "/dashboard/map",
        },
        {
          title: "Fleet Status",
          icon: Activity,
          href: "/dashboard/fleet-status",
        },
      ],
    },
    {
      title: "Shipments",
      items: [
        {
          title: "All Shipments",
          icon: Truck,
          href: "/shipments",
        },
        {
          title: "Track Shipment",
          icon: Navigation,
          href: "/shipments/track",
        },
        {
          title: "Create Shipment",
          icon: PlusSquare,
          href: "/shipments/create",
        },
        {
          title: "Delayed Shipments",
          icon: Clock,
          href: "/shipments/delayed",
        },
      ],
    },
    {
      title: "Fleet Management",
      items: [
        {
          title: "Vehicle List",
          icon: Bus,
          href: "/fleet/vehicles",
        },
        {
          title: "Maintenance Logs",
          icon: Wrench,
          href: "/fleet/maintenance",
        },
        {
          title: "Driver Assignments",
          icon: UserCog,
          href: "/fleet/drivers",
        },
      ],
    },
    {
      title: "Warehouses",
      items: [
        {
          title: "Warehouse Locations",
          icon: Warehouse,
          href: "/warehouses",
        },
        {
          title: "Inventory Levels",
          icon: BoxesIcon,
          href: "/warehouses/inventory",
        },
        {
          title: "Restock Requests",
          icon: PackagePlus,
          href: "/warehouses/restock",
        },
      ],
    },
    {
      title: "Vendors & Clients",
      items: [
        {
          title: "Vendor Directory",
          icon: Building2,
          href: "/vendors",
        },
        {
          title: "Add Vendor",
          icon: UserPlus,
          href: "/vendors/add",
        },
        {
          title: "Clients List",
          icon: Users,
          href: "/clients",
        },
        {
          title: "Client Feedback",
          icon: MessagesSquare,
          href: "/clients/feedback",
        },
      ],
    },
    {
      title: "Orders",
      items: [
        {
          title: "All Orders",
          icon: ClipboardList,
          href: "/orders",
        },
        {
          title: "Scheduled Deliveries",
          icon: Calendar,
          href: "/orders/scheduled",
        },
        {
          title: "Returns",
          icon: RotateCcw,
          href: "/orders/returns",
        },
        {
          title: "Cancellations",
          icon: XSquare,
          href: "/orders/cancellations",
        },
      ],
    },
    {
      title: "Reports",
      items: [
        {
          title: "Delivery Performance",
          icon: BarChart,
          href: "/reports/delivery",
        },
        {
          title: "Revenue Analysis",
          icon: LineChart,
          href: "/reports/revenue",
        },
        {
          title: "Fleet Efficiency",
          icon: PieChart,
          href: "/reports/fleet",
        },
      ],
    },
    {
      title: "System Tools",
      items: [
        {
          title: "Settings",
          icon: Settings,
          href: "/settings",
        },
        {
          title: "Roles & Permissions",
          icon: ShieldCheck,
          href: "/settings/roles",
        },
        {
          title: "Notifications Setup",
          icon: Bell,
          href: "/settings/notifications",
        },
      ],
    },
    {
      title: "Help & Logs",
      items: [
        {
          title: "Help Center",
          icon: LifeBuoy,
          href: "/help",
        },
          {
          title: "Contact",
          icon: ContactRound,
          href: "/contact",
        },
        {
          title: "Email",
          icon: Mail,
          href: "/email",
        },
        {
          title: "Chat",
          icon: MessageCircle,
          href: "/chat",
        },     
        {
          title: "Support Tickets",
          icon: Ticket,
          href: "/help/tickets",
        },
        {
          title: "Audit Logs",
          icon: Scroll,
          href: "/help/logs",
        },
        {
          title: "Widgets",
          icon: Grid2x2,
          href: "/widgets",
        },
      ],
    },
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex justify-between  items-center border-b px-4">
        <Link href="/" className="flex items-center  gap-2 font-semibold h-16">
          <Truck className="h-6 w-6 text-primary" />
          <span className="text-xl">CargoMax</span>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      <div className="overflow-auto py-2">
        {navGroups.map((group) => (
          <div key={group.title} className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </h2>
            <div className="space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground"
                  )}
                   onClick={toggleSidebar}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
