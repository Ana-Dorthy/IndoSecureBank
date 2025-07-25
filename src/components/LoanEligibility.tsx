import React, { useState } from 'react';
import { loanProducts } from '../../data/loanproducts';
import { calculateEligibility, formatCurrency } from './../utils/loanCalculations';
import { CheckCircle, XCircle, Calculator, TrendingUp } from 'lucide-react';
import { Customer } from '../types/index';
interface LoanEligibilityProps {
  customer?: Customer;
}

const LoanEligibility: React.FC<LoanEligibilityProps> = ({ customer }) => {
  const [selectedLoan, setSelectedLoan] = useState<string>('');

  if (!customer) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Loan Eligibility Check</h2>
          <p className="text-blue-100">Please provide your customer information to check loan eligibility</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-600">Customer information required to calculate loan eligibility.</p>
        </div>
      </div>
    );
  }

  // Transform customer data for calculateEligibility function
  const customerForEligibility = {
    ...customer,
    monthlyIncome: customer.annualIncome ? parseInt(customer.annualIncome) / 12 : 0,
    employmentType: customer.occupation
  };

  const eligibilityResults = loanProducts.map(product => ({
    product,
    eligibility: calculateEligibility(customerForEligibility, product)
  }));

  const selectedProduct = loanProducts.find(p => p.id === selectedLoan);
  const selectedEligibility = selectedProduct ? calculateEligibility(customerForEligibility, selectedProduct) : null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Loan Eligibility Check</h2>
        <p className="text-blue-100">Discover which loans you qualify for based on your profile</p>
      </div>

      {/* User Profile Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Monthly Income</div>
            <div className="text-lg font-semibold text-gray-900">
              {customer.annualIncome ? formatCurrency(parseInt(customer.annualIncome) / 12) : 'Not provided'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Annual Income</div>
            <div className="text-lg font-semibold text-gray-900">
              {customer.annualIncome ? formatCurrency(parseInt(customer.annualIncome)) : 'Not provided'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Occupation</div>
            <div className="text-lg font-semibold text-gray-900 capitalize">
              {customer.occupation?.replace('_', ' ') || 'Not specified'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Marital Status</div>
            <div className="text-lg font-semibold text-gray-900 capitalize">
              {customer.maritalStatus || 'Not provided'}
            </div>
          </div>
        </div>
      </div>

      {/* Loan Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {eligibilityResults.map(({ product, eligibility }) => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <div className="flex items-center gap-2">
                  {eligibility.eligible ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${eligibility.eligible ? 'text-green-600' : 'text-red-600'}`}>
                    {eligibility.eligible ? 'Eligible' : 'Not Eligible'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Interest Rate</span>
                  <span className="text-sm font-medium">{product.interestRate}% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Loan Range</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Max Tenure</span>
                  <span className="text-sm font-medium">{product.tenure} months</span>
                </div>

                {eligibility.eligible ? (
                  <div className="bg-green-50 rounded-lg p-3 mt-4">
                    <div className="text-sm text-green-800 font-medium mb-2">Your Eligibility:</div>
                    <div className="space-y-1 text-sm text-green-700">
                      <div>Max Amount: <span className="font-semibold">{formatCurrency(eligibility.maxLoanAmount)}</span></div>
                      <div>Monthly EMI: <span className="font-semibold">{formatCurrency(eligibility.monthlyEMI)}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 rounded-lg p-3 mt-4">
                    <div className="text-sm text-red-800 font-medium mb-2">Requirements not met:</div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {eligibility.reasons?.map((reason, index) => (
                        <li key={index}>• {reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {eligibility.eligible && (
                <button
                  onClick={() => setSelectedLoan(product.id)}
                  className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  View Details & Apply
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedProduct && selectedEligibility && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h3>
                <button
                  onClick={() => setSelectedLoan('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Loan Details</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Rate:</span>
                      <span className="font-medium">{selectedProduct.interestRate}% p.a.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Fee:</span>
                      <span className="font-medium">{selectedProduct.processingFee}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Tenure:</span>
                      <span className="font-medium">{selectedProduct.tenure} months</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Your Eligibility</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Amount:</span>
                      <span className="font-medium text-green-700">{formatCurrency(selectedEligibility.maxLoanAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly EMI:</span>
                      <span className="font-medium text-green-700">{formatCurrency(selectedEligibility.monthlyEMI)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Suggested Tenure:</span>
                      <span className="font-medium text-green-700">{selectedEligibility.suggestedTenure} months</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {selectedProduct.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Required Documents</h4>
                <ul className="space-y-2">
                  {selectedProduct.documents.map((doc, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedLoan('')}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
                >
                  Close
                </button>
                <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanEligibility;