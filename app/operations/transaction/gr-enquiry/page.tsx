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
  Mail,
  CreditCard,
  FileSpreadsheet,
  PlusCircle,
  Trash2,
  Send,
  Mail as MailIcon,
  FileImage,
  FolderOpen,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface GRFreightDetail {
  id: number;
  particular: string;
  percentage: number;
  amount: number;
}

interface MovementRecord {
  id: number;
  date: Date;
  activity: string;
  details: string;
  remarks: string;
  entryDate: Date;
  enteredBy: string;
  location: string;
  documentFile: string;
}

interface FreightMemoDetail {
  id: number;
  lhcNo: string;
  date: Date;
  totalPckgs: number;
  totalWt: number;
  chargeWt: number;
  dharamkantaWt: number;
  manifestNo: string;
  manifestType: string;
  amount: number;
  tds: number;
  advance: number;
  balance: number;
  payableAt: string;
}

interface DeliveryDetail {
  id: number;
  branchCode: string;
  drNo: string;
  date: Date;
  ddrNo: string;
  totalAmount: number;
  pckgs: number;
  receivedAmount: number;
  rebate: number;
  due: number;
  markForBill: string;
  billTo: string;
  wc: string;
  wcDate: Date;
  mrStatus: string;
}

interface BillDetail {
  id: number;
  billNo: string;
  date: Date;
  submissionDate: Date;
  submissionAmount: number;
  type: string;
  voucherNo: string;
  voucherStatus: string;
  receivedAmount: number;
  balance: number;
}

interface MRDetail {
  id: number;
  mrNo: string;
  date: Date;
  against: string;
  grNo: string;
  drNo: string;
  mode: string;
  received: number;
  tdsAmount: number;
  rebate: number;
  claim: number;
  rateDiff: number;
  drGst: number;
  voucherNo: string;
  voucherStatus: string;
}

interface DirectDetail {
  id: number;
  branch: string;
  voucherNo: string;
  date: Date;
  ledger: string;
  amount: number;
  remarks: string;
}

interface FollowUpRecord {
  id: number;
  date: Date;
  category: string;
  status: string;
  followUpRemarks: string;
  currentRemarks: string;
  callerName: string;
  callerMobileNo: string;
}

interface ContactDetail {
  id: number;
  branchType: string;
  branchName: string;
  address: string;
  contact: string;
  mobileNo: string;
  emailId: string;
}

interface OtherDetail {
  id: number;
  refNo: string;
  packageType: string;
  contents: string;
  temperature: string;
  packing: string;
  dryIce: string;
  dryIceQty: number;
  dataLogger: string;
  cft: number;
}

interface InvoiceDetail {
  id: number;
  invoiceNo: string;
  date: Date;
  invoiceValue: number;
  eWaybillNo: string;
  eWaybillDate: Date;
  eWaybillExpireDate: Date;
}

interface ViewBookingImage {
  id: number;
  grNo: string;
  documentFile: string;
}

// Radio options
const searchOptions = [
  { value: "gr_no", label: "GR #" },
  { value: "dr_no", label: "DR#" },
  { value: "ref_no", label: "Ref#" },
  { value: "awb_no", label: "AWB#" },
  { value: "job_no", label: "JOB#" },
  { value: "other", label: "Other" },
  { value: "gr_without_code", label: "GR # Without Code" },
  { value: "ewb_no", label: "EWB No." },
  { value: "invoice_no", label: "Invoice #" },
];

