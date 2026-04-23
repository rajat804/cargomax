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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Save, RefreshCw, Search, Pencil, Trash2, Upload, Download, Eye, X, Plus, Edit, MoreVertical, AlertCircle, Car, Banknote, FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DriverRecord {
  id: number;
  driverCode: string;
  active: boolean;
  type: string;
  driverName: string;
  fathersName: string;
  aliasName: string;
  employeeName: string;
  presentAddress: string;
  homeCountryAddress: string;
  foreman: string;
  mobileNo: string;
  dateOfBirth: Date;
  age: number;
  aadhaarNo: string;
  joiningDate: Date;
  resignDate: Date | null;
  licenseNo: string;
  issueDate: Date;
  issuedBy: string;
  validUpto: Date;
  panNo: string;
  pfUanNo: string;
  accountHolderName: string;
  bankName: string;
  bankBranch: string;
  bankAccountNo: string;
  ifscCode: string;
  foremanName: string;
  emergencyContactName: string;
  emergencyContactNo: string;
  allowMobileLogin: boolean;
  blackList: boolean;
  attachFile: string;
}

interface DueAlert {
  id: number;
  particular: string;
  validity: string;
  validUpto: Date;
  alertDays: number;
  intervalDays: number;
  smsTo: string;
  emailTo: string;
  remarks: string;
  alertRemarks: string;
  document: string;
}

interface VehicleAssignment {
  id: number;
  fromDate: Date;
  vehicleNo: string;
}

interface BankDetail {
  id: number;
  bankName: string;
  bankBranch: string;
  accountType: string;
  accountHolderName: string;
  accountNo: string;
  ifscCode: string;
  isActive: boolean;
  isPrimary: boolean;
  chequeImage: string;
}

const driverTypeOptions = ["DRIVER", "OWNER", "HELPER", "CLEANER"];
const accountTypeOptions = ["Saving", "Current", "Salary"];

