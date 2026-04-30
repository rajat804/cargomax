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
  Pencil,
  Trash2,
  Plus,
  Eye,
  Check,
  X,
  Truck,
  Package,
  MapPin,
  Building,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Printer,
  Download,
  AlertCircle,
  TrendingUp,
  Calculator,
  Shield,
  Users,
  FileSpreadsheet,
  PlusCircle,
  MinusCircle,
  User,
  UserCheck,
  MessageSquare,
  DollarSign,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface InvoiceItem {
  id: number;
  invoiceNo: string;
  date: Date;
  value: string;
  awayBillNo: string;
  awayBillDate: Date;
  valueUpTo: string;
}

interface BookingRecord {
  id: number;
  grNo: string;
  grDate: Date;
  bookingFrom: string;
  destination: string;
  deliveryPoint: string;
  collectionAt: string;
  consignorName: string;
  consignorCode: string;
  consignorAddress: string;
  consignorCity: string;
  consignorState: string;
  consignorPincode: string;
  consignorMobile: string;
  consignorEmail: string;
  consignorGst: string;
  consigneeName: string;
  consigneeCode: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeState: string;
  consigneePincode: string;
  consigneeMobile: string;
  consigneeEmail: string;
  consigneeGst: string;
  deliveryType: string;
  mkExecutive: string;
  toPay: boolean;
  gst: boolean;
  surface: boolean;
  partLoad: boolean;
  freightOn: string;
  chargeWeight: number;
  manualRates: boolean;
  basicFreight: number;
  loadingCharges: number;
  unloadingCharges: number;
  doorDeliveryCharges: number;
  otherCharges: number;
  totalFreight: number;
  remarks: string;
  roRemarks: string;
  gpRemarks: string;
  insuranceCoveredBy: string;
  insuranceNo: string;
  insuranceDate: Date;
  insuranceCompany: string;
  insuranceAmount: number;
  invoices: InvoiceItem[];
}

const deliveryTypeOptions = [
  { value: "door_delivery", label: "Door Delivery" },
  { value: "pickup", label: "Pickup" },
  { value: "self_collection", label: "Self Collection" },
];

const insuranceCoveredByOptions = [
  { value: "carrier", label: "Carrier" },
  { value: "consignor", label: "Consignor" },
  { value: "consignee", label: "Consignee" },
];

const freightOnOptions = [
  { value: "to_pay", label: "To Pay" },
  { value: "prepaid", label: "Prepaid" },
  { value: "collect", label: "Collect" },
];

const loadTypeOptions = [
  { value: "ftl", label: "FTL" },
  { value: "ltl", label: "LTL" },
  { value: "container", label: "Container" },
];

