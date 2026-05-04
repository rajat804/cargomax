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
  Package,
  Weight,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface LongRouteManifest {
  id: number;
  manifestNo: string;
  manifestDateTime: Date;
  manifestTime: string;
  branch: string;
  toStation: string;
  deliveryLocation: string;
  vehicleType: string;
  vendor: string;
  vehicleNo: string;
  capacity: string;
  driver: string;
  mobileNo: string;
  consolidatedEwaybillNo: string;
  ewaybillDate: Date;
  loadedBy: string;
  estimateArrivalAtDestination: string;
  remarks: string;
  type: string;
  fromStation: string;
  arrivalAt: string;
  category: string;
  dispatchedPckgs: number;
  dispatchedWt: number;
  lhcNo: string;
  status: "active" | "cancelled";
}

interface StockItem {
  id: number;
  grNo: string;
  grDate: Date;
  origin: string;
  destination: string;
  consignor: string;
  consignee: string;
  toPay: string;
  paid: string;
  tbb: string;
  stockPckgs: number;
  selected: boolean;
}

// Options
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
];

const toStationOptions = [
  "U P BORDER A JH UP",
  "U P BORDER D BR GP",
  "U P BORDER B BR",
  "DELHI",
  "MUMBAI",
  "BANGALORE",
  "CHENNAI",
  "KOLKATA",
];

const vehicleTypeOptions = ["MARKET", "OWN", "CONTRACT", "HIRE"];
const vendorOptions = ["TATA MOTORS", "ASHOK LEYLAND", "MAHINDRA", "EICHER", "BHARAT BENZ"];
const driverOptions = ["Rajesh Kumar", "Suresh Singh", "Mahesh Sharma", "Ramesh Gupta", "Satish Verma"];
const loadedByOptions = ["Mohan Singh", "Ravi Kumar", "Amit Sharma", "Pradeep Verma"];

