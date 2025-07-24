//modified by prasanna-11/07/25
import React, { useState } from 'react';
import { FileText, Send, Calendar, TrendingUp, Users, Building2, MapPin, ExternalLink, Database } from 'lucide-react';
import { Bank, Branch, Customer, Account, Transaction } from '../types';

interface ReportRequestProps {
  banks: Bank[];
  branches: Branch[];
  customers: Customer[];
  accounts: Account[];
  transactions: Transaction[];
  onSendReportRequest: (reportType: string, period: string, filters: any) => void;
}

export default function ReportRequest({ 
  banks, 
  branches, 
  customers, 
  accounts, 
  transactions, 
  onSendReportRequest 
}: ReportRequestProps) {
  const [reportType, setReportType] = useState<'customer' | 'bank' | 'branch'>('customer');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'halfyearly' | 'annually'>('monthly');
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);

  const handleSendRequest = () => {
    const filters = {
      bankId: selectedBank,
      branchId: selectedBranch,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    };
    
    onSendReportRequest(reportType, period, filters);
  };

  const checkDatabase = async () => {
    try {
      const response = await fetch('/api/debug/database');
      const data = await response.json();
      setDebugInfo(data);
      setShowDebug(true);
    } catch (error) {
      console.error('Error checking database:', error);
      setDebugInfo({ error: error.message });
      setShowDebug(true);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports');
      const reports = await response.json();
      console.log('Fetched reports:', reports);
      setDebugInfo({ ...debugInfo, reports });
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const getReportStats = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyTransactions = transactions.filter(t => 
      new Date(t.createdAt) >= startOfMonth
    );

    return {
      totalCustomers: customers.length,
      totalAccounts: accounts.length,
      totalBanks: banks.length,
      totalBranches: branches.length,
      monthlyTransactions: monthlyTransactions.length,
      monthlyVolume: monthlyTransactions.reduce((sum, t) => sum + t.amount, 0)
    };
  };

  const stats = getReportStats();

  const reportTypes = [
    {
      id: 'customer' as const,
      label: 'Customer Reports',
      icon: Users,
      description: 'Customer demographics, account details, and transaction patterns',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      id: 'bank' as const,
      label: 'Bank Reports',
      icon: Building2,
      description: 'Bank-wise performance, account distribution, and financial metrics',
      color: 'text-green-600 bg-green-50 border-green-200'
    },
    {
      id: 'branch' as const,
      label: 'Branch Reports',
      icon: MapPin,
      description: 'Branch-wise operations, customer base, and transaction volumes',
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    }
  ];

  const periods = [
    { id: 'daily' as const, label: 'Daily' },
    { id: 'weekly' as const, label: 'Weekly' },
    { id: 'monthly' as const, label: 'Monthly' },
    { id: 'quarterly' as const, label: 'Quarterly' },
    { id: 'halfyearly' as const, label: 'Half-Yearly' },
    { id: 'annually' as const, label: 'Annually' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800">Report Request System</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={checkDatabase}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm hover:bg-blue-200 transition-colors"
          >
            Debug DB
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm">
            <ExternalLink className="h-4 w-4" />
            External Report Generation
          </div>
        </div>
      </div>

      {/* Debug Information */}
      {showDebug && debugInfo && (
        <div className="bg-gray-900 text-green-400 rounded-lg p-6 mb-6 font-mono text-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold">🔍 Database Debug Information</h3>
            <div className="flex gap-2">
              <button
                onClick={fetchReports}
                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
              >
                Fetch Reports
              </button>
              <button
                onClick={() => setShowDebug(false)}
                className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <p><span className="text-yellow-400">Database:</span> {debugInfo.databaseName}</p>
            <p><span className="text-yellow-400">Collections:</span> [{debugInfo.collections?.join(', ')}]</p>
            <p><span className="text-yellow-400">Reports Count:</span> {debugInfo.reportsCollectionCount}</p>
            {debugInfo.reports && (
              <div>
                <p><span className="text-yellow-400">Recent Reports:</span></p>
                <pre className="text-xs bg-gray-800 p-2 rounded mt-1 overflow-auto max-h-40">
                  {JSON.stringify(debugInfo.reports, null, 2)}
                </pre>
              </div>
            )}
            {debugInfo.error && (
              <p><span className="text-red-400">Error:</span> {debugInfo.error}</p>
            )}
          </div>
        </div>
      )}

      {/* System Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Database className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-800">Integration Information</h3>
        </div>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Reports are generated by an external report generation system</p>
          <p>• Banking system provides data through REST APIs</p>
          <p>• Report requests are sent with necessary parameters and filters</p>
          <p>• External system fetches data using: <code className="bg-blue-100 px-1 rounded">http://localhost:5000/api</code></p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600">Customers</p>
              <p className="text-xl font-bold text-blue-800">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-green-600">Banks</p>
              <p className="text-xl font-bold text-green-800">{stats.totalBanks}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-purple-600">Branches</p>
              <p className="text-xl font-bold text-purple-800">{stats.totalBranches}</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm text-orange-600">Accounts</p>
              <p className="text-xl font-bold text-orange-800">{stats.totalAccounts}</p>
            </div>
          </div>
        </div>
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-teal-600" />
            <div>
              <p className="text-sm text-teal-600">Monthly Txns</p>
              <p className="text-xl font-bold text-teal-800">{stats.monthlyTransactions}</p>
            </div>
          </div>
        </div>
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-rose-600" />
            <div>
              <p className="text-sm text-rose-600">Monthly Vol</p>
              <p className="text-xl font-bold text-rose-800">₹{stats.monthlyVolume.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Select Report Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportTypes.map(type => {
            const Icon = type.icon;
            return (
              <div
                key={type.id}
                onClick={() => setReportType(type.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  reportType === type.id 
                    ? type.color + ' border-opacity-100' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`h-6 w-6 ${reportType === type.id ? type.color.split(' ')[0] : 'text-gray-400'}`} />
                  <h4 className={`font-semibold ${reportType === type.id ? 'text-gray-800' : 'text-gray-600'}`}>
                    {type.label}
                  </h4>
                </div>
                <p className={`text-sm ${reportType === type.id ? 'text-gray-700' : 'text-gray-500'}`}>
                  {type.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Report Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Period Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Report Period</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {periods.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    period === p.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Custom Date Range */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-3">Custom Date Range (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="space-y-4">
            {/* Bank Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank (Optional)</label>
              <select
                value={selectedBank}
                onChange={(e) => {
                  setSelectedBank(e.target.value);
                  setSelectedBranch(''); // Reset branch when bank changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Banks</option>
                {banks.map(bank => (
                  <option key={bank.id} value={bank.id}>{bank.name}</option>
                ))}
              </select>
            </div>

            {/* Branch Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch (Optional)</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                disabled={!selectedBank}
              >
                <option value="">All Branches</option>
                {branches
                  .filter(branch => !selectedBank || branch.bankId === selectedBank)
                  .map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
              </select>
              {!selectedBank && (
                <p className="text-sm text-gray-500 mt-1">Select a bank first to filter by branch</p>
              )}
            </div>

            {/* Send Request Button */}
            <button
              onClick={handleSendRequest}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send Report Request to External System
            </button>
          </div>
        </div>
      </div>

      {/* API Information */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">External System Integration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Available APIs for Report Generation</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>• <code className="bg-gray-200 px-1 rounded">GET /customers</code> - Customer data</p>
              <p>• <code className="bg-gray-200 px-1 rounded">GET /banks</code> - Bank information</p>
              <p>• <code className="bg-gray-200 px-1 rounded">GET /branches</code> - Branch details</p>
              <p>• <code className="bg-gray-200 px-1 rounded">GET /accounts</code> - Account information</p>
              <p>• <code className="bg-gray-200 px-1 rounded">GET /transactions</code> - Transaction history</p>
              <p>• <code className="bg-gray-200 px-1 rounded">GET /kyc</code> - KYC records</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Request Configuration</h4>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-sm space-y-2">
                <p><span className="font-medium">Type:</span> {reportTypes.find(t => t.id === reportType)?.label}</p>
                <p><span className="font-medium">Period:</span> {periods.find(p => p.id === period)?.label}</p>
                {selectedBank && (
                  <p><span className="font-medium">Bank:</span> {banks.find(b => b.id === selectedBank)?.name}</p>
                )}
                {selectedBranch && (
                  <p><span className="font-medium">Branch:</span> {branches.find(b => b.id === selectedBranch)?.name}</p>
                )}
                {dateRange.startDate && dateRange.endDate && (
                  <p><span className="font-medium">Date Range:</span> {dateRange.startDate} to {dateRange.endDate}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> The external report generation system will receive this request and use the banking system APIs to fetch the required data. 
            Reports will be generated and delivered through the external system's own delivery mechanism.
          </p>
        </div>
      </div>
    </div>
  );
}