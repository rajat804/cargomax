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
  Upload,
  Image,
  FileImage,
  Signature,
  Stamp,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface PODRecord {
  id: number;
  branch: string;
  grNo: string;
  grType: string;
  customer: string;
  bookingDate: Date;
  origin: string;
  destination: string;
  consignor: string;
  consignee: string;
  pckgs: number;
  weight: number;
  arrivalDate: Date;
  deliveryDate: Date;
  podReceivedType: string;
  drsNo: string;
  deliveryBoyName: string;
  receivedBy: string;
  designationRelation: string;
  mobile: string;
  grnNumber: string;
  consigneeEmail: string;
  idProof: boolean;
  withSign: boolean;
  withStamp: boolean;
  directDelivery: boolean;
  proofImage: string;
  additionalDocuments: string[];
  remarks: string;
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

const grTypeOptions = ["FTL", "LTL", "Container", "Express", "Surface"];
const customerOptions = ["ABC Traders", "XYZ Enterprises", "PQR Ltd", "LMN Corp", "DEF Industries"];
const podReceivedTypeOptions = ["Original", "Copy", "Electronic", "Scan Copy"];
const deliveryBoyOptions = ["Rahul Sharma", "Amit Kumar", "Vikash Singh", "Rajesh Verma", "Sunil Gupta"];

export default function PODEntry() {
  const [activeTab, setActiveTab] = useState<"entry" | "search">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [additionalDocs, setAdditionalDocs] = useState<string[]>([]);

  // Entry Form State
  const [branch, setBranch] = useState<string>("");
  const [grNo, setGrNo] = useState<string>("");
  const [grType, setGrType] = useState<string>("");
  const [customer, setCustomer] = useState<string>("");
  const [bookingDate, setBookingDate] = useState<Date>(new Date());
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [consignor, setConsignor] = useState<string>("");
  const [consignee, setConsignee] = useState<string>("");
  const [pckgs, setPckgs] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [arrivalDate, setArrivalDate] = useState<Date>(new Date());
  const [deliveryDate, setDeliveryDate] = useState<Date>(new Date());
  const [podReceivedType, setPodReceivedType] = useState<string>("");
  const [drsNo, setDrsNo] = useState<string>("");
  const [deliveryBoyName, setDeliveryBoyName] = useState<string>("");
  const [receivedBy, setReceivedBy] = useState<string>("");
  const [designationRelation, setDesignationRelation] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [grnNumber, setGrnNumber] = useState<string>("");
  const [consigneeEmail, setConsigneeEmail] = useState<string>("");
  const [idProof, setIdProof] = useState<boolean>(false);
  const [withSign, setWithSign] = useState<boolean>(false);
  const [withStamp, setWithStamp] = useState<boolean>(false);
  const [directDelivery, setDirectDelivery] = useState<boolean>(false);
  const [proofImage, setProofImage] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");

  // Search State
  const [searchFromDate, setSearchFromDate] = useState<Date>(new Date());
  const [searchToDate, setSearchToDate] = useState<Date>(new Date());
  const [searchResults, setSearchResults] = useState<PODRecord[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample Data
  const sampleData: PODRecord[] = [
    { id: 1, branch: "DELHI", grNo: "GR001", grType: "FTL", customer: "ABC Traders", bookingDate: new Date(), origin: "DELHI", destination: "MUMBAI", consignor: "M/s ABC Traders", consignee: "M/s XYZ Enterprises", pckgs: 50, weight: 2500, arrivalDate: new Date(), deliveryDate: new Date(), podReceivedType: "Original", drsNo: "DRS001", deliveryBoyName: "Rahul Sharma", receivedBy: "Rajesh Kumar", designationRelation: "Manager", mobile: "9876543210", grnNumber: "GRN001", consigneeEmail: "consignee@example.com", idProof: true, withSign: true, withStamp: false, directDelivery: false, proofImage: "", additionalDocuments: [], remarks: "Delivered on time", status: "active" },
    { id: 2, branch: "MUMBAI", grNo: "GR002", grType: "LTL", customer: "XYZ Enterprises", bookingDate: new Date(), origin: "MUMBAI", destination: "BANGALORE", consignor: "M/s PQR Ltd", consignee: "M/s LMN Corp", pckgs: 30, weight: 1800, arrivalDate: new Date(), deliveryDate: new Date(), podReceivedType: "Copy", drsNo: "DRS002", deliveryBoyName: "Amit Kumar", receivedBy: "Suresh Singh", designationRelation: "Owner", mobile: "9876543211", grnNumber: "GRN002", consigneeEmail: "consignee2@example.com", idProof: false, withSign: false, withStamp: true, directDelivery: true, proofImage: "", additionalDocuments: [], remarks: "Delivered", status: "active" },
  ];

  const [savedRecords, setSavedRecords] = useState<PODRecord[]>(sampleData);

  const resetForm = () => {
    setBranch("");
    setGrNo("");
    setGrType("");
    setCustomer("");
    setBookingDate(new Date());
    setOrigin("");
    setDestination("");
    setConsignor("");
    setConsignee("");
    setPckgs(0);
    setWeight(0);
    setArrivalDate(new Date());
    setDeliveryDate(new Date());
    setPodReceivedType("");
    setDrsNo("");
    setDeliveryBoyName("");
    setReceivedBy("");
    setDesignationRelation("");
    setMobile("");
    setGrnNumber("");
    setConsigneeEmail("");
    setIdProof(false);
    setWithSign(false);
    setWithStamp(false);
    setDirectDelivery(false);
    setProofImage("");
    setAdditionalDocs([]);
    setRemarks("");
    setEditId(null);
  };

  const handleSave = () => {
    if (!branch) { alert("Please select Branch"); return; }
    if (!grNo) { alert("Please enter GR #"); return; }
    if (!grType) { alert("Please select GR Type"); return; }
    if (!customer) { alert("Please select Customer"); return; }
    if (!receivedBy) { alert("Please enter Received By"); return; }

    setLoading(true);
    setTimeout(() => {
      const newRecord: PODRecord = {
        id: editId || Date.now(),
        branch,
        grNo,
        grType,
        customer,
        bookingDate,
        origin,
        destination,
        consignor,
        consignee,
        pckgs,
        weight,
        arrivalDate,
        deliveryDate,
        podReceivedType,
        drsNo,
        deliveryBoyName,
        receivedBy,
        designationRelation,
        mobile,
        grnNumber,
        consigneeEmail,
        idProof,
        withSign,
        withStamp,
        directDelivery,
        proofImage,
        additionalDocuments: additionalDocs,
        remarks,
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
    if (searchFromDate) results = results.filter(r => r.deliveryDate >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.deliveryDate <= searchToDate);
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleEdit = (record: PODRecord) => {
    setEditId(record.id);
    setBranch(record.branch);
    setGrNo(record.grNo);
    setGrType(record.grType);
    setCustomer(record.customer);
    setBookingDate(record.bookingDate);
    setOrigin(record.origin);
    setDestination(record.destination);
    setConsignor(record.consignor);
    setConsignee(record.consignee);
    setPckgs(record.pckgs);
    setWeight(record.weight);
    setArrivalDate(record.arrivalDate);
    setDeliveryDate(record.deliveryDate);
    setPodReceivedType(record.podReceivedType);
    setDrsNo(record.drsNo);
    setDeliveryBoyName(record.deliveryBoyName);
    setReceivedBy(record.receivedBy);
    setDesignationRelation(record.designationRelation);
    setMobile(record.mobile);
    setGrnNumber(record.grnNumber);
    setConsigneeEmail(record.consigneeEmail);
    setIdProof(record.idProof);
    setWithSign(record.withSign);
    setWithStamp(record.withStamp);
    setDirectDelivery(record.directDelivery);
    setProofImage(record.proofImage);
    setAdditionalDocs(record.additionalDocuments);
    setRemarks(record.remarks);
    setActiveTab("entry");
  };

  const handleDelete = () => {
    if (!editId && !grNo) {
      alert("No record selected to delete");
      return;
    }
    if (confirm("Are you sure you want to delete this POD record?")) {
      if (editId) {
        setSavedRecords(savedRecords.filter(record => record.id !== editId));
      }
      resetForm();
      alert("Record deleted successfully!");
    }
  };

  const handleClear = () => {
    resetForm();
  };

  const handleAddDocument = () => {
    setAdditionalDocs([...additionalDocs, `Document ${additionalDocs.length + 1}`]);
  };

  const handleRemoveDocument = (index: number) => {
    setAdditionalDocs(additionalDocs.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProofImage(file.name);
    }
  };

  const handleViewPODImage = () => {
    if (proofImage) {
      alert(`Viewing POD Image: ${proofImage}`);
    } else {
      alert("No POD image uploaded");
    }
  };

  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">POD ENTRY</h1>
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
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Branch <span className="text-red-500">*</span></Label><Select value={branch} onValueChange={setBranch}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{branchOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">GR # <span className="text-red-500">*</span></Label><Input value={grNo} onChange={(e) => setGrNo(e.target.value)} placeholder="Enter GR Number" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">GR Type <span className="text-red-500">*</span></Label><Select value={grType} onValueChange={setGrType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{grTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Customer <span className="text-red-500">*</span></Label><Select value={customer} onValueChange={setCustomer}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{customerOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Booking Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(bookingDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={bookingDate} onSelect={(d) => d && setBookingDate(d)} /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">Origin</Label><Input value={origin} onChange={(e) => setOrigin(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Destination</Label><Input value={destination} onChange={(e) => setDestination(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Consignor</Label><Input value={consignor} onChange={(e) => setConsignor(e.target.value)} className="h-8 text-xs" /></div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Consignee</Label><Input value={consignee} onChange={(e) => setConsignee(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Pckgs</Label><Input type="number" value={pckgs} onChange={(e) => setPckgs(Number(e.target.value))} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Weight</Label><Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Arrival Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(arrivalDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={arrivalDate} onSelect={(d) => d && setArrivalDate(d)} /></PopoverContent></Popover></div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Delivery Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(deliveryDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={deliveryDate} onSelect={(d) => d && setDeliveryDate(d)} /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">POD Received Type</Label><Select value={podReceivedType} onValueChange={setPodReceivedType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="--Select--" /></SelectTrigger><SelectContent>{podReceivedTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">DRS #</Label><Input value={drsNo} onChange={(e) => setDrsNo(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Delivery Boy Name</Label><Select value={deliveryBoyName} onValueChange={setDeliveryBoyName}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{deliveryBoyOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Received By <span className="text-red-500">*</span></Label><Input value={receivedBy} onChange={(e) => setReceivedBy(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Designation/Relation</Label><Input value={designationRelation} onChange={(e) => setDesignationRelation(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Mobile</Label><Input value={mobile} onChange={(e) => setMobile(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">GRN Number</Label><Input value={grnNumber} onChange={(e) => setGrnNumber(e.target.value)} className="h-8 text-xs" /></div>
          </div>

          {/* Row 6 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Consignee Email</Label><Input value={consigneeEmail} onChange={(e) => setConsigneeEmail(e.target.value)} className="h-8 text-xs" /></div>
          </div>

          {/* Checkboxes Row */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2"><input type="checkbox" checked={idProof} onChange={(e) => setIdProof(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">ID Proof</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={withSign} onChange={(e) => setWithSign(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">With Sign</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={withStamp} onChange={(e) => setWithStamp(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">With Stamp</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={directDelivery} onChange={(e) => setDirectDelivery(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">Direct Delivery</Label></div>
          </div>

          {/* Image Upload Section */}
          <div className="border rounded-md p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Image 1</Label>
                <div className="flex gap-2">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} className="h-8 text-xs flex-1 file:h-7 file:text-xs" />
                  <Button onClick={handleViewPODImage} variant="outline" size="sm" className="h-8 text-xs"><Eye className="mr-1 h-3 w-3" />View</Button>
                </div>
                <p className="text-[10px] text-muted-foreground">No file chosen</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Select Proof Image</Label>
                <Select value={proofImage} onValueChange={setProofImage}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select Proof Image" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aadhar Card">Aadhar Card</SelectItem>
                    <SelectItem value="PAN Card">PAN Card</SelectItem>
                    <SelectItem value="Driving License">Driving License</SelectItem>
                    <SelectItem value="Voter ID">Voter ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Documents */}
          <div className="border rounded-md p-3">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-xs font-medium">Additional Documents</Label>
              <Button onClick={handleAddDocument} variant="ghost" size="sm" className="h-7 text-xs"><PlusCircle className="mr-1 h-3 w-3" />Add Another Document</Button>
            </div>
            {additionalDocs.length > 0 && (
              <div className="space-y-2">
                {additionalDocs.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input value={doc} readOnly className="h-8 text-xs flex-1 bg-muted" />
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveDocument(idx)} className="h-7 w-7 p-0 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Remarks */}
          <div className="space-y-1"><Label className="text-xs">Remarks</Label><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="text-xs" placeholder="Enter remarks..." /></div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-green-600"><Save className="mr-1 h-3 w-3" />SAVE</Button>
            <Button onClick={handleClear} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
            <Button onClick={handleDelete} variant="destructive" size="sm" className="h-8 text-xs"><Trash2 className="mr-1 h-3 w-3" />DELETE</Button>
            <Button onClick={() => alert("POD Image clicked")} variant="outline" size="sm" className="h-8 text-xs"><Image className="mr-1 h-3 w-3" />POD IMAGE</Button>
          </div>
        </div>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-end p-4 border rounded-md bg-muted/20">
            <div className="space-y-1"><Label className="text-xs">From Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-32 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchFromDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">To Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-32 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(searchToDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} /></PopoverContent></Popover></div>
            <Button onClick={handleSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3 w-3" />SHOW POD DETAILS</Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[800px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>S#</TableHead>
                    <TableHead>Branch Name</TableHead>
                    <TableHead>GR #</TableHead>
                    <TableHead>POD Date</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead className="w-20">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-8">No records found</TableCell></TableRow>
                  ) : (
                    paginatedResults.map((record, idx) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell>{(currentPage-1)*itemsPerPage+idx+1}</TableCell>
                        <TableCell>{record.branch}</TableCell>
                        <TableCell className="font-mono">{record.grNo}</TableCell>
                        <TableCell>{format(record.deliveryDate, "dd-MM-yyyy")}</TableCell>
                        <TableCell>{format(record.deliveryDate, "dd-MM-yyyy")}</TableCell>
                        <TableCell>{record.remarks}</TableCell>
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