"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CalendarIcon,
  Save,
  RefreshCw,
  Search,
  Printer,
  FileText,
  Eye,
  X,
  Check,
  Truck,
  MapPin,
  User,
  Phone,
  Building,
  Clock,
  Edit,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface ManifestRecord {
  id: number;
  manifestNo: string;
  date: Date;
  time: string;
  branch: string;
  toStation: string;
  modeName: string;
  driverName: string;
  driverMobile: string;
  vehicleVendor: string;
  loadingPerson: string;
  vendorCDNo: string;
  vendorCDDate: Date;
  remarks: string;
  lhcNo: string;
  modeCategory: string;
  noOfPckgs: number;
  grossWeight: number;
  vehicleNo: string;
  status: "active" | "cancelled";
}

// Options
const branchOptions = [
  "JAMNA BAZAR",
  "WAZIRPUR",
  "MANGOLPURI",
  "ZAKHIRA",
  "NEW LAJPAT RAI MARKET",
  "CORPORATE OFFICE",
  "DELHI",
  "MUMBAI",
];

const toStationOptions = [
  "U P BORDER A JH UP",
  "U P BORDER D BR GP",
  "U P BORDER B BR",
  "DELHI",
  "MUMBAI",
  "BANGALORE",
];

const modeNameOptions = [
  "DL01LA0837",
  "DL01LAD6175",
  "DL01LAJ4226",
  "DL01LAQ0859",
  "DL1AJ8908",
  "SURFACE",
  "AIR",
  "RAIL",
];

const driverNameOptions = [
  "Rajesh Kumar",
  "Suresh Singh",
  "Mahesh Sharma",
  "Ramesh Gupta",
  "Satish Verma",
];

const vehicleVendorOptions = [
  "TATA MOTORS",
  "ASHOK LEYLAND",
  "MAHINDRA",
  "EICHER",
  "BHARAT BENZ",
];

const loadingPersonOptions = [
  "Mohan Singh",
  "Ravi Kumar",
  "Amit Sharma",
  "Pradeep Verma",
];

