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
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Save, RefreshCw, Search, Pencil, Trash2, Plus, ChevronRight, ChevronLeft, Eye, Check, X, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Vehicle {
  id: number;
  vehicleCategory: string;
  groupName: string;
  model: string;
  engineNo: string;
  chasisNo: string;
  category: string;
  regNo: string;
  aliasName: string;
  vehicleType: string;
  regDate: Date;
  vendorName: string;
  active: boolean;
  approved: boolean;
  divisionId: string;
  vehicle: string;
  controlledBy: string;
  broker: string;
  ownerName: string;
  permanentAddress: string;
  temporaryAddress: string;
  pan: string;
  mobileNo: string;
}

const vehicleOptions = ["Attached Vehicle", "Market Vehicle", "Own Vehicle"];
const vehicleCategoryOptions = ["ALL", "Heavy", "Medium", "Light", "Two Wheeler", "Three Wheeler"];
const vehicleTypeOptions = ["Truck", "Container", "Trailer", "Tanker", "Pickup", "Van", "Bus", "Car"];
const divisionOptions = ["North", "South", "East", "West", "Central"];

export default function VehicleMasterNew() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"search" | "entry">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Form state
  const [vehicle, setVehicle] = useState<string>("");
  const [controlledBy, setControlledBy] = useState<string>("");
  const [broker, setBroker] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [permanentAddress, setPermanentAddress] = useState<string>("");
  const [temporaryAddress, setTemporaryAddress] = useState<string>("");
  const [pan, setPan] = useState<string>("");
  const [mobileNo, setMobileNo] = useState<string>("");
  
  // Vehicle Details
  const [vehicleCategory, setVehicleCategory] = useState<string>("");
  const [groupName, setGroupName] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [engineNo, setEngineNo] = useState<string>("");
  const [chasisNo, setChasisNo] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [regNo, setRegNo] = useState<string>("");
  const [aliasName, setAliasName] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const [regDate, setRegDate] = useState<Date>(new Date());
  const [vendorName, setVendorName] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);
  const [approved, setApproved] = useState<boolean>(false);
  const [divisionId, setDivisionId] = useState<string>("");

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchVehicleCategory, setSearchVehicleCategory] = useState<string>("ALL");
  const [searchVehicleNo, setSearchVehicleNo] = useState<string>("");
  const [searchPanNo, setSearchPanNo] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<Vehicle[]>([
    { id: 1, vehicleCategory: "Heavy", groupName: "Truck Group", model: "TATA 407", engineNo: "ENG001", chasisNo: "CHS001", category: "Commercial", regNo: "UP14AB1234", aliasName: "Truck1", vehicleType: "Truck", regDate: new Date("2023-01-15"), vendorName: "TATA Motors", active: true, approved: true, divisionId: "North", vehicle: "Own Vehicle", controlledBy: "Self", broker: "", ownerName: "Rajesh Kumar", permanentAddress: "Delhi", temporaryAddress: "", pan: "ABCDE1234F", mobileNo: "9876543210" },
    { id: 2, vehicleCategory: "Medium", groupName: "Container Group", model: "ASHOK LEYLAND", engineNo: "ENG002", chasisNo: "CHS002", category: "Commercial", regNo: "UP15CD5678", aliasName: "Container1", vehicleType: "Container", regDate: new Date("2023-02-20"), vendorName: "Ashok Leyland", active: true, approved: true, divisionId: "South", vehicle: "Market Vehicle", controlledBy: "Broker", broker: "Suresh Transport", ownerName: "Suresh Singh", permanentAddress: "Mumbai", temporaryAddress: "", pan: "FGHIJ5678K", mobileNo: "9876543211" },
    { id: 3, vehicleCategory: "Light", groupName: "Pickup Group", model: "MAHINDRA", engineNo: "ENG003", chasisNo: "CHS003", category: "Commercial", regNo: "UP16EF9012", aliasName: "Pickup1", vehicleType: "Pickup", regDate: new Date("2023-03-10"), vendorName: "Mahindra", active: true, approved: false, divisionId: "East", vehicle: "Attached Vehicle", controlledBy: "Company", broker: "", ownerName: "Company Owned", permanentAddress: "Kolkata", temporaryAddress: "", pan: "KLMNO9012P", mobileNo: "9876543212" },
  ]);

  // Generate ID
  const getNextId = (): number => {
    const maxId = savedRecords.length > 0 ? Math.max(...savedRecords.map(r => r.id)) : 0;
    return maxId + 1;
  };

  // Reset form
  const resetForm = (): void => {
    setVehicle("");
    setControlledBy("");
    setBroker("");
    setOwnerName("");
    setPermanentAddress("");
    setTemporaryAddress("");
    setPan("");
    setMobileNo("");
    setVehicleCategory("");
    setGroupName("");
    setModel("");
    setEngineNo("");
    setChasisNo("");
    setCategory("");
    setRegNo("");
    setAliasName("");
    setVehicleType("");
    setRegDate(new Date());
    setVendorName("");
    setActive(true);
    setApproved(false);
    setDivisionId("");
    setEditId(null);
    setCurrentStep(1);
  };

  const handleContinue = () => {
    if (!vehicle) {
      alert("Please select Vehicle type");
      return;
    }
    if (!ownerName) {
      alert("Please enter Owner Name");
      return;
    }
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSave = (): void => {
    if (!vehicle) {
      alert("Please select Vehicle type");
      return;
    }
    if (!ownerName) {
      alert("Please enter Owner Name");
      return;
    }
    if (!regNo) {
      alert("Please enter Registration Number");
      return;
    }

    const newRecord: Vehicle = {
      id: editId || getNextId(),
      vehicleCategory,
      groupName,
      model,
      engineNo,
      chasisNo,
      category,
      regNo,
      aliasName,
      vehicleType,
      regDate,
      vendorName,
      active,
      approved,
      divisionId,
      vehicle,
      controlledBy,
      broker,
      ownerName,
      permanentAddress,
      temporaryAddress,
      pan,
      mobileNo,
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
  };

  const handleEdit = (record: Vehicle): void => {
    setEditId(record.id);
    setVehicle(record.vehicle);
    setControlledBy(record.controlledBy);
    setBroker(record.broker);
    setOwnerName(record.ownerName);
    setPermanentAddress(record.permanentAddress);
    setTemporaryAddress(record.temporaryAddress);
    setPan(record.pan);
    setMobileNo(record.mobileNo);
    setVehicleCategory(record.vehicleCategory);
    setGroupName(record.groupName);
    setModel(record.model);
    setEngineNo(record.engineNo);
    setChasisNo(record.chasisNo);
    setCategory(record.category);
    setRegNo(record.regNo);
    setAliasName(record.aliasName);
    setVehicleType(record.vehicleType);
    setRegDate(record.regDate);
    setVendorName(record.vendorName);
    setActive(record.active);
    setApproved(record.approved);
    setDivisionId(record.divisionId);
    setCurrentStep(2);
    setActiveTab("entry");
  };

  const handleDelete = (id: number): void => {
    if (confirm("Are you sure you want to delete this record?")) {
      setSavedRecords(savedRecords.filter(record => record.id !== id));
      alert("Record deleted successfully!");
    }
  };

  // Search functions
  const getSearchResults = (): Vehicle[] => {
    let results = [...savedRecords];
    if (searchVehicleCategory !== "ALL") {
      results = results.filter(r => r.vehicleCategory === searchVehicleCategory);
    }
    if (searchVehicleNo) {
      results = results.filter(r => r.regNo.toLowerCase().includes(searchVehicleNo.toLowerCase()));
    }
    if (searchPanNo) {
      results = results.filter(r => r.pan.toLowerCase().includes(searchPanNo.toLowerCase()));
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(r => 
        r.regNo.toLowerCase().includes(term) ||
        r.ownerName.toLowerCase().includes(term) ||
        r.model.toLowerCase().includes(term)
      );
    }
    return results;
  };

  const searchResults = getSearchResults();
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchVehicleCategory("ALL");
    setSearchVehicleNo("");
    setSearchPanNo("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">VEHICLE MASTER (NEW)</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => {
            setActiveTab("search");
            setCurrentPage(1);
          }}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            activeTab === "search"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Search
        </button>
        <button
          onClick={() => {
            setActiveTab("entry");
            resetForm();
          }}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-all",
            activeTab === "entry"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Entry
        </button>
      </div>

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="space-y-4">
          {/* Search Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 border rounded-md bg-muted/20">
            <div className="space-y-1">
              <Label className="text-xs">Select Vehicle Category</Label>
              <Select value={searchVehicleCategory} onValueChange={setSearchVehicleCategory}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="SELECT" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleCategoryOptions.map(opt => (
                    <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Vehicle #</Label>
              <Input value={searchVehicleNo} onChange={(e) => setSearchVehicleNo(e.target.value)} placeholder="Enter Vehicle Number" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">PAN No</Label>
              <Input value={searchPanNo} onChange={(e) => setSearchPanNo(e.target.value)} placeholder="Enter PAN Number" className="h-8 text-xs" />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} size="sm" className="h-8 text-xs">
                <Search className="mr-1 h-3.5 w-3.5" />
                SHOW VEHICLE
              </Button>
              <Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs">
                <RefreshCw className="mr-1 h-3.5 w-3.5" />
                CLEAR
              </Button>
            </div>
          </div>

          {/* Results Table */}
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1400px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">S#</TableHead>
                    <TableHead>Group Name</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Engine #</TableHead>
                    <TableHead>Chasis #</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Reg #</TableHead>
                    <TableHead>Alias Name</TableHead>
                    <TableHead>Vehicle Type</TableHead>
                    <TableHead>Reg Date</TableHead>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead className="text-center">Active</TableHead>
                    <TableHead className="text-center">Approved</TableHead>
                    <TableHead>Division Id</TableHead>
                    <TableHead className="w-20 text-center">Options</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={15} className="text-center py-8 text-muted-foreground">
                        No records found. Click SHOW VEHICLE to display results.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, index) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell className="text-center">{(currentPage-1)*itemsPerPage+index+1}</TableCell>
                        <TableCell>{record.groupName || "-"}</TableCell>
                        <TableCell>{record.model || "-"}</TableCell>
                        <TableCell>{record.engineNo || "-"}</TableCell>
                        <TableCell>{record.chasisNo || "-"}</TableCell>
                        <TableCell>{record.category || "-"}</TableCell>
                        <TableCell className="font-medium">{record.regNo}</TableCell>
                        <TableCell>{record.aliasName || "-"}</TableCell>
                        <TableCell>{record.vehicleType || "-"}</TableCell>
                        <TableCell>{format(record.regDate, "dd-MM-yyyy")}</TableCell>
                        <TableCell>{record.vendorName || "-"}</TableCell>
                        <TableCell className="text-center">
                          {record.active ? <Check className="h-3.5 w-3.5 text-green-500 mx-auto" /> : <X className="h-3.5 w-3.5 text-red-500 mx-auto" />}
                        </TableCell>
                        <TableCell className="text-center">
                          {record.approved ? <Check className="h-3.5 w-3.5 text-green-500 mx-auto" /> : <X className="h-3.5 w-3.5 text-red-500 mx-auto" />}
                        </TableCell>
                        <TableCell>{record.divisionId || "-"}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(record)} className="h-7 w-7 p-0 text-blue-500" title="Edit">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)} className="h-7 w-7 p-0 text-red-500" title="Delete">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, searchResults.length)} of {searchResults.length} entries
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="h-7 text-xs">Previous</Button>
                <span className="px-3 py-1 text-xs bg-muted rounded-md">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="h-7 text-xs">Next</Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <div className="space-y-4">
          {currentStep === 1 && (
            <div className="space-y-4 max-w-2xl mx-auto w-full">
              <div className="border-b pb-2 mb-4">
                <h2 className="text-sm font-semibold">Basic Information</h2>
              </div>
              
              {/* Vehicle */}
              <div className="space-y-1">
                <Label className="text-xs">Vehicle <span className="text-red-500">*</span></Label>
                <Select value={vehicle} onValueChange={setVehicle}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="SELECT VEHICLE" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleOptions.map(opt => (
                      <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Controlled By */}
              <div className="space-y-1">
                <Label className="text-xs">Controlled By</Label>
                <Input value={controlledBy} onChange={(e) => setControlledBy(e.target.value)} placeholder="Enter Controlled By" className="h-8 text-xs" />
              </div>

              {/* Broker */}
              <div className="space-y-1">
                <Label className="text-xs">Broker</Label>
                <Input value={broker} onChange={(e) => setBroker(e.target.value)} placeholder="Enter Broker Name" className="h-8 text-xs" />
              </div>

              {/* Owner Name */}
              <div className="space-y-1">
                <Label className="text-xs">Owner Name <span className="text-red-500">*</span></Label>
                <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Enter Owner Name" className="h-8 text-xs" />
              </div>

              {/* Permanent Address */}
              <div className="space-y-1">
                <Label className="text-xs">Permanent Address</Label>
                <Input value={permanentAddress} onChange={(e) => setPermanentAddress(e.target.value)} placeholder="Enter Permanent Address" className="h-8 text-xs" />
              </div>

              {/* Temporary Address */}
              <div className="space-y-1">
                <Label className="text-xs">Temporary Address</Label>
                <Input value={temporaryAddress} onChange={(e) => setTemporaryAddress(e.target.value)} placeholder="Enter Temporary Address" className="h-8 text-xs" />
              </div>

              {/* PAN */}
              <div className="space-y-1">
                <Label className="text-xs">PAN</Label>
                <Input value={pan} onChange={(e) => setPan(e.target.value)} placeholder="Enter PAN Number" className="h-8 text-xs uppercase" />
              </div>

              {/* Mobile No */}
              <div className="space-y-1">
                <Label className="text-xs">Mobile No.</Label>
                <Input value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} placeholder="Enter Mobile Number" className="h-8 text-xs" />
              </div>

              {/* Continue Button */}
              <div className="flex justify-end pt-4">
                <Button onClick={handleContinue} size="sm" className="h-8 text-xs">
                  CONTINUE <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2 mb-4">
                <h2 className="text-sm font-semibold">Vehicle Details</h2>
                <Button onClick={handleBack} variant="ghost" size="sm" className="h-7 text-xs">
                  <ChevronLeft className="mr-1 h-3.5 w-3.5" /> BACK
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-1"><Label className="text-xs">Vehicle Category</Label><Select value={vehicleCategory} onValueChange={setVehicleCategory}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{vehicleCategoryOptions.filter(opt => opt !== "ALL").map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-1"><Label className="text-xs">Group Name</Label><Input value={groupName} onChange={(e) => setGroupName(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Model</Label><Input value={model} onChange={(e) => setModel(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Engine #</Label><Input value={engineNo} onChange={(e) => setEngineNo(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Chasis #</Label><Input value={chasisNo} onChange={(e) => setChasisNo(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Category</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Reg # <span className="text-red-500">*</span></Label><Input value={regNo} onChange={(e) => setRegNo(e.target.value)} className="h-8 text-xs uppercase" /></div>
                <div className="space-y-1"><Label className="text-xs">Alias Name</Label><Input value={aliasName} onChange={(e) => setAliasName(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Vehicle Type</Label><Select value={vehicleType} onValueChange={setVehicleType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{vehicleTypeOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-1"><Label className="text-xs">Reg Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full justify-start text-left text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{format(regDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={regDate} onSelect={(date) => date && setRegDate(date)} initialFocus /></PopoverContent></Popover></div>
                <div className="space-y-1"><Label className="text-xs">Vendor Name</Label><Input value={vendorName} onChange={(e) => setVendorName(e.target.value)} className="h-8 text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Division Id</Label><Select value={divisionId} onValueChange={setDivisionId}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{divisionOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent></Select></div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">Active</Label></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={approved} onChange={(e) => setApproved(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">Approved</Label></div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button onClick={handleSave} size="sm" className="h-8 text-xs"><Save className="mr-1 h-3 w-3" />{editId ? "UPDATE" : "SAVE"}</Button>
                <Button onClick={resetForm} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}