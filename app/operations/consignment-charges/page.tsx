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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CalendarIcon, Plus, Trash2, X, Save, RefreshCw, Search, Edit, Pencil, Users, Package, Calendar } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ConsignmentCharge {
  id: number;
  chargeCode: string;
  active: boolean;
  chargeName: string;
  displayName: string;
  aliasName: string;
  chargeType: string;
  amountType: string;
  chargeAmount: string;
  minimumAmount: string;
  applicableOn: string;
  sacCode: string;
  bookingOnFreightLedger: boolean;
  printSequenceNo: string;
  ledger: string;
  chargeAmountOnBankBuilty: string;
  applicableOnBooking: boolean;
  applicableOnAirBooking: boolean;
  gstApplicable: boolean;
  applicableOnDelivery: boolean;
  applicableOnTrainBooking: boolean;
  allowAtBillUpdation: boolean;
  applicableOnMarketLoad: boolean;
  applicableOnSurfaceBooking: boolean;
  allowToUpdateFromAdditionalCharges: boolean;
}

interface GoodsWiseCharge {
  id: number;
  goodsGroup: string;
  rate: string;
  amount: string;
}

interface BranchSelection {
  id: number;
  name: string;
  selected: boolean;
}

// Sample branch list
const branchList = [
  "AGARTALA", "AGRA", "AHMEDABAD CITY", "AHMEDABAD-ASALAI (HUB)", "AKBERPUR/AMBEDKAR NAGAR",
  "ALIGARH (MUKESH SINGH)", "ALIGARH (RAVI)", "ALIPURDUAR", "ALLAHABAD", "ALZALGARH",
  "AMRITSAR", "ANOOPSHER", "ARARIA COURT", "ARRAH", "ASANSOL", "AURANGABAD B.R",
  "AURANGABAD U.P", "AZAMGARH", "BABRALA", "BADDI", "BAHERI", "BAHJOI", "BAKROL",
  "BALLIA", "BANKURA", "BARAUT", "BAREILLY", "BARHALGANJ", "BARHI", "BARPETA ROAD",
  "BARWALA", "BASTI", "BAWANA", "BEGUSARAI", "BELTHARA ROAD", "BERHAMPORE W.B",
  "BETTIAH", "BHABHUA", "BHADOHI", "BHAGALPUR", "BHAVNAGAR", "BHIWANI", "BHULANDSHAHAR",
  "BIHARIGANJ", "BIHARSHARIF", "BIHIYA", "BIHTA", "BIJNOR", "BILASIPARA", "BONGAIGOAN"
];

const applicableOnOptions = [
  "Docket", "Freight", "Weight", "Packages", "Value of GR", "Total Freight"
];

const ledgerOptions = [
  "Freight Ledger", "Other Income Ledger", "Expense Ledger"
];

const chargeTypeOptions = ["Amount", "Percentage", "Slab"];
const amountTypeOptions = ["Fixed", "Variable"];

