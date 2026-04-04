// app/departments/page.tsx
'use client';

import { useState } from 'react';
import { departments, employees } from '@/lib/mockData';
import { Building2, Users, Edit, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';

export default function DepartmentsPage() {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const getDepartmentEmployees = (deptId: string) => {
    return employees.filter(emp => emp.departmentId === deptId);
  };
  
  const getStatusColor = (count: number) => {
    if (count > 30) return 'text-green-600 bg-green-50';
    if (count > 10) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">Manage departments and designations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Departments</p>
              <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Dept Size</p>
              <p className="text-2xl font-bold text-gray-900">
                {(employees.length / departments.length).toFixed(0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Departments with Head</p>
              <p className="text-2xl font-bold text-gray-900">
                {departments.filter(d => d.headName).length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Building2 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const deptEmployees = getDepartmentEmployees(dept.id);
          const isExpanded = selectedDept === dept.id;
          const statusColor = getStatusColor(deptEmployees.length);
          
          return (
            <div key={dept.id} className="bg-white rounded-lg border hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Department Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{dept.name}</h3>
                      <p className="text-sm text-gray-500">{dept.code}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
                
                {/* Department Description */}
                <p className="text-sm text-gray-600 mb-4">{dept.description}</p>
                
                {/* Department Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Department Head:</span>
                    <span className="font-medium text-gray-900">
                      {dept.headName || 'Not assigned'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Employees:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                      {dept.employeeCount} employees
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Open Positions:</span>
                    <span className="text-gray-900">
                      {Math.floor(Math.random() * 5)} positions
                    </span>
                  </div>
                </div>
                
                {/* View Employees Button */}
                <button
                  onClick={() => setSelectedDept(isExpanded ? null : dept.id)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Hide Employees
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      View {dept.employeeCount} Employees
                    </>
                  )}
                </button>
                
                {/* Employee List (Expandable) */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {deptEmployees.slice(0, 5).map(emp => (
                        <div key={emp.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {emp.firstName[0]}{emp.lastName[0]}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {emp.firstName} {emp.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{emp.designation}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            emp.employmentStatus === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {emp.employmentStatus}
                          </span>
                        </div>
                      ))}
                      {deptEmployees.length > 5 && (
                        <p className="text-sm text-center text-gray-500 mt-2 pt-2 border-t border-gray-100">
                          +{deptEmployees.length - 5} more employees
                        </p>
                      )}
                      {deptEmployees.length === 0 && (
                        <p className="text-sm text-center text-gray-500 py-4">
                          No employees in this department
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Add New Department</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form className="p-6 space-y-4" onSubmit={(e) => {
              e.preventDefault();
              setShowAddModal(false);
            }}>
              <div>
                <label className="block text-sm font-medium mb-1">Department Name *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Information Technology"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Department Code *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., IT"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Department description..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Department Head</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Department Head</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} - {emp.designation}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Department
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}