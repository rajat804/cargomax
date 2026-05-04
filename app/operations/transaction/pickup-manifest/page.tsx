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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface PickupManifest {
  id: number;
  branch: string;
  pickupArea: string;
  manifestNo: string;
  pickupDateTime: Date;
  pickupTime: string;
  vehicleNo: string;
  driverName: string;
  driverMobileNo: string;
  vehicleVendor: string;
  loadedBy: string;
  gateInDate: Date;
  gateInTime: string;
  gateOutDate: Date;
  gateOutTime: string;
  vendorCDNo: string;
  vendorCDDate: Date;
  remarks: string;
  toStation: string;
  mode: string;
  modeCategory: string;
  noOfPckgs: number;
  grossWeight: number;
  status: "active" | "cancelled";
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

const pickupAreaOptions = [
  "DELHI NCR",
  "SOUTH DELHI",
  "NORTH DELHI",
  "EAST DELHI",
  "WEST DELHI",
  "NOIDA",
  "GURUGRAM",
  "FARIDABAD",
  "GHAZIABAD",
];

const vehicleNoOptions = [
  "UP14AB1234",
  "UP15CD5678",
  "UP16EF9012",
  "UP17GH3456",
  "UP18IJ7890",
  "DL01AB1234",
  "DL02CD5678",
];

const driverOptions = [
  "Rajesh Kumar",
  "Suresh Singh",
  "Mahesh Sharma",
  "Ramesh Gupta",
  "Satish Verma",
  "Vikash Singh",
];

const vehicleVendorOptions = [
  "TATA MOTORS",
  "ASHOK LEYLAND",
  "MAHINDRA",
  "EICHER",
  "BHARAT BENZ",
  "FORCE MOTORS",
];

const loadedByOptions = [
  "Mohan Singh",
  "Ravi Kumar",
  "Amit Sharma",
  "Pradeep Verma",
  "Sunil Kumar",
];

export default function PickupManifest() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [autoManifest, setAutoManifest] = useState<boolean>(true);

  // Entry Form State
  const [branch, setBranch] = useState<string>("");
  const [pickupArea, setPickupArea] = useState<string>("");
  const [manifestNo, setManifestNo] = useState<string>("");
  const [pickupDateTime, setPickupDateTime] = useState<Date>(new Date());
  const [pickupTime, setPickupTime] = useState<string>("16:14");
  const [vehicleNo, setVehicleNo] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");
  const [driverMobileNo, setDriverMobileNo] = useState<string>("");
  const [vehicleVendor, setVehicleVendor] = useState<string>("");
  const [loadedBy, setLoadedBy] = useState<string>("");
  const [gateInDate, setGateInDate] = useState<Date>(new Date());
  const [gateInTime, setGateInTime] = useState<string>("");
  const [gateOutDate, setGateOutDate] = useState<Date>(new Date());
  const [gateOutTime, setGateOutTime] = useState<string>("");
  const [vendorCDNo, setVendorCDNo] = useState<string>("");
  const [vendorCDDate, setVendorCDDate] = useState<Date>(new Date());
  const [remarks, setRemarks] = useState<string>("");

  // Search State
  const [searchBranch, setSearchBranch] = useState<string>("");
  const [searchFromDate, setSearchFromDate] = useState<Date>(new Date());
  const [searchToDate, setSearchToDate] = useState<Date>(new Date());
  const [searchResults, setSearchResults] = useState<PickupManifest[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample Data
  const sampleData: PickupManifest[] = [
    { id: 1, branch: "DELHI", pickupArea: "DELHI NCR", manifestNo: "PM001", pickupDateTime: new Date(), pickupTime: "10:30", vehicleNo: "UP14AB1234", driverName: "Rajesh Kumar", driverMobileNo: "9876543210", vehicleVendor: "TATA MOTORS", loadedBy: "Mohan Singh", gateInDate: new Date(), gateInTime: "09:00", gateOutDate: new Date(), gateOutTime: "18:00", vendorCDNo: "CD001", vendorCDDate: new Date(), remarks: "", toStation: "MUMBAI", mode: "DL01LA0837", modeCategory: "SURFACE", noOfPckgs: 50, grossWeight: 2500, status: "active" },
    { id: 2, branch: "MUMBAI", pickupArea: "SOUTH DELHI", manifestNo: "PM002", pickupDateTime: new Date(), pickupTime: "11:30", vehicleNo: "UP15CD5678", driverName: "Suresh Singh", driverMobileNo: "9876543211", vehicleVendor: "ASHOK LEYLAND", loadedBy: "Ravi Kumar", gateInDate: new Date(), gateInTime: "10:00", gateOutDate: new Date(), gateOutTime: "19:00", vendorCDNo: "CD002", vendorCDDate: new Date(), remarks: "", toStation: "BANGALORE", mode: "DL01LAD6175", modeCategory: "SURFACE", noOfPckgs: 75, grossWeight: 3800, status: "active" },
    { id: 3, branch: "BANGALORE", pickupArea: "NORTH DELHI", manifestNo: "PM003", pickupDateTime: new Date(), pickupTime: "09:30", vehicleNo: "UP16EF9012", driverName: "Mahesh Sharma", driverMobileNo: "9876543212", vehicleVendor: "MAHINDRA", loadedBy: "Amit Sharma", gateInDate: new Date(), gateInTime: "08:00", gateOutDate: new Date(), gateOutTime: "17:00", vendorCDNo: "CD003", vendorCDDate: new Date(), remarks: "", toStation: "CHENNAI", mode: "DL01LAJ4226", modeCategory: "SURFACE", noOfPckgs: 30, grossWeight: 1800, status: "cancelled" },
  ];

  const [savedRecords, setSavedRecords] = useState<PickupManifest[]>(sampleData);

  const generateManifestNo = (): string => {
    const count = savedRecords.length + 1;
    return `PM${String(count).padStart(6, "0")}`;
  };

  const resetForm = () => {
    setBranch("");
    setPickupArea("");
    setManifestNo(generateManifestNo());
    setPickupDateTime(new Date());
    setPickupTime("16:14");
    setVehicleNo("");
    setDriverName("");
    setDriverMobileNo("");
    setVehicleVendor("");
    setLoadedBy("");
    setGateInDate(new Date());
    setGateInTime("");
    setGateOutDate(new Date());
    setGateOutTime("");
    setVendorCDNo("");
    setVendorCDDate(new Date());
    setRemarks("");
    setEditId(null);
  };

  const handleSave = () => {
    if (!branch) { alert("Please select Branch"); return; }
    if (!vehicleNo) { alert("Please enter Vehicle #"); return; }
    if (!driverName) { alert("Please enter Driver Name"); return; }

    setLoading(true);
    setTimeout(() => {
      const newRecord: PickupManifest = {
        id: editId || Date.now(),
        branch,
        pickupArea,
        manifestNo,
        pickupDateTime,
        pickupTime,
        vehicleNo,
        driverName,
        driverMobileNo,
        vehicleVendor,
        loadedBy,
        gateInDate,
        gateInTime,
        gateOutDate,
        gateOutTime,
        vendorCDNo,
        vendorCDDate,
        remarks,
        toStation: "",
        mode: "",
        modeCategory: "",
        noOfPckgs: 0,
        grossWeight: 0,
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
    if (searchBranch) results = results.filter(r => r.branch === searchBranch);
    if (searchFromDate) results = results.filter(r => r.pickupDateTime >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.pickupDateTime <= searchToDate);
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleEdit = (record: PickupManifest) => {
    setEditId(record.id);
    setBranch(record.branch);
    setPickupArea(record.pickupArea);
    setManifestNo(record.manifestNo);
    setPickupDateTime(record.pickupDateTime);
    setPickupTime(record.pickupTime);
    setVehicleNo(record.vehicleNo);
    setDriverName(record.driverName);
    setDriverMobileNo(record.driverMobileNo);
    setVehicleVendor(record.vehicleVendor);
    setLoadedBy(record.loadedBy);
    setGateInDate(record.gateInDate);
    setGateInTime(record.gateInTime);
    setGateOutDate(record.gateOutDate);
    setGateOutTime(record.gateOutTime);
    setVendorCDNo(record.vendorCDNo);
    setVendorCDDate(record.vendorCDDate);
    setRemarks(record.remarks);
    setActiveTab("entry");
  };

  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">PICKUP MANIFEST</h1>
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
      </div>

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Branch <span className="text-red-500">*</span></Label><Select value={branch} onValueChange={setBranch}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{branchOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Pickup Area</Label><Select value={pickupArea} onValueChange={setPickupArea}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{pickupAreaOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Manifest #</Label><div className="flex gap-2"><Input value={manifestNo} onChange={(e) => setManifestNo(e.target.value)} readOnly={autoManifest} className={cn("h-8 text-xs flex-1", autoManifest && "bg-muted")} /><div className="flex items-center gap-1"><input type="checkbox" checked={autoManifest} onChange={(e) => setAutoManifest(e.target.checked)} className="h-3.5 w-3.5" id="auto" /><Label htmlFor="auto" className="text-xs">Auto</Label></div></div></div>
            <div className="space-y-1"><Label className="text-xs">Pickup Date/Time</Label><div className="flex gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(pickupDateTime, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={pickupDateTime} onSelect={(d) => d && setPickupDateTime(d)} /></PopoverContent></Popover><Input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="h-8 w-24 text-xs" /></div></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Vehicle # <span className="text-red-500">*</span></Label><Select value={vehicleNo} onValueChange={setVehicleNo}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{vehicleNoOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Driver Name <span className="text-red-500">*</span></Label><Select value={driverName} onValueChange={setDriverName}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{driverOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Driver Mobile #</Label><Input value={driverMobileNo} onChange={(e) => setDriverMobileNo(e.target.value)} placeholder="Enter Mobile Number" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Vehicle Vendor</Label><Select value={vehicleVendor} onValueChange={setVehicleVendor}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{vehicleVendorOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Loaded By</Label><Select value={loadedBy} onValueChange={setLoadedBy}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{loadedByOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Gate In Date</Label><div className="flex gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(gateInDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={gateInDate} onSelect={(d) => d && setGateInDate(d)} /></PopoverContent></Popover><Input type="time" value={gateInTime} onChange={(e) => setGateInTime(e.target.value)} className="h-8 w-24 text-xs" /></div></div>
            <div className="space-y-1"><Label className="text-xs">Gate Out Date</Label><div className="flex gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(gateOutDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={gateOutDate} onSelect={(d) => d && setGateOutDate(d)} /></PopoverContent></Popover><Input type="time" value={gateOutTime} onChange={(e) => setGateOutTime(e.target.value)} className="h-8 w-24 text-xs" /></div></div>
            <div className="space-y-1"><Label className="text-xs">Vendor CD #</Label><Input value={vendorCDNo} onChange={(e) => setVendorCDNo(e.target.value)} placeholder="Enter Vendor CD #" className="h-8 text-xs" /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <div className="space-y-1"><Label className="text-xs">Branch</Label><Select value={searchBranch} onValueChange={setSearchBranch}><SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{branchOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">From Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-32 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchFromDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">To Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-32 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchToDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} /></PopoverContent></Popover></div>
            <Button onClick={handleSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3 w-3" />SHOW MANIFEST</Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1000px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>S#</TableHead>
                    <TableHead>Manifest#</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>To Station</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Mode Category</TableHead>
                    <TableHead className="text-center">No. Of Pckgs</TableHead>
                    <TableHead className="text-center">Gross Weight</TableHead>
                    <TableHead className="w-20">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow><TableCell colSpan={10} className="text-center py-8">No records found</TableCell></TableRow>
                  ) : (
                    paginatedResults.map((record, idx) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell>{(currentPage-1)*itemsPerPage+idx+1}</TableCell>
                        <TableCell className="font-mono">{record.manifestNo}</TableCell>
                        <TableCell>{format(record.pickupDateTime, "dd-MM-yyyy")}</TableCell>
                        <TableCell>{record.branch}</TableCell>
                        <TableCell>{record.toStation || "-"}</TableCell>
                        <TableCell>{record.mode || "-"}</TableCell>
                        <TableCell>{record.modeCategory || "-"}</TableCell>
                        <TableCell className="text-center">{record.noOfPckgs}</TableCell>
                        <TableCell className="text-center">{record.grossWeight}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(record)} className="h-6 w-6 p-0 text-blue-500" title="Edit">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-1">
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1} className="h-7 text-xs">Previous</Button>
              <span className="px-3 py-1 text-xs bg-muted rounded-md">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages} className="h-7 text-xs">Next</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}