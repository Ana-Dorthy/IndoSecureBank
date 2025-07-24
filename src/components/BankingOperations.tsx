//modified by prasanna-11/07/25
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calculator, 
  FileCheck, 
  RefreshCw, 
  CreditCard, 
  TrendingUp, 
  Shield, 
  Database,
  AlertTriangle,
  CheckCircle,
  Calendar,
  DollarSign,
  Archive,
  Settings
} from 'lucide-react';
import { Bank, Branch, Customer, Account, Transaction } from '../types';

interface BankingOperationsProps {
  banks: Bank[];
  branches: Branch[];
  customers: Customer[];
  accounts: Account[];
  transactions: Transaction[];
}

interface BatchJob {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime?: string;
  endTime?: string;
  recordsProcessed: number;
  errors: number;
}

interface ComplianceReport {
  id: string;
  type: string;
  generatedDate: string;
  status: 'draft' | 'submitted' | 'approved';
  recordCount: number;
}

export default function BankingOperations({ 
  banks, 
  branches, 
  customers, 
  accounts, 
  transactions 
}: BankingOperationsProps) {
  const [activeSection, setActiveSection] = useState<string>('eod');
  const [batchJobs, setBatchJobs] = useState<BatchJob[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Initialize sample data
  useEffect(() => {
    setBatchJobs([
      {
        id: '1',
        name: 'Interest Accrual - Savings Accounts',
        type: 'interest_accrual',
        status: 'completed',
        startTime: '2024-01-15T23:00:00',
        endTime: '2024-01-15T23:15:00',
        recordsProcessed: 15420,
        errors: 0
      },
      {
        id: '2',
        name: 'Monthly Maintenance Fees',
        type: 'fee_application',
        status: 'completed',
        startTime: '2024-01-15T23:30:00',
        endTime: '2024-01-15T23:45:00',
        recordsProcessed: 8750,
        errors: 2
      },
      {
        id: '3',
        name: 'Daily Reconciliation',
        type: 'reconciliation',
        status: 'running',
        startTime: '2024-01-16T00:00:00',
        recordsProcessed: 12500,
        errors: 0
      }
    ]);

    setComplianceReports([
      {
        id: '1',
        type: 'RBI Daily Return',
        generatedDate: '2024-01-15',
        status: 'submitted',
        recordCount: 25000
      },
      {
        id: '2',
        type: 'AML Transaction Report',
        generatedDate: '2024-01-15',
        status: 'approved',
        recordCount: 1250
      },
      {
        id: '3',
        type: 'NPA Classification Report',
        generatedDate: '2024-01-15',
        status: 'draft',
        recordCount: 450
      }
    ]);
  }, []);

  const runBatchJob = (jobType: string, jobName: string) => {
    const newJob: BatchJob = {
      id: Date.now().toString(),
      name: jobName,
      type: jobType,
      status: 'running',
      startTime: new Date().toISOString(),
      recordsProcessed: 0,
      errors: 0
    };

    setBatchJobs(prev => [newJob, ...prev]);

    // Simulate job completion
    setTimeout(() => {
      setBatchJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? {
              ...job,
              status: 'completed',
              endTime: new Date().toISOString(),
              recordsProcessed: Math.floor(Math.random() * 10000) + 1000,
              errors: Math.floor(Math.random() * 5)
            }
          : job
      ));
    }, 3000);
  };

  const generateReport = (reportType: string) => {
    const newReport: ComplianceReport = {
      id: Date.now().toString(),
      type: reportType,
      generatedDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      recordCount: Math.floor(Math.random() * 5000) + 1000
    };

    setComplianceReports(prev => [newReport, ...prev]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const sections = [
    { id: 'eod', label: 'End-of-Day Processing', icon: Clock },
    { id: 'clearing', label: 'Clearing & Settlement', icon: RefreshCw },
    { id: 'maintenance', label: 'Account Maintenance', icon: Settings },
    { id: 'loans', label: 'Loan Operations', icon: CreditCard },
    { id: 'compliance', label: 'Compliance & Reporting', icon: FileCheck },
    { id: 'gl', label: 'General Ledger', icon: Calculator },
    { id: 'backup', label: 'Data Management', icon: Database }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800">Banking Operations Center</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Processing Date: <span className="font-medium">{selectedDate}</span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-indigo-600 text-white border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* End-of-Day Processing */}
      {activeSection === 'eod' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => runBatchJob('interest_accrual', 'Interest Accrual - All Accounts')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <Calculator className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Interest Accrual</h3>
              </div>
              <p className="text-sm text-gray-600">Calculate and post daily interest for all eligible accounts</p>
            </button>

            <button
              onClick={() => runBatchJob('fee_application', 'Monthly Maintenance Fees')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold">Fee Application</h3>
              </div>
              <p className="text-sm text-gray-600">Apply monthly fees, overdraft charges, and penalties</p>
            </button>

            <button
              onClick={() => runBatchJob('reconciliation', 'Daily Reconciliation')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <FileCheck className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Reconciliation</h3>
              </div>
              <p className="text-sm text-gray-600">Compare transaction logs with core banking ledger</p>
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-4">Recent Batch Jobs</h3>
            <div className="space-y-3">
              {batchJobs.slice(0, 5).map(job => (
                <div key={job.id} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(job.status)}
                        <h4 className="font-medium">{job.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Records Processed: {job.recordsProcessed.toLocaleString()}</p>
                        {job.errors > 0 && <p className="text-red-600">Errors: {job.errors}</p>}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {job.startTime && <p>Started: {new Date(job.startTime).toLocaleTimeString()}</p>}
                      {job.endTime && <p>Completed: {new Date(job.endTime).toLocaleTimeString()}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Clearing & Settlement */}
      {activeSection === 'clearing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => runBatchJob('cheque_clearing', 'Inward Cheque Clearing')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <FileCheck className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold">Cheque Clearing</h3>
              </div>
              <p className="text-sm text-gray-600">Process inward/outward cheques through MICR network</p>
            </button>

            <button
              onClick={() => runBatchJob('interbank_settlement', 'Interbank Settlement')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <RefreshCw className="h-5 w-5 text-teal-600" />
                <h3 className="font-semibold">Interbank Settlement</h3>
              </div>
              <p className="text-sm text-gray-600">Net off ACH/NEFT/RTGS batches with central bank</p>
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Settlement Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-blue-600">Pending Settlements</p>
                <p className="text-2xl font-bold text-blue-800">₹2,45,67,890</p>
              </div>
              <div>
                <p className="text-blue-600">Cleared Today</p>
                <p className="text-2xl font-bold text-blue-800">₹15,23,45,670</p>
              </div>
              <div>
                <p className="text-blue-600">Failed Transactions</p>
                <p className="text-2xl font-bold text-red-600">12</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Maintenance */}
      {activeSection === 'maintenance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => runBatchJob('dormancy_check', 'Dormancy Check & Marking')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <h3 className="font-semibold">Dormancy Processing</h3>
              </div>
              <p className="text-sm text-gray-600">Identify and mark inactive accounts as dormant</p>
            </button>

            <button
              onClick={() => runBatchJob('maturity_processing', 'FD Maturity Processing')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Maturity Processing</h3>
              </div>
              <p className="text-sm text-gray-600">Process fixed deposit maturities and renewals</p>
            </button>

            <button
              onClick={() => runBatchJob('account_closure', 'Account Closure Processing')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold">Account Closures</h3>
              </div>
              <p className="text-sm text-gray-600">Process formal account closure requests</p>
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Account Status Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-yellow-600">Active Accounts</p>
                <p className="text-xl font-bold text-yellow-800">{accounts.filter(a => a.status === 'active').length}</p>
              </div>
              <div>
                <p className="text-yellow-600">Dormant Accounts</p>
                <p className="text-xl font-bold text-yellow-800">245</p>
              </div>
              <div>
                <p className="text-yellow-600">Maturing This Month</p>
                <p className="text-xl font-bold text-yellow-800">67</p>
              </div>
              <div>
                <p className="text-yellow-600">Closure Requests</p>
                <p className="text-xl font-bold text-yellow-800">12</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loan Operations */}
      {activeSection === 'loans' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => runBatchJob('emi_deduction', 'EMI Auto-Deduction')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">EMI Processing</h3>
              </div>
              <p className="text-sm text-gray-600">Auto-debit EMIs from borrower accounts</p>
            </button>

            <button
              onClick={() => runBatchJob('delinquency_check', 'Delinquency Monitoring')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold">Delinquency Check</h3>
              </div>
              <p className="text-sm text-gray-600">Flag overdue EMIs and generate notices</p>
            </button>

            <button
              onClick={() => runBatchJob('rate_repricing', 'Interest Rate Re-pricing')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Rate Re-pricing</h3>
              </div>
              <p className="text-sm text-gray-600">Adjust floating-rate loans based on benchmark changes</p>
            </button>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">Loan Portfolio Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-red-600">Total Loans</p>
                <p className="text-xl font-bold text-red-800">₹125.6 Cr</p>
              </div>
              <div>
                <p className="text-red-600">Overdue EMIs</p>
                <p className="text-xl font-bold text-red-800">₹2.3 Cr</p>
              </div>
              <div>
                <p className="text-red-600">NPA Accounts</p>
                <p className="text-xl font-bold text-red-800">45</p>
              </div>
              <div>
                <p className="text-red-600">Collection Efficiency</p>
                <p className="text-xl font-bold text-green-600">94.2%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance & Reporting */}
      {activeSection === 'compliance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => generateReport('RBI Daily Return')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <FileCheck className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold">RBI Reports</h3>
              </div>
              <p className="text-sm text-gray-600">Generate daily/monthly regulatory returns</p>
            </button>

            <button
              onClick={() => generateReport('AML Screening Report')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold">AML Screening</h3>
              </div>
              <p className="text-sm text-gray-600">Run transaction patterns through AML rules</p>
            </button>

            <button
              onClick={() => generateReport('Audit Trail Report')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <Database className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold">Audit Trail</h3>
              </div>
              <p className="text-sm text-gray-600">Maintain immutable transaction logs</p>
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-4">Compliance Reports</h3>
            <div className="space-y-3">
              {complianceReports.map(report => (
                <div key={report.id} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{report.type}</h4>
                      <p className="text-sm text-gray-600">
                        Generated: {new Date(report.generatedDate).toLocaleDateString()} | 
                        Records: {report.recordCount.toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* General Ledger */}
      {activeSection === 'gl' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => runBatchJob('gl_posting', 'GL Posting & Consolidation')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <Calculator className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">GL Posting</h3>
              </div>
              <p className="text-sm text-gray-600">Consolidate all day's debit/credit entries</p>
            </button>

            <button
              onClick={() => runBatchJob('financial_close', 'Financial Close Process')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <FileCheck className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Financial Close</h3>
              </div>
              <p className="text-sm text-gray-600">Generate trial balance and P&L statements</p>
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">Financial Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-green-600">Total Assets</p>
                <p className="text-2xl font-bold text-green-800">₹1,245.6 Cr</p>
              </div>
              <div>
                <p className="text-green-600">Total Liabilities</p>
                <p className="text-2xl font-bold text-green-800">₹1,156.3 Cr</p>
              </div>
              <div>
                <p className="text-green-600">Net Worth</p>
                <p className="text-2xl font-bold text-green-800">₹89.3 Cr</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Management */}
      {activeSection === 'backup' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => runBatchJob('database_backup', 'Database Backup')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <Database className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Database Backup</h3>
              </div>
              <p className="text-sm text-gray-600">Create nightly database snapshots</p>
            </button>

            <button
              onClick={() => runBatchJob('data_archival', 'Data Archival')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <Archive className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold">Data Archival</h3>
              </div>
              <p className="text-sm text-gray-600">Archive old transaction history to cold storage</p>
            </button>

            <button
              onClick={() => runBatchJob('data_purge', 'Data Purge')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold">Data Purge</h3>
              </div>
              <p className="text-sm text-gray-600">Remove expired temporary data and logs</p>
            </button>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-2">Storage Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-purple-600">Database Size</p>
                <p className="text-xl font-bold text-purple-800">2.4 TB</p>
              </div>
              <div>
                <p className="text-purple-600">Backup Size</p>
                <p className="text-xl font-bold text-purple-800">1.8 TB</p>
              </div>
              <div>
                <p className="text-purple-600">Archive Size</p>
                <p className="text-xl font-bold text-purple-800">15.6 TB</p>
              </div>
              <div>
                <p className="text-purple-600">Last Backup</p>
                <p className="text-xl font-bold text-purple-800">2h ago</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}