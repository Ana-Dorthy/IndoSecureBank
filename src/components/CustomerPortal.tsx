import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown, 
  Receipt, 
  User,
  LogOut,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Building2,
  MapPin,
  Info,
  Plus,
  PiggyBank,
  FileText,
  Calculator,
  Briefcase,
  Home,
  Car,
  GraduationCap,
  Clock
} from 'lucide-react';
import { Customer, Account, Transaction, Bank, Branch, KYC } from '../types';
import LoanEligibility from './LoanEligibility';
import LoanApplicationForm from './LoanApplicationForm';

interface CustomerPortalProps {
  customer: Customer;
  accounts: Account[];
  transactions: Transaction[];
  banks: Bank[];
  branches: Branch[];
  kycRecords: KYC[];
  onLogout: () => void;
  onDeposit: (accountId: string, amount: number, description: string) => void;
  onWithdraw: (accountId: string, amount: number, description: string) => void;
  onTransfer: (fromAccountId: string, toAccountId: string, amount: number, description: string) => void;
  onCheckWithdrawEligibility: (customerId: string, amount: number) => Promise<{ eligible: boolean; message: string }>;
}

interface LoanType {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  minIncome: number;
  minCibilScore: number;
  accountTypes: string[];
  interestRate: string;
  maxAmount: string;
  tenure: string;
  features: string[];
}