export default function DriverMaster() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"search" | "entry">("entry");
  const [editId, setEditId] = useState<number | null>(null);
  
  // Form state
  const [driverCode, setDriverCode] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);
  const [type, setType] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");
  const [fathersName, setFathersName] = useState<string>("");
  const [aliasName, setAliasName] = useState<string>("");
  const [employeeName, setEmployeeName] = useState<string>("");
  const [presentAddress, setPresentAddress] = useState<string>("");
  const [homeCountryAddress, setHomeCountryAddress] = useState<string>("");
  const [foreman, setForeman] = useState<string>("");
  const [mobileNo, setMobileNo] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
  const [age, setAge] = useState<number>(0);
  const [aadhaarNo, setAadhaarNo] = useState<string>("");
  const [joiningDate, setJoiningDate] = useState<Date>(new Date());
  const [resignDate, setResignDate] = useState<Date | null>(null);
  const [licenseNo, setLicenseNo] = useState<string>("");
  const [issueDate, setIssueDate] = useState<Date>(new Date());
  const [issuedBy, setIssuedBy] = useState<string>("");
  const [validUpto, setValidUpto] = useState<Date>(new Date());
  const [panNo, setPanNo] = useState<string>("");
  const [pfUanNo, setPfUanNo] = useState<string>("");
  const [accountHolderName, setAccountHolderName] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [bankBranch, setBankBranch] = useState<string>("");
  const [bankAccountNo, setBankAccountNo] = useState<string>("");
  const [ifscCode, setIfscCode] = useState<string>("");
  const [foremanName, setForemanName] = useState<string>("");
  const [emergencyContactName, setEmergencyContactName] = useState<string>("");
  const [emergencyContactNo, setEmergencyContactNo] = useState<string>("");
  const [allowMobileLogin, setAllowMobileLogin] = useState<boolean>(false);
  const [blackList, setBlackList] = useState<boolean>(false);
  const [attachFile, setAttachFile] = useState<string>("");

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Modal states
  const [isDueAlertModalOpen, setIsDueAlertModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverRecord | null>(null);
  
  // Due Alert state
  const [dueAlerts, setDueAlerts] = useState<DueAlert[]>([]);
  const [dueAlertParticular, setDueAlertParticular] = useState("");
  const [dueAlertValidity, setDueAlertValidity] = useState("");
  const [dueAlertValidUpto, setDueAlertValidUpto] = useState<Date>(new Date());
  const [dueAlertDays, setDueAlertDays] = useState(0);
  const [dueAlertIntervalDays, setDueAlertIntervalDays] = useState(0);
  const [dueAlertSmsTo, setDueAlertSmsTo] = useState("");
  const [dueAlertEmailTo, setDueAlertEmailTo] = useState("");
  const [dueAlertRemarks, setDueAlertRemarks] = useState("");
  const [dueAlertAlertRemarks, setDueAlertAlertRemarks] = useState("");
  const [dueAlertDocument, setDueAlertDocument] = useState("");
  const [editDueAlertId, setEditDueAlertId] = useState<number | null>(null);

  // Vehicle Assignment state
  const [vehicles, setVehicles] = useState<VehicleAssignment[]>([]);
  const [vehicleFromDate, setVehicleFromDate] = useState<Date>(new Date());
  const [vehicleNo, setVehicleNo] = useState("");

  // Bank Details state
  const [bankDetails, setBankDetails] = useState<BankDetail[]>([]);
  const [bankNameField, setBankNameField] = useState("");
  const [bankBranchField, setBankBranchField] = useState("");
  const [accountType, setAccountType] = useState("Saving");
  const [accountHolderNameField, setAccountHolderNameField] = useState("");
  const [accountNoField, setAccountNoField] = useState("");
  const [ifscCodeField, setIfscCodeField] = useState("");
  const [isActiveBank, setIsActiveBank] = useState(false);
  const [isPrimaryBank, setIsPrimaryBank] = useState(false);
  const [chequeImage, setChequeImage] = useState("");
  const [editBankId, setEditBankId] = useState<number | null>(null);

  // Sample saved data
  const [savedRecords, setSavedRecords] = useState<DriverRecord[]>([
    { id: 1, driverCode: "A0002", active: true, type: "DRIVER", driverName: "NOTE CLEAR", fathersName: "", aliasName: "", employeeName: "", presentAddress: "GHAZIABAD", homeCountryAddress: "", foreman: "", mobileNo: "7310842801", dateOfBirth: new Date(), age: 0, aadhaarNo: "1111111111", joiningDate: new Date("2025-07-11"), resignDate: null, licenseNo: "", issueDate: new Date("2025-07-11"), issuedBy: "", validUpto: new Date("2029-11-29"), panNo: "", pfUanNo: "", accountHolderName: "", bankName: "", bankBranch: "", bankAccountNo: "", ifscCode: "", foremanName: "", emergencyContactName: "", emergencyContactNo: "", allowMobileLogin: false, blackList: false, attachFile: "" },
    { id: 2, driverCode: "A0004", active: true, type: "DRIVER", driverName: "SARWAN", fathersName: "", aliasName: "", employeeName: "", presentAddress: "", homeCountryAddress: "", foreman: "", mobileNo: "9821725574", dateOfBirth: new Date(), age: 0, aadhaarNo: "", joiningDate: new Date(), resignDate: null, licenseNo: "UP5020210018690", issueDate: new Date(), issuedBy: "", validUpto: new Date(), panNo: "", pfUanNo: "", accountHolderName: "", bankName: "", bankBranch: "", bankAccountNo: "", ifscCode: "", foremanName: "", emergencyContactName: "", emergencyContactNo: "", allowMobileLogin: false, blackList: false, attachFile: "" },
    { id: 3, driverCode: "A0006", active: true, type: "DRIVER", driverName: "SOHANLAL", fathersName: "", aliasName: "", employeeName: "", presentAddress: "", homeCountryAddress: "", foreman: "", mobileNo: "8958440072", dateOfBirth: new Date(), age: 0, aadhaarNo: "", joiningDate: new Date(), resignDate: null, licenseNo: "UP", issueDate: new Date(), issuedBy: "", validUpto: new Date(), panNo: "", pfUanNo: "", accountHolderName: "", bankName: "", bankBranch: "", bankAccountNo: "", ifscCode: "", foremanName: "", emergencyContactName: "", emergencyContactNo: "", allowMobileLogin: false, blackList: false, attachFile: "" },
    { id: 4, driverCode: "A0008", active: true, type: "DRIVER", driverName: "PARDEEP", fathersName: "", aliasName: "", employeeName: "", presentAddress: "", homeCountryAddress: "", foreman: "", mobileNo: "7042597426", dateOfBirth: new Date(), age: 0, aadhaarNo: "", joiningDate: new Date(), resignDate: null, licenseNo: "UP5020190002545", issueDate: new Date(), issuedBy: "", validUpto: new Date(), panNo: "", pfUanNo: "", accountHolderName: "", bankName: "", bankBranch: "", bankAccountNo: "", ifscCode: "", foremanName: "", emergencyContactName: "", emergencyContactNo: "", allowMobileLogin: false, blackList: false, attachFile: "" },
    { id: 5, driverCode: "A0010", active: true, type: "DRIVER", driverName: "KAPIL", fathersName: "", aliasName: "", employeeName: "", presentAddress: "", homeCountryAddress: "", foreman: "", mobileNo: "9468315501", dateOfBirth: new Date(), age: 0, aadhaarNo: "", joiningDate: new Date(), resignDate: null, licenseNo: "HR4220100018118", issueDate: new Date(), issuedBy: "", validUpto: new Date(), panNo: "", pfUanNo: "", accountHolderName: "", bankName: "", bankBranch: "", bankAccountNo: "", ifscCode: "", foremanName: "", emergencyContactName: "", emergencyContactNo: "", allowMobileLogin: false, blackList: false, attachFile: "" },
    { id: 6, driverCode: "A0012", active: true, type: "DRIVER", driverName: "AJAY", fathersName: "", aliasName: "", employeeName: "", presentAddress: "", homeCountryAddress: "", foreman: "", mobileNo: "7217682171", dateOfBirth: new Date(), age: 0, aadhaarNo: "", joiningDate: new Date(), resignDate: null, licenseNo: "UP50201920004608", issueDate: new Date(), issuedBy: "", validUpto: new Date(), panNo: "", pfUanNo: "", accountHolderName: "", bankName: "", bankBranch: "", bankAccountNo: "", ifscCode: "", foremanName: "", emergencyContactName: "", emergencyContactNo: "", allowMobileLogin: false, blackList: false, attachFile: "" },
    { id: 7, driverCode: "A0014", active: true, type: "DRIVER", driverName: "KAVI", fathersName: "", aliasName: "", employeeName: "", presentAddress: "", homeCountryAddress: "", foreman: "", mobileNo: "8933944555", dateOfBirth: new Date(), age: 0, aadhaarNo: "", joiningDate: new Date(), resignDate: null, licenseNo: "UP5020190008825", issueDate: new Date(), issuedBy: "", validUpto: new Date(), panNo: "", pfUanNo: "", accountHolderName: "", bankName: "", bankBranch: "", bankAccountNo: "", ifscCode: "", foremanName: "", emergencyContactName: "", emergencyContactNo: "", allowMobileLogin: false, blackList: false, attachFile: "" },
    { id: 8, driverCode: "A0016", active: true, type: "DRIVER", driverName: "DINESH KUMAR", fathersName: "", aliasName: "", employeeName: "", presentAddress: "", homeCountryAddress: "", foreman: "", mobileNo: "8860662461", dateOfBirth: new Date(), age: 0, aadhaarNo: "", joiningDate: new Date(), resignDate: null, licenseNo: "UP5019900006958", issueDate: new Date(), issuedBy: "", validUpto: new Date(), panNo: "", pfUanNo: "", accountHolderName: "", bankName: "", bankBranch: "", bankAccountNo: "", ifscCode: "", foremanName: "", emergencyContactName: "", emergencyContactNo: "", allowMobileLogin: false, blackList: false, attachFile: "" },
    { id: 9, driverCode: "A0018", active: true, type: "DRIVER", driverName: "SURENDAR", fathersName: "", aliasName: "", employeeName: "", presentAddress: "", homeCountryAddress: "", foreman: "", mobileNo: "9058512580", dateOfBirth: new Date(), age: 0, aadhaarNo: "", joiningDate: new Date(), resignDate: null, licenseNo: "UP220", issueDate: new Date(), issuedBy: "", validUpto: new Date(), panNo: "", pfUanNo: "", accountHolderName: "", bankName: "", bankBranch: "", bankAccountNo: "", ifscCode: "", foremanName: "", emergencyContactName: "", emergencyContactNo: "", allowMobileLogin: false, blackList: false, attachFile: "" },
    { id: 10, driverCode: "A0020", active: true, type: "DRIVER", driverName: "SURAJ SINGH", fathersName: "", aliasName: "", employeeName: "", presentAddress: "", homeCountryAddress: "", foreman: "", mobileNo: "8077389869", dateOfBirth: new Date(), age: 0, aadhaarNo: "", joiningDate: new Date(), resignDate: null, licenseNo: "UP2009", issueDate: new Date(), issuedBy: "", validUpto: new Date(), panNo: "", pfUanNo: "", accountHolderName: "", bankName: "", bankBranch: "", bankAccountNo: "", ifscCode: "", foremanName: "", emergencyContactName: "", emergencyContactNo: "", allowMobileLogin: false, blackList: false, attachFile: "" },
  ]);

  // Calculate age from date of birth
  const calculateAge = (dob: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const handleDateOfBirthChange = (date: Date | undefined) => {
    if (date) {
      setDateOfBirth(date);
      setAge(calculateAge(date));
    }
  };

  // Generate driver code
  const generateDriverCode = (): string => {
    const count = savedRecords.length + 1;
    return `A${String(count).padStart(4, '0')}`;
  };

  // Reset form
  const resetForm = (): void => {
    setDriverCode(generateDriverCode());
    setActive(true);
    setType("");
    setDriverName("");
    setFathersName("");
    setAliasName("");
    setEmployeeName("");
    setPresentAddress("");
    setHomeCountryAddress("");
    setForeman("");
    setMobileNo("");
    setDateOfBirth(new Date());
    setAge(0);
    setAadhaarNo("");
    setJoiningDate(new Date());
    setResignDate(null);
    setLicenseNo("");
    setIssueDate(new Date());
    setIssuedBy("");
    setValidUpto(new Date());
    setPanNo("");
    setPfUanNo("");
    setAccountHolderName("");
    setBankName("");
    setBankBranch("");
    setBankAccountNo("");
    setIfscCode("");
    setForemanName("");
    setEmergencyContactName("");
    setEmergencyContactNo("");
    setAllowMobileLogin(false);
    setBlackList(false);
    setAttachFile("");
    setEditId(null);
  };

  const handleSave = (): void => {
    if (!driverName.trim()) {
      alert("Please enter Driver Name");
      return;
    }
    if (!fathersName.trim()) {
      alert("Please enter Father's Name");
      return;
    }
    if (!presentAddress.trim()) {
      alert("Please enter Present Address");
      return;
    }
    if (!mobileNo.trim()) {
      alert("Please enter Mobile Number");
      return;
    }
    if (!licenseNo.trim()) {
      alert("Please enter License Number");
      return;
    }

    const newRecord: DriverRecord = {
      id: editId || Date.now(),
      driverCode,
      active,
      type,
      driverName,
      fathersName,
      aliasName,
      employeeName,
      presentAddress,
      homeCountryAddress,
      foreman,
      mobileNo,
      dateOfBirth,
      age,
      aadhaarNo,
      joiningDate,
      resignDate,
      licenseNo,
      issueDate,
      issuedBy,
      validUpto,
      panNo,
      pfUanNo,
      accountHolderName,
      bankName,
      bankBranch,
      bankAccountNo,
      ifscCode,
      foremanName,
      emergencyContactName,
      emergencyContactNo,
      allowMobileLogin,
      blackList,
      attachFile,
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

  const handleEdit = (record: DriverRecord): void => {
    setEditId(record.id);
    setDriverCode(record.driverCode);
    setActive(record.active);
    setType(record.type);
    setDriverName(record.driverName);
    setFathersName(record.fathersName);
    setAliasName(record.aliasName);
    setEmployeeName(record.employeeName);
    setPresentAddress(record.presentAddress);
    setHomeCountryAddress(record.homeCountryAddress);
    setForeman(record.foreman);
    setMobileNo(record.mobileNo);
    setDateOfBirth(record.dateOfBirth);
    setAge(record.age);
    setAadhaarNo(record.aadhaarNo);
    setJoiningDate(record.joiningDate);
    setResignDate(record.resignDate);
    setLicenseNo(record.licenseNo);
    setIssueDate(record.issueDate);
    setIssuedBy(record.issuedBy);
    setValidUpto(record.validUpto);
    setPanNo(record.panNo);
    setPfUanNo(record.pfUanNo);
    setAccountHolderName(record.accountHolderName);
    setBankName(record.bankName);
    setBankBranch(record.bankBranch);
    setBankAccountNo(record.bankAccountNo);
    setIfscCode(record.ifscCode);
    setForemanName(record.foremanName);
    setEmergencyContactName(record.emergencyContactName);
    setEmergencyContactNo(record.emergencyContactNo);
    setAllowMobileLogin(record.allowMobileLogin);
    setBlackList(record.blackList);
    setAttachFile(record.attachFile);
    setActiveTab("entry");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setSavedRecords(savedRecords.filter(record => record.id !== id));
      alert("Record deleted successfully!");
    }
  };

  // Due Alert Functions
  const handleDueAlertSetup = (driver: DriverRecord) => {
    setSelectedDriver(driver);
    setDueAlerts([]);
    setEditDueAlertId(null);
    resetDueAlertForm();
    setIsDueAlertModalOpen(true);
  };

  const addDueAlert = () => {
    if (!dueAlertParticular) {
      alert("Please enter Particular");
      return;
    }
    const newAlert: DueAlert = {
      id: editDueAlertId || Date.now(),
      particular: dueAlertParticular,
      validity: dueAlertValidity,
      validUpto: dueAlertValidUpto,
      alertDays: dueAlertDays,
      intervalDays: dueAlertIntervalDays,
      smsTo: dueAlertSmsTo,
      emailTo: dueAlertEmailTo,
      remarks: dueAlertRemarks,
      alertRemarks: dueAlertAlertRemarks,
      document: dueAlertDocument,
    };
    if (editDueAlertId) {
      setDueAlerts(dueAlerts.map(alert => alert.id === editDueAlertId ? newAlert : alert));
      setEditDueAlertId(null);
    } else {
      setDueAlerts([...dueAlerts, newAlert]);
    }
    resetDueAlertForm();
  };

  const editDueAlert = (alert: DueAlert) => {
    setEditDueAlertId(alert.id);
    setDueAlertParticular(alert.particular);
    setDueAlertValidity(alert.validity);
    setDueAlertValidUpto(alert.validUpto);
    setDueAlertDays(alert.alertDays);
    setDueAlertIntervalDays(alert.intervalDays);
    setDueAlertSmsTo(alert.smsTo);
    setDueAlertEmailTo(alert.emailTo);
    setDueAlertRemarks(alert.remarks);
    setDueAlertAlertRemarks(alert.alertRemarks);
    setDueAlertDocument(alert.document);
  };

  const removeDueAlert = (id: number) => {
    setDueAlerts(dueAlerts.filter(alert => alert.id !== id));
  };

  const resetDueAlertForm = () => {
    setDueAlertParticular("");
    setDueAlertValidity("");
    setDueAlertValidUpto(new Date());
    setDueAlertDays(0);
    setDueAlertIntervalDays(0);
    setDueAlertSmsTo("");
    setDueAlertEmailTo("");
    setDueAlertRemarks("");
    setDueAlertAlertRemarks("");
    setDueAlertDocument("");
  };

  // Vehicle Functions
  const handleAddVehicle = (driver: DriverRecord) => {
    setSelectedDriver(driver);
    setVehicles([]);
    setVehicleFromDate(new Date());
    setVehicleNo("");
    setIsVehicleModalOpen(true);
  };

  const addVehicle = () => {
    if (!vehicleNo) {
      alert("Please enter Vehicle Number");
      return;
    }
    const newVehicle: VehicleAssignment = {
      id: Date.now(),
      fromDate: vehicleFromDate,
      vehicleNo: vehicleNo,
    };
    setVehicles([...vehicles, newVehicle]);
    setVehicleFromDate(new Date());
    setVehicleNo("");
  };

  const removeVehicle = (id: number) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  // Bank Details Functions
  const handleAddBankDetails = (driver: DriverRecord) => {
    setSelectedDriver(driver);
    setBankDetails([]);
    setEditBankId(null);
    resetBankForm();
    setIsBankModalOpen(true);
  };

  const addBankDetail = () => {
    if (!bankNameField) {
      alert("Please enter Bank Name");
      return;
    }
    if (!accountNoField) {
      alert("Please enter Account Number");
      return;
    }
    const newBank: BankDetail = {
      id: editBankId || Date.now(),
      bankName: bankNameField,
      bankBranch: bankBranchField,
      accountType: accountType,
      accountHolderName: accountHolderNameField,
      accountNo: accountNoField,
      ifscCode: ifscCodeField,
      isActive: isActiveBank,
      isPrimary: isPrimaryBank,
      chequeImage: chequeImage,
    };
    if (editBankId) {
      setBankDetails(bankDetails.map(bank => bank.id === editBankId ? newBank : bank));
      setEditBankId(null);
    } else {
      setBankDetails([...bankDetails, newBank]);
    }
    resetBankForm();
  };

  const editBankDetail = (bank: BankDetail) => {
    setEditBankId(bank.id);
    setBankNameField(bank.bankName);
    setBankBranchField(bank.bankBranch);
    setAccountType(bank.accountType);
    setAccountHolderNameField(bank.accountHolderName);
    setAccountNoField(bank.accountNo);
    setIfscCodeField(bank.ifscCode);
    setIsActiveBank(bank.isActive);
    setIsPrimaryBank(bank.isPrimary);
    setChequeImage(bank.chequeImage);
  };

  const removeBankDetail = (id: number) => {
    setBankDetails(bankDetails.filter(bank => bank.id !== id));
  };

  const resetBankForm = () => {
    setBankNameField("");
    setBankBranchField("");
    setAccountType("Saving");
    setAccountHolderNameField("");
    setAccountNoField("");
    setIfscCodeField("");
    setIsActiveBank(false);
    setIsPrimaryBank(false);
    setChequeImage("");
  };

  // Search functions
  const getSearchResults = (): DriverRecord[] => {
    let results = [...savedRecords];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(r => 
        r.driverCode.toLowerCase().includes(term) ||
        r.driverName.toLowerCase().includes(term) ||
        r.mobileNo.includes(term)
      );
    }
    return results;
  };

  const searchResults = getSearchResults();
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-4 p-3 md:p-4">
      {/* Header */}
      <div className="border-b pb-3">
        <h1 className="text-base md:text-lg font-bold">DRIVER MASTER</h1>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-muted-foreground">
          <span>Company : GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
          <span>Login By : MAYANK.GRLOGISTICS@GMAIL.COM</span>
          <span>Login Branch : CORPORATE OFFICE</span>
          <span>Financial Year : 2026-2027</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button onClick={() => { setActiveTab("search"); setCurrentPage(1); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "search" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Search</button>
        <button onClick={() => { setActiveTab("entry"); resetForm(); }} className={cn("px-4 py-2 text-sm font-medium transition-all", activeTab === "entry" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground")}>Entry</button>
      </div>

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search by Driver Code, Name or Mobile..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-8 text-xs" />
            </div>
            <Button onClick={() => setCurrentPage(1)} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3.5 w-3.5" />CLEAR</Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[1400px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">S#</TableHead>
                    <TableHead className="min-w-[100px]">Driver Code</TableHead>
                    <TableHead className="min-w-[150px]">Driver Name</TableHead>
                    <TableHead className="min-w-[80px]">Type</TableHead>
                    <TableHead className="min-w-[100px]">Alias Name</TableHead>
                    <TableHead className="min-w-[120px]">Father Name</TableHead>
                    <TableHead className="min-w-[100px]">Mobile No.</TableHead>
                    <TableHead className="min-w-[120px]">Aadhaar No.</TableHead>
                    <TableHead className="min-w-[100px]">Foreman</TableHead>
                    <TableHead className="min-w-[100px]">License #</TableHead>
                    <TableHead className="min-w-[90px]">Issue Date</TableHead>
                    <TableHead className="min-w-[90px]">Valid UpTo</TableHead>
                    <TableHead className="min-w-[90px]">Joining Date</TableHead>
                    <TableHead className="min-w-[90px]">Resign Date</TableHead>
                    <TableHead className="min-w-[150px]">Address</TableHead>
                    <TableHead className="min-w-[100px] text-center">Status</TableHead>
                    <TableHead className="min-w-[80px] text-center">Options</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow><TableCell colSpan={17} className="text-center py-8">No records found</TableCell></TableRow>
                  ) : (
                    paginatedResults.map((record, idx) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell className="text-center">{(currentPage-1)*itemsPerPage+idx+1}</TableCell>
                        <TableCell className="font-mono font-medium">{record.driverCode}</TableCell>
                        <TableCell>{record.driverName}</TableCell>
                        <TableCell>{record.type || "-"}</TableCell>
                        <TableCell>{record.aliasName || "-"}</TableCell>
                        <TableCell>{record.fathersName || "-"}</TableCell>
                        <TableCell>{record.mobileNo}</TableCell>
                        <TableCell>{record.aadhaarNo || "-"}</TableCell>
                        <TableCell>{record.foreman || "-"}</TableCell>
                        <TableCell>{record.licenseNo || "-"}</TableCell>
                        <TableCell>{record.issueDate ? format(record.issueDate, "dd-MM-yyyy") : "-"}</TableCell>
                        <TableCell>{record.validUpto ? format(record.validUpto, "dd-MM-yyyy") : "-"}</TableCell>
                        <TableCell>{record.joiningDate ? format(record.joiningDate, "dd-MM-yyyy") : "-"}</TableCell>
                        <TableCell>{record.resignDate ? format(record.resignDate, "dd-MM-yyyy") : "-"}</TableCell>
                        <TableCell>{record.presentAddress || "-"}</TableCell>
                        <TableCell className="text-center">
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px]", record.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                            {record.active ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => handleEdit(record)} className="cursor-pointer">
                                <Edit className="mr-2 h-3.5 w-3.5" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDueAlertSetup(record)} className="cursor-pointer">
                                <AlertCircle className="mr-2 h-3.5 w-3.5" /> Due Alert Setup
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAddVehicle(record)} className="cursor-pointer">
                                <Car className="mr-2 h-3.5 w-3.5" /> Add Vehicle
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {}} className="cursor-pointer">
                                <FileText className="mr-2 h-3.5 w-3.5" /> Check List Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAddBankDetails(record)} className="cursor-pointer">
                                <Banknote className="mr-2 h-3.5 w-3.5" /> Add Bank Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(record.id)} className="cursor-pointer text-red-600">
                                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center gap-1">
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1} className="h-7 text-xs">Previous</Button>
              <span className="px-3 py-1 text-xs">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages} className="h-7 text-xs">Next</Button>
            </div>
          )}
        </div>
      )}

      {/* Entry Tab */}
      {activeTab === "entry" && (
        <div className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Driver Code</Label><Input value={driverCode} readOnly className="h-8 text-xs bg-muted" /></div>
            <div className="flex items-end"><div className="flex items-center gap-2"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">Active</Label></div></div>
            <div className="space-y-1"><Label className="text-xs">Type</Label><Select value={type} onValueChange={setType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="SELECT" /></SelectTrigger><SelectContent>{driverTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-xs">Driver Name <span className="text-red-500">*</span></Label><Input value={driverName} onChange={(e) => setDriverName(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Father's Name <span className="text-red-500">*</span></Label><Input value={fathersName} onChange={(e) => setFathersName(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Alias Name</Label><Input value={aliasName} onChange={(e) => setAliasName(e.target.value)} className="h-8 text-xs" /></div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-xs">Employee Name</Label><Input value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Present Address <span className="text-red-500">*</span></Label><Input value={presentAddress} onChange={(e) => setPresentAddress(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Home Country Address</Label><Input value={homeCountryAddress} onChange={(e) => setHomeCountryAddress(e.target.value)} className="h-8 text-xs" /></div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Foreman</Label><Input value={foreman} onChange={(e) => setForeman(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Mobile # <span className="text-red-500">*</span></Label><Input value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Date Of Birth <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 w-full justify-start text-left text-xs">
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {format(dateOfBirth, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateOfBirth} onSelect={handleDateOfBirthChange} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1"><Label className="text-xs">Age</Label><Input value={age} readOnly className="h-8 text-xs bg-muted" /></div>
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Aadhaar #</Label><Input value={aadhaarNo} onChange={(e) => setAadhaarNo(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Joining Date <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 w-full justify-start text-left text-xs">
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {format(joiningDate, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={joiningDate} onSelect={(date) => date && setJoiningDate(date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1"><Label className="text-xs">Resign Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 w-full justify-start text-left text-xs">
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {resignDate ? format(resignDate, "dd-MM-yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={resignDate || undefined} onSelect={(date) => setResignDate(date || null)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Row 6 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">License # <span className="text-red-500">*</span></Label><Input value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Issue Date <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 w-full justify-start text-left text-xs">
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {format(issueDate, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={issueDate} onSelect={(date) => date && setIssueDate(date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1"><Label className="text-xs">Issued By <span className="text-red-500">*</span></Label><Input value={issuedBy} onChange={(e) => setIssuedBy(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Valid Upto <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 w-full justify-start text-left text-xs">
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {format(validUpto, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={validUpto} onSelect={(date) => date && setValidUpto(date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Row 7 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">PAN #</Label><Input value={panNo} onChange={(e) => setPanNo(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">PF / UAN #</Label><Input value={pfUanNo} onChange={(e) => setPfUanNo(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Account Holder Name</Label><Input value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Bank Name</Label><Input value={bankName} onChange={(e) => setBankName(e.target.value)} className="h-8 text-xs" /></div>
          </div>

          {/* Row 8 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1"><Label className="text-xs">Bank Branch</Label><Input value={bankBranch} onChange={(e) => setBankBranch(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Bank Account No</Label><Input value={bankAccountNo} onChange={(e) => setBankAccountNo(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">IFSC Code</Label><Input value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} className="h-8 text-xs uppercase" /></div>
            <div className="space-y-1"><Label className="text-xs">Foreman Name</Label><Input value={foremanName} onChange={(e) => setForemanName(e.target.value)} className="h-8 text-xs" /></div>
          </div>

          {/* Row 9 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Emergency Contact Name</Label><Input value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} className="h-8 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs">Emergency Contact #</Label><Input value={emergencyContactNo} onChange={(e) => setEmergencyContactNo(e.target.value)} className="h-8 text-xs" /></div>
          </div>

          {/* Row 10 */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2"><input type="checkbox" checked={allowMobileLogin} onChange={(e) => setAllowMobileLogin(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">Allow Mobile Login</Label></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={blackList} onChange={(e) => setBlackList(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs cursor-pointer">Black List</Label></div>
          </div>

          {/* Attach File */}
          <div className="space-y-1"><Label className="text-xs">Attach File</Label><Input type="file" onChange={(e) => e.target.files && setAttachFile(e.target.files[0].name)} className="h-8 text-xs file:h-7 file:text-xs" /></div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={handleSave} size="sm" className="h-8 text-xs"><Save className="mr-1 h-3 w-3" />{editId ? "UPDATE" : "SAVE"}</Button>
            <Button onClick={resetForm} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="mr-1 h-3 w-3" />CLEAR</Button>
          </div>
        </div>
      )}

      {/* Due Alert Setup Modal */}
      <Dialog open={isDueAlertModalOpen} onOpenChange={setIsDueAlertModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-6xl max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-4 pt-4 pb-2 border-b">
            <DialogTitle>Due Alert Setup - {selectedDriver?.driverName}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto px-4 py-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div><Label className="text-xs">Particular</Label><Input value={dueAlertParticular} onChange={(e) => setDueAlertParticular(e.target.value)} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Validity</Label><Input value={dueAlertValidity} onChange={(e) => setDueAlertValidity(e.target.value)} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Valid Upto</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-8 w-full text-xs">
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {format(dueAlertValidUpto, "dd-MM-yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dueAlertValidUpto} onSelect={(date) => date && setDueAlertValidUpto(date)} />
                  </PopoverContent>
                </Popover>
              </div>
              <div><Label className="text-xs">Alert Days</Label><Input type="number" value={dueAlertDays} onChange={(e) => setDueAlertDays(Number(e.target.value))} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Interval Days</Label><Input type="number" value={dueAlertIntervalDays} onChange={(e) => setDueAlertIntervalDays(Number(e.target.value))} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">SMS To</Label><Input value={dueAlertSmsTo} onChange={(e) => setDueAlertSmsTo(e.target.value)} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Email To</Label><Input value={dueAlertEmailTo} onChange={(e) => setDueAlertEmailTo(e.target.value)} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Remarks</Label><Input value={dueAlertRemarks} onChange={(e) => setDueAlertRemarks(e.target.value)} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Alert Remarks</Label><Input value={dueAlertAlertRemarks} onChange={(e) => setDueAlertAlertRemarks(e.target.value)} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Upload Document</Label><Input type="file" className="h-8 text-xs file:h-7" /></div>
              <div className="flex items-end"><Button onClick={addDueAlert} size="sm" className="h-8 text-xs"><Plus className="mr-1 h-3 w-3" />ADD</Button></div>
            </div>
            <div className="rounded-md border overflow-x-auto">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>S#</TableHead><TableHead>Particular</TableHead><TableHead>Validity</TableHead><TableHead>Valid Upto</TableHead>
                    <TableHead>Alert Days</TableHead><TableHead>Interval Days</TableHead><TableHead>SMS To</TableHead><TableHead>Email To</TableHead>
                    <TableHead>Remarks</TableHead><TableHead>Alert Remarks</TableHead><TableHead>Document</TableHead><TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dueAlerts.length === 0 ? (
                    <TableRow><TableCell colSpan={12} className="text-center py-8">No alerts added</TableCell></TableRow>
                  ) : (
                    dueAlerts.map((alert, idx) => (
                      <TableRow key={alert.id}>
                        <TableCell>{idx+1}</TableCell>
                        <TableCell>{alert.particular}</TableCell>
                        <TableCell>{alert.validity}</TableCell>
                        <TableCell>{format(alert.validUpto, "dd-MM-yyyy")}</TableCell>
                        <TableCell>{alert.alertDays}</TableCell>
                        <TableCell>{alert.intervalDays}</TableCell>
                        <TableCell>{alert.smsTo}</TableCell>
                        <TableCell>{alert.emailTo}</TableCell>
                        <TableCell>{alert.remarks}</TableCell>
                        <TableCell>{alert.alertRemarks}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => editDueAlert(alert)} className="h-6 w-6 p-0 text-blue-500"><Edit className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => removeDueAlert(alert.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end mt-3"><Button size="sm" className="h-7 text-xs"><Plus className="mr-1 h-3 w-3" />ADD MORE</Button></div>
          </div>
          <DialogFooter className="px-4 py-3 border-t"><Button variant="outline" size="sm" onClick={() => setIsDueAlertModalOpen(false)}>CLOSE</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Vehicle Modal */}
      <Dialog open={isVehicleModalOpen} onOpenChange={setIsVehicleModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Vehicle - {selectedDriver?.driverName}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 w-full text-xs">
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {format(vehicleFromDate, "dd-MM-yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={vehicleFromDate} onSelect={(date) => date && setVehicleFromDate(date)} />
                </PopoverContent>
              </Popover>
            </div>
            <div><Label className="text-xs">Vehicle #</Label><Input value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} className="h-8 text-xs" /></div>
            <Button onClick={addVehicle} size="sm" className="h-8 text-xs"><Plus className="mr-1 h-3 w-3" />ADD VEHICLE</Button>
            <div className="border rounded-md max-h-40 overflow-auto">
              <Table className="text-xs">
                <TableHeader><TableRow><TableHead>From Date</TableHead><TableHead>Vehicle #</TableHead><TableHead>Action</TableHead></TableRow></TableHeader>
                <TableBody>
                  {vehicles.map(v => (
                    <TableRow key={v.id}>
                      <TableCell>{format(v.fromDate, "dd-MM-yyyy")}</TableCell>
                      <TableCell>{v.vehicleNo}</TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => removeVehicle(v.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter className="gap-2 mt-3"><Button variant="outline" size="sm" onClick={() => setIsVehicleModalOpen(false)}>CLOSE</Button><Button size="sm" onClick={() => setIsVehicleModalOpen(false)}>SAVE</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Bank Details Modal */}
      <Dialog open={isBankModalOpen} onOpenChange={setIsBankModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-5xl max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-4 pt-4 pb-2 border-b"><DialogTitle>Bank Details - {selectedDriver?.driverName}</DialogTitle></DialogHeader>
          <div className="flex-1 overflow-auto px-4 py-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div><Label className="text-xs">Bank Name</Label><Input value={bankNameField} onChange={(e) => setBankNameField(e.target.value)} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Bank Branch</Label><Input value={bankBranchField} onChange={(e) => setBankBranchField(e.target.value)} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Account Type</Label><Select value={accountType} onValueChange={setAccountType}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{accountTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
              <div><Label className="text-xs">A/C Holder Name</Label><Input value={accountHolderNameField} onChange={(e) => setAccountHolderNameField(e.target.value)} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">Account No</Label><Input value={accountNoField} onChange={(e) => setAccountNoField(e.target.value)} className="h-8 text-xs" /></div>
              <div><Label className="text-xs">IFSC Code</Label><Input value={ifscCodeField} onChange={(e) => setIfscCodeField(e.target.value)} className="h-8 text-xs uppercase" /></div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1"><input type="checkbox" checked={isActiveBank} onChange={(e) => setIsActiveBank(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs">Is Active</Label></div>
                <div className="flex items-center gap-1"><input type="checkbox" checked={isPrimaryBank} onChange={(e) => setIsPrimaryBank(e.target.checked)} className="h-3.5 w-3.5" /><Label className="text-xs">Is Primary</Label></div>
              </div>
              <div><Label className="text-xs">Cheque Image</Label><Input type="file" className="h-8 text-xs file:h-7" /></div>
              <div className="flex items-end"><Button onClick={addBankDetail} size="sm" className="h-8 text-xs"><Plus className="mr-1 h-3 w-3" />ADD</Button></div>
            </div>
            <div className="rounded-md border overflow-x-auto">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>S#</TableHead><TableHead>Bank Name</TableHead><TableHead>Bank Branch</TableHead><TableHead>Account Type</TableHead>
                    <TableHead>A/C Holder Name</TableHead><TableHead>Account No</TableHead><TableHead>IFSC Code</TableHead>
                    <TableHead>Is Active</TableHead><TableHead>Is Primary</TableHead><TableHead>Cheque Image</TableHead><TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankDetails.length === 0 ? (
                    <TableRow><TableCell colSpan={11} className="text-center py-8">No bank details added</TableCell></TableRow>
                  ) : (
                    bankDetails.map((bank, idx) => (
                      <TableRow key={bank.id}>
                        <TableCell>{idx+1}</TableCell>
                        <TableCell>{bank.bankName}</TableCell>
                        <TableCell>{bank.bankBranch}</TableCell>
                        <TableCell>{bank.accountType}</TableCell>
                        <TableCell>{bank.accountHolderName}</TableCell>
                        <TableCell>{bank.accountNo}</TableCell>
                        <TableCell>{bank.ifscCode}</TableCell>
                        <TableCell><input type="checkbox" checked={bank.isActive} readOnly className="h-3 w-3" /></TableCell>
                        <TableCell><input type="checkbox" checked={bank.isPrimary} readOnly className="h-3 w-3" /></TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => editBankDetail(bank)} className="h-6 w-6 p-0 text-blue-500"><Edit className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => removeBankDetail(bank.id)} className="h-6 w-6 p-0 text-red-500"><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end mt-3"><Button size="sm" className="h-7 text-xs"><Plus className="mr-1 h-3 w-3" />ADD MORE</Button></div>
          </div>
          <DialogFooter className="px-4 py-3 border-t gap-2"><Button variant="outline" size="sm" onClick={() => setIsBankModalOpen(false)}>CLOSE</Button><Button size="sm" onClick={() => setIsBankModalOpen(false)}>SAVE</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}