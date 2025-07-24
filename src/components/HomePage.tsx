//modified by prasanna-11/07/25
import React, { useState } from 'react';
import { Building2, User, Shield, CreditCard, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface HomePageProps {
  onAdminLogin: (username: string, password: string) => void;
  onCustomerLogin: (panNumber: string, password: string) => void;
}

export default function HomePage({ onAdminLogin, onCustomerLogin }: HomePageProps) {
  const [userType, setUserType] = useState<'admin' | 'customer' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Admin login form
  const [adminForm, setAdminForm] = useState({
    username: '',
    password: ''
  });
  
  // Customer login form
  const [customerForm, setCustomerForm] = useState({
    panNumber: '',
    password: ''
  });

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdminLogin(adminForm.username, adminForm.password);
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCustomerLogin(customerForm.panNumber, customerForm.password);
  };

  const resetForms = () => {
    setAdminForm({ username: '', password: '' });
    setCustomerForm({ panNumber: '', password: '' });
    setUserType(null);
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <Building2 className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">SecureBank Management System</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {!userType ? (
          // User Type Selection
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to SecureBank</h2>
              <p className="text-xl text-gray-600 mb-8">Choose your access level to continue</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Admin Access */}
              <div 
                onClick={() => setUserType('admin')}
                className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100"
              >
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Shield className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Admin Access</h3>
                  <p className="text-gray-600 mb-6">
                    Full banking operations management including customer management, 
                    account operations, loan processing, and comprehensive reporting.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500 mb-6">
                    <p>✓ Customer & Account Management</p>
                    <p>✓ Banking Operations</p>
                    <p>✓ Loan Management</p>
                    <p>✓ Reports & Analytics</p>
                    <p>✓ System Administration</p>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    Access Admin Panel
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Customer Access */}
              <div 
                onClick={() => setUserType('customer')}
                className="bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100"
              >
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <User className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Customer Access</h3>
                  <p className="text-gray-600 mb-6">
                    Secure access to your personal banking services including 
                    account balance, transaction history, and fund transfers.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500 mb-6">
                    <p>✓ Account Balance & History</p>
                    <p>✓ Credit & Debit Operations</p>
                    <p>✓ Fund Transfers</p>
                    <p>✓ Transaction Reports</p>
                    <p>✓ Profile Management</p>
                  </div>
                  <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    Access Customer Portal
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Login Forms
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className={`rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center ${
                  userType === 'admin' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {userType === 'admin' ? (
                    <Shield className={`h-8 w-8 ${userType === 'admin' ? 'text-blue-600' : 'text-green-600'}`} />
                  ) : (
                    <User className={`h-8 w-8 ${userType === 'admin' ? 'text-blue-600' : 'text-green-600'}`} />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {userType === 'admin' ? 'Admin Login' : 'Customer Login'}
                </h3>
                <p className="text-gray-600">
                  {userType === 'admin' 
                    ? 'Enter your admin credentials to access the management system'
                    : 'Enter your PAN number and password to access your account'
                  }
                </p>
              </div>

              {userType === 'admin' ? (
                <form onSubmit={handleAdminSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      required
                      value={adminForm.username}
                      onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter admin username"
                    />
                    <p className="text-xs text-gray-500 mt-1">Default: admin</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={adminForm.password}
                        onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                        placeholder="Enter admin password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Default: admin123</p>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Login as Admin
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCustomerSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                    <input
                      type="text"
                      required
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                      title="Please enter a valid PAN number (e.g., ABCDE1234F)"
                      value={customerForm.panNumber}
                      onChange={(e) => setCustomerForm({ ...customerForm, panNumber: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your PAN number (e.g., ABCDE1234F)"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use the PAN number from your customer profile</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={customerForm.password}
                        onChange={(e) => setCustomerForm({ ...customerForm, password: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Default password: 12345678</p>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Login as Customer
                  </button>
                </form>
              )}

              <div className="mt-6 text-center">
                <button
                  onClick={resetForms}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  ← Back to selection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 SecureBank Management System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}