export default function CustomerPortal({ 
  customer, 
  accounts, 
  transactions, 
  banks,
  branches,
  kycRecords,
  onLogout,
  onDeposit,
  onWithdraw,
  onTransfer,
  onCheckWithdrawEligibility
}: CustomerPortalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'credit-debit' | 'transfer' | 'statement' | 'loans '| 'account-statement'>('overview');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [toAccount, setToAccount] = useState<string>('');
  const [withdrawEligibility, setWithdrawEligibility] = useState<{ eligible: boolean; message: string } | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [activesTab, setActivesTab] = useState<'eligibility' | 'apply' | 'status'>('eligibility');
  const [applications, setApplications] = useState<any[]>([]);
const [loadingApplications, setLoadingApplications] = useState(true);
  // Get applications using customer.id instead of user?.id
  // const applications = JSON.parse(localStorage.getItem('loan_applications') || '[]')
  //   .filter((app: any) => app.customerId === customer.id);

  // Mock customer credit profile - in real app this would come from credit bureau
  const [statementForm, setStatementForm] = useState({
  customer_id: '',
  from_date: '',
  to_date: ''
});
const [pdfBase64, setPdfBase64] = useState<string | null>(null);

  const customerCreditProfile = {
    cibilScore: 750, // Mock CIBIL score
    annualIncome: 600000, // Mock annual income (6 lakhs)
    hasExistingLoans: false,
    creditHistory: 'good'
  };
 
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'under_review': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const customerAccounts = accounts.filter(acc => acc.customerId === customer.id);
  const customerTransactions = transactions.filter(t => 
    customerAccounts.some(acc => acc.id === t.accountId)
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Get KYC record for this customer
  const customerKYC = kycRecords.find(kyc => kyc.customerId === customer.id);
  
  // Get banks associated with customer's PAN through KYC
  const associatedBanks = customerKYC 
    ? banks.filter(bank => customerKYC.linkedBanks.includes(bank.id))
    : [];

  // Get branches for associated banks
  const associatedBranches = branches.filter(branch => 
    associatedBanks.some(bank => bank.id === branch.bankId)
  );

  // Filter customer accounts to only show those from associated banks
  const validCustomerAccounts = customerAccounts.filter(account => 
    associatedBanks.some(bank => bank.id === account.bankId)
  );

  const totalBalance = validCustomerAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Check if customer has business accounts (current accounts are typically business)
  const hasBusinessAccount = validCustomerAccounts.some(acc => acc.accountType === 'current');
  const accountTypes = [...new Set(validCustomerAccounts.map(acc => acc.accountType))];
  
  // Define loan types based on account type and eligibility
  const loanTypes: LoanType[] = [
    {
      id: 'personal',
      name: 'Personal Loan',
      description: 'Quick personal loans for immediate needs',
      icon: User,
      minIncome: 300000, // 3 lakhs
      minCibilScore: 650,
      accountTypes: ['savings', 'salary'],
      interestRate: '10.5% - 18%',
      maxAmount: '₹10,00,000',
      tenure: '12 to 60 months',
      features: ['No collateral required', 'Quick processing', 'Flexible repayment', 'Digital application']
    },
    {
      id: 'home',
      name: 'Home Loan',
      description: 'Finance your dream home with competitive rates',
      icon: Home,
      minIncome: 400000, // 4 lakhs
      minCibilScore: 700,
      accountTypes: ['savings', 'salary', 'current'],
      interestRate: '8.5% - 11%',
      maxAmount: '₹5,00,00,000',
      tenure: '10 to 30 years',
      features: ['Tax benefits', 'Low interest rates', 'Long tenure', 'Property insurance included']
    },
    {
      id: 'business',
      name: 'Business Loan',
      description: 'Grow your business with working capital',
      icon: Briefcase,
      minIncome: 500000, // 5 lakhs
      minCibilScore: 680,
      accountTypes: ['current'],
      interestRate: '11% - 16%',
      maxAmount: '₹50,00,000',
      tenure: '12 to 84 months',
      features: ['Working capital', 'Equipment financing', 'Fast approval', 'Minimal documentation']
    },
    {
      id: 'car',
      name: 'Car Loan',
      description: 'Drive your dream car today',
      icon: Car,
      minIncome: 250000, // 2.5 lakhs
      minCibilScore: 650,
      accountTypes: ['savings', 'salary', 'current'],
      interestRate: '7.5% - 12%',
      maxAmount: '₹1,00,00,000',
      tenure: '12 to 84 months',
      features: ['Up to 90% financing', 'New & used cars', 'Insurance included', 'Easy EMI']
    },
    {
      id: 'education',
      name: 'Education Loan',
      description: 'Invest in your future with education financing',
      icon: GraduationCap,
      minIncome: 200000, // 2 lakhs (for co-applicant)
      minCibilScore: 600,
      accountTypes: ['savings', 'salary'],
      interestRate: '9% - 13%',
      maxAmount: '₹1,50,00,000',
      tenure: '5 to 15 years',
      features: ['No collateral up to 7.5L', 'Moratorium period', 'Tax benefits', 'Study abroad coverage']
    }
  ];

  // Check loan eligibility
  const checkLoanEligibility = (loanType: LoanType) => {
    const issues = [];
    
    if (customerCreditProfile.annualIncome < 100000) {
      issues.push('Annual income must be more than ₹1,00,000');
    }
    
    if (customerCreditProfile.annualIncome < loanType.minIncome) {
      issues.push(`Minimum annual income required: ₹${(loanType.minIncome / 100000).toFixed(1)} lakhs`);
    }
    
    if (customerCreditProfile.cibilScore < loanType.minCibilScore) {
      issues.push(`Minimum CIBIL score required: ${loanType.minCibilScore}`);
    }
    
    if (!loanType.accountTypes.some(type => accountTypes.includes(type))) {
      issues.push(`Required account type: ${loanType.accountTypes.join(' or ')}`);
    }
    
    if (!customerKYC || customerKYC.verificationStatus !== 'verified') {
      issues.push('KYC verification required');
    }

    return {
      eligible: issues.length === 0,
      issues
    };
  };

  // Get eligible loans
  const eligibleLoans = loanTypes.filter(loan => checkLoanEligibility(loan).eligible);
  const ineligibleLoans = loanTypes.filter(loan => !checkLoanEligibility(loan).eligible);

  // Debug information
  const debugInfo = {
    customerId: customer.id,
    customerPAN: customer.panNumber,
    totalKYCRecords: kycRecords.length,
    customerKYCExists: !!customerKYC,
    customerKYCId: customerKYC?.id,
    linkedBankIds: customerKYC?.linkedBanks || [],
    totalBanks: banks.length,
    associatedBanksCount: associatedBanks.length,
    totalCustomerAccounts: customerAccounts.length,
    validAccountsCount: validCustomerAccounts.length,
    allBankIds: banks.map(b => b.id),
    accountBankIds: customerAccounts.map(acc => acc.bankId)
  };

  const getBankName = (bankId: string) => {
    const bank = banks.find(b => b.id === bankId);
    return bank ? bank.name : 'Unknown Bank';
  };

  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unknown Branch';
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAccount && amount && parseFloat(amount) > 0) {
      await onDeposit(selectedAccount, parseFloat(amount), description || 'Cash Deposit');
      setAmount('');
      setDescription('');
      setSelectedAccount('');
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAccount && amount && parseFloat(amount) > 0) {
      // Check eligibility first
      const eligibility = await onCheckWithdrawEligibility(customer.id, parseFloat(amount));
      setWithdrawEligibility(eligibility);
      
      if (eligibility.eligible) {
        await onWithdraw(selectedAccount, parseFloat(amount), description || 'Cash Withdrawal');
        setAmount('');
        setDescription('');
        setSelectedAccount('');
        setWithdrawEligibility(null);
      }
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAccount && toAccount && amount && parseFloat(amount) > 0) {
      const fromAccount = validCustomerAccounts.find(acc => acc.id === selectedAccount);
      if (fromAccount && fromAccount.balance >= parseFloat(amount)) {
        await onTransfer(selectedAccount, toAccount, parseFloat(amount), description || 'Fund Transfer');
        setAmount('');
        setDescription('');
        setSelectedAccount('');
        setToAccount('');
      } else {
        alert('Insufficient balance!');
      }
    }
  };

  const handleLoanApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    const loanData = {
      customerId: customer.id, // Using customer.id instead of user?.id
      loanType: 'home', // Or pick from UI
      amount: parseFloat(amount),
      tenure: 36,
      interestRate: 9.5,
      details: {
        reason: description
      }
    };

    const res = await fetch('http://localhost:5000/api/loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loanData)
    });

    if (res.ok) {
      alert('Loan application submitted!');
      setAmount('');
      setDescription('');
    } else {
      alert('Failed to apply for loan');
    }
  };

  const tabs = [
    { id: 'overview' as const, label: 'Account Overview', icon: User },
    { id: 'credit-debit' as const, label: 'Credit/Debit', icon: CreditCard },
    { id: 'transfer' as const, label: 'Transfer', icon: ArrowUpDown },
    { id: 'loans' as const, label: 'Loans', icon: PiggyBank },
    { id: 'statement' as const, label: 'Statement', icon: Receipt },
  ];

  const loanTabs = [
    { id: 'eligibility', label: 'Check Eligibility', icon: TrendingUp },
    { id: 'apply', label: 'Apply for Loan', icon: FileText },
    { id: 'status', label: 'Application Status', icon: Clock }
  ];
