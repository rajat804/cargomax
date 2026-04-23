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

interface VehicleManufacture {
  id: number;
  manufacturerCode: string;
  manufacturerName: string;
  active: boolean;
}

export default function VehicleManufactureMaster() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"search" | "entry">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  
  // Form state
  const [manufacturerCode, setManufacturerCode] = useState<string>("");
  const [manufacturerName, setManufacturerName] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<VehicleManufacture[]>([
    { id: 1, manufacturerCode: "M001", manufacturerName: "TATA MOTORS", active: true },
    { id: 2, manufacturerCode: "M002", manufacturerName: "BHARAT BENZ", active: true },
    { id: 3, manufacturerCode: "M003", manufacturerName: "MARUTI", active: true },
    { id: 4, manufacturerCode: "M004", manufacturerName: "TATA", active: true },
    { id: 5, manufacturerCode: "M005", manufacturerName: "ASHOK LEYLAND LTD", active: true },
    { id: 6, manufacturerCode: "M006", manufacturerName: "MAHINDRA", active: true },
    { id: 7, manufacturerCode: "M007", manufacturerName: "HERO", active: true },
    { id: 8, manufacturerCode: "M008", manufacturerName: "HONDA", active: true },
    { id: 9, manufacturerCode: "M009", manufacturerName: "EICHER MOTOR", active: true },
    { id: 10, manufacturerCode: "M010", manufacturerName: "BAJAJ", active: true },
  ]);

  // Generate manufacturer code
  const generateManufacturerCode = (): string => {
    const count = savedRecords.length + 1;
    return `M${String(count).padStart(3, '0')}`;
  };

  // Reset form
  const resetForm = (): void => {
    setManufacturerCode(generateManufacturerCode());
    setManufacturerName("");
    setActive(true);
    setEditId(null);
  };

  const handleSave = (): void => {
    if (!manufacturerName.trim()) {
      alert("Please enter Manufacturer Name");
      return;
    }

    if (editId) {
      // Update existing record
      const updatedRecords = savedRecords.map(record => 
        record.id === editId 
          ? { ...record, manufacturerName, active }
          : record
      );
      setSavedRecords(updatedRecords);
      alert("Record updated successfully!");
    } else {
      // Add new record
      const newRecord: VehicleManufacture = {
        id: Date.now(),
        manufacturerCode: manufacturerCode,
        manufacturerName: manufacturerName.trim(),
        active,
      };
      setSavedRecords([...savedRecords, newRecord]);
      alert("Record saved successfully!");
    }
    
    resetForm();
    setActiveTab("search");
  };

  const handleEdit = (record: VehicleManufacture): void => {
    setEditId(record.id);
    setManufacturerCode(record.manufacturerCode);
    setManufacturerName(record.manufacturerName);
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
  const getSearchResults = (): VehicleManufacture[] => {
    let results = [...savedRecords];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(r => 
        r.manufacturerName.toLowerCase().includes(term) ||
        r.manufacturerCode.toLowerCase().includes(term)
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
        <h1 className="text-base md:text-lg font-bold">VEHICLE MANUFACTURE MASTER</h1>
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
                placeholder="Search by Manufacturer Name..."
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
                    <TableHead className="font-semibold py-2 px-2 min-w-[200px]">Manufacturer Name</TableHead>
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
                          {record.manufacturerName}
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
          {/* Manufacturer Code */}
          <div className="space-y-1">
            <Label className="text-[11px] md:text-xs font-medium">Manufacturer Code</Label>
            <Input
              value={manufacturerCode}
              readOnly
              className="h-7 md:h-8 text-xs bg-muted"
            />
          </div>

          {/* Manufacturer Name */}
          <div className="space-y-1">
            <Label className="text-[11px] md:text-xs font-medium">
              Manufacturer Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={manufacturerName}
              onChange={(e) => setManufacturerName(e.target.value)}
              placeholder="Enter Manufacturer Name"
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