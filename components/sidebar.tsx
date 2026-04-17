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
  FolderTree,
  FileText,
  GitBranch,
  CalendarDays,
  DollarSign,
  Gift,
  Receipt,
  BarChart3,
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
  href?: string;
  children?: NavItem[];
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
        { title: "Overview", icon: LayoutDashboard, href: "/" },
        { title: "Live Shipment Map", icon: Map, href: "/dashboard/map" },
        { title: "Fleet Status", icon: Activity, href: "/dashboard/fleet-status" },
      ],
    },

    {
      title: "Operations",
      items: [
        { title: "Consignor Master", icon: Users, href: "/clients" },
        { title: "Consignee Master", icon: Users, href: "/operations/consignees" },
        { title: "Vehicle Master", icon: Bus, href: "/fleet/vehicles" },
        { title: "Driver Master", icon: UserCog, href: "/fleet/drivers" },
        { title: "Godown Master", icon: Warehouse, href: "/warehouses" },
        { title: "Tariff Master", icon: BarChart, href: "/operations/tariff" },
        { title: "Packing Master", icon: PackagePlus, href: "/operations/packing" },
        { title: "Freight On Master", icon: Truck, href: "/operations/freight-on" },
      ],
    },

    {
      title: "Transactions",
      items: [
        { title: "GR Booking", icon: PlusSquare, href: "/shipments/create" },
        { title: "GR Enquiry", icon: ClipboardList, href: "/shipments/show" },
        { title: "Goods Arrival", icon: PackagePlus, href: "/transactions/goods-arrival" },
        { title: "Gate Pass Entry", icon: Navigation, href: "/transactions/gate-pass" },
        { title: "Manifest", icon: FileText, href: "/transactions/manifest" },
        { title: "LHC Entry", icon: FileText, href: "/transactions/lhc-entry" },
        { title: "DRS / DDR", icon: Calendar, href: "/orders" },
        { title: "POD Entry + Upload", icon: Receipt, href: "/shipments/track" },
        { title: "Lorry Hire Challan", icon: Truck, href: "/transactions/lhc" },
      ],
    },
    {
      title: "Reports",
      items: [
        {
          title: "GR Register",
          icon: FileText,
          href: "/reports/gr-register",
        },
        {
          title: "Daily Sales Report",
          icon: BarChart,
          href: "/reports/daily-sales",
        },
        {
          title: "Pending POD",
          icon: Clock,
          href: "/reports/pending-pod",
        },
        {
          title: "Branch Stock Report",
          icon: BoxesIcon,
          href: "/reports/branch-stock",
        },
        {
          title: "Despatch Register",
          icon: Truck,
          href: "/reports/despatch-register",
        },
        {
          title: "Delivery Register",
          icon: ClipboardList,
          href: "/reports/delivery-register",
        },
      ],
    },

    {
      title: "Accounts",
      items: [
        { title: "Customer Master", icon: Users, href: "/accounts/customers" },
        { title: "Vendor Master", icon: Building2, href: "/vendors/add" },
        { title: "Chart of Accounts", icon: FolderTree, href: "/accounts/chart" },
        { title: "Cost Center Master", icon: GitBranch, href: "/accounts/cost-center" },
        { title: "TDS Masters", icon: FileText, href: "/accounts/tds" },

        { title: "Money Receipt", icon: DollarSign, href: "/accounts/money-receipt" },
        { title: "Reverse MR", icon: RotateCcw, href: "/accounts/reverse-mr" },
        { title: "Freight Memo Payment", icon: Receipt, href: "/accounts/freight-memo" },
        { title: "Vendor Bill", icon: FileText, href: "/accounts/vendor-bill" },
        { title: "Fund Transfer", icon: BarChart3, href: "/accounts/fund-transfer" },
        { title: "Operational Expense", icon: DollarSign, href: "/accounts/expense" },
        { title: "Bank Reconciliation", icon: BarChart, href: "/accounts/bank-reco" },
        { title: "Voucher Entry", icon: ClipboardList, href: "/accounts/voucher" },
      ],
    },

    {
      title: "Administrator",
      items: [
        { title: "Company Master", icon: Building2, href: "/settings" },
        { title: "Branch Master", icon: Building2, href: "/admin/branch" },
        { title: "Financial Year Master", icon: CalendarDays, href: "/admin/financial-year" },
        { title: "User Master", icon: Users, href: "/employees" },
        { title: "Role Master", icon: ShieldCheck, href: "/admin/roles" },
        { title: "Roles & Permissions", icon: ShieldCheck, href: "/admin/permissions" },
        { title: "GST Configuration", icon: Settings, href: "/admin/gst" },
        { title: "SMS / Email Setup", icon: Mail, href: "/settings/notifications" },
        { title: "Parameter Config", icon: Settings, href: "/admin/parameters" },
      ],
    },

    {
  title: "HR & Payroll",
  items: [
    {
      icon: Users,
      title: "Employees",
      children: [
        {
          icon: Users,
          title: "Employees",
          href: "/employees",
        },
        {
          icon: Building2,
          title: "Departments",
          href: "/departments",
        },
        {
          icon: FolderTree,
          title: "Hierarchy",
          href: "/hierarchy",
        },
        {
          icon: FileText,
          title: "Documents",
          href: "/docu",
        },
        {
          icon: GitBranch,
          title: "Lifecycle",
          href: "/lifecycle",
        },
      ],
    },

    {
      icon: CalendarDays,
      title: "Attendance",
      href: "/attendance",
    },

    {
      icon: DollarSign,
      title: "Payroll",
      children: [
        {
          icon: DollarSign,
          title: "Dashboard",
          href: "/payroll",
        },
        {
          icon: FileText,
          title: "Salary Structure",
          href: "/payroll/salary-structure",
        },
        {
          icon: Settings,
          title: "Process Payroll",
          href: "/payroll/process",
        },
        {
          icon: Receipt,
          title: "Payslips",
          href: "/payroll/payslips",
        },
        {
          icon: Gift,
          title: "Bonuses",
          href: "/payroll/bonuses",
        },
        {
          icon: Receipt,
          title: "Reimbursements",
          href: "/payroll/reimbursements",
        },
        {
          icon: BarChart3,
          title: "Reports",
          href: "/payroll/reports",
        },
      ],
    },
  ],
},
{
  title: "Inventory",
    items: [
      { title: "Item Master", icon: BoxesIcon, href: "/inventory/items" },
      { title: "Material Master", icon: BoxesIcon, href: "/inventory/materials" },
      { title: "Item Purchase", icon: PackagePlus, href: "/inventory/purchase" },
      { title: "Stock Issue to Branch", icon: Truck, href: "/inventory/stock-issue" },
      { title: "Item Despatch", icon: Truck, href: "/inventory/despatch" },
    ],
    },

{
  title: "Help & Support",
    items: [
      { title: "Help Center", icon: LifeBuoy, href: "/help" },
      { title: "Support Tickets", icon: Ticket, href: "/help/tickets" },
      { title: "Audit Logs", icon: Scroll, href: "/help/logs" },
      { title: "Contact / Chat", icon: MessageCircle, href: "/contact" },
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
              <div key={item.title}>

                {/* Normal Link */}
                {item.href && (
                  <Link
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
                )}

                {/* Parent Menu */}
                {item.children && (
                  <div>
                    <div className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-foreground">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>

                    <div className="ml-6 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          href={child.href!}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
                            pathname === child.href
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground"
                          )}
                          onClick={toggleSidebar}
                        >
                          <child.icon className="h-4 w-4" />
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
}
