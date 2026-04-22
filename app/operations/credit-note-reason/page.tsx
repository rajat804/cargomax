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
import { Plus, Trash2, X, Save, RefreshCw, Search, Edit, Pencil, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreditNoteReason {
  id: number;
  name: string;
  aliasName: string;
  ledger: string;
  reInvoice: boolean;
}

// Sample ledger options
const ledgerOptions = [
  "Sales Ledger",
  "Purchase Ledger",
  "Expense Ledger",
  "Income Ledger",
  "Freight Ledger",
  "Other Income Ledger",
  "Discount Ledger"
];

export default function CreditNoteReasonMaster() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"search" | "entry">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  
  // Form state
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [aliasName, setAliasName] = useState<string>("");
  const [ledger, setLedger] = useState<string>("");
  const [reInvoice, setReInvoice] = useState<boolean>(false);

  // Search state
  const [searchResults, setSearchResults] = useState<CreditNoteReason[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<CreditNoteReason[]>([
    {
      id: 1,
      name: "RATE DIFFERENCE",
      aliasName: "RATE DIFF",
      ledger: "Sales Ledger",
      reInvoice: true
    },
    {
      id: 2,
      name: "DAMAGE GOODS",
      aliasName: "DAMAGE",
      ledger: "Expense Ledger",
      reInvoice: false
    },
    {
      id: 3,
      name: "SHORTAGE",
      aliasName: "SHORT",
      ledger: "Purchase Ledger",
      reInvoice: false
    },
    {
      id: 4,
      name: "DELAY IN DELIVERY",
      aliasName: "DELAY",
      ledger: "Expense Ledger",
      reInvoice: true
    },
    {
      id: 5,
      name: "CUSTOMER CANCELLATION",
      aliasName: "CANCEL",
      ledger: "Sales Ledger",
      reInvoice: false
    },
    {
      id: 6,
      name: "WRONG BILLING",
      aliasName: "WRONG BILL",
      ledger: "Sales Ledger",
      reInvoice: true
    }
  ]);

  // Generate new ID
  const generateId = () => {
    const maxId = savedRecords.length > 0 ? Math.max(...savedRecords.map(r => r.id)) : 0;
    return (maxId + 1).toString();
  };

  // Reset form
  const resetForm = () => {
    setId(generateId());
    setName("");
    setAliasName("");
    setLedger("");
    setReInvoice(false);
    setEditId(null);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter Name");
      return;
    }

    const newRecord: CreditNoteReason = {
      id: editId || parseInt(id) || Date.now(),
      name: name,
      aliasName: aliasName,
      ledger: ledger,
      reInvoice: reInvoice
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
    handleSearch();
  };

  const handleSearch = () => {
    let results = [...savedRecords];
    if (searchTerm) {
      results = results.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.aliasName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toString().includes(searchTerm)
      );
    }
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleEdit = (record: CreditNoteReason) => {
    setEditId(record.id);
    setId(record.id.toString());
    setName(record.name);
    setAliasName(record.aliasName);
    setLedger(record.ledger);
    setReInvoice(record.reInvoice);
    setActiveTab("entry");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setSavedRecords(savedRecords.filter(record => record.id !== id));
      setSearchResults(searchResults.filter(record => record.id !== id));
      alert("Record deleted successfully!");
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  // Pagination
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">CREDIT NOTE REASON MASTER</h1>
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
            handleSearch();
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
          <div className="flex gap-2 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by ID, Name or Alias Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
            <Button onClick={handleSearch} size="sm" className="h-8 text-xs">
              <Search className="mr-1 h-3.5 w-3.5" />
              SEARCH
            </Button>
            <Button onClick={clearSearch} variant="outline" size="sm" className="h-8 text-xs">
              <RefreshCw className="mr-1 h-3.5 w-3.5" />
              CLEAR
            </Button>
          </div>

          {/* Results Table */}
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[600px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold py-2 px-2 w-12 text-center">S#</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[80px] text-center">ID</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[200px]">Name</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[150px]">Alias Name</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[100px] text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No records found. Click SEARCH to display results or add new entry.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, index) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell className="py-2 px-2 text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-center font-mono font-medium">
                          {record.id}
                        </TableCell>
                        <TableCell className="py-2 px-2 font-medium">
                          {record.name}
                        </TableCell>
                        <TableCell className="py-2 px-2">
                          {record.aliasName || "-"}
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
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, searchResults.length)} of {searchResults.length} entries
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
            {/* ID */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">ID</Label>
              <Input
                value={id}
                readOnly
                className="h-7 md:h-8 text-xs bg-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Name */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Credit Note Reason Name"
                className="h-7 md:h-8 text-xs"
              />
            </div>

            {/* Alias Name */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Alias Name</Label>
              <Input
                value={aliasName}
                onChange={(e) => setAliasName(e.target.value)}
                placeholder="Enter Alias Name"
                className="h-7 md:h-8 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Ledger */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Ledger</Label>
              <Select value={ledger} onValueChange={setLedger}>
                <SelectTrigger className="h-7 md:h-8 text-xs">
                  <SelectValue placeholder="SELECT LEDGER" />
                </SelectTrigger>
                <SelectContent>
                  {ledgerOptions.map((opt) => (
                    <SelectItem key={opt} value={opt} className="text-xs">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Re-Invoice Checkbox */}
            <div className="space-y-1 flex items-end">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={reInvoice}
                  onChange={(e) => setReInvoice(e.target.checked)}
                  className="h-3.5 w-3.5"
                />
                <Label className="text-[11px] md:text-xs font-medium cursor-pointer">
                  Re-Invoice
                </Label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-2">
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