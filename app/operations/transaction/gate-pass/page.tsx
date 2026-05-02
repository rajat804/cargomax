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
  Image,
  Trash2,
  PlusCircle,
  MinusCircle,
  Truck,
  Package,
  MapPin,
  Building,
  Phone,
  Mail,
  CreditCard,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ChargeItem {
  id: number;
  charges: string;
  applicableOn: string;
  rate: number;
  applicableValue: number;
  amount: number;
}

interface GatePassRecord {
  id: number;
  branch: string;
  date: Date;
  gatePassNo: string;
  grNo: string;
  refNo: string;
  origin: string;
  destination: string;
  customer: string;
  consignor: string;
  consignorGst: string;
  consignee: string;
  consigneeTelNo: string;
  grPckgs: number;
  chgWeight: number;
  actWeight: number;
  deliveryType: string;
  consigneeType: string;
  deliveredAgainstConsigneeCopy: boolean;
  ccReceived: boolean;
  consigneeEmail: string;
  pvtMarka: string;
  remarks: string;
  deliveredTo: string;
  rebooking: boolean;
  dueGatepass: boolean;
  dueOrderBy: string;
  selectCustomerForBilling: string;
  printAfterSave: boolean;
  item: string;
  packing: string;
  grType: string;
  grDate: Date;
  ddrNo: string;
  arrivalDate: Date;
  receivedPckgs: number;
  balancePckgs: number;
  deliveredPckgs: number;
  deliveredWeight: number;
  godown: string;
  grFreight: number;
  charges: ChargeItem[];
  gstPaidBy: string;
  gstType: string;
  gst: number;
  advance: number;
  balance: number;
  proofOfDelivery: string;
  images: string[];
  status: "active" | "cancelled";
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
];

const deliveryTypeOptions = ["Door Delivery", "Pickup", "Self Collection"];
const consigneeTypeOptions = ["Regular", "Corporate", "Government", "Premium"];
const gstPaidByOptions = ["EXEMPTED", "CONSIGNOR", "CONSIGNEE", "CARRIER"];
const gstTypeOptions = ["CGST+SGST", "IGST", "UTGST"];
const grTypeOptions = ["FTL", "LTL", "Container", "Express"];
const godownOptions = ["Godown A", "Godown B", "Godown C", "Warehouse"];
const dueOrderByOptions = ["Self", "Broker", "Customer"];
const selectCustomerForBillingOptions = ["Self", "Customer", "Broker"];

const chargesOptions = [
  "DELIVERY CHARGES",
  "LOADING CHARGES",
  "UNLOADING CHARGES",
  "HAMALI CHARGES",
  "STORAGE CHARGES",
  "DEMURRAGE CHARGES",
  "OCTROI CHARGES",
  "ENTRY TAX",
];

const applicableOnOptions = ["Docket", "Weight", "Package", "Freight", "Value"];

