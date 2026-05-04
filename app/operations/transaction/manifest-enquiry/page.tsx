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
  Truck,
  MapPin,
  User,
  Phone,
  Building,
  Clock,
  Edit,
  Send,
  Mail,
  Smartphone,
  FileSpreadsheet,
  Package,
  Weight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface GRDetail {
  id: number;
  branch: string;
  grNo: string;
  origin: string;
  destination: string;
  bookedPckgs: number;
  dispatchPckgs: number;
  rcvdPckgs: number;
  shortExcess: number;
  dispatchWeight: number;
  consignorName: string;
  consigneeName: string;
  cngrGST: string;
  cngeGST: string;
  eWayBillNo: string;
}

interface MRDetail {
  id: number;
  mrNo: string;
  mrDate: Date;
  receivedAmount: number;
  rebate: number;
  paymentMode: string;
  chequeNo: string;
  chequeDate: Date;
  remarks: string;
  reverStatus: string;
  voucherNo: string;
  voucherStatus: string;
  tds: number;
}

// Options
const manifestTypeOptions = ["OUTSTATION", "LOCAL", "INCOMING", "LONG ROUTE"];
const branchOptions = ["CORPORATE OFFICE", "DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA"];
const modeTypeOptions = ["Surface", "Air", "Rail", "Sea"];
const modeNameOptions = ["DL01LA0837", "DL01LAD6175", "DL01LAJ4226", "DL01LAQ0859"];
const driverOptions = ["Rajesh Kumar", "Suresh Singh", "Mahesh Sharma", "Ramesh Gupta"];
const statusOptions = ["Active", "In Transit", "Arrived", "Delivered", "Cancelled"];

