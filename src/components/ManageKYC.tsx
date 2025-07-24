//modified by prasanna-11/07/25
import React, { useState } from 'react';
import { Bank, Customer, KYC } from '../types';

interface ManageKYCProps {
  banks: Bank[];
  customers: Customer[];
  kycRecords: KYC[];
  onAddKYC: (kyc: Omit<KYC, 'id' | 'createdAt'>) => void;
  onUpdateKYC: (id: string, kyc: Omit<KYC, 'id' | 'createdAt'>) => void;
  onDeleteKYC: (id: string) => void;
}

export default function ManageKYC({
  banks,
  customers,
  kycRecords,
  onAddKYC,
  onUpdateKYC,
  onDeleteKYC,
}: ManageKYCProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingKYC, setEditingKYC] = useState<KYC | null>(null);

  const [formData, setFormData] = useState({
    customerId: '',
    panNumber: '',
    linkedBanks: [] as string[],
    documentType: '',
    documentNumber: '',
    documentProof: '',
    verificationStatus: 'pending' as 'pending' | 'verified' | 'rejected',
    issuedDate: '',
    expiryDate: '',
    placeOfIssue: '',
  });

  const [docNumError, setDocNumError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      customerId: '',
      panNumber: '',
      linkedBanks: [],
      documentType: '',
      documentNumber: '',
      documentProof: '',
      verificationStatus: 'pending',
      issuedDate: '',
      expiryDate: '',
      placeOfIssue: '',
    });
    setDocNumError(null);
    setEditingKYC(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (docNumError) return;
    if (editingKYC) {
      onUpdateKYC(editingKYC.id, formData);
    } else {
      onAddKYC(formData);
    }
    resetForm();
  };

  const handleEdit = (kyc: KYC) => {
    setEditingKYC(kyc);
    setFormData({
      customerId: kyc.customerId,
      panNumber: kyc.panNumber || '',
      linkedBanks: kyc.linkedBanks,
      documentType: kyc.documentType,
      documentNumber: kyc.documentNumber,
      documentProof: kyc.documentProof || '',
      verificationStatus: kyc.verificationStatus,
      issuedDate: kyc.issuedDate || '',
      expiryDate: kyc.expiryDate || '',
      placeOfIssue: kyc.placeOfIssue || '',
    });
    setDocNumError(null);
    setIsFormOpen(true);
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setFormData(f => ({
      ...f,
      customerId,
      panNumber: customer?.panNumber ?? '',
    }));
  };

  const handleBankSelection = (bankId: string, checked: boolean) => {
    const linked = checked
      ? [...formData.linkedBanks, bankId]
      : formData.linkedBanks.filter(id => id !== bankId);
    setFormData(f => ({ ...f, linkedBanks: linked }));
  };

  const handleDocumentNumberChange = (raw: string) => {
    const stripped = raw.replace(/\s+/g, '').toUpperCase();

    switch (formData.documentType) {
      case 'Aadhaar': {
        let digits = stripped.replace(/\D/g, '').slice(0, 12);
        const groups = digits.match(/.{1,4}/g) || [];
        const formatted = groups.join(' ');
        setFormData(f => ({ ...f, documentNumber: formatted }));
        if (formatted.length === 15) {
          setDocNumError(/^(\d{4}\s){3}\d{4}$/.test(formatted) ? null : 'Invalid Aadhaar');
        } else {
          setDocNumError('Aadhaar must be 12 digits');
        }
        break;
      }
      case 'PAN': {
        const pan = stripped.replace(/[^A-Z0-9]/g, '').slice(0, 10);
        setFormData(f => ({ ...f, documentNumber: pan }));
        setDocNumError(/^[A-Z]{5}\d{4}[A-Z]$/.test(pan) ? null : 'PAN = 5 letters, 4 digits, 1 letter');
        break;
      }
      case 'Passport': {
        const pass = stripped.replace(/[^A-Z0-9]/g, '').slice(0, 8);
        setFormData(f => ({ ...f, documentNumber: pass }));
        setDocNumError(/^[A-Z]\d{7}$/.test(pass) ? null : 'Passport = 1 letter + 7 digits');
        break;
      }
      case 'DriverLicense': {
        const dl = stripped.replace(/[^A-Z0-9]/g, '').slice(0, 16);
        setFormData(f => ({ ...f, documentNumber: dl }));
        setDocNumError(dl.length >= 6 ? null : 'Driver’s License ≥ 6 chars');
        break;
      }
      case 'VoterID': {
        const vid = stripped.replace(/[^A-Z0-9]/g, '').slice(0, 10);
        setFormData(f => ({ ...f, documentNumber: vid }));
        setDocNumError(/^[A-Z0-9]{10}$/.test(vid) ? null : 'Voter ID = 10 alphanumeric');
        break;
      }
      default: {
        setFormData(f => ({ ...f, documentNumber: raw }));
        setDocNumError(null);
      }
    }
  };

  const getCustomerName = (id: string) =>
    customers.find(c => c.id === id)
      ? `${customers.find(c => c.id === id)!.firstName} ${customers.find(c => c.id === id)!.lastName}`
      : 'Unknown';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Manage KYC</h2>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded"
          >
            Add KYC 
          </button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded mb-6">
          {/* Customer */}
          <div>
            <label className="block text-sm mb-1">Customer</label>
            <select
              required
              value={formData.customerId}
              onChange={e => handleCustomerChange(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select a customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* PAN */}
          <div>
            <label className="block text-sm mb-1">PAN (Optional)</label>
            <input
              readOnly
              value={formData.panNumber}
              className="w-full bg-gray-100 text-gray-600 px-3 py-2 border rounded"
            />
          </div>

          {/* Doc Type */}
          <div>
            <label className="block text-sm mb-1">Document Type</label>
            <select
              required
              value={formData.documentType}
              onChange={e => {
                setFormData(f => ({ ...f, documentType: e.target.value, documentNumber: '' }));
                setDocNumError(null);
              }}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select type</option>
              <option value="Aadhaar">Aadhaar Card</option>
              <option value="PAN">PAN Card</option>
              <option value="Passport">Passport</option>
              <option value="DriverLicense">Driver’s License</option>
              <option value="VoterID">Voter ID</option>
            </select>
          </div>

          {/* Doc Number */}
          <div>
            <label className="block text-sm mb-1">Document Number</label>
            <input
              required
              value={formData.documentNumber}
              onChange={e => handleDocumentNumberChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded ${docNumError ? 'border-red-500' : ''}`}
            />
            {docNumError && <p className="mt-1 text-xs text-red-600">{docNumError}</p>}
          </div>

          {/* Dates & Place */}
          <div>
            <label className="block text-sm mb-1">Issued Date</label>
            <input
              type="date"
              value={formData.issuedDate}
              onChange={e => setFormData(f => ({ ...f, issuedDate: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Expiry Date</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={e => setFormData(f => ({ ...f, expiryDate: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Place of Issue</label>
            <input
              type="text"
              value={formData.placeOfIssue}
              onChange={e => setFormData(f => ({ ...f, placeOfIssue: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Proof Upload */}
          <div className="col-span-2">
            <label className="block text-sm mb-1">Document Proof</label>
            <div className="flex items-center gap-4">
              <label htmlFor="upload" className="px-4 py-2 bg-orange-600 text-white rounded cursor-pointer">
                Choose
              </label>
              <span className="truncate w-2/3 text-sm">
                {formData.documentProof ? 'File Uploaded' : 'No file chosen'}
              </span>
            </div>
            <input
              id="upload"
              type="file"
              accept="application/pdf"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () =>
                    setFormData(f => ({ ...f, documentProof: reader.result as string }));
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
          </div>

          {/* Status & Banks */}
          <div>
            <label className="block text-sm mb-1">Verification Status</label>
            <select
              required
              value={formData.verificationStatus}
              onChange={e =>
                setFormData(f => ({ ...f, verificationStatus: e.target.value as any }))
              }
              className="w-full border px-3 py-2 rounded"
            >
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm mb-1">Linked Banks</label>
            <div className="flex flex-wrap gap-3">
              {banks.map(b => (
                <label key={b.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.linkedBanks.includes(b.id)}
                    onChange={e => handleBankSelection(b.id, e.target.checked)}
                  />
                  {b.name}
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="col-span-2 flex gap-4">
            <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded">
              {editingKYC ? 'Update KYC' : 'Add KYC'}
            </button>
            <button type="button" onClick={resetForm} className="bg-gray-300 px-6 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Records */}
      <div className="space-y-4">
        {kycRecords.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No KYC records yet.</p>
        ) : (
          kycRecords.map(kyc => (
            <div key={kyc.id} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-bold">{getCustomerName(kyc.customerId)}</h4>
                  <p className="text-sm">PAN: {kyc.panNumber || 'N/A'}</p>
                  <p className="text-sm">Type: {kyc.documentType}</p>
                  <p className="text-sm">Doc No: {kyc.documentNumber}</p>
                  <p className="text-sm">Issued: {kyc.issuedDate || 'N/A'}</p>
                  <p className="text-sm">Expiry: {kyc.expiryDate || 'N/A'}</p>
                  <p className="text-sm">Place: {kyc.placeOfIssue || 'N/A'}</p>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(kyc.verificationStatus)}`}>
                    {kyc.verificationStatus}
                  </span>
                  {kyc.documentProof && (
                    <div className="mt-2 flex gap-3">
                      <a href={kyc.documentProof} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 text-sm">
                        View
                      </a>
                      <a href={kyc.documentProof} download className="underline text-green-600 text-sm">
                        Download
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(kyc)} className="text-orange-600 hover:underline text-sm">
                    Edit
                  </button>
                  <button onClick={() => onDeleteKYC(kyc.id)} className="text-red-600 hover:underline text-sm">
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
