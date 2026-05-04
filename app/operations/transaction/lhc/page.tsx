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
  Calculator,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface LorryChallanItem {
  id: number;
  challanNo: string;
  challanDate: Date;
  from: string;
  to: string;
  pckgs: number;
  actualWeight: number;
  chargeableWeight: number;
  ftl: string;
  perKgPckgs: string;
  rate: number;
  calcAmount: number;
  amount: number;
  remarks: string;
}

interface LorryHireChallan {
  id: number;
  branchName: string;
  despatchType: string;
  lhcNo: string;
  date: Date;
  modeType: string;
  modeName: string;
  owner: string;
  vendor: string;
  vehicleType: string;
  broker: string;
  route: string;
  pan: string;
  emptyLorryWeight: number;
  dharamKantaWeight: number;
  remarks: string;
  hireFreight: number;
  items: LorryChallanItem[];
  status: "active" | "cancelled";
}

interface PendingManifest {
  id: number;
  manifestNo: string;
  manifestDate: Date;
  modeName: string;
  destination: string;
  driverName: string;
  driverTelNo: string;
  noOfGR: number;
  noOfPckgs: number;
  actualWeight: number;
  chargeWeight: number;
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

const despatchTypeOptions = ["Outstation Challan", "Local Challan", "Intercity"];
const modeTypeOptions = ["Surface", "Air", "Rail", "Sea"];
const modeNameOptions = ["DL01LA0837", "DL01LAD6175", "DL01LAJ4226", "DL01LAQ0859", "SURFACE"];
const ownerOptions = ["Rajesh Kumar", "Suresh Singh", "Mahesh Sharma"];
const vendorOptions = ["TATA MOTORS", "ASHOK LEYLAND", "MAHINDRA", "EICHER"];
const vehicleTypeOptions = ["MARKET", "OWN", "CONTRACT", "HIRE"];
const brokerOptions = ["Mohan Broker", "Ravi Broker", "Amit Broker"];
const routeOptions = ["DELHI-MUMBAI", "MUMBAI-BANGALORE", "DELHI-CHENNAI", "DELHI-KOLKATA"];
const ftlOptions = ["Yes", "No"];
const perKgPckgsOptions = ["Per Kg", "Per Pckgs", "Per Ton"];

export default function LorryHireChallan() {
  const [activeTab, setActiveTab] = useState<"entry" | "search" | "pending" | "cancelled">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [autoLHC, setAutoLHC] = useState<boolean>(true);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Entry Form State
  const [branchName, setBranchName] = useState<string>("");
  const [despatchType, setDespatchType] = useState<string>("");
  const [lhcNo, setLhcNo] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [modeType, setModeType] = useState<string>("");
  const [modeName, setModeName] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [vendor, setVendor] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const [broker, setBroker] = useState<string>("");
  const [route, setRoute] = useState<string>("");
  const [pan, setPan] = useState<string>("");
  const [emptyLorryWeight, setEmptyLorryWeight] = useState<number>(0);
  const [dharamKantaWeight, setDharamKantaWeight] = useState<number>(0);
  const [remarks, setRemarks] = useState<string>("");
  const [hireFreight, setHireFreight] = useState<number>(0);
  const [items, setItems] = useState<LorryChallanItem[]>([
    { id: 1, challanNo: "", challanDate: new Date(), from: "", to: "", pckgs: 0, actualWeight: 0, chargeableWeight: 0, ftl: "", perKgPckgs: "", rate: 0, calcAmount: 0, amount: 0, remarks: "" }
  ]);

  // Search State
  const [searchFromDate, setSearchFromDate] = useState<Date>(new Date());
  const [searchToDate, setSearchToDate] = useState<Date>(new Date());
  const [searchResults, setSearchResults] = useState<LorryHireChallan[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Pending Manifest State
  const [pendingBranch, setPendingBranch] = useState<string>("");
  const [pendingToDate, setPendingToDate] = useState<Date>(new Date());
  const [pendingModeType, setPendingModeType] = useState<string>("Surface");
  const [pendingDespatchType, setPendingDespatchType] = useState<string>("Outstation Challan");
  const [pendingManifestFor, setPendingManifestFor] = useState<number>(90);
  const [pendingManifests, setPendingManifests] = useState<PendingManifest[]>([]);
  const [pendingCurrentPage, setPendingCurrentPage] = useState<number>(1);

  // Cancelled State
  const [cancelFromDate, setCancelFromDate] = useState<Date>(new Date());
  const [cancelToDate, setCancelToDate] = useState<Date>(new Date());
  const [cancelledResults, setCancelledResults] = useState<LorryHireChallan[]>([]);
  const [cancelCurrentPage, setCancelCurrentPage] = useState<number>(1);

  // Sample Data
  const sampleData: LorryHireChallan[] = [
    { id: 1, branchName: "DELHI", despatchType: "Outstation Challan", lhcNo: "LHC001", date: new Date(), modeType: "Surface", modeName: "DL01LA0837", owner: "Rajesh Kumar", vendor: "TATA MOTORS", vehicleType: "MARKET", broker: "Mohan Broker", route: "DELHI-MUMBAI", pan: "ABCDE1234F", emptyLorryWeight: 5000, dharamKantaWeight: 5200, remarks: "", hireFreight: 15000, items: [], status: "active" },
    { id: 2, branchName: "MUMBAI", despatchType: "Local Challan", lhcNo: "LHC002", date: new Date(), modeType: "Surface", modeName: "DL01LAD6175", owner: "Suresh Singh", vendor: "ASHOK LEYLAND", vehicleType: "OWN", broker: "Ravi Broker", route: "MUMBAI-BANGALORE", pan: "FGHIJ5678K", emptyLorryWeight: 6000, dharamKantaWeight: 6300, remarks: "", hireFreight: 18000, items: [], status: "cancelled" },
  ];

  const samplePendingManifests: PendingManifest[] = [
    { id: 1, manifestNo: "M001", manifestDate: new Date(), modeName: "DL01LA0837", destination: "MUMBAI", driverName: "Rajesh Kumar", driverTelNo: "9876543210", noOfGR: 5, noOfPckgs: 50, actualWeight: 2500, chargeWeight: 2600, selected: false },
    { id: 2, manifestNo: "M002", manifestDate: new Date(), modeName: "DL01LAD6175", destination: "BANGALORE", driverName: "Suresh Singh", driverTelNo: "9876543211", noOfGR: 8, noOfPckgs: 75, actualWeight: 3800, chargeWeight: 4000, selected: false },
    { id: 3, manifestNo: "M003", manifestDate: new Date(), modeName: "DL01LAJ4226", destination: "CHENNAI", driverName: "Mahesh Sharma", driverTelNo: "9876543212", noOfGR: 3, noOfPckgs: 30, actualWeight: 1500, chargeWeight: 1600, selected: false },
  ];

  const [savedRecords, setSavedRecords] = useState<LorryHireChallan[]>(sampleData);

  const generateLHCNo = (): string => {
    const count = savedRecords.length + 1;
    return `LHC${String(count).padStart(6, "0")}`;
  };

  const calculateAmount = (rate: number, chargeableWeight: number, perKgPckgs: string): number => {
    if (perKgPckgs === "Per Kg") return rate * chargeableWeight;
    if (perKgPckgs === "Per Ton") return rate * (chargeableWeight / 1000);
    return rate;
  };

  const updateItem = (id: number, field: keyof LorryChallanItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === "rate" || field === "chargeableWeight" || field === "perKgPckgs") {
          updated.calcAmount = calculateAmount(
            field === "rate" ? value : item.rate,
            field === "chargeableWeight" ? value : item.chargeableWeight,
            field === "perKgPckgs" ? value : item.perKgPckgs
          );
        }
        return updated;
      }
      return item;
    }));
  };

  const addItemRow = () => {
    const newItem: LorryChallanItem = {
      id: Date.now(),
      challanNo: "",
      challanDate: new Date(),
      from: "",
      to: "",
      pckgs: 0,
      actualWeight: 0,
      chargeableWeight: 0,
      ftl: "",
      perKgPckgs: "",
      rate: 0,
      calcAmount: 0,
      amount: 0,
      remarks: "",
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateHireFreight = () => {
    const total = items.reduce((sum, item) => sum + (item.amount || item.calcAmount), 0);
    setHireFreight(total);
  };

  const resetForm = () => {
    setBranchName("");
    setDespatchType("");
    setLhcNo(generateLHCNo());
    setDate(new Date());
    setModeType("");
    setModeName("");
    setOwner("");
    setVendor("");
    setVehicleType("");
    setBroker("");
    setRoute("");
    setPan("");
    setEmptyLorryWeight(0);
    setDharamKantaWeight(0);
    setRemarks("");
    setHireFreight(0);
    setItems([{ id: 1, challanNo: "", challanDate: new Date(), from: "", to: "", pckgs: 0, actualWeight: 0, chargeableWeight: 0, ftl: "", perKgPckgs: "", rate: 0, calcAmount: 0, amount: 0, remarks: "" }]);
    setEditId(null);
  };

  const handleSave = () => {
    if (!branchName) { alert("Please select Branch Name"); return; }
    if (!date) { alert("Please select Date"); return; }

    setLoading(true);
    setTimeout(() => {
      updateHireFreight();
      const newRecord: LorryHireChallan = {
        id: editId || Date.now(),
        branchName,
        despatchType,
        lhcNo,
        date,
        modeType,
        modeName,
        owner,
        vendor,
        vehicleType,
        broker,
        route,
        pan,
        emptyLorryWeight,
        dharamKantaWeight,
        remarks,
        hireFreight,
        items,
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
    if (searchFromDate) results = results.filter(r => r.date >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.date <= searchToDate);
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handlePendingSearch = () => {
    setPendingManifests(samplePendingManifests);
    setSelectAll(false);
    setPendingCurrentPage(1);
  };

  const handleCancelSearch = () => {
    let results = savedRecords.filter(r => r.status === "cancelled");
    if (cancelFromDate) results = results.filter(r => r.date >= cancelFromDate);
    if (cancelToDate) results = results.filter(r => r.date <= cancelToDate);
    setCancelledResults(results);
    setCancelCurrentPage(1);
  };

  const handleEdit = (record: LorryHireChallan) => {
    setEditId(record.id);
    setBranchName(record.branchName);
    setDespatchType(record.despatchType);
    setLhcNo(record.lhcNo);
    setDate(record.date);
    setModeType(record.modeType);
    setModeName(record.modeName);
    setOwner(record.owner);
    setVendor(record.vendor);
    setVehicleType(record.vehicleType);
    setBroker(record.broker);
    setRoute(record.route);
    setPan(record.pan);
    setEmptyLorryWeight(record.emptyLorryWeight);
    setDharamKantaWeight(record.dharamKantaWeight);
    setRemarks(record.remarks);
    setHireFreight(record.hireFreight);
    setItems(record.items.length ? record.items : [{ id: 1, challanNo: "", challanDate: new Date(), from: "", to: "", pckgs: 0, actualWeight: 0, chargeableWeight: 0, ftl: "", perKgPckgs: "", rate: 0, calcAmount: 0, amount: 0, remarks: "" }]);
    setActiveTab("entry");
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setPendingManifests(pendingManifests.map(item => ({ ...item, selected: !selectAll })));
  };

  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const paginatedPending = pendingManifests.slice((pendingCurrentPage - 1) * itemsPerPage, pendingCurrentPage * itemsPerPage);
  const totalPendingPages = Math.ceil(pendingManifests.length / itemsPerPage);
  const goToPendingPage = (page: number) => setPendingCurrentPage(Math.max(1, Math.min(page, totalPendingPages)));

  const paginatedCancelled = cancelledResults.slice((cancelCurrentPage - 1) * itemsPerPage, cancelCurrentPage * itemsPerPage);
  const totalCancelPages = Math.ceil(cancelledResults.length / itemsPerPage);
  const goToCancelPage = (page: number) => setCancelCurrentPage(Math.max(1, Math.min(page, totalCancelPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">LORRY HIRE CHALLAN</h1>
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
        <button onClick={() => { setActiveTab("pending"); handlePendingSearch(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "pending" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Pending Manifest</button>
        <button onClick={() => { setActiveTab("cancelled"); handleCancelSearch(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "cancelled" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Cancelled List</button>
      </div>

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Branch Name <span className="text-red-500">*</span></Label><Select value={branchName} onValueChange={setBranchName}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{branchOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Despatch Type</Label><Select value={despatchType} onValueChange={setDespatchType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{despatchTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">LHC #</Label><div className="flex gap-2"><Input value={lhcNo} onChange={(e) => setLhcNo(e.target.value)} readOnly={autoLHC} className={cn("h-8 text-xs flex-1", autoLHC && "bg-muted")} /><div className="flex items-center gap-1"><input type="checkbox" checked={autoLHC} onChange={(e) => setAutoLHC(e.target.checked)} className="h-3.5 w-3.5" id="auto" /><Label htmlFor="auto" className="text-xs">Auto</Label></div></div></div>
            <div className="space-y-1"><Label className="text-xs">Date <span className="text-red-500">*</span></Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(date, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} /></PopoverContent></Popover></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Mode Type</Label><Select value={modeType} onValueChange={setModeType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{modeTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Mode Name</Label><Select value={modeName} onValueChange={setModeName}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{modeNameOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Owner</Label><Select value={owner} onValueChange={setOwner}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{ownerOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Vendor</Label><Select value={vendor} onValueChange={setVendor}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{vendorOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Vehicle Type</Label><Select value={vehicleType} onValueChange={setVehicleType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{vehicleTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Broker</Label><Select value={broker} onValueChange={setBroker}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{brokerOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Route</Label><Select value={route} onValueChange={setRoute}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{routeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">PAN</Label><Input value={pan} onChange={(e) => setPan(e.target.value)} placeholder="Enter PAN" className="h-8 text-xs uppercase" /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Empty Lorry Weight</Label><Input type="number" value={emptyLorryWeight} onChange={(e) => setEmptyLorryWeight(Number(e.target.value))} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Dharam Kanta Weight</Label><Input type="number" value={dharamKantaWeight} onChange={(e) => setDharamKantaWeight(Number(e.target.value))} className="h-8 text-xs" /></div>
          </div>

          <div className="space-y-1"><Label className="text-xs">Remarks</Label><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="text-xs" placeholder="Enter remarks..." /></div>

          {/* Items Table */}
          <div className="rounded-md border">
            <div className="bg-muted/50 px-3 py-2 border-b flex justify-between items-center"><h3 className="text-sm font-semibold">Challan Details</h3><Button onClick={addItemRow} variant="ghost" size="sm" className="h-7 text-xs"><PlusCircle className="mr-1 h-3 w-3" />Add Row</Button></div>
            <div className="overflow-x-auto"><div className="min-w-[1400px]"><Table className="text-[10px]"><TableHeader><TableRow className="bg-muted/30"><TableHead>S.No</TableHead><TableHead>Challan#</TableHead><TableHead>Challan Date</TableHead><TableHead>From</TableHead><TableHead>To</TableHead><TableHead>Pckgs</TableHead><TableHead>Actual Weight</TableHead><TableHead>Chargeable Weight</TableHead><TableHead>FTL</TableHead><TableHead>Per Kg/Pckgs</TableHead><TableHead>Rate</TableHead><TableHead>Calc. Amount</TableHead><TableHead>Amount</TableHead><TableHead>Remarks</TableHead><TableHead className="w-8">Action</TableHead></TableRow></TableHeader><TableBody>{items.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell><Input value={item.challanNo} onChange={(e) => updateItem(item.id, "challanNo", e.target.value)} className="h-7 w-24 text-[10px]" /></TableCell><TableCell><Popover><PopoverTrigger asChild><Button variant="outline" className="h-7 w-28 text-[10px]"><CalendarIcon className="mr-1 h-2 w-2" />{format(item.challanDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={item.challanDate} onSelect={(d) => d && updateItem(item.id, "challanDate", d)} /></PopoverContent></Popover></TableCell><TableCell><Input value={item.from} onChange={(e) => updateItem(item.id, "from", e.target.value)} className="h-7 w-24 text-[10px]" /></TableCell><TableCell><Input value={item.to} onChange={(e) => updateItem(item.id, "to", e.target.value)} className="h-7 w-24 text-[10px]" /></TableCell><TableCell><Input type="number" value={item.pckgs} onChange={(e) => updateItem(item.id, "pckgs", Number(e.target.value))} className="h-7 w-20 text-[10px]" /></TableCell><TableCell><Input type="number" value={item.actualWeight} onChange={(e) => updateItem(item.id, "actualWeight", Number(e.target.value))} className="h-7 w-24 text-[10px]" step="0.01" /></TableCell><TableCell><Input type="number" value={item.chargeableWeight} onChange={(e) => updateItem(item.id, "chargeableWeight", Number(e.target.value))} className="h-7 w-24 text-[10px]" step="0.01" /></TableCell><TableCell><Select value={item.ftl} onValueChange={(v) => updateItem(item.id, "ftl", v)}><SelectTrigger className="h-7 w-20 text-[10px]"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{ftlOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></TableCell><TableCell><Select value={item.perKgPckgs} onValueChange={(v) => updateItem(item.id, "perKgPckgs", v)}><SelectTrigger className="h-7 w-24 text-[10px]"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{perKgPckgsOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></TableCell><TableCell><Input type="number" value={item.rate} onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))} className="h-7 w-20 text-[10px]" /></TableCell><TableCell className="font-mono">₹{item.calcAmount.toFixed(2)}</TableCell><TableCell><Input type="number" value={item.amount} onChange={(e) => updateItem(item.id, "amount", Number(e.target.value))} className="h-7 w-24 text-[10px]" /></TableCell><TableCell><Input value={item.remarks} onChange={(e) => updateItem(item.id, "remarks", e.target.value)} className="h-7 w-24 text-[10px]" /></TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell></TableRow>))}</TableBody></Table></div></div>
          </div>

          {/* Hire Freight */}
          <div className="flex justify-end items-center gap-3">
            <div className="space-y-1"><Label className="text-xs">Hire Freight</Label><Input type="number" value={hireFreight} onChange={(e) => setHireFreight(Number(e.target.value))} className="h-8 w-48 text-xs text-right font-bold" /></div>
            <Button onClick={updateHireFreight} variant="outline" size="sm" className="h-8 text-xs"><Calculator className="mr-1 h-3 w-3" />Update/Recalculate</Button>
          </div>

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
            <div className="space-y-1"><Label className="text-xs">From Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-32 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchFromDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">To Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-32 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchToDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} /></PopoverContent></Popover></div>
            <Button onClick={handleSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3 w-3" />SHOW FREIGHT MEMO</Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1300px]"><Table className="text-xs"><TableHeader><TableRow className="bg-muted/50"><TableHead>S#</TableHead><TableHead>LHC #</TableHead><TableHead>Date</TableHead><TableHead>Branch</TableHead><TableHead>Mode Type</TableHead><TableHead>Mode Name</TableHead><TableHead>Manifest Type</TableHead><TableHead>No. of Pckgs</TableHead><TableHead>Gross Wt</TableHead><TableHead>Charge Wt</TableHead><TableHead>LHC Amount</TableHead><TableHead>Advance</TableHead><TableHead>TDS Amount</TableHead><TableHead>Balance Payble</TableHead><TableHead>Voucher #</TableHead><TableHead>Fuel Slip #</TableHead><TableHead>Balance Payble At</TableHead><TableHead className="w-20">Action</TableHead></TableRow></TableHeader><TableBody>{paginatedResults.length === 0 ? (<TableRow><TableCell colSpan={18} className="text-center py-8">No records found</TableCell></TableRow>) : (paginatedResults.map((record, idx) => (<TableRow key={record.id}><TableCell>{(currentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell className="font-mono">{record.lhcNo}</TableCell><TableCell>{format(record.date, "dd-MM-yyyy")}</TableCell><TableCell>{record.branchName}</TableCell><TableCell>{record.modeType}</TableCell><TableCell>{record.modeName}</TableCell><TableCell>{record.despatchType}</TableCell><TableCell>-</TableCell><TableCell>-</TableCell><TableCell>-</TableCell><TableCell>₹{record.hireFreight}</TableCell><TableCell>-</TableCell><TableCell>-</TableCell><TableCell>-</TableCell><TableCell>-</TableCell><TableCell>-</TableCell><TableCell>-</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => handleEdit(record)} className="h-6 w-6 p-0 text-blue-500"><Edit className="h-3 w-3" /></Button></TableCell></TableRow>)))}</TableBody></Table></div>
          </div>
          {totalPages > 1 && (<div className="flex justify-center gap-1"><Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1} className="h-7 text-xs">Previous</Button><span className="px-3 py-1 text-xs">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages} className="h-7 text-xs">Next</Button></div>)}
        </div>
      )}

      {/* Pending Manifest Tab */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-end p-4 border rounded-md bg-muted/20">
            <div className="space-y-1"><Label className="text-xs">Branch <span className="text-red-500">*</span></Label><Select value={pendingBranch} onValueChange={setPendingBranch}><SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{branchOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">To Date <span className="text-red-500">*</span></Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-32 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(pendingToDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={pendingToDate} onSelect={(d) => d && setPendingToDate(d)} /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">Mode Type</Label><Select value={pendingModeType} onValueChange={setPendingModeType}><SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{modeTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Despatch Type <span className="text-red-500">*</span></Label><Select value={pendingDespatchType} onValueChange={setPendingDespatchType}><SelectTrigger className="h-8 w-48 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{despatchTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Manifest For <span className="text-red-500">*</span></Label><div className="flex gap-2"><Input type="number" value={pendingManifestFor} onChange={(e) => setPendingManifestFor(Number(e.target.value))} className="h-8 w-24 text-xs" /><span className="text-xs self-center">Day's</span></div></div>
            <Button onClick={handlePendingSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3 w-3" />SHOW PENDING MANIFEST</Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1000px]"><Table className="text-xs"><TableHeader><TableRow className="bg-muted/50"><TableHead className="w-8"><input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="h-3 w-3" /></TableHead><TableHead>S #</TableHead><TableHead>Manifest #</TableHead><TableHead>Manifest Date</TableHead><TableHead>Mode Name</TableHead><TableHead>Destination</TableHead><TableHead>Driver Name</TableHead><TableHead>Driver Tel #</TableHead><TableHead>No Of GR</TableHead><TableHead>No Of Pckgs</TableHead><TableHead>Actual Weight</TableHead><TableHead>Charge Weight</TableHead></TableRow></TableHeader><TableBody>{paginatedPending.length === 0 ? (<TableRow><TableCell colSpan={12} className="text-center py-8">No pending manifests found</TableCell></TableRow>) : (paginatedPending.map((item, idx) => (<TableRow key={item.id}><TableCell><input type="checkbox" checked={item.selected} onChange={() => setPendingManifests(pendingManifests.map(i => i.id === item.id ? { ...i, selected: !i.selected } : i))} className="h-3 w-3" /></TableCell><TableCell>{(pendingCurrentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell>{item.manifestNo}</TableCell><TableCell>{format(item.manifestDate, "dd-MM-yyyy")}</TableCell><TableCell>{item.modeName}</TableCell><TableCell>{item.destination}</TableCell><TableCell>{item.driverName}</TableCell><TableCell>{item.driverTelNo}</TableCell><TableCell>{item.noOfGR}</TableCell><TableCell>{item.noOfPckgs}</TableCell><TableCell>{item.actualWeight}</TableCell><TableCell>{item.chargeWeight}</TableCell></TableRow>)))}</TableBody></Table></div>
          </div>
          {totalPendingPages > 1 && (<div className="flex justify-center gap-1"><Button variant="outline" size="sm" onClick={() => goToPendingPage(pendingCurrentPage-1)} disabled={pendingCurrentPage===1} className="h-7 text-xs">Previous</Button><span className="px-3 py-1 text-xs">Page {pendingCurrentPage} of {totalPendingPages}</span><Button variant="outline" size="sm" onClick={() => goToPendingPage(pendingCurrentPage+1)} disabled={pendingCurrentPage===totalPendingPages} className="h-7 text-xs">Next</Button></div>)}
        </div>
      )}

      {/* Cancelled List Tab */}
      {activeTab === "cancelled" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-end p-4 border rounded-md bg-muted/20">
            <div className="space-y-1"><Label className="text-xs">From Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-32 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(cancelFromDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={cancelFromDate} onSelect={(d) => d && setCancelFromDate(d)} /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">To Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-32 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(cancelToDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={cancelToDate} onSelect={(d) => d && setCancelToDate(d)} /></PopoverContent></Popover></div>
            <Button onClick={handleCancelSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3 w-3" />SHOW</Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1200px]"><Table className="text-xs"><TableHeader><TableRow className="bg-muted/50"><TableHead>S#</TableHead><TableHead>LHC #</TableHead><TableHead>Date</TableHead><TableHead>Branch</TableHead><TableHead>Mode Type</TableHead><TableHead>Mode Name</TableHead><TableHead>Manifest Type</TableHead><TableHead>No. of Pckgs</TableHead><TableHead>Gross Wt</TableHead><TableHead>Charge Wt</TableHead><TableHead>LHC Amount</TableHead><TableHead>Advance</TableHead><TableHead>TDS Amount</TableHead><TableHead>Balance Payble</TableHead><TableHead>Voucher #</TableHead><TableHead>Fuel Slip #</TableHead><TableHead>Balance Payble At</TableHead></TableRow></TableHeader><TableBody>{paginatedCancelled.length === 0 ? (<TableRow><TableCell colSpan={17} className="text-center py-8">No cancelled records found</TableCell></TableRow>) : (paginatedCancelled.map((record, idx) => (<TableRow key={record.id}><TableCell>{(cancelCurrentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell className="font-mono">{record.lhcNo}</TableCell><TableCell>{format(record.date, "dd-MM-yyyy")}</TableCell><TableCell>{record.branchName}</TableCell><TableCell>{record.modeType}</TableCell><TableCell>{record.modeName}</TableCell><TableCell>{record.despatchType}</TableCell><TableCell>-</TableCell><TableCell>-</TableCell><TableCell>-</TableCell><TableCell>₹{record.hireFreight}</TableCell><TableCell>-</TableCell><TableCell>-</TableCell><TableCell>-</TableCell><TableCell>-</TableCell><TableCell>-</TableCell><TableCell>-</TableCell></TableRow>)))}</TableBody></Table></div>
          </div>
          {totalCancelPages > 1 && (<div className="flex justify-center gap-1"><Button variant="outline" size="sm" onClick={() => goToCancelPage(cancelCurrentPage-1)} disabled={cancelCurrentPage===1} className="h-7 text-xs">Previous</Button><span className="px-3 py-1 text-xs">Page {cancelCurrentPage} of {totalCancelPages}</span><Button variant="outline" size="sm" onClick={() => goToCancelPage(cancelCurrentPage+1)} disabled={cancelCurrentPage===totalCancelPages} className="h-7 text-xs">Next</Button></div>)}
        </div>
      )}
    </div>
  );
}