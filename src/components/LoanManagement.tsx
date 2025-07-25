import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Car, 
  Home, 
  Gem, 
  User, 
  Building, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  AlertTriangle,
  FileText,
  Users,
  Eye,
  Filter,
  Search,
  TrendingUp
} from 'lucide-react';

// Types
interface LoanApplication {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  loanType: 'jewelry' | 'vehicle' | 'home' | 'business';
  loanProductName: string;
  amount: number;
  requestedAmount: number;
  tenure: number;
  interestRate: number;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'under_review';
  applicationDate: string;
  appliedDate: string;
  details: any;
  purpose?: string;
  monthlyIncome: number;
  employmentType: string;
  processedBy?: string;
  remarks?: string;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  annualIncome: number;
  monthlyIncome: number;
  employmentType: string;
}

interface Account {
  id: string;
  customerId: string;
  accountType: 'current' | 'savings';
}

interface LoanEligibility {
  jewelry: boolean;
  vehicle: boolean;
  home: boolean;
  business: boolean;
  reasons: string[];
}

// Mock data
const mockCustomers: Customer[] = [
  { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', annualIncome: 600000, monthlyIncome: 50000, employmentType: 'salaried' },
  { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', annualIncome: 800000, monthlyIncome: 66667, employmentType: 'self_employed' },
  { id: '3', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', annualIncome: 300000, monthlyIncome: 25000, employmentType: 'salaried' },
];

const mockAccounts: Account[] = [
  { id: '1', customerId: '1', accountType: 'savings' },
  { id: '2', customerId: '1', accountType: 'current' },
  { id: '3', customerId: '2', accountType: 'current' },
  { id: '4', customerId: '3', accountType: 'savings' },
];

export default function ComprehensiveLoanManagement() {
  const [activeView, setActiveView] = useState<'customer' | 'officer'>('customer');
  const [currentUser, setCurrentUser] = useState({ name: 'John Officer', role: 'loan_officer' });
  
  // Customer view states
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [eligibility, setEligibility] = useState<LoanEligibility | null>(null);
  const [activeLoanType, setActiveLoanType] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Officer view states
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [remarks, setRemarks] = useState('');
  
  // Shared state
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  
  // Form states
  const [jewelryForm, setJewelryForm] = useState({
    goldWeight: 0,
    goldPurity: '22K',
    ornamentType: '',
    estimatedValue: 0,
    loanAmount: 0,
    tenure: 12
  });

  const [vehicleForm, setVehicleForm] = useState({
    vehicleType: 'car',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vehicleValue: 0,
    loanAmount: 0,
    tenure: 60,
    downPayment: 0
  });

  const [homeForm, setHomeForm] = useState({
    propertyType: 'apartment',
    propertyValue: 0,
    loanAmount: 0,
    tenure: 240,
    downPayment: 0,
    propertyAddress: '',
    constructionStatus: 'ready'
  });

  const [businessForm, setBusinessForm] = useState({
    businessType: '',
    annualTurnover: 0,
    businessAge: 0,
    loanAmount: 0,
    tenure: 36,
    purpose: '',
    collateral: ''
  });

  // Load initial data
  useEffect(() => {
    const savedApplications = localStorage.getItem('loan_applications');
    if (savedApplications) {
      setLoanApplications(JSON.parse(savedApplications));
    }
  }, []);

  // Save applications to localStorage
  useEffect(() => {
    localStorage.setItem('loan_applications', JSON.stringify(loanApplications));
  }, [loanApplications]);

  // Eligibility check
  const checkEligibility = (customerId: string): LoanEligibility => {
    const customer = mockCustomers.find(c => c.id === customerId);
    if (!customer) {
      return {
        jewelry: false,
        vehicle: false,
        home: false,
        business: false,
        reasons: ['Customer not found']
      };
    }

    const annualIncome = customer.annualIncome || 0;
    const hasCurrent = mockAccounts.some(acc =>
      acc.customerId === customerId && acc.accountType === 'current'
    );

    const elig: LoanEligibility = {
      jewelry: annualIncome >= 120000,
      vehicle: annualIncome >= 300000,
      home: annualIncome >= 600000,
      business: hasCurrent && annualIncome >= 500000,
      reasons: []
    };

    if (!elig.jewelry) elig.reasons.push('Jewelry loan: minimum ₹1.2L annual income required');
    if (!elig.vehicle) elig.reasons.push('Vehicle loan: minimum ₹3L annual income required');
    if (!elig.home) elig.reasons.push('Home loan: minimum ₹6L annual income required');
    if (!hasCurrent) elig.reasons.push('Business loan: current account required');
    if (annualIncome < 500000) elig.reasons.push('Business loan: minimum ₹5L annual income required');

    return elig;
  };

  useEffect(() => {
    if (selectedCustomer) {
      setEligibility(checkEligibility(selectedCustomer));
      setActiveLoanType('');
      setIsFormOpen(false);
    }
  }, [selectedCustomer]);

  // Utility functions
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;
  
  const getCustomerName = (customerId: string) => {
    const customer = mockCustomers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'under_review': return 'text-yellow-600 bg-yellow-100';
      case 'disbursed': return 'text-blue-600 bg-blue-100';
      default: return 'text-orange-600 bg-orange-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'under_review': return <AlertTriangle className="h-4 w-4" />;
      case 'disbursed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Loan application handler
  const handleLoanApplication = (loanType: 'jewelry' | 'vehicle' | 'home' | 'business') => {
    const customer = mockCustomers.find(c => c.id === selectedCustomer);
    if (!customer) return;

    let details: any = {};
    let amount = 0;
    let tenure = 12;
    let rate = 0;
    let purpose = '';

    switch (loanType) {
      case 'jewelry':
        details = { ...jewelryForm };
        amount = jewelryForm.loanAmount;
        tenure = jewelryForm.tenure;
        rate = 12;
        purpose = `Gold jewelry loan for ${jewelryForm.ornamentType}`;
        break;
      case 'vehicle':
        details = { ...vehicleForm };
        amount = vehicleForm.loanAmount;
        tenure = vehicleForm.tenure;
        rate = 8.5;
        purpose = `${vehicleForm.vehicleType} loan for ${vehicleForm.make} ${vehicleForm.model}`;
        break;
      case 'home':
        details = { ...homeForm };
        amount = homeForm.loanAmount;
        tenure = homeForm.tenure;
        rate = 7.5;
        purpose = `Home loan for ${homeForm.propertyType}`;
        break;
      case 'business':
        details = { ...businessForm };
        amount = businessForm.loanAmount;
        tenure = businessForm.tenure;
        rate = 11;
        purpose = businessForm.purpose;
        break;
    }

    const app: LoanApplication = {
      id: Date.now().toString(),
      customerId: selectedCustomer,
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email,
      loanType,
      loanProductName: `${loanType.charAt(0).toUpperCase() + loanType.slice(1)} Loan`,
      amount,
      requestedAmount: amount,
      tenure,
      interestRate: rate,
      status: 'pending',
      applicationDate: new Date().toISOString(),
      appliedDate: new Date().toISOString(),
      details,
      purpose,
      monthlyIncome: customer.monthlyIncome,
      employmentType: customer.employmentType
    };

    setLoanApplications(prev => [app, ...prev]);
    setIsFormOpen(false);
    setActiveLoanType('');

    // Reset forms
    setJewelryForm({ goldWeight: 0, goldPurity: '22K', ornamentType: '', estimatedValue: 0, loanAmount: 0, tenure: 12 });
    setVehicleForm({ vehicleType: 'car', make: '', model: '', year: new Date().getFullYear(), vehicleValue: 0, loanAmount: 0, tenure: 60, downPayment: 0 });
    setHomeForm({ propertyType: 'apartment', propertyValue: 0, loanAmount: 0, tenure: 240, downPayment: 0, propertyAddress: '', constructionStatus: 'ready' });
    setBusinessForm({ businessType: '', annualTurnover: 0, businessAge: 0, loanAmount: 0, tenure: 36, purpose: '', collateral: '' });

    alert(`${loanType.charAt(0).toUpperCase() + loanType.slice(1)} loan application submitted successfully!`);
  };

  // Officer actions
  const handleAction = (application: LoanApplication, action: 'approve' | 'reject') => {
    setSelectedApplication(application);
    setActionType(action);
    setShowModal(true);
    setRemarks('');
  };

  const confirmAction = () => {
    if (!selectedApplication || !actionType) return;

    const updatedApplications = loanApplications.map(app => 
      app.id === selectedApplication.id 
        ? {
            ...app, 
            status: actionType === 'approve' ? 'approved' : 'rejected' as const,
            processedBy: currentUser.name,
            remarks: remarks.trim() || undefined
          }
        : app
    );

    setLoanApplications(updatedApplications);
    setShowModal(false);
    setSelectedApplication(null);
    setActionType(null);
    setRemarks('');
  };

  // Filter applications for officer view
  const filteredApplications = loanApplications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.loanProductName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Statistics for officer dashboard
  const stats = {
    total: loanApplications.length,
    pending: loanApplications.filter(app => app.status === 'pending').length,
    approved: loanApplications.filter(app => app.status === 'approved').length,
    rejected: loanApplications.filter(app => app.status === 'rejected').length,
    underReview: loanApplications.filter(app => app.status === 'under_review').length
  };

  const loanTypes = [
    { 
      id: 'jewelry', 
      name: 'Jewelry Loan', 
      icon: Gem, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-50', 
      border: 'border-yellow-200', 
      desc: 'Quick loans against gold jewelry', 
      req: 'Min ₹1.2L annual income', 
      features: ['Instant approval', 'Minimal documentation', 'Competitive rates'] 
    },
    { 
      id: 'vehicle', 
      name: 'Vehicle Loan', 
      icon: Car, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      border: 'border-blue-200', 
      desc: 'Finance your dream car or bike', 
      req: 'Min ₹3L annual income', 
      features: ['Up to 90% financing', 'Flexible tenure', 'Quick processing'] 
    },
    { 
      id: 'home', 
      name: 'Home Loan', 
      icon: Home, 
      color: 'text-green-600', 
      bg: 'bg-green-50', 
      border: 'border-green-200', 
      desc: 'Make your dream home a reality', 
      req: 'Min ₹6L annual income', 
      features: ['Low interest rates', 'Long tenure', 'Tax benefits'] 
    },
    { 
      id: 'business', 
      name: 'Business Loan', 
      icon: Building, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50', 
      border: 'border-purple-200', 
      desc: 'Grow your business with capital', 
      req: 'Min ₹5L annual income + Current A/c', 
      features: ['Working capital', 'Equipment finance', 'Business expansion'] 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with view toggle */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-rose-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Loan Management System</h1>
            </div>
            <div className="flex bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => setActiveView('customer')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'customer' 
                    ? 'bg-rose-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="h-4 w-4 inline-block mr-2" />
                Customer View
              </button>
              <button
                onClick={() => setActiveView('officer')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'officer' 
                    ? 'bg-rose-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="h-4 w-4 inline-block mr-2" />
                Officer Dashboard
              </button>
            </div>
          </div>
          <p className="text-gray-600">
            {activeView === 'customer' 
              ? 'Apply for loans and check eligibility' 
              : `Welcome back, ${currentUser.name}! Manage and review loan applications`}
          </p>
        </div>

        {/* Customer View */}
        {activeView === 'customer' && (
          <div>
            {/* Customer Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <label className="block mb-2 font-medium">Select Customer</label>
              <select
                value={selectedCustomer}
                onChange={e => setSelectedCustomer(e.target.value)}
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Choose a customer</option>
                {mockCustomers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} - ₹{c.annualIncome.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Profile */}
            {selectedCustomer && eligibility && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-800">Customer Financial Profile</h4>
                  <p className="text-blue-700">
                    {getCustomerName(selectedCustomer)} – ₹{(mockCustomers.find(c=>c.id===selectedCustomer)?.annualIncome||0).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Eligibility Grid */}
            {selectedCustomer && eligibility && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  Loan Eligibility for {getCustomerName(selectedCustomer)}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {loanTypes.map(lt => {
                    const isEligible = !!eligibility[lt.id as keyof LoanEligibility];
                    const Icon = lt.icon;
                    return (
                      <div
                        key={lt.id}
                        onClick={() => isEligible && (setActiveLoanType(lt.id), setIsFormOpen(true))}
                        className={
                          `p-4 rounded-lg border-2 transition-all ` +
                          (isEligible
                            ? `${lt.bg} ${lt.border} cursor-pointer hover:shadow-md`
                            : 'bg-gray-50 border-gray-200 opacity-50')
                        }
                      >
                        <div className="flex items-center mb-2">
                          <Icon className={`h-6 w-6 ${isEligible ? lt.color : 'text-gray-400'}`} />
                          <h4 className={`ml-2 font-semibold ${isEligible ? 'text-gray-800' : 'text-gray-500'}`}>
                            {lt.name}
                          </h4>
                          {isEligible
                            ? <CheckCircle className="h-5 w-5 text-green-600 ml-auto"/>
                            : <XCircle className="h-5 w-5 text-red-600 ml-auto"/>}
                        </div>
                        <p className={`text-sm mb-1 ${isEligible ? 'text-gray-600' : 'text-gray-400'}`}>
                          {lt.desc}
                        </p>
                        <p className={`text-xs mb-2 font-medium ${isEligible ? 'text-blue-600' : 'text-gray-400'}`}>
                          {lt.req}
                        </p>
                        {lt.features.map((f,i) => (
                          <div key={i} className="flex items-center mb-1">
                            <span className={`inline-block w-2 h-2 rounded-full ${isEligible?'bg-green-500':'bg-gray-400'}`} />
                            <span className={`ml-1 text-xs ${isEligible?'text-gray-600':'text-gray-400'}`}>{f}</span>
                          </div>
                        ))}
                        {isEligible && (
                          <button className={
                            `w-full mt-3 px-3 py-2 rounded-lg text-white text-sm font-medium transition-opacity bg-${lt.color.split('-')[1]}-600`
                          }>
                            Apply Now
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Eligibility reasons */}
                {eligibility.reasons.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <h4 className="ml-2 font-semibold text-red-800">Income Requirements Not Met</h4>
                    </div>
                    <ul className="list-disc pl-5 text-red-700 mb-3">
                      {eligibility.reasons.map((r,i) => <li key={i} className="text-sm">{r}</li>)}
                    </ul>
                    <p className="bg-red-100 p-2 rounded text-red-800 text-sm font-medium">
                      💡 Tip: Eligibility is based solely on your annual income. No account history requirements!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Jewelry Loan Form */}
            {isFormOpen && activeLoanType === 'jewelry' && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Jewelry Loan Application</h3>
                <form onSubmit={e => { e.preventDefault(); handleLoanApplication('jewelry'); }} className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">Gold Weight (g)</label>
                    <input 
                      type="number" 
                      required 
                      min={1}
                      value={jewelryForm.goldWeight}
                      onChange={e => setJewelryForm(f => ({...f, goldWeight: +e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Gold Purity</label>
                    <select 
                      required
                      value={jewelryForm.goldPurity}
                      onChange={e => setJewelryForm(f => ({...f, goldPurity: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option>22K</option>
                      <option>18K</option>
                      <option>14K</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Ornament Type</label>
                    <input 
                      type="text" 
                      required
                      value={jewelryForm.ornamentType}
                      onChange={e => setJewelryForm(f => ({...f, ornamentType: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="e.g. Necklace, Ring, Bangles"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Estimated Value (₹)</label>
                    <input 
                      type="number" 
                      required 
                      min={1000}
                      value={jewelryForm.estimatedValue}
                      onChange={e => setJewelryForm(f => ({...f, estimatedValue: +e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Loan Amount (₹)</label>
                    <input 
                      type="number" 
                      required 
                      min={1000} 
                      max={jewelryForm.estimatedValue * 0.75}
                      value={jewelryForm.loanAmount}
                      onChange={e => setJewelryForm(f => ({...f, loanAmount: +e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max ₹{Math.floor(jewelryForm.estimatedValue * 0.75).toLocaleString()} (75% of value)
                    </p>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Tenure (months)</label>
                    <select 
                      required
                      value={jewelryForm.tenure}
                      onChange={e => setJewelryForm(f => ({...f, tenure: +e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      {[6,12,18,24].map(x=> <option key={x} value={x}>{x} months</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2 flex gap-3">
                    <button 
                      type="submit" 
                      className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
                    >
                      Submit Application
                    </button>
                    <button 
                      type="button" 
                      onClick={()=>setIsFormOpen(false)}
                      className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Customer Applications List */}
            {selectedCustomer && loanApplications.filter(app => app.customerId === selectedCustomer).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Your Loan Applications</h3>
                <div className="space-y-4">
                  {loanApplications
                    .filter(app => app.customerId === selectedCustomer)
                    .map(app => (
                    <div key={app.id} className="bg-gray-50 border rounded-lg p-4">
                      <div className="flex justify-between items-start flex-wrap gap-4">
                        <div>
                          <h4 className="font-semibold capitalize">{app.loanType} Loan</h4>
                          <p className="text-sm text-gray-600">{app.purpose}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-rose-600 font-bold text-lg">
                            {formatCurrency(app.amount)}
                          </p>
                          <p className="text-sm text-gray-600">{app.tenure} mo @ {app.interestRate}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Applied: {new Date(app.applicationDate).toLocaleDateString()}</p>
                          <div className="flex items-center mt-1 gap-1">
                            {getStatusIcon(app.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1).replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      {app.remarks && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-sm text-yellow-800">
                            <strong>Officer Remarks:</strong> {app.remarks}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No customer selected */}
            {!selectedCustomer && (
              <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm">
                <User className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Customer</h3>
                <p>Choose a customer to check loan eligibility and apply for loans.</p>
              </div>
            )}
          </div>
        )}

        {/* Officer View */}
        {activeView === 'officer' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Total Applications</h3>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Pending</h3>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Under Review</h3>
                    <p className="text-2xl font-bold text-orange-600">{stats.underReview}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Approved</h3>
                    <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Rejected</h3>
                    <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by customer name, email, or loan type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="disbursed">Disbursed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Loan Applications</h2>
              </div>

              {filteredApplications.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
                  <p className="text-gray-600">
                    {loanApplications.length === 0 
                      ? "No loan applications have been submitted yet." 
                      : "No applications match your current filters."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loan Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredApplications.map((application) => (
                        <tr key={application.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{application.customerName}</div>
                              <div className="text-sm text-gray-500">{application.customerEmail}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{application.loanProductName}</div>
                              <div className="text-sm text-gray-500">
                                {formatCurrency(application.requestedAmount)} • {application.tenure} months
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(application.appliedDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(application.status)}`}>
                              {getStatusIcon(application.status)}
                              {application.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedApplication(application)}
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {application.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleAction(application, 'approve')}
                                    className="text-green-600 hover:text-green-800 transition-colors duration-200"
                                    title="Approve"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleAction(application, 'reject')}
                                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                    title="Reject"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Application Details Modal */}
        {selectedApplication && !showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedApplication.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedApplication.customerEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Income:</span>
                        <span className="font-medium">{formatCurrency(selectedApplication.monthlyIncome)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Employment:</span>
                        <span className="font-medium capitalize">{selectedApplication.employmentType.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Loan Information */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Loan Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product:</span>
                        <span className="font-medium">{selectedApplication.loanProductName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">{formatCurrency(selectedApplication.requestedAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tenure:</span>
                        <span className="font-medium">{selectedApplication.tenure} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interest Rate:</span>
                        <span className="font-medium">{selectedApplication.interestRate}% p.a.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Applied Date:</span>
                        <span className="font-medium">{new Date(selectedApplication.appliedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purpose */}
                {selectedApplication.purpose && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Purpose of Loan</h4>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{selectedApplication.purpose}</p>
                  </div>
                )}

                {/* Loan Details */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Loan Specific Details</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    {selectedApplication.loanType === 'jewelry' && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Gold Weight:</span>
                          <span className="font-medium ml-2">{selectedApplication.details.goldWeight}g</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Purity:</span>
                          <span className="font-medium ml-2">{selectedApplication.details.goldPurity}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Ornament:</span>
                          <span className="font-medium ml-2">{selectedApplication.details.ornamentType}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Estimated Value:</span>
                          <span className="font-medium ml-2">{formatCurrency(selectedApplication.details.estimatedValue)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status and Remarks */}
                <div className="mt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-600">Status: </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedApplication.status)}`}>
                        {getStatusIcon(selectedApplication.status)}
                        {selectedApplication.status.replace('_', ' ')}
                      </span>
                    </div>
                    {selectedApplication.processedBy && (
                      <div>
                        <span className="text-sm text-gray-600">Processed by: </span>
                        <span className="text-sm font-medium text-gray-900">{selectedApplication.processedBy}</span>
                      </div>
                    )}
                  </div>
                  
                  {selectedApplication.remarks && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Officer Remarks</h4>
                      <p className="text-gray-700 bg-yellow-50 rounded-lg p-3">{selectedApplication.remarks}</p>
                    </div>
                  )}
                </div>

                {/* Actions for Officer */}
                {activeView === 'officer' && selectedApplication.status === 'pending' && (
                  <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleAction(selectedApplication, 'approve')}
                      className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                    >
                      Approve Application
                    </button>
                    <button
                      onClick={() => handleAction(selectedApplication, 'reject')}
                      className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                    >
                      Reject Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Confirmation Modal */}
        {showModal && selectedApplication && actionType && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {actionType === 'approve' ? 'Approve' : 'Reject'} Application
                </h3>
                
                <p className="text-gray-600 mb-4">
                  Are you sure you want to {actionType} the loan application for {selectedApplication.customerName}?
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks {actionType === 'reject' ? '(Required)' : '(Optional)'}
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter remarks for ${actionType === 'approve' ? 'approval' : 'rejection'}...`}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAction}
                    disabled={actionType === 'reject' && !remarks.trim()}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      actionType === 'approve' 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {actionType === 'approve' ? 'Approve' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}