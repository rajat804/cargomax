"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Save,
  RefreshCw,
  Search,
  Printer,
  FileText,
  Eye,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DDRItem {
  id: number;
  gatepassNo: string;
  grNo: string;
  grDate: Date;
  pckgs: number;
  weight: number;
  rate: number;
  freight: number;
  deliveryCharge: number;
  otherCharge: number;
  gst: number;
  advance: number;
  totalAmount: number;
  rebate: number;
  recdAmount: number;
  dueAmount: number;
  billAmount: number;
  tds: number;
  wcn: number;
  partyName: string;
  arrivalDate: Date;
  voucherNo: string;
  refNo: string;
  cashRecd: number;
  chequeRecd: number;
}

const branchOptions = [
  "CORPORATE OFFICE",
  "DELHI",
  "MUMBAI",
  "BANGALORE",
  "CHENNAI",
  "KOLKATA",
  "AHMEDABAD",
  "PUNE",
  "HYDERABAD",
  "LUCKNOW",
  "KANPUR",
  "JAIPUR",
];

export default function DDRPage() {
  const [branch, setBranch] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [ddrNo, setDdrNo] = useState<string>("");
  const [auto, setAuto] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;
  const [ddrItems, setDdrItems] = useState<DDRItem[]>([]);

  const [totals, setTotals] = useState({
    noOfGR: 0,
    totalPckgs: 0,
    totalWeight: 0,
    totalFreight: 0,
    totalDeliveryCharge: 0,
    totalOtherCharge: 0,
    totalGST: 0,
    totalAdvance: 0,
    totalAmount: 0,
    totalRebate: 0,
    totalRecdAmount: 0,
    totalDueAmount: 0,
    totalBillAmount: 0,
    totalTDS: 0,
    totalWCN: 0,
    totalCashRecd: 0,
    totalChequeRecd: 0,
  });

  const deliveryTotals = {
    totalDelivery: 0,
    cashDelivery: 0,
    chequeDelivery: 0,
    journalDelivery: 0,
    markForBillDelivery: 0,
    dueGatePassDelivery: 0,
  };

  const generateDDRNo = (): string => {
    const count = ddrItems.length + 1;
    return `DDR${String(count).padStart(6, "0")}`;
  };

  const handleAutoChange = () => {
    setAuto(!auto);
    if (!auto) {
      setDdrNo(generateDDRNo());
    } else {
      setDdrNo("");
    }
  };

  const calculateTotals = (items: DDRItem[]) => {
    const newTotals = {
      noOfGR: items.length,
      totalPckgs: items.reduce((sum, item) => sum + item.pckgs, 0),
      totalWeight: items.reduce((sum, item) => sum + item.weight, 0),
      totalFreight: items.reduce((sum, item) => sum + item.freight, 0),
      totalDeliveryCharge: items.reduce((sum, item) => sum + item.deliveryCharge, 0),
      totalOtherCharge: items.reduce((sum, item) => sum + item.otherCharge, 0),
      totalGST: items.reduce((sum, item) => sum + item.gst, 0),
      totalAdvance: items.reduce((sum, item) => sum + item.advance, 0),
      totalAmount: items.reduce((sum, item) => sum + item.totalAmount, 0),
      totalRebate: items.reduce((sum, item) => sum + item.rebate, 0),
      totalRecdAmount: items.reduce((sum, item) => sum + item.recdAmount, 0),
      totalDueAmount: items.reduce((sum, item) => sum + item.dueAmount, 0),
      totalBillAmount: items.reduce((sum, item) => sum + item.billAmount, 0),
      totalTDS: items.reduce((sum, item) => sum + item.tds, 0),
      totalWCN: items.reduce((sum, item) => sum + item.wcn, 0),
      totalCashRecd: items.reduce((sum, item) => sum + item.cashRecd, 0),
      totalChequeRecd: items.reduce((sum, item) => sum + item.chequeRecd, 0),
    };
    setTotals(newTotals);
  };

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const sampleData: DDRItem[] = [
        {
          id: 1,
          gatepassNo: "GP001",
          grNo: "GR0001",
          grDate: new Date("2026-04-25"),
          pckgs: 10,
          weight: 500,
          rate: 25,
          freight: 12500,
          deliveryCharge: 500,
          otherCharge: 200,
          gst: 2250,
          advance: 5000,
          totalAmount: 15450,
          rebate: 0,
          recdAmount: 10000,
          dueAmount: 5450,
          billAmount: 15450,
          tds: 0,
          wcn: 0,
          partyName: "M/s ABC Traders",
          arrivalDate: new Date("2026-04-28"),
          voucherNo: "V001",
          refNo: "REF001",
          cashRecd: 5000,
          chequeRecd: 5000,
        },
        {
          id: 2,
          gatepassNo: "GP002",
          grNo: "GR0002",
          grDate: new Date("2026-04-26"),
          pckgs: 15,
          weight: 750,
          rate: 22,
          freight: 16500,
          deliveryCharge: 700,
          otherCharge: 300,
          gst: 2970,
          advance: 8000,
          totalAmount: 20470,
          rebate: 500,
          recdAmount: 15000,
          dueAmount: 4970,
          billAmount: 19970,
          tds: 200,
          wcn: 0,
          partyName: "M/s XYZ Enterprises",
          arrivalDate: new Date("2026-04-29"),
          voucherNo: "V002",
          refNo: "REF002",
          cashRecd: 8000,
          chequeRecd: 7000,
        },
      ];
      setDdrItems(sampleData);
      calculateTotals(sampleData);
      setLoading(false);
    }, 500);
  };

  const handleGenerate = () => {
    if (!branch) {
      alert("Please select Branch");
      return;
    }
    alert("DDR generated successfully!");
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this DDR?")) {
      setDdrItems([]);
      setDdrNo("");
      setBranch("");
      setDate(new Date());
      alert("DDR cancelled successfully!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClear = () => {
    setBranch("");
    setDate(new Date());
    setDdrNo("");
    setAuto(true);
    setDdrItems([]);
    setSearchTerm("");
  };

  const handleVoucherPrint = () => {
    alert("Voucher print initiated!");
  };

  const handlePendingDDR = () => {
    alert("Pending DDR report downloaded!");
  };

  const handleShowDetails = () => {
    if (ddrItems.length === 0) {
      alert("No DDR details to show. Please search first.");
      return;
    }
    alert(`Total ${ddrItems.length} DDR records found.`);
  };

  const handleDDRDetailsReport = () => {
    alert("DDR Details Report generated!");
  };

  const paginatedResults = ddrItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(ddrItems.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">DDR (Delivery Receipt)</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 border rounded-md bg-muted/20">
        <div className="space-y-1">
          <Label className="text-xs font-medium">Branch</Label>
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="SELECT BRANCH" />
            </SelectTrigger>
            <SelectContent>
              {branchOptions.map((opt) => (
                <SelectItem key={opt} value={opt} className="text-xs">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-8 w-full justify-start text-left text-xs">
                <CalendarIcon className="mr-2 h-3 w-3" />
                {format(date, "dd-MM-yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium">DDR #</Label>
          <div className="flex gap-2">
            <Input
              value={ddrNo}
              onChange={(e) => setDdrNo(e.target.value)}
              readOnly={auto}
              placeholder="DDR Number"
              className={cn("h-8 text-xs flex-1", auto && "bg-muted")}
            />
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={auto}
                onChange={handleAutoChange}
                className="h-3.5 w-3.5"
                id="auto"
              />
              <Label htmlFor="auto" className="text-xs cursor-pointer">
                Auto
              </Label>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-end">
          <Button onClick={handlePendingDDR} variant="outline" size="sm" className="h-8 text-xs">
            <FileSpreadsheet className="mr-1 h-3 w-3" />
            Pending DDR
          </Button>
          <Button onClick={handleShowDetails} variant="outline" size="sm" className="h-8 text-xs">
            <Eye className="mr-1 h-3 w-3" />
            Show Details
          </Button>
          <Button onClick={handleDDRDetailsReport} variant="outline" size="sm" className="h-8 text-xs">
            <FileText className="mr-1 h-3 w-3" />
            DDR Report
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by GR #, Gatepass # or Party Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <Button onClick={handleSearch} size="sm" className="h-8 text-xs" disabled={loading}>
          <Search className="mr-1 h-3.5 w-3.5" />
          SEARCH
        </Button>
      </div>

      {/* Main Table */}
      <div className="rounded-md border overflow-x-auto">
        <div className="min-w-[1600px]">
          <Table className="text-[10px] md:text-xs">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="py-2 px-1 text-center w-12">S#</TableHead>
                <TableHead className="py-2 px-1 min-w-[90px]">Gatepass #</TableHead>
                <TableHead className="py-2 px-1 min-w-[80px]">GR #</TableHead>
                <TableHead className="py-2 px-1 min-w-[80px]">GR Date</TableHead>
                <TableHead className="py-2 px-1 text-center w-[50px]">Pckgs</TableHead>
                <TableHead className="py-2 px-1 text-center w-[60px]">Weight</TableHead>
                <TableHead className="py-2 px-1 text-center w-[50px]">Rate</TableHead>
                <TableHead className="py-2 px-1 text-right w-[70px]">Freight</TableHead>
                <TableHead className="py-2 px-1 text-right w-[80px]">Delivery Chg</TableHead>
                <TableHead className="py-2 px-1 text-right w-[70px]">Other Chg</TableHead>
                <TableHead className="py-2 px-1 text-right w-[60px]">GST</TableHead>
                <TableHead className="py-2 px-1 text-right w-[70px]">Advance</TableHead>
                <TableHead className="py-2 px-1 text-right w-[70px]">Total Amt</TableHead>
                <TableHead className="py-2 px-1 text-right w-[60px]">Rebate</TableHead>
                <TableHead className="py-2 px-1 text-right w-[70px]">Recd Amt</TableHead>
                <TableHead className="py-2 px-1 text-right w-[70px]">Due Amt</TableHead>
                <TableHead className="py-2 px-1 text-right w-[70px]">Bill Amt</TableHead>
                <TableHead className="py-2 px-1 text-right w-[50px]">TDS</TableHead>
                <TableHead className="py-2 px-1 text-right w-[50px]">WCN</TableHead>
                <TableHead className="py-2 px-1 min-w-[120px]">Party Name</TableHead>
                <TableHead className="py-2 px-1 min-w-[80px]">Arrival Date</TableHead>
                <TableHead className="py-2 px-1 min-w-[70px]">Voucher #</TableHead>
                <TableHead className="py-2 px-1 min-w-[70px]">Ref. #</TableHead>
                <TableHead className="py-2 px-1 text-right w-[70px]">Cash Recd</TableHead>
                <TableHead className="py-2 px-1 text-right w-[70px]">Cheque Recd</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={25} className="text-center py-8 text-muted-foreground">
                    No items to display. Click SEARCH to load data.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedResults.map((item, idx) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="py-1.5 px-1 text-center">{(currentPage-1)*itemsPerPage+idx+1}</TableCell>
                    <TableCell className="py-1.5 px-1 font-mono">{item.gatepassNo}</TableCell>
                    <TableCell className="py-1.5 px-1 font-mono">{item.grNo}</TableCell>
                    <TableCell className="py-1.5 px-1">{format(item.grDate, "dd-MM-yyyy")}</TableCell>
                    <TableCell className="py-1.5 px-1 text-center">{item.pckgs}</TableCell>
                    <TableCell className="py-1.5 px-1 text-center">{item.weight}</TableCell>
                    <TableCell className="py-1.5 px-1 text-center">{item.rate}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right">₹{item.freight.toLocaleString()}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right">₹{item.deliveryCharge.toLocaleString()}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right">₹{item.otherCharge.toLocaleString()}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right">₹{item.gst.toLocaleString()}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right">₹{item.advance.toLocaleString()}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right font-medium">₹{item.totalAmount.toLocaleString()}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right">₹{item.rebate.toLocaleString()}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right">₹{item.recdAmount.toLocaleString()}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right text-red-600">₹{item.dueAmount.toLocaleString()}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right">₹{item.billAmount.toLocaleString()}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right">₹{item.tds.toLocaleString()}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right">₹{item.wcn.toLocaleString()}</TableCell>
                    <TableCell className="py-1.5 px-1">{item.partyName}</TableCell>
                    <TableCell className="py-1.5 px-1">{format(item.arrivalDate, "dd-MM-yyyy")}</TableCell>
                    <TableCell className="py-1.5 px-1">{item.voucherNo}</TableCell>
                    <TableCell className="py-1.5 px-1">{item.refNo}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right">₹{item.cashRecd.toLocaleString()}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right">₹{item.chequeRecd.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Totals Row */}
      {ddrItems.length > 0 && (
        <div className="rounded-md border bg-muted/30 p-2 overflow-x-auto">
          <div className="min-w-[1000px] flex flex-wrap justify-between gap-2 text-[10px] md:text-xs">
            <div className="flex gap-4">
              <span className="font-semibold">Total:</span>
              <span>No of GR : {totals.noOfGR}</span>
              <span>Pckgs : {totals.totalPckgs}</span>
              <span>Weight : {totals.totalWeight}</span>
              <span>Freight : ₹{totals.totalFreight.toLocaleString()}</span>
              <span>Delivery Chg : ₹{totals.totalDeliveryCharge.toLocaleString()}</span>
              <span>Other Chg : ₹{totals.totalOtherCharge.toLocaleString()}</span>
              <span>GST : ₹{totals.totalGST.toLocaleString()}</span>
              <span>Advance : ₹{totals.totalAdvance.toLocaleString()}</span>
              <span>Total Amt : ₹{totals.totalAmount.toLocaleString()}</span>
              <span>Rebate : ₹{totals.totalRebate.toLocaleString()}</span>
              <span>Recd Amt : ₹{totals.totalRecdAmount.toLocaleString()}</span>
              <span>Due Amt : ₹{totals.totalDueAmount.toLocaleString()}</span>
              <span>Bill Amt : ₹{totals.totalBillAmount.toLocaleString()}</span>
              <span>TDS : ₹{totals.totalTDS.toLocaleString()}</span>
              <span>WCN : ₹{totals.totalWCN.toLocaleString()}</span>
              <span>Cash Recd : ₹{totals.totalCashRecd.toLocaleString()}</span>
              <span>Cheque Recd : ₹{totals.totalChequeRecd.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, ddrItems.length)} of {ddrItems.length} entries
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="h-7 text-xs">Previous</Button>
            <span className="px-3 py-1 text-xs bg-muted rounded-md">Page {currentPage} of {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="h-7 text-xs">Next</Button>
          </div>
        </div>
      )}

      {/* All Checkbox & Items Per Page */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <input type="checkbox" className="h-3.5 w-3.5" id="selectAll" />
          <Label htmlFor="selectAll" className="text-xs cursor-pointer">All</Label>
        </div>
        <div className="text-xs text-muted-foreground">
          items per page: {itemsPerPage}
        </div>
      </div>

      {/* Delivery Totals */}
      <div className="rounded-md border bg-blue-50 dark:bg-blue-950/20 p-3">
        <div className="flex flex-wrap justify-between gap-3 text-xs">
          <span className="font-semibold">Total Delivery : ₹{deliveryTotals.totalDelivery.toFixed(2)}</span>
          <span>Cash Delivery : ₹{deliveryTotals.cashDelivery.toFixed(2)}</span>
          <span>Cheque Delivery : ₹{deliveryTotals.chequeDelivery.toFixed(2)}</span>
          <span>Journal Delivery : ₹{deliveryTotals.journalDelivery.toFixed(2)}</span>
          <span>Mark for Bill Delivery : ₹{deliveryTotals.markForBillDelivery.toFixed(2)}</span>
          <span>Due GatePass Delivery : ₹{deliveryTotals.dueGatePassDelivery.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="flex flex-wrap justify-end gap-3 pt-2 border-t">
        <Button onClick={handleGenerate} size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700">
          <Save className="mr-1 h-3 w-3" />
          GENERATE
        </Button>
        <Button onClick={handleCancel} variant="destructive" size="sm" className="h-8 text-xs">
          <X className="mr-1 h-3 w-3" />
          CANCEL
        </Button>
        <Button onClick={handlePrint} variant="outline" size="sm" className="h-8 text-xs">
          <Printer className="mr-1 h-3 w-3" />
          PRINT
        </Button>
        <Button onClick={handleClear} variant="outline" size="sm" className="h-8 text-xs">
          <RefreshCw className="mr-1 h-3 w-3" />
          CLEAR
        </Button>
        <Button onClick={handleVoucherPrint} variant="outline" size="sm" className="h-8 text-xs">
          <FileText className="mr-1 h-3 w-3" />
          VOUCHER PRINT
        </Button>
      </div>
    </div>
  );
}