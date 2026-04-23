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
import { Save, Trash2, Search, RefreshCw, Plus, Check, X, Edit, Eye, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface PackingRecord {
  id: number;
  packingName: string;
  aliasName: string;
  packingType: string;
  loadType: string;
  item: string;
  length: number;
  breadth: number;
  height: number;
  iataWeight: number;
  nonIataWeight: number;
  unitType: string;
  cft: number;
  manageEmptyBin: boolean;
  active: boolean;
  isEditing?: boolean;
}

const packingTypeOptions = [
  { value: "Carton", label: "Carton" },
  { value: "Box", label: "Box" },
  { value: "Pallet", label: "Pallet" },
  { value: "Crate", label: "Crate" },
  { value: "Bag", label: "Bag" },
  { value: "Drum", label: "Drum" },
  { value: "Container", label: "Container" }
];

const loadTypeOptions = [
  { value: "FTL", label: "FTL" },
  { value: "LTL", label: "LTL" },
  { value: "Container", label: "Container" },
  { value: "Bulk", label: "Bulk" },
  { value: "Liquid", label: "Liquid" },
  { value: "Powder", label: "Powder" }
];

const unitTypeOptions = [
  { value: "CM", label: "CM" },
  { value: "INCH", label: "INCH" },
  { value: "MM", label: "MM" },
  { value: "METER", label: "METER" },
  { value: "FEET", label: "FEET" }
];

const itemOptions = [
  { value: "Electronics", label: "Electronics" },
  { value: "Furniture", label: "Furniture" },
  { value: "Clothing", label: "Clothing" },
  { value: "Food Items", label: "Food Items" },
  { value: "Pharmaceuticals", label: "Pharmaceuticals" },
  { value: "Chemicals", label: "Chemicals" },
  { value: "Machinery", label: "Machinery" },
  { value: "Auto Parts", label: "Auto Parts" },
  { value: "Books", label: "Books" },
  { value: "Fragile Items", label: "Fragile Items" }
];

export default function PackingMaster() {
  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<PackingRecord[]>([
    { id: 1, packingName: "Standard Carton", aliasName: "Std Carton", packingType: "Carton", loadType: "FTL", item: "Electronics", length: 50, breadth: 40, height: 30, iataWeight: 5, nonIataWeight: 4.5, unitType: "CM", cft: 0.212, manageEmptyBin: false, active: true, isEditing: false },
    { id: 2, packingName: "Heavy Duty Box", aliasName: "HD Box", packingType: "Box", loadType: "LTL", item: "Machinery", length: 100, breadth: 80, height: 60, iataWeight: 15, nonIataWeight: 14, unitType: "CM", cft: 1.696, manageEmptyBin: true, active: true, isEditing: false },
    { id: 3, packingName: "Wooden Pallet", aliasName: "Pallet", packingType: "Pallet", loadType: "Container", item: "Furniture", length: 120, breadth: 100, height: 15, iataWeight: 20, nonIataWeight: 18, unitType: "CM", cft: 0.636, manageEmptyBin: false, active: true, isEditing: false },
    { id: 4, packingName: "Plastic Crate", aliasName: "Crate", packingType: "Crate", loadType: "Bulk", item: "Food Items", length: 60, breadth: 40, height: 35, iataWeight: 8, nonIataWeight: 7.5, unitType: "CM", cft: 0.297, manageEmptyBin: true, active: false, isEditing: false },
    { id: 5, packingName: "Jute Bag", aliasName: "Bag", packingType: "Bag", loadType: "Powder", item: "Chemicals", length: 0, breadth: 0, height: 0, iataWeight: 25, nonIataWeight: 23, unitType: "CM", cft: 0, manageEmptyBin: false, active: true, isEditing: false },
  ]);

  // Get search results
  const getSearchResults = (): PackingRecord[] => {
    let results = [...savedRecords];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(r => 
        r.packingName.toLowerCase().includes(term) ||
        r.aliasName.toLowerCase().includes(term) ||
        r.packingType.toLowerCase().includes(term) ||
        r.item.toLowerCase().includes(term)
      );
    }
    return results;
  };

  const searchResults: PackingRecord[] = getSearchResults();
  const totalPages: number = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults: PackingRecord[] = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Add new row
  const addNewRow = () => {
    const newRecord: PackingRecord = {
      id: Date.now(),
      packingName: "",
      aliasName: "",
      packingType: "",
      loadType: "",
      item: "",
      length: 0,
      breadth: 0,
      height: 0,
      iataWeight: 0,
      nonIataWeight: 0,
      unitType: "CM",
      cft: 0,
      manageEmptyBin: false,
      active: false,
      isEditing: true
    };
    setSavedRecords([newRecord, ...savedRecords]);
  };

  // Update record
  const updateRecord = (id: number, field: keyof PackingRecord, value: any) => {
    setSavedRecords(savedRecords.map(record => 
      record.id === id ? { ...record, [field]: value } : record
    ));
  };

  // Save record
  const saveRecord = (id: number) => {
    const record = savedRecords.find(r => r.id === id);
    if (record) {
      if (!record.packingName) {
        alert("Please enter Packing Name");
        return;
      }
      if (!record.packingType) {
        alert("Please select Packing Type");
        return;
      }
      setSavedRecords(savedRecords.map(r => 
        r.id === id ? { ...r, isEditing: false } : r
      ));
      alert("Record saved successfully!");
    }
  };

  // Edit record
  const editRecord = (id: number) => {
    setSavedRecords(savedRecords.map(record => 
      record.id === id ? { ...record, isEditing: true } : record
    ));
  };

  // Remove record
  const removeRecord = (id: number) => {
    if (confirm("Are you sure you want to remove this packing?")) {
      setSavedRecords(savedRecords.filter(record => record.id !== id));
      alert("Record removed successfully!");
    }
  };

  // Calculate CFT
  const calculateCFT = (length: number, breadth: number, height: number, unitType: string): number => {
    if (unitType === "CM") {
      return (length * breadth * height) / 283168.5;
    } else if (unitType === "INCH") {
      return (length * breadth * height) / 1728;
    } else if (unitType === "METER") {
      return length * breadth * height;
    } else if (unitType === "FEET") {
      return length * breadth * height;
    }
    return 0;
  };

  const handleDimensionChange = (id: number, field: "length" | "breadth" | "height", value: number) => {
    updateRecord(id, field, value);
    const record = savedRecords.find(r => r.id === id);
    if (record) {
      const length = field === "length" ? value : record.length;
      const breadth = field === "breadth" ? value : record.breadth;
      const height = field === "height" ? value : record.height;
      const cft = calculateCFT(length, breadth, height, record.unitType);
      updateRecord(id, "cft", cft);
    }
  };

  const handleUnitTypeChange = (id: number, value: string) => {
    updateRecord(id, "unitType", value);
    const record = savedRecords.find(r => r.id === id);
    if (record) {
      const cft = calculateCFT(record.length, record.breadth, record.height, value);
      updateRecord(id, "cft", cft);
    }
  };

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
        <h1 className="text-base md:text-lg font-bold">PACKING MASTER</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Search Bar and Add Button */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by Packing Name, Alias Name, Type or Item..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8 h-8 text-xs"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={addNewRow} size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700">
            <Plus className="mr-1 h-3 w-3" />
            ADD NEW
          </Button>
          <Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs">
            <RefreshCw className="mr-1 h-3.5 w-3.5" />
            CLEAR
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-md border overflow-x-auto shadow-sm">
        <div className="min-w-[1400px]">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <TableHead className="font-semibold py-3 px-2 w-12 text-center">S#</TableHead>
                <TableHead className="font-semibold py-3 px-2 min-w-[120px]">Packing Name</TableHead>
                <TableHead className="font-semibold py-3 px-2 min-w-[100px]">Alias Name</TableHead>
                <TableHead className="font-semibold py-3 px-2 min-w-[100px]">Packing Type</TableHead>
                <TableHead className="font-semibold py-3 px-2 min-w-[80px]">Load Type</TableHead>
                <TableHead className="font-semibold py-3 px-2 min-w-[100px]">Item</TableHead>
                <TableHead className="font-semibold py-3 px-2 min-w-[70px] text-center">Length</TableHead>
                <TableHead className="font-semibold py-3 px-2 min-w-[70px] text-center">Breadth</TableHead>
                <TableHead className="font-semibold py-3 px-2 min-w-[70px] text-center">Height</TableHead>
                <TableHead className="font-semibold py-3 px-2 min-w-[90px] text-center">IATA Weight</TableHead>
                <TableHead className="font-semibold py-3 px-2 min-w-[90px] text-center">Non IATA Weight</TableHead>
                <TableHead className="font-semibold py-3 px-2 min-w-[80px]">Unit Type</TableHead>
                <TableHead className="font-semibold py-3 px-2 min-w-[70px] text-center">CFT</TableHead>
                <TableHead className="font-semibold py-3 px-2 min-w-[110px] text-center">Manage Empty Bin</TableHead>
                <TableHead className="font-semibold py-3 px-2 min-w-[70px] text-center">Active</TableHead>
                <TableHead className="font-semibold py-3 px-2 w-28 text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={16} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-8 w-8 text-muted-foreground" />
                      <span>No records found. Click ADD NEW to add packing details.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedResults.map((record, index) => (
                  <TableRow key={record.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="py-2 px-2 text-center font-medium">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    
                    {/* Packing Name */}
                    <TableCell className="py-2 px-2">
                      {record.isEditing ? (
                        <Input
                          value={record.packingName}
                          onChange={(e) => updateRecord(record.id, "packingName", e.target.value)}
                          placeholder="Enter Packing Name"
                          className="h-7 text-xs"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium">{record.packingName || "-"}</span>
                      )}
                    </TableCell>
                    
                    {/* Alias Name */}
                    <TableCell className="py-2 px-2">
                      {record.isEditing ? (
                        <Input
                          value={record.aliasName}
                          onChange={(e) => updateRecord(record.id, "aliasName", e.target.value)}
                          placeholder="Enter Alias Name"
                          className="h-7 text-xs"
                        />
                      ) : (
                        <span>{record.aliasName || "-"}</span>
                      )}
                    </TableCell>
                    
                    {/* Packing Type */}
                    <TableCell className="py-2 px-2">
                      {record.isEditing ? (
                        <Select
                          value={record.packingType || undefined}
                          onValueChange={(value) => updateRecord(record.id, "packingType", value)}
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue placeholder="Select Packing Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {packingTypeOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px]">
                          {record.packingType || "-"}
                        </span>
                      )}
                    </TableCell>
                    
                    {/* Load Type */}
                    <TableCell className="py-2 px-2">
                      {record.isEditing ? (
                        <Select
                          value={record.loadType || undefined}
                          onValueChange={(value) => updateRecord(record.id, "loadType", value)}
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue placeholder="Select Load Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {loadTypeOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px]">
                          {record.loadType || "-"}
                        </span>
                      )}
                    </TableCell>
                    
                    {/* Item */}
                    <TableCell className="py-2 px-2">
                      {record.isEditing ? (
                        <Select
                          value={record.item || undefined}
                          onValueChange={(value) => updateRecord(record.id, "item", value)}
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue placeholder="Select Item" />
                          </SelectTrigger>
                          <SelectContent>
                            {itemOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span>{record.item || "-"}</span>
                      )}
                    </TableCell>
                    
                    {/* Length */}
                    <TableCell className="py-2 px-2">
                      {record.isEditing ? (
                        <Input
                          type="number"
                          value={record.length}
                          onChange={(e) => handleDimensionChange(record.id, "length", Number(e.target.value))}
                          className="h-7 text-xs text-center"
                        />
                      ) : (
                        <span className="text-center block">{record.length || 0}</span>
                      )}
                    </TableCell>
                    
                    {/* Breadth */}
                    <TableCell className="py-2 px-2">
                      {record.isEditing ? (
                        <Input
                          type="number"
                          value={record.breadth}
                          onChange={(e) => handleDimensionChange(record.id, "breadth", Number(e.target.value))}
                          className="h-7 text-xs text-center"
                        />
                      ) : (
                        <span className="text-center block">{record.breadth || 0}</span>
                      )}
                    </TableCell>
                    
                    {/* Height */}
                    <TableCell className="py-2 px-2">
                      {record.isEditing ? (
                        <Input
                          type="number"
                          value={record.height}
                          onChange={(e) => handleDimensionChange(record.id, "height", Number(e.target.value))}
                          className="h-7 text-xs text-center"
                        />
                      ) : (
                        <span className="text-center block">{record.height || 0}</span>
                      )}
                    </TableCell>
                    
                    {/* IATA Weight */}
                    <TableCell className="py-2 px-2">
                      {record.isEditing ? (
                        <Input
                          type="number"
                          value={record.iataWeight}
                          onChange={(e) => updateRecord(record.id, "iataWeight", Number(e.target.value))}
                          className="h-7 text-xs text-center"
                          step="0.01"
                        />
                      ) : (
                        <span className="text-center block">{record.iataWeight}</span>
                      )}
                    </TableCell>
                    
                    {/* Non IATA Weight */}
                    <TableCell className="py-2 px-2">
                      {record.isEditing ? (
                        <Input
                          type="number"
                          value={record.nonIataWeight}
                          onChange={(e) => updateRecord(record.id, "nonIataWeight", Number(e.target.value))}
                          className="h-7 text-xs text-center"
                          step="0.01"
                        />
                      ) : (
                        <span className="text-center block">{record.nonIataWeight}</span>
                      )}
                    </TableCell>
                    
                    {/* Unit Type */}
                    <TableCell className="py-2 px-2">
                      {record.isEditing ? (
                        <Select
                          value={record.unitType}
                          onValueChange={(value) => handleUnitTypeChange(record.id, value)}
                        >
                          <SelectTrigger className="h-7 text-xs">
                            <SelectValue placeholder="Select Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {unitTypeOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-center block">{record.unitType}</span>
                      )}
                    </TableCell>
                    
                    {/* CFT */}
                    <TableCell className="py-2 px-2 text-center font-mono font-medium text-blue-600">
                      {record.cft.toFixed(4)}
                    </TableCell>
                    
                    {/* Manage Empty Bin - Always enabled */}
                    <TableCell className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={record.manageEmptyBin}
                        onChange={(e) => updateRecord(record.id, "manageEmptyBin", e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </TableCell>
                    
                    {/* Active - Always enabled */}
                    <TableCell className="py-2 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={record.active}
                        onChange={(e) => updateRecord(record.id, "active", e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </TableCell>
                    
                    {/* Action Buttons */}
                    <TableCell className="py-2 px-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {record.isEditing ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => saveRecord(record.id)}
                            className="h-7 w-7 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                            title="Save"
                          >
                            <Save className="h-3.5 w-3.5" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editRecord(record.id)}
                            className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRecord(record.id)}
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
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

      {/* Bottom Note */}
      <div className="text-[10px] text-muted-foreground text-center pt-2 border-t">
        <span className="bg-yellow-50 px-2 py-1 rounded">💡 Note: CFT is automatically calculated based on Length × Breadth × Height</span>
      </div>
    </div>
  );
}