export default function ManifestEnquiry() {
  const [activeTab, setActiveTab] = useState<"gr" | "mr">("gr");
  const [loading, setLoading] = useState<boolean>(false);
  const [pickupManifest, setPickupManifest] = useState<boolean>(false);

  // Form State
  const [manifestType, setManifestType] = useState<string>("OUTSTATION");
  const [manifestNo, setManifestNo] = useState<string>("");
  const [branch, setBranch] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [manifestDate, setManifestDate] = useState<Date>(new Date());
  const [consolidatedEWayBillNo, setConsolidatedEWayBillNo] = useState<string>("");
  const [arrivedOn, setArrivedOn] = useState<Date>(new Date());
  const [arrivalNo, setArrivalNo] = useState<string>("");
  const [modeType, setModeType] = useState<string>("");
  const [modeName, setModeName] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [loadedBy, setLoadedBy] = useState<string>("");
  const [freightMemoNo, setFreightMemoNo] = useState<string>("");
  const [freightDate, setFreightDate] = useState<Date>(new Date());
  const [totalFreightAmount, setTotalFreightAmount] = useState<number>(0);
  const [division, setDivision] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [unloadedBy, setUnloadedBy] = useState<string>("");
  const [arrivalStatus, setArrivalStatus] = useState<string>("");

  // Table Data
  const [grDetails, setGrDetails] = useState<GRDetail[]>([
    { id: 1, branch: "DELHI", grNo: "GR001", origin: "DELHI", destination: "MUMBAI", bookedPckgs: 50, dispatchPckgs: 50, rcvdPckgs: 48, shortExcess: -2, dispatchWeight: 2500, consignorName: "M/s ABC Traders", consigneeName: "M/s XYZ Enterprises", cngrGST: "07ABCDE1234F1Z5", cngeGST: "09FGHIJ5678K1Z6", eWayBillNo: "EWB001" },
    { id: 2, branch: "DELHI", grNo: "GR002", origin: "DELHI", destination: "BANGALORE", bookedPckgs: 30, dispatchPckgs: 30, rcvdPckgs: 30, shortExcess: 0, dispatchWeight: 1800, consignorName: "M/s PQR Ltd", consigneeName: "M/s LMN Corp", cngrGST: "07ABCDE1234F1Z5", cngeGST: "09FGHIJ5678K1Z6", eWayBillNo: "EWB002" },
  ]);

  const [mrDetails, setMrDetails] = useState<MRDetail[]>([
    { id: 1, mrNo: "MR001", mrDate: new Date(), receivedAmount: 15000, rebate: 500, paymentMode: "Cheque", chequeNo: "CHQ001", chequeDate: new Date(), remarks: "Payment received", reverStatus: "Completed", voucherNo: "V001", voucherStatus: "Approved", tds: 1500 },
    { id: 2, mrNo: "MR002", mrDate: new Date(), receivedAmount: 10000, rebate: 0, paymentMode: "Cash", chequeNo: "", chequeDate: new Date(), remarks: "Partial payment", reverStatus: "Pending", voucherNo: "V002", voucherStatus: "Pending", tds: 1000 },
  ]);

  const handleShowDetails = () => {
    if (!manifestNo) {
      alert("Please enter Manifest #");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      // Simulate loading manifest details
      setBranch("DELHI");
      setTo("MUMBAI");
      setManifestDate(new Date());
      setConsolidatedEWayBillNo("EWB001");
      setArrivedOn(new Date());
      setArrivalNo("AR001");
      setModeType("Surface");
      setModeName("DL01LA0837");
      setDriverName("Rajesh Kumar");
      setMobile("9876543210");
      setLoadedBy("Mohan Singh");
      setFreightMemoNo("FM001");
      setFreightDate(new Date());
      setTotalFreightAmount(25000);
      setDivision("North");
      setStatus("Arrived");
      setUnloadedBy("Ravi Kumar");
      setArrivalStatus("Completed");
      setLoading(false);
      alert(`Manifest ${manifestNo} details loaded successfully!`);
    }, 500);
  };

  const handleSendSMS = () => {
    alert("SMS sent successfully!");
  };

  const handleRefreshEwaybills = () => {
    alert("E-Waybills refreshed successfully!");
  };

  const handlePickupManifestChange = () => {
    setPickupManifest(!pickupManifest);
    alert(`Pickup Manifest ${!pickupManifest ? "enabled" : "disabled"}`);
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">MANIFEST ENQUIRY</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Send SMS Button */}
      <div className="flex justify-end">
        <Button onClick={handleSendSMS} size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700">
          <Send className="mr-1 h-3.5 w-3.5" />
          SEND SMS
        </Button>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 border rounded-md bg-muted/10">
        {/* Left Column */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Manifest Type <span className="text-red-500">*</span></Label><Select value={manifestType} onValueChange={setManifestType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{manifestTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Manifest # <span className="text-red-500">*</span></Label><div className="flex gap-2"><Input value={manifestNo} onChange={(e) => setManifestNo(e.target.value)} placeholder="Enter Manifest Number" className="h-8 text-xs flex-1" /><Button onClick={handleShowDetails} size="sm" className="h-8 text-xs" disabled={loading}><Eye className="mr-1 h-3 w-3" />{loading ? "Loading..." : "Show Details"}</Button></div></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Branch</Label><Input value={branch} readOnly className="h-8 text-xs bg-muted" /></div>
            <div className="space-y-1"><Label className="text-xs">To</Label><Input value={to} readOnly className="h-8 text-xs bg-muted" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Manifest Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs" disabled><CalendarIcon className="mr-1 h-3 w-3" />{format(manifestDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={manifestDate} onSelect={(d) => d && setManifestDate(d)} /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">Consolidated e-Way Bill #</Label><Input value={consolidatedEWayBillNo} readOnly className="h-8 text-xs bg-muted" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Arrived On</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs" disabled><CalendarIcon className="mr-1 h-3 w-3" />{format(arrivedOn, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={arrivedOn} onSelect={(d) => d && setArrivedOn(d)} /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">Arrival #</Label><Input value={arrivalNo} readOnly className="h-8 text-xs bg-muted" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Mode Type</Label><Input value={modeType} readOnly className="h-8 text-xs bg-muted" /></div>
            <div className="space-y-1"><Label className="text-xs">Mode Name</Label><Input value={modeName} readOnly className="h-8 text-xs bg-muted" /></div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Driver Name</Label><Input value={driverName} readOnly className="h-8 text-xs bg-muted" /></div>
            <div className="space-y-1"><Label className="text-xs">Mobile</Label><Input value={mobile} readOnly className="h-8 text-xs bg-muted" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Loaded By</Label><Input value={loadedBy} readOnly className="h-8 text-xs bg-muted" /></div>
            <div className="space-y-1"><Label className="text-xs">Freight Memo #</Label><Input value={freightMemoNo} readOnly className="h-8 text-xs bg-muted" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Freight Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs" disabled><CalendarIcon className="mr-1 h-3 w-3" />{format(freightDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={freightDate} onSelect={(d) => d && setFreightDate(d)} /></PopoverContent></Popover></div>
            <div className="space-y-1"><Label className="text-xs">Total Freight Amount</Label><Input type="number" value={totalFreightAmount} readOnly className="h-8 text-xs bg-muted text-right font-bold" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Division</Label><Input value={division} readOnly className="h-8 text-xs bg-muted" /></div>
            <div className="space-y-1"><Label className="text-xs">Status</Label><Input value={status} readOnly className="h-8 text-xs bg-muted" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Unloaded By</Label><Input value={unloadedBy} readOnly className="h-8 text-xs bg-muted" /></div>
            <div className="space-y-1"><Label className="text-xs">Arrival Status</Label><Input value={arrivalStatus} readOnly className="h-8 text-xs bg-muted" /></div>
          </div>
        </div>
      </div>

      {/* Pickup Manifest and Refresh Ewaybills */}
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={pickupManifest} onChange={handlePickupManifestChange} className="h-3.5 w-3.5" id="pickupManifest" />
          <Label htmlFor="pickupManifest" className="text-xs cursor-pointer">Pickup Manifest</Label>
        </div>
        <Button onClick={handleRefreshEwaybills} variant="outline" size="sm" className="h-8 text-xs">
          <RefreshCw className="mr-1 h-3.5 w-3.5" />
          REFRESH E-WAYBILLS
        </Button>
      </div>

      {/* Tabs for GR Details and MR Details */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "gr" | "mr")} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="gr" className="text-xs">GR Details</TabsTrigger>
          <TabsTrigger value="mr" className="text-xs">MR Details</TabsTrigger>
        </TabsList>

        {/* GR Details Tab */}
        <TabsContent value="gr" className="mt-4">
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1200px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>S#</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>GR #</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead className="text-center">Booked Pckgs</TableHead>
                    <TableHead className="text-center">Dispatch Pckgs</TableHead>
                    <TableHead className="text-center">Rcvd Pckgs</TableHead>
                    <TableHead className="text-center">Short Excess</TableHead>
                    <TableHead className="text-center">Dispatch Weight</TableHead>
                    <TableHead>Consignor Name</TableHead>
                    <TableHead>Consignee Name</TableHead>
                    <TableHead>Cngr GST #</TableHead>
                    <TableHead>Cnge GST #</TableHead>
                    <TableHead>e-Way Bill #</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grDetails.length === 0 ? (
                    <TableRow><TableCell colSpan={15} className="text-center py-8">No GR details found</TableCell></TableRow>
                  ) : (
                    grDetails.map((item, idx) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{item.branch}</TableCell>
                        <TableCell className="font-mono">{item.grNo}</TableCell>
                        <TableCell>{item.origin}</TableCell>
                        <TableCell>{item.destination}</TableCell>
                        <TableCell className="text-center">{item.bookedPckgs}</TableCell>
                        <TableCell className="text-center">{item.dispatchPckgs}</TableCell>
                        <TableCell className="text-center">{item.rcvdPckgs}</TableCell>
                        <TableCell className={cn("text-center", item.shortExcess < 0 ? "text-red-600" : "text-green-600")}>{item.shortExcess}</TableCell>
                        <TableCell className="text-center">{item.dispatchWeight}</TableCell>
                        <TableCell>{item.consignorName}</TableCell>
                        <TableCell>{item.consigneeName}</TableCell>
                        <TableCell>{item.cngrGST}</TableCell>
                        <TableCell>{item.cngeGST}</TableCell>
                        <TableCell className="font-mono">{item.eWayBillNo}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* MR Details Tab */}
        <TabsContent value="mr" className="mt-4">
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1000px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>S#</TableHead>
                    <TableHead>MR #</TableHead>
                    <TableHead>MR Date</TableHead>
                    <TableHead className="text-right">Received Amount</TableHead>
                    <TableHead className="text-right">Rebate</TableHead>
                    <TableHead>Payment Mode</TableHead>
                    <TableHead>Cheque #</TableHead>
                    <TableHead>Cheque Date</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead>Revert Status</TableHead>
                    <TableHead>Voucher #</TableHead>
                    <TableHead>Voucher Status</TableHead>
                    <TableHead className="text-right">TDS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mrDetails.length === 0 ? (
                    <TableRow><TableCell colSpan={13} className="text-center py-8">No MR details found</TableCell></TableRow>
                  ) : (
                    mrDetails.map((item, idx) => (
                      <TableRow key={item.id} className="hover:bg-muted/30">
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell className="font-mono">{item.mrNo}</TableCell>
                        <TableCell>{format(item.mrDate, "dd-MM-yyyy")}</TableCell>
                        <TableCell className="text-right">₹{item.receivedAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹{item.rebate.toLocaleString()}</TableCell>
                        <TableCell>{item.paymentMode}</TableCell>
                        <TableCell>{item.chequeNo || "-"}</TableCell>
                        <TableCell>{item.chequeDate ? format(item.chequeDate, "dd-MM-yyyy") : "-"}</TableCell>
                        <TableCell>{item.remarks}</TableCell>
                        <TableCell>
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px]", item.reverStatus === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}>
                            {item.reverStatus}
                          </span>
                        </TableCell>
                        <TableCell>{item.voucherNo}</TableCell>
                        <TableCell>
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px]", item.voucherStatus === "Approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}>
                            {item.voucherStatus}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">₹{item.tds.toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer Note */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-md p-3">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700 dark:text-blue-400">
            <p className="font-medium">Note:</p>
            <p>Click on "Show Details" button to load manifest information. GR and MR details will be displayed in the respective tabs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Missing Info icon import
import { Info } from "lucide-react";