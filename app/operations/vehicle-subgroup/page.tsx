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
import { Save, RefreshCw, Search, Pencil, Trash2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleSubGroup {
  id: number;
  vehicleSubGroupCode: string;
  vehicleSubGroupName: string;
  active: boolean;
}

export default function VehicleSubGroupMaster() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"search" | "entry">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  
  // Form state
  const [vehicleSubGroupCode, setVehicleSubGroupCode] = useState<string>("");
  const [vehicleSubGroupName, setVehicleSubGroupName] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<VehicleSubGroup[]>([
    { id: 1, vehicleSubGroupCode: "VSG001", vehicleSubGroupName: "TESTING", active: true },
    { id: 2, vehicleSubGroupCode: "VSG002", vehicleSubGroupName: "HEAVY DUTY", active: true },
    { id: 3, vehicleSubGroupCode: "VSG003", vehicleSubGroupName: "LIGHT DUTY", active: true },
    { id: 4, vehicleSubGroupCode: "VSG004", vehicleSubGroupName: "CONTAINER", active: false },
    { id: 5, vehicleSubGroupCode: "VSG005", vehicleSubGroupName: "TRAILER", active: true },
    { id: 6, vehicleSubGroupCode: "VSG006", vehicleSubGroupName: "TANKER", active: true },
  ]);

  // Generate vehicle sub group code
  const generateVehicleSubGroupCode = (): string => {
    const count = savedRecords.length + 1;
    return `VSG${String(count).padStart(3, '0')}`;
  };

  // Reset form
  const resetForm = (): void => {
    setVehicleSubGroupCode(generateVehicleSubGroupCode());
    setVehicleSubGroupName("");
    setActive(true);
    setEditId(null);
  };

  const handleSave = (): void => {
    if (!vehicleSubGroupName.trim()) {
      alert("Please enter Vehicle Sub Group Name");
      return;
    }

    if (editId) {
      // Update existing record
      const updatedRecords = savedRecords.map(record => 
        record.id === editId 
          ? { ...record, vehicleSubGroupName, active }
          : record
      );
      setSavedRecords(updatedRecords);
      alert("Record updated successfully!");
    } else {
      // Add new record
      const newRecord: VehicleSubGroup = {
        id: Date.now(),
        vehicleSubGroupCode: vehicleSubGroupCode,
        vehicleSubGroupName: vehicleSubGroupName.trim(),
        active,
      };
      setSavedRecords([...savedRecords, newRecord]);
      alert("Record saved successfully!");
    }
    
    resetForm();
    setActiveTab("search");
  };

  const handleEdit = (record: VehicleSubGroup): void => {
    setEditId(record.id);
    setVehicleSubGroupCode(record.vehicleSubGroupCode);
    setVehicleSubGroupName(record.vehicleSubGroupName);
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
  const getSearchResults = (): VehicleSubGroup[] => {
    let results = [...savedRecords];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(r => 
        r.vehicleSubGroupName.toLowerCase().includes(term) ||
        r.vehicleSubGroupCode.toLowerCase().includes(term)
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
        <h1 className="text-base md:text-lg font-bold">VEHICLE SUBGROUP MASTER</h1>
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
                placeholder="Search by Group Name..."
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
                    <TableHead className="font-semibold py-2 px-2 min-w-[200px]">Group Name</TableHead>
                    <TableHead className="font-semibold py-2 px-2 w-24 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
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
                          {record.vehicleSubGroupName}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-center">
                          <div className="flex items-center justify-center gap-2">
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
          {/* Vehicle Sub Group Code */}
          <div className="space-y-1">
            <Label className="text-[11px] md:text-xs font-medium">Vehicle Sub Group Code</Label>
            <Input
              value={vehicleSubGroupCode}
              readOnly
              className="h-7 md:h-8 text-xs bg-muted"
            />
          </div>

          {/* Vehicle Sub Group Name */}
          <div className="space-y-1">
            <Label className="text-[11px] md:text-xs font-medium">
              Vehicle Sub Group Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={vehicleSubGroupName}
              onChange={(e) => setVehicleSubGroupName(e.target.value)}
              placeholder="Enter Vehicle Sub Group Name"
              className="h-7 md:h-8 text-xs"
            />
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