useEffect(() => {
  const fetchApplications = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/loans?customerId=${customer.id}`);
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error("Failed to fetch loan applications:", error);
    } finally {
      setLoadingApplications(false);
    }
  };

  fetchApplications();
}, [customer.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-800">Customer Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-800">{customer.firstName} {customer.lastName}</p>
                <p className="text-xs text-gray-500">PAN: {customer.panNumber}</p>
              </div>
              <button
                onClick={() => setShowDebugInfo(!showDebugInfo)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                <Info className="h-4 w-4" />
                Debug
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Debug Information */}
        {showDebugInfo && (
          <div className="bg-gray-900 text-green-400 rounded-lg p-6 mb-8 font-mono text-sm">
            <h3 className="text-white font-bold mb-4">🔍 Debug Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-yellow-400 font-semibold mb-2">Customer Info:</h4>
                <p>Customer ID: {debugInfo.customerId}</p>
                <p>PAN Number: {debugInfo.customerPAN}</p>
                <p>KYC Record Exists: {debugInfo.customerKYCExists ? '✅ Yes' : '❌ No'}</p>
                {debugInfo.customerKYCId && <p>KYC ID: {debugInfo.customerKYCId}</p>}
              </div>
              <div>
                <h4 className="text-yellow-400 font-semibold mb-2">Credit Profile:</h4>
                <p>CIBIL Score: {customerCreditProfile.cibilScore}</p>
                <p>Annual Income: ₹{customerCreditProfile.annualIncome.toLocaleString()}</p>
                <p>Credit History: {customerCreditProfile.creditHistory}</p>
                <p>Has Business A/c: {hasBusinessAccount ? '✅ Yes' : '❌ No'}</p>
              </div>
              <div>
                <h4 className="text-yellow-400 font-semibold mb-2">Bank Association:</h4>
                <p>Total Banks: {debugInfo.totalBanks}</p>
                <p>Linked Bank IDs: [{debugInfo.linkedBankIds.join(', ')}]</p>
                <p>Associated Banks: {debugInfo.associatedBanksCount}</p>
                <p>All Bank IDs: [{debugInfo.allBankIds.join(', ')}]</p>
              </div>
              <div>
                <h4 className="text-yellow-400 font-semibold mb-2">Account Info:</h4>
                <p>Total Customer Accounts: {debugInfo.totalCustomerAccounts}</p>
                <p>Valid Accounts (in linked banks): {debugInfo.validAccountsCount}</p>
                <p>Account Types: [{accountTypes.join(', ')}]</p>
                <p>Account Bank IDs: [{debugInfo.accountBankIds.join(', ')}]</p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-purple-900 rounded">
              <h4 className="text-purple-400 font-semibold mb-2">Loan Eligibility Summary:</h4>
              <p>Eligible Loans: {eligibleLoans.length} out of {loanTypes.length}</p>
              <p>Income Requirement Met: {customerCreditProfile.annualIncome >= 100000 ? '✅ Yes' : '❌ No'}</p>
              <p>KYC Verified: {customerKYC?.verificationStatus === 'verified' ? '✅ Yes' : '❌ No'}</p>
            </div>
          </div>
        )}

        {/* KYC Status & Associated Banks */}
        {customerKYC ? (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Banking Network Access</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                customerKYC.verificationStatus === 'verified' 
                  ? 'bg-green-100 text-green-800' 
                  : customerKYC.verificationStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                KYC {customerKYC.verificationStatus}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Associated Banks ({associatedBanks.length})</h4>
                <div className="space-y-2">
                  {associatedBanks.map(bank => (
                    <div key={bank.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-800">{bank.name}</p>
                        <p className="text-sm text-blue-600">Code: {bank.code}</p>
                      </div>
                    </div>
                  ))}
                  {associatedBanks.length === 0 && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-yellow-800 text-sm">⚠️ No banks linked to your KYC profile</p>
                      <p className="text-yellow-700 text-xs mt-1">Contact admin to link banks to your PAN: {customer.panNumber}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Available Branches ({associatedBranches.length})</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {associatedBranches.map(branch => (
                    <div key={branch.id} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg border border-green-200">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">{branch.name}</p>
                        <p className="text-xs text-green-600">{getBankName(branch.bankId)}</p>
                      </div>
                    </div>
                  ))}
                  {associatedBranches.length === 0 && (
                    <p className="text-gray-500 text-sm">No branches available</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-3">Credit Profile</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg border border-purple-200">
                    <span className="text-sm text-purple-700">CIBIL Score</span>
                    <span className={`font-bold text-sm ${customerCreditProfile.cibilScore >= 750 ? 'text-green-600' : customerCreditProfile.cibilScore >= 650 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {customerCreditProfile.cibilScore}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg border border-purple-200">
                    <span className="text-sm text-purple-700">Annual Income</span>
                    <span className="font-bold text-sm text-purple-800">₹{(customerCreditProfile.annualIncome / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg border border-purple-200">
                    <span className="text-sm text-purple-700">Account Type</span>
                    <span className="font-bold text-sm text-purple-800">{hasBusinessAccount ? 'Business' : 'Retail'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-800">KYC Verification Required</h3>
                <p className="text-yellow-700">No KYC record found for PAN: {customer.panNumber}</p>
                <p className="text-yellow-600 text-sm mt-1">Please contact admin to create your KYC profile and link banks.</p>
              </div>
            </div>
          </div>
        )}

        {/* Account Creation Notice */}
        {customerKYC && associatedBanks.length > 0 && validCustomerAccounts.length === 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3">
              <Plus className="h-6 w-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-800">No Accounts Found</h3>
                <p className="text-orange-700">You have {associatedBanks.length} banks linked but no accounts created yet.</p>
                <p className="text-orange-600 text-sm mt-1">
                  Contact admin to create accounts in: {associatedBanks.map(b => b.name).join(', ')}
                </p>
                <div className="mt-3 p-3 bg-orange-100 rounded-lg">
                  <p className="text-sm text-orange-800 font-medium">📋 Admin Instructions:</p>
                  <p className="text-xs text-orange-700 mt-1">
                    Go to Admin Panel → Customer Operations → Create Account → Select this customer ({customer.firstName} {customer.lastName}) → Choose one of the linked banks
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-green-600">₹{totalBalance.toLocaleString()}</p>
                <p className="text-xs text-gray-500">From {validCustomerAccounts.length} valid accounts</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-gray-600">Valid Accounts</p>
                <p className="text-2xl font-bold text-blue-600">{validCustomerAccounts.length}</p>
                <p className="text-xs text-gray-500">Out of {customerAccounts.length} total</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-gray-600">Recent Transactions</p>
                <p className="text-2xl font-bold text-purple-600">{customerTransactions.slice(0, 10).length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-gray-600">Loan Eligibility</p>
                <p className="text-2xl font-bold text-orange-600">{eligibleLoans.length}/{loanTypes.length}</p>
                <p className="text-xs text-gray-500">Products available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Account Overview */}
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Account Overview</h3>
              <div className="space-y-4">
                {validCustomerAccounts.map(account => (
                  <div key={account.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-800">Account: {account.accountNumber}</h4>
                        <p className="text-sm text-gray-600 capitalize">{account.accountType.replace('_', ' ')}</p>
                        <p className="text-xs text-blue-600">Customer A/c: {customer.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{getBankName(account.bankId)}</p>
                        <p className="text-sm text-gray-600">{getBranchName(account.branchId)}</p>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {account.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">₹{account.balance.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Available Balance</p>
                      </div>
                    </div>
                  </div>
                ))}
                {validCustomerAccounts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">No accounts found in your associated banks</p>
                    {!customerKYC ? (
                      <p className="text-sm mt-2">Complete KYC verification to access banking services</p>
                    ) : associatedBanks.length === 0 ? (
                      <p className="text-sm mt-2">No banks linked to your KYC profile</p>
                    ) : (
                      <div className="mt-4">
                        <p className="text-sm mb-2">You have access to these banks but no accounts yet:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {associatedBanks.map(bank => (
                            <span key={bank.id} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                              {bank.name}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm mt-3 text-orange-600 font-medium">
                          📞 Contact admin to create accounts in these banks
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Credit/Debit Operations */}
          {activeTab === 'credit-debit' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Credit/Debit Operations</h3>
              
              {validCustomerAccounts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No accounts available for transactions</p>
                  {!customerKYC ? (
                    <p className="text-sm mt-2">Complete KYC verification to access banking services</p>
                  ) : (
                    <p className="text-sm mt-2 text-orange-600">Contact admin to create accounts in your linked banks</p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Deposit (Credit) */}
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                      <h4 className="text-lg font-semibold text-green-800">Credit (Deposit)</h4>
                    </div>
                    <form onSubmit={handleDeposit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Account</label>
                        <select
                          required
                          value={selectedAccount}
                          onChange={(e) => setSelectedAccount(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Choose account</option>
                          {validCustomerAccounts.filter(acc => acc.status === 'active').map(account => (
                            <option key={account.id} value={account.id}>
                              {account.accountNumber} - {getBankName(account.bankId)} (₹{account.balance.toLocaleString()})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input
                          type="number"
                          required
                          min="0.01"
                          step="0.01"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="Enter amount"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                        <input
                          type="text"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="Enter description"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Deposit Funds
                      </button>
                    </form>
                  </div>

                  {/* Withdraw (Debit) */}
                  <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingDown className="h-6 w-6 text-red-600" />
                      <h4 className="text-lg font-semibold text-red-800">Debit (Withdraw)</h4>
                    </div>
                    <form onSubmit={handleWithdraw} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Account</label>
                        <select
                          required
                          value={selectedAccount}
                          onChange={(e) => setSelectedAccount(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">Choose account</option>
                          {validCustomerAccounts.filter(acc => acc.status === 'active').map(account => (
                            <option key={account.id} value={account.id}>
                              {account.accountNumber} - {getBankName(account.bankId)} (₹{account.balance.toLocaleString()})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input
                          type="number"
                          required
                          min="0.01"
                          step="0.01"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          placeholder="Enter amount"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                        <input
                          type="text"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          placeholder="Enter description"
                        />
                      </div>
                      
                      {withdrawEligibility && (
                        <div className={`p-3 rounded-lg border ${
                          withdrawEligibility.eligible 
                            ? 'bg-green-50 border-green-200 text-green-800' 
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                          <div className="flex items-center gap-2">
                            {withdrawEligibility.eligible ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <AlertCircle className="h-4 w-4" />
                            )}
                            <span className="text-sm font-medium">{withdrawEligibility.message}</span>
                          </div>
                        </div>
                      )}
                      
                      <button
                        type="submit"
                        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Withdraw Funds
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Transfer */}
          {activeTab === 'transfer' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Fund Transfer</h3>
              
              {validCustomerAccounts.length < 2 ? (
                <div className="text-center py-8 text-gray-500">
                  <ArrowUpDown className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>You need at least 2 accounts to transfer funds</p>
                  <p className="text-sm mt-2">Current valid accounts: {validCustomerAccounts.length}</p>
                  {validCustomerAccounts.length === 0 && (
                    <p className="text-sm mt-2 text-orange-600">Contact admin to create accounts in your linked banks</p>
                  )}
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  <form onSubmit={handleTransfer} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
                      <select
                        required
                        value={selectedAccount}
                        onChange={(e) => setSelectedAccount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Choose source account</option>
                        {validCustomerAccounts.filter(acc => acc.status === 'active').map(account => (
                          <option key={account.id} value={account.id}>
                            {account.accountNumber} - {getBankName(account.bankId)} (₹{account.balance.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">To Account</label>
                      <select
                        required
                        value={toAccount}
                        onChange={(e) => setToAccount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Choose destination account</option>
                        {validCustomerAccounts.filter(acc => acc.status === 'active' && acc.id !== selectedAccount).map(account => (
                          <option key={account.id} value={account.id}>
                            {account.accountNumber} - {getBankName(account.bankId)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <input
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter amount"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter description"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Transfer Funds
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeTab === 'loans' && (
            <div className="min-h-screen bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">Welcome back, {customer.firstName} {customer.lastName}!</h1>
                  <p className="text-gray-600 mt-2">Manage your loans and check eligibility for new ones</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Active Applications</h3>
                        <p className="text-2xl font-bold text-blue-600">{applications.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Credit Score</h3>
                        <p className="text-2xl font-bold text-green-600">{customerCreditProfile.cibilScore}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <FileText className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Approved Loans</h3>
                        <p className="text-2xl font-bold text-purple-600">
                          {applications.filter((app: any) => app.status === 'approved').length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                  <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                      {loanTabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActivesTab(tab.id as any)}
                            className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                              activesTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {tab.label}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-96">
                  {activesTab === 'eligibility' && <LoanEligibility  customer={customer}/>}
                  {activesTab === 'apply' && <LoanApplicationForm customer={customer}/>}
                  {activesTab === 'status' && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                        <h2 className="text-2xl font-bold mb-2">Application Status</h2>
                        <p className="text-blue-100">Track the progress of your loan applications</p>
                      </div>

                      {applications.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
                          <p className="text-gray-600 mb-4">You haven't submitted any loan applications yet.</p>
                          <button
                            onClick={() => setActivesTab('apply')}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                          >
                            Apply for a Loan
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {applications.map((app: any) => (
                            <div key={app.id} className="bg-white rounded-lg shadow-sm p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">{app.loanProductName}</h3>
                                  <p className="text-sm text-gray-600">Applied on {new Date(app.appliedDate).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(app.status)}`}>
                                  {app.status.replace('_', ' ')}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <span className="text-sm text-gray-600">Requested Amount</span>
                                  <div className="text-lg font-semibold text-gray-900">
                                    ₹{app.requestedAmount.toLocaleString()}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-600">Tenure</span>
                                  <div className="text-lg font-semibold text-gray-900">{app.tenure} months</div>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-600">Application ID</span>
                                  <div className="text-sm font-mono text-gray-700">{app.id.slice(0, 8)}...</div>
                                </div>
                              </div>

                              {app.remarks && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                  <span className="text-sm font-medium text-gray-700">Remarks:</span>
                                  <p className="text-sm text-gray-600 mt-1">{app.remarks}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


          {/* Statement */}
          {activeTab === 'statement' && (
            <div>
              <h3 className="text-lg font-semibold mb-6">Transaction Statement</h3>
              
              {validCustomerAccounts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No accounts available for statement</p>
                  <p className="text-sm mt-2 text-orange-600">Contact admin to create accounts in your linked banks</p>
                </div>
              ) : (
                <>
                  <div className="max-w-md mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Account</label>
                    <select
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Choose account</option>
                      {validCustomerAccounts.map(account => (
                        <option key={account.id} value={account.id}>
                          {account.accountNumber} - {getBankName(account.bankId)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedAccount && (
                    <div className="space-y-4">
                      {customerTransactions
                        .filter(t => t.accountId === selectedAccount)
                        .slice(0, 20)
                        .map(transaction => {
                          const account = validCustomerAccounts.find(acc => acc.id === transaction.accountId);
                          return (
                            <div key={transaction.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-gray-800">{transaction.description}</p>
                                  <p className="text-sm text-gray-600">
                                    Account: {account?.accountNumber} | {new Date(transaction.createdAt).toLocaleString()}
                                  </p>
                                  <p className="text-xs text-gray-500">Ref: {transaction.referenceNumber}</p>
                                </div>
                                <div className="text-right">
                                  <p className={`font-semibold ${
                                    transaction.type === 'deposit' || transaction.type === 'transfer_in' 
                                      ? 'text-green-600' 
                                      : 'text-red-600'
                                  }`}>
                                    {transaction.type === 'deposit' || transaction.type === 'transfer_in' ? '+' : '-'}
                                    ₹{transaction.amount.toLocaleString()}
                                  </p>
                                  <p className="text-sm text-gray-600">Balance: ₹{transaction.balance.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      {customerTransactions.filter(t => t.accountId === selectedAccount).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No transactions found for this account </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {activeTab === 'account-statement' && (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Fetch Bank Statement</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer ID</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={statementForm.customer_id}
            onChange={(e) => setStatementForm({ ...statementForm, customer_id: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">From Date</label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={statementForm.from_date}
            onChange={(e) => setStatementForm({ ...statementForm, from_date: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">To Date</label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={statementForm.to_date}
            onChange={(e) => setStatementForm({ ...statementForm, to_date: e.target.value })}
          />
        </div>
      </div>

      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
        onClick={async () => {
          try {
            const response = await fetch('http://127.0.0.1:8000/api/friend-bank-statement', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify([statementForm])
            });

            const data = await response.json();
            setPdfBase64(data.pdf_encrypted || null);
          } catch (err) {
            alert('Failed to fetch bank statement');
          }
        }}
      >
        Get Statement
      </button>
    </div>

    {pdfBase64 && (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Statement</h3>
        <iframe
          src={`data:application/pdf;base64,${pdfBase64}`}
          width="100%"
          height="600px"
          title="Bank Statement"
        />
      </div>
    )}
  </div>
)}

        </div>
      </div>
    </div>
  ); }