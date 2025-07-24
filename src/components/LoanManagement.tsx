//modified by prasanna-11/07/25
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
  AlertTriangle
} from 'lucide-react';
import { Bank, Branch, Customer, Account } from '../types';

interface LoanApplication {
  id: string;
  customerId: string;
  loanType: 'jewelry' | 'vehicle' | 'home' | 'business';
  amount: number;
  tenure: number;
  interestRate: number;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  applicationDate: string;
  details: any;
}

interface LoanManagementProps {
  banks: Bank[];
  branches: Branch[];
  customers: Customer[];
  accounts: Account[];
}

interface LoanEligibility {
  jewelry: boolean;
  vehicle: boolean;
  home: boolean;
  business: boolean;
  reasons: string[];
}

export default function LoanManagement({ banks, branches, customers, accounts }: LoanManagementProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [eligibility, setEligibility] = useState<LoanEligibility | null>(null);
  const [activeLoanType, setActiveLoanType] = useState<string>('');
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // --- form state for each loan type ---
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

  /** Eligibility purely by income; business also needs a current account **/
  const checkEligibility = (customerId: string): LoanEligibility => {
    const customer = customers.find(c => c.id === customerId);
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
    const hasCurrent = accounts.some(acc =>
      acc.customerId === customerId && acc.accountType === 'current'
    );

    const elig: LoanEligibility = {
      jewelry: annualIncome >= 120_000,
      vehicle: annualIncome >= 300_000,
      home:    annualIncome >= 600_000,
      business: hasCurrent && annualIncome >= 500_000,
      reasons: []
    };

    if (!elig.jewelry)  elig.reasons.push('Jewelry loan: minimum ₹1.2L annual income required');
    if (!elig.vehicle)  elig.reasons.push('Vehicle loan: minimum ₹3L annual income required');
    if (!elig.home)     elig.reasons.push('Home loan: minimum ₹6L annual income required');
    if (!hasCurrent)    elig.reasons.push('Business loan: current account required');
    if (annualIncome < 500_000) elig.reasons.push('Business loan: minimum ₹5L annual income required');

    return elig;
  };

  useEffect(() => {
    if (selectedCustomer) {
      setEligibility(checkEligibility(selectedCustomer));
      setActiveLoanType('');
      setIsFormOpen(false);
    }
  }, [selectedCustomer, customers, accounts]);
  useEffect(() => {
  const fetchLoans = async () => {
    const res = await fetch('http://localhost:5000/api/loans');
    const data = await res.json();
    setLoanApplications(data);
  };
  fetchLoans();
}, []);
const updateLoanStatus = async (id: string, status: 'approved' | 'rejected') => {
  await fetch(`http://localhost:5000/api/loans/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  setLoanApplications(loans => loans.map(l => l.id === id ? { ...l, status } : l));
};


  const handleLoanApplication = (loanType: 'jewelry' | 'vehicle' | 'home' | 'business') => {
    let details: any = {};
    let amount = 0;
    let tenure = 12;
    let rate = 0;

    switch (loanType) {
      case 'jewelry':
        details = { ...jewelryForm };
        amount = jewelryForm.loanAmount;
        tenure = jewelryForm.tenure;
        rate = 12;
        break;
      case 'vehicle':
        details = { ...vehicleForm };
        amount = vehicleForm.loanAmount;
        tenure = vehicleForm.tenure;
        rate = 8.5;
        break;
      case 'home':
        details = { ...homeForm };
        amount = homeForm.loanAmount;
        tenure = homeForm.tenure;
        rate = 7.5;
        break;
      case 'business':
        details = { ...businessForm };
        amount = businessForm.loanAmount;
        tenure = businessForm.tenure;
        rate = 11;
        break;
    }

    const app: LoanApplication = {
      id: Date.now().toString(),
      customerId: selectedCustomer,
      loanType,
      amount,
      tenure,
      interestRate: rate,
      status: 'pending',
      applicationDate: new Date().toISOString(),
      details
    };

    setLoanApplications(prev => [app, ...prev]);
    setIsFormOpen(false);
    setActiveLoanType('');

    // reset forms...
    setJewelryForm({ goldWeight: 0, goldPurity: '22K', ornamentType: '', estimatedValue: 0, loanAmount: 0, tenure: 12 });
    setVehicleForm({ vehicleType: 'car', make: '', model: '', year: new Date().getFullYear(), vehicleValue: 0, loanAmount: 0, tenure: 60, downPayment: 0 });
    setHomeForm({ propertyType: 'apartment', propertyValue: 0, loanAmount: 0, tenure: 240, downPayment: 0, propertyAddress: '', constructionStatus: 'ready' });
    setBusinessForm({ businessType: '', annualTurnover: 0, businessAge: 0, loanAmount: 0, tenure: 36, purpose: '', collateral: '' });

    alert(`${loanType.charAt(0).toUpperCase() + loanType.slice(1)} loan application submitted!`);
  };

  const getCustomerName = (cid: string) => {
    const c = customers.find(x => x.id === cid);
    return c ? `${c.firstName} ${c.lastName}` : 'Unknown';
  };

  const getStatusIcon = (s: string) => {
    if (s === 'approved' || s === 'disbursed') return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (s === 'rejected') return <XCircle className="h-4 w-4 text-red-600" />;
    return <Clock className="h-4 w-4 text-yellow-600" />;
  };
  const getStatusColor = (s: string) => {
    if (s === 'approved') return 'bg-green-100 text-green-800';
    if (s === 'disbursed') return 'bg-blue-100 text-blue-800';
    if (s === 'rejected') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const loanTypes = [
    { id: 'jewelry',  name: 'Jewelry Loan',  icon: Gem,      color: 'text-yellow-600', bg: 'bg-yellow-50',  border: 'border-yellow-200', desc: 'Quick loans against gold jewelry',            req: 'Min ₹1.2L annual income', features: ['Instant approval','Minimal documentation','Competitive rates'] },
    { id: 'vehicle',  name: 'Vehicle Loan',  icon: Car,      color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   desc: 'Finance your dream car or bike',             req: 'Min ₹3L annual income',   features: ['Up to 90% financing','Flexible tenure','Quick processing'] },
    { id: 'home',     name: 'Home Loan',     icon: Home,     color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  desc: 'Make your dream home a reality',             req: 'Min ₹6L annual income',   features: ['Low interest rates','Long tenure','Tax benefits'] },
    { id: 'business', name: 'Business Loan', icon: Building, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', desc: 'Grow your business with capital',             req: 'Min ₹5L annual income + Current A/c', features: ['Working capital','Equipment finance','Business expansion'] },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* HEADER */}
      <div className="flex items-center mb-6">
        <CreditCard className="h-6 w-6 text-rose-600" />
        <h2 className="text-2xl font-bold ml-2">Loan Management</h2>
      </div>

      {/* CUSTOMER SELECT */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Select Customer</label>
        <select
          value={selectedCustomer}
          onChange={e => setSelectedCustomer(e.target.value)}
          className="w-full max-w-md px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500"
        >
          <option value="">Choose a customer</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>
              {c.firstName} {c.lastName} - ₹{(c.annualIncome||0).toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      {/* PROFILE */}
      {selectedCustomer && eligibility && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <DollarSign className="h-5 w-5 text-blue-600" />
          <div>
            <h4 className="font-semibold text-blue-800">Customer Financial Profile</h4>
            <p className="text-blue-700">
              {getCustomerName(selectedCustomer)} – ₹{(customers.find(c=>c.id===selectedCustomer)?.annualIncome||0).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* ELIGIBILITY GRID */}
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
                      `w-full mt-3 px-3 py-2 rounded-lg text-white text-sm font-medium transition-opacity ` +
                      lt.color.replace('text-','bg-').replace('-600','-600')
                    }>
                      Apply Now
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* REASONS */}
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

      {/* FORMS */}
      {isFormOpen && activeLoanType === 'jewelry' && (
        <form onSubmit={e => { e.preventDefault(); handleLoanApplication('jewelry'); }} className="grid md:grid-cols-2 gap-4 mb-6">
          {/* same inputs as before for jewelryForm */}
          <div>
            <label className="block mb-1 text-sm">Gold Weight (g)</label>
            <input type="number" required min={1}
              value={jewelryForm.goldWeight}
              onChange={e => setJewelryForm(f => ({...f, goldWeight: +e.target.value}))}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500" />
          </div>
          <div>
            <label className="block mb-1 text-sm">Gold Purity</label>
            <select required
              value={jewelryForm.goldPurity}
              onChange={e => setJewelryForm(f => ({...f, goldPurity: e.target.value}))}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
            >
              <option>22K</option><option>18K</option><option>14K</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm">Ornament Type</label>
            <input type="text" required
              value={jewelryForm.ornamentType}
              onChange={e => setJewelryForm(f => ({...f, ornamentType: e.target.value}))}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
              placeholder="e.g. Necklace"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Estimated Value (₹)</label>
            <input type="number" required min={1000}
              value={jewelryForm.estimatedValue}
              onChange={e => setJewelryForm(f => ({...f, estimatedValue: +e.target.value}))}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Loan Amount (₹)</label>
            <input type="number" required min={1000} max={jewelryForm.estimatedValue * .75}
              value={jewelryForm.loanAmount}
              onChange={e => setJewelryForm(f => ({...f, loanAmount: +e.target.value}))}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Max ₹{Math.floor(jewelryForm.estimatedValue * .75).toLocaleString()} (75% of value)
            </p>
          </div>
          <div>
            <label className="block mb-1 text-sm">Tenure (months)</label>
            <select required
              value={jewelryForm.tenure}
              onChange={e => setJewelryForm(f => ({...f, tenure: +e.target.value}))}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
            >
              {[6,12,18,24].map(x=> <option key={x} value={x}>{x} months</option>)}
            </select>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
              Submit
            </button>
            <button type="button" onClick={()=>setIsFormOpen(false)}
              className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Repeat similar blocks for vehicle, home and business forms (unchanged) */}

      {/* APPLICATIONS LIST */}
     {loanApplications.length > 0 && (
  <div>
    <h3 className="text-lg font-semibold mb-4">Loan Applications</h3>
    <div className="space-y-4">
      {loanApplications.map(app => (
        <div key={app.id} className="bg-gray-50 border rounded p-4">
          <div className="flex justify-between flex-wrap gap-4">
            {/* Customer + Loan Type */}
            <div>
              <h4 className="font-semibold">{getCustomerName(app.customerId)}</h4>
              <p className="text-sm capitalize">{app.loanType} Loan</p>
            </div>

            {/* Amount + Tenure */}
            <div className="text-right">
              <p className="text-rose-600 font-bold">
                ₹{app.amount.toLocaleString()}
              </p>
              <p className="text-sm">{app.tenure} mo @ {app.interestRate}%</p>
            </div>

            {/* Status */}
            <div className="text-right">
              <p className="text-sm">Applied: {new Date(app.applicationDate).toLocaleDateString()}</p>
              <div className="flex items-center mt-1 gap-1">
                {getStatusIcon(app.status)}
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(app.status)}`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-right">
              {app.status === 'pending' ? (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => updateLoanStatus(app.id, 'approved')}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateLoanStatus(app.id, 'rejected')}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">No actions available</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}


      {/* PLACEHOLDER */}
      {!selectedCustomer && (
        <div className="text-center py-12 text-gray-500">
          <User className="h-12 w-12 mx-auto mb-4" />
          Select a customer to check eligibility and apply for loans.
        </div>
      )}
    </div>
  );
}