export default function LongRouteManifestGRL() {
  const [activeTab, setActiveTab] = useState<"entry" | "search" | "stock" | "cancelled">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [autoManifest, setAutoManifest] = useState<boolean>(true);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectAllBranch, setSelectAllBranch] = useState<boolean>(false);
  const [selectAllDestination, setSelectAllDestination] = useState<boolean>(false);

  // Entry Form State
  const [manifestNo, setManifestNo] = useState<string>("");
  const [manifestDateTime, setManifestDateTime] = useState<Date>(new Date());
  const [manifestTime, setManifestTime] = useState<string>("14:34");
  const [branch, setBranch] = useState<string>("");
  const [toStation, setToStation] = useState<string>("");
  const [deliveryLocation, setDeliveryLocation] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const [vendor, setVendor] = useState<string>("");
  const [vehicleNo, setVehicleNo] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [driver, setDriver] = useState<string>("");
  const [mobileNo, setMobileNo] = useState<string>("");
  const [consolidatedEwaybillNo, setConsolidatedEwaybillNo] = useState<string>("");
  const [ewaybillDate, setEwaybillDate] = useState<Date>(new Date());
  const [loadedBy, setLoadedBy] = useState<string>("");
  const [estimateArrivalAtDestination, setEstimateArrivalAtDestination] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");

  // Search State
  const [searchBranch, setSearchBranch] = useState<string>("");
  const [searchFromDate, setSearchFromDate] = useState<Date>(new Date());
  const [searchToDate, setSearchToDate] = useState<Date>(new Date());
  const [searchResults, setSearchResults] = useState<LongRouteManifest[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Stock of Despatch State
  const [stockBranch, setStockBranch] = useState<string>("");
  const [asOnDate, setAsOnDate] = useState<Date>(new Date());
  const [destination, setDestination] = useState<string>("");
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [stockCurrentPage, setStockCurrentPage] = useState<number>(1);
  const stockItemsPerPage: number = 10;

  // Cancel Tab State
  const [cancelBranch, setCancelBranch] = useState<string>("");
  const [cancelFromDate, setCancelFromDate] = useState<Date>(new Date());
  const [cancelToDate, setCancelToDate] = useState<Date>(new Date());
  const [cancelledResults, setCancelledResults] = useState<LongRouteManifest[]>([]);
  const [cancelCurrentPage, setCancelCurrentPage] = useState<number>(1);

  // Sample Data
  const sampleData: LongRouteManifest[] = [
    { id: 1, manifestNo: "LR001", manifestDateTime: new Date(), manifestTime: "10:30", branch: "DELHI", toStation: "MUMBAI", deliveryLocation: "MUMBAI GODOWN", vehicleType: "MARKET", vendor: "TATA MOTORS", vehicleNo: "UP14AB1234", capacity: "15 Ton", driver: "Rajesh Kumar", mobileNo: "9876543210", consolidatedEwaybillNo: "EWB001", ewaybillDate: new Date(), loadedBy: "Mohan Singh", estimateArrivalAtDestination: "05-05-2026", remarks: "", type: "LONG ROUTE", fromStation: "DELHI", arrivalAt: "MUMBAI", category: "MARKET", dispatchedPckgs: 50, dispatchedWt: 2500, lhcNo: "LHC001", status: "active" },
    { id: 2, manifestNo: "LR002", manifestDateTime: new Date(), manifestTime: "11:30", branch: "MUMBAI", toStation: "BANGALORE", deliveryLocation: "BANGALORE GODOWN", vehicleType: "OWN", vendor: "ASHOK LEYLAND", vehicleNo: "MH12AB5678", capacity: "20 Ton", driver: "Suresh Singh", mobileNo: "9876543211", consolidatedEwaybillNo: "EWB002", ewaybillDate: new Date(), loadedBy: "Ravi Kumar", estimateArrivalAtDestination: "06-05-2026", remarks: "", type: "LONG ROUTE", fromStation: "MUMBAI", arrivalAt: "BANGALORE", category: "OWN", dispatchedPckgs: 75, dispatchedWt: 3800, lhcNo: "LHC002", status: "cancelled" },
    { id: 3, manifestNo: "LR003", manifestDateTime: new Date(), manifestTime: "09:30", branch: "BANGALORE", toStation: "CHENNAI", deliveryLocation: "CHENNAI GODOWN", vehicleType: "CONTRACT", vendor: "MAHINDRA", vehicleNo: "KA34CD9012", capacity: "12 Ton", driver: "Mahesh Sharma", mobileNo: "9876543212", consolidatedEwaybillNo: "EWB003", ewaybillDate: new Date(), loadedBy: "Amit Sharma", estimateArrivalAtDestination: "07-05-2026", remarks: "", type: "LONG ROUTE", fromStation: "BANGALORE", arrivalAt: "CHENNAI", category: "CONTRACT", dispatchedPckgs: 40, dispatchedWt: 1800, lhcNo: "LHC003", status: "active" },
  ];

  const sampleStockItems: StockItem[] = [
    { id: 1, grNo: "GR001", grDate: new Date(), origin: "DELHI", destination: "MUMBAI", consignor: "M/s ABC Traders", consignee: "M/s XYZ Enterprises", toPay: "Yes", paid: "No", tbb: "TBB001", stockPckgs: 50, selected: false },
    { id: 2, grNo: "GR002", grDate: new Date(), origin: "DELHI", destination: "BANGALORE", consignor: "M/s PQR Ltd", consignee: "M/s LMN Corp", toPay: "No", paid: "Yes", tbb: "TBB002", stockPckgs: 30, selected: false },
    { id: 3, grNo: "GR003", grDate: new Date(), origin: "MUMBAI", destination: "CHENNAI", consignor: "M/s DEF Industries", consignee: "M/s GHI Enterprises", toPay: "Yes", paid: "No", tbb: "TBB003", stockPckgs: 25, selected: false },
  ];

  const [savedRecords, setSavedRecords] = useState<LongRouteManifest[]>(sampleData);

  const generateManifestNo = (): string => {
    const count = savedRecords.length + 1;
    return `LR${String(count).padStart(6, "0")}`;
  };

  const resetForm = () => {
    setManifestNo(generateManifestNo());
    setManifestDateTime(new Date());
    setManifestTime("14:34");
    setBranch("");
    setToStation("");
    setDeliveryLocation("");
    setVehicleType("");
    setVendor("");
    setVehicleNo("");
    setCapacity("");
    setDriver("");
    setMobileNo("");
    setConsolidatedEwaybillNo("");
    setEwaybillDate(new Date());
    setLoadedBy("");
    setEstimateArrivalAtDestination("");
    setRemarks("");
    setEditId(null);
  };

  const handleSave = () => {
    if (!branch) { alert("Please select Branch"); return; }
    if (!toStation) { alert("Please select To Station"); return; }
    if (!vehicleNo) { alert("Please enter Vehicle #"); return; }
    if (!driver) { alert("Please enter Driver"); return; }
    if (!loadedBy) { alert("Please enter Loaded By"); return; }

    setLoading(true);
    setTimeout(() => {
      const newRecord: LongRouteManifest = {
        id: editId || Date.now(),
        manifestNo: manifestNo,
        manifestDateTime: manifestDateTime,
        manifestTime: manifestTime,
        branch,
        toStation,
        deliveryLocation,
        vehicleType,
        vendor,
        vehicleNo,
        capacity,
        driver,
        mobileNo,
        consolidatedEwaybillNo,
        ewaybillDate,
        loadedBy,
        estimateArrivalAtDestination,
        remarks,
        type: "LONG ROUTE",
        fromStation: branch,
        arrivalAt: toStation,
        category: vehicleType,
        dispatchedPckgs: 0,
        dispatchedWt: 0,
        lhcNo: "",
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
    if (searchBranch && searchBranch !== "ALL") results = results.filter(r => r.branch === searchBranch);
    if (searchFromDate) results = results.filter(r => r.manifestDateTime >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.manifestDateTime <= searchToDate);
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleStockSearch = () => {
    let results = [...sampleStockItems];
    if (stockBranch && stockBranch !== "ALL") results = results.filter(r => r.origin === stockBranch);
    if (destination && destination !== "ALL") results = results.filter(r => r.destination === destination);
    setStockItems(results);
    setSelectAll(false);
    setStockCurrentPage(1);
  };

  const handleCancelSearch = () => {
    let results = savedRecords.filter(r => r.status === "cancelled");
    if (cancelBranch && cancelBranch !== "ALL") results = results.filter(r => r.branch === cancelBranch);
    if (cancelFromDate) results = results.filter(r => r.manifestDateTime >= cancelFromDate);
    if (cancelToDate) results = results.filter(r => r.manifestDateTime <= cancelToDate);
    setCancelledResults(results);
    setCancelCurrentPage(1);
  };

  const handleEdit = (record: LongRouteManifest) => {
    setEditId(record.id);
    setManifestNo(record.manifestNo);
    setManifestDateTime(record.manifestDateTime);
    setManifestTime(record.manifestTime);
    setBranch(record.branch);
    setToStation(record.toStation);
    setDeliveryLocation(record.deliveryLocation);
    setVehicleType(record.vehicleType);
    setVendor(record.vendor);
    setVehicleNo(record.vehicleNo);
    setCapacity(record.capacity);
    setDriver(record.driver);
    setMobileNo(record.mobileNo);
    setConsolidatedEwaybillNo(record.consolidatedEwaybillNo);
    setEwaybillDate(record.ewaybillDate);
    setLoadedBy(record.loadedBy);
    setEstimateArrivalAtDestination(record.estimateArrivalAtDestination);
    setRemarks(record.remarks);
    setActiveTab("entry");
  };

  const handlePrintLoadingTally = () => {
    alert("Loading tally printed successfully!");
  };

  const handleShowStock = () => {
    alert("Stock details shown!");
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setStockItems(stockItems.map(item => ({ ...item, selected: !selectAll })));
  };

  const handleSelectAllBranch = () => {
    setSelectAllBranch(!selectAllBranch);
    if (!selectAllBranch) setSearchBranch("ALL");
    else setSearchBranch("");
  };

  const handleSelectAllDestination = () => {
    setSelectAllDestination(!selectAllDestination);
    if (!selectAllDestination) setDestination("ALL");
    else setDestination("");
  };

  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const paginatedStockItems = stockItems.slice((stockCurrentPage - 1) * stockItemsPerPage, stockCurrentPage * stockItemsPerPage);
  const totalStockPages = Math.ceil(stockItems.length / stockItemsPerPage);
  const goToStockPage = (page: number) => setStockCurrentPage(Math.max(1, Math.min(page, totalStockPages)));

  const paginatedCancelled = cancelledResults.slice((cancelCurrentPage - 1) * itemsPerPage, cancelCurrentPage * itemsPerPage);
  const totalCancelPages = Math.ceil(cancelledResults.length / itemsPerPage);
  const goToCancelPage = (page: number) => setCancelCurrentPage(Math.max(1, Math.min(page, totalCancelPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">LONG ROUTE MANIFEST GRL</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b flex-wrap">
        <button onClick={() => { setActiveTab("entry"); resetForm(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Entry</button>
        <button onClick={() => { setActiveTab("search"); handleSearch(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Search</button>
        <button onClick={() => { setActiveTab("stock"); handleStockSearch(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "stock" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Stock of Despatch</button>
        <button onClick={() => { setActiveTab("cancelled"); handleCancelSearch(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "cancelled" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Cancel</button>
      </div>

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Manifest #</Label><div className="flex gap-2"><Input value={manifestNo} onChange={(e) => setManifestNo(e.target.value)} readOnly={autoManifest} className={cn("h-8 text-xs flex-1", autoManifest && "bg-muted")} /><div className="flex items-center gap-1"><input type="checkbox" checked={autoManifest} onChange={(e) => setAutoManifest(e.target.checked)} className="h-3.5 w-3.5" id="auto" /><Label htmlFor="auto" className="text-xs">Auto</Label></div></div></div>
            <div className="space-y-1"><Label className="text-xs">Manifest Date & Time <span className="text-red-500">*</span></Label><div className="flex gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(manifestDateTime, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={manifestDateTime} onSelect={(d) => d && setManifestDateTime(d)} /></PopoverContent></Popover><Input type="time" value={manifestTime} onChange={(e) => setManifestTime(e.target.value)} className="h-8 w-24 text-xs" /></div></div>
            <div className="space-y-1"><Label className="text-xs">Branch <span className="text-red-500">*</span></Label><Input value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="Enter Branch" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">To Station <span className="text-red-500">*</span></Label><Input value={toStation} onChange={(e) => setToStation(e.target.value)} placeholder="Enter To Station" className="h-8 text-xs" /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Delivery Location</Label><Input value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)} placeholder="Enter Delivery Location" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Vehicle Type</Label><Input value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} placeholder="Enter Vehicle Type" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Vendor</Label><Input value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="Enter Vendor" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Vehicle # <span className="text-red-500">*</span></Label><Input value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} placeholder="Enter Vehicle Number" className="h-8 text-xs" /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Capacity</Label><Input value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Enter Capacity" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Driver <span className="text-red-500">*</span></Label><Input value={driver} onChange={(e) => setDriver(e.target.value)} placeholder="Enter Driver Name" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Mobile #</Label><Input value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} placeholder="Enter Mobile Number" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Consolildated Ewaybill #</Label><Input value={consolidatedEwaybillNo} onChange={(e) => setConsolidatedEwaybillNo(e.target.value)} placeholder="Enter Ewaybill Number" className="h-8 text-xs" /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(ewaybillDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={ewaybillDate} onSelect={(d) => d && setEwaybillDate(d)} /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">Loaded By <span className="text-red-500">*</span></Label><Input value={loadedBy} onChange={(e) => setLoadedBy(e.target.value)} placeholder="Enter Loaded By" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Estimate Arrival At Destination</Label><Input value={estimateArrivalAtDestination} onChange={(e) => setEstimateArrivalAtDestination(e.target.value)} placeholder="Enter Estimate Arrival" className="h-8 text-xs" /></div>
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
            <div className="flex items-center gap-2"><input type="checkbox" checked={selectAllBranch} onChange={handleSelectAllBranch} className="h-3.5 w-3.5" id="allBranch" /><Label htmlFor="allBranch" className="text-xs">ALL</Label></div>
            <div className="space-y-1"><Label className="text-xs">Branch</Label><Input value={searchBranch} onChange={(e) => setSearchBranch(e.target.value)} placeholder="Enter Branch" className="h-8 w-40 text-xs" disabled={selectAllBranch} /></div>
            <div className="space-y-1"><Label className="text-xs">Period</Label><div className="flex gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-32 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchFromDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} /></PopoverContent></Popover><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-32 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchToDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} /></PopoverContent></Popover></div></div>
            <Button onClick={handleSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3 w-3" />SHOW MANIFEST</Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1300px]"><Table className="text-xs"><TableHeader><TableRow className="bg-muted/50"><TableHead>S#</TableHead><TableHead>Manifest#</TableHead><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>From Station</TableHead><TableHead>To Station</TableHead><TableHead>Arrival At</TableHead><TableHead>Vehicle #</TableHead><TableHead>Category</TableHead><TableHead>Dispatched Pckgs</TableHead><TableHead>Dispatched Wt</TableHead><TableHead>LHC #</TableHead><TableHead>Loaded By</TableHead><TableHead className="w-20">Action</TableHead></TableRow></TableHeader><TableBody>{paginatedResults.length === 0 ? (<TableRow><TableCell colSpan={14} className="text-center py-8">No records found</TableCell></TableRow>) : (paginatedResults.map((record, idx) => (<TableRow key={record.id}><TableCell>{(currentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell className="font-mono">{record.manifestNo}</TableCell><TableCell>{format(record.manifestDateTime, "dd-MM-yyyy")}</TableCell><TableCell>{record.type}</TableCell><TableCell>{record.fromStation}</TableCell><TableCell>{record.toStation}</TableCell><TableCell>{record.arrivalAt}</TableCell><TableCell>{record.vehicleNo}</TableCell><TableCell>{record.category}</TableCell><TableCell>{record.dispatchedPckgs}</TableCell><TableCell>{record.dispatchedWt}</TableCell><TableCell>{record.lhcNo || "-"}</TableCell><TableCell>{record.loadedBy}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => handleEdit(record)} className="h-6 w-6 p-0 text-blue-500"><Edit className="h-3 w-3" /></Button></TableCell></TableRow>)))}</TableBody></Table></div>
          </div>
          {totalPages > 1 && (<div className="flex justify-center gap-1"><Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1} className="h-7 text-xs">Previous</Button><span className="px-3 py-1 text-xs">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages} className="h-7 text-xs">Next</Button></div>)}
        </div>
      )}

      {/* Stock of Despatch Tab */}
      {activeTab === "stock" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-end p-4 border rounded-md bg-muted/20">
            <div className="flex items-center gap-2"><input type="checkbox" checked={selectAllBranch} onChange={handleSelectAllBranch} className="h-3.5 w-3.5" id="allStockBranch" /><Label htmlFor="allStockBranch" className="text-xs">ALL</Label></div>
            <div className="space-y-1"><Label className="text-xs">Branch</Label><Input value={stockBranch} onChange={(e) => setStockBranch(e.target.value)} placeholder="Enter Branch" className="h-8 w-40 text-xs" disabled={selectAllBranch} /></div>
            <div className="space-y-1"><Label className="text-xs">As On Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-32 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(asOnDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={asOnDate} onSelect={(d) => d && setAsOnDate(d)} /></PopoverContent></Popover></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={selectAllDestination} onChange={handleSelectAllDestination} className="h-3.5 w-3.5" id="allDestination" /><Label htmlFor="allDestination" className="text-xs">ALL</Label></div>
            <div className="space-y-1"><Label className="text-xs">Destination</Label><Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Enter Destination" className="h-8 w-40 text-xs" disabled={selectAllDestination} /></div>
            <Button onClick={handleStockSearch} size="sm" className="h-8 text-xs bg-blue-600"><Search className="mr-1 h-3 w-3" />SHOW STOCK</Button>
            <Button onClick={handlePrintLoadingTally} variant="outline" size="sm" className="h-8 text-xs"><Printer className="mr-1 h-3 w-3" />PRINT LOADING TALLY</Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1000px]"><Table className="text-xs"><TableHeader><TableRow className="bg-muted/50"><TableHead className="w-8"><input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="h-3 w-3" /></TableHead><TableHead>S#</TableHead><TableHead>GR#</TableHead><TableHead>GR Date</TableHead><TableHead>Origin</TableHead><TableHead>Destination</TableHead><TableHead>Consignor</TableHead><TableHead>Consignee</TableHead><TableHead>ToPay</TableHead><TableHead>Paid</TableHead><TableHead>TBB</TableHead><TableHead>Stock Pckgs</TableHead></TableRow></TableHeader><TableBody>{paginatedStockItems.length === 0 ? (<TableRow><TableCell colSpan={12} className="text-center py-8">No stock records found</TableCell></TableRow>) : (paginatedStockItems.map((item, idx) => (<TableRow key={item.id}><TableCell><input type="checkbox" checked={item.selected} onChange={() => setStockItems(stockItems.map(i => i.id === item.id ? { ...i, selected: !i.selected } : i))} className="h-3 w-3" /></TableCell><TableCell>{(stockCurrentPage-1)*stockItemsPerPage+idx+1}</TableCell><TableCell>{item.grNo}</TableCell><TableCell>{format(item.grDate, "dd-MM-yyyy")}</TableCell><TableCell>{item.origin}</TableCell><TableCell>{item.destination}</TableCell><TableCell>{item.consignor}</TableCell><TableCell>{item.consignee}</TableCell><TableCell>{item.toPay}</TableCell><TableCell>{item.paid}</TableCell><TableCell>{item.tbb}</TableCell><TableCell>{item.stockPckgs}</TableCell></TableRow>)))}</TableBody></Table></div>
          </div>
          {totalStockPages > 1 && (<div className="flex justify-center gap-1"><Button variant="outline" size="sm" onClick={() => goToStockPage(stockCurrentPage-1)} disabled={stockCurrentPage===1} className="h-7 text-xs">Previous</Button><span className="px-3 py-1 text-xs">Page {stockCurrentPage} of {totalStockPages}</span><Button variant="outline" size="sm" onClick={() => goToStockPage(stockCurrentPage+1)} disabled={stockCurrentPage===totalStockPages} className="h-7 text-xs">Next</Button></div>)}
        </div>
      )}

      {/* Cancel Tab */}
      {activeTab === "cancelled" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-end p-4 border rounded-md bg-muted/20">
            <div className="space-y-1"><Label className="text-xs">Branch</Label><Input value={cancelBranch} onChange={(e) => setCancelBranch(e.target.value)} placeholder="Enter Branch" className="h-8 w-40 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Period</Label><div className="flex gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-32 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(cancelFromDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={cancelFromDate} onSelect={(d) => d && setCancelFromDate(d)} /></PopoverContent></Popover><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-32 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(cancelToDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={cancelToDate} onSelect={(d) => d && setCancelToDate(d)} /></PopoverContent></Popover></div></div>
            <Button onClick={handleCancelSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3 w-3" />SHOW MANIFEST</Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1100px]"><Table className="text-xs"><TableHeader><TableRow className="bg-muted/50"><TableHead>S#</TableHead><TableHead>Manifest#</TableHead><TableHead>Date</TableHead><TableHead>From Station</TableHead><TableHead>To Station</TableHead><TableHead>Vehicle #</TableHead><TableHead>Dispatched Pckgs</TableHead><TableHead>Dispatched Wt</TableHead><TableHead>LHC #</TableHead><TableHead>Loaded By</TableHead></TableRow></TableHeader><TableBody>{paginatedCancelled.length === 0 ? (<TableRow><TableCell colSpan={10} className="text-center py-8">No cancelled records found</TableCell></TableRow>) : (paginatedCancelled.map((record, idx) => (<TableRow key={record.id}><TableCell>{(cancelCurrentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell className="font-mono">{record.manifestNo}</TableCell><TableCell>{format(record.manifestDateTime, "dd-MM-yyyy")}</TableCell><TableCell>{record.fromStation}</TableCell><TableCell>{record.toStation}</TableCell><TableCell>{record.vehicleNo}</TableCell><TableCell>{record.dispatchedPckgs}</TableCell><TableCell>{record.dispatchedWt}</TableCell><TableCell>{record.lhcNo || "-"}</TableCell><TableCell>{record.loadedBy}</TableCell></TableRow>)))}</TableBody></Table></div>
          </div>
          {totalCancelPages > 1 && (<div className="flex justify-center gap-1"><Button variant="outline" size="sm" onClick={() => goToCancelPage(cancelCurrentPage-1)} disabled={cancelCurrentPage===1} className="h-7 text-xs">Previous</Button><span className="px-3 py-1 text-xs">Page {cancelCurrentPage} of {totalCancelPages}</span><Button variant="outline" size="sm" onClick={() => goToCancelPage(cancelCurrentPage+1)} disabled={cancelCurrentPage===totalCancelPages} className="h-7 text-xs">Next</Button></div>)}
        </div>
      )}
    </div>
  );
}