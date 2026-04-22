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
import { CalendarIcon, Plus, Trash2, X, Save, RefreshCw, Search, Edit, Eye, Copy, Printer, Upload, Download, Pencil, EyeIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface CommissionRow {
  id: number;
  product: string;
  goods: string;
  category: string;
  applicable: string;
  applicableOn: string;
  fromSlab: string;
  toSlab: string;
  cashRate: string;
  cashMinimum: string;
  creditRate: string;
  creditMinimum: string;
  toPayRate: string;
  toPayMinimum: string;
  includeAdditional: boolean;
  excludeAdditional: boolean;
}

interface AdditionalCharge {
  id: number;
  name: string;
  type: string;
  rate: string;
  amount: string;
  perc: string;
}

interface ListItem {
  id: number;
  name: string;
  checked: boolean;
}

interface AgencyCommissionRecord {
  id: number;
  agencyName: string;
  wefDate: Date;
  validUpto: Date | undefined;
  selectedProduct: string;
  selectedGoods: string[];
  commissionCategory: string;
  commissionRows: CommissionRow[];
  additionalCharges: AdditionalCharge[];
  createdAt: Date;
}

export default function AgencyCommissionMaster() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"search" | "entry">("entry");
  
  // Form state
  const [rows, setRows] = useState<CommissionRow[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedGoods, setSelectedGoods] = useState<string[]>([]);
  const [wefDate, setWefDate] = useState<Date>(new Date());
  const [validUpto, setValidUpto] = useState<Date | undefined>();
  const [agencyName, setAgencyName] = useState<string>("");
  const [commissionCategory, setCommissionCategory] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null);

  // Search state
  const [searchResults, setSearchResults] = useState<AgencyCommissionRecord[]>([]);
  const [searchFromDate, setSearchFromDate] = useState<Date | undefined>();
  const [searchToDate, setSearchToDate] = useState<Date | undefined>();
  const [searchBranch, setSearchBranch] = useState<string>("");

  // Dialog states
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isGoodsDialogOpen, setIsGoodsDialogOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [goodsSearch, setGoodsSearch] = useState("");
  const [selectAllProduct, setSelectAllProduct] = useState(false);
  const [selectAllGoods, setSelectAllGoods] = useState(false);

  // List data
  const [productList, setProductList] = useState<ListItem[]>([
    { id: 1, name: "Product A - Transportation", checked: false },
    { id: 2, name: "Product B - Logistics", checked: false },
    { id: 3, name: "Product C - Warehousing", checked: false },
    { id: 4, name: "Product D - Supply Chain", checked: false },
    { id: 5, name: "Product E - Freight Forward", checked: false },
    { id: 6, name: "Product F - Courier Service", checked: false },
    { id: 7, name: "Product G - Cargo Handling", checked: false },
    { id: 8, name: "Product H - Cold Storage", checked: false },
    { id: 9, name: "Product I - Packaging", checked: false },
    { id: 10, name: "Product J - Insurance", checked: false },
  ]);

  const [goodsList, setGoodsList] = useState<ListItem[]>([
    { id: 1, name: "Electronics & Appliances", checked: false },
    { id: 2, name: "Furniture & Furnishings", checked: false },
    { id: 3, name: "Clothing & Textiles", checked: false },
    { id: 4, name: "Food & Beverages", checked: false },
    { id: 5, name: "Pharmaceuticals", checked: false },
    { id: 6, name: "Chemicals & Solvents", checked: false },
    { id: 7, name: "Machinery & Equipment", checked: false },
    { id: 8, name: "Auto Parts & Accessories", checked: false },
    { id: 9, name: "Books & Stationery", checked: false },
    { id: 10, name: "Fragile & Glass Items", checked: false },
    { id: 11, name: "Construction Material", checked: false },
    { id: 12, name: "Agricultural Products", checked: false },
    { id: 13, name: "Petroleum Products", checked: false },
    { id: 14, name: "Metal & Scrap", checked: false },
    { id: 15, name: "Plastic & Rubber", checked: false },
  ]);

  const agencies = [
    "Agency 1 - Mumbai Transport",
    "Agency 2 - Delhi Logistics", 
    "Agency 3 - Bangalore Carriers",
    "Agency 4 - Chennai Movers",
    "Agency 5 - Kolkata Freight",
    "Agency 6 - Hyderabad Express",
    "Agency 7 - Pune Transport",
    "Agency 8 - Ahmedabad Carriers",
  ];
  
  const commissionCategories = [
    "Category 1 - Basic Commission",
    "Category 2 - Premium Commission",
    "Category 3 - Special Commission",
    "Category 4 - Volume Discount",
    "Category 5 - Seasonal Offer",
  ];

  const chargeTypes = ["Percentage", "Fixed", "Slab"];

  const [additionalCharges, setAdditionalCharges] = useState<AdditionalCharge[]>([
    { id: 1, name: "DOCKET CHARGE", type: "Select", rate: "0.00", amount: "100.00", perc: "0" },
    { id: 2, name: "DOOR DELIVERY", type: "Select", rate: "0.00", amount: "0.00", perc: "0" },
    { id: 3, name: "GREEN TAX CHARGE", type: "Select", rate: "0.00", amount: "0.00", perc: "0" },
    { id: 4, name: "HAMALI CHARGE", type: "Select", rate: "0.00", amount: "0.00", perc: "0" },
    { id: 5, name: "OTHER CHARGES", type: "Select", rate: "0.00", amount: "0.00", perc: "0" },
    { id: 6, name: "PF CHARGE", type: "Select", rate: "0.00", amount: "0.00", perc: "0" },
  ]);

  // Sample saved data for search
  const [savedRecords, setSavedRecords] = useState<AgencyCommissionRecord[]>([
    {
      id: 1,
      agencyName: "Agency 1 - Mumbai Transport",
      wefDate: new Date("2025-04-01"),
      validUpto: new Date("2026-03-31"),
      selectedProduct: "Product A - Transportation, Product B - Logistics",
      selectedGoods: ["Electronics & Appliances", "Furniture & Furnishings"],
      commissionCategory: "Category 1 - Basic Commission",
      commissionRows: [],
      additionalCharges: [...additionalCharges],
      createdAt: new Date("2025-04-01"),
    },
    {
      id: 2,
      agencyName: "Agency 2 - Delhi Logistics",
      wefDate: new Date("2025-04-01"),
      validUpto: new Date("2026-03-31"),
      selectedProduct: "Product C - Warehousing",
      selectedGoods: ["Clothing & Textiles", "Food & Beverages"],
      commissionCategory: "Category 2 - Premium Commission",
      commissionRows: [],
      additionalCharges: [...additionalCharges],
      createdAt: new Date("2025-04-01"),
    },
  ]);

  const addRow = () => {
    const newRow: CommissionRow = {
      id: Date.now(),
      product: "",
      goods: "",
      category: "",
      applicable: "",
      applicableOn: "",
      fromSlab: "",
      toSlab: "",
      cashRate: "",
      cashMinimum: "",
      creditRate: "",
      creditMinimum: "",
      toPayRate: "",
      toPayMinimum: "",
      includeAdditional: false,
      excludeAdditional: false,
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const updateRow = (id: number, field: keyof CommissionRow, value: any) => {
    setRows(rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const updateAdditionalCharge = (id: number, field: keyof AdditionalCharge, value: any) => {
    setAdditionalCharges(additionalCharges.map((charge) => 
      charge.id === id ? { ...charge, [field]: value } : charge
    ));
  };

  // Handle Product Dialog
  const handleSelectAllProducts = () => {
    const newChecked = !selectAllProduct;
    setSelectAllProduct(newChecked);
    setProductList(productList.map(p => ({ ...p, checked: newChecked })));
  };

  const handleProductCheck = (id: number) => {
    setProductList(productList.map(p => 
      p.id === id ? { ...p, checked: !p.checked } : p
    ));
  };

  React.useEffect(() => {
    const allChecked = productList.length > 0 && productList.every(p => p.checked);
    setSelectAllProduct(allChecked);
  }, [productList]);

  const handleProductConfirm = () => {
    const selected = productList.filter(p => p.checked).map(p => p.name);
    if (selected.length > 0) {
      setSelectedProduct(selected.join(", "));
    } else {
      setSelectedProduct("");
    }
    setIsProductDialogOpen(false);
  };

  // Handle Goods Dialog
  const handleSelectAllGoods = () => {
    const newChecked = !selectAllGoods;
    setSelectAllGoods(newChecked);
    setGoodsList(goodsList.map(g => ({ ...g, checked: newChecked })));
  };

  const handleGoodsCheck = (id: number) => {
    setGoodsList(goodsList.map(g => 
      g.id === id ? { ...g, checked: !g.checked } : g
    ));
  };

  React.useEffect(() => {
    const allChecked = goodsList.length > 0 && goodsList.every(g => g.checked);
    setSelectAllGoods(allChecked);
  }, [goodsList]);

  const handleGoodsConfirm = () => {
    const selected = goodsList.filter(g => g.checked).map(g => g.name);
    setSelectedGoods(selected);
    setIsGoodsDialogOpen(false);
  };

  const refreshProductList = () => {
    setProductList(productList.map(p => ({ ...p, checked: false })));
    setSelectAllProduct(false);
    setProductSearch("");
  };

  const refreshGoodsList = () => {
    setGoodsList(goodsList.map(g => ({ ...g, checked: false })));
    setSelectAllGoods(false);
    setGoodsSearch("");
  };

  const filteredProducts = productList.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredGoods = goodsList.filter(g => 
    g.name.toLowerCase().includes(goodsSearch.toLowerCase())
  );

  // Reset form
  const resetForm = () => {
    setRows([]);
    setSelectedProduct("");
    setSelectedGoods([]);
    setAgencyName("");
    setCommissionCategory("");
    setWefDate(new Date());
    setValidUpto(undefined);
    setEditId(null);
    setProductList(productList.map(p => ({ ...p, checked: false })));
    setGoodsList(goodsList.map(g => ({ ...g, checked: false })));
    setAdditionalCharges([
      { id: 1, name: "DOCKET CHARGE", type: "Select", rate: "0.00", amount: "100.00", perc: "0" },
      { id: 2, name: "DOOR DELIVERY", type: "Select", rate: "0.00", amount: "0.00", perc: "0" },
      { id: 3, name: "GREEN TAX CHARGE", type: "Select", rate: "0.00", amount: "0.00", perc: "0" },
      { id: 4, name: "HAMALI CHARGE", type: "Select", rate: "0.00", amount: "0.00", perc: "0" },
      { id: 5, name: "OTHER CHARGES", type: "Select", rate: "0.00", amount: "0.00", perc: "0" },
      { id: 6, name: "PF CHARGE", type: "Select", rate: "0.00", amount: "0.00", perc: "0" },
    ]);
  };

  const handleSave = () => {
    const newRecord: AgencyCommissionRecord = {
      id: editId || Date.now(),
      agencyName,
      wefDate,
      validUpto,
      selectedProduct,
      selectedGoods,
      commissionCategory,
      commissionRows: rows,
      additionalCharges,
      createdAt: new Date(),
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

  const handleSearch = () => {
    let results = [...savedRecords];
    
    if (searchBranch) {
      results = results.filter(r => r.agencyName.toLowerCase().includes(searchBranch.toLowerCase()));
    }
    
    if (searchFromDate) {
      results = results.filter(r => r.wefDate >= searchFromDate);
    }
    
    if (searchToDate) {
      results = results.filter(r => r.validUpto && r.validUpto <= searchToDate);
    }
    
    setSearchResults(results);
  };

  const handleEdit = (record: AgencyCommissionRecord) => {
    setEditId(record.id);
    setAgencyName(record.agencyName);
    setWefDate(record.wefDate);
    setValidUpto(record.validUpto);
    setSelectedProduct(record.selectedProduct);
    setSelectedGoods(record.selectedGoods);
    setCommissionCategory(record.commissionCategory);
    setRows(record.commissionRows);
    setAdditionalCharges(record.additionalCharges);
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
    setSearchBranch("");
    setSearchFromDate(undefined);
    setSearchToDate(undefined);
    setSearchResults([]);
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">AGENCY COMMISSION MASTER</h1>
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

      {/* Search Tab Content */}
      {activeTab === "search" && (
        <div className="space-y-4">
          {/* Search Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 border rounded-md bg-muted/20">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Branch Name</Label>
              <Input
                placeholder="Search by branch..."
                value={searchBranch}
                onChange={(e) => setSearchBranch(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-full justify-start text-left text-xs font-normal">
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {searchFromDate ? format(searchFromDate, "dd-MM-yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={searchFromDate} onSelect={setSearchFromDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-full justify-start text-left text-xs font-normal">
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {searchToDate ? format(searchToDate, "dd-MM-yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={searchToDate} onSelect={setSearchToDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} size="sm" className="h-8 text-xs">
                <Search className="mr-1 h-3.5 w-3.5" />
                SEARCH
              </Button>
              <Button onClick={clearSearch} variant="outline" size="sm" className="h-8 text-xs">
                <RefreshCw className="mr-1 h-3.5 w-3.5" />
                CLEAR
              </Button>
            </div>
          </div>

          {/* Search Results Table */}
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[800px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold py-2 px-2 w-12">S#</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[200px]">Branch Name</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[100px]">From Date</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[100px]">To Date</TableHead>
                    <TableHead className="font-semibold py-2 px-2 w-24 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No records found. Click SEARCH to display results.
                      </TableCell>
                    </TableRow>
                  ) : (
                    searchResults.map((record, index) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell className="py-2 px-2 text-center">{index + 1}</TableCell>
                        <TableCell className="py-2 px-2 font-medium">{record.agencyName}</TableCell>
                        <TableCell className="py-2 px-2">{format(record.wefDate, "dd-MM-yyyy")}</TableCell>
                        <TableCell className="py-2 px-2">
                          {record.validUpto ? format(record.validUpto, "dd-MM-yyyy") : "-"}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(record)}
                              className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(record.id)}
                              className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
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
        </div>
      )}

      {/* Entry Tab Content - Form */}
      {activeTab === "entry" && (
        <div className="space-y-4">
          {/* Form Fields - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Agency Name */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">
                Agency Name <span className="text-red-500">*</span>
              </Label>
              <Select value={agencyName} onValueChange={setAgencyName}>
                <SelectTrigger className="h-7 md:h-8 text-xs">
                  <SelectValue placeholder="SELECT AGENCY" />
                </SelectTrigger>
                <SelectContent>
                  {agencies.map((agency) => (
                    <SelectItem key={agency} value={agency} className="text-xs">
                      {agency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* W.E.F */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">W.E.F</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 md:h-8 w-full justify-start text-left text-xs font-normal">
                    <CalendarIcon className="mr-2 h-3 w-3 md:h-3.5 md:w-3.5" />
                    {wefDate ? format(wefDate, "dd-MM-yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={wefDate} onSelect={(date) => date && setWefDate(date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Valid Upto */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Valid Upto</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 md:h-8 w-full justify-start text-left text-xs font-normal">
                    <CalendarIcon className="mr-2 h-3 w-3 md:h-3.5 md:w-3.5" />
                    {validUpto ? format(validUpto, "dd-MM-yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={validUpto} onSelect={setValidUpto} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Select Product with + Button */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">SELECT PRODUCT</Label>
              <div className="flex gap-2">
                <Input
                  value={selectedProduct}
                  readOnly
                  placeholder="Select Product"
                  className="h-7 md:h-8 text-xs flex-1 cursor-pointer bg-background"
                  onClick={() => setIsProductDialogOpen(true)}
                />
                <Button variant="outline" size="sm" className="h-7 md:h-8 w-7 md:w-8 p-0" onClick={() => setIsProductDialogOpen(true)}>
                  <Plus className="h-3 w-3 md:h-3.5 md:w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Select Goods and Commission Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">SELECT GOODS</Label>
              <div className="flex gap-2">
                <Input
                  value={selectedGoods.length > 0 ? `${selectedGoods.length} items selected` : ""}
                  readOnly
                  placeholder="Select Goods"
                  className="h-7 md:h-8 text-xs flex-1 cursor-pointer bg-background"
                  onClick={() => setIsGoodsDialogOpen(true)}
                />
                <Button variant="outline" size="sm" className="h-7 md:h-8 w-7 md:w-8 p-0" onClick={() => setIsGoodsDialogOpen(true)}>
                  <Plus className="h-3 w-3 md:h-3.5 md:w-3.5" />
                </Button>
              </div>
              {selectedGoods.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1 max-h-16 overflow-y-auto">
                  {selectedGoods.slice(0, 3).map((goods) => (
                    <span key={goods} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] md:text-xs">
                      {goods.length > 20 ? goods.substring(0, 20) + "..." : goods}
                      <X className="h-2 w-2 cursor-pointer hover:text-red-500" onClick={() => setSelectedGoods(selectedGoods.filter(g => g !== goods))} />
                    </span>
                  ))}
                  {selectedGoods.length > 3 && <span className="text-[10px] text-muted-foreground">+{selectedGoods.length - 3} more</span>}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Commission Category <span className="text-red-500">*</span></Label>
              <div className="flex gap-2">
                <Select value={commissionCategory} onValueChange={setCommissionCategory}>
                  <SelectTrigger className="h-7 md:h-8 flex-1 text-xs">
                    <SelectValue placeholder="SELECT CATEGORY" />
                  </SelectTrigger>
                  <SelectContent>
                    {commissionCategories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-xs">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="h-7 md:h-8 px-2 md:px-3 text-xs">
                  <Plus className="mr-1 h-3 w-3" />
                  <span className="hidden sm:inline">ADD</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Commission Table */}
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1200px]">
              <Table className="text-[10px] md:text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold py-2 px-2 text-center w-12">S.No</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[100px]">Product</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[100px]">Goods</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[80px]">Category</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[80px]">Applicable</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[80px]">Applicable On</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[70px]">From Slab</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[70px]">To Slab</TableHead>
                    <TableHead colSpan={2} className="font-semibold py-2 px-2 text-center border-x min-w-[100px]">Cash</TableHead>
                    <TableHead colSpan={2} className="font-semibold py-2 px-2 text-center border-x min-w-[100px]">Credit</TableHead>
                    <TableHead colSpan={2} className="font-semibold py-2 px-2 text-center border-x min-w-[100px]">To Pay</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[80px]">Include Add</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[80px]">Exclude Add</TableHead>
                    <TableHead className="font-semibold py-2 px-2 w-12">Action</TableHead>
                  </TableRow>
                  <TableRow className="bg-muted/30">
                    <TableHead className="py-1 px-2"></TableHead><TableHead></TableHead><TableHead></TableHead><TableHead></TableHead>
                    <TableHead></TableHead><TableHead></TableHead><TableHead></TableHead><TableHead></TableHead>
                    <TableHead className="py-1 px-2">Rate</TableHead><TableHead className="py-1 px-2">Min</TableHead>
                    <TableHead className="py-1 px-2">Rate</TableHead><TableHead className="py-1 px-2">Min</TableHead>
                    <TableHead className="py-1 px-2">Rate</TableHead><TableHead className="py-1 px-2">Min</TableHead>
                    <TableHead></TableHead><TableHead></TableHead><TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow><TableCell colSpan={17} className="text-center py-8 text-muted-foreground">No data available. Click ADD ROW to add commission rates.</TableCell></TableRow>
                  ) : (
                    rows.map((row, index) => (
                      <TableRow key={row.id} className="hover:bg-muted/30">
                        <TableCell className="py-1.5 px-2 text-center">{index + 1}</TableCell>
                        <TableCell className="py-1.5 px-2"><Input value={row.product} onChange={(e) => updateRow(row.id, "product", e.target.value)} className="h-7 w-full min-w-[80px] text-[10px] md:text-xs" /></TableCell>
                        <TableCell className="py-1.5 px-2"><Input value={row.goods} onChange={(e) => updateRow(row.id, "goods", e.target.value)} className="h-7 w-full min-w-[80px] text-[10px] md:text-xs" /></TableCell>
                        <TableCell className="py-1.5 px-2"><Input value={row.category} onChange={(e) => updateRow(row.id, "category", e.target.value)} className="h-7 w-full min-w-[70px] text-[10px] md:text-xs" /></TableCell>
                        <TableCell className="py-1.5 px-2"><Input value={row.applicable} onChange={(e) => updateRow(row.id, "applicable", e.target.value)} className="h-7 w-full min-w-[70px] text-[10px] md:text-xs" /></TableCell>
                        <TableCell className="py-1.5 px-2"><Input value={row.applicableOn} onChange={(e) => updateRow(row.id, "applicableOn", e.target.value)} className="h-7 w-full min-w-[70px] text-[10px] md:text-xs" /></TableCell>
                        <TableCell className="py-1.5 px-2"><Input value={row.fromSlab} onChange={(e) => updateRow(row.id, "fromSlab", e.target.value)} className="h-7 w-full min-w-[60px] text-[10px] md:text-xs" /></TableCell>
                        <TableCell className="py-1.5 px-2"><Input value={row.toSlab} onChange={(e) => updateRow(row.id, "toSlab", e.target.value)} className="h-7 w-full min-w-[60px] text-[10px] md:text-xs" /></TableCell>
                        <TableCell className="py-1.5 px-2"><Input value={row.cashRate} onChange={(e) => updateRow(row.id, "cashRate", e.target.value)} className="h-7 w-full min-w-[60px] text-[10px] md:text-xs" /></TableCell>
                        <TableCell className="py-1.5 px-2"><Input value={row.cashMinimum} onChange={(e) => updateRow(row.id, "cashMinimum", e.target.value)} className="h-7 w-full min-w-[60px] text-[10px] md:text-xs" /></TableCell>
                        <TableCell className="py-1.5 px-2"><Input value={row.creditRate} onChange={(e) => updateRow(row.id, "creditRate", e.target.value)} className="h-7 w-full min-w-[60px] text-[10px] md:text-xs" /></TableCell>
                        <TableCell className="py-1.5 px-2"><Input value={row.creditMinimum} onChange={(e) => updateRow(row.id, "creditMinimum", e.target.value)} className="h-7 w-full min-w-[60px] text-[10px] md:text-xs" /></TableCell>
                        <TableCell className="py-1.5 px-2"><Input value={row.toPayRate} onChange={(e) => updateRow(row.id, "toPayRate", e.target.value)} className="h-7 w-full min-w-[60px] text-[10px] md:text-xs" /></TableCell>
                        <TableCell className="py-1.5 px-2"><Input value={row.toPayMinimum} onChange={(e) => updateRow(row.id, "toPayMinimum", e.target.value)} className="h-7 w-full min-w-[60px] text-[10px] md:text-xs" /></TableCell>
                        <TableCell className="py-1.5 px-2 text-center"><input type="checkbox" checked={row.includeAdditional} onChange={(e) => updateRow(row.id, "includeAdditional", e.target.checked)} className="h-3 w-3" /></TableCell>
                        <TableCell className="py-1.5 px-2 text-center"><input type="checkbox" checked={row.excludeAdditional} onChange={(e) => updateRow(row.id, "excludeAdditional", e.target.checked)} className="h-3 w-3" /></TableCell>
                        <TableCell className="py-1.5 px-2"><Button variant="ghost" size="sm" onClick={() => removeRow(row.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-end"><Button onClick={addRow} variant="outline" size="sm" className="h-7 md:h-8 text-xs"><Plus className="mr-1 h-3 w-3" />ADD ROW</Button></div>

          {/* Additional Charges Section */}
          <div className="rounded-md border">
            <div className="bg-muted/50 px-3 md:px-4 py-2 border-b"><h3 className="text-xs md:text-sm font-semibold">Additional Charges</h3></div>
            <div className="overflow-x-auto"><div className="min-w-[600px]">
              <Table className="text-[10px] md:text-xs">
                <TableHeader><TableRow className="bg-muted/30">
                  <TableHead className="font-semibold py-2 px-2 w-12">S.No</TableHead>
                  <TableHead className="font-semibold py-2 px-2 min-w-[120px]">Charge Name</TableHead>
                  <TableHead className="font-semibold py-2 px-2 min-w-[100px]">Type</TableHead>
                  <TableHead className="font-semibold py-2 px-2 min-w-[80px]">Rate (%)</TableHead>
                  <TableHead className="font-semibold py-2 px-2 min-w-[100px]">Amount (₹)</TableHead>
                  <TableHead className="font-semibold py-2 px-2 min-w-[80px]">Perc (%)</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {additionalCharges.map((charge) => (
                    <TableRow key={charge.id} className="hover:bg-muted/30">
                      <TableCell className="py-1.5 px-2">{charge.id}</TableCell>
                      <TableCell className="py-1.5 px-2 font-medium">{charge.name}</TableCell>
                      <TableCell className="py-1.5 px-2">
                        <Select value={charge.type} onValueChange={(value) => updateAdditionalCharge(charge.id, "type", value)}>
                          <SelectTrigger className="h-7 w-full min-w-[80px] text-[10px] md:text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>{chargeTypes.map((type) => (<SelectItem key={type} value={type} className="text-xs">{type}</SelectItem>))}</SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="py-1.5 px-2"><Input type="number" value={charge.rate} onChange={(e) => updateAdditionalCharge(charge.id, "rate", e.target.value)} className="h-7 w-full min-w-[60px] text-[10px] md:text-xs" step="0.01" /></TableCell>
                      <TableCell className="py-1.5 px-2"><Input type="number" value={charge.amount} onChange={(e) => updateAdditionalCharge(charge.id, "amount", e.target.value)} className="h-7 w-full min-w-[80px] text-[10px] md:text-xs" step="0.01" /></TableCell>
                      <TableCell className="py-1.5 px-2"><Input type="number" value={charge.perc} onChange={(e) => updateAdditionalCharge(charge.id, "perc", e.target.value)} className="h-7 w-full min-w-[60px] text-[10px] md:text-xs" step="0.01" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div></div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={handleSave} size="sm" className="h-7 md:h-8 text-xs"><Save className="mr-1 h-3 w-3" />{editId ? "UPDATE" : "SAVE"}</Button>
            <Button onClick={resetForm} variant="outline" size="sm" className="h-7 md:h-8 text-xs"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
          </div>
        </div>
      )}

      {/* Product List Modal */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-[90vw] md:max-w-2xl max-h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-4 pt-4 pb-2 border-b"><DialogTitle className="text-base md:text-lg">Select Product</DialogTitle></DialogHeader>
          <div className="flex-1 overflow-hidden flex flex-col px-4">
            <div className="flex items-center gap-2 py-3">
              <div className="relative flex-1"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search product..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="pl-8 h-8 text-xs" /></div>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={refreshProductList}><RefreshCw className="h-3.5 w-3.5" /></Button>
            </div>
            <div className="border rounded-md flex-1 overflow-auto max-h-[50vh]">
              <Table><TableHeader className="sticky top-0 bg-background"><TableRow className="bg-muted/50"><TableHead className="w-12 text-center"><input type="checkbox" checked={selectAllProduct} onChange={handleSelectAllProducts} className="h-3.5 w-3.5" /></TableHead><TableHead className="text-xs font-semibold">Name</TableHead></TableRow></TableHeader>
              <TableBody>{filteredProducts.map((product) => (<TableRow key={product.id} className="hover:bg-muted/30 cursor-pointer"><TableCell className="text-center"><input type="checkbox" checked={product.checked} onChange={() => handleProductCheck(product.id)} className="h-3.5 w-3.5" /></TableCell><TableCell className="text-xs cursor-pointer" onClick={() => handleProductCheck(product.id)}>{product.name}</TableCell></TableRow>))}
              {filteredProducts.length === 0 && (<TableRow><TableCell colSpan={2} className="text-center text-xs py-8">No products found</TableCell></TableRow>)}</TableBody></Table>
            </div>
          </div>
          <DialogFooter className="px-4 py-3 border-t gap-2 mt-2"><Button variant="outline" size="sm" onClick={() => setIsProductDialogOpen(false)}>CLOSE</Button><Button size="sm" onClick={handleProductConfirm}>OK</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Goods List Modal */}
      <Dialog open={isGoodsDialogOpen} onOpenChange={setIsGoodsDialogOpen}>
        <DialogContent className="max-w-[90vw] md:max-w-2xl max-h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-4 pt-4 pb-2 border-b"><DialogTitle className="text-base md:text-lg">Select Goods</DialogTitle></DialogHeader>
          <div className="flex-1 overflow-hidden flex flex-col px-4">
            <div className="flex items-center gap-2 py-3">
              <div className="relative flex-1"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><Input placeholder="Search goods..." value={goodsSearch} onChange={(e) => setGoodsSearch(e.target.value)} className="pl-8 h-8 text-xs" /></div>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={refreshGoodsList}><RefreshCw className="h-3.5 w-3.5" /></Button>
            </div>
            <div className="border rounded-md flex-1 overflow-auto max-h-[50vh]">
              <Table><TableHeader className="sticky top-0 bg-background"><TableRow className="bg-muted/50"><TableHead className="w-12 text-center"><input type="checkbox" checked={selectAllGoods} onChange={handleSelectAllGoods} className="h-3.5 w-3.5" /></TableHead><TableHead className="text-xs font-semibold">Name</TableHead></TableRow></TableHeader>
              <TableBody>{filteredGoods.map((goods) => (<TableRow key={goods.id} className="hover:bg-muted/30 cursor-pointer"><TableCell className="text-center"><input type="checkbox" checked={goods.checked} onChange={() => handleGoodsCheck(goods.id)} className="h-3.5 w-3.5" /></TableCell><TableCell className="text-xs cursor-pointer" onClick={() => handleGoodsCheck(goods.id)}>{goods.name}</TableCell></TableRow>))}
              {filteredGoods.length === 0 && (<TableRow><TableCell colSpan={2} className="text-center text-xs py-8">No goods found</TableCell></TableRow>)}</TableBody></Table>
            </div>
          </div>
          <DialogFooter className="px-4 py-3 border-t gap-2 mt-2"><Button variant="outline" size="sm" onClick={() => setIsGoodsDialogOpen(false)}>CLOSE</Button><Button size="sm" onClick={handleGoodsConfirm}>OK</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}