export default function BookingComputerizeGRL() {
  const [activeMainTab, setActiveMainTab] = useState<"entry" | "search" | "cancelled">("entry");
  const [activeFormTab, setActiveFormTab] = useState<string>("basic");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Basic Info state
  const [grNo, setGrNo] = useState<string>("");
  const [grDate, setGrDate] = useState<Date>(new Date());
  const [bookingFrom, setBookingFrom] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [deliveryPoint, setDeliveryPoint] = useState<string>("");
  const [collectionAt, setCollectionAt] = useState<string>("");
  const [deliveryType, setDeliveryType] = useState<string>("");
  const [mkExecutive, setMkExecutive] = useState<string>("");
  const [loadType, setLoadType] = useState<string>("");

  // Consignor state
  const [consignorName, setConsignorName] = useState<string>("");
  const [consignorCode, setConsignorCode] = useState<string>("");
  const [consignorAddress, setConsignorAddress] = useState<string>("");
  const [consignorCity, setConsignorCity] = useState<string>("");
  const [consignorState, setConsignorState] = useState<string>("");
  const [consignorPincode, setConsignorPincode] = useState<string>("");
  const [consignorMobile, setConsignorMobile] = useState<string>("");
  const [consignorEmail, setConsignorEmail] = useState<string>("");
  const [consignorGst, setConsignorGst] = useState<string>("");

  // Consignee state
  const [consigneeName, setConsigneeName] = useState<string>("");
  const [consigneeCode, setConsigneeCode] = useState<string>("");
  const [consigneeAddress, setConsigneeAddress] = useState<string>("");
  const [consigneeCity, setConsigneeCity] = useState<string>("");
  const [consigneeState, setConsigneeState] = useState<string>("");
  const [consigneePincode, setConsigneePincode] = useState<string>("");
  const [consigneeMobile, setConsigneeMobile] = useState<string>("");
  const [consigneeEmail, setConsigneeEmail] = useState<string>("");
  const [consigneeGst, setConsigneeGst] = useState<string>("");

  // Freight state
  const [freightOn, setFreightOn] = useState<string>("");
  const [chargeWeight, setChargeWeight] = useState<number>(0);
  const [basicFreight, setBasicFreight] = useState<number>(0);
  const [loadingCharges, setLoadingCharges] = useState<number>(0);
  const [unloadingCharges, setUnloadingCharges] = useState<number>(0);
  const [doorDeliveryCharges, setDoorDeliveryCharges] = useState<number>(0);
  const [otherCharges, setOtherCharges] = useState<number>(0);
  const [totalFreight, setTotalFreight] = useState<number>(0);

  // Status
  const [toPay, setToPay] = useState<boolean>(false);
  const [gst, setGst] = useState<boolean>(false);
  const [surface, setSurface] = useState<boolean>(false);
  const [partLoad, setPartLoad] = useState<boolean>(false);
  const [manualRates, setManualRates] = useState<boolean>(false);

  // Remarks state
  const [remarks, setRemarks] = useState<string>("");
  const [roRemarks, setRoRemarks] = useState<string>("");
  const [gpRemarks, setGpRemarks] = useState<string>("");

  // Insurance state
  const [insuranceCoveredBy, setInsuranceCoveredBy] = useState<string>("");
  const [insuranceNo, setInsuranceNo] = useState<string>("");
  const [insuranceDate, setInsuranceDate] = useState<Date>(new Date());
  const [insuranceCompany, setInsuranceCompany] = useState<string>("");
  const [insuranceAmount, setInsuranceAmount] = useState<number>(0);

  // Invoices
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    { id: 1, invoiceNo: "", date: new Date(), value: "", awayBillNo: "", awayBillDate: new Date(), valueUpTo: "" },
  ]);

  // Search state
  const [searchFromDate, setSearchFromDate] = useState<Date>(new Date());
  const [searchToDate, setSearchToDate] = useState<Date>(new Date());
  const [searchGrNo, setSearchGrNo] = useState<string>("");
  const [searchResults, setSearchResults] = useState<BookingRecord[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<BookingRecord[]>([]);

  const generateGrNo = (): string => {
    const count = savedRecords.length + 1;
    return `GR${String(count).padStart(6, "0")}`;
  };

  const calculateTotalFreight = () => {
    const total = basicFreight + loadingCharges + unloadingCharges + doorDeliveryCharges + otherCharges;
    setTotalFreight(total);
    return total;
  };

  const resetForm = (): void => {
    setGrNo(generateGrNo());
    setGrDate(new Date());
    setBookingFrom("");
    setDestination("");
    setDeliveryPoint("");
    setCollectionAt("");
    setDeliveryType("");
    setMkExecutive("");
    setLoadType("");
    setConsignorName("");
    setConsignorCode("");
    setConsignorAddress("");
    setConsignorCity("");
    setConsignorState("");
    setConsignorPincode("");
    setConsignorMobile("");
    setConsignorEmail("");
    setConsignorGst("");
    setConsigneeName("");
    setConsigneeCode("");
    setConsigneeAddress("");
    setConsigneeCity("");
    setConsigneeState("");
    setConsigneePincode("");
    setConsigneeMobile("");
    setConsigneeEmail("");
    setConsigneeGst("");
    setFreightOn("");
    setChargeWeight(0);
    setBasicFreight(0);
    setLoadingCharges(0);
    setUnloadingCharges(0);
    setDoorDeliveryCharges(0);
    setOtherCharges(0);
    setTotalFreight(0);
    setToPay(false);
    setGst(false);
    setSurface(false);
    setPartLoad(false);
    setManualRates(false);
    setRemarks("");
    setRoRemarks("");
    setGpRemarks("");
    setInsuranceCoveredBy("");
    setInsuranceNo("");
    setInsuranceDate(new Date());
    setInsuranceCompany("");
    setInsuranceAmount(0);
    setInvoices([{ id: 1, invoiceNo: "", date: new Date(), value: "", awayBillNo: "", awayBillDate: new Date(), valueUpTo: "" }]);
    setEditId(null);
    setActiveFormTab("basic");
  };

  const addInvoiceRow = () => {
    const newInvoice: InvoiceItem = {
      id: Date.now(),
      invoiceNo: "",
      date: new Date(),
      value: "",
      awayBillNo: "",
      awayBillDate: new Date(),
      valueUpTo: "",
    };
    setInvoices([...invoices, newInvoice]);
  };

  const updateInvoice = (id: number, field: keyof InvoiceItem, value: any) => {
    setInvoices(invoices.map((inv) => (inv.id === id ? { ...inv, [field]: value } : inv)));
  };

  const removeInvoice = (id: number) => {
    if (invoices.length > 1) {
      setInvoices(invoices.filter((inv) => inv.id !== id));
    }
  };

  const handleSave = () => {
    if (!consignorName) {
      alert("Please enter Consignor Name");
      return;
    }
    if (!consigneeName) {
      alert("Please enter Consignee Name");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newRecord: BookingRecord = {
        id: editId || Date.now(),
        grNo,
        grDate,
        bookingFrom,
        destination,
        deliveryPoint,
        collectionAt,
        consignorName,
        consignorCode,
        consignorAddress,
        consignorCity,
        consignorState,
        consignorPincode,
        consignorMobile,
        consignorEmail,
        consignorGst,
        consigneeName,
        consigneeCode,
        consigneeAddress,
        consigneeCity,
        consigneeState,
        consigneePincode,
        consigneeMobile,
        consigneeEmail,
        consigneeGst,
        deliveryType,
        mkExecutive,
        toPay,
        gst,
        surface,
        partLoad,
        freightOn,
        chargeWeight,
        manualRates,
        basicFreight,
        loadingCharges,
        unloadingCharges,
        doorDeliveryCharges,
        otherCharges,
        totalFreight,
        remarks,
        roRemarks,
        gpRemarks,
        insuranceCoveredBy,
        insuranceNo,
        insuranceDate,
        insuranceCompany,
        insuranceAmount,
        invoices,
      };

      if (editId) {
        setSavedRecords(savedRecords.map((record) => (record.id === editId ? newRecord : record)));
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
    let results = [...savedRecords];
    if (searchGrNo) {
      results = results.filter((r) => r.grNo.toLowerCase().includes(searchGrNo.toLowerCase()));
    }
    if (searchFromDate) {
      results = results.filter((r) => r.grDate >= searchFromDate);
    }
    if (searchToDate) {
      results = results.filter((r) => r.grDate <= searchToDate);
    }
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleEdit = (record: BookingRecord) => {
    setEditId(record.id);
    setGrNo(record.grNo);
    setGrDate(record.grDate);
    setBookingFrom(record.bookingFrom);
    setDestination(record.destination);
    setDeliveryPoint(record.deliveryPoint);
    setCollectionAt(record.collectionAt);
    setConsignorName(record.consignorName);
    setConsignorCode(record.consignorCode);
    setConsignorAddress(record.consignorAddress);
    setConsignorCity(record.consignorCity);
    setConsignorState(record.consignorState);
    setConsignorPincode(record.consignorPincode);
    setConsignorMobile(record.consignorMobile);
    setConsignorEmail(record.consignorEmail);
    setConsignorGst(record.consignorGst);
    setConsigneeName(record.consigneeName);
    setConsigneeCode(record.consigneeCode);
    setConsigneeAddress(record.consigneeAddress);
    setConsigneeCity(record.consigneeCity);
    setConsigneeState(record.consigneeState);
    setConsigneePincode(record.consigneePincode);
    setConsigneeMobile(record.consigneeMobile);
    setConsigneeEmail(record.consigneeEmail);
    setConsigneeGst(record.consigneeGst);
    setDeliveryType(record.deliveryType);
    setMkExecutive(record.mkExecutive);
    setToPay(record.toPay);
    setGst(record.gst);
    setSurface(record.surface);
    setPartLoad(record.partLoad);
    setFreightOn(record.freightOn);
    setChargeWeight(record.chargeWeight);
    setManualRates(record.manualRates);
    setBasicFreight(record.basicFreight);
    setLoadingCharges(record.loadingCharges);
    setUnloadingCharges(record.unloadingCharges);
    setDoorDeliveryCharges(record.doorDeliveryCharges);
    setOtherCharges(record.otherCharges);
    setTotalFreight(record.totalFreight);
    setRemarks(record.remarks);
    setRoRemarks(record.roRemarks);
    setGpRemarks(record.gpRemarks);
    setInsuranceCoveredBy(record.insuranceCoveredBy);
    setInsuranceNo(record.insuranceNo);
    setInsuranceDate(record.insuranceDate);
    setInsuranceCompany(record.insuranceCompany);
    setInsuranceAmount(record.insuranceAmount);
    setInvoices(record.invoices);
    setActiveMainTab("entry");
    setActiveFormTab("basic");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setSavedRecords(savedRecords.filter((record) => record.id !== id));
      setSearchResults(searchResults.filter((record) => record.id !== id));
      alert("Record deleted successfully!");
    }
  };

  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">BOOKING COMPUTERIZE GRL</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => {
            setActiveMainTab("entry");
            resetForm();
          }}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            activeMainTab === "entry"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Entry
        </button>
        <button
          onClick={() => {
            setActiveMainTab("search");
            handleSearch();
          }}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            activeMainTab === "search"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Search
        </button>
        <button
          onClick={() => {
            setActiveMainTab("cancelled");
          }}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            activeMainTab === "cancelled"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Cancelled List
        </button>
      </div>

      {/* Entry Tab */}
      {activeMainTab === "entry" && (
        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 justify-end">
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <PlusCircle className="mr-1 h-3 w-3" /> Add More...
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <TrendingUp className="mr-1 h-3 w-3" /> Free Freight On
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Calculator className="mr-1 h-3 w-3" /> Manual Rates
            </Button>
            <Button 
              onClick={calculateTotalFreight} 
              variant="default" 
              size="sm" 
              className="h-7 text-xs bg-green-600 hover:bg-green-700"
            >
              <Calculator className="mr-1 h-3 w-3" /> Calculate Freight
            </Button>
          </div>

          {/* Basic Information */}
          <div className="border rounded-md p-3">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">GR #</Label>
                <Input value={grNo} readOnly className="h-8 text-xs bg-muted" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">GR Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-8 w-full justify-start text-left text-xs">
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {format(grDate, "dd-MM-yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={grDate} onSelect={(date) => date && setGrDate(date)} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Booking From</Label>
                <Input value={bookingFrom} onChange={(e) => setBookingFrom(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Destination</Label>
                <Input value={destination} onChange={(e) => setDestination(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Delivery Point</Label>
                <Input value={deliveryPoint} onChange={(e) => setDeliveryPoint(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Collection At</Label>
                <Input value={collectionAt} onChange={(e) => setCollectionAt(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Delivery Type</Label>
                <Select value={deliveryType} onValueChange={setDeliveryType}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{deliveryTypeOptions.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">MKT. Executive</Label>
                <Input value={mkExecutive} onChange={(e) => setMkExecutive(e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Load Type</Label>
                <Select value={loadType} onValueChange={setLoadType}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                  <SelectContent>{loadTypeOptions.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Form Tabs for Consignor, Consignee, Freight, Remarks, Insurance */}
          <Tabs value={activeFormTab} onValueChange={setActiveFormTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50">
              <TabsTrigger value="basic" className="text-xs py-1.5">
                <FileText className="h-3 w-3 mr-1" /> Basic Info
              </TabsTrigger>
              <TabsTrigger value="consignor" className="text-xs py-1.5">
                <Building className="h-3 w-3 mr-1" /> Consignor
              </TabsTrigger>
              <TabsTrigger value="consignee" className="text-xs py-1.5">
                <Users className="h-3 w-3 mr-1" /> Consignee
              </TabsTrigger>
              <TabsTrigger value="freight" className="text-xs py-1.5">
                <DollarSign className="h-3 w-3 mr-1" /> Freight
              </TabsTrigger>
              <TabsTrigger value="other" className="text-xs py-1.5">
                <Settings className="h-3 w-3 mr-1" /> Other
              </TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="mt-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Freight On</Label>
                  <Select value={freightOn} onValueChange={setFreightOn}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                    <SelectContent>{freightOnOptions.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Charge Weight (kg)</Label>
                  <Input type="number" value={chargeWeight} onChange={(e) => setChargeWeight(Number(e.target.value))} className="h-8 text-xs" />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={toPay} onChange={(e) => setToPay(e.target.checked)} className="h-3.5 w-3.5" />
                  <span className="text-xs">TO PAY</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={gst} onChange={(e) => setGst(e.target.checked)} className="h-3.5 w-3.5" />
                  <span className="text-xs">GST</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={surface} onChange={(e) => setSurface(e.target.checked)} className="h-3.5 w-3.5" />
                  <span className="text-xs">SURFACE</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={partLoad} onChange={(e) => setPartLoad(e.target.checked)} className="h-3.5 w-3.5" />
                  <span className="text-xs">PART LOAD</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={manualRates} onChange={(e) => setManualRates(e.target.checked)} className="h-3.5 w-3.5" />
                  <span className="text-xs">Manual Rates</span>
                </label>
              </div>
            </TabsContent>

            {/* Consignor Tab */}
            <TabsContent value="consignor" className="mt-3">
              <div className="border rounded-md">
                <div className="bg-muted/50 px-3 py-2 border-b">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Building className="h-4 w-4" /> CONSIGNOR DETAILS
                  </h3>
                </div>
                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div><Label className="text-xs">Dealer Code</Label><Input value={consignorCode} onChange={(e) => setConsignorCode(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Name *</Label><Input value={consignorName} onChange={(e) => setConsignorName(e.target.value)} className="h-8 text-xs" /></div>
                  <div className="sm:col-span-2"><Label className="text-xs">Address</Label><Input value={consignorAddress} onChange={(e) => setConsignorAddress(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">City</Label><Input value={consignorCity} onChange={(e) => setConsignorCity(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">State</Label><Input value={consignorState} onChange={(e) => setConsignorState(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Pincode</Label><Input value={consignorPincode} onChange={(e) => setConsignorPincode(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Mobile No.</Label><Input value={consignorMobile} onChange={(e) => setConsignorMobile(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Email ID</Label><Input value={consignorEmail} onChange={(e) => setConsignorEmail(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">GST</Label><Input value={consignorGst} onChange={(e) => setConsignorGst(e.target.value)} className="h-8 text-xs uppercase" /></div>
                </div>
              </div>
            </TabsContent>

            {/* Consignee Tab */}
            <TabsContent value="consignee" className="mt-3">
              <div className="border rounded-md">
                <div className="bg-muted/50 px-3 py-2 border-b">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" /> CONSIGNEE DETAILS
                  </h3>
                </div>
                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div><Label className="text-xs">Dealer Code</Label><Input value={consigneeCode} onChange={(e) => setConsigneeCode(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Name *</Label><Input value={consigneeName} onChange={(e) => setConsigneeName(e.target.value)} className="h-8 text-xs" /></div>
                  <div className="sm:col-span-2"><Label className="text-xs">Address</Label><Input value={consigneeAddress} onChange={(e) => setConsigneeAddress(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">City</Label><Input value={consigneeCity} onChange={(e) => setConsigneeCity(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">State</Label><Input value={consigneeState} onChange={(e) => setConsigneeState(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Pincode</Label><Input value={consigneePincode} onChange={(e) => setConsigneePincode(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Mobile No.</Label><Input value={consigneeMobile} onChange={(e) => setConsigneeMobile(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Email ID</Label><Input value={consigneeEmail} onChange={(e) => setConsigneeEmail(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">GST</Label><Input value={consigneeGst} onChange={(e) => setConsigneeGst(e.target.value)} className="h-8 text-xs uppercase" /></div>
                </div>
              </div>
            </TabsContent>

            {/* Freight Tab */}
            <TabsContent value="freight" className="mt-3">
              <div className="border rounded-md">
                <div className="bg-muted/50 px-3 py-2 border-b">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4" /> FREIGHT DETAILS
                  </h3>
                </div>
                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div><Label className="text-xs">Basic Freight (₹)</Label><Input type="number" value={basicFreight} onChange={(e) => setBasicFreight(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Loading Charges (₹)</Label><Input type="number" value={loadingCharges} onChange={(e) => setLoadingCharges(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Unloading Charges (₹)</Label><Input type="number" value={unloadingCharges} onChange={(e) => setUnloadingCharges(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Door Delivery Charges (₹)</Label><Input type="number" value={doorDeliveryCharges} onChange={(e) => setDoorDeliveryCharges(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Other Charges (₹)</Label><Input type="number" value={otherCharges} onChange={(e) => setOtherCharges(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div className="bg-muted/30 p-2 rounded-md">
                    <Label className="text-xs font-semibold">Total Freight (₹)</Label>
                    <p className="text-lg font-bold text-primary">{totalFreight.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Other Tab (Remarks + Insurance) */}
            <TabsContent value="other" className="mt-3 space-y-3">
              {/* Remarks Section */}
              <div className="border rounded-md">
                <div className="bg-muted/50 px-3 py-2 border-b">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> REMARKS
                  </h3>
                </div>
                <div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1"><Label className="text-xs">Remarks</Label><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs">RO Remarks</Label><Textarea value={roRemarks} onChange={(e) => setRoRemarks(e.target.value)} rows={2} className="text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs">GP Remarks</Label><Textarea value={gpRemarks} onChange={(e) => setGpRemarks(e.target.value)} rows={2} className="text-xs" /></div>
                </div>
              </div>

              {/* Insurance Section */}
              <div className="border rounded-md">
                <div className="bg-muted/50 px-3 py-2 border-b">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4" /> INSURANCE DETAILS
                  </h3>
                </div>
                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div><Label className="text-xs">Insurance Covered By</Label><Select value={insuranceCoveredBy} onValueChange={setInsuranceCoveredBy}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{insuranceCoveredByOptions.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent></Select></div>
                  <div><Label className="text-xs">Insurance #</Label><Input value={insuranceNo} onChange={(e) => setInsuranceNo(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Insurance Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{format(insuranceDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={insuranceDate} onSelect={(date) => date && setInsuranceDate(date)} /></PopoverContent></Popover></div>
                  <div><Label className="text-xs">Insurance Company</Label><Input value={insuranceCompany} onChange={(e) => setInsuranceCompany(e.target.value)} className="h-8 text-xs" /></div>
                  <div><Label className="text-xs">Insurance Amount (₹)</Label><Input type="number" value={insuranceAmount} onChange={(e) => setInsuranceAmount(Number(e.target.value))} className="h-8 text-xs" /></div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Invoices Table */}
          <div className="rounded-md border">
            <div className="bg-muted/50 px-3 py-2 border-b flex justify-between items-center">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" /> Invoices
              </h3>
              <Button onClick={addInvoiceRow} variant="ghost" size="sm" className="h-7 text-xs">
                <Plus className="mr-1 h-3 w-3" /> ADD INVOICE
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Value (₹)</TableHead>
                    <TableHead>Away Bill #</TableHead>
                    <TableHead>Away Date</TableHead>
                    <TableHead>Value Up to</TableHead>
                    <TableHead className="w-12">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv, idx) => (
                    <TableRow key={inv.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell><Input value={inv.invoiceNo} onChange={(e) => updateInvoice(inv.id, "invoiceNo", e.target.value)} className="h-7 w-28 text-xs" /></TableCell>
                      <TableCell><Popover><PopoverTrigger asChild><Button variant="outline" className="h-7 w-28 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(inv.date, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={inv.date} onSelect={(date) => date && updateInvoice(inv.id, "date", date)} /></PopoverContent></Popover></TableCell>
                      <TableCell><Input value={inv.value} onChange={(e) => updateInvoice(inv.id, "value", e.target.value)} className="h-7 w-24 text-xs" /></TableCell>
                      <TableCell><Input value={inv.awayBillNo} onChange={(e) => updateInvoice(inv.id, "awayBillNo", e.target.value)} className="h-7 w-28 text-xs" /></TableCell>
                      <TableCell><Popover><PopoverTrigger asChild><Button variant="outline" className="h-7 w-28 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(inv.awayBillDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={inv.awayBillDate} onSelect={(date) => date && updateInvoice(inv.id, "awayBillDate", date)} /></PopoverContent></Popover></TableCell>
                      <TableCell><Input value={inv.valueUpTo} onChange={(e) => updateInvoice(inv.id, "valueUpTo", e.target.value)} className="h-7 w-24 text-xs" /></TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => removeInvoice(inv.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={handleSave} size="sm" className="h-8 text-xs" disabled={loading}>
              <Save className="mr-1 h-3 w-3" />
              {editId ? "UPDATE" : "SAVE"}
            </Button>
            <Button onClick={resetForm} variant="outline" size="sm" className="h-8 text-xs">
              <RefreshCw className="mr-1 h-3 w-3" /> CLEAR
            </Button>
          </div>
        </div>
      )}

      {/* Search Tab */}
      {activeMainTab === "search" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 border rounded-md bg-muted/20">
            <div className="space-y-1"><Label className="text-xs">From Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{format(searchFromDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchFromDate} onSelect={(date) => date && setSearchFromDate(date)} /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">To Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{format(searchToDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={searchToDate} onSelect={(date) => date && setSearchToDate(date)} /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">GR #</Label><Input value={searchGrNo} onChange={(e) => setSearchGrNo(e.target.value)} placeholder="Enter GR Number" className="h-8 text-xs" /></div>
            <div className="flex items-end"><Button onClick={handleSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3.5 w-3.5" />SHOW</Button></div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1000px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>S#</TableHead><TableHead>GR #</TableHead><TableHead>GR Date</TableHead><TableHead>Origin</TableHead><TableHead>Destination</TableHead>
                    <TableHead>Consignor</TableHead><TableHead>Consignee</TableHead><TableHead>Freight (₹)</TableHead><TableHead className="w-20">Options</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow><TableCell colSpan={9} className="text-center py-8">No records found</TableCell></TableRow>
                  ) : (
                    paginatedResults.map((record, idx) => (
                      <TableRow key={record.id}>
                        <TableCell>{(currentPage-1)*itemsPerPage+idx+1}</TableCell>
                        <TableCell className="font-mono">{record.grNo}</TableCell>
                        <TableCell>{format(record.grDate, "dd-MM-yyyy")}</TableCell>
                        <TableCell>{record.bookingFrom}</TableCell>
                        <TableCell>{record.destination}</TableCell>
                        <TableCell>{record.consignorName}</TableCell>
                        <TableCell>{record.consigneeName}</TableCell>
                        <TableCell>₹{record.totalFreight.toLocaleString()}</TableCell>
                        <TableCell><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => handleEdit(record)} className="h-6 w-6 p-0 text-blue-500"><Pencil className="h-3 w-3" /></Button><Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></div></TableCell>
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
              <span className="px-3 py-1 text-xs">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages} className="h-7 text-xs">Next</Button>
            </div>
          )}
        </div>
      )}

      {/* Cancelled List Tab */}
      {activeMainTab === "cancelled" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 border rounded-md bg-muted/20">
            <div className="space-y-1"><Label className="text-xs">From Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />24-04-2026</Button></PopoverTrigger><PopoverContent><Calendar mode="single" /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">To Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />24-04-2026</Button></PopoverTrigger><PopoverContent><Calendar mode="single" /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">GR #</Label><Input placeholder="Enter GR Number" className="h-8 text-xs" /></div>
            <div className="flex items-end"><Button className="h-8 text-xs"><Search className="mr-1 h-3.5 w-3.5" />SHOW BOOKING</Button></div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[800px]">
              <Table className="text-xs">
                <TableHeader><TableRow className="bg-muted/50"><TableHead>S#</TableHead><TableHead>GR #</TableHead><TableHead>GR Date</TableHead><TableHead>Origin</TableHead><TableHead>Destination</TableHead><TableHead>Consignor</TableHead><TableHead>Consignee</TableHead><TableHead>Freight</TableHead><TableHead className="w-20">Action</TableHead></TableRow></TableHeader>
                <TableBody><TableRow><TableCell colSpan={9} className="text-center py-8">No cancelled records found</TableCell></TableRow></TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}