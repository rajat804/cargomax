"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart,
  BoxesIcon,
  Building2,
  Bus,
  Calendar,
  ClipboardList,
  Clock,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  Map,
  MessageCircle,
  Navigation,
  PackagePlus,
  PlusSquare,
  RotateCcw,
  Scroll,
  Settings,
  ShieldCheck,
  Ticket,
  Truck,
  UserCog,
  Users,
  Warehouse,
  FolderTree,
  FileText,
  GitBranch,
  CalendarDays,
  DollarSign,
  Gift,
  Receipt,
  BarChart3,
  ChevronDown,
  X,
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
  icon: React.ElementType;
  items: NavItem[];
}

export function Sidebar({ open, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const toggleDropdown = (title: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const navGroups: NavGroup[] = [
    // ... (Dashboard, Operations, Transactions, Reports, Accounts - unchanged)
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      items: [
        { title: "Overview", icon: LayoutDashboard, href: "/" },
        { title: "Live Shipment Map", icon: Map, href: "/dashboard/map" },
        { title: "Fleet Status", icon: Activity, href: "/dashboard/fleet-status" },
      ],
    },
    {
      title: "Operations",
      icon: Settings,
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
      icon: ClipboardList,
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
      icon: BarChart3,
      items: [
        { title: "GR Register", icon: FileText, href: "/reports/gr-register" },
        { title: "Daily Sales Report", icon: BarChart, href: "/reports/daily-sales" },
        { title: "Pending POD", icon: Clock, href: "/reports/pending-pod" },
        { title: "Branch Stock Report", icon: BoxesIcon, href: "/reports/branch-stock" },
        { title: "Despatch Register", icon: Truck, href: "/reports/despatch-register" },
        { title: "Delivery Register", icon: ClipboardList, href: "/reports/delivery-register" },
      ],
    },
    {
      title: "Accounts",
      icon: DollarSign,
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

    // Administrator (with HR & Payroll + Utilities)
    {
      title: "Administrator",
      icon: ShieldCheck,
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

        // HR & Payroll
        {
          title: "HR & Payroll",
          icon: Users,
          children: [
            {
              title: "Employees",
              icon: Users,
              children: [
                { title: "Employees List", icon: Users, href: "/employees" },
                { title: "Departments", icon: Building2, href: "/departments" },
                { title: "Hierarchy", icon: FolderTree, href: "/hierarchy" },
                { title: "Documents", icon: FileText, href: "/docu" },
                { title: "Lifecycle", icon: GitBranch, href: "/lifecycle" },
              ],
            },
            { title: "Attendance", icon: CalendarDays, href: "/attendance" },
            {
              title: "Payroll",
              icon: DollarSign,
              children: [
                { title: "Dashboard", icon: DollarSign, href: "/payroll" },
                { title: "Salary Structure", icon: FileText, href: "/payroll/salary-structure" },
                { title: "Process Payroll", icon: Settings, href: "/payroll/process" },
                { title: "Payslips", icon: Receipt, href: "/payroll/payslips" },
                { title: "Bonuses", icon: Gift, href: "/payroll/bonuses" },
                { title: "Reimbursements", icon: Receipt, href: "/payroll/reimbursements" },
                { title: "Reports", icon: BarChart3, href: "/payroll/reports" },
              ],
            },
          ],
        },

        // Utilities
        {
          title: "Utilities",
          icon: Settings,
          children: [
            { title: "Audit Logs", icon: Scroll, href: "/help/logs" },
            { title: "Financial Year Closing", icon: RotateCcw, href: "/admin/financial-year-closing" },
            { title: "Document Cancel/Uncancel", icon: FileText, href: "/admin/document-cancel" },
          ],
        },
      ],
    },

    {
      title: "Inventory",
      icon: BoxesIcon,
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
      icon: LifeBuoy,
      items: [
        { title: "Help Center", icon: LifeBuoy, href: "/help" },
        { title: "Support Tickets", icon: Ticket, href: "/help/tickets" },
        { title: "Contact / Chat", icon: MessageCircle, href: "/contact" },
      ],
    },
  ];

  return (
    <div className={cn(
      "fixed inset-y-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-300",
      open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      {/* Header */}
      <div className="flex justify-between items-center border-b px-4 h-16">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Truck className="h-6 w-6 text-primary" />
          <span className="text-xl">CargoMax</span>
        </Link>

        <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <div className="overflow-auto py-2">
        {navGroups.map((group) => (
          <div key={group.title} className="px-3 py-1">
            <button
              onClick={() => toggleDropdown(group.title)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                openDropdowns[group.title] && "bg-accent/50"
              )}
            >
              <div className="flex items-center gap-3">
                <group.icon className="h-4 w-4" />
                <span>{group.title}</span>
              </div>
              <ChevronDown className={cn("h-4 w-4 transition-transform", openDropdowns[group.title] && "rotate-180")} />
            </button>

            {openDropdowns[group.title] && (
              <div className="mt-1 ml-2 space-y-1 border-l-2 border-muted pl-2">
                {group.items.map((item) => (
                  <div key={item.title}>
                    {/* Simple Link */}
                    {item.href && !item.children && (
                      <Link
                        href={item.href}
                        onClick={toggleSidebar}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                          pathname === item.href && "bg-accent text-accent-foreground"
                        )}
                      >
                        <item.icon className="h-3.5 w-3.5" />
                        <span>{item.title}</span>
                      </Link>
                    )}

                    {/* Item with Children (HR & Payroll, Utilities, etc.) */}
                    {item.children && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground">
                          <item.icon className="h-3.5 w-3.5" />
                          <span>{item.title}</span>
                        </div>
                        <div className="ml-4 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.title}
                              href={child.href ?? "#"}   // ← Fixed: Safe fallback
                              onClick={toggleSidebar}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-1.5 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                                pathname === child.href && "bg-accent text-accent-foreground"
                              )}
                            >
                              <child.icon className="h-3 w-3" />
                              <span>{child.title}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}