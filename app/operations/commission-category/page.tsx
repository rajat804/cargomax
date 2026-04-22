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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, Plus, Trash2, X, Save, RefreshCw, Search, Edit, Eye, Copy, Printer, Upload, Download, Pencil, Users, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommissionCategory {
  id: number;
  categoryId: string;
  commissionType: string;
  categoryName: string;
  applicableOn: string;
  fromRange: string;
  toRange: string;
  itemName: string;
  tdsApplicable: boolean;
  tdsItemName: string;
  tdsPercentage: string;
  active: boolean;
  applicableOnFTL: string;
}

interface Agent {
  id: number;
  name: string;
  selected: boolean;
}

// Sample branch/agent list
const branchList = [
  "AGARTALA", "AGRA", "AHMEDABAD CITY", "AKBERPUR/AMBEDKAR NAGAR", "ALIGARH (MUKESH SINGH)",
  "ALIGARH (RAVI)", "ALIPURDUAR", "ALLAHABAD", "ALZALGARH", "AMRITSAR", "ANOOPSHER",
  "ARARIA COURT", "ARRAH", "ASANSOL", "AURANGABAD B.R", "AURANGABAD U.P", "AZAMGARH",
  "BABRALA", "BADDI", "BAHERI", "BAHJOI", "BAKROL", "BALLIA", "BANKURA", "BARAUT",
  "BAREILLY", "BARHALGANJ", "BARHI", "BARPETA ROAD", "BARWALA", "BASTI", "BAWANA",
  "BEGUSARAI", "BELTHARA ROAD", "BERHAMPORE W.B", "BETTIAH", "BHABHUA", "BHADOHI",
  "BHAGALPUR", "BHAVNAGAR", "BHIWANI", "BHULANDSHAHAR", "BIHARIGANJ", "BIHARSHARIF",
  "BIHIYA", "BIHTA", "BIJNOR", "BILASIPARA", "BONGAIGOAN", "BRAHMAPUR", "BURDWAN",
  "BUXAR", "CHANCHAL", "CHANDAUSI", "CHANDIGARH (GANESH)", "CHANDIGARH (HARGUN)",
  "CHANDPUR", "CHAS", "CHHAPRA", "COOCHBEHAR", "DALKOLA", "DALTONGANJ", "DARBHANGA",
  "DAUDNAGAR", "DAYA BASTI", "DEHRI ON SON", "DEOGHAR", "DEORIA", "DHAMPUR", "DHANAURA",
  "DHANBAD", "DHORA JI", "DHUBRI", "DHUPGURI", "DIBAI", "DINHATA", "DUMKA", "DUMROAN",
  "DURGAPUR", "FAIZABAD", "FALAKATA", "FARIDABAD", "FORBISGANJ", "GANDHI NAGAR (AJAY ANAND)",
  "GANDHI NAGAR (ASHOK)", "GANDHI NAGAR GRL", "GANGARAMPUR", "GARWA", "GAYA", "GHAZIPUR",
  "GHOSI", "GIRIDIH", "GOALPARA", "GODDA", "GOPALGANJ", "GORAKHPUR", "GOSAINGANJ",
  "GULABBAGH", "GULAOTHI", "GUMLA", "HAJIPUR", "HALOL", "HARRAIYA", "HATA", "HATHRAS",
  "HAZARIBAGH", "ISLAMPUR", "JAGADARI", "JAHANGIRABAD", "JAINAGAR", "JALALPUR", "JALANDAR",
  "JALPAIGURI", "JAMNA BAZAR", "JAMSHEDPUR", "JAMUI", "JAUNPUR", "JETPUR", "JHANJHARPUR",
  "JHARIYA", "JHILMIL", "JHUMRITALIYA", "KALA AMB", "KALIACHAK", "KALIYAGANJ",
  "KAMLA MARKET (RAMAN RAI)", "KAMLA MARKET (RAVINDER PANDEY)", "KANPUR", "KAPTANGANJ",
  "KARNAL", "KAROL BAGH (NITISH)", "KAROL BAGH (S.K.OBERI)", "KASHMERE GATE (RAM GOPAL)",
  "KASHMERE GATE (VIVEK)", "KASIA", "KATIHAR", "KHAGARIA", "KHALILABAD", "KHANNA MARKET GRL",
  "KIRATPUR", "KISHANGANJ", "KOCHAS", "KOKRAJHAR", "KRISHNAI", "KUNDA", "KUSHINAGAR",
  "LAKHISARAI", "LALGANJ", "LIBASPUR", "LOHARDGA", "LUCKNOW", "LUDHIANA", "LUDHIANA (BOBBY)",
  "LUDHIANA (GOSALA)", "LUDHIANA CITY", "LUDHIANA GILL ROAD", "MACHHALISHAR", "MADHEPURA",
  "MADHUBANI", "MADHUPUR", "MAHARAJGANJ", "MAIRWA", "MALDA", "MALERKOTLA", "MANGOLPURI",
  "MATHABHANGA", "MAU", "MAYAPURI", "MAYNAGURI", "MEERUT", "MIRZAPUR", "MOHALI",
  "MOHAMMDABAD GOHNA", "MOHANIYA", "MORADABAD", "MORI GATE GRL", "MOTIHARI", "MUBARAKPUR",
  "MUGHALSARAI", "MUNGRA BADSHAHPUR", "MURAD NAGAR", "MURLIGANJ", "MURSHIDABAD",
  "MUZAFFARNAGAR", "MUZAFFARPUR", "NAGINA", "NALBARI", "NARELA", "NARKATIYA GANJ", "NAROL",
  "NAWABGANJ", "NAWADA", "NETHAUR", "NEW LAJPAT RAI MARKET", "NOIDA", "NOJIBABAD", "NOORPUR",
  "PADRAUNA", "PANCHKULA", "PANIPAT", "PARWANOO", "PATNA", "PHAGWARA", "PHUSRO", "PILIBHIT",
  "PRATAPGARH", "PURANPUR", "PURNIA", "PURULIA", "RAFIGANJ", "RAGHUNATHGANJ", "RAIGANJ",
  "RAJKOT (METODA)", "RAJKOT (SHAPAR)", "RAJKOT - A", "RAMGARH", "RANCHI", "RANGIA",
  "RANIGANJ", "RASARA", "RAXAUL", "SADAR BAZAR", "SAHARANPUR", "SAHARSA", "SAHASWAN",
  "SALEMPUR", "SAMASTIPUR", "SAMBAL", "SAMSI", "SANJAY GANDHI GRL", "SANJAY GANDHI TPT",
  "SASARAM", "SECUNDERABAD", "SEOHARA", "SHAHDARA", "SHAHGANJ", "SHERGHATI", "SHIKARPUR",
  "SIDDHARTHNAGAR", "SILLIGURI", "SIMDEGA", "SISWABAZAR", "SITAMARHI", "SIWAN", "SIYANA",
  "SOLAN", "SULTANPUR", "SUPAUL", "SURAT", "TAMKUHI", "TANDA", "THAKURDWARA", "TRONICA CITY",
  "TUFANGANJ", "VAPI", "VARANASI", "VIKRAMGANJ", "WAZIRPUR", "YUSUFPUR", "ZAKHIRA", "ZIRAKPUR"
];

