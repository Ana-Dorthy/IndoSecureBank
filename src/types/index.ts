import { ReactNode } from "react";

export interface Bank {
  bankCode: ReactNode;
  ifscCode: ReactNode;
  id: string;
  name: string;
  bankName: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  establishedDate: string;
  createdBy: string; 
  headOfficeAddress: string;
}

export interface Branch {
  id: string;
  bankId: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  createdAt: string;
  ifsc: string;
  city: string;
  state: string;
  pincode: string;
  openingDate: string;
  isActive: boolean;
}

export interface Customer {
  aadharNumber: string;
  gender: string;
  maritalStatus: string;
  occupation: string;
  annualIncome: string;
  isActive: boolean;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  panNumber: string;
  createdAt: string;
}

export interface KYC {
  issuedDate: string;
  expiryDate: string;
  placeOfIssue: string;
  id: string;
  customerId: string;
  panNumber: string;
  linkedBanks: string[];
  documentType: string;
  documentNumber: string;
  documentProof?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}

export interface Employee {
  address: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  nationality: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bankId: string;
  branchId: string;
  role: string;
  employeeId: string;
  hireDate: string;
  salary: number;
  createdAt: string;
}

export interface Account {
  id: string;
  customerId: string;
  bankId: string;
  branchId: string;
  accountNumber: string;
  accountType: 'savings' | 'current' | 'fixed_deposit';
  balance: number;
  status: 'active' | 'inactive' | 'closed';
  createdAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: 'deposit' | 'withdraw' | 'transfer_in' | 'transfer_out';
  amount: number;
  balance: number;
  description: string;
  referenceNumber: string;
  toAccountId?: string;
  createdAt: string;
}
export interface BankingOperation {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'transaction' | 'account' | 'statement';
  requiredFields: string[];
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'loan_officer';
  phone?: string;
  address?: string;
  monthlyIncome?: number;
  creditScore?: number;
  employmentType?: 'salaried' | 'self_employed' | 'business';
  yearsOfEmployment?: number;
}

export interface LoanProduct {
  id: string;
  name: string;
  type: 'personal' | 'home' | 'car' | 'business';
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  tenure: number; // in months
  processingFee: number;
  eligibilityCriteria: {
    minIncome: number;
    minCreditScore: number;
    maxAge: number;
    minAge: number;
    employmentTypes: string[];
  };
  features: string[];
  documents: string[];
}

export interface LoanApplication {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  loanProductId: string;
  loanProductName: string;
  requestedAmount: number;
  tenure: number;
  monthlyIncome: number;
  employmentType: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  appliedDate: string;
  processedBy?: string;
  documents: {
    name: string;
    uploaded: boolean;
  }[];
  remarks?: string;
}

export interface EligibilityResult {
  eligible: boolean;
  maxLoanAmount: number;
  suggestedTenure: number;
  monthlyEMI: number;
  reasons?: string[];
}