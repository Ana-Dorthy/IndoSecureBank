import { User, LoanProduct, EligibilityResult } from '../../types';

export const calculateEligibility = (user: User, loanProduct: LoanProduct): EligibilityResult => {
  const reasons: string[] = [];
  let eligible = true;

  // Check income
  if (!user.monthlyIncome || user.monthlyIncome < loanProduct.eligibilityCriteria.minIncome) {
    eligible = false;
    reasons.push(`Minimum monthly income required: ₹${loanProduct.eligibilityCriteria.minIncome.toLocaleString()}`);
  }

  // Check credit score
  if (!user.creditScore || user.creditScore < loanProduct.eligibilityCriteria.minCreditScore) {
    eligible = false;
    reasons.push(`Minimum credit score required: ${loanProduct.eligibilityCriteria.minCreditScore}`);
  }

  // Check employment type
  if (!user.employmentType || !loanProduct.eligibilityCriteria.employmentTypes.includes(user.employmentType)) {
    eligible = false;
    reasons.push(`Employment type not eligible for this loan`);
  }

  let maxLoanAmount = 0;
  let suggestedTenure = loanProduct.tenure;
  let monthlyEMI = 0;

  if (eligible && user.monthlyIncome) {
    // Calculate max loan amount (40% of monthly income for EMI)
    const maxEMI = user.monthlyIncome * 0.4;
    const monthlyRate = loanProduct.interestRate / 12 / 100;
    const numPayments = suggestedTenure;
    
    // EMI calculation using compound interest formula
    maxLoanAmount = Math.min(
      (maxEMI * (Math.pow(1 + monthlyRate, numPayments) - 1)) / 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)),
      loanProduct.maxAmount
    );

    maxLoanAmount = Math.max(maxLoanAmount, loanProduct.minAmount);
    
    // Calculate EMI for the eligible amount
    monthlyEMI = (maxLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                 (Math.pow(1 + monthlyRate, numPayments) - 1);
  }

  return {
    eligible,
    maxLoanAmount: Math.floor(maxLoanAmount),
    suggestedTenure,
    monthlyEMI: Math.floor(monthlyEMI),
    reasons: reasons.length > 0 ? reasons : undefined
  };
};

export const calculateEMI = (principal: number, rate: number, tenure: number): number => {
  const monthlyRate = rate / 12 / 100;
  const numPayments = tenure;
  
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
              (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  return Math.floor(emi);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};