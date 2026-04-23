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
import { Save, RefreshCw, Search, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GodownRecord {
  id: number;
  godownId: string;
  cGodownId: string;
  branch: string;
  godownName: string;
  address1: string;
  address2: string;
  city: string;
  zipCode: string;
  state: string;
  stateCode: string;
  country: string;
  inchargeName: string;
}

// Sample branch options
const branchOptions = [
  "U P BORDER A JH UP",
  "U P BORDER C ASM WB",
  "U P BORDER B BR",
  "BIJNOR",
  "NETHAUR",
  "NOORPUR",
  "NOJIBABAD",
  "SEOHARA",
  "CORPORATE OFFICE",
  "MEERUT",
  "DELHI",
  "MUMBAI"
];

const stateOptions = [
  "Uttar Pradesh",
  "Delhi",
  "Maharashtra",
  "West Bengal",
  "Bihar",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "Rajasthan",
  "Madhya Pradesh"
];

const countryOptions = [
  "India",
  "USA",
  "UK",
  "Canada",
  "Australia",
  "Singapore",
  "UAE"
];

export default function GodownMaster() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"search" | "entry">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  
  // Form state
  const [godownId, setGodownId] = useState<string>("");
  const [cGodownId, setCGodownId] = useState<string>("");
  const [branch, setBranch] = useState<string>("");
  const [godownName, setGodownName] = useState<string>("");
  const [address1, setAddress1] = useState<string>("");
  const [address2, setAddress2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [stateCode, setStateCode] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [inchargeName, setInchargeName] = useState<string>("");

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<GodownRecord[]>([
    { id: 1, godownId: "G001", cGodownId: "CG001", branch: "U P BORDER A JH UP", godownName: "U P BORDER A JH UP", address1: "", address2: "", city: "", zipCode: "", state: "", stateCode: "", country: "", inchargeName: "AJAY TIWARI" },
    { id: 2, godownId: "G002", cGodownId: "CG002", branch: "U P BORDER C ASM WB", godownName: "U P BORDER C ASM WB", address1: "", address2: "", city: "", zipCode: "", state: "", stateCode: "", country: "", inchargeName: "VIKASH TIWARI" },
    { id: 3, godownId: "G003", cGodownId: "CG003", branch: "U P BORDER B BR", godownName: "U P BORDER B BR", address1: "", address2: "", city: "", zipCode: "", state: "", stateCode: "", country: "", inchargeName: "VIKASH TIWARI" },
    { id: 4, godownId: "G004", cGodownId: "CG004", branch: "BIJNOR", godownName: "BIJNOR", address1: "", address2: "", city: "", zipCode: "", state: "", stateCode: "", country: "", inchargeName: "PARMOD" },
    { id: 5, godownId: "G005", cGodownId: "CG005", branch: "NETHAUR", godownName: "NETHAUR", address1: "", address2: "", city: "", zipCode: "", state: "", stateCode: "", country: "", inchargeName: "NAIM" },
    { id: 6, godownId: "G006", cGodownId: "CG006", branch: "NOORPUR", godownName: "NOORPUR", address1: "", address2: "", city: "", zipCode: "", state: "", stateCode: "", country: "", inchargeName: "ARPIT" },
    { id: 7, godownId: "G007", cGodownId: "CG007", branch: "NOJIBABAD", godownName: "NOJIBABAD", address1: "", address2: "", city: "", zipCode: "", state: "", stateCode: "", country: "", inchargeName: "RITU BUSHAN AGARWAL" },
    { id: 8, godownId: "G008", cGodownId: "CG008", branch: "SEOHARA", godownName: "SEOHARA", address1: "", address2: "", city: "", zipCode: "", state: "", stateCode: "", country: "", inchargeName: "SAHIL" },
  ]);

  // Get search results
  const getSearchResults = (): GodownRecord[] => {
    let results = [...savedRecords];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(r => 
        r.branch.toLowerCase().includes(term) ||
        r.godownName.toLowerCase().includes(term) ||
        r.inchargeName.toLowerCase().includes(term) ||
        r.godownId.toLowerCase().includes(term)
      );
    }
    return results;
  };

  const searchResults: GodownRecord[] = getSearchResults();
  const totalPages: number = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults: GodownRecord[] = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate new ID
  const getNextId = (): number => {
    const maxId = savedRecords.length > 0 ? Math.max(...savedRecords.map(r => r.id)) : 0;
    return maxId + 1;
  };

  // Generate Godown ID
  const generateGodownId = (): string => {
    const count = savedRecords.length + 1;
    return `G${String(count).padStart(3, '0')}`;
  };

  // Generate C Godown ID
  const generateCGodownId = (): string => {
    const count = savedRecords.length + 1;
    return `CG${String(count).padStart(3, '0')}`;
  };

  // Reset form
  const resetForm = (): void => {
    setGodownId(generateGodownId());
    setCGodownId(generateCGodownId());
    setBranch("");
    setGodownName("");
    setAddress1("");
    setAddress2("");
    setCity("");
    setZipCode("");
    setState("");
    setStateCode("");
    setCountry("");
    setInchargeName("");
    setEditId(null);
  };

  const handleSave = (): void => {
    if (!branch.trim()) {
      alert("Please select Branch");
      return;
    }
    if (!godownName.trim()) {
      alert("Please enter Godown Name");
      return;
    }
    if (!inchargeName.trim()) {
      alert("Please enter Incharge Name");
      return;
    }

    if (editId) {
      // Update existing record
      const updatedRecords = savedRecords.map(record => 
        record.id === editId 
          ? { 
              ...record, 
              branch, 
              godownName, 
              address1, 
              address2, 
              city, 
              zipCode, 
              state, 
              stateCode, 
              country, 
              inchargeName 
            }
          : record
      );
      setSavedRecords(updatedRecords);
      alert("Record updated successfully!");
    } else {
      // Add new record
      const newRecord: GodownRecord = {
        id: getNextId(),
        godownId: godownId,
        cGodownId: cGodownId,
        branch,
        godownName,
        address1,
        address2,
        city,
        zipCode,
        state,
        stateCode,
        country,
        inchargeName
      };
      setSavedRecords([...savedRecords, newRecord]);
      alert("Record saved successfully!");
    }
    
    resetForm();
    setActiveTab("search");
  };

  const handleEdit = (record: GodownRecord): void => {
    setEditId(record.id);
    setGodownId(record.godownId);
    setCGodownId(record.cGodownId);
    setBranch(record.branch);
    setGodownName(record.godownName);
    setAddress1(record.address1);
    setAddress2(record.address2);
    setCity(record.city);
    setZipCode(record.zipCode);
    setState(record.state);
    setStateCode(record.stateCode);
    setCountry(record.country);
    setInchargeName(record.inchargeName);
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

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">GODOWN MASTER</h1>
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
          {/* Search Bar */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by Branch, Godown Name or Incharge Name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 h-8 text-xs"
              />
            </div>
            <Button 
              onClick={handleClearSearch} 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs"
            >
              <RefreshCw className="mr-1 h-3.5 w-3.5" />
              CLEAR
            </Button>
          </div>

          {/* Results Table */}
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1200px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold py-2 px-2 w-12 text-center">S#</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[150px]">Branch</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[150px]">Godown Name</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[120px]">Incharge Name</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[150px]">Address1</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[150px]">Address2</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[100px]">City</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[80px]">Zipcode</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[100px]">State</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[100px]">Country</TableHead>
                    <TableHead className="font-semibold py-2 px-2 w-24 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                        No records found. Please add new entry.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, index) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell className="py-2 px-2 text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="py-2 px-2 font-medium">
                          {record.branch}
                        </TableCell>
                        <TableCell className="py-2 px-2">
                          {record.godownName}
                        </TableCell>
                        <TableCell className="py-2 px-2">
                          {record.inchargeName}
                        </TableCell>
                        <TableCell className="py-2 px-2">
                          {record.address1 || "-"}
                        </TableCell>
                        <TableCell className="py-2 px-2">
                          {record.address2 || "-"}
                        </TableCell>
                        <TableCell className="py-2 px-2">
                          {record.city || "-"}
                        </TableCell>
                        <TableCell className="py-2 px-2">
                          {record.zipCode || "-"}
                        </TableCell>
                        <TableCell className="py-2 px-2">
                          {record.state || "-"}
                        </TableCell>
                        <TableCell className="py-2 px-2">
                          {record.country || "-"}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(record)}
                              className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(record.id)}
                              className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                              title="Delete"
                            >
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
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, searchResults.length)} of {searchResults.length} entries
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-7 text-xs"
                >
                  Previous
                </Button>
                <span className="px-3 py-1 text-xs">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-7 text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Godown ID */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Godown ID</Label>
              <Input
                value={godownId}
                readOnly
                className="h-7 md:h-8 text-xs bg-muted"
              />
            </div>

            {/* C Godown ID */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">C Godown ID</Label>
              <Input
                value={cGodownId}
                readOnly
                className="h-7 md:h-8 text-xs bg-muted"
              />
            </div>

            {/* Branch */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">
                Branch <span className="text-red-500">*</span>
              </Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger className="h-7 md:h-8 text-xs">
                  <SelectValue placeholder="SELECT BRANCH" />
                </SelectTrigger>
                <SelectContent>
                  {branchOptions.map((opt) => (
                    <SelectItem key={opt} value={opt} className="text-xs">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Godown Name */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">
                Godown Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={godownName}
                onChange={(e) => setGodownName(e.target.value)}
                placeholder="Enter Godown Name"
                className="h-7 md:h-8 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Address1 */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Address1</Label>
              <Input
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                placeholder="Enter Address Line 1"
                className="h-7 md:h-8 text-xs"
              />
            </div>

            {/* Address2 */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Address2</Label>
              <Input
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                placeholder="Enter Address Line 2"
                className="h-7 md:h-8 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* City */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">City</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter City"
                className="h-7 md:h-8 text-xs"
              />
            </div>

            {/* ZipCode */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">ZipCode</Label>
              <Input
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter Zip Code"
                className="h-7 md:h-8 text-xs"
              />
            </div>

            {/* State */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger className="h-7 md:h-8 text-xs">
                  <SelectValue placeholder="SELECT STATE" />
                </SelectTrigger>
                <SelectContent>
                  {stateOptions.map((opt) => (
                    <SelectItem key={opt} value={opt} className="text-xs">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* State Code */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">State Code</Label>
              <Input
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                placeholder="Enter State Code"
                className="h-7 md:h-8 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Country */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="h-7 md:h-8 text-xs">
                  <SelectValue placeholder="SELECT COUNTRY" />
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map((opt) => (
                    <SelectItem key={opt} value={opt} className="text-xs">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Incharge Name */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">
                Incharge Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={inchargeName}
                onChange={(e) => setInchargeName(e.target.value)}
                placeholder="Enter Incharge Name"
                className="h-7 md:h-8 text-xs"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-4">
            <Button onClick={handleSave} size="sm" className="h-7 md:h-8 text-xs">
              <Save className="mr-1 h-3 w-3" />
              {editId ? "UPDATE" : "SAVE"}
            </Button>
            <Button onClick={resetForm} variant="outline" size="sm" className="h-7 md:h-8 text-xs">
              <RefreshCw className="mr-1 h-3 w-3" />
              CLEAR
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}