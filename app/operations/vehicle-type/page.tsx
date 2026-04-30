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
import { CalendarIcon, Save, RefreshCw, Search, Pencil, Trash2, Plus, Eye, Check, X, MoreVertical, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface VehicleType {
  id: number;
  vehicleType: string;
  typeCode: string;
  name: string;
  category: string;
  fuelType: string;
  perDayRunningKM: number;
  vehicleCategory: string;
  active: boolean;
}

interface SalaryDetail {
  id: number;
  fromDate: Date;
  toDate: Date;
  designation: string;
}

const vehicleTypeOptions = ["PULLER", "TRAILLER", "TRUCK", "CANTER", "OPEN BODY TRUCK", "TEMPO", "CONTAINER"];
const categoryOptions = ["SINGLE AXLE", "DOUBLE AXLE", "MULTI AXLE", "TRIPPLE AXLE"];
const fuelTypeOptions = ["PETROL", "DIESEL", "CNG", "LPG", "DUO"];
const vehicleCategoryOptions = ["BOTH", "MARKET", "OWN"];

export default function VehicleTypeMaster() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"search" | "entry">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  
  // Form state
  const [vehicleType, setVehicleType] = useState<string>("");
  const [typeCode, setTypeCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [fuelType, setFuelType] = useState<string>("");
  const [perDayRunningKM, setPerDayRunningKM] = useState<number>(0);
  const [vehicleCategory, setVehicleCategory] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Salary Details Modal state
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | null>(null);
  const [salaryDetails, setSalaryDetails] = useState<SalaryDetail[]>([]);
  const [salaryFromDate, setSalaryFromDate] = useState<Date>(new Date());
  const [salaryToDate, setSalaryToDate] = useState<Date>(new Date());
  const [salaryDesignation, setSalaryDesignation] = useState("");
  const [editSalaryId, setEditSalaryId] = useState<number | null>(null);
  const [salaryActiveTab, setSalaryActiveTab] = useState<"entry" | "search">("entry");

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<VehicleType[]>([
    { id: 1, vehicleType: "TRUCK", typeCode: "A0002", name: "TRUCK", category: "SINGLE AXLE", fuelType: "DIESEL", perDayRunningKM: 300, vehicleCategory: "BOTH", active: true },
    { id: 2, vehicleType: "CANTER", typeCode: "A0004", name: "CANTER", category: "DOUBLE AXLE", fuelType: "PETROL", perDayRunningKM: 250, vehicleCategory: "MARKET", active: true },
    { id: 3, vehicleType: "OPEN BODY TRUCK", typeCode: "A0006", name: "OPEN BODY TRUCK", category: "DOUBLE AXLE", fuelType: "DIESEL", perDayRunningKM: 280, vehicleCategory: "OWN", active: true },
    { id: 4, vehicleType: "TEMPO", typeCode: "A0008", name: "TEMPO", category: "SINGLE AXLE", fuelType: "DIESEL", perDayRunningKM: 150, vehicleCategory: "BOTH", active: true },
    { id: 5, vehicleType: "CONTAINER", typeCode: "A0010", name: "CONTAINER", category: "TRIPPLE AXLE", fuelType: "DIESEL", perDayRunningKM: 400, vehicleCategory: "MARKET", active: true },
    { id: 6, vehicleType: "TRAILER", typeCode: "A0012", name: "TRAILER", category: "TRIPPLE AXLE", fuelType: "DIESEL", perDayRunningKM: 350, vehicleCategory: "OWN", active: true },
  ]);

  // Sample salary details data
  const [savedSalaryDetails, setSavedSalaryDetails] = useState<Record<number, SalaryDetail[]>>({});

  // Generate type code
  const generateTypeCode = (): string => {
    const count = savedRecords.length + 1;
    return `A${String(count).padStart(4, '0')}`;
  };

  // Reset form
  const resetForm = (): void => {
    setVehicleType("");
    setTypeCode(generateTypeCode());
    setName("");
    setCategory("");
    setFuelType("");
    setPerDayRunningKM(0);
    setVehicleCategory("");
    setActive(true);
    setEditId(null);
  };

  const handleSave = (): void => {
    if (!name.trim()) {
      alert("Please enter Name");
      return;
    }
    if (!category) {
      alert("Please select Category");
      return;
    }
    if (!fuelType) {
      alert("Please select Fuel Type");
      return;
    }

    if (editId) {
      const updatedRecords = savedRecords.map(record => 
        record.id === editId 
          ? { ...record, vehicleType, name, category, fuelType, perDayRunningKM, vehicleCategory, active }
          : record
      );
      setSavedRecords(updatedRecords);
      alert("Record updated successfully!");
    } else {
      const newRecord: VehicleType = {
        id: Date.now(),
        vehicleType,
        typeCode,
        name,
        category,
        fuelType,
        perDayRunningKM,
        vehicleCategory,
        active,
      };
      setSavedRecords([...savedRecords, newRecord]);
      alert("Record saved successfully!");
    }
    
    resetForm();
    setActiveTab("search");
  };

  const handleDelete = (id: number): void => {
    if (confirm("Are you sure you want to delete this record?")) {
      setSavedRecords(savedRecords.filter(record => record.id !== id));
      alert("Record deleted successfully!");
    }
  };

  const handleEdit = (record: VehicleType): void => {
    setEditId(record.id);
    setVehicleType(record.vehicleType);
    setTypeCode(record.typeCode);
    setName(record.name);
    setCategory(record.category);
    setFuelType(record.fuelType);
    setPerDayRunningKM(record.perDayRunningKM);
    setVehicleCategory(record.vehicleCategory);
    setActive(record.active);
    setActiveTab("entry");
  };

  // Salary Details Functions
  const handleSalaryDetails = (record: VehicleType) => {
    setSelectedVehicleType(record);
    setSalaryDetails(savedSalaryDetails[record.id] || []);
    setSalaryActiveTab("entry");
    resetSalaryForm();
    setIsSalaryModalOpen(true);
  };

  const resetSalaryForm = () => {
    setSalaryFromDate(new Date());
    setSalaryToDate(new Date());
    setSalaryDesignation("");
    setEditSalaryId(null);
  };

  const addSalaryDetail = () => {
    if (!salaryDesignation) {
      alert("Please enter Designation");
      return;
    }
    const newSalary: SalaryDetail = {
      id: editSalaryId || Date.now(),
      fromDate: salaryFromDate,
      toDate: salaryToDate,
      designation: salaryDesignation,
    };
    let updatedDetails: SalaryDetail[];
    if (editSalaryId) {
      updatedDetails = salaryDetails.map(s => s.id === editSalaryId ? newSalary : s);
      setEditSalaryId(null);
    } else {
      updatedDetails = [...salaryDetails, newSalary];
    }
    setSalaryDetails(updatedDetails);
    if (selectedVehicleType) {
      setSavedSalaryDetails({
        ...savedSalaryDetails,
        [selectedVehicleType.id]: updatedDetails
      });
    }
    resetSalaryForm();
    alert("Salary detail saved successfully!");
  };

  const editSalaryDetail = (salary: SalaryDetail) => {
    setEditSalaryId(salary.id);
    setSalaryFromDate(salary.fromDate);
    setSalaryToDate(salary.toDate);
    setSalaryDesignation(salary.designation);
    setSalaryActiveTab("entry");
  };

  const deleteSalaryDetail = (id: number) => {
    if (confirm("Are you sure you want to delete this salary detail?")) {
      const updatedDetails = salaryDetails.filter(s => s.id !== id);
      setSalaryDetails(updatedDetails);
      if (selectedVehicleType) {
        setSavedSalaryDetails({
          ...savedSalaryDetails,
          [selectedVehicleType.id]: updatedDetails
        });
      }
      alert("Salary detail deleted successfully!");
    }
  };

  // Search functions
  const getSearchResults = (): VehicleType[] => {
    let results = [...savedRecords];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(r => 
        r.name.toLowerCase().includes(term) ||
        r.vehicleType.toLowerCase().includes(term) ||
        r.typeCode.toLowerCase().includes(term)
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

  const handleClearSearch = () => {
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
        <h1 className="text-base md:text-lg font-bold">VEHICLE TYPE MASTER</h1>
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
              <Input placeholder="Search by Type, Code or Name..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="pl-8 h-8 text-xs" />
            </div>
            <Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3.5 w-3.5" />CLEAR</Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[800px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">S#</TableHead>
                    <TableHead>Vehicle Type</TableHead>
                    <TableHead>Type Code</TableHead>
                    <TableHead>Type Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Fuel Type</TableHead>
                    <TableHead className="w-32 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (<TableRow><TableCell colSpan={7} className="text-center py-8">No records found</TableCell></TableRow>) : (
                    paginatedResults.map((record, idx) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell className="text-center">{(currentPage-1)*itemsPerPage+idx+1}</TableCell>
                        <TableCell>{record.vehicleType}</TableCell>
                        <TableCell className="font-mono">{record.typeCode}</TableCell>
                        <TableCell className="font-medium">{record.name}</TableCell>
                        <TableCell>{record.category}</TableCell>
                        <TableCell>{record.fuelType}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(record)} className="h-7 w-7 p-0 text-blue-500" title="Edit"><Pencil className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleSalaryDetails(record)} className="h-7 w-7 p-0 text-green-500" title="Salary Details"><DollarSign className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)} className="h-7 w-7 p-0 text-red-500" title="Delete"><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {totalPages > 1 && (<div className="flex justify-center gap-1"><Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1} className="h-7 text-xs">Previous</Button><span className="px-3 py-1 text-xs bg-muted rounded-md">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages} className="h-7 text-xs">Next</Button></div>)}
        </div>
      )}

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-xs">Vehicle Type</Label><Select value={vehicleType} onValueChange={setVehicleType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{vehicleTypeOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Type Code</Label><Input value={typeCode} readOnly className="h-8 text-xs bg-muted" /></div>
            <div className="space-y-1"><Label className="text-xs">Name <span className="text-red-500">*</span></Label><Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Category <span className="text-red-500">*</span></Label><Select value={category} onValueChange={setCategory}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{categoryOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Fuel Type <span className="text-red-500">*</span></Label><Select value={fuelType} onValueChange={setFuelType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{fuelTypeOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Per Day Running KM</Label><Input type="number" value={perDayRunningKM} onChange={(e) => setPerDayRunningKM(Number(e.target.value))} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Vehicle Category</Label><Select value={vehicleCategory} onValueChange={setVehicleCategory}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{vehicleCategoryOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1 flex items-end"><div className="flex items-center gap-2"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">Active</Label></div></div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={handleSave} size="sm" className="h-8 text-xs"><Save className="mr-1 h-3 w-3" />{editId ? "UPDATE" : "SAVE"}</Button>
            <Button onClick={resetForm} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
            {editId && (<Button onClick={() => handleDelete(editId)} variant="destructive" size="sm" className="h-8 text-xs"><Trash2 className="mr-1 h-3 w-3" />DELETE</Button>)}
          </div>
        </div>
      )}

      {/* Salary Details Modal */}
      <Dialog open={isSalaryModalOpen} onOpenChange={setIsSalaryModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-4 pt-4 pb-2 border-b">
            <DialogTitle>Salary Details - {selectedVehicleType?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto px-4 py-3">
            {/* Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-muted/20 rounded-md">
              <div><Label className="text-xs text-muted-foreground">Type Code :</Label><p className="text-sm font-medium">{selectedVehicleType?.typeCode}</p></div>
              <div><Label className="text-xs text-muted-foreground">Vehicle Type Name :</Label><p className="text-sm font-medium">{selectedVehicleType?.name}</p></div>
              <div><Label className="text-xs text-muted-foreground">Category :</Label><p className="text-sm font-medium">{selectedVehicleType?.category}</p></div>
              <div><Label className="text-xs text-muted-foreground">Fuel Type :</Label><p className="text-sm font-medium">{selectedVehicleType?.fuelType}</p></div>
            </div>

            {/* Tabs inside modal */}
            <div className="flex border-b mb-3">
              <button onClick={() => setSalaryActiveTab("entry")} className={cn("px-3 py-1.5 text-xs font-medium", salaryActiveTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>Entry</button>
              <button onClick={() => setSalaryActiveTab("search")} className={cn("px-3 py-1.5 text-xs font-medium", salaryActiveTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground")}>Search</button>
            </div>

            {salaryActiveTab === "entry" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="space-y-1"><Label className="text-xs">From Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{format(salaryFromDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={salaryFromDate} onSelect={(date) => date && setSalaryFromDate(date)} /></PopoverContent></Popover></div>
                <div className="space-y-1"><Label className="text-xs">To Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{format(salaryToDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={salaryToDate} onSelect={(date) => date && setSalaryToDate(date)} /></PopoverContent></Popover></div>
                <div className="space-y-1"><Label className="text-xs">Designation</Label><Input value={salaryDesignation} onChange={(e) => setSalaryDesignation(e.target.value)} className="h-8 text-xs" /></div>
                <div className="flex items-end"><Button onClick={addSalaryDetail} size="sm" className="h-8 text-xs"><Plus className="mr-1 h-3 w-3" />ADD</Button></div>
              </div>
            )}

            {salaryActiveTab === "search" && (
              <div className="rounded-md border overflow-x-auto">
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12">S#</TableHead>
                      <TableHead>From Date</TableHead>
                      <TableHead>To Date</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead className="w-20 text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salaryDetails.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8">No salary details found</TableCell></TableRow>
                    ) : (
                      salaryDetails.map((salary, idx) => (
                        <TableRow key={salary.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>{format(salary.fromDate, "dd-MM-yyyy")}</TableCell>
                          <TableCell>{format(salary.toDate, "dd-MM-yyyy")}</TableCell>
                          <TableCell>{salary.designation}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button variant="ghost" size="sm" onClick={() => editSalaryDetail(salary)} className="h-6 w-6 p-0 text-blue-500"><Pencil className="h-3 w-3" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteSalaryDetail(salary.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <DialogFooter className="px-4 py-3 border-t">
            <Button variant="outline" size="sm" onClick={() => setIsSalaryModalOpen(false)}>CLOSE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}