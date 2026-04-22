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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2, X, Save, RefreshCw, Search, Edit, Pencil, Eye, Check, AlertCircle, Phone, Mail, MapPin, Building, User, CreditCard, FileText, Globe, Calendar } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ConsignorConsignee {
  id: number;
  branch: string;
  consignorConsignee: string;
  active: boolean;
  code: string;
  dealerGroupCode: string;
  name: string;
  aliasDisplayName: string;
  linkedWithCustomer: string;
  address: string;
  aliasAddress: string;
  city: string;
  zipCode: string;
  contactPerson: string;
  state: string;
  country: string;
  mobileNo: string;
  secondaryMobileNo: string;
  creditDays: string;
  panNo: string;
  gstNotApplicable: boolean;
  gstin: string;
  gstIssueDate: Date | undefined;
  emailId: string;
  icCode: string;
  referenceCode: string;
  insurancePolicyNo: string;
  insuranceCoName: string;
  billingCriteria: string;
  freightOn: string;
  creditLimit: string;
  creditLimitApplicable: boolean;
  openingBalance: string;
  openingBalanceType: string;
  tanNumber: string;
  createSubLedger: string;
  billingCycle: string;
  marketingExecutive: string;
  customerType: string;
  industryType: string;
  loadType: string;
  rebateNotAllow: boolean;
  allowLiveTrackingOnPortal: boolean;
  disableManualRatesInBooking: boolean;
  invoiceRequired: boolean;
  isWhatsAppAlert: boolean;
  hideFreightInGR: boolean;
  kycCompleted: boolean;
  roundOffWeightNotRequired: boolean;
}

// Sample branch list
const branchList = [
  "CORPORATE OFFICE", "MEERUT", "DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA",
  "AHMEDABAD", "PUNE", "HYDERABAD", "LUCKNOW", "KANPUR", "JAIPUR", "CHANDIGARH"
];

const consignorConsigneeOptions = ["Consignor", "Consignee", "Both"];
const stateList = ["Uttar Pradesh", "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal", "Gujarat", "Rajasthan"];
const countryList = ["India", "USA", "UK", "Canada", "Australia", "Singapore", "UAE"];
const billingCriteriaOptions = ["On Delivery", "On Booking", "Monthly", "Weekly", "Fortnightly"];
const freightOnOptions = ["To Pay", "Prepaid", "Collect"];
const createSubLedgerOptions = ["Yes", "No"];
const billingCycleOptions = ["Monthly", "Quarterly", "Half Yearly", "Yearly"];
const customerTypeOptions = ["Regular", "Corporate", "Government", "International", "Premium"];
const industryTypeOptions = ["Logistics", "Manufacturing", "Retail", "Wholesale", "E-commerce", "Pharma", "Automobile"];
const loadTypeOptions = ["BOTH", "FTL", "LTL", "Container"];

