import React, { useState } from 'react';
import { loanProducts } from '../../data/loanproducts.ts';
import { calculateEMI, formatCurrency } from '../utils/loanCalculations.ts';
import { FileText, Calculator, Send } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Customer } from '../../types/index.ts';

interface LoanApplicationFormProps {
  customer?: Customer;
}

const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({ customer }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [formData, setFormData] = useState({
    requestedAmount: '',
    tenure: '',
    purpose: '',
    monthlyIncome: customer?.annualIncome ? (parseInt(customer.annualIncome) / 12).toString() : '',
    employmentType: customer?.occupation || 'salaried'
  });
  const [submitted, setSubmitted] = useState(false);

  const selectedProduct = loanProducts.find(p => p.id === selectedProductId);
  const emi = selectedProduct && formData.requestedAmount && formData.tenure 
    ? calculateEMI(Number(formData.requestedAmount), selectedProduct.interestRate, Number(formData.tenure))
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create loan application
    const application = {
      id: uuidv4(),
      customerId: customer?.id || '',
      customerName: customer ? `${customer.firstName} ${customer.lastName}` : '',
      customerEmail: customer?.email || '',
      customerPhone: customer?.phone || '',
      loanProductId: selectedProductId,
      loanProductName: selectedProduct?.name || '',
      requestedAmount: Number(formData.requestedAmount),
      tenure: Number(formData.tenure),
      monthlyIncome: Number(formData.monthlyIncome),
      employmentType: formData.employmentType,
      purpose: formData.purpose,
      status: 'pending' as const,
      appliedDate: new Date().toISOString(),
      documents: selectedProduct?.documents.map(doc => ({
        name: doc,
        uploaded: false
      })) || []
    };

    // Save to localStorage (in real app, this would be sent to backend)
    const existingApplications = JSON.parse(localStorage.getItem('loan_applications') || '[]');
    existingApplications.push(application);
    localStorage.setItem('loan_applications', JSON.stringify(existingApplications));

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your loan application has been submitted and is being reviewed by our loan officers. 
            You will receive updates via email and can track the status in your dashboard.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Next Steps:</h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• Document verification will begin within 24 hours</li>
              <li>• You may be contacted for additional information</li>
              <li>• Decision will be communicated within 3-5 business days</li>
            </ul>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Apply for Another Loan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Apply for Loan</h2>
        <p className="text-blue-100">Fill out the application form to get started with your loan</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Loan Product Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Loan Product *
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Choose a loan product...</option>
            {loanProducts.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.interestRate}% p.a.
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && (
          <>
            {/* Loan Amount and Tenure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requested Amount *
                </label>
                <input
                  type="number"
                  value={formData.requestedAmount}
                  onChange={(e) => setFormData({...formData, requestedAmount: e.target.value})}
                  min={selectedProduct.minAmount}
                  max={selectedProduct.maxAmount}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`₹${selectedProduct.minAmount.toLocaleString()} - ₹${selectedProduct.maxAmount.toLocaleString()}`}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: {formatCurrency(selectedProduct.minAmount)} - {formatCurrency(selectedProduct.maxAmount)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tenure (months) *
                </label>
                <input
                  type="number"
                  value={formData.tenure}
                  onChange={(e) => setFormData({...formData, tenure: e.target.value})}
                  min="6"
                  max={selectedProduct.tenure}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`6 - ${selectedProduct.tenure} months`}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum: {selectedProduct.tenure} months
                </p>
              </div>
            </div>

            {/* EMI Calculator */}
            {emi > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">EMI Calculation</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Monthly EMI:</span>
                    <div className="text-lg font-semibold text-blue-700">{formatCurrency(emi)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Amount:</span>
                    <div className="text-lg font-semibold text-blue-700">
                      {formatCurrency(emi * Number(formData.tenure))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Interest:</span>
                    <div className="text-lg font-semibold text-blue-700">
                      {formatCurrency((emi * Number(formData.tenure)) - Number(formData.requestedAmount))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Income *
                </label>
                <input
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData({...formData, monthlyIncome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your monthly income"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type *
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="salaried">Salaried</option>
                  <option value="self_employed">Self Employed</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose of Loan *
              </label>
              <textarea
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please describe the purpose of this loan..."
                required
              />
            </div>

            {/* Required Documents */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Required Documents</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedProduct.documents.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    {doc}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                You will be contacted by our team for document submission after application review.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              >
                Submit Application
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default LoanApplicationForm;