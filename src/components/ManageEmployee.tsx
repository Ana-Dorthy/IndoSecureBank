//modified by prasanna-11/07/25
import React, { useState } from 'react';
import { Bank, Branch, Employee } from '../types';

interface ManageEmployeeProps {
  banks: Bank[];
  branches: Branch[];
  employees: Employee[];
  onAddEmployee: (employee: Omit<Employee, 'id' | 'createdAt'>) => void;
  onUpdateEmployee: (id: string, employee: Omit<Employee, 'id' | 'createdAt'>) => void;
  onDeleteEmployee: (id: string) => void;
}

export default function ManageEmployee({
  banks,
  branches,
  employees,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
}: ManageEmployeeProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bankId: '',
    branchId: '',
    role: '',
    employeeId: '',
    hireDate: '',
    salary: 0,
    address: '',
    gender: '',
    dateOfBirth: '',
    maritalStatus: '',
    nationality: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const filteredBranches = branches.filter(b => b.bankId === formData.bankId);

  function validateForm() {
    const errors: { [k: string]: string } = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Phone must be 10 digits';
    }
    if (!formData.bankId)      errors.bankId      = 'Bank is required';
    if (!formData.branchId)    errors.branchId    = 'Branch is required';
    if (!formData.role)        errors.role        = 'Role is required';
    if (!formData.employeeId)  errors.employeeId  = 'Employee ID is required';
    if (!formData.hireDate)    errors.hireDate    = 'Hire date is required';
    if (!formData.gender)      errors.gender      = 'Gender is required';
    if (!formData.maritalStatus) errors.maritalStatus = 'Marital status is required';
    if (!formData.nationality.trim()) errors.nationality = 'Nationality is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function resetForm() {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bankId: '',
      branchId: '',
      role: '',
      employeeId: '',
      hireDate: '',
      salary: 0,
      address: '',
      gender: '',
      dateOfBirth: '',
      maritalStatus: '',
      nationality: '',
    });
    setFormErrors({});
    setIsFormOpen(false);
    setEditingEmployee(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    const payload = { ...formData };
    if (editingEmployee) {
      onUpdateEmployee(editingEmployee.id, payload);
    } else {
      onAddEmployee(payload);
    }
    resetForm();
  }

  function handleEdit(emp: Employee) {
    setEditingEmployee(emp);
    setFormData({
      ...emp,
      salary: emp.salary || 0,
      address: emp.address || '',
      gender: emp.gender || '',
      dateOfBirth: emp.dateOfBirth || '',
      maritalStatus: emp.maritalStatus || '',
      nationality: emp.nationality || '',
    });
    setIsFormOpen(true);
  }

  function handleBankChange(bankId: string) {
    setFormData({ ...formData, bankId, branchId: '' });
  }

  const renderError = (field: string) =>
    formErrors[field] && <p className="text-red-600 text-sm mt-1">{formErrors[field]}</p>;

  const getBankName   = (id: string) => banks.find(b => b.id === id)?.name   || 'Unknown Bank';
  const getBranchName = (id: string) => branches.find(b => b.id === id)?.name || 'Unknown Branch';

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Employees</h2>
        { !isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Add Employee
          </button>
        ) }
      </div>

      {/* Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-lg mb-6"
        >
          {[
            { label: 'First Name', key: 'firstName', type: 'text', placeholder: 'John' },
            { label: 'Last Name',  key: 'lastName',  type: 'text', placeholder: 'Doe'  },
            { label: 'Email',      key: 'email',     type: 'email', placeholder: 'name@domain.com' },
            { label: 'Phone',      key: 'phone',     type: 'tel',   placeholder: '1234567890' },
            { label: 'Employee ID',key: 'employeeId',type: 'text',  placeholder: 'EMP12345' },
            { label: 'Hire Date',  key: 'hireDate',  type: 'date' },
            { label: 'Salary',     key: 'salary',    type: 'number', placeholder: '50000', min: 0 },
            { label: 'Address',    key: 'address',   type: 'text',  placeholder: '123 Main St' },
            { label: 'DOB',        key: 'dateOfBirth', type: 'date' },
            { label: 'Nationality',key: 'nationality',type: 'text', placeholder: 'American' },
          ].map(({ label, key, type, ...rest }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                value={(formData as any)[key]}
                placeholder={(rest as any).placeholder || ''}
                min={(rest as any).min}
                onChange={e => {
                  const val = type === 'number' ? +e.target.value : e.target.value;
                  setFormData({ ...formData, [key]: val });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              {renderError(key)}
            </div>
          ))}

        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={formData.gender}
              onChange={e => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            {renderError('gender')}
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
            <select
              value={formData.maritalStatus}
              onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select status</option>
              <option>Single</option>
              <option>Married</option>
              <option>Divorced</option>
              <option>Widowed</option>
            </select>
            {renderError('maritalStatus')}
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select role</option>
              <option>Manager</option>
              <option>Cashier</option>
              <option>Loan Officer</option>
              <option>IT Support</option>
            </select>
            {renderError('role')}
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
            <select
              value={formData.bankId}
              onChange={e => handleBankChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select a bank</option>
              {banks.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            {renderError('bankId')}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <select
              value={formData.branchId}
              disabled={!formData.bankId}
              onChange={e => setFormData({ ...formData, branchId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select a branch</option>
              {filteredBranches.map(br => (
                <option key={br.id} value={br.id}>{br.name}</option>
              ))}
            </select>
            {renderError('branchId')}
          </div>

          
          <div className="md:col-span-2 flex gap-3 mt-4">
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              {editingEmployee ? 'Update Employee' : 'Add Employee'}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      )}

      
      <div className="space-y-4">
        {employees.length === 0 ? (
          <p className="text-center text-gray-500">No employees added yet.</p>
        ) : (
          employees.map(emp => (
            <div key={emp.id} className="p-4 border rounded bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold">{emp.firstName} {emp.lastName}</h3>
                  <p className="text-sm">ID: {emp.employeeId}</p>
                  <p className="text-sm">Email: {emp.email}</p>
                  <p className="text-sm">Phone: {emp.phone}</p>
                  <p className="text-sm">Role: {emp.role}</p>
                  <p className="text-sm">Gender: {emp.gender}</p>
                  <p className="text-sm">Nationality: {emp.nationality}</p>
                  <p className="text-sm">Bank: {getBankName(emp.bankId)}</p>
                  <p className="text-sm">Branch: {getBranchName(emp.branchId)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(emp)} className="text-indigo-600 underline">Edit</button>
                  <button onClick={() => onDeleteEmployee(emp.id)} className="text-red-600 underline">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
