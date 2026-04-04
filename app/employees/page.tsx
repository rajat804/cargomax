// app/employees/page.tsx
'use client';

import { useState } from 'react';
import { employees } from '@/lib/mockData';
import { Employee } from '@/types';
import EmployeeTable from '@/components/employees/EmployeeTable';
import EmployeeForm from '@/components/employees/EmployeeForm';

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const filteredEmployees = employees.filter(emp => 
    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowAddModal(true);
  };
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      console.log('Delete employee:', id);
    }
  };
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <p className="text-gray-600 mt-1">Manage all employee records</p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Add Button */}
      <div className="mb-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Employee
        </button>
      </div>
      
      {/* Employee Table */}
      <div className="bg-white rounded-lg border">
        <EmployeeTable 
          employees={filteredEmployees}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      
      {/* Modal */}
      {showAddModal && (
        <EmployeeForm 
          onClose={() => {
            setShowAddModal(false);
            setSelectedEmployee(null);
          }}
          employee={selectedEmployee || undefined}
        />
      )}
    </div>
  );
}