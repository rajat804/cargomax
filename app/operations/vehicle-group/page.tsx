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
import { Save, RefreshCw, Search, Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleGroup {
  id: number;
  vehicleGroupCode: string;
  modeType: string;
  vehicleGroupName: string;
  autoSerial: boolean;
  active: boolean;
}

const modeTypeOptions = [
  "Road",
  "Rail",
  "Air",
  "Sea",
  "Multi-Modal"
];

export default function VehicleGroupMaster() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"search" | "entry">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  
  // Form state
  const [vehicleGroupCode, setVehicleGroupCode] = useState<string>("");
  const [modeType, setModeType] = useState<string>("");
  const [vehicleGroupName, setVehicleGroupName] = useState<string>("");
  const [autoSerial, setAutoSerial] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(true);

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<VehicleGroup[]>([
    { id: 1, vehicleGroupCode: "VG001", modeType: "Road", vehicleGroupName: "LOCAL VEHICLE", autoSerial: false, active: true },
    { id: 2, vehicleGroupCode: "VG002", modeType: "Road", vehicleGroupName: "LONG ROUTE VEHICLE", autoSerial: false, active: true },
    { id: 3, vehicleGroupCode: "VG003", modeType: "Road", vehicleGroupName: "CONTAINER", autoSerial: false, active: true },
    { id: 4, vehicleGroupCode: "VG004", modeType: "Multi-Modal", vehicleGroupName: "GENERAL", autoSerial: false, active: true },
    { id: 5, vehicleGroupCode: "VG005", modeType: "Rail", vehicleGroupName: "INDIAN RAILWAYS", autoSerial: false, active: true },
    { id: 6, vehicleGroupCode: "VG006", modeType: "Road", vehicleGroupName: "TESTING GROUP", autoSerial: false, active: true },
  ]);

  // Generate vehicle group code
  const generateVehicleGroupCode = (): string => {
    const count = savedRecords.length + 1;
    return `VG${String(count).padStart(3, '0')}`;
  };

  // Reset form
  const resetForm = (): void => {
    setVehicleGroupCode(generateVehicleGroupCode());
    setModeType("");
    setVehicleGroupName("");
    setAutoSerial(false);
    setActive(true);
    setEditId(null);
  };

  const handleSave = (): void => {
    if (!modeType) {
      alert("Please select Mode Type");
      return;
    }
    if (!vehicleGroupName.trim()) {
      alert("Please enter Vehicle Group Name");
      return;
    }

    if (editId) {
      // Update existing record
      const updatedRecords = savedRecords.map(record => 
        record.id === editId 
          ? { 
              ...record, 
              modeType, 
              vehicleGroupName, 
              autoSerial, 
              active 
            }
          : record
      );
      setSavedRecords(updatedRecords);
      alert("Record updated successfully!");
    } else {
      // Add new record
      const newRecord: VehicleGroup = {
        id: Date.now(),
        vehicleGroupCode: vehicleGroupCode,
        modeType,
        vehicleGroupName,
        autoSerial,
        active,
      };
      setSavedRecords([...savedRecords, newRecord]);
      alert("Record saved successfully!");
    }
    
    resetForm();
    setActiveTab("search");
  };

  const handleEdit = (record: VehicleGroup): void => {
    setEditId(record.id);
    setVehicleGroupCode(record.vehicleGroupCode);
    setModeType(record.modeType);
    setVehicleGroupName(record.vehicleGroupName);
    setAutoSerial(record.autoSerial);
    setActive(record.active);
    setActiveTab("entry");
  };

  const handleDelete = (id: number): void => {
    if (confirm("Are you sure you want to delete this record?")) {
      setSavedRecords(savedRecords.filter(record => record.id !== id));
      alert("Record deleted successfully!");
    }
  };

  // Search functions
  const getSearchResults = (): VehicleGroup[] => {
    let results = [...savedRecords];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(r => 
        r.vehicleGroupName.toLowerCase().includes(term) ||
        r.vehicleGroupCode.toLowerCase().includes(term) ||
        r.modeType.toLowerCase().includes(term)
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
        <h1 className="text-base md:text-lg font-bold">VEHICLE GROUP MASTER</h1>
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
                placeholder="Search by Group Name, Code or Mode Type..."
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
            <div className="min-w-[500px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold py-2 px-2 w-12 text-center">S#</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[150px]">Name</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[80px] text-center">Active</TableHead>
                    <TableHead className="font-semibold py-2 px-2 w-24 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
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
                          {record.vehicleGroupName}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-center">
                          {record.active ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px]">
                              <Check className="h-2.5 w-2.5" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px]">
                              <X className="h-2.5 w-2.5" /> No
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(record)}
                            className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
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
                <span className="px-3 py-1 text-xs bg-muted rounded-md">
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
        <div className="space-y-4 max-w-2xl">
          {/* Vehicle Group Code */}
          <div className="space-y-1">
            <Label className="text-[11px] md:text-xs font-medium">Vehicle Group Code</Label>
            <Input
              value={vehicleGroupCode}
              readOnly
              className="h-7 md:h-8 text-xs bg-muted"
            />
          </div>

          {/* Mode Type */}
          <div className="space-y-1">
            <Label className="text-[11px] md:text-xs font-medium">
              Mode Type <span className="text-red-500">*</span>
            </Label>
            <Select value={modeType} onValueChange={setModeType}>
              <SelectTrigger className="h-7 md:h-8 text-xs">
                <SelectValue placeholder="SELECT" />
              </SelectTrigger>
              <SelectContent>
                {modeTypeOptions.map((opt) => (
                  <SelectItem key={opt} value={opt} className="text-xs">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Group Name */}
          <div className="space-y-1">
            <Label className="text-[11px] md:text-xs font-medium">
              Vehicle Group Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={vehicleGroupName}
              onChange={(e) => setVehicleGroupName(e.target.value)}
              placeholder="Enter Vehicle Group Name"
              className="h-7 md:h-8 text-xs"
            />
          </div>

          {/* Auto Serial Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoSerial}
              onChange={(e) => setAutoSerial(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-gray-300"
              id="autoSerial"
            />
            <Label htmlFor="autoSerial" className="text-[11px] md:text-xs font-medium cursor-pointer">
              Auto Serial
            </Label>
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-gray-300"
              id="active"
            />
            <Label htmlFor="active" className="text-[11px] md:text-xs font-medium cursor-pointer">
              Active
            </Label>
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