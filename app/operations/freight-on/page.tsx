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
import { Save, RefreshCw, Search, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FreightOnRecord {
  id: number;
  code: string;
  name: string;
}

export default function FreightOnMaster() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"search" | "entry">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  
  // Form state
  const [freightOnCode, setFreightOnCode] = useState<string>("");
  const [freightOnName, setFreightOnName] = useState<string>("");

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<FreightOnRecord[]>([
    { id: 1, code: "W", name: "CHARGE WEIGHT" },
    { id: 2, code: "P", name: "PCKGS" },
    { id: 3, code: "F", name: "FIXED/FTL" },
    { id: 4, code: "K", name: "PER KM" },
    { id: 5, code: "V", name: "PERCENTAGE" },
    { id: 6, code: "S", name: "SLAB WISE" },
  ]);

  // Get search results
  const getSearchResults = (): FreightOnRecord[] => {
    let results = [...savedRecords];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(r => 
        r.code.toLowerCase().includes(term) ||
        r.name.toLowerCase().includes(term)
      );
    }
    return results;
  };

  const searchResults: FreightOnRecord[] = getSearchResults();
  const totalPages: number = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults: FreightOnRecord[] = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate new ID
  const getNextId = (): number => {
    const maxId = savedRecords.length > 0 ? Math.max(...savedRecords.map(r => r.id)) : 0;
    return maxId + 1;
  };

  // Reset form
  const resetForm = (): void => {
    setFreightOnCode("");
    setFreightOnName("");
    setEditId(null);
  };

  const handleSave = (): void => {
    if (!freightOnCode.trim()) {
      alert("Please enter Freight On Code");
      return;
    }
    if (!freightOnName.trim()) {
      alert("Please enter Freight On Name");
      return;
    }

    if (editId) {
      // Update existing record
      const updatedRecords = savedRecords.map(record => 
        record.id === editId 
          ? { ...record, code: freightOnCode.toUpperCase(), name: freightOnName }
          : record
      );
      setSavedRecords(updatedRecords);
      alert("Record updated successfully!");
    } else {
      // Add new record
      const newRecord: FreightOnRecord = {
        id: getNextId(),
        code: freightOnCode.toUpperCase(),
        name: freightOnName
      };
      setSavedRecords([...savedRecords, newRecord]);
      alert("Record saved successfully!");
    }
    
    resetForm();
    setActiveTab("search");
  };

  const handleEdit = (record: FreightOnRecord): void => {
    setEditId(record.id);
    setFreightOnCode(record.code);
    setFreightOnName(record.name);
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
        <h1 className="text-base md:text-lg font-bold">FREIGHT ON MASTER</h1>
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
                placeholder="Search by Code or Name..."
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
            <div className="min-w-[400px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold py-2 px-2 w-12 text-center">S#</TableHead>
                    <TableHead className="font-semibold py-2 px-2 w-20 text-center">Code</TableHead>
                    <TableHead className="font-semibold py-2 px-2">Name</TableHead>
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
                        <TableCell className="py-2 px-2 text-center font-mono font-bold">
                          {record.code}
                        </TableCell>
                        <TableCell className="py-2 px-2">
                          {record.name}
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
        <div className="space-y-4 max-w-2xl">
          {/* Freight On Code */}
          <div className="space-y-1">
            <Label className="text-[11px] md:text-xs font-medium">
              Freight On Code <span className="text-red-500">*</span>
            </Label>
            <Input
              value={freightOnCode}
              onChange={(e) => setFreightOnCode(e.target.value)}
              placeholder="Enter Freight On Code (e.g., W, P, F, K)"
              className="h-7 md:h-8 text-xs uppercase"
              maxLength={5}
            />
            <p className="text-[10px] text-muted-foreground">Single character code (e.g., W, P, F, K)</p>
          </div>

          {/* Freight On Name */}
          <div className="space-y-1">
            <Label className="text-[11px] md:text-xs font-medium">
              Freight On Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={freightOnName}
              onChange={(e) => setFreightOnName(e.target.value)}
              placeholder="Enter Freight On Name (e.g., CHARGE WEIGHT, PCKGS)"
              className="h-7 md:h-8 text-xs"
            />
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