export default function ConsignmentChargesMaster() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"search" | "entry">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  
  // Form state
  const [chargeCode, setChargeCode] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);
  const [chargeName, setChargeName] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [aliasName, setAliasName] = useState<string>("");
  const [chargeType, setChargeType] = useState<string>("");
  const [amountType, setAmountType] = useState<string>("");
  const [chargeAmount, setChargeAmount] = useState<string>("0");
  const [minimumAmount, setMinimumAmount] = useState<string>("0");
  const [applicableOn, setApplicableOn] = useState<string>("");
  const [sacCode, setSacCode] = useState<string>("");
  const [bookingOnFreightLedger, setBookingOnFreightLedger] = useState<boolean>(false);
  const [printSequenceNo, setPrintSequenceNo] = useState<string>("");
  const [ledger, setLedger] = useState<string>("");
  const [chargeAmountOnBankBuilty, setChargeAmountOnBankBuilty] = useState<string>("0");
  const [applicableOnBooking, setApplicableOnBooking] = useState<boolean>(false);
  const [applicableOnAirBooking, setApplicableOnAirBooking] = useState<boolean>(false);
  const [gstApplicable, setGstApplicable] = useState<boolean>(false);
  const [applicableOnDelivery, setApplicableOnDelivery] = useState<boolean>(false);
  const [applicableOnTrainBooking, setApplicableOnTrainBooking] = useState<boolean>(false);
  const [allowAtBillUpdation, setAllowAtBillUpdation] = useState<boolean>(false);
  const [applicableOnMarketLoad, setApplicableOnMarketLoad] = useState<boolean>(false);
  const [applicableOnSurfaceBooking, setApplicableOnSurfaceBooking] = useState<boolean>(false);
  const [allowToUpdateFromAdditionalCharges, setAllowToUpdateFromAdditionalCharges] = useState<boolean>(false);

  // Search state
  const [searchResults, setSearchResults] = useState<ConsignmentCharge[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Goods Wise Charges Modal state
  const [isGoodsWiseModalOpen, setIsGoodsWiseModalOpen] = useState(false);
  const [selectedChargeForGoods, setSelectedChargeForGoods] = useState<ConsignmentCharge | null>(null);
  const [goodsWiseActiveTab, setGoodsWiseActiveTab] = useState<"entry" | "search">("entry");
  const [goodsWiseCharges, setGoodsWiseCharges] = useState<GoodsWiseCharge[]>([]);
  const [editGoodsWiseId, setEditGoodsWiseId] = useState<number | null>(null);
  const [wefDate, setWefDate] = useState<Date>(new Date());
  const [uptoDate, setUptoDate] = useState<Date | undefined>();
  const [goodsGroup, setGoodsGroup] = useState<string>("");
  const [rate, setRate] = useState<string>("0");
  const [amount, setAmount] = useState<string>("0");

  // Add Branch Modal state
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [selectedChargeForBranch, setSelectedChargeForBranch] = useState<ConsignmentCharge | null>(null);
  const [branchSearchTerm, setBranchSearchTerm] = useState("");
  const [selectAllBranches, setSelectAllBranches] = useState(false);
  const [branches, setBranches] = useState<BranchSelection[]>([]);
  const [allocatedBranches, setAllocatedBranches] = useState<BranchSelection[]>([]);

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<ConsignmentCharge[]>([
    {
      id: 1, chargeCode: "A0005", active: true, chargeName: "OTHER CHARGES", displayName: "OTHER CHARGES",
      aliasName: "OTHER CHARGES", chargeType: "Amount", amountType: "Fixed", chargeAmount: "0", minimumAmount: "0",
      applicableOn: "Docket", sacCode: "996511", bookingOnFreightLedger: false, printSequenceNo: "", ledger: "Freight Ledger",
      chargeAmountOnBankBuilty: "0", applicableOnBooking: false, applicableOnAirBooking: false, gstApplicable: false,
      applicableOnDelivery: false, applicableOnTrainBooking: false, allowAtBillUpdation: false, applicableOnMarketLoad: false,
      applicableOnSurfaceBooking: false, allowToUpdateFromAdditionalCharges: false
    },
    {
      id: 2, chargeCode: "A0102", active: true, chargeName: "GREEN TAX CHARGE", displayName: "GREEN TAX CHARGE",
      aliasName: "GREEN TAX CHARGE", chargeType: "Amount", amountType: "Fixed", chargeAmount: "0", minimumAmount: "0",
      applicableOn: "Docket", sacCode: "996511", bookingOnFreightLedger: false, printSequenceNo: "", ledger: "Freight Ledger",
      chargeAmountOnBankBuilty: "0", applicableOnBooking: false, applicableOnAirBooking: false, gstApplicable: false,
      applicableOnDelivery: false, applicableOnTrainBooking: false, allowAtBillUpdation: false, applicableOnMarketLoad: false,
      applicableOnSurfaceBooking: false, allowToUpdateFromAdditionalCharges: false
    },
    {
      id: 3, chargeCode: "A0103", active: true, chargeName: "HAMALI CHARGE", displayName: "HAMALI CHARGE",
      aliasName: "", chargeType: "Amount", amountType: "Fixed", chargeAmount: "0", minimumAmount: "0",
      applicableOn: "Docket", sacCode: "996511", bookingOnFreightLedger: false, printSequenceNo: "", ledger: "Freight Ledger",
      chargeAmountOnBankBuilty: "0", applicableOnBooking: false, applicableOnAirBooking: false, gstApplicable: false,
      applicableOnDelivery: false, applicableOnTrainBooking: false, allowAtBillUpdation: false, applicableOnMarketLoad: false,
      applicableOnSurfaceBooking: false, allowToUpdateFromAdditionalCharges: false
    },
    {
      id: 4, chargeCode: "A0107", active: true, chargeName: "FOV CHARGES", displayName: "FOV CHARGES",
      aliasName: "FOV CHARGES", chargeType: "Amount", amountType: "Fixed", chargeAmount: "0", minimumAmount: "0",
      applicableOn: "Docket", sacCode: "996761", bookingOnFreightLedger: false, printSequenceNo: "", ledger: "Freight Ledger",
      chargeAmountOnBankBuilty: "0", applicableOnBooking: false, applicableOnAirBooking: false, gstApplicable: false,
      applicableOnDelivery: false, applicableOnTrainBooking: false, allowAtBillUpdation: false, applicableOnMarketLoad: false,
      applicableOnSurfaceBooking: false, allowToUpdateFromAdditionalCharges: false
    },
    {
      id: 5, chargeCode: "A0108", active: true, chargeName: "DOOR DELIVERY", displayName: "DOOR DELIVERY",
      aliasName: "", chargeType: "Amount", amountType: "Fixed", chargeAmount: "0", minimumAmount: "0",
      applicableOn: "Docket", sacCode: "996511", bookingOnFreightLedger: false, printSequenceNo: "", ledger: "Freight Ledger",
      chargeAmountOnBankBuilty: "0", applicableOnBooking: false, applicableOnAirBooking: false, gstApplicable: false,
      applicableOnDelivery: false, applicableOnTrainBooking: false, allowAtBillUpdation: false, applicableOnMarketLoad: false,
      applicableOnSurfaceBooking: false, allowToUpdateFromAdditionalCharges: false
    },
    {
      id: 6, chargeCode: "A0120", active: true, chargeName: "DOCKET CHARGE", displayName: "DOCKET CHARGE",
      aliasName: "DOCKET CHARGE", chargeType: "Amount", amountType: "Fixed", chargeAmount: "100", minimumAmount: "0",
      applicableOn: "Docket", sacCode: "996511", bookingOnFreightLedger: false, printSequenceNo: "", ledger: "Freight Ledger",
      chargeAmountOnBankBuilty: "0", applicableOnBooking: false, applicableOnAirBooking: false, gstApplicable: false,
      applicableOnDelivery: false, applicableOnTrainBooking: false, allowAtBillUpdation: false, applicableOnMarketLoad: false,
      applicableOnSurfaceBooking: false, allowToUpdateFromAdditionalCharges: false
    },
  ]);

  // Sample goods wise charges data
  const [savedGoodsWiseCharges, setSavedGoodsWiseCharges] = useState<Record<number, GoodsWiseCharge[]>>({});

  const generateChargeCode = () => {
    const lastCode = savedRecords[savedRecords.length - 1]?.chargeCode;
    if (lastCode) {
      const num = parseInt(lastCode.substring(1)) + 1;
      return `A${String(num).padStart(4, '0')}`;
    }
    return "A0001";
  };

  // Reset form
  const resetForm = () => {
    setChargeCode(generateChargeCode());
    setActive(true);
    setChargeName("");
    setDisplayName("");
    setAliasName("");
    setChargeType("");
    setAmountType("");
    setChargeAmount("0");
    setMinimumAmount("0");
    setApplicableOn("");
    setSacCode("");
    setBookingOnFreightLedger(false);
    setPrintSequenceNo("");
    setLedger("");
    setChargeAmountOnBankBuilty("0");
    setApplicableOnBooking(false);
    setApplicableOnAirBooking(false);
    setGstApplicable(false);
    setApplicableOnDelivery(false);
    setApplicableOnTrainBooking(false);
    setAllowAtBillUpdation(false);
    setApplicableOnMarketLoad(false);
    setApplicableOnSurfaceBooking(false);
    setAllowToUpdateFromAdditionalCharges(false);
    setEditId(null);
  };

  const handleSave = () => {
    const newRecord: ConsignmentCharge = {
      id: editId || Date.now(),
      chargeCode: chargeCode,
      active: active,
      chargeName: chargeName,
      displayName: displayName,
      aliasName: aliasName,
      chargeType: chargeType,
      amountType: amountType,
      chargeAmount: chargeAmount,
      minimumAmount: minimumAmount,
      applicableOn: applicableOn,
      sacCode: sacCode,
      bookingOnFreightLedger: bookingOnFreightLedger,
      printSequenceNo: printSequenceNo,
      ledger: ledger,
      chargeAmountOnBankBuilty: chargeAmountOnBankBuilty,
      applicableOnBooking: applicableOnBooking,
      applicableOnAirBooking: applicableOnAirBooking,
      gstApplicable: gstApplicable,
      applicableOnDelivery: applicableOnDelivery,
      applicableOnTrainBooking: applicableOnTrainBooking,
      allowAtBillUpdation: allowAtBillUpdation,
      applicableOnMarketLoad: applicableOnMarketLoad,
      applicableOnSurfaceBooking: applicableOnSurfaceBooking,
      allowToUpdateFromAdditionalCharges: allowToUpdateFromAdditionalCharges,
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
        r.chargeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.chargeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.aliasName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleEdit = (record: ConsignmentCharge) => {
    setEditId(record.id);
    setChargeCode(record.chargeCode);
    setActive(record.active);
    setChargeName(record.chargeName);
    setDisplayName(record.displayName);
    setAliasName(record.aliasName);
    setChargeType(record.chargeType);
    setAmountType(record.amountType);
    setChargeAmount(record.chargeAmount);
    setMinimumAmount(record.minimumAmount);
    setApplicableOn(record.applicableOn);
    setSacCode(record.sacCode);
    setBookingOnFreightLedger(record.bookingOnFreightLedger);
    setPrintSequenceNo(record.printSequenceNo);
    setLedger(record.ledger);
    setChargeAmountOnBankBuilty(record.chargeAmountOnBankBuilty);
    setApplicableOnBooking(record.applicableOnBooking);
    setApplicableOnAirBooking(record.applicableOnAirBooking);
    setGstApplicable(record.gstApplicable);
    setApplicableOnDelivery(record.applicableOnDelivery);
    setApplicableOnTrainBooking(record.applicableOnTrainBooking);
    setAllowAtBillUpdation(record.allowAtBillUpdation);
    setApplicableOnMarketLoad(record.applicableOnMarketLoad);
    setApplicableOnSurfaceBooking(record.applicableOnSurfaceBooking);
    setAllowToUpdateFromAdditionalCharges(record.allowToUpdateFromAdditionalCharges);
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

  // Goods Wise Charges functions
  const handleGoodsWiseCharges = (record: ConsignmentCharge) => {
    setSelectedChargeForGoods(record);
    setGoodsWiseCharges(savedGoodsWiseCharges[record.id] || []);
    setGoodsWiseActiveTab("entry");
    resetGoodsWiseForm();
    setIsGoodsWiseModalOpen(true);
  };

  const resetGoodsWiseForm = () => {
    setWefDate(new Date());
    setUptoDate(undefined);
    setGoodsGroup("");
    setRate("0");
    setAmount("0");
    setEditGoodsWiseId(null);
  };

  const handleSaveGoodsWise = () => {
    const newGoodsWise: GoodsWiseCharge = {
      id: editGoodsWiseId || Date.now(),
      goodsGroup: goodsGroup,
      rate: rate,
      amount: amount,
    };

    let updatedCharges: GoodsWiseCharge[];
    if (editGoodsWiseId) {
      updatedCharges = goodsWiseCharges.map(c => c.id === editGoodsWiseId ? newGoodsWise : c);
    } else {
      updatedCharges = [...goodsWiseCharges, newGoodsWise];
    }

    setGoodsWiseCharges(updatedCharges);
    
    if (selectedChargeForGoods) {
      setSavedGoodsWiseCharges({
        ...savedGoodsWiseCharges,
        [selectedChargeForGoods.id]: updatedCharges
      });
    }
    
    resetGoodsWiseForm();
    alert("Goods wise charge saved successfully!");
  };

  const handleDeleteGoodsWise = (id: number) => {
    if (confirm("Are you sure you want to remove this goods wise charge?")) {
      const updatedCharges = goodsWiseCharges.filter(c => c.id !== id);
      setGoodsWiseCharges(updatedCharges);
      if (selectedChargeForGoods) {
        setSavedGoodsWiseCharges({
          ...savedGoodsWiseCharges,
          [selectedChargeForGoods.id]: updatedCharges
        });
      }
    }
  };

  const handleEditGoodsWise = (charge: GoodsWiseCharge) => {
    setEditGoodsWiseId(charge.id);
    setGoodsGroup(charge.goodsGroup);
    setRate(charge.rate);
    setAmount(charge.amount);
    setGoodsWiseActiveTab("entry");
  };

  // Add Branch functions
  const handleAddBranch = (record: ConsignmentCharge) => {
    setSelectedChargeForBranch(record);
    // Initialize branches from branchList
    const branchListData: BranchSelection[] = branchList.map((name, index) => ({
      id: index + 1,
      name: name,
      selected: allocatedBranches.some(b => b.name === name)
    }));
    setBranches(branchListData);
    setBranchSearchTerm("");
    setSelectAllBranches(false);
    setIsAddBranchModalOpen(true);
  };

  const handleSelectAllBranches = () => {
    const newSelectAll = !selectAllBranches;
    setSelectAllBranches(newSelectAll);
    setBranches(branches.map(branch => ({ ...branch, selected: newSelectAll })));
  };

  const handleBranchCheck = (id: number) => {
    setBranches(branches.map(branch => 
      branch.id === id ? { ...branch, selected: !branch.selected } : branch
    ));
  };

  const handleSaveBranches = () => {
    const selectedBranches = branches.filter(b => b.selected);
    setAllocatedBranches(selectedBranches);
    setIsAddBranchModalOpen(false);
    alert(`${selectedBranches.length} branches allocated successfully!`);
  };

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(branchSearchTerm.toLowerCase())
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
        <h1 className="text-base md:text-lg font-bold">CONSIGNMENT CHARGES MASTER</h1>
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
          <div className="flex gap-2 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by Charge Code, Charge Name or Alias Name..."
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

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1000px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold py-2 px-2 w-12">S#</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[80px]">Charge Code</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[120px]">Charge Name</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[100px]">Alias Name</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[80px]">Charge Type</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[80px]">Applicable On</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[120px]">Ledger Name</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[100px]">Amount / Rate</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[80px]">SAC Code</TableHead>
                    <TableHead className="font-semibold py-2 px-2 min-w-[100px] text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        No records found. Click SEARCH to display results or add new entry.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, index) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell className="py-2 px-2 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="py-2 px-2 font-mono">{record.chargeCode}</TableCell>
                        <TableCell className="py-2 px-2 font-medium">{record.chargeName}</TableCell>
                        <TableCell className="py-2 px-2">{record.aliasName || "-"}</TableCell>
                        <TableCell className="py-2 px-2">{record.chargeType}</TableCell>
                        <TableCell className="py-2 px-2">{record.applicableOn}</TableCell>
                        <TableCell className="py-2 px-2">{record.ledger}</TableCell>
                        <TableCell className="py-2 px-2">{record.chargeAmount} / {record.minimumAmount}</TableCell>
                        <TableCell className="py-2 px-2">{record.sacCode}</TableCell>
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
                              onClick={() => handleGoodsWiseCharges(record)}
                              className="h-7 w-7 p-0 text-purple-500 hover:text-purple-700"
                              title="Goods Wise Charges"
                            >
                              <Package className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddBranch(record)}
                              className="h-7 w-7 p-0 text-green-500 hover:text-green-700"
                              title="Add Branch"
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, searchResults.length)} of {searchResults.length} entries
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-7 text-xs">Previous</Button>
                <span className="px-3 py-1 text-xs">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-7 text-xs">Next</Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <div className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Charge Code</Label>
              <Input value={chargeCode} readOnly className="h-7 md:h-8 text-xs bg-muted" />
            </div>
            <div className="space-y-1 flex items-end">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-3.5 w-3.5" />
                <Label className="text-[11px] md:text-xs font-medium cursor-pointer">Active</Label>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Charge Name <span className="text-red-500">*</span></Label>
              <Input value={chargeName} onChange={(e) => setChargeName(e.target.value)} placeholder="Enter Charge Name" className="h-7 md:h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Display Name <span className="text-red-500">*</span></Label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Enter Display Name" className="h-7 md:h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Alias Name</Label>
              <Input value={aliasName} onChange={(e) => setAliasName(e.target.value)} placeholder="Enter Alias Name" className="h-7 md:h-8 text-xs" />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Charge Type <span className="text-red-500">*</span></Label>
              <Select value={chargeType} onValueChange={setChargeType}>
                <SelectTrigger className="h-7 md:h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                <SelectContent>{chargeTypeOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Amount Type <span className="text-red-500">*</span></Label>
              <Select value={amountType} onValueChange={setAmountType}>
                <SelectTrigger className="h-7 md:h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                <SelectContent>{amountTypeOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Charge Amount</Label>
              <Input type="number" value={chargeAmount} onChange={(e) => setChargeAmount(e.target.value)} className="h-7 md:h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Minimum Amount</Label>
              <Input type="number" value={minimumAmount} onChange={(e) => setMinimumAmount(e.target.value)} className="h-7 md:h-8 text-xs" />
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Applicable On</Label>
              <Select value={applicableOn} onValueChange={setApplicableOn}>
                <SelectTrigger className="h-7 md:h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                <SelectContent>{applicableOnOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">SAC #</Label>
              <Input value={sacCode} onChange={(e) => setSacCode(e.target.value)} placeholder="Enter SAC Code" className="h-7 md:h-8 text-xs" />
            </div>
            <div className="space-y-1 flex items-end">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={bookingOnFreightLedger} onChange={(e) => setBookingOnFreightLedger(e.target.checked)} className="h-3.5 w-3.5" />
                <Label className="text-[11px] md:text-xs font-medium cursor-pointer">Booking On Freight Ledger</Label>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Print Sequence No</Label>
              <Input value={printSequenceNo} onChange={(e) => setPrintSequenceNo(e.target.value)} className="h-7 md:h-8 text-xs" />
            </div>
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Ledger <span className="text-red-500">*</span></Label>
              <Select value={ledger} onValueChange={setLedger}>
                <SelectTrigger className="h-7 md:h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger>
                <SelectContent>{ledgerOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] md:text-xs font-medium">Charge Amount On Bank Builty</Label>
              <Input type="number" value={chargeAmountOnBankBuilty} onChange={(e) => setChargeAmountOnBankBuilty(e.target.value)} className="h-7 md:h-8 text-xs" />
            </div>
          </div>

          {/* Checkboxes Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-3 border rounded-md bg-muted/20">
            <div className="flex items-center gap-2"><input type="checkbox" checked={applicableOnBooking} onChange={(e) => setApplicableOnBooking(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-[11px] md:text-xs cursor-pointer">Applicable On Booking</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={applicableOnAirBooking} onChange={(e) => setApplicableOnAirBooking(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-[11px] md:text-xs cursor-pointer">Applicable On Air Booking</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={gstApplicable} onChange={(e) => setGstApplicable(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-[11px] md:text-xs cursor-pointer">GST Applicable</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={applicableOnDelivery} onChange={(e) => setApplicableOnDelivery(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-[11px] md:text-xs cursor-pointer">Applicable On Delivery</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={applicableOnTrainBooking} onChange={(e) => setApplicableOnTrainBooking(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-[11px] md:text-xs cursor-pointer">Applicable On Train Booking</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={allowAtBillUpdation} onChange={(e) => setAllowAtBillUpdation(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-[11px] md:text-xs cursor-pointer">Allow At Bill Updation</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={applicableOnMarketLoad} onChange={(e) => setApplicableOnMarketLoad(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-[11px] md:text-xs cursor-pointer">Applicable On Market Load</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={applicableOnSurfaceBooking} onChange={(e) => setApplicableOnSurfaceBooking(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-[11px] md:text-xs cursor-pointer">Applicable On Surface Booking</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={allowToUpdateFromAdditionalCharges} onChange={(e) => setAllowToUpdateFromAdditionalCharges(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-[11px] md:text-xs cursor-pointer">Allow To Update From Additional Charges</Label></div>
          </div>

          <div className="text-[10px] text-muted-foreground">*Marked Input Are Mandatory</div>

          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={handleSave} size="sm" className="h-7 md:h-8 text-xs"><Save className="mr-1 h-3 w-3" />{editId ? "UPDATE" : "SAVE"}</Button>
            <Button onClick={resetForm} variant="outline" size="sm" className="h-7 md:h-8 text-xs"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
          </div>
        </div>
      )}

      {/* Goods Wise Charges Modal */}
      <Dialog open={isGoodsWiseModalOpen} onOpenChange={setIsGoodsWiseModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-4 pt-4 pb-2 border-b">
            <DialogTitle className="text-base md:text-lg">Goods Wise Charges - {selectedChargeForGoods?.chargeName}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col px-4">
            <Tabs value={goodsWiseActiveTab} onValueChange={(v) => setGoodsWiseActiveTab(v as "entry" | "search")} className="w-full">
              <TabsList className="grid w-full max-w-[200px] grid-cols-2">
                <TabsTrigger value="entry" className="text-xs">Entry</TabsTrigger>
                <TabsTrigger value="search" className="text-xs">Search</TabsTrigger>
              </TabsList>

              <TabsContent value="entry" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1"><Label className="text-xs">Charge Code</Label><Input value={selectedChargeForGoods?.chargeCode} readOnly className="h-7 text-xs bg-muted" /></div>
                  <div className="space-y-1"><Label className="text-xs">Charge Name</Label><Input value={selectedChargeForGoods?.chargeName} readOnly className="h-7 text-xs bg-muted" /></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1"><Label className="text-xs">W.E.D</Label>
                    <Popover><PopoverTrigger asChild><Button variant="outline" className="h-7 w-full justify-start text-left text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{wefDate ? format(wefDate, "dd-MM-yyyy") : "Select date"}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><CalendarComponent mode="single" selected={wefDate} onSelect={(date) => date && setWefDate(date)} initialFocus /></PopoverContent></Popover>
                  </div>
                  <div className="space-y-1"><Label className="text-xs">UpTo</Label>
                    <Popover><PopoverTrigger asChild><Button variant="outline" className="h-7 w-full justify-start text-left text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{uptoDate ? format(uptoDate, "dd-MM-yyyy") : "Select date"}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><CalendarComponent mode="single" selected={uptoDate} onSelect={setUptoDate} initialFocus /></PopoverContent></Popover>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1"><Label className="text-xs">Goods Group</Label><Input value={goodsGroup} onChange={(e) => setGoodsGroup(e.target.value)} placeholder="Enter Goods Group" className="h-7 text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs">Rate</Label><Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="h-7 text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs">Amount</Label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="h-7 text-xs" /></div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button onClick={handleSaveGoodsWise} size="sm" className="h-7 text-xs"><Save className="mr-1 h-3 w-3" />SAVE</Button>
                </div>
              </TabsContent>

              <TabsContent value="search" className="mt-4">
                <div className="rounded-md border overflow-x-auto">
                  <Table className="text-xs">
                    <TableHeader><TableRow className="bg-muted/50"><TableHead className="w-12">S#</TableHead><TableHead>Charge Name</TableHead><TableHead>W.E.D Date</TableHead><TableHead>To Date</TableHead><TableHead>Goods Group Name</TableHead><TableHead className="w-20">Action</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {goodsWiseCharges.length === 0 ? (<TableRow><TableCell colSpan={6} className="text-center py-8">No goods wise charges found</TableCell></TableRow>) : (
                        goodsWiseCharges.map((charge, idx) => (<TableRow key={charge.id}><TableCell>{idx + 1}</TableCell><TableCell>{selectedChargeForGoods?.chargeName}</TableCell><TableCell>{format(wefDate, "dd-MM-yyyy")}</TableCell><TableCell>{uptoDate ? format(uptoDate, "dd-MM-yyyy") : "-"}</TableCell><TableCell>{charge.goodsGroup}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => handleDeleteGoodsWise(charge.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell></TableRow>))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="px-4 py-3 border-t gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsGoodsWiseModalOpen(false)}>CLOSE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Branch Modal */}
      <Dialog open={isAddBranchModalOpen} onOpenChange={setIsAddBranchModalOpen}>
        <DialogContent className="max-w-[90vw] md:max-w-2xl max-h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-4 pt-4 pb-2 border-b"><DialogTitle className="text-base md:text-lg">Add Branch - {selectedChargeForBranch?.chargeName}</DialogTitle></DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col px-4">
            <div className="flex items-center gap-2 py-3">
              <div className="relative flex-1"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" /><Input placeholder="Search branch..." value={branchSearchTerm} onChange={(e) => setBranchSearchTerm(e.target.value)} className="pl-8 h-8 text-xs" /></div>
            </div>

            <div className="border rounded-md flex-1 overflow-auto max-h-[50vh]">
              <Table><TableHeader className="sticky top-0 bg-background"><TableRow className="bg-muted/50"><TableHead className="w-12 text-center"><input type="checkbox" checked={selectAllBranches} onChange={handleSelectAllBranches} className="h-3.5 w-3.5" /></TableHead><TableHead className="text-xs font-semibold">Branch Name</TableHead></TableRow></TableHeader>
              <TableBody>{filteredBranches.map((branch) => (<TableRow key={branch.id} className="hover:bg-muted/30 cursor-pointer"><TableCell className="text-center"><input type="checkbox" checked={branch.selected} onChange={() => handleBranchCheck(branch.id)} className="h-3.5 w-3.5" /></TableCell><TableCell className="text-xs cursor-pointer" onClick={() => handleBranchCheck(branch.id)}>{branch.name}</TableCell></TableRow>))}
              {filteredBranches.length === 0 && (<TableRow><TableCell colSpan={2} className="text-center text-xs py-8">No branches found</TableCell></TableRow>)}</TableBody></Table>
            </div>
          </div>

          <DialogFooter className="px-4 py-3 border-t gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddBranchModalOpen(false)}>CLOSE</Button>
            <Button size="sm" onClick={handleSaveBranches}>SAVE</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}