export default function LocalManifest() {
  const [activeTab, setActiveTab] = useState<"entry" | "search" | "cancelled">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [autoManifest, setAutoManifest] = useState<boolean>(true);

  // Entry Form State - Manual Input
  const [branch, setBranch] = useState<string>("");
  const [toStation, setToStation] = useState<string>("");
  const [manifestNo, setManifestNo] = useState<string>("");
  const [despatchDate, setDespatchDate] = useState<Date>(new Date());
  const [despatchTime, setDespatchTime] = useState<string>("13:22");
  const [modeName, setModeName] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");
  const [driverMobile, setDriverMobile] = useState<string>("");
  const [vehicleVendor, setVehicleVendor] = useState<string>("");
  const [loadingPerson, setLoadingPerson] = useState<string>("");
  const [vendorCDNo, setVendorCDNo] = useState<string>("");
  const [vendorCDDate, setVendorCDDate] = useState<Date>(new Date());
  const [remarks, setRemarks] = useState<string>("");

  // Search State
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [searchResults, setSearchResults] = useState<ManifestRecord[]>([]);
  const [cancelledResults, setCancelledResults] = useState<ManifestRecord[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cancelledPage, setCancelledPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Update Destination Modal State
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedManifest, setSelectedManifest] = useState<ManifestRecord | null>(null);
  const [newDestination, setNewDestination] = useState<string>("");
  const [newVehicleNo, setNewVehicleNo] = useState<string>("");
  const [newDriver1, setNewDriver1] = useState<string>("");
  const [newDriver2, setNewDriver2] = useState<string>("");
  const [newManifestDateTime, setNewManifestDateTime] = useState<Date>(new Date());
  const [newManifestTime, setNewManifestTime] = useState<string>("13:15");
  const [newVendor, setNewVendor] = useState<string>("");

  // Sample Data
  const sampleData: ManifestRecord[] = [
    { id: 1, manifestNo: "I110001263", date: new Date(), time: "10:30", branch: "JAMNA BAZAR", toStation: "U P BORDER A JH UP", modeName: "DL01LA0837", driverName: "Rajesh Kumar", driverMobile: "9876543210", vehicleVendor: "TATA MOTORS", loadingPerson: "Mohan Singh", vendorCDNo: "CD001", vendorCDDate: new Date(), remarks: "", lhcNo: "", modeCategory: "SURFACE", noOfPckgs: 60, grossWeight: 3090, vehicleNo: "DL01LA0837", status: "active" },
    { id: 2, manifestNo: "I123000851", date: new Date(), time: "10:30", branch: "WAZIRPUR", toStation: "U P BORDER A JH UP", modeName: "DL01LA0837", driverName: "Suresh Singh", driverMobile: "9876543211", vehicleVendor: "ASHOK LEYLAND", loadingPerson: "Ravi Kumar", vendorCDNo: "CD002", vendorCDDate: new Date(), remarks: "", lhcNo: "", modeCategory: "SURFACE", noOfPckgs: 34, grossWeight: 1175, vehicleNo: "DL01LA0837", status: "active" },
    { id: 3, manifestNo: "I118002466", date: new Date(), time: "10:30", branch: "MANGOLPURI", toStation: "U P BORDER D BR GP", modeName: "DL01LAD6175", driverName: "Mahesh Sharma", driverMobile: "9876543212", vehicleVendor: "MAHINDRA", loadingPerson: "Amit Sharma", vendorCDNo: "CD003", vendorCDDate: new Date(), remarks: "", lhcNo: "", modeCategory: "SURFACE", noOfPckgs: 148, grossWeight: 4065, vehicleNo: "DL01LAD6175", status: "cancelled" },
    { id: 4, manifestNo: "I118002470", date: new Date(), time: "10:30", branch: "MANGOLPURI", toStation: "U P BORDER A JH UP", modeName: "DL01LAJ4226", driverName: "Ramesh Gupta", driverMobile: "9876543213", vehicleVendor: "EICHER", loadingPerson: "Pradeep Verma", vendorCDNo: "CD004", vendorCDDate: new Date(), remarks: "", lhcNo: "", modeCategory: "SURFACE", noOfPckgs: 123, grossWeight: 4220, vehicleNo: "DL01LAJ4226", status: "active" },
    { id: 5, manifestNo: "I124001896", date: new Date(), time: "10:30", branch: "ZAKHIRA", toStation: "U P BORDER A JH UP", modeName: "DL01LAJ4226", driverName: "Satish Verma", driverMobile: "9876543214", vehicleVendor: "BHARAT BENZ", loadingPerson: "Mohan Singh", vendorCDNo: "CD005", vendorCDDate: new Date(), remarks: "", lhcNo: "", modeCategory: "SURFACE", noOfPckgs: 105, grossWeight: 3430, vehicleNo: "DL01LAJ4226", status: "cancelled" },
    { id: 6, manifestNo: "I118002469", date: new Date(), time: "10:30", branch: "MANGOLPURI", toStation: "U P BORDER A JH UP", modeName: "DL01LAQ0859", driverName: "Vikash Singh", driverMobile: "9876543215", vehicleVendor: "TATA MOTORS", loadingPerson: "Ravi Kumar", vendorCDNo: "CD006", vendorCDDate: new Date(), remarks: "", lhcNo: "", modeCategory: "SURFACE", noOfPckgs: 130, grossWeight: 3600, vehicleNo: "DL01LAQ0859", status: "active" },
    { id: 7, manifestNo: "I124001897", date: new Date(), time: "10:30", branch: "ZAKHIRA", toStation: "U P BORDER A JH UP", modeName: "DL01LAQ0859", driverName: "Rajesh Kumar", driverMobile: "9876543216", vehicleVendor: "ASHOK LEYLAND", loadingPerson: "Amit Sharma", vendorCDNo: "CD007", vendorCDDate: new Date(), remarks: "", lhcNo: "", modeCategory: "SURFACE", noOfPckgs: 89, grossWeight: 3010, vehicleNo: "DL01LAQ0859", status: "active" },
    { id: 8, manifestNo: "I120000765", date: new Date(), time: "10:30", branch: "NEW LAJPAT RAI MARKET", toStation: "U P BORDER B BR", modeName: "DL1AJ8908", driverName: "Suresh Singh", driverMobile: "9876543217", vehicleVendor: "MAHINDRA", loadingPerson: "Pradeep Verma", vendorCDNo: "CD008", vendorCDDate: new Date(), remarks: "", lhcNo: "", modeCategory: "SURFACE", noOfPckgs: 13, grossWeight: 700, vehicleNo: "DL1AJ8908", status: "cancelled" },
    { id: 9, manifestNo: "I120000767", date: new Date(), time: "10:30", branch: "NEW LAJPAT RAI MARKET", toStation: "U P BORDER D BR GP", modeName: "DL1AJ8908", driverName: "Mahesh Sharma", driverMobile: "9876543218", vehicleVendor: "EICHER", loadingPerson: "Mohan Singh", vendorCDNo: "CD009", vendorCDDate: new Date(), remarks: "", lhcNo: "", modeCategory: "SURFACE", noOfPckgs: 0, grossWeight: 0, vehicleNo: "DL1AJ8908", status: "active" },
  ];

  const [savedRecords, setSavedRecords] = useState<ManifestRecord[]>(sampleData);

  const generateManifestNo = (): string => {
    const count = savedRecords.length + 1;
    return `I${String(count).padStart(9, "0")}`;
  };

  const resetForm = () => {
    setBranch("");
    setToStation("");
    setManifestNo(generateManifestNo());
    setDespatchDate(new Date());
    setDespatchTime("13:22");
    setModeName("");
    setDriverName("");
    setDriverMobile("");
    setVehicleVendor("");
    setLoadingPerson("");
    setVendorCDNo("");
    setVendorCDDate(new Date());
    setRemarks("");
    setEditId(null);
  };

  const handleSave = () => {
    if (!branch) { alert("Please select Branch"); return; }
    if (!toStation) { alert("Please select To Station"); return; }
    if (!modeName) { alert("Please enter Mode Name"); return; }
    if (!driverName) { alert("Please enter Driver Name"); return; }
    if (!loadingPerson) { alert("Please enter Loading Person"); return; }

    setLoading(true);
    setTimeout(() => {
      const newRecord: ManifestRecord = {
        id: editId || Date.now(),
        manifestNo: manifestNo,
        date: despatchDate,
        time: despatchTime,
        branch,
        toStation,
        modeName,
        driverName,
        driverMobile,
        vehicleVendor,
        loadingPerson,
        vendorCDNo,
        vendorCDDate,
        remarks,
        lhcNo: "",
        modeCategory: "SURFACE",
        noOfPckgs: 0,
        grossWeight: 0,
        vehicleNo: "",
        status: "active",
      };

      if (editId) {
        setSavedRecords(savedRecords.map(record => record.id === editId ? newRecord : record));
        alert("Record updated successfully!");
      } else {
        setSavedRecords([...savedRecords, newRecord]);
        alert("Record saved successfully!");
      }
      resetForm();
      setActiveTab("search");
      setLoading(false);
    }, 500);
  };

  const handleSearch = () => {
    let results = savedRecords.filter(r => r.status === "active");
    if (fromDate) results = results.filter(r => r.date >= fromDate);
    if (toDate) results = results.filter(r => r.date <= toDate);
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleCancelledSearch = () => {
    let results = savedRecords.filter(r => r.status === "cancelled");
    if (fromDate) results = results.filter(r => r.date >= fromDate);
    if (toDate) results = results.filter(r => r.date <= toDate);
    setCancelledResults(results);
    setCancelledPage(1);
  };

  const handleEdit = (record: ManifestRecord) => {
    setEditId(record.id);
    setBranch(record.branch);
    setToStation(record.toStation);
    setManifestNo(record.manifestNo);
    setDespatchDate(record.date);
    setDespatchTime(record.time);
    setModeName(record.modeName);
    setDriverName(record.driverName);
    setDriverMobile(record.driverMobile);
    setVehicleVendor(record.vehicleVendor);
    setLoadingPerson(record.loadingPerson);
    setVendorCDNo(record.vendorCDNo);
    setVendorCDDate(record.vendorCDDate);
    setRemarks(record.remarks);
    setActiveTab("entry");
  };

  const handlePrint = (record: ManifestRecord) => {
    alert(`Printing manifest: ${record.manifestNo}`);
  };

  const handleUpdateDestination = (record: ManifestRecord) => {
    setSelectedManifest(record);
    setNewDestination(record.toStation);
    setNewVehicleNo(record.vehicleNo || "");
    setNewDriver1(record.driverName);
    setNewDriver2("");
    setNewManifestDateTime(record.date);
    setNewManifestTime(record.time);
    setNewVendor(record.vehicleVendor);
    setIsUpdateModalOpen(true);
  };

  const handleSaveUpdateDestination = () => {
    if (!newDestination) { alert("Please enter New Destination"); return; }
    alert(`Manifest ${selectedManifest?.manifestNo} updated successfully!\nNew Destination: ${newDestination}\nNew Vehicle: ${newVehicleNo}\nNew Driver: ${newDriver1}`);
    setIsUpdateModalOpen(false);
  };

  const handleCancelManifest = (record: ManifestRecord) => {
    if (confirm(`Are you sure you want to cancel manifest ${record.manifestNo}?`)) {
      setSavedRecords(savedRecords.map(r => r.id === record.id ? { ...r, status: "cancelled" } : r));
      alert("Manifest cancelled successfully!");
      handleSearch();
    }
  };

  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const paginatedCancelledResults = cancelledResults.slice((cancelledPage - 1) * itemsPerPage, cancelledPage * itemsPerPage);
  const totalCancelledPages = Math.ceil(cancelledResults.length / itemsPerPage);
  const goToCancelledPage = (page: number) => setCancelledPage(Math.max(1, Math.min(page, totalCancelledPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">LOCAL MANIFEST</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button onClick={() => { setActiveTab("entry"); resetForm(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Entry</button>
        <button onClick={() => { setActiveTab("search"); handleSearch(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Search</button>
        <button onClick={() => { setActiveTab("cancelled"); handleCancelledSearch(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "cancelled" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Cancelled</button>
      </div>

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Branch <span className="text-red-500">*</span></Label><Input value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="Enter Branch" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">To Station <span className="text-red-500">*</span></Label><Input value={toStation} onChange={(e) => setToStation(e.target.value)} placeholder="Enter To Station" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Manifest #</Label><div className="flex gap-2"><Input value={manifestNo} onChange={(e) => setManifestNo(e.target.value)} readOnly={autoManifest} className={cn("h-8 text-xs flex-1", autoManifest && "bg-muted")} /><div className="flex items-center gap-1"><input type="checkbox" checked={autoManifest} onChange={(e) => setAutoManifest(e.target.checked)} className="h-3.5 w-3.5" id="auto" /><Label htmlFor="auto" className="text-xs">Auto</Label></div></div></div>
            <div className="space-y-1"><Label className="text-xs">Despatch Date/Time</Label><div className="flex gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(despatchDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={despatchDate} onSelect={(d) => d && setDespatchDate(d)} /></PopoverContent></Popover><Input type="time" value={despatchTime} onChange={(e) => setDespatchTime(e.target.value)} className="h-8 w-24 text-xs" /></div></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Mode Name <span className="text-red-500">*</span></Label><Input value={modeName} onChange={(e) => setModeName(e.target.value)} placeholder="Enter Mode Name" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Driver Name <span className="text-red-500">*</span></Label><Input value={driverName} onChange={(e) => setDriverName(e.target.value)} placeholder="Enter Driver Name" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Driver Mobile #</Label><Input value={driverMobile} onChange={(e) => setDriverMobile(e.target.value)} placeholder="Enter Mobile Number" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Vehicle Vendor</Label><Input value={vehicleVendor} onChange={(e) => setVehicleVendor(e.target.value)} placeholder="Enter Vehicle Vendor" className="h-8 text-xs" /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Loading Person <span className="text-red-500">*</span></Label><Input value={loadingPerson} onChange={(e) => setLoadingPerson(e.target.value)} placeholder="Enter Loading Person" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Vendor CD #</Label><Input value={vendorCDNo} onChange={(e) => setVendorCDNo(e.target.value)} placeholder="Enter Vendor CD #" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Vendor CD Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(vendorCDDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={vendorCDDate} onSelect={(d) => d && setVendorCDDate(d)} /></PopoverContent></Popover></div>
          </div>

          <div className="space-y-1"><Label className="text-xs">Remarks</Label><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="text-xs" placeholder="Enter remarks..." /></div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-green-600"><Save className="mr-1 h-3 w-3" />SAVE</Button>
            <Button onClick={resetForm} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
          </div>
        </div>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-end p-4 border rounded-md bg-muted/20">
            <div className="space-y-1"><Label className="text-xs">Period</Label><div className="flex gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-32 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(fromDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={fromDate} onSelect={(d) => d && setFromDate(d)} /></PopoverContent></Popover><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-32 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(toDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={toDate} onSelect={(d) => d && setToDate(d)} /></PopoverContent></Popover></div></div>
            <Button onClick={handleSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3 w-3" />SHOW MANIFEST</Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1200px]"><Table className="text-xs"><TableHeader><TableRow className="bg-muted/50"><TableHead>S#</TableHead><TableHead>Manifest#</TableHead><TableHead>Date</TableHead><TableHead>LHC#</TableHead><TableHead>Branch</TableHead><TableHead>To Station</TableHead><TableHead>Mode</TableHead><TableHead>Mode Category</TableHead><TableHead>No. Of Pckgs</TableHead><TableHead>Gross Weight</TableHead><TableHead className="w-32">Action</TableHead></TableRow></TableHeader><TableBody>{paginatedResults.length === 0 ? (<TableRow><TableCell colSpan={11} className="text-center py-8">No records found</TableCell></TableRow>) : (paginatedResults.map((record, idx) => (<TableRow key={record.id}><TableCell>{(currentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell className="font-mono">{record.manifestNo}</TableCell><TableCell>{format(record.date, "dd-MM-yyyy")}</TableCell><TableCell>{record.lhcNo || "-"}</TableCell><TableCell>{record.branch}</TableCell><TableCell>{record.toStation}</TableCell><TableCell>{record.modeName}</TableCell><TableCell>{record.modeCategory}</TableCell><TableCell>{record.noOfPckgs}</TableCell><TableCell>{record.grossWeight}</TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => handleEdit(record)} className="h-6 w-6 p-0 text-blue-500" title="Edit"><Edit className="h-3 w-3" /></Button><Button variant="ghost" size="sm" onClick={() => handlePrint(record)} className="h-6 w-6 p-0 text-green-500" title="Print"><Printer className="h-3 w-3" /></Button><Button variant="ghost" size="sm" onClick={() => handleUpdateDestination(record)} className="h-6 w-6 p-0 text-purple-500" title="Update Destination"><MapPin className="h-3 w-3" /></Button><Button variant="ghost" size="sm" onClick={() => handleCancelManifest(record)} className="h-6 w-6 p-0 text-red-500" title="Cancel"><X className="h-3 w-3" /></Button></div></TableCell></TableRow>)))}</TableBody></Table></div>
          </div>

          {totalPages > 1 && (<div className="flex justify-center gap-1"><Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1} className="h-7 text-xs">Previous</Button><span className="px-3 py-1 text-xs">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages} className="h-7 text-xs">Next</Button></div>)}
        </div>
      )}

      {/* Cancelled Tab */}
      {activeTab === "cancelled" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-end p-4 border rounded-md bg-muted/20">
            <div className="space-y-1"><Label className="text-xs">Period</Label><div className="flex gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-32 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(fromDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={fromDate} onSelect={(d) => d && setFromDate(d)} /></PopoverContent></Popover><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-32 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(toDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={toDate} onSelect={(d) => d && setToDate(d)} /></PopoverContent></Popover></div></div>
            <Button onClick={handleCancelledSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3 w-3" />SHOW MANIFEST</Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1000px]"><Table className="text-xs"><TableHeader><TableRow className="bg-muted/50"><TableHead>S#</TableHead><TableHead>Manifest#</TableHead><TableHead>Date</TableHead><TableHead>LHC#</TableHead><TableHead>Branch</TableHead><TableHead>To Station</TableHead><TableHead>Mode</TableHead><TableHead>Mode Category</TableHead><TableHead>No. Of Pckgs</TableHead><TableHead>Gross Weight</TableHead></TableRow></TableHeader><TableBody>{paginatedCancelledResults.length === 0 ? (<TableRow><TableCell colSpan={10} className="text-center py-8">No cancelled records found</TableCell></TableRow>) : (paginatedCancelledResults.map((record, idx) => (<TableRow key={record.id}><TableCell>{(cancelledPage-1)*itemsPerPage+idx+1}</TableCell><TableCell className="font-mono">{record.manifestNo}</TableCell><TableCell>{format(record.date, "dd-MM-yyyy")}</TableCell><TableCell>{record.lhcNo || "-"}</TableCell><TableCell>{record.branch}</TableCell><TableCell>{record.toStation}</TableCell><TableCell>{record.modeName}</TableCell><TableCell>{record.modeCategory}</TableCell><TableCell>{record.noOfPckgs}</TableCell><TableCell>{record.grossWeight}</TableCell></TableRow>)))}</TableBody></Table></div>
          </div>

          {totalCancelledPages > 1 && (<div className="flex justify-center gap-1"><Button variant="outline" size="sm" onClick={() => goToCancelledPage(cancelledPage-1)} disabled={cancelledPage===1} className="h-7 text-xs">Previous</Button><span className="px-3 py-1 text-xs">Page {cancelledPage} of {totalCancelledPages}</span><Button variant="outline" size="sm" onClick={() => goToCancelledPage(cancelledPage+1)} disabled={cancelledPage===totalCancelledPages} className="h-7 text-xs">Next</Button></div>)}
        </div>
      )}

      {/* Update Destination Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Update Destination - Manifest #: {selectedManifest?.manifestNo}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-3">
            <div className="space-y-1"><Label className="text-xs">Manifest Date/Time</Label><div className="flex gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(selectedManifest?.date || new Date(), "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={selectedManifest?.date} onSelect={(d) => d && setSelectedManifest(prev => prev ? { ...prev, date: d } : null)} /></PopoverContent></Popover><Input type="time" value={selectedManifest?.time || "13:15"} onChange={(e) => setSelectedManifest(prev => prev ? { ...prev, time: e.target.value } : null)} className="h-8 w-24 text-xs" /></div></div>
            <div className="space-y-1"><Label className="text-xs">Destination</Label><Input value={selectedManifest?.toStation || ""} readOnly className="h-8 text-xs bg-muted" /></div>
            <div className="space-y-1"><Label className="text-xs">Arrival At</Label><Input value={selectedManifest?.toStation || ""} readOnly className="h-8 text-xs bg-muted" /></div>
            <div className="space-y-1"><Label className="text-xs">Vehicle #</Label><Input value={selectedManifest?.vehicleNo || ""} readOnly className="h-8 text-xs bg-muted" /></div>
            <div className="space-y-1"><Label className="text-xs">Vendor</Label><Input value={selectedManifest?.vehicleVendor || ""} readOnly className="h-8 text-xs bg-muted" /></div>
            <div className="space-y-1"><Label className="text-xs">New Destination <span className="text-red-500">*</span></Label><Input value={newDestination} onChange={(e) => setNewDestination(e.target.value)} placeholder="Enter New Destination" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">New Vehicle #</Label><Input value={newVehicleNo} onChange={(e) => setNewVehicleNo(e.target.value)} placeholder="Enter New Vehicle #" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">New Driver 1</Label><Input value={newDriver1} onChange={(e) => setNewDriver1(e.target.value)} placeholder="Enter New Driver 1" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">New Driver 2</Label><Input value={newDriver2} onChange={(e) => setNewDriver2(e.target.value)} placeholder="Enter New Driver 2" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">New Manifest Date/Time <span className="text-red-500">*</span></Label><div className="flex gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(newManifestDateTime, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={newManifestDateTime} onSelect={(d) => d && setNewManifestDateTime(d)} /></PopoverContent></Popover><Input type="time" value={newManifestTime} onChange={(e) => setNewManifestTime(e.target.value)} className="h-8 w-24 text-xs" /></div></div>
            <div className="space-y-1"><Label className="text-xs">New Vendor</Label><Input value={newVendor} onChange={(e) => setNewVendor(e.target.value)} placeholder="Enter New Vendor" className="h-8 text-xs" /></div>
          </div>
          <DialogFooter className="gap-2"><Button variant="outline" size="sm" onClick={() => setIsUpdateModalOpen(false)}>CLOSE</Button><Button onClick={handleSaveUpdateDestination} size="sm" className="bg-green-600">SAVE</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}