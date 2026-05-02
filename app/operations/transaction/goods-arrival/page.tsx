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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Upload,
  Download,
  Truck,
  Package,
  MapPin,
  Building,
  Phone,
  User,
  Clock,
  AlertCircle,
  PlusCircle,
  Trash2,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface ArrivalRecord {
  id: number;
  manifestNo: string;
  arrivalDate: Date;
  despatchFrom: string;
  despatchTo: string;
  divisionName: string;
  modeName: string;
  category: string;
  arrivalStatus: string;
  arrivalNo: string;
  lhcNo: string;
  aWeight: number;
}

interface PendingArrivalRecord {
  id: number;
  manifestNo: string;
  date: Date;
  despatchFrom: string;
  despatchTo: string;
  divisionName: string;
  modeName: string;
  category: string;
  arrivalStatus: string;
  arrivalDate: Date;
  lhcNo: string;
  vehicleNo: string;
  driverName: string;
}

interface GRItem {
  id: number;
  grNo: string;
  grDate: Date;
  origin: string;
  destination: string;
  consignor: string;
  consignee: string;
  cargoType: string;
  despPckgs: number;
  despWt: number;
  receivePckgs: number;
  receiveWt: number;
  damagePcs: number;
  damageReason: string;
  short: number;
  excess: number;
  godown: string;
  remarks: string;
}

interface DamageClaim {
  id: number;
  grNo: string;
  despatchPckgs: number;
  despatchWeight: number;
  receivedPckgs: number;
  receivedWeight: number;
  damagePckgs: number;
  claimAmt: number;
  damageReason: string;
  uploadDocument: string;
  documentFile: string;
}

// Options
const branchOptions = ["ALL", "CORPORATE OFFICE", "DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA"];
const despatchFromOptions = ["ALL", "U P BORDER A JH UP", "U P BORDER D BR GP", "DELHI", "MUMBAI"];
const manifestTypeOptions = ["OUT STATION", "LOCAL", "INCOMING"];
const modeTypeOptions = ["SURFACE", "AIR", "RAIL", "SEA"];
const categoryOptions = ["MARKET", "OWN", "CONTRACT"];
const godownOptions = ["Godown A", "Godown B", "Godown C", "Warehouse 1", "Warehouse 2"];
const cargoTypeOptions = ["General", "Fragile", "Hazardous", "Perishable", "Liquid"];
const damageReasonOptions = ["Transit Damage", "Handling Damage", "Water Damage", "Theft", "Shortage"];