export default function GREnquiry() {
  const [activeTab, setActiveTab] = useState<string>("freight");
  const [selectedSearchOption, setSelectedSearchOption] = useState<string>("gr_no");
  const [searchValue, setSearchValue] = useState<string>("");
  const [grData, setGrData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Sample Data
  const [freightDetails, setFreightDetails] = useState<GRFreightDetail[]>([
    { id: 1, particular: "Freight Charges", percentage: 100, amount: 15000 },
    { id: 2, particular: "Loading Charges", percentage: 0, amount: 500 },
    { id: 3, particular: "Unloading Charges", percentage: 0, amount: 500 },
  ]);

  const [movementRecords, setMovementRecords] = useState<MovementRecord[]>([
    { id: 1, date: new Date(), activity: "Booking Created", details: "GR created", remarks: "", entryDate: new Date(), enteredBy: "Admin", location: "DELHI", documentFile: "" },
  ]);

  const [freightMemoDetails, setFreightMemoDetails] = useState<FreightMemoDetail[]>([
    { id: 1, lhcNo: "LHC001", date: new Date(), totalPckgs: 50, totalWt: 2500, chargeWt: 2600, dharamkantaWt: 2550, manifestNo: "M001", manifestType: "Local", amount: 15000, tds: 0, advance: 5000, balance: 10000, payableAt: "MUMBAI" },
  ]);

  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetail[]>([
    { id: 1, branchCode: "DEL", drNo: "DR001", date: new Date(), ddrNo: "DDR001", totalAmount: 15000, pckgs: 50, receivedAmount: 10000, rebate: 0, due: 5000, markForBill: "Yes", billTo: "Customer", wc: "WC001", wcDate: new Date(), mrStatus: "Pending" },
  ]);

  const [billDetails, setBillDetails] = useState<BillDetail[]>([
    { id: 1, billNo: "B001", date: new Date(), submissionDate: new Date(), submissionAmount: 15000, type: "Original", voucherNo: "V001", voucherStatus: "Pending", receivedAmount: 10000, balance: 5000 },
  ]);

  const [mrDetails, setMrDetails] = useState<MRDetail[]>([
    { id: 1, mrNo: "MR001", date: new Date(), against: "GR", grNo: "GR001", drNo: "DR001", mode: "Cash", received: 10000, tdsAmount: 0, rebate: 0, claim: 0, rateDiff: 0, drGst: 0, voucherNo: "V001", voucherStatus: "Approved" },
  ]);

  const [directDetails, setDirectDetails] = useState<DirectDetail[]>([
    { id: 1, branch: "DELHI", voucherNo: "V001", date: new Date(), ledger: "Freight Ledger", amount: 15000, remarks: "" },
  ]);

  const [followUpRecords, setFollowUpRecords] = useState<FollowUpRecord[]>([
    { id: 1, date: new Date(), category: "Booking", status: "In Progress", followUpRemarks: "Follow up needed", currentRemarks: "Awaiting response", callerName: "Rajesh", callerMobileNo: "9876543210" },
  ]);

  const [contactDetails, setContactDetails] = useState<ContactDetail[]>([
    { id: 1, branchType: "Origin", branchName: "DELHI", address: "Transport Nagar, Delhi", contact: "Mr. Sharma", mobileNo: "9876543210", emailId: "delhi@example.com" },
  ]);

  const [otherDetails, setOtherDetails] = useState<OtherDetail[]>([
    { id: 1, refNo: "REF001", packageType: "Carton", contents: "Electronics", temperature: "Ambient", packing: "Box", dryIce: "No", dryIceQty: 0, dataLogger: "Yes", cft: 2.5 },
  ]);

  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetail[]>([
    { id: 1, invoiceNo: "INV001", date: new Date(), invoiceValue: 15000, eWaybillNo: "EWB001", eWaybillDate: new Date(), eWaybillExpireDate: new Date() },
  ]);

  const [viewBookingImages, setViewBookingImages] = useState<ViewBookingImage[]>([
    { id: 1, grNo: "GR001", documentFile: "booking_image.jpg" },
  ]);

  // Form State
  const [bookingDateTime, setBookingDateTime] = useState<Date>(new Date());
  const [edd, setEdd] = useState<Date>(new Date());
  const [grType, setGrType] = useState<string>("FTL");
  const [referenceNo, setReferenceNo] = useState<string>("");
  const [product, setProduct] = useState<string>("");
  const [deliveryType, setDeliveryType] = useState<string>("Door Delivery");
  const [pvtMark, setPvtMark] = useState<string>("");
  const [alertStatus, setAlertStatus] = useState<string>("Normal");
  const [accDivision, setAccDivision] = useState<string>("North");
  const [ccReceived, setCcReceived] = useState<boolean>(false);
  const [billStatus, setBillStatus] = useState<string>("Pending");
  const [ccAttached, setCcAttached] = useState<boolean>(false);
  const [claimAmount, setClaimAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [stockRemarks, setStockRemarks] = useState<string>("");
  const [sanctionAmount, setSanctionAmount] = useState<number>(0);
  const [daccBankBilty, setDaccBankBilty] = useState<string>("");
  const [appointmentDelivery, setAppointmentDelivery] = useState<string>("");
  const [origin, setOrigin] = useState<string>("DELHI");
  const [destination, setDestination] = useState<string>("MUMBAI");
  const [billedAt, setBilledAt] = useState<string>("DELHI");

  // Totals
  const [totalReceivable, setTotalReceivable] = useState<number>(16000);
  const [bookingRebate, setBookingRebate] = useState<number>(0);
  const [deliveryRebate, setDeliveryRebate] = useState<number>(0);
  const [tds, setTds] = useState<number>(0);
  const [claim, setClaim] = useState<number>(0);
  const [rateDiff, setRateDiff] = useState<number>(0);
  const [drGst, setDrGst] = useState<number>(0);
  const [received, setReceived] = useState<number>(10000);
  const [due, setDue] = useState<number>(6000);
  const [subtotal, setSubtotal] = useState<number>(16000);
  const [serviceTax, setServiceTax] = useState<number>(0);
  const [total, setTotal] = useState<number>(16000);
  const [advance, setAdvance] = useState<number>(5000);
  const [balance, setBalance] = useState<number>(11000);

  const handleSearch = () => {
    if (!searchValue) {
      alert("Please enter search value");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setGrData({ grNo: searchValue, status: "Active" });
      setLoading(false);
      alert(`Searching for ${selectedSearchOption}: ${searchValue}`);
    }, 500);
  };

  const handleClear = () => {
    setSearchValue("");
    setGrData(null);
  };

  const handleAction = () => {
    alert("Action performed");
  };

  const handleFollowUp = () => {
    alert("Follow up initiated");
  };

  const handleViewClaim = () => {
    alert("View claim details");
  };

  const handleOpenCaseList = () => {
    alert("Open case list");
  };

  const handleAttachDocument = () => {
    alert("Attach document");
  };

  const handleGeneratePDF = () => {
    alert("PDF generated");
  };

  const handleSendMessage = () => {
    alert("Send SMS/WhatsApp/Mail");
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">GR ENQUIRY</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Top Action Buttons */}
      <div className="flex flex-wrap justify-between items-center gap-2">
        <Button onClick={handleOpenCaseList} variant="outline" size="sm" className="h-8 text-xs">
          <FolderOpen className="mr-1 h-3.5 w-3.5" />
          Open Case List
        </Button>
        <div className="flex gap-2">
          <Button onClick={handleAttachDocument} variant="outline" size="sm" className="h-8 text-xs">
            <Upload className="mr-1 h-3.5 w-3.5" />
            Attach Document
          </Button>
          <Button onClick={handleGeneratePDF} variant="outline" size="sm" className="h-8 text-xs">
            <FileText className="mr-1 h-3.5 w-3.5" />
            Generate PDF
          </Button>
          <Button onClick={handleSendMessage} variant="outline" size="sm" className="h-8 text-xs">
            <Send className="mr-1 h-3.5 w-3.5" />
            Send SMS/WhatsApp/Mail
          </Button>
        </div>
      </div>

      {/* Search Radio Group */}
      <div className="flex flex-wrap gap-3 p-3 border rounded-md bg-muted/20">
        {searchOptions.map((opt) => (
          <label key={opt.value} className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="searchOption"
              value={opt.value}
              checked={selectedSearchOption === opt.value}
              onChange={(e) => setSelectedSearchOption(e.target.value)}
              className="h-3.5 w-3.5"
            />
            <span className="text-xs">{opt.label}</span>
          </label>
        ))}
      </div>

      {/* Search Input and Buttons */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Enter search value..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <Button onClick={handleSearch} size="sm" className="h-8 text-xs">
          <Search className="mr-1 h-3.5 w-3.5" />
          ENQUIRY
        </Button>
        <Button onClick={handleClear} variant="outline" size="sm" className="h-8 text-xs">
          <RefreshCw className="mr-1 h-3.5 w-3.5" />
          CLEAR
        </Button>
        <Button onClick={handleAction} variant="secondary" size="sm" className="h-8 text-xs">
          ACTION
        </Button>
        <Button onClick={handleFollowUp} variant="secondary" size="sm" className="h-8 text-xs">
          FOLLOW UP
        </Button>
        <Button onClick={handleViewClaim} variant="secondary" size="sm" className="h-8 text-xs">
          VIEW CLAIM
        </Button>
      </div>

      {/* Current Status Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs font-medium">Current Status</Label>
          <Input value="In Transit" readOnly className="h-8 text-xs bg-muted" />
        </div>
      </div>

      {/* Booking Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-3 border rounded-md bg-muted/10">
        <div className="space-y-1"><Label className="text-[10px]">Booking Date & Time</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-7 w-full text-[10px]"><CalendarIcon className="mr-1 h-2 w-2" />{format(bookingDateTime, "dd-MM-yyyy HH:mm")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={bookingDateTime} onSelect={(d) => d && setBookingDateTime(d)} /></PopoverContent></Popover></div>
        <div className="space-y-1"><Label className="text-[10px]">EDD</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-7 w-full text-[10px]"><CalendarIcon className="mr-1 h-2 w-2" />{format(edd, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={edd} onSelect={(d) => d && setEdd(d)} /></PopoverContent></Popover></div>
        <div className="space-y-1"><Label className="text-[10px]">GR Type</Label><Select value={grType} onValueChange={setGrType}><SelectTrigger className="h-7 text-[10px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="FTL">FTL</SelectItem><SelectItem value="LTL">LTL</SelectItem><SelectItem value="Container">Container</SelectItem></SelectContent></Select></div>
        <div className="space-y-1"><Label className="text-[10px]">Refrence#</Label><Input value={referenceNo} onChange={(e) => setReferenceNo(e.target.value)} className="h-7 text-[10px]" /></div>
        <div className="space-y-1"><Label className="text-[10px]">Product</Label><Input value={product} onChange={(e) => setProduct(e.target.value)} className="h-7 text-[10px]" /></div>
        <div className="space-y-1"><Label className="text-[10px]">Delivery Type</Label><Select value={deliveryType} onValueChange={setDeliveryType}><SelectTrigger className="h-7 text-[10px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Door Delivery">Door Delivery</SelectItem><SelectItem value="Pickup">Pickup</SelectItem></SelectContent></Select></div>
        <div className="space-y-1"><Label className="text-[10px]">Pvt Mark</Label><Input value={pvtMark} onChange={(e) => setPvtMark(e.target.value)} className="h-7 text-[10px]" /></div>
        <div className="space-y-1"><Label className="text-[10px]">Alert Status</Label><Select value={alertStatus} onValueChange={setAlertStatus}><SelectTrigger className="h-7 text-[10px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Normal">Normal</SelectItem><SelectItem value="Urgent">Urgent</SelectItem><SelectItem value="Critical">Critical</SelectItem></SelectContent></Select></div>
        <div className="space-y-1"><Label className="text-[10px]">ACC Division</Label><Select value={accDivision} onValueChange={setAccDivision}><SelectTrigger className="h-7 text-[10px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="North">North</SelectItem><SelectItem value="South">South</SelectItem><SelectItem value="East">East</SelectItem><SelectItem value="West">West</SelectItem></SelectContent></Select></div>
        <div className="flex items-center gap-2"><input type="checkbox" checked={ccReceived} onChange={(e) => setCcReceived(e.target.checked)} className="h-3 w-3" /><Label className="text-[10px]">CC Received</Label></div>
        <div className="space-y-1"><Label className="text-[10px]">Bill Status</Label><Select value={billStatus} onValueChange={setBillStatus}><SelectTrigger className="h-7 text-[10px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Processed">Processed</SelectItem><SelectItem value="Completed">Completed</SelectItem></SelectContent></Select></div>
        <div className="flex items-center gap-2"><input type="checkbox" checked={ccAttached} onChange={(e) => setCcAttached(e.target.checked)} className="h-3 w-3" /><Label className="text-[10px]">CC Attached</Label></div>
      </div>

      {/* Amount Details Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 p-3 border rounded-md bg-blue-50 dark:bg-blue-950/20">
        <div><Label className="text-[10px]">Claim Amount</Label><Input type="number" value={claimAmount} onChange={(e) => setClaimAmount(Number(e.target.value))} className="h-7 text-[10px]" /></div>
        <div><Label className="text-[10px]">Paid Amount</Label><Input type="number" value={paidAmount} onChange={(e) => setPaidAmount(Number(e.target.value))} className="h-7 text-[10px]" /></div>
        <div className="col-span-2"><Label className="text-[10px]">Stock Remarks</Label><Input value={stockRemarks} onChange={(e) => setStockRemarks(e.target.value)} className="h-7 text-[10px]" /></div>
        <div><Label className="text-[10px]">Sanction Amount</Label><Input type="number" value={sanctionAmount} onChange={(e) => setSanctionAmount(Number(e.target.value))} className="h-7 text-[10px]" /></div>
        <div><Label className="text-[10px]">DACC/Bank Bilty</Label><Input value={daccBankBilty} onChange={(e) => setDaccBankBilty(e.target.value)} className="h-7 text-[10px]" /></div>
        <div><Label className="text-[10px]">Appointment Delivery</Label><Input value={appointmentDelivery} onChange={(e) => setAppointmentDelivery(e.target.value)} className="h-7 text-[10px]" /></div>
        <div><Label className="text-[10px]">Origin</Label><Input value={origin} readOnly className="h-7 text-[10px] bg-muted" /></div>
        <div><Label className="text-[10px]">Destination</Label><Input value={destination} readOnly className="h-7 text-[10px] bg-muted" /></div>
        <div><Label className="text-[10px]">Billed At</Label><Input value={billedAt} readOnly className="h-7 text-[10px] bg-muted" /></div>
      </div>

      {/* More Details Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap h-auto p-1 bg-muted/50 gap-1">
          <TabsTrigger value="freight" className="text-[10px] md:text-xs px-2 py-1">GR Freight Details</TabsTrigger>
          <TabsTrigger value="movement" className="text-[10px] md:text-xs px-2 py-1">Movement</TabsTrigger>
          <TabsTrigger value="freightMemo" className="text-[10px] md:text-xs px-2 py-1">Freight Memo Details</TabsTrigger>
          <TabsTrigger value="delivery" className="text-[10px] md:text-xs px-2 py-1">Delivery Details</TabsTrigger>
          <TabsTrigger value="bill" className="text-[10px] md:text-xs px-2 py-1">Bill Details</TabsTrigger>
          <TabsTrigger value="mr" className="text-[10px] md:text-xs px-2 py-1">MR Details</TabsTrigger>
          <TabsTrigger value="direct" className="text-[10px] md:text-xs px-2 py-1">Direct Details</TabsTrigger>
          <TabsTrigger value="followup" className="text-[10px] md:text-xs px-2 py-1">Follow Up</TabsTrigger>
          <TabsTrigger value="contact" className="text-[10px] md:text-xs px-2 py-1">Contact Details</TabsTrigger>
          <TabsTrigger value="others" className="text-[10px] md:text-xs px-2 py-1">Others</TabsTrigger>
          <TabsTrigger value="invoice" className="text-[10px] md:text-xs px-2 py-1">Invoice Details</TabsTrigger>
          <TabsTrigger value="image" className="text-[10px] md:text-xs px-2 py-1">View Booking Image</TabsTrigger>
        </TabsList>

        {/* GR Freight Details Tab */}
        <TabsContent value="freight" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border rounded-md p-3">
              <h4 className="text-sm font-semibold mb-2">Freight Details</h4>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3"><span>Freight On: CHARGE WEIGHT</span><span>Rate: ₹5.00</span><span>Freight: ₹{freightDetails.reduce((s, i) => s + i.amount, 0)}</span></div>
              <Table className="text-xs"><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>Particular</TableHead><TableHead>%</TableHead><TableHead>Amount</TableHead></TableRow></TableHeader><TableBody>{freightDetails.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell>{item.particular}</TableCell><TableCell>{item.percentage}%</TableCell><TableCell>₹{item.amount}</TableCell></TableRow>))}</TableBody></Table>
            </div>
            <div className="border rounded-md p-3">
              <h4 className="text-sm font-semibold mb-2">Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-xs"><span>Delivery Income: ₹0</span><span>Total Receivable: ₹{totalReceivable}</span><span>Booking Rebate: ₹{bookingRebate}</span><span>Delivery Rebate: ₹{deliveryRebate}</span><span>TDS: ₹{tds}</span><span>Claim: ₹{claim}</span><span>Rate Diff: ₹{rateDiff}</span><span>DR GST: ₹{drGst}</span><span>Received: ₹{received}</span><span>Due: ₹{due}</span><span>Subtotal: ₹{subtotal}</span><span>Service Tax: ₹{serviceTax}</span><span>Total: ₹{total}</span><span>Advance: ₹{advance}</span><span>Balance: ₹{balance}</span></div>
            </div>
          </div>
        </TabsContent>

        {/* Movement Tab */}
        <TabsContent value="movement" className="mt-4"><div className="rounded-md border overflow-x-auto"><Table className="text-xs"><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>Date</TableHead><TableHead>Activity</TableHead><TableHead>Details</TableHead><TableHead>Remarks</TableHead><TableHead>Entry Date</TableHead><TableHead>Entered By</TableHead><TableHead>Location</TableHead><TableHead>Document File</TableHead></TableRow></TableHeader><TableBody>{movementRecords.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell>{format(item.date, "dd-MM-yyyy")}</TableCell><TableCell>{item.activity}</TableCell><TableCell>{item.details}</TableCell><TableCell>{item.remarks}</TableCell><TableCell>{format(item.entryDate, "dd-MM-yyyy")}</TableCell><TableCell>{item.enteredBy}</TableCell><TableCell>{item.location}</TableCell><TableCell>-</TableCell></TableRow>))}</TableBody></Table></div></TabsContent>

        {/* Freight Memo Details Tab */}
        <TabsContent value="freightMemo" className="mt-4"><div className="rounded-md border overflow-x-auto"><Table className="text-xs"><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>LHC #</TableHead><TableHead>Date</TableHead><TableHead>Total Pckgs</TableHead><TableHead>Total Wt</TableHead><TableHead>Charge Wt</TableHead><TableHead>Dharamkanta Wt</TableHead><TableHead>Manifest #</TableHead><TableHead>Manifest Type</TableHead><TableHead>Amount</TableHead><TableHead>TDS</TableHead><TableHead>Advance</TableHead><TableHead>Balance</TableHead><TableHead>Payable At</TableHead></TableRow></TableHeader><TableBody>{freightMemoDetails.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell>{item.lhcNo}</TableCell><TableCell>{format(item.date, "dd-MM-yyyy")}</TableCell><TableCell>{item.totalPckgs}</TableCell><TableCell>{item.totalWt}</TableCell><TableCell>{item.chargeWt}</TableCell><TableCell>{item.dharamkantaWt}</TableCell><TableCell>{item.manifestNo}</TableCell><TableCell>{item.manifestType}</TableCell><TableCell>₹{item.amount}</TableCell><TableCell>₹{item.tds}</TableCell><TableCell>₹{item.advance}</TableCell><TableCell>₹{item.balance}</TableCell><TableCell>{item.payableAt}</TableCell></TableRow>))}</TableBody></Table></div></TabsContent>

        {/* Delivery Details Tab */}
        <TabsContent value="delivery" className="mt-4"><div className="rounded-md border overflow-x-auto"><Table className="text-xs"><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>BranchCode</TableHead><TableHead>DR #</TableHead><TableHead>Date</TableHead><TableHead>DDR #</TableHead><TableHead>Total Amount</TableHead><TableHead>Pckgs</TableHead><TableHead>Received Amount</TableHead><TableHead>Rebate</TableHead><TableHead>Due</TableHead><TableHead>Mark For Bill</TableHead><TableHead>Bill To</TableHead><TableHead>WC</TableHead><TableHead>WC Date</TableHead><TableHead>MR Status</TableHead></TableRow></TableHeader><TableBody>{deliveryDetails.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell>{item.branchCode}</TableCell><TableCell>{item.drNo}</TableCell><TableCell>{format(item.date, "dd-MM-yyyy")}</TableCell><TableCell>{item.ddrNo}</TableCell><TableCell>₹{item.totalAmount}</TableCell><TableCell>{item.pckgs}</TableCell><TableCell>₹{item.receivedAmount}</TableCell><TableCell>₹{item.rebate}</TableCell><TableCell>₹{item.due}</TableCell><TableCell>{item.markForBill}</TableCell><TableCell>{item.billTo}</TableCell><TableCell>{item.wc}</TableCell><TableCell>{item.wcDate ? format(item.wcDate, "dd-MM-yyyy") : "-"}</TableCell><TableCell>{item.mrStatus}</TableCell></TableRow>))}</TableBody></Table></div></TabsContent>

        {/* Bill Details Tab */}
        <TabsContent value="bill" className="mt-4"><div className="rounded-md border overflow-x-auto"><Table className="text-xs"><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>Bill #</TableHead><TableHead>Date</TableHead><TableHead>Submission Date</TableHead><TableHead>Submission Amount</TableHead><TableHead>Type</TableHead><TableHead>Voucher #</TableHead><TableHead>Voucher Status</TableHead><TableHead>Received Amount</TableHead><TableHead>Balance</TableHead></TableRow></TableHeader><TableBody>{billDetails.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell>{item.billNo}</TableCell><TableCell>{format(item.date, "dd-MM-yyyy")}</TableCell><TableCell>{format(item.submissionDate, "dd-MM-yyyy")}</TableCell><TableCell>₹{item.submissionAmount}</TableCell><TableCell>{item.type}</TableCell><TableCell>{item.voucherNo}</TableCell><TableCell>{item.voucherStatus}</TableCell><TableCell>₹{item.receivedAmount}</TableCell><TableCell>₹{item.balance}</TableCell></TableRow>))}</TableBody></Table></div></TabsContent>

        {/* MR Details Tab */}
        <TabsContent value="mr" className="mt-4"><div className="rounded-md border overflow-x-auto"><Table className="text-xs"><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>MR #</TableHead><TableHead>Date</TableHead><TableHead>Against</TableHead><TableHead>GR #</TableHead><TableHead>DR #</TableHead><TableHead>Mode</TableHead><TableHead>Received</TableHead><TableHead>TDS Amount</TableHead><TableHead>Rebate</TableHead><TableHead>Claim</TableHead><TableHead>Rate Diff</TableHead><TableHead>DR GST</TableHead><TableHead>Voucher #</TableHead><TableHead>Voucher Status</TableHead></TableRow></TableHeader><TableBody>{mrDetails.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell>{item.mrNo}</TableCell><TableCell>{format(item.date, "dd-MM-yyyy")}</TableCell><TableCell>{item.against}</TableCell><TableCell>{item.grNo}</TableCell><TableCell>{item.drNo}</TableCell><TableCell>{item.mode}</TableCell><TableCell>₹{item.received}</TableCell><TableCell>₹{item.tdsAmount}</TableCell><TableCell>₹{item.rebate}</TableCell><TableCell>₹{item.claim}</TableCell><TableCell>₹{item.rateDiff}</TableCell><TableCell>₹{item.drGst}</TableCell><TableCell>{item.voucherNo}</TableCell><TableCell>{item.voucherStatus}</TableCell></TableRow>))}</TableBody></Table></div></TabsContent>

        {/* Direct Details Tab */}
        <TabsContent value="direct" className="mt-4"><div className="rounded-md border overflow-x-auto"><Table className="text-xs"><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>Branch</TableHead><TableHead>Voucher #</TableHead><TableHead>Date</TableHead><TableHead>Ledger</TableHead><TableHead>Amount</TableHead><TableHead>Remarks</TableHead></TableRow></TableHeader><TableBody>{directDetails.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell>{item.branch}</TableCell><TableCell>{item.voucherNo}</TableCell><TableCell>{format(item.date, "dd-MM-yyyy")}</TableCell><TableCell>{item.ledger}</TableCell><TableCell>₹{item.amount}</TableCell><TableCell>{item.remarks}</TableCell></TableRow>))}</TableBody></Table></div></TabsContent>

        {/* Follow Up Tab */}
        <TabsContent value="followup" className="mt-4 space-y-3">
          <div className="flex gap-2"><Button size="sm" className="h-7 text-xs"><Search className="mr-1 h-3 w-3" />SEARCH</Button></div>
          <div className="rounded-md border overflow-x-auto"><Table className="text-xs"><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>Date</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead><TableHead>Follow Up Remarks</TableHead><TableHead>Current Remarks</TableHead><TableHead>Caller Name</TableHead><TableHead>Caller Mobile No.</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{followUpRecords.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell>{format(item.date, "dd-MM-yyyy")}</TableCell><TableCell>{item.category}</TableCell><TableCell>{item.status}</TableCell><TableCell>{item.followUpRemarks}</TableCell><TableCell>{item.currentRemarks}</TableCell><TableCell>{item.callerName}</TableCell><TableCell>{item.callerMobileNo}</TableCell><TableCell><Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-blue-500"><Eye className="h-3 w-3" /></Button></TableCell></TableRow>))}</TableBody></Table></div>
        </TabsContent>

        {/* Contact Details Tab */}
        <TabsContent value="contact" className="mt-4"><div className="rounded-md border overflow-x-auto"><Table className="text-xs"><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>Branch Type</TableHead><TableHead>Branch Name</TableHead><TableHead>Address</TableHead><TableHead>Contact</TableHead><TableHead>Mobile No.</TableHead><TableHead>Email ID</TableHead></TableRow></TableHeader><TableBody>{contactDetails.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell>{item.branchType}</TableCell><TableCell>{item.branchName}</TableCell><TableCell>{item.address}</TableCell><TableCell>{item.contact}</TableCell><TableCell>{item.mobileNo}</TableCell><TableCell>{item.emailId}</TableCell></TableRow>))}</TableBody></Table></div></TabsContent>

        {/* Others Tab */}
        <TabsContent value="others" className="mt-4"><div className="rounded-md border overflow-x-auto"><Table className="text-xs"><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>Ref #</TableHead><TableHead>Package Type</TableHead><TableHead>Contents</TableHead><TableHead>Temperature</TableHead><TableHead>PACKING</TableHead><TableHead>Dry Ice</TableHead><TableHead>Dry Ice Qty</TableHead><TableHead>Data Logger</TableHead><TableHead>CFT</TableHead></TableRow></TableHeader><TableBody>{otherDetails.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell>{item.refNo}</TableCell><TableCell>{item.packageType}</TableCell><TableCell>{item.contents}</TableCell><TableCell>{item.temperature}</TableCell><TableCell>{item.packing}</TableCell><TableCell>{item.dryIce}</TableCell><TableCell>{item.dryIceQty}</TableCell><TableCell>{item.dataLogger}</TableCell><TableCell>{item.cft}</TableCell></TableRow>))}</TableBody></Table></div></TabsContent>

        {/* Invoice Details Tab */}
        <TabsContent value="invoice" className="mt-4"><div className="rounded-md border overflow-x-auto"><Table className="text-xs"><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>Invoice #</TableHead><TableHead>Date</TableHead><TableHead>Invoice Value</TableHead><TableHead>E-Waybill No</TableHead><TableHead>E-Waybill Date</TableHead><TableHead>E-Waybill Expire Date</TableHead></TableRow></TableHeader><TableBody>{invoiceDetails.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell>{item.invoiceNo}</TableCell><TableCell>{format(item.date, "dd-MM-yyyy")}</TableCell><TableCell>₹{item.invoiceValue}</TableCell><TableCell>{item.eWaybillNo}</TableCell><TableCell>{format(item.eWaybillDate, "dd-MM-yyyy")}</TableCell><TableCell>{format(item.eWaybillExpireDate, "dd-MM-yyyy")}</TableCell></TableRow>))}</TableBody></Table></div></TabsContent>

        {/* View Booking Image Tab */}
        <TabsContent value="image" className="mt-4"><div className="rounded-md border overflow-x-auto"><Table className="text-xs"><TableHeader><TableRow><TableHead>S#</TableHead><TableHead>GR NO</TableHead><TableHead>Document File</TableHead></TableRow></TableHeader><TableBody>{viewBookingImages.map((item, idx) => (<TableRow key={item.id}><TableCell>{idx+1}</TableCell><TableCell>{item.grNo}</TableCell><TableCell><Button variant="ghost" size="sm" className="h-6 text-xs text-blue-500"><Eye className="h-3 w-3 mr-1" />View</Button></TableCell></TableRow>))}</TableBody></Table></div></TabsContent>
      </Tabs>
    </div>
  );
}