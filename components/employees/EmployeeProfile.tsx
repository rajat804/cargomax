// components/employees/EmployeeProfile.tsx
'use client';

import { Employee } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Mail, Phone, Calendar, Briefcase, MapPin, 
  User, Heart, FileText, Edit 
} from 'lucide-react';

interface EmployeeProfileProps {
  employee: Employee;
  onEdit?: () => void;
}

export default function EmployeeProfile({ employee, onEdit }: EmployeeProfileProps) {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex gap-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {employee.firstName[0]}{employee.lastName[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {employee.firstName} {employee.lastName}
                </h1>
                <p className="text-gray-600 mt-1">{employee.designation}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="success">{employee.employmentStatus}</Badge>
                  <Badge variant="info">{employee.employmentType}</Badge>
                </div>
              </div>
            </div>
            <Button onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Personal Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Employee ID:</span>
              <span className="font-medium">{employee.employeeId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span>{employee.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span>{employee.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date of Birth:</span>
              <span>{new Date(employee.dateOfBirth).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gender:</span>
              <span>{employee.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Marital Status:</span>
              <span>{employee.maritalStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nationality:</span>
              <span>{employee.nationality}</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Employment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Department:</span>
              <span className="font-medium">{employee.departmentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Designation:</span>
              <span>{employee.designation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hire Date:</span>
              <span>{new Date(employee.hireDate).toLocaleDateString()}</span>
            </div>
            {employee.confirmationDate && (
              <div className="flex justify-between">
                <span className="text-gray-600">Confirmation Date:</span>
                <span>{new Date(employee.confirmationDate).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Employment Type:</span>
              <span>{employee.employmentType}</span>
            </div>
            {employee.managerName && (
              <div className="flex justify-between">
                <span className="text-gray-600">Reporting Manager:</span>
                <span>{employee.managerName}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Address & Emergency Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {employee.address && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{employee.address.street}</p>
              <p>{employee.address.city}, {employee.address.state} {employee.address.zipCode}</p>
              <p>{employee.address.country}</p>
            </CardContent>
          </Card>
        )}
        
        {employee.emergencyContact && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span>{employee.emergencyContact.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Relationship:</span>
                <span>{employee.emergencyContact.relationship}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span>{employee.emergencyContact.phone}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}