export default function GatePassEntry() {
  const [activeMainTab, setActiveMainTab] = useState<"entry" | "cancelled" | "search">("entry");
  const [activeEntryTab, setActiveEntryTab] = useState<"entry" | "image">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Form state
  const [branch, setBranch] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [gatePassNo, setGatePassNo] = useState<string>("");
  const [auto, setAuto] = useState<boolean>(true);
  const [grNo, setGrNo] = useState<string>("");
  const [refNo, setRefNo] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [customer, setCustomer] = useState<string>("");
  const [consignor, setConsignor] = useState<string>("");
  const [consignorGst, setConsignorGst] = useState<string>("");
  const [consignee, setConsignee] = useState<string>("");
  const [consigneeTelNo, setConsigneeTelNo] = useState<string>("");
  const [grPckgs, setGrPckgs] = useState<number>(0);
  const [chgWeight, setChgWeight] = useState<number>(0);
  const [actWeight, setActWeight] = useState<number>(0);
  const [deliveryType, setDeliveryType] = useState<string>("");
  const [consigneeType, setConsigneeType] = useState<string>("");
  const [deliveredAgainstConsigneeCopy, setDeliveredAgainstConsigneeCopy] = useState<boolean>(false);
  const [ccReceived, setCcReceived] = useState<boolean>(false);
  const [consigneeEmail, setConsigneeEmail] = useState<string>("");
  const [pvtMarka, setPvtMarka] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [deliveredTo, setDeliveredTo] = useState<string>("");
  const [rebooking, setRebooking] = useState<boolean>(false);
  const [dueGatepass, setDueGatepass] = useState<boolean>(false);
  const [dueOrderBy, setDueOrderBy] = useState<string>("");
  const [selectCustomerForBilling, setSelectCustomerForBilling] = useState<string>("");
  const [printAfterSave, setPrintAfterSave] = useState<boolean>(false);
  const [item, setItem] = useState<string>("");
  const [packing, setPacking] = useState<string>("");
  const [grType, setGrType] = useState<string>("");
  const [grDate, setGrDate] = useState<Date>(new Date());
  const [ddrNo, setDdrNo] = useState<string>("");
  const [arrivalDate, setArrivalDate] = useState<Date>(new Date());
  const [receivedPckgs, setReceivedPckgs] = useState<number>(0);
  const [balancePckgs, setBalancePckgs] = useState<number>(0);
  const [deliveredPckgs, setDeliveredPckgs] = useState<number>(0);
  const [deliveredWeight, setDeliveredWeight] = useState<number>(0);
  const [godown, setGodown] = useState<string>("");
  const [grFreight, setGrFreight] = useState<number>(0);
  const [charges, setCharges] = useState<ChargeItem[]>([
    { id: 1, charges: "DELIVERY CHARGES", applicableOn: "Docket", rate: 0, applicableValue: 0, amount: 0 },
  ]);
  const [gstPaidBy, setGstPaidBy] = useState<string>("");
  const [gstType, setGstType] = useState<string>("");
  const [gst, setGst] = useState<number>(0);
  const [advance, setAdvance] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [proofOfDelivery, setProofOfDelivery] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);

  // Search state
  const [searchBranch, setSearchBranch] = useState<string>("");
  const [searchFromDate, setSearchFromDate] = useState<Date>(new Date());
  const [searchToDate, setSearchToDate] = useState<Date>(new Date());
  const [searchDrNo, setSearchDrNo] = useState<string>("");
  const [searchResults, setSearchResults] = useState<GatePassRecord[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample data
  const [savedRecords, setSavedRecords] = useState<GatePassRecord[]>([]);

  const generateGatePassNo = (): string => {
    const count = savedRecords.length + 1;
    return `GP${String(count).padStart(6, "0")}`;
  };

  const handleAutoChange = () => {
    setAuto(!auto);
    if (!auto) {
      setGatePassNo(generateGatePassNo());
    } else {
      setGatePassNo("");
    }
  };

  const addChargeRow = () => {
    const newCharge: ChargeItem = {
      id: Date.now(),
      charges: "",
      applicableOn: "",
      rate: 0,
      applicableValue: 0,
      amount: 0,
    };
    setCharges([...charges, newCharge]);
  };

  const updateCharge = (id: number, field: keyof ChargeItem, value: any) => {
    setCharges(charges.map(charge => {
      if (charge.id === id) {
        const updated = { ...charge, [field]: value };
        if (field === "rate" || field === "applicableValue") {
          updated.amount = (updated.rate * updated.applicableValue);
        }
        return updated;
      }
      return charge;
    }));
  };

  const removeCharge = (id: number) => {
    if (charges.length > 1) {
      setCharges(charges.filter(charge => charge.id !== id));
    }
  };

  const calculateTotal = () => {
    const subtotal = charges.reduce((sum, charge) => sum + charge.amount, 0);
    const gstAmount = subtotal * 0.18;
    const total = subtotal + gstAmount;
    const balanceAmount = total - advance;
    setGst(gstAmount);
    setBalance(balanceAmount);
    return total;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file.type.includes("image/jpeg") || file.type.includes("image/jpg")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages([...images, event.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert("You can only upload JPG/JPEG files.");
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setBranch("");
    setDate(new Date());
    setGatePassNo(generateGatePassNo());
    setAuto(true);
    setGrNo("");
    setRefNo("");
    setOrigin("");
    setDestination("");
    setCustomer("");
    setConsignor("");
    setConsignorGst("");
    setConsignee("");
    setConsigneeTelNo("");
    setGrPckgs(0);
    setChgWeight(0);
    setActWeight(0);
    setDeliveryType("");
    setConsigneeType("");
    setDeliveredAgainstConsigneeCopy(false);
    setCcReceived(false);
    setConsigneeEmail("");
    setPvtMarka("");
    setRemarks("");
    setDeliveredTo("");
    setRebooking(false);
    setDueGatepass(false);
    setDueOrderBy("");
    setSelectCustomerForBilling("");
    setPrintAfterSave(false);
    setItem("");
    setPacking("");
    setGrType("");
    setGrDate(new Date());
    setDdrNo("");
    setArrivalDate(new Date());
    setReceivedPckgs(0);
    setBalancePckgs(0);
    setDeliveredPckgs(0);
    setDeliveredWeight(0);
    setGodown("");
    setGrFreight(0);
    setCharges([{ id: 1, charges: "DELIVERY CHARGES", applicableOn: "Docket", rate: 0, applicableValue: 0, amount: 0 }]);
    setGstPaidBy("");
    setGstType("");
    setGst(0);
    setAdvance(0);
    setBalance(0);
    setProofOfDelivery("");
    setImages([]);
    setEditId(null);
  };

  const handleSave = () => {
    if (!branch) {
      alert("Please select Branch");
      return;
    }
    if (!grNo) {
      alert("Please enter GR #");
      return;
    }
    if (!consignee) {
      alert("Please enter Consignee");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const total = calculateTotal();
      const newRecord: GatePassRecord = {
        id: editId || Date.now(),
        branch, date, gatePassNo, grNo, refNo, origin, destination, customer,
        consignor, consignorGst, consignee, consigneeTelNo, grPckgs, chgWeight,
        actWeight, deliveryType, consigneeType, deliveredAgainstConsigneeCopy,
        ccReceived, consigneeEmail, pvtMarka, remarks, deliveredTo, rebooking,
        dueGatepass, dueOrderBy, selectCustomerForBilling, printAfterSave, item,
        packing, grType, grDate, ddrNo, arrivalDate, receivedPckgs, balancePckgs,
        deliveredPckgs, deliveredWeight, godown, grFreight, charges, gstPaidBy,
        gstType, gst, advance, balance: total - advance, proofOfDelivery, images,
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
      setActiveMainTab("search");
      setLoading(false);
    }, 500);
  };

  const handleSearch = () => {
    let results = savedRecords.filter(record => record.status !== "cancelled");
    if (searchBranch) results = results.filter(r => r.branch === searchBranch);
    if (searchDrNo) results = results.filter(r => r.gatePassNo.toLowerCase().includes(searchDrNo.toLowerCase()));
    if (searchFromDate) results = results.filter(r => r.date >= searchFromDate);
    if (searchToDate) results = results.filter(r => r.date <= searchToDate);
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleEdit = (record: GatePassRecord) => {
    setEditId(record.id);
    setBranch(record.branch);
    setDate(record.date);
    setGatePassNo(record.gatePassNo);
    setGrNo(record.grNo);
    setRefNo(record.refNo);
    setOrigin(record.origin);
    setDestination(record.destination);
    setCustomer(record.customer);
    setConsignor(record.consignor);
    setConsignorGst(record.consignorGst);
    setConsignee(record.consignee);
    setConsigneeTelNo(record.consigneeTelNo);
    setGrPckgs(record.grPckgs);
    setChgWeight(record.chgWeight);
    setActWeight(record.actWeight);
    setDeliveryType(record.deliveryType);
    setConsigneeType(record.consigneeType);
    setDeliveredAgainstConsigneeCopy(record.deliveredAgainstConsigneeCopy);
    setCcReceived(record.ccReceived);
    setConsigneeEmail(record.consigneeEmail);
    setPvtMarka(record.pvtMarka);
    setRemarks(record.remarks);
    setDeliveredTo(record.deliveredTo);
    setRebooking(record.rebooking);
    setDueGatepass(record.dueGatepass);
    setDueOrderBy(record.dueOrderBy);
    setSelectCustomerForBilling(record.selectCustomerForBilling);
    setPrintAfterSave(record.printAfterSave);
    setItem(record.item);
    setPacking(record.packing);
    setGrType(record.grType);
    setGrDate(record.grDate);
    setDdrNo(record.ddrNo);
    setArrivalDate(record.arrivalDate);
    setReceivedPckgs(record.receivedPckgs);
    setBalancePckgs(record.balancePckgs);
    setDeliveredPckgs(record.deliveredPckgs);
    setDeliveredWeight(record.deliveredWeight);
    setGodown(record.godown);
    setGrFreight(record.grFreight);
    setCharges(record.charges);
    setGstPaidBy(record.gstPaidBy);
    setGstType(record.gstType);
    setGst(record.gst);
    setAdvance(record.advance);
    setBalance(record.balance);
    setProofOfDelivery(record.proofOfDelivery);
    setImages(record.images);
    setActiveMainTab("entry");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setSavedRecords(savedRecords.filter(record => record.id !== id));
      setSearchResults(searchResults.filter(record => record.id !== id));
      alert("Record deleted successfully!");
    }
  };

  const handleCancel = (id: number) => {
    if (confirm("Are you sure you want to cancel this Gate Pass?")) {
      setSavedRecords(savedRecords.map(record => 
        record.id === id ? { ...record, status: "cancelled" } : record
      ));
      alert("Gate Pass cancelled successfully!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">GATE PASS ENTRY</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b">
        <button onClick={() => { setActiveMainTab("entry"); resetForm(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeMainTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Entry</button>
        <button onClick={() => { setActiveMainTab("search"); handleSearch(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeMainTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Search</button>
        <button onClick={() => { setActiveMainTab("cancelled"); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeMainTab === "cancelled" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Cancelled</button>
      </div>

      {/* Entry Tab */}
      {activeMainTab === "entry" && (
        <Tabs value={activeEntryTab} onValueChange={(v) => setActiveEntryTab(v as "entry" | "image")} className="w-full">
          <TabsList className="grid w-full max-w-[200px] grid-cols-2">
            <TabsTrigger value="entry" className="text-xs">Entry</TabsTrigger>
            <TabsTrigger value="image" className="text-xs">Image</TabsTrigger>
          </TabsList>

          {/* Entry Form Tab */}
          <TabsContent value="entry" className="space-y-4 mt-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Branch <span className="text-red-500">*</span></Label><Select value={branch} onValueChange={setBranch}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{branchOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs">Date <span className="text-red-500">*</span></Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{format(date, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} /></PopoverContent></Popover></div>
              <div className="space-y-1"><Label className="text-xs">Gate Pass# <span className="text-red-500">*</span></Label><div className="flex gap-2"><Input value={gatePassNo} onChange={(e) => setGatePassNo(e.target.value)} readOnly={auto} className={cn("h-8 text-xs flex-1", auto && "bg-muted")} /><div className="flex items-center gap-1"><input type="checkbox" checked={auto} onChange={handleAutoChange} className="h-3.5 w-3.5" id="auto" /><Label htmlFor="auto" className="text-xs cursor-pointer">Auto</Label></div></div></div>
              <div className="space-y-1"><Label className="text-xs">GR # <span className="text-red-500">*</span></Label><Input value={grNo} onChange={(e) => setGrNo(e.target.value)} className="h-8 text-xs" /></div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Ref.#</Label><Input value={refNo} onChange={(e) => setRefNo(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Origin</Label><Input value={origin} onChange={(e) => setOrigin(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Destination</Label><Input value={destination} onChange={(e) => setDestination(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Customer</Label><Input value={customer} onChange={(e) => setCustomer(e.target.value)} className="h-8 text-xs" /></div>
            </div>

            {/* Row 3 - Consignor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Consignor</Label><Input value={consignor} onChange={(e) => setConsignor(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">CNGE GST#</Label><Input value={consignorGst} onChange={(e) => setConsignorGst(e.target.value)} className="h-8 text-xs uppercase" /></div>
              <div className="space-y-1"><Label className="text-xs">Consignee <span className="text-red-500">*</span></Label><Input value={consignee} onChange={(e) => setConsignee(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Consignee Tel. # <span className="text-red-500">*</span></Label><Input value={consigneeTelNo} onChange={(e) => setConsigneeTelNo(e.target.value)} className="h-8 text-xs" /></div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">GR Pckgs</Label><Input type="number" value={grPckgs} onChange={(e) => setGrPckgs(Number(e.target.value))} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Chg. Weight</Label><Input type="number" value={chgWeight} onChange={(e) => setChgWeight(Number(e.target.value))} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Act. Weight</Label><Input type="number" value={actWeight} onChange={(e) => setActWeight(Number(e.target.value))} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Delivery Type</Label><Select value={deliveryType} onValueChange={setDeliveryType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{deliveryTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Consignee Type</Label><Select value={consigneeType} onValueChange={setConsigneeType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{consigneeTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
              <div className="flex items-center gap-3"><input type="checkbox" checked={deliveredAgainstConsigneeCopy} onChange={(e) => setDeliveredAgainstConsigneeCopy(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs">Delivered Against Consignee Copy</Label></div>
              <div className="flex items-center gap-3"><input type="checkbox" checked={ccReceived} onChange={(e) => setCcReceived(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs">CC Received</Label></div>
              <div className="space-y-1"><Label className="text-xs">Consignee Email</Label><Input value={consigneeEmail} onChange={(e) => setConsigneeEmail(e.target.value)} className="h-8 text-xs" /></div>
            </div>

            {/* Row 6 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">PVT Marka</Label><Input value={pvtMarka} onChange={(e) => setPvtMarka(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Delivered To <span className="text-red-500">*</span></Label><Input value={deliveredTo} onChange={(e) => setDeliveredTo(e.target.value)} className="h-8 text-xs" /></div>
              <div className="flex items-center gap-3"><input type="checkbox" checked={rebooking} onChange={(e) => setRebooking(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs">Rebooking</Label></div>
              <div className="flex items-center gap-3"><input type="checkbox" checked={dueGatepass} onChange={(e) => setDueGatepass(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs">Due Gatepass</Label></div>
            </div>

            {/* Row 7 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Due Order By</Label><Select value={dueOrderBy} onValueChange={setDueOrderBy}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{dueOrderByOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs">Select Customer For Billing</Label><Select value={selectCustomerForBilling} onValueChange={setSelectCustomerForBilling}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{selectCustomerForBillingOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
              <div className="flex items-center gap-3"><input type="checkbox" checked={printAfterSave} onChange={(e) => setPrintAfterSave(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs">Print After Save</Label></div>
            </div>

            {/* Row 8 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Item</Label><Input value={item} onChange={(e) => setItem(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Packing</Label><Input value={packing} onChange={(e) => setPacking(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">GR Type</Label><Select value={grType} onValueChange={setGrType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{grTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs">GR Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{format(grDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={grDate} onSelect={(d) => d && setGrDate(d)} /></PopoverContent></Popover></div>
            </div>

            {/* Row 9 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">DDR #</Label><Input value={ddrNo} onChange={(e) => setDdrNo(e.target.value)} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Arrival Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{format(arrivalDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={arrivalDate} onSelect={(d) => d && setArrivalDate(d)} /></PopoverContent></Popover></div>
              <div className="space-y-1"><Label className="text-xs">Received Pckgs</Label><Input type="number" value={receivedPckgs} onChange={(e) => setReceivedPckgs(Number(e.target.value))} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Balance Pckgs</Label><Input type="number" value={balancePckgs} onChange={(e) => setBalancePckgs(Number(e.target.value))} className="h-8 text-xs" /></div>
            </div>

            {/* Row 10 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">Delivered Pckgs</Label><Input type="number" value={deliveredPckgs} onChange={(e) => setDeliveredPckgs(Number(e.target.value))} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Delivered Weight</Label><Input type="number" value={deliveredWeight} onChange={(e) => setDeliveredWeight(Number(e.target.value))} className="h-8 text-xs" /></div>
              <div className="space-y-1"><Label className="text-xs">Godown</Label><Select value={godown} onValueChange={setGodown}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{godownOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs">GR Freight</Label><Input type="number" value={grFreight} onChange={(e) => setGrFreight(Number(e.target.value))} className="h-8 text-xs" /></div>
            </div>

            {/* Remarks */}
            <div className="space-y-1"><Label className="text-xs">Remarks</Label><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="text-xs" /></div>

            {/* Charges Table */}
            <div className="rounded-md border">
              <div className="bg-muted/50 px-3 py-2 border-b flex justify-between items-center"><h3 className="text-sm font-semibold">Charges</h3><Button onClick={addChargeRow} variant="ghost" size="sm" className="h-7 text-xs"><PlusCircle className="mr-1 h-3 w-3" />Add Charge</Button></div>
              <div className="overflow-x-auto">
                <Table className="text-xs">
                  <TableHeader><TableRow className="bg-muted/30"><TableHead className="w-12">S#</TableHead><TableHead>Charges</TableHead><TableHead>Applicable On</TableHead><TableHead>Rate</TableHead><TableHead>Applicable Value</TableHead><TableHead>Amount</TableHead><TableHead className="w-12">Action</TableHead></TableRow></TableHeader>
                  <TableBody>{charges.map((charge, idx) => (<TableRow key={charge.id}><TableCell>{idx+1}</TableCell><TableCell><Select value={charge.charges} onValueChange={(v) => updateCharge(charge.id, "charges", v)}><SelectTrigger className="h-7 w-32 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{chargesOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></TableCell><TableCell><Select value={charge.applicableOn} onValueChange={(v) => updateCharge(charge.id, "applicableOn", v)}><SelectTrigger className="h-7 w-28 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{applicableOnOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></TableCell><TableCell><Input type="number" value={charge.rate} onChange={(e) => updateCharge(charge.id, "rate", Number(e.target.value))} className="h-7 w-24 text-xs" /></TableCell><TableCell><Input type="number" value={charge.applicableValue} onChange={(e) => updateCharge(charge.id, "applicableValue", Number(e.target.value))} className="h-7 w-24 text-xs" /></TableCell><TableCell>₹{charge.amount.toFixed(2)}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => removeCharge(charge.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell></TableRow>))}</TableBody>
                </Table>
              </div>
            </div>

            {/* GST and Totals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1"><Label className="text-xs">GST Paid By</Label><Select value={gstPaidBy} onValueChange={setGstPaidBy}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{gstPaidByOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs">GST Type</Label><Select value={gstType} onValueChange={setGstType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{gstTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
              <div className="space-y-1"><Label className="text-xs">GST</Label><Input type="number" value={gst} readOnly className="h-8 text-xs bg-muted" /></div>
              <div className="space-y-1"><Label className="text-xs">Advance</Label><Input type="number" value={advance} onChange={(e) => setAdvance(Number(e.target.value))} className="h-8 text-xs" /></div>
            </div>

            {/* Subtotal and Balance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-xs font-semibold">SubTotal</Label><Input type="number" value={charges.reduce((sum, c) => sum + c.amount, 0)} readOnly className="h-8 text-xs bg-muted font-semibold" /></div>
              <div className="space-y-1"><Label className="text-xs font-semibold">Balance</Label><Input type="number" value={balance} readOnly className="h-8 text-xs bg-muted font-semibold text-red-600" /></div>
            </div>

            {/* Proof of Delivery */}
            <div className="space-y-1"><Label className="text-xs">Proof Of Delivery</Label><Select value={proofOfDelivery} onValueChange={setProofOfDelivery}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent><SelectItem value="POD">POD</SelectItem><SelectItem value="Manual">Manual</SelectItem><SelectItem value="Electronic">Electronic</SelectItem></SelectContent></Select></div>

            {/* Buttons */}
            <div className="flex flex-wrap justify-end gap-3 pt-4 border-t">
              <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-green-600" disabled={loading}><Save className="mr-1 h-3 w-3" />SAVE</Button>
              <Button onClick={resetForm} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
              <Button onClick={() => handleDelete(editId!)} variant="destructive" size="sm" className="h-8 text-xs" disabled={!editId}><Trash2 className="mr-1 h-3 w-3" />DELETE</Button>
              <Button onClick={handlePrint} variant="outline" size="sm" className="h-8 text-xs"><Printer className="mr-1 h-3 w-3" />PRINT</Button>
            </div>
          </TabsContent>

          {/* Image Tab */}
          <TabsContent value="image" className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <div className="mb-4"><Label className="text-xs">Images</Label><Input type="file" accept="image/jpeg,image/jpg" onChange={handleImageUpload} className="h-8 text-xs file:h-7 file:text-xs" /></div>
              <p className="text-[10px] text-muted-foreground mb-3">You can only upload JPG/JPEG files.</p>
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                  {images.map((img, idx) => (<div key={idx} className="relative border rounded-md p-2"><img src={img} alt={`Upload ${idx+1}`} className="w-full h-24 object-cover rounded" /><Button variant="ghost" size="sm" onClick={() => removeImage(idx)} className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-500 text-white rounded-full"><X className="h-3 w-3" /></Button></div>))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap justify-end gap-3 pt-4 border-t">
              <Button onClick={handleSave} size="sm" className="h-8 text-xs bg-green-600"><Save className="mr-1 h-3 w-3" />SAVE</Button>
              <Button onClick={resetForm} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
              <Button onClick={() => handleDelete(editId!)} variant="destructive" size="sm" className="h-8 text-xs" disabled={!editId}><Trash2 className="mr-1 h-3 w-3" />DELETE</Button>
              <Button onClick={handlePrint} variant="outline" size="sm" className="h-8 text-xs"><Printer className="mr-1 h-3 w-3" />PRINT</Button>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Search Tab */}
      {activeMainTab === "search" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 border rounded-md bg-muted/20">
            <div className="space-y-1"><Label className="text-xs">Branch</Label><Select value={searchBranch} onValueChange={setSearchBranch}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{branchOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">From Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{format(searchFromDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchFromDate} onSelect={(d) => d && setSearchFromDate(d)} /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">To Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{format(searchToDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchToDate} onSelect={(d) => d && setSearchToDate(d)} /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">DR #</Label><Input value={searchDrNo} onChange={(e) => setSearchDrNo(e.target.value)} placeholder="Enter DR Number" className="h-8 text-xs" /></div>
            <div className="flex items-end"><Button onClick={handleSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3.5 w-3.5" />SHOW</Button></div>
          </div>

          <div className="rounded-md border overflow-x-auto"><div className="min-w-[1000px]"><Table className="text-xs"><TableHeader><TableRow className="bg-muted/50"><TableHead>S#</TableHead><TableHead>DR #</TableHead><TableHead>DR Date</TableHead><TableHead>GR #</TableHead><TableHead>Delivery Branch</TableHead><TableHead>Booking Branch</TableHead><TableHead>Division Name</TableHead><TableHead>Consignee</TableHead><TableHead>DDR #</TableHead><TableHead>Bill #</TableHead><TableHead>Customer</TableHead><TableHead>Amount</TableHead><TableHead className="w-20">Action</TableHead></TableRow></TableHeader><TableBody>{paginatedResults.length === 0 ? (<TableRow><TableCell colSpan={13} className="text-center py-8">No records found</TableCell></TableRow>) : (paginatedResults.map((record, idx) => (<TableRow key={record.id}><TableCell>{(currentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell>{record.gatePassNo}</TableCell><TableCell>{format(record.date, "dd-MM-yyyy")}</TableCell><TableCell>{record.grNo}</TableCell><TableCell>{record.branch}</TableCell><TableCell>{record.branch}</TableCell><TableCell>-</TableCell><TableCell>{record.consignee}</TableCell><TableCell>{record.ddrNo}</TableCell><TableCell>-</TableCell><TableCell>{record.customer}</TableCell><TableCell>₹{record.charges.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => handleEdit(record)} className="h-6 w-6 p-0 text-blue-500"><Eye className="h-3 w-3" /></Button></TableCell></TableRow>)))}</TableBody></Table></div></div>
          {totalPages > 1 && (<div className="flex justify-center gap-1"><Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1} className="h-7 text-xs">Previous</Button><span className="px-3 py-1 text-xs">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages} className="h-7 text-xs">Next</Button></div>)}
        </div>
      )}

      {/* Cancelled Tab */}
      {activeMainTab === "cancelled" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 border rounded-md bg-muted/20">
            <div className="space-y-1"><Label className="text-xs">From Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />30-04-2026</Button></PopoverTrigger><PopoverContent><Calendar mode="single" /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">To Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />30-04-2026</Button></PopoverTrigger><PopoverContent><Calendar mode="single" /></PopoverContent></Popover></div>
            <div className="flex items-end"><Button className="h-8 text-xs"><Search className="mr-1 h-3.5 w-3.5" />SHOW</Button></div>
          </div>
          <div className="rounded-md border overflow-x-auto"><div className="min-w-[800px]"><Table className="text-xs"><TableHeader><TableRow className="bg-muted/50"><TableHead>S#</TableHead><TableHead>Branch</TableHead><TableHead>DR #</TableHead><TableHead>DR Date</TableHead><TableHead>GR #</TableHead><TableHead>GR Date</TableHead><TableHead>Pckgs</TableHead><TableHead>Charge Weight</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell colSpan={8} className="text-center py-8">No items to display</TableCell></TableRow></TableBody></Table></div></div>
        </div>
      )}
    </div>
  );
}