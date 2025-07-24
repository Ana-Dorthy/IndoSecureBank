export interface Bank {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  establishedDate: string;
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  bankId: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  panNumber: string;
  annualIncome?: number;
  dateOfBirth: string;
  address: string;
  createdAt: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  customerId: string;
  branchId: string;
  accountType: string;
  balance: number;
  status: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  type: string;
  status: string;
  description: string;
  createdAt: string;
}

export interface KYC {
  id: string;
  customerId: string;
  documentType: string;
  documentNumber: string;
  verificationStatus: string;
  verifiedAt?: string;
  createdAt: string;
}