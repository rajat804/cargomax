"use client";

import React, { useState, useRef } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Upload, FileSpreadsheet, Search, RefreshCw, Save, X, Check, AlertCircle, Eye, Download, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import * as XLSX from "xlsx";

interface DRRecord {
  id: number;
  grNo: string;
  grDate: Date;
  branch: string;
  origin: string;
  drNo: string;
  drDate: Date;
  pckgs: number;
  chargeWeight: number;
  freight: number;
  serviceTax: number;
  otherAmt: number;
  total: number;
  rebate: number;
  recdAmt: number;
  cartage: number;
  codCharges: number;
  delhiSTax: number;
  deliveryCharge: number;
  demurrage: number;
  enrouteCharge: number;
  entryTax: number;
  hamali: number;
  insuranceCharge: number;
  miscCharge: number;
  newMiscCharge: number;
  octroiCharge: number;
  octroiServiceCh: number;
  octroiServiceCharge: number;
  osc: number;
  oscCharges: number;
  otherCharge: number;
  otherChargeBooking: number;
  otherExpense: number;
  pfCharges: number;
  staticalCharge: number;
  surcharge: number;
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

const actionOptions = [
  "Update Charges",
  "Recalculate",
  "Reset",
  "Apply to All",
];

export default function DRChargeUpdate() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [drRecords, setDrRecords] = useState<DRRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const itemsPerPage: number = 10;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample data for demonstration
  const [sampleData] = useState<DRRecord[]>([
    {
      id: 1, grNo: "GR001", grDate: new Date("2026-04-25"), branch: "DELHI", origin: "DELHI",
      drNo: "DR001", drDate: new Date("2026-04-26"), pckgs: 10, chargeWeight: 500,
      freight: 12500, serviceTax: 2250, otherAmt: 500, total: 15250, rebate: 0, recdAmt: 10000,
      cartage: 0, codCharges: 0, delhiSTax: 0, deliveryCharge: 0, demurrage: 0, enrouteCharge: 0,
      entryTax: 0, hamali: 0, insuranceCharge: 0, miscCharge: 0, newMiscCharge: 0, octroiCharge: 0,
      octroiServiceCh: 0, octroiServiceCharge: 0, osc: 0, oscCharges: 0, otherCharge: 0,
      otherChargeBooking: 0, otherExpense: 0, pfCharges: 0, staticalCharge: 0, surcharge: 0,
    },
    {
      id: 2, grNo: "GR002", grDate: new Date("2026-04-26"), branch: "MUMBAI", origin: "MUMBAI",
      drNo: "DR002", drDate: new Date("2026-04-27"), pckgs: 15, chargeWeight: 750,
      freight: 16500, serviceTax: 2970, otherAmt: 700, total: 20170, rebate: 500, recdAmt: 15000,
      cartage: 0, codCharges: 0, delhiSTax: 0, deliveryCharge: 0, demurrage: 0, enrouteCharge: 0,
      entryTax: 0, hamali: 0, insuranceCharge: 0, miscCharge: 0, newMiscCharge: 0, octroiCharge: 0,
      octroiServiceCh: 0, octroiServiceCharge: 0, osc: 0, oscCharges: 0, otherCharge: 0,
      otherChargeBooking: 0, otherExpense: 0, pfCharges: 0, staticalCharge: 0, surcharge: 0,
    },
    {
      id: 3, grNo: "GR003", grDate: new Date("2026-04-27"), branch: "BANGALORE", origin: "BANGALORE",
      drNo: "DR003", drDate: new Date("2026-04-28"), pckgs: 8, chargeWeight: 400,
      freight: 10800, serviceTax: 1944, otherAmt: 300, total: 13044, rebate: 0, recdAmt: 13044,
      cartage: 0, codCharges: 0, delhiSTax: 0, deliveryCharge: 0, demurrage: 0, enrouteCharge: 0,
      entryTax: 0, hamali: 0, insuranceCharge: 0, miscCharge: 0, newMiscCharge: 0, octroiCharge: 0,
      octroiServiceCh: 0, octroiServiceCharge: 0, osc: 0, oscCharges: 0, otherCharge: 0,
      otherChargeBooking: 0, otherExpense: 0, pfCharges: 0, staticalCharge: 0, surcharge: 0,
    },
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleImport = () => {
    if (!selectedFile) {
      alert("Please select an XLS file first");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
      // Extract DR numbers from column A (skip header if exists)
      const drNumbers: string[] = [];
      const startRow = 0;
      for (let i = startRow; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];
        if (row && row[0] && row[0].toString().trim()) {
          drNumbers.push(row[0].toString().trim());
        }
      }

      if (drNumbers.length === 0) {
        alert("No DR numbers found in the file. Please ensure column A contains DR numbers.");
        setLoading(false);
        return;
      }

      // Filter sample data based on DR numbers
      const filteredRecords = sampleData.filter(record => 
        drNumbers.includes(record.drNo)
      );

      setDrRecords(filteredRecords);
      alert(`Imported ${filteredRecords.length} DR records successfully!`);
      setLoading(false);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleSearch = () => {
    if (!searchTerm) {
      setDrRecords(sampleData);
    } else {
      const filtered = sampleData.filter(record => 
        record.grNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.drNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.branch.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDrRecords(filtered);
    }
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    // If you want to update all records with selected action, implement here
  };

  const handleApplyAction = () => {
    if (!selectedAction) {
      alert("Please select an action");
      return;
    }
    if (drRecords.length === 0) {
      alert("No records to update. Please import or search data first.");
      return;
    }
    alert(`Action "${selectedAction}" applied to ${drRecords.length} records`);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setFileName("");
    setSelectedAction("");
    setDrRecords([]);
    setSearchTerm("");
    setSelectAll(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const paginatedResults = drRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(drRecords.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  // Calculate totals
  const totals = {
    totalFreight: drRecords.reduce((sum, r) => sum + r.freight, 0),
    totalServiceTax: drRecords.reduce((sum, r) => sum + r.serviceTax, 0),
    totalOtherAmt: drRecords.reduce((sum, r) => sum + r.otherAmt, 0),
    totalAmount: drRecords.reduce((sum, r) => sum + r.total, 0),
    totalRebate: drRecords.reduce((sum, r) => sum + r.rebate, 0),
    totalRecdAmt: drRecords.reduce((sum, r) => sum + r.recdAmt, 0),
  };

  const headerColumns = [
    "S #", "GR #", "GR Date", "Branch", "Origin", "DR #", "DR Date", "Pckgs",
    "Charge Weight", "Freight", "Service Tax", "Other Amt", "Total", "Rebate",
    "Recd Amt", "CARTAGE", "COD_CHARGES", "DELHI_S_TAX", "DELIVERY_CHARGE",
    "DEMURAGE", "ENROUTE_CHARGE", "ENTRY_TAX", "HAMALI", "INSURANCE_CHARGE",
    "MISC_CHARGE", "NEW_MISC_CHARGE", "OCTROI_CHARGE", "OCTROI_SERVICE_CH",
    "OCTROI_SERVICE_CHARGE", "OSC", "OSC_CHARGES", "OTHER_CHARGE",
    "OTHER_CHARGE_BOOKING", "OTHER_EXPENSE", "P_F_CHARGES", "STATICAL_CHARGE", "SURCHARGE"
  ];

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">DR CHARGE UPDATE</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* File Import Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 border rounded-md bg-muted/20">
        <div className="space-y-1">
          <Label className="text-xs font-medium">Select Xls File</Label>
          <div className="flex gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="h-8 text-xs flex-1 file:h-7 file:text-xs"
            />
          </div>
          {fileName && (
            <p className="text-[10px] text-green-600">Selected: {fileName}</p>
          )}
          <p className="text-[10px] text-muted-foreground">
            Xls file should have only one column DRNO in column 'A'
          </p>
        </div>

        <div className="flex items-end">
          <Button 
            onClick={handleImport} 
            size="sm" 
            className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            <Upload className="mr-1 h-3 w-3" />
            {loading ? "Importing..." : "Import"}
          </Button>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium">Select Action</Label>
          <div className="flex gap-2">
            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger className="h-8 text-xs flex-1">
                <SelectValue placeholder="Select Action" />
              </SelectTrigger>
              <SelectContent>
                {actionOptions.map((opt) => (
                  <SelectItem key={opt} value={opt} className="text-xs">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleApplyAction} size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700">
              <Save className="mr-1 h-3 w-3" />
              Apply
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by GR #, DR # or Branch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <Button onClick={handleSearch} size="sm" className="h-8 text-xs">
          <Search className="mr-1 h-3.5 w-3.5" />
          SEARCH
        </Button>
        <Button onClick={handleClear} variant="outline" size="sm" className="h-8 text-xs">
          <RefreshCw className="mr-1 h-3.5 w-3.5" />
          CLEAR
        </Button>
      </div>

      {/* Main Table */}
      <div className="rounded-md border overflow-x-auto">
        <div className="min-w-[1800px]">
          <Table className="text-[10px]">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="py-2 px-1 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="h-3 w-3"
                  />
                </TableHead>
                {headerColumns.map((col, idx) => (
                  <TableHead key={idx} className="py-2 px-1 whitespace-nowrap">
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={38} className="text-center py-8 text-muted-foreground">
                    No records to display. Please import XLS file or search to load data.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedResults.map((record, idx) => (
                  <TableRow key={record.id} className="hover:bg-muted/30">
                    <TableCell className="py-1.5 px-1 text-center">
                      <input type="checkbox" className="h-3 w-3" />
                    </TableCell>
                    <TableCell className="py-1.5 px-1 text-center">{(currentPage-1)*itemsPerPage+idx+1}</TableCell>
                    <TableCell className="py-1.5 px-1">{record.grNo}</TableCell>
                    <TableCell className="py-1.5 px-1 whitespace-nowrap">{format(record.grDate, "dd-MM-yyyy")}</TableCell>
                    <TableCell className="py-1.5 px-1">{record.branch}</TableCell>
                    <TableCell className="py-1.5 px-1">{record.origin}</TableCell>
                    <TableCell className="py-1.5 px-1">{record.drNo}</TableCell>
                    <TableCell className="py-1.5 px-1 whitespace-nowrap">{format(record.drDate, "dd-MM-yyyy")}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right">{record.pckgs}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right">{record.chargeWeight}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right">₹{record.freight.toLocaleString()}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right">₹{record.serviceTax.toLocaleString()}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right">₹{record.otherAmt.toLocaleString()}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right font-medium">₹{record.total.toLocaleString()}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right">₹{record.rebate.toLocaleString()}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right">₹{record.recdAmt.toLocaleString()}</TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.cartage} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.codCharges} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.delhiSTax} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.deliveryCharge} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.demurrage} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.enrouteCharge} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.entryTax} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.hamali} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.insuranceCharge} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.miscCharge} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.newMiscCharge} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.octroiCharge} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.octroiServiceCh} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.octroiServiceCharge} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.osc} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.oscCharges} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.otherCharge} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.otherChargeBooking} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.otherExpense} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.pfCharges} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.staticalCharge} className="h-7 w-20 text-[10px]" /></TableCell>
                    <TableCell className="py-1.5 px-1 text-right"><Input type="number" defaultValue={record.surcharge} className="h-7 w-20 text-[10px]" /></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Totals Row */}
      {drRecords.length > 0 && (
        <div className="rounded-md border bg-muted/30 p-2 overflow-x-auto">
          <div className="flex flex-wrap justify-between gap-3 text-[10px] md:text-xs font-medium">
            <span>Total Records: {drRecords.length}</span>
            <span>Total Freight: ₹{totals.totalFreight.toLocaleString()}</span>
            <span>Total Service Tax: ₹{totals.totalServiceTax.toLocaleString()}</span>
            <span>Total Other Amt: ₹{totals.totalOtherAmt.toLocaleString()}</span>
            <span>Total Amount: ₹{totals.totalAmount.toLocaleString()}</span>
            <span>Total Rebate: ₹{totals.totalRebate.toLocaleString()}</span>
            <span>Total Recd Amt: ₹{totals.totalRecdAmt.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, drRecords.length)} of {drRecords.length} entries
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
          <input type="checkbox" className="h-3.5 w-3.5" id="selectAllFooter" checked={selectAll} onChange={handleSelectAll} />
          <Label htmlFor="selectAllFooter" className="text-xs cursor-pointer">All</Label>
        </div>
        <div className="text-xs text-muted-foreground">
          items per page: {itemsPerPage}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-2 border-t">
        <Button onClick={handleApplyAction} size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700">
          <Save className="mr-1 h-3 w-3" />
          SAVE CHARGES
        </Button>
        <Button onClick={handleClear} variant="outline" size="sm" className="h-8 text-xs">
          <RefreshCw className="mr-1 h-3 w-3" />
          RESET
        </Button>
      </div>
    </div>
  );
}