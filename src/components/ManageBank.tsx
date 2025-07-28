//modified by prasanna-11/07/25
import React, { useState } from 'react';
import { Bank } from '../types';

interface ManageBankProps {
  banks: Bank[];
  onAddBank: (bank: Omit<Bank, 'id' | 'createdAt'>) => void;
  onUpdateBank: (id: string, bank: Omit<Bank, 'id' | 'createdAt'>) => void;
  onDeleteBank: (id: string) => void;
}

export default function ManageBank({
  banks,
  onAddBank,
  onUpdateBank,
  onDeleteBank,
}: ManageBankProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);

  const [formData, setFormData] = useState<Omit<Bank, 'id' | 'createdAt'>>({
    name: '',
    bankName: '',
    bankCode: '',
    ifscCode: '',
    licenseNumber: '',
    licenseIssuedDate: '',
    regulatedBy: '',
    bankType: 'Private',
    status: 'Active',
    establishedDate: '',
    headOfficeAddress: '',
    contactEmail: '',
    // contactPhone: '',
    country: '',
    createdBy: '',
  });

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingBank(null);
    setFormData({
      name: '',
      bankName: '',
      bankCode: '',
      ifscCode: '',
      licenseNumber: '',
      licenseIssuedDate: '',
      regulatedBy: '',
      bankType: 'Private',
      status: 'Active',
      establishedDate: '',
      headOfficeAddress: '',
      contactEmail: '',
      // contactPhone: '',
      country: '',
      createdBy: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBank) {
      onUpdateBank(editingBank.id, formData);
      console.log("Submitting bank:", formData);
    } else {
      onAddBank(formData);
      console.log("Submitting bank:", formData);

    }
    resetForm();
  };

  const handleEdit = (bank: Bank) => {
    setEditingBank(bank);
    setFormData({ ...bank });
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    resetForm();
  };

  const getInputProps = (key: string) => {
    switch (key) {
      // case 'contactPhone':
      //   return { type: 'tel', placeholder: 'Ex: 9876543210', maxLength: 10 };
      case 'ifscCode':
        return {
          type: 'text',
          placeholder: 'Ex: SBIN0001234',
          maxLength: 11,
          title: 'Format: 4 letters, 0, 6 alphanumeric',
        };
      case 'bankCode':
        return { type: 'text', placeholder: 'Ex: ABC123', maxLength: 10 };
      case 'licenseIssuedDate':
      case 'establishedDate':
        return { type: 'date' };
      case 'contactEmail':
        return { type: 'email', placeholder: 'Ex: support@abcfinance.com' };
      case 'headOfficeAddress':
        return {
          type: 'text',
          placeholder: 'Ex: 123 Main Street, Mumbai',
          maxLength: 100,
        };
      case 'name':
      case 'bankName':
      case 'licenseNumber':
      case 'regulatedBy':
      case 'country':
      case 'createdBy':
        return {
          type: 'text',
          placeholder: `Enter ${key}`,
          maxLength: 50,
        };
      default:
        return { type: 'text' };
    }
  };

  const handleInputChange = (key: string, value: string) => {
    let updatedValue = value;
    switch (key) {
      // case 'contactPhone':
      //   updatedValue = value.replace(/\D/g, '').slice(0, 10);
      //   break;
      case 'bankCode':
        updatedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
        break;
      case 'ifscCode':
        updatedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
        break;
      case 'licenseNumber':
        updatedValue = value.toUpperCase().slice(0, 20);
        break;
      case 'headOfficeAddress':
        updatedValue = value.slice(0, 100);
        break;
      case 'name':
      case 'bankName':
      case 'regulatedBy':
      case 'country':
      case 'createdBy':
        updatedValue = value.slice(0, 50);
        break;
      default:
        break;
    }
    setFormData((prev) => ({ ...prev, [key]: updatedValue }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Banks</h2>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Bank
          </button>
        )}
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-lg mb-6"
        >
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              {key === 'bankType' || key === 'status' ? (
                <select
                  value={value as string}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  {(key === 'bankType'
                    ? ['Private', 'Public', 'Cooperative', 'Foreign']
                    : ['Active', 'Inactive', 'Suspended']
                  ).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...getInputProps(key)}
                  value={value as string}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
              )}
            </div>
          ))}

          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingBank ? 'Update Bank' : 'Add Bank'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {banks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No banks registered yet.</p>
        ) : (
          banks.map((bank) => (
            <div key={bank.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{bank.name}</h3>
                  <p className="text-sm text-gray-600">
                    {bank.headOfficeAddress}
                  </p>
                  <p className="text-sm text-gray-600">
                    Code: {bank.bankCode}, IFSC: {bank.ifscCode}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(bank)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteBank(bank.id)}
                    className="text-red-600 hover:underline"
                  >
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