export default function ConsignorConsigneeMaster() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"search" | "entry">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  
  // Form state
  const [branch, setBranch] = useState<string>("");
  const [consignorConsignee, setConsignorConsignee] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);
  const [code, setCode] = useState<string>("");
  const [dealerGroupCode, setDealerGroupCode] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [aliasDisplayName, setAliasDisplayName] = useState<string>("");
  const [linkedWithCustomer, setLinkedWithCustomer] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [aliasAddress, setAliasAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [contactPerson, setContactPerson] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [mobileNo, setMobileNo] = useState<string>("");
  const [secondaryMobileNo, setSecondaryMobileNo] = useState<string>("");
  const [creditDays, setCreditDays] = useState<string>("");
  const [panNo, setPanNo] = useState<string>("");
  const [gstNotApplicable, setGstNotApplicable] = useState<boolean>(false);
  const [gstin, setGstin] = useState<string>("");
  const [gstIssueDate, setGstIssueDate] = useState<Date | undefined>();
  const [emailId, setEmailId] = useState<string>("");
  const [icCode, setIcCode] = useState<string>("");
  const [referenceCode, setReferenceCode] = useState<string>("");
  const [insurancePolicyNo, setInsurancePolicyNo] = useState<string>("");
  const [insuranceCoName, setInsuranceCoName] = useState<string>("");
  const [billingCriteria, setBillingCriteria] = useState<string>("");
  const [freightOn, setFreightOn] = useState<string>("");
  const [creditLimit, setCreditLimit] = useState<string>("0");
  const [creditLimitApplicable, setCreditLimitApplicable] = useState<boolean>(false);
  const [openingBalance, setOpeningBalance] = useState<string>("0");
  const [openingBalanceType, setOpeningBalanceType] = useState<string>("DR");
  const [tanNumber, setTanNumber] = useState<string>("");
  const [createSubLedger, setCreateSubLedger] = useState<string>("No");
  const [billingCycle, setBillingCycle] = useState<string>("");
  const [marketingExecutive, setMarketingExecutive] = useState<string>("");
  const [customerType, setCustomerType] = useState<string>("");
  const [industryType, setIndustryType] = useState<string>("");
  const [loadType, setLoadType] = useState<string>("BOTH");
  const [rebateNotAllow, setRebateNotAllow] = useState<boolean>(false);
  const [allowLiveTrackingOnPortal, setAllowLiveTrackingOnPortal] = useState<boolean>(false);
  const [disableManualRatesInBooking, setDisableManualRatesInBooking] = useState<boolean>(false);
  const [invoiceRequired, setInvoiceRequired] = useState<boolean>(false);
  const [isWhatsAppAlert, setIsWhatsAppAlert] = useState<boolean>(false);
  const [hideFreightInGR, setHideFreightInGR] = useState<boolean>(false);
  const [kycCompleted, setKycCompleted] = useState<boolean>(false);
  const [roundOffWeightNotRequired, setRoundOffWeightNotRequired] = useState<boolean>(false);

  // Search state
  const [searchResults, setSearchResults] = useState<ConsignorConsignee[]>([]);
  const [searchBranch, setSearchBranch] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("all");
  const [searchStatus, setSearchStatus] = useState<string>("all");
  const [searchGstNo, setSearchGstNo] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<ConsignorConsignee[]>([
    {
      id: 1, branch: "CORPORATE OFFICE", consignorConsignee: "Both", active: true, code: "C0001",
      dealerGroupCode: "DG001", name: "M/S GOLDEN LOGISTICS", aliasDisplayName: "GOLDEN LOGISTICS",
      linkedWithCustomer: "", address: "123, Transport Nagar", aliasAddress: "", city: "Delhi",
      zipCode: "110001", contactPerson: "Rajesh Kumar", state: "Delhi", country: "India",
      mobileNo: "9876543210", secondaryMobileNo: "", creditDays: "30", panNo: "ABCDE1234F",
      gstNotApplicable: false, gstin: "07ABCDE1234F1Z5", gstIssueDate: new Date("2023-01-01"),
      emailId: "info@goldenlogistics.com", icCode: "IC001", referenceCode: "REF001",
      insurancePolicyNo: "POL123456", insuranceCoName: "New India Assurance", billingCriteria: "On Delivery",
      freightOn: "To Pay", creditLimit: "500000", creditLimitApplicable: true, openingBalance: "0",
      openingBalanceType: "DR", tanNumber: "TAN123456", createSubLedger: "Yes", billingCycle: "Monthly",
      marketingExecutive: "Amit Sharma", customerType: "Corporate", industryType: "Logistics",
      loadType: "BOTH", rebateNotAllow: false, allowLiveTrackingOnPortal: true, disableManualRatesInBooking: false,
      invoiceRequired: true, isWhatsAppAlert: true, hideFreightInGR: false, kycCompleted: true,
      roundOffWeightNotRequired: false
    },
    {
      id: 2, branch: "MEERUT", consignorConsignee: "Consignor", active: true, code: "C0002",
      dealerGroupCode: "", name: "M/S MEERUT TRANSPORT", aliasDisplayName: "MEERUT TRANSPORT",
      linkedWithCustomer: "", address: "456, Transport Complex", aliasAddress: "", city: "Meerut",
      zipCode: "250001", contactPerson: "Suresh Singh", state: "Uttar Pradesh", country: "India",
      mobileNo: "9876543211", secondaryMobileNo: "", creditDays: "15", panNo: "FGHIJ5678K",
      gstNotApplicable: false, gstin: "09FGHIJ5678K1Z6", gstIssueDate: new Date("2023-02-01"),
      emailId: "contact@meeruttransport.com", icCode: "", referenceCode: "", insurancePolicyNo: "",
      insuranceCoName: "", billingCriteria: "On Booking", freightOn: "Prepaid", creditLimit: "100000",
      creditLimitApplicable: true, openingBalance: "0", openingBalanceType: "DR", tanNumber: "",
      createSubLedger: "No", billingCycle: "Quarterly", marketingExecutive: "Priya Verma",
      customerType: "Regular", industryType: "Transport", loadType: "FTL", rebateNotAllow: false,
      allowLiveTrackingOnPortal: false, disableManualRatesInBooking: false, invoiceRequired: true,
      isWhatsAppAlert: false, hideFreightInGR: false, kycCompleted: true, roundOffWeightNotRequired: false
    },
  ]);

  const generateCode = () => {
    const lastCode = savedRecords[savedRecords.length - 1]?.code;
    if (lastCode) {
      const num = parseInt(lastCode.substring(1)) + 1;
      return `C${String(num).padStart(4, '0')}`;
    }
    return "C0001";
  };

  const resetForm = () => {
    setBranch("");
    setConsignorConsignee("");
    setActive(true);
    setCode(generateCode());
    setDealerGroupCode("");
    setName("");
    setAliasDisplayName("");
    setLinkedWithCustomer("");
    setAddress("");
    setAliasAddress("");
    setCity("");
    setZipCode("");
    setContactPerson("");
    setState("");
    setCountry("");
    setMobileNo("");
    setSecondaryMobileNo("");
    setCreditDays("");
    setPanNo("");
    setGstNotApplicable(false);
    setGstin("");
    setGstIssueDate(undefined);
    setEmailId("");
    setIcCode("");
    setReferenceCode("");
    setInsurancePolicyNo("");
    setInsuranceCoName("");
    setBillingCriteria("");
    setFreightOn("");
    setCreditLimit("0");
    setCreditLimitApplicable(false);
    setOpeningBalance("0");
    setOpeningBalanceType("DR");
    setTanNumber("");
    setCreateSubLedger("No");
    setBillingCycle("");
    setMarketingExecutive("");
    setCustomerType("");
    setIndustryType("");
    setLoadType("BOTH");
    setRebateNotAllow(false);
    setAllowLiveTrackingOnPortal(false);
    setDisableManualRatesInBooking(false);
    setInvoiceRequired(false);
    setIsWhatsAppAlert(false);
    setHideFreightInGR(false);
    setKycCompleted(false);
    setRoundOffWeightNotRequired(false);
    setEditId(null);
  };

  const handleSave = () => {
    const newRecord: ConsignorConsignee = {
      id: editId || Date.now(),
      branch, consignorConsignee, active, code, dealerGroupCode, name, aliasDisplayName,
      linkedWithCustomer, address, aliasAddress, city, zipCode, contactPerson, state, country,
      mobileNo, secondaryMobileNo, creditDays, panNo, gstNotApplicable, gstin, gstIssueDate,
      emailId, icCode, referenceCode, insurancePolicyNo, insuranceCoName, billingCriteria,
      freightOn, creditLimit, creditLimitApplicable, openingBalance, openingBalanceType, tanNumber,
      createSubLedger, billingCycle, marketingExecutive, customerType, industryType, loadType,
      rebateNotAllow, allowLiveTrackingOnPortal, disableManualRatesInBooking, invoiceRequired,
      isWhatsAppAlert, hideFreightInGR, kycCompleted, roundOffWeightNotRequired
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

  const handleDelete = () => {
    if (editId && confirm("Are you sure you want to delete this record?")) {
      setSavedRecords(savedRecords.filter(record => record.id !== editId));
      resetForm();
      alert("Record deleted successfully!");
    }
  };

  const handleSearch = () => {
    let results = [...savedRecords];
    if (searchBranch) results = results.filter(r => r.branch === searchBranch);
    if (searchName) results = results.filter(r => r.name.toLowerCase().includes(searchName.toLowerCase()));
    if (searchType !== "all") results = results.filter(r => r.consignorConsignee === searchType);
    if (searchStatus !== "all") results = results.filter(r => r.active === (searchStatus === "active"));
    if (searchGstNo) results = results.filter(r => r.gstin.toLowerCase().includes(searchGstNo.toLowerCase()));
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleEdit = (record: ConsignorConsignee) => {
    setEditId(record.id);
    setBranch(record.branch);
    setConsignorConsignee(record.consignorConsignee);
    setActive(record.active);
    setCode(record.code);
    setDealerGroupCode(record.dealerGroupCode);
    setName(record.name);
    setAliasDisplayName(record.aliasDisplayName);
    setLinkedWithCustomer(record.linkedWithCustomer);
    setAddress(record.address);
    setAliasAddress(record.aliasAddress);
    setCity(record.city);
    setZipCode(record.zipCode);
    setContactPerson(record.contactPerson);
    setState(record.state);
    setCountry(record.country);
    setMobileNo(record.mobileNo);
    setSecondaryMobileNo(record.secondaryMobileNo);
    setCreditDays(record.creditDays);
    setPanNo(record.panNo);
    setGstNotApplicable(record.gstNotApplicable);
    setGstin(record.gstin);
    setGstIssueDate(record.gstIssueDate);
    setEmailId(record.emailId);
    setIcCode(record.icCode);
    setReferenceCode(record.referenceCode);
    setInsurancePolicyNo(record.insurancePolicyNo);
    setInsuranceCoName(record.insuranceCoName);
    setBillingCriteria(record.billingCriteria);
    setFreightOn(record.freightOn);
    setCreditLimit(record.creditLimit);
    setCreditLimitApplicable(record.creditLimitApplicable);
    setOpeningBalance(record.openingBalance);
    setOpeningBalanceType(record.openingBalanceType);
    setTanNumber(record.tanNumber);
    setCreateSubLedger(record.createSubLedger);
    setBillingCycle(record.billingCycle);
    setMarketingExecutive(record.marketingExecutive);
    setCustomerType(record.customerType);
    setIndustryType(record.industryType);
    setLoadType(record.loadType);
    setRebateNotAllow(record.rebateNotAllow);
    setAllowLiveTrackingOnPortal(record.allowLiveTrackingOnPortal);
    setDisableManualRatesInBooking(record.disableManualRatesInBooking);
    setInvoiceRequired(record.invoiceRequired);
    setIsWhatsAppAlert(record.isWhatsAppAlert);
    setHideFreightInGR(record.hideFreightInGR);
    setKycCompleted(record.kycCompleted);
    setRoundOffWeightNotRequired(record.roundOffWeightNotRequired);
    setActiveTab("entry");
  };

  const clearSearch = () => {
    setSearchBranch("");
    setSearchName("");
    setSearchType("all");
    setSearchStatus("all");
    setSearchGstNo("");
    setSearchResults([]);
  };

  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">CONSIGNOR CONSIGNEE MASTER</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button onClick={() => { setActiveTab("search"); handleSearch(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Search</button>
        <button onClick={() => { setActiveTab("entry"); resetForm(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Entry</button>
      </div>

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 border rounded-md bg-muted/20">
            <div className="space-y-1"><Label className="text-xs">Branch</Label><Select value={searchBranch} onValueChange={setSearchBranch}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{branchList.map(b => (<SelectItem key={b} value={b} className="text-xs">{b}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Consignor / Consignee Name</Label><Input value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="Enter name" className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Consignor / Consignee</Label><Select value={searchType} onValueChange={setSearchType}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all" className="text-xs">All</SelectItem><SelectItem value="Consignor" className="text-xs">Consignor</SelectItem><SelectItem value="Consignee" className="text-xs">Consignee</SelectItem><SelectItem value="Both" className="text-xs">Both</SelectItem></SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Status</Label><Select value={searchStatus} onValueChange={setSearchStatus}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all" className="text-xs">All</SelectItem><SelectItem value="active" className="text-xs">Active</SelectItem><SelectItem value="inactive" className="text-xs">Inactive</SelectItem></SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">GST Number</Label><Input value={searchGstNo} onChange={(e) => setSearchGstNo(e.target.value)} placeholder="Enter GST Number" className="h-8 text-xs" /></div>
          </div>
          <div className="flex justify-end"><Button onClick={handleSearch} size="sm" className="h-8 text-xs"><Search className="mr-1 h-3.5 w-3.5" />SHOW</Button></div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1200px]">
              <Table className="text-xs">
                <TableHeader><TableRow className="bg-muted/50">
                  <TableHead className="w-12">S#</TableHead><TableHead>Branch</TableHead><TableHead>Name</TableHead><TableHead>Alias Name</TableHead><TableHead>Address</TableHead><TableHead>Customer</TableHead><TableHead>City</TableHead><TableHead>State</TableHead><TableHead>GST No</TableHead><TableHead>Mobile No.</TableHead><TableHead>Email</TableHead><TableHead>Active</TableHead><TableHead className="w-20">Options</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (<TableRow><TableCell colSpan={13} className="text-center py-8">No records found</TableCell></TableRow>) : (
                    paginatedResults.map((record, idx) => (<TableRow key={record.id}><TableCell>{(currentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell>{record.branch}</TableCell><TableCell className="font-medium">{record.name}</TableCell><TableCell>{record.aliasDisplayName}</TableCell><TableCell>{record.address}</TableCell><TableCell>{record.consignorConsignee}</TableCell><TableCell>{record.city}</TableCell><TableCell>{record.state}</TableCell><TableCell>{record.gstin}</TableCell><TableCell>{record.mobileNo}</TableCell><TableCell>{record.emailId}</TableCell><TableCell>{record.active ? <Check className="h-3.5 w-3.5 text-green-500" /> : <X className="h-3.5 w-3.5 text-red-500" />}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => handleEdit(record)} className="h-7 w-7 p-0 text-blue-500"><Pencil className="h-3.5 w-3.5" /></Button></TableCell></TableRow>))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {totalPages > 1 && (<div className="flex items-center justify-between"><div className="text-xs">Showing {((currentPage-1)*itemsPerPage)+1} to {Math.min(currentPage*itemsPerPage, searchResults.length)} of {searchResults.length} entries</div><div className="flex gap-1"><Button variant="outline" size="sm" onClick={() => setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1} className="h-7 text-xs">Previous</Button><span className="px-3 py-1 text-xs">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages} className="h-7 text-xs">Next</Button></div></div>)}
        </div>
      )}

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <div className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Branch <span className="text-red-500">*</span></Label><Select value={branch} onValueChange={setBranch}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{branchList.map(b => (<SelectItem key={b} value={b} className="text-xs">{b}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Consignor/Consignee <span className="text-red-500">*</span></Label><Select value={consignorConsignee} onValueChange={setConsignorConsignee}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{consignorConsigneeOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1 flex items-end"><div className="flex items-center gap-2"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">Active</Label></div></div>
            <div className="space-y-1"><Label className="text-xs">Code <span className="text-red-500">*</span></Label><Input value={code} readOnly className="h-8 text-xs bg-muted" /></div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-xs">Dealer/Group Code</Label><Input value={dealerGroupCode} onChange={(e) => setDealerGroupCode(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Name <span className="text-red-500">*</span></Label><Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Alias/Display Name <span className="text-red-500">*</span></Label><Input value={aliasDisplayName} onChange={(e) => setAliasDisplayName(e.target.value)} className="h-8 text-xs" /></div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Linked With Customer</Label><Input value={linkedWithCustomer} onChange={(e) => setLinkedWithCustomer(e.target.value)} className="h-8 text-xs" /></div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Address <span className="text-red-500">*</span></Label><Input value={address} onChange={(e) => setAddress(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Alias Address</Label><Input value={aliasAddress} onChange={(e) => setAliasAddress(e.target.value)} className="h-8 text-xs" /></div>
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">City <span className="text-red-500">*</span></Label><Input value={city} onChange={(e) => setCity(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Zip Code</Label><Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Contact Person</Label><Input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">State</Label><Select value={state} onValueChange={setState}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{stateList.map(s => (<SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>))}</SelectContent></Select></div>
          </div>

          {/* Row 6 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Country</Label><Select value={country} onValueChange={setCountry}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{countryList.map(c => (<SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Mobile No.</Label><Input value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Secondary Mobile No.</Label><Input value={secondaryMobileNo} onChange={(e) => setSecondaryMobileNo(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Credit days</Label><Input value={creditDays} onChange={(e) => setCreditDays(e.target.value)} className="h-8 text-xs" /></div>
          </div>

          {/* Row 7 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">PAN No.</Label><Input value={panNo} onChange={(e) => setPanNo(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1 flex items-end"><div className="flex items-center gap-2"><input type="checkbox" checked={gstNotApplicable} onChange={(e) => setGstNotApplicable(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">GST Not Applicable</Label></div></div>
            <div className="space-y-1"><Label className="text-xs">GSTIN <span className="text-red-500">*</span></Label><Input value={gstin} onChange={(e) => setGstin(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">GST Issue Date</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 w-full justify-start text-left text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{gstIssueDate ? format(gstIssueDate, "dd-MM-yyyy") : "Select date"}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><CalendarComponent mode="single" selected={gstIssueDate} onSelect={setGstIssueDate} initialFocus /></PopoverContent></Popover></div>
          </div>

          {/* Row 8 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Email ID</Label><Input value={emailId} onChange={(e) => setEmailId(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">IC Code</Label><Input value={icCode} onChange={(e) => setIcCode(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Reference Code</Label><Input value={referenceCode} onChange={(e) => setReferenceCode(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Insurance Policy #</Label><Input value={insurancePolicyNo} onChange={(e) => setInsurancePolicyNo(e.target.value)} className="h-8 text-xs" /></div>
          </div>

          {/* Row 9 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Insurance CO. Name</Label><Input value={insuranceCoName} onChange={(e) => setInsuranceCoName(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Billing Criteria</Label><Select value={billingCriteria} onValueChange={setBillingCriteria}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{billingCriteriaOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Freight On</Label><Select value={freightOn} onValueChange={setFreightOn}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{freightOnOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Credit Limit</Label><Input type="number" value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)} className="h-8 text-xs" /></div>
          </div>

          {/* Row 10 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1 flex items-end"><div className="flex items-center gap-2"><input type="checkbox" checked={creditLimitApplicable} onChange={(e) => setCreditLimitApplicable(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">Credit Limit Applicable</Label></div></div>
            <div className="space-y-1"><Label className="text-xs">Opening Balance</Label><div className="flex gap-1"><Input type="number" value={openingBalance} onChange={(e) => setOpeningBalance(e.target.value)} className="h-8 flex-1 text-xs" /><Select value={openingBalanceType} onValueChange={setOpeningBalanceType}><SelectTrigger className="h-8 w-16 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="DR" className="text-xs">DR</SelectItem><SelectItem value="CR" className="text-xs">CR</SelectItem></SelectContent></Select></div></div>
            <div className="space-y-1"><Label className="text-xs">TAN Number</Label><Input value={tanNumber} onChange={(e) => setTanNumber(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Create Sub Ledger</Label><Select value={createSubLedger} onValueChange={setCreateSubLedger}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Yes" className="text-xs">Yes</SelectItem><SelectItem value="No" className="text-xs">No</SelectItem></SelectContent></Select></div>
          </div>

          {/* Row 11 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Billing Cycle</Label><Select value={billingCycle} onValueChange={setBillingCycle}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{billingCycleOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Marketing Executive</Label><Input value={marketingExecutive} onChange={(e) => setMarketingExecutive(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Customer Type</Label><Select value={customerType} onValueChange={setCustomerType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{customerTypeOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-1"><Label className="text-xs">Industry Type</Label><Select value={industryType} onValueChange={setIndustryType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{industryTypeOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent></Select></div>
          </div>

          {/* Row 12 - Load Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Load Type</Label><Select value={loadType} onValueChange={setLoadType}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{loadTypeOptions.map(opt => (<SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>))}</SelectContent></Select></div>
          </div>

          {/* Checkboxes Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-3 border rounded-md bg-muted/20">
            <div className="flex items-center gap-2"><input type="checkbox" checked={rebateNotAllow} onChange={(e) => setRebateNotAllow(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">Rebate Not Allow</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={allowLiveTrackingOnPortal} onChange={(e) => setAllowLiveTrackingOnPortal(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">Allow Live Tracking On Portal</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={disableManualRatesInBooking} onChange={(e) => setDisableManualRatesInBooking(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">Disable Manual Rates In Booking</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={invoiceRequired} onChange={(e) => setInvoiceRequired(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">Invoice Required</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={isWhatsAppAlert} onChange={(e) => setIsWhatsAppAlert(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">Is Whats App Alert</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={hideFreightInGR} onChange={(e) => setHideFreightInGR(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">Hide Freight In GR</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={kycCompleted} onChange={(e) => setKycCompleted(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">KYC Completed</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={roundOffWeightNotRequired} onChange={(e) => setRoundOffWeightNotRequired(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">Round Off Weight Not Required</Label></div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={handleSave} size="sm" className="h-8 text-xs"><Save className="mr-1 h-3 w-3" />SAVE</Button>
            <Button onClick={handleDelete} variant="destructive" size="sm" className="h-8 text-xs"><Trash2 className="mr-1 h-3 w-3" />DELETE</Button>
            <Button onClick={resetForm} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
            <Button onClick={() => {}} variant="outline" size="sm" className="h-8 text-xs"><FileText className="mr-1 h-3 w-3" />SET UP</Button>
          </div>
        </div>
      )}
    </div>
  );
}