export default function GoodsArrival() {
  const [activeMainTab, setActiveMainTab] = useState<"arrived" | "pending" | "entry">("arrived");
  const [activeEntryTab, setActiveEntryTab] = useState<"arrival" | "damage">("arrival");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Arrived Tab Filters
  const [arrivedBranch, setArrivedBranch] = useState<string>("ALL");
  const [arrivedDespatchFrom, setArrivedDespatchFrom] = useState<string>("ALL");
  const [arrivedManifestType, setArrivedManifestType] = useState<string>("OUT STATION");
  const [arrivedModeType, setArrivedModeType] = useState<string>("SURFACE");
  const [arrivedFromDate, setArrivedFromDate] = useState<Date>(new Date());
  const [arrivedToDate, setArrivedToDate] = useState<Date>(new Date());
  const [arrivedSearchTerm, setArrivedSearchTerm] = useState<string>("");
  const [arrivedResults, setArrivedResults] = useState<ArrivalRecord[]>([]);

  // Pending Arrival Tab Filters
  const [pendingBranch, setPendingBranch] = useState<string>("ALL");
  const [pendingDespatchFrom, setPendingDespatchFrom] = useState<string>("ALL");
  const [pendingManifestType, setPendingManifestType] = useState<string>("OUT STATION");
  const [pendingModeType, setPendingModeType] = useState<string>("SURFACE");
  const [pendingFromDate, setPendingFromDate] = useState<Date>(new Date());
  const [pendingToDate, setPendingToDate] = useState<Date>(new Date());
  const [pendingVehicleNo, setPendingVehicleNo] = useState<string>("ALL");
  const [pendingDriverName, setPendingDriverName] = useState<string>("ALL");
  const [pendingResults, setPendingResults] = useState<PendingArrivalRecord[]>([]);

  // Entry Tab State
  const [branch, setBranch] = useState<string>("");
  const [selectGodown, setSelectGodown] = useState<string>("");
  const [manifestNo, setManifestNo] = useState<string>("");
  const [despatchOn, setDespatchOn] = useState<Date>(new Date());
  const [despatchTime, setDespatchTime] = useState<string>("");
  const [fromStation, setFromStation] = useState<string>("");
  const [modeType, setModeType] = useState<string>("");
  const [modeName, setModeName] = useState<string>("");
  const [driver, setDriver] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [unloadingPerson, setUnloadingPerson] = useState<string>("");
  const [serArrivalNo, setSerArrivalNo] = useState<string>("");
  const [autoArrival, setAutoArrival] = useState<boolean>(true);
  const [receiveDate, setReceiveDate] = useState<Date>(new Date());
  const [receiveTime, setReceiveTime] = useState<string>("");
  const [unloadingHours, setUnloadingHours] = useState<number>(0);
  const [unloadingMinutes, setUnloadingMinutes] = useState<number>(0);
  const [route, setRoute] = useState<string>("");
  const [tat, setTat] = useState<number>(0);
  const [scheduleArrivalDateTime, setScheduleArrivalDateTime] = useState<Date>(new Date());
  const [vehicleQueNo, setVehicleQueNo] = useState<string>("");
  const [vehicleArrivalDateTime, setVehicleArrivalDateTime] = useState<Date>(new Date());
  const [deviation, setDeviation] = useState<string>("");
  const [unloadingDateTime, setUnloadingDateTime] = useState<Date>(new Date());
  const [sealNo, setSealNo] = useState<string>("");
  const [sealOk, setSealOk] = useState<boolean>(true);
  const [dharamKantaWeight, setDharamKantaWeight] = useState<number>(0);
  const [remarks, setRemarks] = useState<string>("");
  const [excessReceiptWithoutGR, setExcessReceiptWithoutGR] = useState<boolean>(false);

  // GR Items
  const [grItems, setGrItems] = useState<GRItem[]>([
    { id: 1, grNo: "", grDate: new Date(), origin: "", destination: "", consignor: "", consignee: "", cargoType: "", despPckgs: 0, despWt: 0, receivePckgs: 0, receiveWt: 0, damagePcs: 0, damageReason: "", short: 0, excess: 0, godown: "", remarks: "" }
  ]);

  // Damage Claims
  const [damageClaims, setDamageClaims] = useState<DamageClaim[]>([
    { id: 1, grNo: "", despatchPckgs: 0, despatchWeight: 0, receivedPckgs: 0, receivedWeight: 0, damagePckgs: 0, claimAmt: 0, damageReason: "", uploadDocument: "", documentFile: "" }
  ]);

  // Totals
  const [manifestTotals, setManifestTotals] = useState({
    noOfGR: 0,
    totalPckgs: 0,
    totalWeight: 0
  });

  const [arrivalTotals, setArrivalTotals] = useState({
    noOfGR: 0,
    totalPckgs: 0,
    totalWeight: 0,
    damagePckgs: 0,
    totalShort: 0,
    totalExcess: 0
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample Data
  const sampleArrivedData: ArrivalRecord[] = [
    { id: 1, manifestNo: "M001", arrivalDate: new Date(), despatchFrom: "DELHI", despatchTo: "MUMBAI", divisionName: "North", modeName: "Road", category: "MARKET", arrivalStatus: "Arrived", arrivalNo: "AR001", lhcNo: "LHC001", aWeight: 2500 },
    { id: 2, manifestNo: "M002", arrivalDate: new Date(), despatchFrom: "MUMBAI", despatchTo: "DELHI", divisionName: "West", modeName: "Road", category: "OWN", arrivalStatus: "Arrived", arrivalNo: "AR002", lhcNo: "LHC002", aWeight: 3200 },
  ];

  const samplePendingData: PendingArrivalRecord[] = [
    { id: 1, manifestNo: "O302008874", date: new Date(), despatchFrom: "U P BORDER A JH UP", despatchTo: "JAUNPUR", divisionName: "", modeName: "", category: "MARKET", arrivalStatus: "PENDING", arrivalDate: new Date(), lhcNo: "", vehicleNo: "UP21CN8635", driverName: "Rajesh Kumar" },
    { id: 2, manifestNo: "O302008875", date: new Date(), despatchFrom: "U P BORDER A JH UP", despatchTo: "MACHHALISHAR", divisionName: "", modeName: "", category: "MARKET", arrivalStatus: "PENDING", arrivalDate: new Date(), lhcNo: "", vehicleNo: "UP21CN8635", driverName: "Suresh Singh" },
    { id: 3, manifestNo: "O302008872", date: new Date(), despatchFrom: "U P BORDER A JH UP", despatchTo: "VARANASI", divisionName: "", modeName: "", category: "MARKET", arrivalStatus: "PENDING", arrivalDate: new Date(), lhcNo: "", vehicleNo: "UP21CN8635", driverName: "Mahesh Sharma" },
    { id: 4, manifestNo: "O302008873", date: new Date(), despatchFrom: "U P BORDER A JH UP", despatchTo: "VARANASI", divisionName: "", modeName: "", category: "MARKET", arrivalStatus: "PENDING", arrivalDate: new Date(), lhcNo: "", vehicleNo: "UP21CN8635", driverName: "Ramesh Gupta" },
    { id: 5, manifestNo: "O330005537", date: new Date(), despatchFrom: "U P BORDER D BR GP", despatchTo: "DEHRI ON SON", divisionName: "", modeName: "", category: "MARKET", arrivalStatus: "PENDING", arrivalDate: new Date(), lhcNo: "", vehicleNo: "UP21CT6464", driverName: "Satish Verma" },
    { id: 6, manifestNo: "O330005536", date: new Date(), despatchFrom: "U P BORDER D BR GP", despatchTo: "PATNA", divisionName: "", modeName: "", category: "MARKET", arrivalStatus: "PENDING", arrivalDate: new Date(), lhcNo: "", vehicleNo: "UP21FT8408", driverName: "Vikash Singh" },
  ];

  // Handlers
  const handleArrivedSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setArrivedResults(sampleArrivedData);
      setLoading(false);
    }, 500);
  };

  const handlePendingSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setPendingResults(samplePendingData);
      setLoading(false);
    }, 500);
  };

  const handleSelectPending = (record: PendingArrivalRecord) => {
    // Load data into entry tab
    setManifestNo(record.manifestNo);
    setFromStation(record.despatchFrom);
    // setDestination(record.despatchTo);
    setDriver(record.driverName);
    // setVehicleNo(record.vehicleNo);
    setActiveMainTab("entry");
  };

  const handlePrintManifest = () => {
    alert("Print manifest initiated!");
  };

  const handleUploadSheet = () => {
    alert("Upload sheet dialog opened!");
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const addGRItem = () => {
    const newItem: GRItem = {
      id: Date.now(),
      grNo: "", grDate: new Date(), origin: "", destination: "", consignor: "", consignee: "",
      cargoType: "", despPckgs: 0, despWt: 0, receivePckgs: 0, receiveWt: 0, damagePcs: 0,
      damageReason: "", short: 0, excess: 0, godown: "", remarks: ""
    };
    setGrItems([...grItems, newItem]);
  };

  const updateGRItem = (id: number, field: keyof GRItem, value: any) => {
    setGrItems(grItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeGRItem = (id: number) => {
    if (grItems.length > 1) {
      setGrItems(grItems.filter(item => item.id !== id));
    }
  };

  const addDamageClaim = () => {
    const newClaim: DamageClaim = {
      id: Date.now(),
      grNo: "", despatchPckgs: 0, despatchWeight: 0, receivedPckgs: 0, receivedWeight: 0,
      damagePckgs: 0, claimAmt: 0, damageReason: "", uploadDocument: "", documentFile: ""
    };
    setDamageClaims([...damageClaims, newClaim]);
  };

  const updateDamageClaim = (id: number, field: keyof DamageClaim, value: any) => {
    setDamageClaims(claims => claims.map(claim => claim.id === id ? { ...claim, [field]: value } : claim));
  };

  const removeDamageClaim = (id: number) => {
    if (damageClaims.length > 1) {
      setDamageClaims(damageClaims.filter(claim => claim.id !== id));
    }
  };

  const calculateTotals = () => {
    const manifestTotal = {
      noOfGR: grItems.length,
      totalPckgs: grItems.reduce((sum, item) => sum + item.despPckgs, 0),
      totalWeight: grItems.reduce((sum, item) => sum + item.despWt, 0)
    };
    setManifestTotals(manifestTotal);

    const arrivalTotal = {
      noOfGR: grItems.length,
      totalPckgs: grItems.reduce((sum, item) => sum + item.receivePckgs, 0),
      totalWeight: grItems.reduce((sum, item) => sum + item.receiveWt, 0),
      damagePckgs: grItems.reduce((sum, item) => sum + item.damagePcs, 0),
      totalShort: grItems.reduce((sum, item) => sum + item.short, 0),
      totalExcess: grItems.reduce((sum, item) => sum + item.excess, 0)
    };
    setArrivalTotals(arrivalTotal);
  };

  const handleSave = () => {
    calculateTotals();
    alert("Goods arrival saved successfully!");
  };

  const handleClear = () => {
    setBranch("");
    setSelectGodown("");
    setManifestNo("");
    setFromStation("");
    setDriver("");
    setMobile("");
    setUnloadingPerson("");
    setSerArrivalNo("");
    setRemarks("");
    setGrItems([{ id: 1, grNo: "", grDate: new Date(), origin: "", destination: "", consignor: "", consignee: "", cargoType: "", despPckgs: 0, despWt: 0, receivePckgs: 0, receiveWt: 0, damagePcs: 0, damageReason: "", short: 0, excess: 0, godown: "", remarks: "" }]);
    setDamageClaims([{ id: 1, grNo: "", despatchPckgs: 0, despatchWeight: 0, receivedPckgs: 0, receivedWeight: 0, damagePckgs: 0, claimAmt: 0, damageReason: "", uploadDocument: "", documentFile: "" }]);
  };

  const paginatedResults = pendingResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(pendingResults.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">GOODS ARRIVAL</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeMainTab} onValueChange={(v) => setActiveMainTab(v as "arrived" | "pending" | "entry")} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="arrived" className="text-xs">Arrived</TabsTrigger>
          <TabsTrigger value="pending" className="text-xs">Pending Arrival</TabsTrigger>
          <TabsTrigger value="entry" className="text-xs">Entry</TabsTrigger>
        </TabsList>

        {/* Arrived Tab */}
        <TabsContent value="arrived" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 border rounded-md bg-muted/20">
            <div className="space-y-1"><Label className="text-xs">Branch *</Label><Select value={arrivedBranch} onValueChange={setArrivedBranch}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{branchOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Despatched From</Label><Select value={arrivedDespatchFrom} onValueChange={setArrivedDespatchFrom}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{despatchFromOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Manifest Type</Label><Select value={arrivedManifestType} onValueChange={setArrivedManifestType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{manifestTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Mode Type</Label><Select value={arrivedModeType} onValueChange={setArrivedModeType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{modeTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Period</Label><div className="flex gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(arrivedFromDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={arrivedFromDate} onSelect={(d) => d && setArrivedFromDate(d)} /></PopoverContent></Popover><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(arrivedToDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={arrivedToDate} onSelect={(d) => d && setArrivedToDate(d)} /></PopoverContent></Popover></div></div>
            <div className="flex items-end gap-2"><Button onClick={handleArrivedSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3 w-3" />SHOW</Button></div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1200px]"><Table className="text-xs"><TableHeader><TableRow className="bg-muted/50"><TableHead>S#</TableHead><TableHead>Manifest #</TableHead><TableHead>Arrival Date</TableHead><TableHead>Despatch From</TableHead><TableHead>Despatch To</TableHead><TableHead>Division Name</TableHead><TableHead>Mode Name</TableHead><TableHead>Category</TableHead><TableHead>Arrival Status</TableHead><TableHead>Arrival #</TableHead><TableHead>LHC #</TableHead><TableHead>A. Weight</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{arrivedResults.length === 0 ? (<TableRow><TableCell colSpan={13} className="text-center py-8">No records found</TableCell></TableRow>) : (arrivedResults.map((record, idx) => (<TableRow key={record.id}><TableCell>{idx+1}</TableCell><TableCell>{record.manifestNo}</TableCell><TableCell>{format(record.arrivalDate, "dd-MM-yyyy")}</TableCell><TableCell>{record.despatchFrom}</TableCell><TableCell>{record.despatchTo}</TableCell><TableCell>{record.divisionName}</TableCell><TableCell>{record.modeName}</TableCell><TableCell>{record.category}</TableCell><TableCell><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">{record.arrivalStatus}</span></TableCell><TableCell>{record.arrivalNo}</TableCell><TableCell>{record.lhcNo}</TableCell><TableCell>{record.aWeight}</TableCell><TableCell><Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-blue-500"><Eye className="h-3.5 w-3.5" /></Button></TableCell></TableRow>)))}</TableBody></Table></div>
          </div>
        </TabsContent>

        {/* Pending Arrival Tab */}
        <TabsContent value="pending" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 border rounded-md bg-muted/20">
            <div className="space-y-1"><Label className="text-xs">Branch *</Label><Select value={pendingBranch} onValueChange={setPendingBranch}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{branchOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Despatched From</Label><Select value={pendingDespatchFrom} onValueChange={setPendingDespatchFrom}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{despatchFromOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Manifest Type</Label><Select value={pendingManifestType} onValueChange={setPendingManifestType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{manifestTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Mode Type</Label><Select value={pendingModeType} onValueChange={setPendingModeType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{modeTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Manifest Period</Label><div className="flex gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(pendingFromDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={pendingFromDate} onSelect={(d) => d && setPendingFromDate(d)} /></PopoverContent></Popover><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(pendingToDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={pendingToDate} onSelect={(d) => d && setPendingToDate(d)} /></PopoverContent></Popover></div></div>
            <div className="space-y-1"><Label className="text-xs">Vehicle #</Label><Select value={pendingVehicleNo} onValueChange={setPendingVehicleNo}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="ALL" /></SelectTrigger><SelectContent><SelectItem value="ALL">ALL</SelectItem><SelectItem value="UP21CN8635">UP21CN8635</SelectItem><SelectItem value="UP21CT6464">UP21CT6464</SelectItem></SelectContent></Select><div className="flex items-center gap-1 mt-1"><input type="checkbox" className="h-3 w-3" id="allVehicle" /><Label htmlFor="allVehicle" className="text-[10px]">ALL</Label></div></div>
            <div className="space-y-1"><Label className="text-xs">Driver Name</Label><Select value={pendingDriverName} onValueChange={setPendingDriverName}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="ALL" /></SelectTrigger><SelectContent><SelectItem value="ALL">ALL</SelectItem><SelectItem value="Rajesh Kumar">Rajesh Kumar</SelectItem><SelectItem value="Suresh Singh">Suresh Singh</SelectItem></SelectContent></Select><div className="flex items-center gap-1 mt-1"><input type="checkbox" className="h-3 w-3" id="allDriver" /><Label htmlFor="allDriver" className="text-[10px]">ALL</Label></div></div>
            <div className="flex items-end gap-2"><Button onClick={handlePendingSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3 w-3" />SEARCH</Button><Button onClick={handlePrintManifest} variant="outline" size="sm" className="h-8 text-xs"><Printer className="mr-1 h-3 w-3" />PRINT MANIFEST</Button><Button onClick={handleUploadSheet} variant="outline" size="sm" className="h-8 text-xs"><Upload className="mr-1 h-3 w-3" />UPLOAD SHEET</Button></div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1200px]"><Table className="text-xs"><TableHeader><TableRow className="bg-muted/50"><TableHead>S#</TableHead><TableHead>Manifest #</TableHead><TableHead>Date</TableHead><TableHead>Despatch From</TableHead><TableHead>Despatch To</TableHead><TableHead>Division Name</TableHead><TableHead>Mode Name</TableHead><TableHead>Category</TableHead><TableHead>Arrival Status</TableHead><TableHead>Arrival Date</TableHead><TableHead>LHC #</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{paginatedResults.length === 0 ? (<TableRow><TableCell colSpan={12} className="text-center py-8">No records found</TableCell></TableRow>) : (paginatedResults.map((record, idx) => (<TableRow key={record.id}><TableCell>{(currentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell>{record.manifestNo}</TableCell><TableCell>{format(record.date, "dd-MM-yyyy")}</TableCell><TableCell>{record.despatchFrom}</TableCell><TableCell>{record.despatchTo}</TableCell><TableCell>{record.divisionName || "-"}</TableCell><TableCell>{record.modeName || "-"}</TableCell><TableCell>{record.category}</TableCell><TableCell><span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">PENDING</span></TableCell><TableCell>{record.arrivalDate ? format(record.arrivalDate, "dd-MM-yyyy") : "-"}</TableCell><TableCell>{record.lhcNo || "-"}</TableCell><TableCell><Button onClick={() => handleSelectPending(record)} variant="ghost" size="sm" className="h-7 px-2 text-xs bg-green-100 text-green-700">Select</Button></TableCell></TableRow>)))}</TableBody></Table></div>
          </div>

          {totalPages > 1 && (<div className="flex justify-center gap-1"><Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1} className="h-7 text-xs">Previous</Button><span className="px-3 py-1 text-xs">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages} className="h-7 text-xs">Next</Button></div>)}
        </TabsContent>

        {/* Entry Tab */}
        <TabsContent value="entry" className="space-y-4 mt-4">
          <Tabs value={activeEntryTab} onValueChange={(v) => setActiveEntryTab(v as "arrival" | "damage")} className="w-full">
            <TabsList className="grid w-full max-w-[300px] grid-cols-2">
              <TabsTrigger value="arrival" className="text-xs">Arrival</TabsTrigger>
              <TabsTrigger value="damage" className="text-xs">Damage GR For Claim</TabsTrigger>
            </TabsList>

            {/* Arrival Tab */}
            <TabsContent value="arrival" className="space-y-4 mt-4">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs">Branch</Label><Select value={branch} onValueChange={setBranch}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{branchOptions.filter(b => b !== "ALL").map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-1"><Label className="text-xs">Select Godown *</Label><Select value={selectGodown} onValueChange={setSelectGodown}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT GODOWN" /></SelectTrigger><SelectContent>{godownOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-1"><Label className="text-xs">Manifest#</Label><Input value={manifestNo} onChange={(e) => setManifestNo(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Despatch On</Label><div className="flex gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(despatchOn, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={despatchOn} onSelect={(d) => d && setDespatchOn(d)} /></PopoverContent></Popover><Input type="time" value={despatchTime} onChange={(e) => setDespatchTime(e.target.value)} className="h-8 w-24 text-xs" /></div></div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs">From Station</Label><Input value={fromStation} onChange={(e) => setFromStation(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Mode Type</Label><Select value={modeType} onValueChange={setModeType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{modeTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-1"><Label className="text-xs">Mode Name</Label><Input value={modeName} onChange={(e) => setModeName(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Driver</Label><Input value={driver} onChange={(e) => setDriver(e.target.value)} className="h-8 text-xs" /></div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs">Mobile</Label><Input value={mobile} onChange={(e) => setMobile(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Unloading Person *</Label><Input value={unloadingPerson} onChange={(e) => setUnloadingPerson(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">SER/Arrival #</Label><div className="flex gap-2"><Input value={serArrivalNo} onChange={(e) => setSerArrivalNo(e.target.value)} className="h-8 flex-1 text-xs" /><div className="flex items-center gap-1"><input type="checkbox" checked={autoArrival} onChange={(e) => setAutoArrival(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-[10px]">Auto</Label></div></div></div>
                <div className="space-y-1"><Label className="text-xs">Receive Date *</Label><div className="flex gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(receiveDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={receiveDate} onSelect={(d) => d && setReceiveDate(d)} /></PopoverContent></Popover><Input type="time" value={receiveTime} onChange={(e) => setReceiveTime(e.target.value)} className="h-8 w-24 text-xs" /></div></div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs">Unloading Time (In Hours)</Label><div className="flex gap-2"><Input type="number" value={unloadingHours} onChange={(e) => setUnloadingHours(Number(e.target.value))} className="h-8 w-20 text-xs" /><span className="text-xs self-center">HH</span><Input type="number" value={unloadingMinutes} onChange={(e) => setUnloadingMinutes(Number(e.target.value))} className="h-8 w-20 text-xs" /><span className="text-xs self-center">MM</span></div></div>
                <div className="space-y-1"><Label className="text-xs">Route</Label><Input value={route} onChange={(e) => setRoute(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">TAT</Label><Input type="number" value={tat} onChange={(e) => setTat(Number(e.target.value))} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Schedule Arrival Date & Time</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(scheduleArrivalDateTime, "dd-MM-yyyy HH:mm")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={scheduleArrivalDateTime} onSelect={(d) => d && setScheduleArrivalDateTime(d)} /></PopoverContent></Popover></div>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs">Vehicle Que #</Label><Input value={vehicleQueNo} onChange={(e) => setVehicleQueNo(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Vehicle Arrival Date & Time</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(vehicleArrivalDateTime, "dd-MM-yyyy HH:mm")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={vehicleArrivalDateTime} onSelect={(d) => d && setVehicleArrivalDateTime(d)} /></PopoverContent></Popover></div>
                <div className="space-y-1"><Label className="text-xs">Deviation</Label><Input value={deviation} onChange={(e) => setDeviation(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Unloading Date & Time</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(unloadingDateTime, "dd-MM-yyyy HH:mm")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={unloadingDateTime} onSelect={(d) => d && setUnloadingDateTime(d)} /></PopoverContent></Popover></div>
              </div>

              {/* Row 6 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1"><Label className="text-xs">Seal #</Label><Input value={sealNo} onChange={(e) => setSealNo(e.target.value)} className="h-8 text-xs" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={sealOk} onChange={(e) => setSealOk(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs">Seal Ok ?</Label></div>
                <div className="space-y-1"><Label className="text-xs">Dharam Kanta Weight</Label><Input type="number" value={dharamKantaWeight} onChange={(e) => setDharamKantaWeight(Number(e.target.value))} className="h-8 text-xs" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={excessReceiptWithoutGR} onChange={(e) => setExcessReceiptWithoutGR(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs">Excess Receipt Without GR In Manifest</Label></div>
              </div>

              <div className="space-y-1"><Label className="text-xs">Remarks</Label><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="text-xs" /></div>

              {/* GR Items Table */}
              <div className="rounded-md border">
                <div className="bg-muted/50 px-3 py-2 border-b flex justify-between items-center"><h3 className="text-sm font-semibold">GR Details</h3><Button onClick={addGRItem} variant="ghost" size="sm" className="h-7 text-xs"><PlusCircle className="mr-1 h-3 w-3" />Add GR</Button></div>
                <div className="overflow-x-auto"><div className="min-w-[1600px]"><Table className="text-[10px]"><TableHeader><TableRow className="bg-muted/30"><TableHead className="w-8"><input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="h-3 w-3" /></TableHead><TableHead>GR #</TableHead><TableHead>GR Date</TableHead><TableHead>Origin</TableHead><TableHead>Destination</TableHead><TableHead>Consignor</TableHead><TableHead>Consignee</TableHead><TableHead>Cargo Type</TableHead><TableHead>Desp. Pckgs</TableHead><TableHead>Desp. Wt</TableHead><TableHead>Receive Pckgs</TableHead><TableHead>Receive Wt</TableHead><TableHead>Damage Pcs</TableHead><TableHead>Damage Reason</TableHead><TableHead>Short</TableHead><TableHead>Excess</TableHead><TableHead>Godown</TableHead><TableHead>Remarks</TableHead><TableHead className="w-8">Action</TableHead></TableRow></TableHeader><TableBody>{grItems.map((item, idx) => (<TableRow key={item.id}><TableCell><input type="checkbox" className="h-3 w-3" /></TableCell><TableCell><Input value={item.grNo} onChange={(e) => updateGRItem(item.id, "grNo", e.target.value)} className="h-7 w-24 text-[10px]" /></TableCell><TableCell><Popover><PopoverTrigger asChild><Button variant="outline" className="h-7 w-24 text-[10px]"><CalendarIcon className="mr-1 h-2 w-2" />{format(item.grDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={item.grDate} onSelect={(d) => d && updateGRItem(item.id, "grDate", d)} /></PopoverContent></Popover></TableCell><TableCell><Input value={item.origin} onChange={(e) => updateGRItem(item.id, "origin", e.target.value)} className="h-7 w-24 text-[10px]" /></TableCell><TableCell><Input value={item.destination} onChange={(e) => updateGRItem(item.id, "destination", e.target.value)} className="h-7 w-24 text-[10px]" /></TableCell><TableCell><Input value={item.consignor} onChange={(e) => updateGRItem(item.id, "consignor", e.target.value)} className="h-7 w-24 text-[10px]" /></TableCell><TableCell><Input value={item.consignee} onChange={(e) => updateGRItem(item.id, "consignee", e.target.value)} className="h-7 w-24 text-[10px]" /></TableCell><TableCell><Select value={item.cargoType} onValueChange={(v) => updateGRItem(item.id, "cargoType", v)}><SelectTrigger className="h-7 w-24 text-[10px]"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{cargoTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></TableCell><TableCell><Input type="number" value={item.despPckgs} onChange={(e) => updateGRItem(item.id, "despPckgs", Number(e.target.value))} className="h-7 w-20 text-[10px]" /></TableCell><TableCell><Input type="number" value={item.despWt} onChange={(e) => updateGRItem(item.id, "despWt", Number(e.target.value))} className="h-7 w-20 text-[10px]" /></TableCell><TableCell><Input type="number" value={item.receivePckgs} onChange={(e) => updateGRItem(item.id, "receivePckgs", Number(e.target.value))} className="h-7 w-20 text-[10px]" /></TableCell><TableCell><Input type="number" value={item.receiveWt} onChange={(e) => updateGRItem(item.id, "receiveWt", Number(e.target.value))} className="h-7 w-20 text-[10px]" /></TableCell><TableCell><Input type="number" value={item.damagePcs} onChange={(e) => updateGRItem(item.id, "damagePcs", Number(e.target.value))} className="h-7 w-20 text-[10px]" /></TableCell><TableCell><Select value={item.damageReason} onValueChange={(v) => updateGRItem(item.id, "damageReason", v)}><SelectTrigger className="h-7 w-24 text-[10px]"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{damageReasonOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></TableCell><TableCell><Input type="number" value={item.short} onChange={(e) => updateGRItem(item.id, "short", Number(e.target.value))} className="h-7 w-20 text-[10px]" /></TableCell><TableCell><Input type="number" value={item.excess} onChange={(e) => updateGRItem(item.id, "excess", Number(e.target.value))} className="h-7 w-20 text-[10px]" /></TableCell><TableCell><Select value={item.godown} onValueChange={(v) => updateGRItem(item.id, "godown", v)}><SelectTrigger className="h-7 w-24 text-[10px]"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{godownOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></TableCell><TableCell><Input value={item.remarks} onChange={(e) => updateGRItem(item.id, "remarks", e.target.value)} className="h-7 w-24 text-[10px]" /></TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => removeGRItem(item.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell></TableRow>))}</TableBody></Table></div></div>
              </div>

              {/* Totals Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-3"><h4 className="text-sm font-semibold mb-2">As Per Manifest</h4><div className="grid grid-cols-3 gap-2 text-xs"><span>No. Of GR: {manifestTotals.noOfGR}</span><span>Total Pckgs: {manifestTotals.totalPckgs}</span><span>Total Weight: {manifestTotals.totalWeight.toFixed(3)}</span></div></div>
                <div className="border rounded-md p-3"><h4 className="text-sm font-semibold mb-2">As Per Arrival</h4><div className="grid grid-cols-3 gap-2 text-xs"><span>No. Of GR: {arrivalTotals.noOfGR}</span><span>Total Pckgs: {arrivalTotals.totalPckgs}</span><span>Total Weight: {arrivalTotals.totalWeight.toFixed(3)}</span><span>Damage Pckgs: {arrivalTotals.damagePckgs}</span><span>Total Short: {arrivalTotals.totalShort}</span><span>Total Excess: {arrivalTotals.totalExcess}</span></div></div>
              </div>

              <div className="flex flex-wrap justify-end gap-3 pt-4 border-t">
                <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-green-600"><Save className="mr-1 h-3 w-3" />SAVE</Button>
                <Button onClick={handleClear} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
                <Button variant="destructive" size="sm" className="h-8 text-xs"><X className="mr-1 h-3 w-3" />CANCEL</Button>
                <Button variant="outline" size="sm" className="h-8 text-xs"><Printer className="mr-1 h-3 w-3" />PRINT ARRIVAL</Button>
                <Button variant="outline" size="sm" className="h-8 text-xs"><FileText className="mr-1 h-3 w-3" />PRINT DETAILS</Button>
              </div>
            </TabsContent>

            {/* Damage GR For Claim Tab */}
            <TabsContent value="damage" className="space-y-4 mt-4">
              <div className="rounded-md border">
                <div className="bg-muted/50 px-3 py-2 border-b flex justify-between items-center"><h3 className="text-sm font-semibold">Damage GR For Claim</h3><Button onClick={addDamageClaim} variant="ghost" size="sm" className="h-7 text-xs"><PlusCircle className="mr-1 h-3 w-3" />Add Damage Claim</Button></div>
                <div className="overflow-x-auto"><div className="min-w-[1200px]"><Table className="text-[10px]"><TableHeader><TableRow className="bg-muted/30"><TableHead>S#</TableHead><TableHead>GR #</TableHead><TableHead>Despatch Pckgs</TableHead><TableHead>Despatch Weight</TableHead><TableHead>Received Pckgs</TableHead><TableHead>Received Weight</TableHead><TableHead>Damage Pckgs</TableHead><TableHead>Claim Amt</TableHead><TableHead>Damage Reason</TableHead><TableHead>Upload Document</TableHead><TableHead>Document File</TableHead><TableHead className="w-8">Action</TableHead></TableRow></TableHeader><TableBody>{damageClaims.map((claim, idx) => (<TableRow key={claim.id}><TableCell>{idx+1}</TableCell><TableCell><Input value={claim.grNo} onChange={(e) => updateDamageClaim(claim.id, "grNo", e.target.value)} className="h-7 w-24 text-[10px]" /></TableCell><TableCell><Input type="number" value={claim.despatchPckgs} onChange={(e) => updateDamageClaim(claim.id, "despatchPckgs", Number(e.target.value))} className="h-7 w-24 text-[10px]" /></TableCell><TableCell><Input type="number" value={claim.despatchWeight} onChange={(e) => updateDamageClaim(claim.id, "despatchWeight", Number(e.target.value))} className="h-7 w-24 text-[10px]" /></TableCell><TableCell><Input type="number" value={claim.receivedPckgs} onChange={(e) => updateDamageClaim(claim.id, "receivedPckgs", Number(e.target.value))} className="h-7 w-24 text-[10px]" /></TableCell><TableCell><Input type="number" value={claim.receivedWeight} onChange={(e) => updateDamageClaim(claim.id, "receivedWeight", Number(e.target.value))} className="h-7 w-24 text-[10px]" /></TableCell><TableCell><Input type="number" value={claim.damagePckgs} onChange={(e) => updateDamageClaim(claim.id, "damagePckgs", Number(e.target.value))} className="h-7 w-24 text-[10px]" /></TableCell><TableCell><Input type="number" value={claim.claimAmt} onChange={(e) => updateDamageClaim(claim.id, "claimAmt", Number(e.target.value))} className="h-7 w-24 text-[10px]" /></TableCell><TableCell><Select value={claim.damageReason} onValueChange={(v) => updateDamageClaim(claim.id, "damageReason", v)}><SelectTrigger className="h-7 w-32 text-[10px]"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{damageReasonOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></TableCell><TableCell><Input type="file" className="h-7 text-[10px] file:h-6 file:text-[10px]" /></TableCell><TableCell><Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-blue-500"><Upload className="h-3 w-3" /></Button></TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => removeDamageClaim(claim.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell></TableRow>))}</TableBody></Table></div></div>
              </div>
              <div className="flex flex-wrap justify-end gap-3 pt-4 border-t">
                <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-green-600"><Save className="mr-1 h-3 w-3" />SAVE</Button>
                <Button onClick={handleClear} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
                <Button variant="destructive" size="sm" className="h-8 text-xs"><X className="mr-1 h-3 w-3" />CANCEL</Button>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}