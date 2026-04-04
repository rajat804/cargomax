// components/employees/EmployeeTable.tsx
'use client';

import { Employee } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit?: (employee: Employee) => void;
  onDelete?: (id: string) => void;
}

export default function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'success';
      case 'On Leave': return 'warning';
      case 'Terminated': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Employee ID</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Department</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Designation</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 text-sm font-medium text-gray-900">{employee.employeeId}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {employee.firstName[0]}{employee.lastName[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{employee.firstName} {employee.lastName}</p>
                    <p className="text-xs text-gray-500">{employee.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">{employee.departmentName}</td>
              <td className="py-3 px-4 text-sm text-gray-600">{employee.designation}</td>
              <td className="py-3 px-4">
                <Badge variant={getStatusColor(employee.employmentStatus)}>
                  {employee.employmentStatus}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Link href={`/employees/${employee.id}`}>
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </Link>
                  <button 
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    onClick={() => onEdit?.(employee)}
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    className="p-1 hover:bg-red-50 rounded transition-colors"
                    onClick={() => onDelete?.(employee.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}