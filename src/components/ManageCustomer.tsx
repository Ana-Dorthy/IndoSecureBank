//modified by prasanna-13/07/25
import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import { Customer } from '../types';

interface ManageCustomerProps {
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  onUpdateCustomer: (id: string, customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  onDeleteCustomer: (id: string) => void;
}

export default function ManageCustomer({ customers, onAddCustomer, onUpdateCustomer, onDeleteCustomer }: ManageCustomerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    panNumber: '',
    annualIncome: 0,
    accountNumber: '',
    generatedAccountNumber: '' // Store the generated number separately
  });

  // Generate account number
  const generateAccountNumber = () => {
    // Generate a unique 12-digit account number
    const bankCode = '001'; // Bank identifier
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${bankCode}${timestamp}${random}`;
  };

  // Generate account number only once when adding new customer
  const handleAddCustomer = () => {
    const newAccountNumber = generateAccountNumber();
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      panNumber: '',
      annualIncome: 0,
      accountNumber: newAccountNumber,
      generatedAccountNumber: newAccountNumber
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use the generated account number for new customers
    const customerData = {
      ...formData,
      accountNumber: formData.generatedAccountNumber || formData.accountNumber
    };
    
    if (editingCustomer) {
      // For existing customers, don't change the account number
      onUpdateCustomer(editingCustomer.id, {
        ...customerData,
        accountNumber: editingCustomer.accountNumber // Keep original account number
      });
      setEditingCustomer(null);
    } else {
      onAddCustomer(customerData);
    }
    
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      panNumber: '',
      annualIncome: 0,
      accountNumber: '',
      generatedAccountNumber: ''
    });
    setIsFormOpen(false);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      dateOfBirth: customer.dateOfBirth,
      panNumber: customer.panNumber,
      annualIncome: customer.annualIncome || 0,
      accountNumber: customer.accountNumber || '',
      generatedAccountNumber: customer.accountNumber || '' // Store existing number
    });
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingCustomer(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      panNumber: '',
      annualIncome: 0,
      accountNumber: '',
      generatedAccountNumber: ''
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Manage Customers</h2>
        </div>
        <button
          onClick={handleAddCustomer}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Customer
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
              <input
                type="text"
                required
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                title="Please enter a valid PAN number (e.g., ABCDE1234F)"
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="ABCDE1234F"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  readOnly={!editingCustomer} // Only editable when editing existing customer
                  value={formData.generatedAccountNumber || formData.accountNumber}
                  onChange={(e) => editingCustomer && setFormData({ ...formData, accountNumber: e.target.value })}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                    editingCustomer 
                      ? 'focus:ring-2 focus:ring-purple-500' 
                      : 'bg-gray-100 text-gray-600 cursor-not-allowed'
                  }`}
                  placeholder="Auto-generated"
                />
                {!editingCustomer && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">
                      Auto-Generated
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {editingCustomer 
                  ? 'Account number is permanent and cannot be changed for existing customers' 
                  : 'Account number is auto-generated once and used throughout the system'
                }
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income (₹)</label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                value={formData.annualIncome}
                onChange={(e) => setFormData({ ...formData, annualIncome: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter annual income"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {editingCustomer ? 'Update Customer' : 'Add Customer'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {customers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No customers registered yet. Add your first customer to get started.</p>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">PAN: {customer.panNumber}</p>
                    {customer.accountNumber && (
                      <p className="text-sm text-blue-600">Account: {customer.accountNumber}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{customer.address}</p>
                    <p className="text-sm text-gray-600">DOB: {new Date(customer.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-600">
                      Annual Income: ₹{(customer.annualIncome || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(customer)}
                    className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCustomer(customer.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
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
//modified-prasanna 11/7/25
// import React, { useState } from 'react';
// import { Customer } from '../types';

// interface ManageCustomerProps {
//   customers: Customer[];
//   onAddCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
//   onUpdateCustomer: (id: string, customer: Omit<Customer, 'id' | 'createdAt'>) => void;
//   onDeleteCustomer: (id: string) => void;
// }

// export default function ManageCustomer({
//   customers,
//   onAddCustomer,
//   onUpdateCustomer,
//   onDeleteCustomer,
// }: ManageCustomerProps) {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     address: '',
//     dateOfBirth: '',
//     panNumber: '',
//     aadharNumber: '',
//     gender: '',
//     maritalStatus: '',
//     occupation: '',
//     annualIncome: '',
//     isActive: true,
//   });

//   const handleInput = (field: string, value: string) => {
//     let updatedValue = value;
//     switch (field) {
//       case 'phone':
//         updatedValue = value.replace(/\D/g, '').slice(0, 10);
//         break;
//       case 'aadharNumber':
//         updatedValue = value.replace(/\D/g, '').slice(0, 16);
//         break;
//       case 'panNumber':
//         updatedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
//         break;
//       case 'annualIncome':
//         updatedValue = value.replace(/[^0-9]/g, '');
//         break;
//     }
//     setFormData(prev => ({ ...prev, [field]: updatedValue }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (editingCustomer) {
//       onUpdateCustomer(editingCustomer.id, formData);
//       setEditingCustomer(null);
//     } else {
//       onAddCustomer(formData);
//     }
//     resetForm();
//   };

//   const resetForm = () => {
//     setFormData({
//       firstName: '',
//       lastName: '',
//       email: '',
//       phone: '',
//       address: '',
//       dateOfBirth: '',
//       panNumber: '',
//       aadharNumber: '',
//       gender: '',
//       maritalStatus: '',
//       occupation: '',
//       annualIncome: '',
//       isActive: true,
//     });
//     setIsFormOpen(false);
//   };

//     const handleEdit = (customer: Customer) => {
//     setEditingCustomer(customer);
//     setFormData({
//       firstName: customer.firstName,
//       lastName: customer.lastName,
//       email: customer.email,
//       phone: customer.phone,
//       address: customer.address,
//       dateOfBirth: customer.dateOfBirth,
//       panNumber: customer.panNumber || '',
//       aadharNumber: customer.aadharNumber,
//       gender: customer.gender,
//       maritalStatus: customer.maritalStatus,
//       occupation: customer.occupation,
//       annualIncome: customer.annualIncome,
//       isActive: customer.isActive,
//     });
//     setIsFormOpen(true);
//   };


//   const handleCancel = () => {
//     resetForm();
//     setEditingCustomer(null);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Manage Customers</h2>
//         {!isFormOpen && (
//           <button
//             onClick={() => setIsFormOpen(true)}
//             className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
//           >
//             Add Customer
//           </button>
//         )}
//       </div>

//       {/* Form */}
//       {isFormOpen && (
//         <form
//           onSubmit={handleSubmit}
//           className="bg-gray-50 rounded-lg p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
//         >
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//             <input
//               type="text"
//               required
//               value={formData.firstName}
//               onChange={e => setFormData({ ...formData, firstName: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//               placeholder="Enter first name"
//             />
//           </div>

          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//             <input
//               type="text"
//               required
//               value={formData.lastName}
//               onChange={e => setFormData({ ...formData, lastName: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//               placeholder="Enter last name"
//             />
//           </div>

          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               required
//               value={formData.email}
//               onChange={e => setFormData({ ...formData, email: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//               placeholder="example@domain.com"
//             />
//           </div>

          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//             <input
//               type="tel"
//               required
//               value={formData.phone}
//               onChange={e => handleInput('phone', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//               placeholder="10-digit number"
//             />
//           </div>

         
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
//             <input
//               type="date"
//               required
//               value={formData.dateOfBirth}
//               onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//             />
//           </div>

          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               PAN Number <span className="text-gray-500">(Optional)</span>
//             </label>
//             <input
//               type="text"
//               value={formData.panNumber}
//               onChange={e => handleInput('panNumber', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//               placeholder="ABCDE1234F"
//               maxLength={10}
//             />
//           </div>

          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
//             <input
//               type="text"
//               required
//               value={formData.aadharNumber}
//               onChange={e => handleInput('aadharNumber', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//               placeholder="12-digit number"
//             />
//           </div>

          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//             <select
//               required
//               value={formData.gender}
//               onChange={e => setFormData({ ...formData, gender: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//             >
//               <option value="">Select gender</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>

          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
//             <select
//               required
//               value={formData.maritalStatus}
//               onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//             >
//               <option value="">Select status</option>
//               <option value="Single">Single</option>
//               <option value="Married">Married</option>
//               <option value="Divorced">Divorced</option>
//               <option value="Widowed">Widowed</option>
//             </select>
//           </div>

          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
//             <input
//               type="text"
//               required
//               value={formData.occupation}
//               onChange={e => setFormData({ ...formData, occupation: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//               placeholder="e.g., Engineer"
//             />
//           </div>

          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
//             <input
//               type="text"
//               required
//               value={formData.annualIncome}
//               onChange={e => handleInput('annualIncome', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//               placeholder="Only numbers"
//             />
//           </div>

          
//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={formData.isActive}
//               onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
//             />
//             <label className="text-sm font-medium text-gray-700">Active Customer</label>
//           </div>

          
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//             <textarea
//               required
//               value={formData.address}
//               onChange={e => setFormData({ ...formData, address: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//               rows={3}
//               placeholder="Enter full address"
//             />
//           </div>

          
//           <div className="md:col-span-2 flex gap-3">
//             <button
//               type="submit"
//               className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//             >
//               {editingCustomer ? 'Update Customer' : 'Add Customer'}
//             </button>
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       )}

      
//       <div className="space-y-4">
//         {customers.length === 0 ? (
//           <p className="text-gray-500 text-center py-8">
//             No customers registered yet. Add your first customer to get started.
//           </p>
//         ) : (
//           customers.map(customer => (
//             <div key={customer.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//               <div className="flex justify-between items-start">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
//                   <div>
//                     <h3 className="font-semibold text-gray-800">
//                       {customer.firstName} {customer.lastName}
//                     </h3>
//                     <p className="text-sm text-gray-600">PAN: {customer.panNumber || 'N/A'}</p>
//                     <p className="text-sm text-gray-600">Aadhar: {customer.aadharNumber}</p>
//                     <p className="text-sm text-gray-600">Gender: {customer.gender}</p>
//                     <p className="text-sm text-gray-600">
//                       DOB: {new Date(customer.dateOfBirth).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Email: {customer.email}</p>
//                     <p className="text-sm text-gray-600">Phone: {customer.phone}</p>
//                     <p className="text-sm text-gray-600">Occupation: {customer.occupation}</p>
//                     <p className="text-sm text-gray-600">Income: {customer.annualIncome}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Address: {customer.address}</p>
//                     <p className="text-sm text-gray-600">Marital: {customer.maritalStatus}</p>
//                     <p className="text-sm text-gray-600">
//                       Status: {customer.isActive ? 'Active' : 'Inactive'}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex gap-2 ml-4">
//                   <button
//                     onClick={() => handleEdit(customer)}
//                     className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => onDeleteCustomer(customer.id)}
//                     className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

//modified-prasanna 12/7/25

// import React, { useState } from 'react';
// import { Customer } from '../types';
// import { generateAccountNumber, generateCustomerId } from '../utils/accountUtils';
// import { User, Phone, Mail, MapPin, CreditCard, Calendar, Briefcase } from 'lucide-react';

// interface ManageCustomerProps {
//   customers: Customer[];
//   onAddCustomer: (customer: Customer) => void;
//   onUpdateCustomer: (id: string, customer: Omit<Customer, 'id' | 'createdAt' | 'accountNumber'>) => void;
//   onDeleteCustomer: (id: string) => void;
// }

// export default function ManageCustomer({
//   customers,
//   onAddCustomer,
//   onUpdateCustomer,
//   onDeleteCustomer,
// }: ManageCustomerProps) {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     address: '',
//     dateOfBirth: '',
//     panNumber: '',
//     aadharNumber: '',
//     gender: '',
//     maritalStatus: '',
//     occupation: '',
//     annualIncome: '',
//     isActive: true,
//   });

//   const handleInput = (field: string, value: string) => {
//     let updatedValue = value;
//     switch (field) {
//       case 'phone':
//         updatedValue = value.replace(/\D/g, '').slice(0, 10);
//         break;
//       case 'aadharNumber':
//         updatedValue = value.replace(/\D/g, '').slice(0, 16);
//         break;
//       case 'panNumber':
//         updatedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
//         break;
//       case 'annualIncome':
//         updatedValue = value.replace(/[^0-9]/g, '');
//         break;
//     }
//     setFormData(prev => ({ ...prev, [field]: updatedValue }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (editingCustomer) {
//       onUpdateCustomer(editingCustomer.id, formData);
//       setEditingCustomer(null);
//     } else {
//       // Generate new customer with account number
//       const newCustomer: Customer = {
//         id: generateCustomerId(),
//         accountNumber: generateAccountNumber(),
//         ...formData,
//         createdAt: new Date(),
//       };
//       onAddCustomer(newCustomer);
//     }
//     resetForm();
//   };

//   const resetForm = () => {
//     setFormData({
//       firstName: '',
//       lastName: '',
//       email: '',
//       phone: '',
//       address: '',
//       dateOfBirth: '',
//       panNumber: '',
//       aadharNumber: '',
//       gender: '',
//       maritalStatus: '',
//       occupation: '',
//       annualIncome: '',
//       isActive: true,
//     });
//     setIsFormOpen(false);
//   };

//   const handleEdit = (customer: Customer) => {
//     setEditingCustomer(customer);
//     setFormData({
//       firstName: customer.firstName,
//       lastName: customer.lastName,
//       email: customer.email,
//       phone: customer.phone,
//       address: customer.address,
//       dateOfBirth: customer.dateOfBirth,
//       panNumber: customer.panNumber || '',
//       aadharNumber: customer.aadharNumber,
//       gender: customer.gender,
//       maritalStatus: customer.maritalStatus,
//       occupation: customer.occupation,
//       annualIncome: customer.annualIncome,
//       isActive: customer.isActive,
//     });
//     setIsFormOpen(true);
//   };

//   const handleCancel = () => {
//     resetForm();
//     setEditingCustomer(null);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <User className="h-8 w-8 text-purple-600" />
//           <h2 className="text-2xl font-bold text-gray-800">Manage Customers</h2>
//         </div>
//         {!isFormOpen && (
//           <button
//             onClick={() => setIsFormOpen(true)}
//             className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
//           >
//             <User className="h-4 w-4" />
//             Add Customer
//           </button>
//         )}
//       </div>

//       {/* Form */}
//       {isFormOpen && (
//         <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 mb-6 border border-purple-200">
//           <div className="mb-4">
//             <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//               <CreditCard className="h-5 w-5 text-purple-600" />
//               {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
//             </h3>
//             {editingCustomer && (
//               <p className="text-sm text-gray-600 mt-1">
//                 Account Number: <span className="font-mono font-semibold text-purple-600">{editingCustomer.accountNumber}</span>
//               </p>
//             )}
//           </div>

//           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* First Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//                 <User className="h-4 w-4" />
//                 First Name
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.firstName}
//                 onChange={e => setFormData({ ...formData, firstName: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//                 placeholder="Enter first name"
//               />
//             </div>

//             {/* Last Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//                 <User className="h-4 w-4" />
//                 Last Name
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.lastName}
//                 onChange={e => setFormData({ ...formData, lastName: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//                 placeholder="Enter last name"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//                 <Mail className="h-4 w-4" />
//                 Email
//               </label>
//               <input
//                 type="email"
//                 required
//                 value={formData.email}
//                 onChange={e => setFormData({ ...formData, email: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//                 placeholder="example@domain.com"
//               />
//             </div>

//             {/* Phone */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//                 <Phone className="h-4 w-4" />
//                 Phone
//               </label>
//               <input
//                 type="tel"
//                 required
//                 value={formData.phone}
//                 onChange={e => handleInput('phone', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//                 placeholder="10-digit number"
//               />
//             </div>

//             {/* Date of Birth */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//                 <Calendar className="h-4 w-4" />
//                 Date of Birth
//               </label>
//               <input
//                 type="date"
//                 required
//                 value={formData.dateOfBirth}
//                 onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//               />
//             </div>

//             {/* PAN Number */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//                 <CreditCard className="h-4 w-4" />
//                 PAN Number <span className="text-gray-500">(Optional)</span>
//               </label>
//               <input
//                 type="text"
//                 value={formData.panNumber}
//                 onChange={e => handleInput('panNumber', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//                 placeholder="ABCDE1234F"
//                 maxLength={10}
//               />
//             </div>

//             {/* Aadhar Number */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
//               <input
//                 type="text"
//                 required
//                 value={formData.aadharNumber}
//                 onChange={e => handleInput('aadharNumber', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//                 placeholder="12-digit number"
//               />
//             </div>

//             {/* Gender */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//               <select
//                 required
//                 value={formData.gender}
//                 onChange={e => setFormData({ ...formData, gender: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//               >
//                 <option value="">Select gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             {/* Marital Status */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
//               <select
//                 required
//                 value={formData.maritalStatus}
//                 onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//               >
//                 <option value="">Select status</option>
//                 <option value="Single">Single</option>
//                 <option value="Married">Married</option>
//                 <option value="Divorced">Divorced</option>
//                 <option value="Widowed">Widowed</option>
//               </select>
//             </div>

//             {/* Occupation */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//                 <Briefcase className="h-4 w-4" />
//                 Occupation
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.occupation}
//                 onChange={e => setFormData({ ...formData, occupation: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//                 placeholder="e.g., Engineer"
//               />
//             </div>

//             {/* Annual Income */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
//               <input
//                 type="text"
//                 required
//                 value={formData.annualIncome}
//                 onChange={e => handleInput('annualIncome', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//                 placeholder="Only numbers"
//               />
//             </div>

//             {/* Active Status */}
//             <div className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={formData.isActive}
//                 onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
//                 className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
//               />
//               <label className="text-sm font-medium text-gray-700">Active Customer</label>
//             </div>

//             {/* Address */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//                 <MapPin className="h-4 w-4" />
//                 Address
//               </label>
//               <textarea
//                 required
//                 value={formData.address}
//                 onChange={e => setFormData({ ...formData, address: e.target.value })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//                 rows={3}
//                 placeholder="Enter full address"
//               />
//             </div>

//             {/* Form Buttons */}
//             <div className="md:col-span-2 flex gap-3">
//               <button
//                 type="submit"
//                 className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
//               >
//                 <User className="h-4 w-4" />
//                 {editingCustomer ? 'Update Customer' : 'Add Customer'}
//               </button>
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Customer List */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//           <User className="h-5 w-5 text-purple-600" />
//           Customer List ({customers.length})
//         </h3>
        
//         {customers.length === 0 ? (
//           <div className="text-center py-12">
//             <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500 text-lg">No customers registered yet</p>
//             <p className="text-gray-400 text-sm">Add your first customer to get started</p>
//           </div>
//         ) : (
//           customers.map(customer => (
//             <div key={customer.id} className="bg-gradient-to-r from-white to-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
//               <div className="flex justify-between items-start">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2 mb-3">
//                       <CreditCard className="h-5 w-5 text-purple-600" />
//                       <span className="font-mono text-sm font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded">
//                         {customer.accountNumber}
//                       </span>
//                     </div>
//                     <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
//                       <User className="h-5 w-5 text-gray-600" />
//                       {customer.firstName} {customer.lastName}
//                     </h3>
//                     <p className="text-sm text-gray-600">PAN: {customer.panNumber || 'N/A'}</p>
//                     <p className="text-sm text-gray-600">Aadhar: {customer.aadharNumber}</p>
//                     <p className="text-sm text-gray-600">Gender: {customer.gender}</p>
//                     <p className="text-sm text-gray-600 flex items-center gap-1">
//                       <Calendar className="h-4 w-4" />
//                       DOB: {new Date(customer.dateOfBirth).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <p className="text-sm text-gray-600 flex items-center gap-1">
//                       <Mail className="h-4 w-4" />
//                       {customer.email}
//                     </p>
//                     <p className="text-sm text-gray-600 flex items-center gap-1">
//                       <Phone className="h-4 w-4" />
//                       {customer.phone}
//                     </p>
//                     <p className="text-sm text-gray-600 flex items-center gap-1">
//                       <Briefcase className="h-4 w-4" />
//                       {customer.occupation}
//                     </p>
//                     <p className="text-sm text-gray-600">Income: ₹{customer.annualIncome}</p>
//                   </div>
//                   <div className="space-y-2">
//                     <p className="text-sm text-gray-600 flex items-center gap-1">
//                       <MapPin className="h-4 w-4" />
//                       {customer.address}
//                     </p>
//                     <p className="text-sm text-gray-600">Marital: {customer.maritalStatus}</p>
//                     <p className="text-sm text-gray-600">
//                       Status: 
//                       <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
//                         customer.isActive 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {customer.isActive ? 'Active' : 'Inactive'}
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex flex-col gap-2 ml-4">
//                   <button
//                     onClick={() => handleEdit(customer)}
//                     className="px-4 py-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors duration-200 flex items-center gap-2"
//                   >
//                     <User className="h-4 w-4" />
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => onDeleteCustomer(customer.id)}
//                     className="px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// modified by prasanna - 11/07/25
// import React, { useState } from 'react';
// import { Customer } from '../types';

// interface ManageCustomerProps {
//   customers: Customer[];
//   onAddCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
//   onUpdateCustomer: (id: string, customer: Omit<Customer, 'id' | 'createdAt'>) => void;
//   onDeleteCustomer: (id: string) => void;
// }

// export default function ManageCustomer({
//   customers,
//   onAddCustomer,
//   onUpdateCustomer,
//   onDeleteCustomer,
// }: ManageCustomerProps) {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

//   const generateAccountNumber = () => {
//     const now = new Date();
//     const timePart = now.getTime().toString().slice(-8);
//     const randPart = Math.floor(100000 + Math.random() * 900000); // 6-digit
//     return `ACC${timePart}${randPart}`;
//   };

//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     address: '',
//     dateOfBirth: '',
//     panNumber: '',
//     aadharNumber: '',
//     gender: '',
//     maritalStatus: '',
//     occupation: '',
//     annualIncome: '',
//     isActive: true,
//     accountNumber: ''
//   });

//   const handleInput = (field: string, value: string) => {
//     let updatedValue = value;
//     switch (field) {
//       case 'phone':
//         updatedValue = value.replace(/\D/g, '').slice(0, 10);
//         break;
//       case 'aadharNumber':
//         updatedValue = value.replace(/\D/g, '').slice(0, 16);
//         break;
//       case 'panNumber':
//         updatedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
//         break;
//       case 'annualIncome':
//         updatedValue = value.replace(/[^0-9]/g, '');
//         break;
//     }
//     setFormData(prev => ({ ...prev, [field]: updatedValue }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (editingCustomer) {
//       onUpdateCustomer(editingCustomer.id, formData);
//       setEditingCustomer(null);
//     } else {
//       onAddCustomer(formData);
//     }
//     resetForm();
//   };

//   const resetForm = () => {
//     setFormData({
//       firstName: '',
//       lastName: '',
//       email: '',
//       phone: '',
//       address: '',
//       dateOfBirth: '',
//       panNumber: '',
//       aadharNumber: '',
//       gender: '',
//       maritalStatus: '',
//       occupation: '',
//       annualIncome: '',
//       isActive: true,
//       accountNumber: ''
//     });
//     setIsFormOpen(false);
//   };

//   const handleEdit = (customer: Customer) => {
//     setEditingCustomer(customer);
//     setFormData({
//       firstName: customer.firstName,
//       lastName: customer.lastName,
//       email: customer.email,
//       phone: customer.phone,
//       address: customer.address,
//       dateOfBirth: customer.dateOfBirth,
//       panNumber: customer.panNumber || '',
//       aadharNumber: customer.aadharNumber,
//       gender: customer.gender,
//       maritalStatus: customer.maritalStatus,
//       occupation: customer.occupation,
//       annualIncome: customer.annualIncome,
//       isActive: customer.isActive,
//       accountNumber: customer.accountNumber || ''
//     });
//     setIsFormOpen(true);
//   };

//   const handleCancel = () => {
//     resetForm();
//     setEditingCustomer(null);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Manage Customers</h2>
//         {!isFormOpen && (
//           <button
//             onClick={() => {
//               setEditingCustomer(null);
//               setFormData(prev => ({
//                 ...prev,
//                 accountNumber: generateAccountNumber()
//               }));
//               setIsFormOpen(true);
//             }}
//             className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
//           >
//             Add Customer
//           </button>
//         )}
//       </div>

//       {isFormOpen && (
//         <form
//           onSubmit={handleSubmit}
//           className="bg-gray-50 rounded-lg p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
//         >
//           {/* First Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//             <input
//               type="text"
//               required
//               value={formData.firstName}
//               onChange={e => setFormData({ ...formData, firstName: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//               placeholder="Enter first name"
//             />
//           </div>

//           {/* Last Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//             <input
//               type="text"
//               required
//               value={formData.lastName}
//               onChange={e => setFormData({ ...formData, lastName: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//               placeholder="Enter last name"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               required
//               value={formData.email}
//               onChange={e => setFormData({ ...formData, email: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//               placeholder="example@domain.com"
//             />
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//             <input
//               type="tel"
//               required
//               value={formData.phone}
//               onChange={e => handleInput('phone', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//               placeholder="10-digit number"
//             />
//           </div>

//           {/* DOB */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
//             <input
//               type="date"
//               required
//               value={formData.dateOfBirth}
//               onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//             />
//           </div>

//           {/* PAN */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number (Optional)</label>
//             <input
//               type="text"
//               value={formData.panNumber}
//               onChange={e => handleInput('panNumber', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//               placeholder="ABCDE1234F"
//               maxLength={10}
//             />
//           </div>

//           {/* Aadhar */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
//             <input
//               type="text"
//               required
//               value={formData.aadharNumber}
//               onChange={e => handleInput('aadharNumber', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//               placeholder="12-digit number"
//             />
//           </div>

//           {/* Gender */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//             <select
//               required
//               value={formData.gender}
//               onChange={e => setFormData({ ...formData, gender: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//             >
//               <option value="">Select gender</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>

//           {/* Marital Status */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
//             <select
//               required
//               value={formData.maritalStatus}
//               onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//             >
//               <option value="">Select status</option>
//               <option value="Single">Single</option>
//               <option value="Married">Married</option>
//               <option value="Divorced">Divorced</option>
//               <option value="Widowed">Widowed</option>
//             </select>
//           </div>

//           {/* Occupation */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
//             <input
//               type="text"
//               required
//               value={formData.occupation}
//               onChange={e => setFormData({ ...formData, occupation: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//               placeholder="e.g., Engineer"
//             />
//           </div>

//           {/* Annual Income */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
//             <input
//               type="text"
//               required
//               value={formData.annualIncome}
//               onChange={e => handleInput('annualIncome', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//               placeholder="Only numbers"
//             />
//           </div>

//           {/* Account Number */}
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
//             <div className="relative">
//               <input
//                 type="text"
//                 required
//                 readOnly
//                 value={formData.accountNumber}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
//                 placeholder="Auto-generated"
//               />
//               {!editingCustomer && (
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       accountNumber: generateAccountNumber()
//                     }))
//                   }
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
//                 >
//                   Generate
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Active Checkbox */}
//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={formData.isActive}
//               onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
//             />
//             <label className="text-sm font-medium text-gray-700">Active Customer</label>
//           </div>

//           {/* Address */}
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//             <textarea
//               required
//               value={formData.address}
//               onChange={e => setFormData({ ...formData, address: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//               rows={3}
//               placeholder="Enter full address"
//             />
//           </div>

//           {/* Buttons */}
//           <div className="md:col-span-2 flex gap-3">
//             <button
//               type="submit"
//               className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//             >
//               {editingCustomer ? 'Update Customer' : 'Add Customer'}
//             </button>
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       )}

//       {/* Customer Cards */}
//       <div className="space-y-4">
//         {customers.length === 0 ? (
//           <p className="text-gray-500 text-center py-8">
//             No customers registered yet. Add your first customer to get started.
//           </p>
//         ) : (
//           customers.map(customer => (
//             <div key={customer.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//               <div className="flex justify-between items-start">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
//                   <div>
//                     <h3 className="font-semibold text-gray-800">
//                       {customer.firstName} {customer.lastName}
//                     </h3>
//                     <p className="text-sm text-gray-600">PAN: {customer.panNumber || 'N/A'}</p>
//                     <p className="text-sm text-gray-600">Aadhar: {customer.aadharNumber}</p>
//                     <p className="text-sm text-gray-600">Gender: {customer.gender}</p>
//                     <p className="text-sm text-gray-600">
//                       DOB: {new Date(customer.dateOfBirth).toLocaleDateString()}
//                     </p>
//                     <p className="text-sm text-blue-600">Account: {customer.accountNumber}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Email: {customer.email}</p>
//                     <p className="text-sm text-gray-600">Phone: {customer.phone}</p>
//                     <p className="text-sm text-gray-600">Occupation: {customer.occupation}</p>
//                     <p className="text-sm text-gray-600">Income: {customer.annualIncome}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Address: {customer.address}</p>
//                     <p className="text-sm text-gray-600">Marital: {customer.maritalStatus}</p>
//                     <p className="text-sm text-gray-600">
//                       Status: {customer.isActive ? 'Active' : 'Inactive'}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex gap-2 ml-4">
//                   <button
//                     onClick={() => handleEdit(customer)}
//                     className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => onDeleteCustomer(customer.id)}
//                     className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