const applicableOnOptions = [
  "as per actuals",
  "aweight",
  "cweight",
  "docket",
  "fix value",
  "freight",
  "packages",
  "total freight",
  "value of gr"
];

export default function CommissionCategoryMaster() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"search" | "entry">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  
  // Form state
  const [categoryId, setCategoryId] = useState<string>("0");
  const [commissionType, setCommissionType] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const [applicableOn, setApplicableOn] = useState<string>("");
  const [fromRange, setFromRange] = useState<string>("0");
  const [toRange, setToRange] = useState<string>("0");
  const [itemName, setItemName] = useState<string>("");
  const [tdsApplicable, setTdsApplicable] = useState<boolean>(false);
  const [tdsItemName, setTdsItemName] = useState<string>("");
  const [tdsPercentage, setTdsPercentage] = useState<string>("0");
  const [active, setActive] = useState<boolean>(true);
  const [applicableOnFTL, setApplicableOnFTL] = useState<string>("");

  // Search state
  const [searchResults, setSearchResults] = useState<CommissionCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Allocate to Agent modal state
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [selectedCategoryForAllocate, setSelectedCategoryForAllocate] = useState<CommissionCategory | null>(null);
  const [isAgentSelectionModalOpen, setIsAgentSelectionModalOpen] = useState(false);
  const [agentSearchTerm, setAgentSearchTerm] = useState("");
  const [selectAllAgents, setSelectAllAgents] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([]);
  const [allocatedAgents, setAllocatedAgents] = useState<Agent[]>([]);

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<CommissionCategory[]>([
    {
      id: 1,
      categoryId: "1",
      commissionType: "Booking",
      categoryName: "AGENCEY COMMISSION",
      applicableOn: "cweight",
      fromRange: "1",
      toRange: "999999999",
      itemName: "Commission",
      tdsApplicable: false,
      tdsItemName: "",
      tdsPercentage: "0",
      active: true,
      applicableOnFTL: ""
    },
    {
      id: 2,
      categoryId: "2",
      commissionType: "Booking",
      categoryName: "CLAIM LOCAL DESTINATION",
      applicableOn: "as per actuals",
      fromRange: "0",
      toRange: "0",
      itemName: "Claim",
      tdsApplicable: false,
      tdsItemName: "",
      tdsPercentage: "0",
      active: true,
      applicableOnFTL: ""
    },
    {
      id: 3,
      categoryId: "3",
      commissionType: "Booking",
      categoryName: "CLAIM ON SHORT",
      applicableOn: "as per actuals",
      fromRange: "0",
      toRange: "0",
      itemName: "Claim",
      tdsApplicable: false,
      tdsItemName: "",
      tdsPercentage: "0",
      active: true,
      applicableOnFTL: ""
    },
    {
      id: 4,
      categoryId: "4",
      commissionType: "Booking",
      categoryName: "GREEN TAX COMMISSION",
      applicableOn: "fix value",
      fromRange: "1",
      toRange: "99999999",
      itemName: "Tax",
      tdsApplicable: false,
      tdsItemName: "",
      tdsPercentage: "0",
      active: true,
      applicableOnFTL: ""
    },
    {
      id: 5,
      categoryId: "5",
      commissionType: "Booking",
      categoryName: "LABOUR COMMISSION",
      applicableOn: "cweight",
      fromRange: "1",
      toRange: "999999999",
      itemName: "Labour",
      tdsApplicable: false,
      tdsItemName: "",
      tdsPercentage: "0",
      active: true,
      applicableOnFTL: ""
    },
    {
      id: 6,
      categoryId: "6",
      commissionType: "Booking",
      categoryName: "LESS PAID, ADVANCE COMMISSION",
      applicableOn: "fix value",
      fromRange: "0",
      toRange: "0",
      itemName: "Advance",
      tdsApplicable: false,
      tdsItemName: "",
      tdsPercentage: "0",
      active: true,
      applicableOnFTL: ""
    },
    {
      id: 7,
      categoryId: "7",
      commissionType: "Booking",
      categoryName: "LOCAL CARTAGE-HIMALI-P.F COMMISSION",
      applicableOn: "cweight",
      fromRange: "0",
      toRange: "0",
      itemName: "Local",
      tdsApplicable: false,
      tdsItemName: "",
      tdsPercentage: "0",
      active: true,
      applicableOnFTL: ""
    },
    {
      id: 8,
      categoryId: "8",
      commissionType: "Booking",
      categoryName: "LORRY FREIGHT COMMISSION",
      applicableOn: "cweight",
      fromRange: "1",
      toRange: "999999999",
      itemName: "Freight",
      tdsApplicable: false,
      tdsItemName: "",
      tdsPercentage: "0",
      active: true,
      applicableOnFTL: ""
    },
    {
      id: 9,
      categoryId: "9",
      commissionType: "Booking",
      categoryName: "OTHER EXPENSES COMMISSION",
      applicableOn: "fix value",
      fromRange: "0",
      toRange: "0",
      itemName: "Expenses",
      tdsApplicable: false,
      tdsItemName: "",
      tdsPercentage: "0",
      active: true,
      applicableOnFTL: ""
    },
  ]);

  // Reset form
  const resetForm = () => {
    setCategoryId("0");
    setCommissionType("");
    setCategoryName("");
    setApplicableOn("");
    setFromRange("0");
    setToRange("0");
    setItemName("");
    setTdsApplicable(false);
    setTdsItemName("");
    setTdsPercentage("0");
    setActive(true);
    setApplicableOnFTL("");
    setEditId(null);
  };

  const handleSave = () => {
    const newRecord: CommissionCategory = {
      id: editId || Date.now(),
      categoryId: categoryId,
      commissionType: commissionType,
      categoryName: categoryName,
      applicableOn: applicableOn,
      fromRange: fromRange,
      toRange: toRange,
      itemName: itemName,
      tdsApplicable: tdsApplicable,
      tdsItemName: tdsItemName,
      tdsPercentage: tdsPercentage,
      active: active,
      applicableOnFTL: applicableOnFTL,
    };

    if (editId) {
      setSavedRecords(savedRecords.map(record => record.id === editId ? newRecord : record));
      alert("Record updated successfully!");
    } else {
      setSavedRecords([...savedRecords, { ...newRecord, id: savedRecords.length + 1, categoryId: String(savedRecords.length + 1) }]);
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
        r.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.commissionType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleEdit = (record: CommissionCategory) => {
    setEditId(record.id);
    setCategoryId(record.categoryId);
    setCommissionType(record.commissionType);
    setCategoryName(record.categoryName);
    setApplicableOn(record.applicableOn);
    setFromRange(record.fromRange);
    setToRange(record.toRange);
    setItemName(record.itemName);
    setTdsApplicable(record.tdsApplicable);
    setTdsItemName(record.tdsItemName);
    setTdsPercentage(record.tdsPercentage);
    setActive(record.active);
    setApplicableOnFTL(record.applicableOnFTL || "");
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

  // Allocate to Agent functions
  const handleAllocateToAgent = (record: CommissionCategory) => {
    setSelectedCategoryForAllocate(record);
    setAllocatedAgents([]);
    setIsAllocateModalOpen(true);
  };

  const handleSelectAgency = () => {
    // Initialize agents list from branchList
    const agentsList: Agent[] = branchList.map((name, index) => ({
      id: index + 1,
      name: name,
      selected: false
    }));
    setSelectedAgents(agentsList);
    setAgentSearchTerm("");
    setSelectAllAgents(false);
    setIsAgentSelectionModalOpen(true);
  };

  const handleAgentSelectionConfirm = () => {
    const newAllocatedAgents = selectedAgents.filter(agent => agent.selected);
    setAllocatedAgents(newAllocatedAgents);
    setIsAgentSelectionModalOpen(false);
  };

  const handleRemoveAllocatedAgent = (agentId: number) => {
    setAllocatedAgents(allocatedAgents.filter(agent => agent.id !== agentId));
  };

  const handleSelectAllAgents = () => {
    const newSelectAll = !selectAllAgents;
    setSelectAllAgents(newSelectAll);
    setSelectedAgents(selectedAgents.map(agent => ({ ...agent, selected: newSelectAll })));
  };

  const handleAgentCheck = (id: number) => {
    setSelectedAgents(selectedAgents.map(agent => 
      agent.id === id ? { ...agent, selected: !agent.selected } : agent
    ));
  };

  const filteredAgents = selectedAgents.filter(agent =>
    agent.name.toLowerCase().includes(agentSearchTerm.toLowerCase())
  );

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
        <h1 className="text-base md:text-lg font-bold">COMMISSION CATEGORY MASTER</h1>
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
                placeholder="Search by Commission Type or Category Name..."
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
            <div className="min-w-[800px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold py-2 px-2 w-12">S#</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[100px]">Commission Type</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[150px]">Category Name</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[100px]">Applicable On</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[80px]">From Range</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[80px]">To Range</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[100px] text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No records found. Click SEARCH to display results or add new entry.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, index) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell className="py-2 px-2 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="py-2 px-2">{record.commissionType}</TableCell>
                        <TableCell className="py-2 px-2 font-medium">{record.categoryName}</TableCell>
                        <TableCell className="py-2 px-2">{record.applicableOn}</TableCell>
                        <TableCell className="py-2 px-2">{record.fromRange}</TableCell>
                        <TableCell className="py-2 px-2">{record.toRange}</TableCell>
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
                              onClick={() => handleAllocateToAgent(record)}
                              className="h-7 w-7 p-0 text-green-500 hover:text-green-700"
                              title="Allocate to Agent"
                            >
                              <Users className="h-3.5 w-3.5" />
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
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, searchResults.length)} of {searchResults.length} entries
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
            {/* Category Id */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Category Id</Label>
              <Input
                type="text"
                value={categoryId}
                readOnly
                className="h-7 md:h-8 text-xs bg-muted"
              />
            </div>

            {/* Commission Type */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">
                Commission Type <span className="text-red-500">*</span>
              </Label>
              <Select value={commissionType} onValueChange={setCommissionType}>
                <SelectTrigger className="h-7 md:h-8 text-xs">
                  <SelectValue placeholder="SELECT TYPE" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Booking" className="text-xs">Booking</SelectItem>
                  <SelectItem value="Delivery" className="text-xs">Delivery</SelectItem>
                  <SelectItem value="Other" className="text-xs">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Name */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter Category Name"
                className="h-7 md:h-8 text-xs"
              />
            </div>

            {/* Applicable On */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">
                Applicable On <span className="text-red-500">*</span>
              </Label>
              <Select value={applicableOn} onValueChange={setApplicableOn}>
                <SelectTrigger className="h-7 md:h-8 text-xs">
                  <SelectValue placeholder="SELECT OPTION" />
                </SelectTrigger>
                <SelectContent>
                  {applicableOnOptions.map((option) => (
                    <SelectItem key={option} value={option} className="text-xs">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* From Range */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">From Range</Label>
              <Input
                type="number"
                value={fromRange}
                onChange={(e) => setFromRange(e.target.value)}
                className="h-7 md:h-8 text-xs"
              />
            </div>

            {/* To Range */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">To Range</Label>
              <Input
                type="number"
                value={toRange}
                onChange={(e) => setToRange(e.target.value)}
                className="h-7 md:h-8 text-xs"
              />
            </div>

            {/* Item Name */}
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">
                Item Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Enter Item Name"
                className="h-7 md:h-8 text-xs"
              />
            </div>

            {/* TDS Applicable Checkbox */}
            <div className="space-y-1 flex items-end">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={tdsApplicable}
                  onChange={(e) => setTdsApplicable(e.target.checked)}
                  className="h-3.5 w-3.5"
                />
                <Label className="text-[11px] md:text-xs font-medium cursor-pointer">
                  TDS Applicable
                </Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* TDS Item Name */}
            {tdsApplicable && (
              <div className="space-y-1">
                <Label className="text-[11px] md:text-xs font-medium">TDS Item Name</Label>
                <Input
                  value={tdsItemName}
                  onChange={(e) => setTdsItemName(e.target.value)}
                  placeholder="Enter TDS Item Name"
                  className="h-7 md:h-8 text-xs"
                />
              </div>
            )}

            {/* TDS Percentage */}
            {tdsApplicable && (
              <div className="space-y-1">
                <Label className="text-[11px] md:text-xs font-medium">TDS %</Label>
                <Input
                  type="number"
                  value={tdsPercentage}
                  onChange={(e) => setTdsPercentage(e.target.value)}
                  className="h-7 md:h-8 text-xs"
                />
              </div>
            )}

            {/* Active */}
            <div className="space-y-1 flex items-end">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-3.5 w-3.5"
                />
                <Label className="text-[11px] md:text-xs font-medium cursor-pointer">
                  Active
                </Label>
              </div>
            </div>
          </div>

          {/* Applicable On FTL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Applicable On FTL</Label>
              <Select value={applicableOnFTL} onValueChange={setApplicableOnFTL}>
                <SelectTrigger className="h-7 md:h-8 text-xs">
                  <SelectValue placeholder="SELECT OPTION" />
                </SelectTrigger>
                <SelectContent>
                  {applicableOnOptions.map((option) => (
                    <SelectItem key={option} value={option} className="text-xs">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
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

      {/* Allocate to Agent Modal */}
      <Dialog open={isAllocateModalOpen} onOpenChange={setIsAllocateModalOpen}>
        <DialogContent className="max-w-[90vw] md:max-w-2xl max-h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-4 pt-4 pb-2 border-b">
            <DialogTitle className="text-base md:text-lg">Allocate to Agent</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col px-4 py-3">
            <div className="mb-4 p-3 bg-muted/30 rounded-md">
              <p className="text-sm font-medium">Category Name: <span className="font-bold">{selectedCategoryForAllocate?.categoryName}</span></p>
            </div>

            <div className="flex items-center justify-between mb-3">
              <Button onClick={handleSelectAgency} size="sm" className="h-8 text-xs">
                <Users className="mr-1 h-3.5 w-3.5" />
                SELECT AGENCY
              </Button>
            </div>

            {/* Allocated Agents List */}
            {allocatedAgents.length > 0 && (
              <div className="border rounded-md">
                <div className="bg-muted/50 px-3 py-2 border-b">
                  <h4 className="text-xs font-semibold">Allocated Agents ({allocatedAgents.length})</h4>
                </div>
                <div className="max-h-[300px] overflow-y-auto p-2">
                  <div className="flex flex-wrap gap-2">
                    {allocatedAgents.map((agent) => (
                      <span
                        key={agent.id}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs"
                      >
                        {agent.name}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-red-500"
                          onClick={() => handleRemoveAllocatedAgent(agent.id)}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {allocatedAgents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No agents allocated. Click "SELECT AGENCY" to add agents.
              </div>
            )}
          </div>

          <DialogFooter className="px-4 py-3 border-t gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsAllocateModalOpen(false)}>
              CLOSE
            </Button>
            <Button size="sm" onClick={() => setIsAllocateModalOpen(false)}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Agent Selection Modal */}
      <Dialog open={isAgentSelectionModalOpen} onOpenChange={setIsAgentSelectionModalOpen}>
        <DialogContent className="max-w-[90vw] md:max-w-2xl max-h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-4 pt-4 pb-2 border-b">
            <DialogTitle className="text-base md:text-lg">Select Agency</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col px-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2 py-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Enter search text..."
                  value={agentSearchTerm}
                  onChange={(e) => setAgentSearchTerm(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Search className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Table with Scroll */}
            <div className="border rounded-md flex-1 overflow-auto max-h-[50vh]">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectAllAgents}
                        onChange={handleSelectAllAgents}
                        className="h-3.5 w-3.5"
                      />
                    </TableHead>
                    <TableHead className="text-xs font-semibold">Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgents.map((agent) => (
                    <TableRow key={agent.id} className="hover:bg-muted/30 cursor-pointer">
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          checked={agent.selected}
                          onChange={() => handleAgentCheck(agent.id)}
                          className="h-3.5 w-3.5"
                        />
                      </TableCell>
                      <TableCell 
                        className="text-xs cursor-pointer"
                        onClick={() => handleAgentCheck(agent.id)}
                      >
                        {agent.name}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredAgents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-xs py-8 text-muted-foreground">
                        No agents found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter className="px-4 py-3 border-t gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsAgentSelectionModalOpen(false)}>
              CLOSE
            </Button>
            <Button size="sm" onClick={handleAgentSelectionConfirm}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}