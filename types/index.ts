// types/index.ts
export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  nationality: string;
  profilePicture?: string; // Optional is fine
  
  hireDate: string;
  confirmationDate?: string;
  terminationDate?: string;
  employmentStatus: 'Active' | 'On Leave' | 'Terminated' | 'Resigned' | 'Retired';
  employmentType: 'Permanent' | 'Contract' | 'Intern' | 'Temporary' | 'Consultant';
  
  departmentId: string;
  departmentName: string;
  designationId: string;
  designation: string;
  reportingTo?: string;
  managerName?: string;
  
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headId?: string;
  headName?: string;
  employeeCount: number;
  parentDeptId?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'ID Proof' | 'Contract' | 'Certificate' | 'Photo' | 'Other';
  fileUrl: string;
  fileSize: number;
  uploadDate: string;
  expiryDate?: string;
  employeeId: string;
  employeeName: string;
}

export interface LifecycleEvent {
  id: string;
  employeeId: string;
  employeeName: string;
  eventType: 'Hired' | 'Confirmed' | 'Promoted' | 'Transferred' | 'Resigned' | 'Terminated';
  eventDate: string;
  oldValue?: string;
  newValue?: string;
  remarks?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  departments: number;
  averageTenure: number;
  genderRatio: { male: number; female: number; other: number };
  employmentType: Record<string, number>;
  recentHires: number;
  upcomingBirthdays: number;
}