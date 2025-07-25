import { LoanProduct } from '../types';

export const loanProducts: LoanProduct[] = [
  {
    id: '1',
    name: 'Personal Loan - Express',
    type: 'personal',
    minAmount: 50000,
    maxAmount: 2000000,
    interestRate: 10.5,
    tenure: 60,
    processingFee: 2.5,
    eligibilityCriteria: {
      minIncome: 30000,
      minCreditScore: 650,
      maxAge: 65,
      minAge: 21,
      employmentTypes: ['salaried', 'self_employed']
    },
    features: [
      'Quick approval in 24 hours',
      'No collateral required',
      'Flexible repayment options',
      'Minimal documentation'
    ],
    documents: [
      'PAN Card',
      'Aadhaar Card',
      'Salary Slips (3 months)',
      'Bank Statements (6 months)'
    ]
  },
  {
    id: '2',
    name: 'Home Loan - Prime',
    type: 'home',
    minAmount: 500000,
    maxAmount: 10000000,
    interestRate: 8.5,
    tenure: 360,
    processingFee: 0.5,
    eligibilityCriteria: {
      minIncome: 50000,
      minCreditScore: 700,
      maxAge: 65,
      minAge: 23,
      employmentTypes: ['salaried', 'self_employed', 'business']
    },
    features: [
      'Attractive interest rates',
      'Loan up to 90% of property value',
      'Tax benefits available',
      'Step-up EMI facility'
    ],
    documents: [
      'Income Proof',
      'Property Documents',
      'Identity & Address Proof',
      'Bank Statements'
    ]
  },
  {
    id: '3',
    name: 'Car Loan - Auto Plus',
    type: 'car',
    minAmount: 100000,
    maxAmount: 2000000,
    interestRate: 9.25,
    tenure: 84,
    processingFee: 1.0,
    eligibilityCriteria: {
      minIncome: 25000,
      minCreditScore: 650,
      maxAge: 65,
      minAge: 21,
      employmentTypes: ['salaried', 'self_employed']
    },
    features: [
      'Financing up to 90% of car value',
      'Quick processing',
      'Competitive interest rates',
      'Flexible tenure options'
    ],
    documents: [
      'Income Proof',
      'Vehicle Quotation',
      'Identity Proof',
      'Bank Statements'
    ]
  },
  {
    id: '4',
    name: 'Business Loan - Growth',
    type: 'business',
    minAmount: 200000,
    maxAmount: 5000000,
    interestRate: 11.5,
    tenure: 120,
    processingFee: 2.0,
    eligibilityCriteria: {
      minIncome: 100000,
      minCreditScore: 700,
      maxAge: 65,
      minAge: 25,
      employmentTypes: ['business', 'self_employed']
    },
    features: [
      'Working capital support',
      'Equipment financing',
      'Business expansion loans',
      'Overdraft facility'
    ],
    documents: [
      'Business Registration',
      'Financial Statements',
      'Bank Statements',
      'GST Returns'
    ]
  }
];