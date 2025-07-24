//modified by prasanna-11/07/25
import React, { useState } from 'react';
import { Bank, Branch } from '../types';

interface ManageBranchProps {
  banks: Bank[];
  branches: Branch[];
  onAddBranch: (branch: Omit<Branch, 'id' | 'createdAt'>) => void;
  onUpdateBranch: (id: string, branch: Omit<Branch, 'id' | 'createdAt'>) => void;
  onDeleteBranch: (id: string) => void;
}

export default function ManageBranch({
  banks,
  branches,
  onAddBranch,
  onUpdateBranch,
  onDeleteBranch,
}: ManageBranchProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const [formData, setFormData] = useState({
    bankId: '',
    name: '',
    code: '',
    ifsc: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    manager: '',
    openingDate: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (name: string, value: string) => {
    let error = '';
    if (!value.trim()) {
      error = 'This field is required';
    } else {
      if (name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) error = 'Invalid email format';
      } else if (name === 'phone') {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value)) error = 'Phone must be 10 digits';
      } else if (name === 'pincode') {
        const pinRegex = /^[0-9]{6}$/;
        if (!pinRegex.test(value)) error = 'Pincode must be 6 digits';
      } else if (name === 'ifsc') {
        if (value.length > 11) error = 'IFSC must be 11 characters max';
      }
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (name: string, value: string) => {
    const fieldLimits: { [key: string]: number } = {
      name: 50,
      code: 10,
      ifsc: 11,
      address: 100,
      city: 50,
      state: 50,
      pincode: 6,
      phone: 10,
      email: 50,
      manager: 50,
    };

    if (['phone', 'pincode'].includes(name) && !/^\d*$/.test(value)) {
      return;
    }
    if (fieldLimits[name] && value.length > fieldLimits[name]) {
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const isDisabled = banks.length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all fields
    let hasError = false;
    Object.entries(formData).forEach(([key, val]) => {
      if (key !== 'isActive') {
        validateField(key, val as string);
        if (!(val as string).trim()) hasError = true;
      }
    });
    if (hasError || Object.values(errors).some(err => err)) return;

    if (editingBranch) {
      onUpdateBranch(editingBranch.id, formData);
      setEditingBranch(null);
    } else {
      onAddBranch(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      bankId: '',
      name: '',
      code: '',
      ifsc: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      email: '',
      manager: '',
      openingDate: '',
      isActive: true,
    });
    setErrors({});
    setIsFormOpen(false);
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({ ...branch });
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    resetForm();
    setEditingBranch(null);
  };

  const getBankName = (bankId: string) =>
    banks.find(b => b.id === bankId)?.name || 'Unknown Bank';

  const inputClass = (field: string) =>
    `w-full px-3 py-2 border rounded-lg ${
      errors[field] ? 'border-red-500' : 'border-gray-300'
    }`;

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${isDisabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Branches</h2>

        {/** only to enable branch when bank is added */}
        {!isFormOpen && !isDisabled && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Branch
          </button>
        )}
      </div>

      {isDisabled && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-amber-800">
            You need to create at least one bank before managing branches.
          </p>
        </div>
      )}

      {!isDisabled && isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-lg mb-6"
        >
          {[
            { label: 'Branch Name', key: 'name', placeholder: 'Eg. Main Branch' },
            { label: 'Branch Code', key: 'code', placeholder: 'Eg. MB001' },
            { label: 'IFSC Code', key: 'ifsc', placeholder: 'Eg. ABCD0123456' },
            { label: 'Address', key: 'address', placeholder: '123 Street Name' },
            { label: 'City', key: 'city', placeholder: 'Eg. Chennai' },
            { label: 'State', key: 'state', placeholder: 'Eg. Tamil Nadu' },
            { label: 'Pincode', key: 'pincode', placeholder: 'Eg. 600001' },
            { label: 'Phone', key: 'phone', placeholder: 'Eg. 9876543210' },
            { label: 'Email', key: 'email', placeholder: 'Eg. branch@bank.com' },
            { label: 'Manager Name', key: 'manager', placeholder: 'Eg. John Doe' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                placeholder={placeholder}
                value={(formData as any)[key]}
                onChange={e => handleChange(key, e.target.value)}
                className={inputClass(key)}
              />
              {errors[key] && <p className="text-red-600 text-xs mt-1">{errors[key]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
            <select
              required
              value={formData.bankId}
              onChange={e => handleChange('bankId', e.target.value)}
              className={inputClass('bankId')}
            >
              <option value="">Select a bank</option>
              {banks.map(bank => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
            {errors.bankId && <p className="text-red-600 text-xs mt-1">{errors.bankId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opening Date</label>
            <input
              type="date"
              value={formData.openingDate}
              onChange={e => handleChange('openingDate', e.target.value)}
              className={inputClass('openingDate')}
            />
            {errors.openingDate && <p className="text-red-600 text-xs mt-1">{errors.openingDate}</p>}
          </div>

          <div className="flex items-center space-x-2 md:col-span-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <label className="text-sm font-medium text-gray-700">Branch is Active</label>
          </div>

          <div className="md:col-span-2 flex gap-3 mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {editingBranch ? 'Update Branch' : 'Add Branch'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {branches.length === 0 ? (
          <p className="text-center text-gray-500">No branches added yet.</p>
        ) : (
          branches.map(branch => (
            <div key={branch.id} className="p-4 border rounded bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{branch.name}</h3>
                  <p className="text-sm text-gray-600">Code: {branch.code}</p>
                  <p className="text-sm text-gray-600">IFSC: {branch.ifsc}</p>
                  <p className="text-sm text-gray-600">Email: {branch.email}</p>
                  <p className="text-sm text-gray-600">Phone: {branch.phone}</p>
                  <p className="text-sm text-gray-600">Manager: {branch.manager}</p>
                  <p className="text-sm text-gray-600">Bank: {getBankName(branch.bankId)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(branch)} className="text-green-600 underline">
                    Edit
                  </button>
                  <button onClick={() => onDeleteBranch(branch.id)} className="text-red-600 underline">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
