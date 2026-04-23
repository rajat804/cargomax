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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { CalendarIcon, Save, RefreshCw, Search, Pencil, Trash2, Upload, Download, Eye, X, Plus, FileText, Image as ImageIcon,AlertCircle  } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface MarketVehicle {
  id: number;
  vehicleRegNo: string;
  regDate: Date;
  vehicleType: string;
  capacity: number;
  ownerName: string;
  ownerBankName: string;
  ownerAccountNo: string;
  ownerIfscCode: string;
  vehicleVendor: string;
  pan: string;
  registeredAt: string;
  rcBookNo: string;
  engineNo: string;
  chasisNo: string;
  registrationValidUpto: Date;
  noOfTyres: number;
  imei: string;
  gpsVendor: string;
  trackingLink: string;
  chequeImage: string;
  lhcNotForPayment: boolean;
}

interface DocumentAttachment {
  id: number;
  caption: string;
  description: string;
  fileName: string;
  fileSize: number;
  fileData: string;
}

const vehicleTypeOptions = [
  "OPEN BODY TRUCK",
  "CONTAINER",
  "TRUCK",
  "TRAILER",
  "TANKER",
  "PICKUP",
  "VAN"
];

export default function MarketVehicleMaster() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"search" | "entry">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  
  // Form state
  const [vehicleRegNo, setVehicleRegNo] = useState<string>("");
  const [regDate, setRegDate] = useState<Date>(new Date());
  const [vehicleType, setVehicleType] = useState<string>("");
  const [capacity, setCapacity] = useState<number>(0);
  const [ownerName, setOwnerName] = useState<string>("");
  const [ownerBankName, setOwnerBankName] = useState<string>("");
  const [ownerAccountNo, setOwnerAccountNo] = useState<string>("");
  const [ownerIfscCode, setOwnerIfscCode] = useState<string>("");
  const [vehicleVendor, setVehicleVendor] = useState<string>("");
  const [pan, setPan] = useState<string>("");
  const [registeredAt, setRegisteredAt] = useState<string>("");
  const [rcBookNo, setRcBookNo] = useState<string>("");
  const [engineNo, setEngineNo] = useState<string>("");
  const [chasisNo, setChasisNo] = useState<string>("");
  const [registrationValidUpto, setRegistrationValidUpto] = useState<Date>(new Date());
  const [noOfTyres, setNoOfTyres] = useState<number>(0);
  const [imei, setImei] = useState<string>("");
  const [gpsVendor, setGpsVendor] = useState<string>("");
  const [trackingLink, setTrackingLink] = useState<string>("");
  const [chequeImage, setChequeImage] = useState<string>("");
  const [lhcNotForPayment, setLhcNotForPayment] = useState<boolean>(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Document attachment modal state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedVehicleForDoc, setSelectedVehicleForDoc] = useState<MarketVehicle | null>(null);
  const [documents, setDocuments] = useState<DocumentAttachment[]>([]);
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<MarketVehicle[]>([
    { id: 1, vehicleRegNo: "09102018", regDate: new Date("2018-10-09"), vehicleType: "OPEN BODY TRUCK", capacity: 15000, ownerName: "SURAT SINGH VERMA", ownerBankName: "SBI", ownerAccountNo: "1234567890", ownerIfscCode: "SBIN0012345", vehicleVendor: "TATA MOTORS", pan: "ABFPV3079A", registeredAt: "DELHI RTO", rcBookNo: "RC123456", engineNo: "ENG123456", chasisNo: "CHS123456", registrationValidUpto: new Date("2028-12-31"), noOfTyres: 6, imei: "123456789012345", gpsVendor: "MapMyIndia", trackingLink: "https://track.example.com/1", chequeImage: "", lhcNotForPayment: false },
    { id: 2, vehicleRegNo: "1111111", regDate: new Date("2020-01-01"), vehicleType: "CONTAINER", capacity: 20000, ownerName: "", ownerBankName: "", ownerAccountNo: "", ownerIfscCode: "", vehicleVendor: "", pan: "", registeredAt: "", rcBookNo: "", engineNo: "", chasisNo: "", registrationValidUpto: new Date("2025-12-31"), noOfTyres: 8, imei: "", gpsVendor: "", trackingLink: "", chequeImage: "", lhcNotForPayment: false },
    { id: 3, vehicleRegNo: "12102025", regDate: new Date("2025-10-12"), vehicleType: "CONTAINER", capacity: 18000, ownerName: "MOHD RAFEEQ", ownerBankName: "HDFC", ownerAccountNo: "9876543210", ownerIfscCode: "HDFC0012345", vehicleVendor: "ASHOK LEYLAND", pan: "DMCPR6782P", registeredAt: "MUMBAI RTO", rcBookNo: "RC789012", engineNo: "ENG789012", chasisNo: "CHS789012", registrationValidUpto: new Date("2030-12-31"), noOfTyres: 6, imei: "987654321098765", gpsVendor: "GPS Unlimited", trackingLink: "https://track.example.com/3", chequeImage: "", lhcNotForPayment: true },
    { id: 4, vehicleRegNo: "12338", regDate: new Date("2019-03-15"), vehicleType: "CONTAINER", capacity: 12000, ownerName: "", ownerBankName: "", ownerAccountNo: "", ownerIfscCode: "", vehicleVendor: "", pan: "", registeredAt: "", rcBookNo: "", engineNo: "", chasisNo: "", registrationValidUpto: new Date("2024-12-31"), noOfTyres: 6, imei: "", gpsVendor: "", trackingLink: "", chequeImage: "", lhcNotForPayment: false },
    { id: 5, vehicleRegNo: "60186", regDate: new Date("2020-06-18"), vehicleType: "CONTAINER", capacity: 14000, ownerName: "", ownerBankName: "", ownerAccountNo: "", ownerIfscCode: "", vehicleVendor: "", pan: "", registeredAt: "", rcBookNo: "", engineNo: "", chasisNo: "", registrationValidUpto: new Date("2025-06-17"), noOfTyres: 6, imei: "", gpsVendor: "", trackingLink: "", chequeImage: "", lhcNotForPayment: false },
    { id: 6, vehicleRegNo: "61638", regDate: new Date("2021-01-16"), vehicleType: "CONTAINER", capacity: 16000, ownerName: "", ownerBankName: "", ownerAccountNo: "", ownerIfscCode: "", vehicleVendor: "", pan: "", registeredAt: "", rcBookNo: "", engineNo: "", chasisNo: "", registrationValidUpto: new Date("2026-01-15"), noOfTyres: 8, imei: "", gpsVendor: "", trackingLink: "", chequeImage: "", lhcNotForPayment: false },
    { id: 7, vehicleRegNo: "66588", regDate: new Date("2021-06-15"), vehicleType: "CONTAINER", capacity: 15000, ownerName: "", ownerBankName: "", ownerAccountNo: "", ownerIfscCode: "", vehicleVendor: "", pan: "", registeredAt: "", rcBookNo: "", engineNo: "", chasisNo: "", registrationValidUpto: new Date("2026-06-14"), noOfTyres: 6, imei: "", gpsVendor: "", trackingLink: "", chequeImage: "", lhcNotForPayment: false },
    { id: 8, vehicleRegNo: "76203", regDate: new Date("2022-03-20"), vehicleType: "CONTAINER", capacity: 18000, ownerName: "", ownerBankName: "", ownerAccountNo: "", ownerIfscCode: "", vehicleVendor: "", pan: "", registeredAt: "", rcBookNo: "", engineNo: "", chasisNo: "", registrationValidUpto: new Date("2027-03-19"), noOfTyres: 8, imei: "", gpsVendor: "", trackingLink: "", chequeImage: "", lhcNotForPayment: false },
    { id: 9, vehicleRegNo: "AS01NC9463", regDate: new Date("2019-08-22"), vehicleType: "OPEN BODY TRUCK", capacity: 13000, ownerName: "MOHAMMAD SHAMEEN AHMAD", ownerBankName: "ICICI", ownerAccountNo: "4567890123", ownerIfscCode: "ICICI0012345", vehicleVendor: "MAHINDRA", pan: "APFPM7298N", registeredAt: "GUWAHATI RTO", rcBookNo: "RC456789", engineNo: "ENG456789", chasisNo: "CHS456789", registrationValidUpto: new Date("2029-12-31"), noOfTyres: 6, imei: "555555555555555", gpsVendor: "Trackon", trackingLink: "https://track.example.com/9", chequeImage: "", lhcNotForPayment: false },
    { id: 10, vehicleRegNo: "AS01QC4482", regDate: new Date("2020-11-10"), vehicleType: "TRUCK", capacity: 14000, ownerName: "SUSHIL KUMAR", ownerBankName: "AXIS", ownerAccountNo: "7890123456", ownerIfscCode: "AXIS0012345", vehicleVendor: "EICHER", pan: "APJPK9013P", registeredAt: "GUWAHATI RTO", rcBookNo: "RC789123", engineNo: "ENG789123", chasisNo: "CHS789123", registrationValidUpto: new Date("2025-12-31"), noOfTyres: 6, imei: "666666666666666", gpsVendor: "MapMyIndia", trackingLink: "https://track.example.com/10", chequeImage: "", lhcNotForPayment: true },
  ]);

  // Get search results
  const getSearchResults = (): MarketVehicle[] => {
    let results = [...savedRecords];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(r => 
        r.vehicleRegNo.toLowerCase().includes(term) ||
        r.vehicleType.toLowerCase().includes(term) ||
        r.ownerName.toLowerCase().includes(term) ||
        r.pan.toLowerCase().includes(term)
      );
    }
    return results;
  };

  const searchResults: MarketVehicle[] = getSearchResults();
  const totalPages: number = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults: MarketVehicle[] = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate new ID
  const getNextId = (): number => {
    const maxId = savedRecords.length > 0 ? Math.max(...savedRecords.map(r => r.id)) : 0;
    return maxId + 1;
  };

  // Reset form
  const resetForm = (): void => {
    setVehicleRegNo("");
    setRegDate(new Date());
    setVehicleType("");
    setCapacity(0);
    setOwnerName("");
    setOwnerBankName("");
    setOwnerAccountNo("");
    setOwnerIfscCode("");
    setVehicleVendor("");
    setPan("");
    setRegisteredAt("");
    setRcBookNo("");
    setEngineNo("");
    setChasisNo("");
    setRegistrationValidUpto(new Date());
    setNoOfTyres(0);
    setImei("");
    setGpsVendor("");
    setTrackingLink("");
    setChequeImage("");
    setLhcNotForPayment(false);
    setEditId(null);
  };

  const handleSave = (): void => {
    if (!vehicleRegNo.trim()) {
      alert("Please enter Vehicle Registration Number");
      return;
    }
    if (!vehicleType) {
      alert("Please select Vehicle Type");
      return;
    }
    if (!ownerName.trim()) {
      alert("Please enter Owner Name");
      return;
    }

    if (editId) {
      const updatedRecords = savedRecords.map(record => 
        record.id === editId 
          ? { 
              ...record, 
              vehicleRegNo, regDate, vehicleType, capacity, ownerName, ownerBankName,
              ownerAccountNo, ownerIfscCode, vehicleVendor, pan, registeredAt, rcBookNo,
              engineNo, chasisNo, registrationValidUpto, noOfTyres, imei, gpsVendor,
              trackingLink, chequeImage, lhcNotForPayment
            }
          : record
      );
      setSavedRecords(updatedRecords);
      alert("Record updated successfully!");
    } else {
      const newRecord: MarketVehicle = {
        id: getNextId(),
        vehicleRegNo, regDate, vehicleType, capacity, ownerName, ownerBankName,
        ownerAccountNo, ownerIfscCode, vehicleVendor, pan, registeredAt, rcBookNo,
        engineNo, chasisNo, registrationValidUpto, noOfTyres, imei, gpsVendor,
        trackingLink, chequeImage, lhcNotForPayment
      };
      setSavedRecords([...savedRecords, newRecord]);
      alert("Record saved successfully!");
    }
    
    resetForm();
    setActiveTab("search");
  };

  const handleEdit = (record: MarketVehicle): void => {
    setEditId(record.id);
    setVehicleRegNo(record.vehicleRegNo);
    setRegDate(record.regDate);
    setVehicleType(record.vehicleType);
    setCapacity(record.capacity);
    setOwnerName(record.ownerName);
    setOwnerBankName(record.ownerBankName);
    setOwnerAccountNo(record.ownerAccountNo);
    setOwnerIfscCode(record.ownerIfscCode);
    setVehicleVendor(record.vehicleVendor);
    setPan(record.pan);
    setRegisteredAt(record.registeredAt);
    setRcBookNo(record.rcBookNo);
    setEngineNo(record.engineNo);
    setChasisNo(record.chasisNo);
    setRegistrationValidUpto(record.registrationValidUpto);
    setNoOfTyres(record.noOfTyres);
    setImei(record.imei);
    setGpsVendor(record.gpsVendor);
    setTrackingLink(record.trackingLink);
    setChequeImage(record.chequeImage);
    setLhcNotForPayment(record.lhcNotForPayment);
    setActiveTab("entry");
  };

  const handleDelete = (id: number): void => {
    if (confirm("Are you sure you want to delete this record?")) {
      const updatedRecords = savedRecords.filter(record => record.id !== id);
      setSavedRecords(updatedRecords);
      alert("Record deleted successfully!");
    }
  };

  const handleClearSearch = (): void => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const goToPage = (page: number): void => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Document attachment functions
  const handleAttachDocument = (record: MarketVehicle) => {
    setSelectedVehicleForDoc(record);
    setDocuments([]);
    setIsDocModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not be greater than 5 MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleAddDocument = () => {
    if (!caption.trim()) {
      alert("Please enter Caption");
      return;
    }
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const newDoc: DocumentAttachment = {
      id: documents.length + 1,
      caption: caption,
      description: description,
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      fileData: URL.createObjectURL(selectedFile)
    };
    setDocuments([...documents, newDoc]);
    setCaption("");
    setDescription("");
    setSelectedFile(null);
  };

  const handleDeleteDocument = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleDownloadDocument = (doc: DocumentAttachment) => {
    const link = document.createElement('a');
    link.href = doc.fileData;
    link.download = doc.fileName;
    link.click();
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">MARKET VEHICLE MASTER</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button onClick={() => { setActiveTab("search"); setCurrentPage(1); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Search</button>
        <button onClick={() => { setActiveTab("entry"); resetForm(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Entry</button>
      </div>

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search by Reg No, Type, Owner or PAN..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="pl-8 h-8 text-xs" />
            </div>
            <Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3.5 w-3.5" />CLEAR</Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[800px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">S#</TableHead>
                    <TableHead>Vehicle Reg #</TableHead>
                    <TableHead>Vehicle Type</TableHead>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead>Owner Name</TableHead>
                    <TableHead>PAN NO</TableHead>
                    <TableHead className="w-32 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (<TableRow><TableCell colSpan={7} className="text-center py-8">No records found.</TableCell></TableRow>) : (
                    paginatedResults.map((record, index) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium">{record.vehicleRegNo}</TableCell>
                        <TableCell>{record.vehicleType}</TableCell>
                        <TableCell>{record.vehicleVendor || "-"}</TableCell>
                        <TableCell>{record.ownerName || "-"}</TableCell>
                        <TableCell>{record.pan || "-"}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(record)} className="h-7 w-7 p-0 text-blue-500" title="Edit"><Pencil className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleAttachDocument(record)} className="h-7 w-7 p-0 text-green-500" title="Attach Document"><Upload className="h-3.5 w-3.5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {totalPages > 1 && (<div className="flex items-center justify-between flex-wrap gap-2"><div className="text-xs">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, searchResults.length)} of {searchResults.length} entries</div><div className="flex gap-1"><Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="h-7 text-xs">Previous</Button><span className="px-3 py-1 text-xs">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="h-7 text-xs">Next</Button></div></div>)}
        </div>
      )}

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Vehicle Reg # <span className="text-red-500">*</span></Label><Input value={vehicleRegNo} onChange={(e) => setVehicleRegNo(e.target.value)} className="h-8 text-xs uppercase" /></div>
            <div className="space-y-1"><Label className="text-xs">RegDate <span className="text-red-500">*</span></Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full justify-start text-left text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{regDate ? format(regDate, "dd-MM-yyyy") : "Select date"}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><CalendarComponent mode="single" selected={regDate} onSelect={(d) => d && setRegDate(d)} initialFocus /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">Vehicle Type <span className="text-red-500">*</span></Label><Select value={vehicleType} onValueChange={setVehicleType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{vehicleTypeOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Capacity <span className="text-red-500">*</span></Label><Input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="h-8 text-xs" /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Owner Name <span className="text-red-500">*</span></Label><Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Owner Bank Name</Label><Input value={ownerBankName} onChange={(e) => setOwnerBankName(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Owner Account #</Label><Input value={ownerAccountNo} onChange={(e) => setOwnerAccountNo(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Owner IFSC Code</Label><Input value={ownerIfscCode} onChange={(e) => setOwnerIfscCode(e.target.value)} className="h-8 text-xs uppercase" /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Vehicle Vendor</Label><Input value={vehicleVendor} onChange={(e) => setVehicleVendor(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">PAN</Label><Input value={pan} onChange={(e) => setPan(e.target.value)} className="h-8 text-xs uppercase" /></div>
            <div className="space-y-1"><Label className="text-xs">Registered At</Label><Input value={registeredAt} onChange={(e) => setRegisteredAt(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">RC Book #</Label><Input value={rcBookNo} onChange={(e) => setRcBookNo(e.target.value)} className="h-8 text-xs" /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Engine No.</Label><Input value={engineNo} onChange={(e) => setEngineNo(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Chasis No.</Label><Input value={chasisNo} onChange={(e) => setChasisNo(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Registration Valid Upto</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full justify-start text-left text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{registrationValidUpto ? format(registrationValidUpto, "dd-MM-yyyy") : "Select date"}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><CalendarComponent mode="single" selected={registrationValidUpto} onSelect={(d) => d && setRegistrationValidUpto(d)} initialFocus /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">No. Of Tyres</Label><Input type="number" value={noOfTyres} onChange={(e) => setNoOfTyres(Number(e.target.value))} className="h-8 text-xs" /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">IMEI</Label><Input value={imei} onChange={(e) => setImei(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">GPS Vendor</Label><Input value={gpsVendor} onChange={(e) => setGpsVendor(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Tracking Link</Label><Input value={trackingLink} onChange={(e) => setTrackingLink(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Select Cheque Image</Label><Input type="file" accept="image/*" onChange={(e) => { if(e.target.files?.[0]) setChequeImage(e.target.files[0].name); }} className="h-8 text-xs file:h-7 file:text-xs" /></div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" checked={lhcNotForPayment} onChange={(e) => setLhcNotForPayment(e.target.checked)} className="h-3.5 w-3.5" />
            <Label className="text-xs cursor-pointer">LHC Not For Payment</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-4">
            <Button onClick={handleSave} size="sm" className="h-8 text-xs"><Save className="mr-1 h-3 w-3" />{editId ? "UPDATE" : "SAVE"}</Button>
            <Button onClick={resetForm} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
          </div>
        </div>
      )}

      {/* Attach Document Modal */}
      <Dialog open={isDocModalOpen} onOpenChange={setIsDocModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-4 pt-4 pb-2 border-b">
            <DialogTitle className="text-base md:text-lg">Attach Document - Vehicle Reg #: {selectedVehicleForDoc?.vehicleRegNo}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col px-4">
            <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded-md mb-3">
              <AlertCircle className="h-3 w-3 inline mr-1" /> File size should not be greater than 5 mb.
            </div>

            {/* Add Document Form */}
            <div className="border rounded-md p-3 mb-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">Caption</Label><Input value={caption} onChange={(e) => setCaption(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Select File</Label><Input type="file" onChange={handleFileChange} className="h-8 text-xs file:h-7 file:text-xs" /></div>
                <div className="flex items-end"><Button onClick={handleAddDocument} size="sm" className="h-8 text-xs"><Plus className="mr-1 h-3 w-3" />ADD</Button></div>
              </div>
            </div>

            {/* Documents Table */}
            <div className="rounded-md border overflow-x-auto flex-1">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12">S#</TableHead>
                    <TableHead>Caption</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Select File</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead className="w-32 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.length === 0 ? (<TableRow><TableCell colSpan={6} className="text-center py-8">No documents attached</TableCell></TableRow>) : (
                    documents.map((doc, idx) => (
                      <TableRow key={doc.id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{doc.caption}</TableCell>
                        <TableCell>{doc.description || "-"}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>{doc.fileName}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleDownloadDocument(doc)} className="h-7 w-7 p-0 text-blue-500" title="Download"><Download className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc.id)} className="h-7 w-7 p-0 text-red-500" title="Delete"><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter className="px-4 py-3 border-t gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsDocModalOpen(false)}>CLOSE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}