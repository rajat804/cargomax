"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { CalendarIcon, Save, RefreshCw, Truck, MapPin, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ManifestRecord {
  id: number;
  manifestNo: string;
  date: Date;
  fromLocation: string;
  toLocation: string;
  driver: string;
  newDriver: string;
  vehicleNo: string;
  newVehicleNo: string;
  totalGR: number;
  totalPckgs: number;
  totalDR: number;
  reason: string;
  type: "internal" | "outstation";
}

const driverOptions = [
  { value: "Rajesh Kumar - DL01AB1234", label: "Rajesh Kumar - DL01AB1234" },
  { value: "Suresh Singh - DL02CD5678", label: "Suresh Singh - DL02CD5678" },
  { value: "Mahesh Sharma - DL03EF9012", label: "Mahesh Sharma - DL03EF9012" },
  { value: "Ramesh Gupta - DL04GH3456", label: "Ramesh Gupta - DL04GH3456" },
  { value: "Satish Verma - DL05IJ7890", label: "Satish Verma - DL05IJ7890" },
];

const vehicleOptions = [
  { value: "UP14AB1234 - TATA 407", label: "UP14AB1234 - TATA 407" },
  { value: "UP15CD5678 - ASHOK LEYLAND", label: "UP15CD5678 - ASHOK LEYLAND" },
  { value: "UP16EF9012 - MAHINDRA PICKUP", label: "UP16EF9012 - MAHINDRA PICKUP" },
  { value: "UP17GH3456 - EICHER", label: "UP17GH3456 - EICHER" },
  { value: "UP18IJ7890 - BHARAT BENZ", label: "UP18IJ7890 - BHARAT BENZ" },
];

const locationOptions = [
  { value: "DELHI", label: "DELHI" },
  { value: "MUMBAI", label: "MUMBAI" },
  { value: "BANGALORE", label: "BANGALORE" },
  { value: "CHENNAI", label: "CHENNAI" },
  { value: "KOLKATA", label: "KOLKATA" },
  { value: "AHMEDABAD", label: "AHMEDABAD" },
  { value: "PUNE", label: "PUNE" },
  { value: "HYDERABAD", label: "HYDERABAD" },
  { value: "JAIPUR", label: "JAIPUR" },
  { value: "LUCKNOW", label: "LUCKNOW" },
];

export default function ChangeVehicleInManifest() {
  const [activeType, setActiveType] = useState<"internal" | "outstation">("internal");
  const [manifestNo, setManifestNo] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [fromLocation, setFromLocation] = useState<string>("");
  const [toLocation, setToLocation] = useState<string>("");
  const [driver, setDriver] = useState<string>("");
  const [newDriver, setNewDriver] = useState<string>("");
  const [vehicleNo, setVehicleNo] = useState<string>("");
  const [newVehicleNo, setNewVehicleNo] = useState<string>("");
  const [totalGR, setTotalGR] = useState<number>(0);
  const [totalPckgs, setTotalPckgs] = useState<number>(0);
  const [totalDR, setTotalDR] = useState<number>(0);
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [savedRecords, setSavedRecords] = useState<ManifestRecord[]>([]);

  const generateManifestNo = (): string => {
    const count = savedRecords.length + 1;
    const prefix = activeType === "internal" ? "INT" : "OUT";
    return `${prefix}${String(count).padStart(6, "0")}`;
  };

  const resetForm = () => {
    setManifestNo(generateManifestNo());
    setDate(new Date());
    setFromLocation("");
    setToLocation("");
    setDriver("");
    setNewDriver("");
    setVehicleNo("");
    setNewVehicleNo("");
    setTotalGR(0);
    setTotalPckgs(0);
    setTotalDR(0);
    setReason("");
  };

  const handleFetchManifest = () => {
    if (!manifestNo) {
      alert("Please enter Manifest #");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setFromLocation("DELHI");
      setToLocation("MUMBAI");
      setDriver("Rajesh Kumar - DL01AB1234");
      setVehicleNo("UP14AB1234 - TATA 407");
      setTotalGR(5);
      setTotalPckgs(120);
      setTotalDR(3);
      setLoading(false);
      alert(`Manifest ${manifestNo} details loaded successfully!`);
    }, 500);
  };

  const handleUpdate = () => {
    if (!manifestNo) {
      alert("Please enter Manifest #");
      return;
    }
    if (!newVehicleNo) {
      alert("Please select New Vehicle #");
      return;
    }
    if (!reason.trim()) {
      alert("Please enter Reason");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newRecord: ManifestRecord = {
        id: Date.now(),
        manifestNo: manifestNo,
        date: date,
        fromLocation: fromLocation,
        toLocation: toLocation,
        driver: driver,
        newDriver: newDriver,
        vehicleNo: vehicleNo,
        newVehicleNo: newVehicleNo,
        totalGR: totalGR,
        totalPckgs: totalPckgs,
        totalDR: totalDR,
        reason: reason,
        type: activeType,
      };
      setSavedRecords([newRecord, ...savedRecords]);
      alert("Vehicle changed successfully!");
      resetForm();
      setLoading(false);
    }, 500);
  };

  const handleClear = () => {
    resetForm();
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">CHANGE VEHICLE IN MANIFEST</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Internal / Outstation Toggle */}
      <div className="flex gap-2 border-b pb-2">
        <button
          onClick={() => {
            setActiveType("internal");
            resetForm();
          }}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all rounded-t-lg",
            activeType === "internal"
              ? "border-b-2 border-primary text-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Truck className="inline h-4 w-4 mr-2" />
          Internal
        </button>
        <button
          onClick={() => {
            setActiveType("outstation");
            resetForm();
          }}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all rounded-t-lg",
            activeType === "outstation"
              ? "border-b-2 border-primary text-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MapPin className="inline h-4 w-4 mr-2" />
          Outstation
        </button>
      </div>

      {/* Form Card */}
      <div className="border rounded-lg p-4 md:p-5 bg-white dark:bg-slate-950 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-3">
            {/* Manifest # */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">
                Manifest # <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  value={manifestNo}
                  onChange={(e) => setManifestNo(e.target.value)}
                  placeholder="Enter Manifest Number"
                  className="h-8 text-xs flex-1"
                />
                <Button
                  onClick={handleFetchManifest}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  disabled={loading}
                >
                  <FileText className="mr-1 h-3 w-3" />
                  Fetch
                </Button>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-full justify-start text-left text-xs"
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {format(date, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* From */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">From</Label>
              <Select value={fromLocation} onValueChange={setFromLocation}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Origin" />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* To */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">To</Label>
              <Select value={toLocation} onValueChange={setToLocation}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Destination" />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Driver */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">Driver</Label>
              <Select value={driver} onValueChange={setDriver}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Driver" />
                </SelectTrigger>
                <SelectContent>
                  {driverOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* New Driver */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">New Driver</Label>
              <Select value={newDriver} onValueChange={setNewDriver}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select New Driver" />
                </SelectTrigger>
                <SelectContent>
                  {driverOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            {/* Vehicle # */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">Vehicle #</Label>
              <Select value={vehicleNo} onValueChange={setVehicleNo}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* New Vehicle # */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">
                New Vehicle # <span className="text-red-500">*</span>
              </Label>
              <Select value={newVehicleNo} onValueChange={setNewVehicleNo}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select New Vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-2 text-center">
                <Label className="text-[10px] text-muted-foreground">Total GR</Label>
                <p className="text-lg font-bold text-blue-600">{totalGR}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-2 text-center">
                <Label className="text-[10px] text-muted-foreground">Total Pckgs</Label>
                <p className="text-lg font-bold text-green-600">{totalPckgs}</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-2 text-center">
                <Label className="text-[10px] text-muted-foreground">Total DR</Label>
                <p className="text-lg font-bold text-orange-600">{totalDR}</p>
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-1">
              <Label className="text-xs font-medium">
                Reason <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for vehicle change..."
                rows={3}
                className="text-xs resize-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
          <Button
            onClick={handleUpdate}
            size="sm"
            className="h-8 text-xs bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <Save className="mr-1 h-3 w-3" />
            )}
            UPDATE
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            size="sm"
            className="h-8 text-xs"
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            CLEAR
          </Button>
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 rounded-md p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
          <div className="text-xs text-yellow-700 dark:text-yellow-400">
            <p className="font-medium">Note:</p>
            <p>Changing vehicle will update all associated GRs and DRs. Please ensure the new vehicle is available and has valid documents.</p>
          </div>
        </div>
      </div>
    </div>
  );
}