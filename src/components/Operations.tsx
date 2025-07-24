//modified-13/7/25
import React, { useState } from 'react';
import { CreditCard, Plus, ArrowUpDown, Receipt, Search, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Bank, Branch, Customer, Account, Transaction } from '../types';

interface OperationsProps {
  banks: Bank[];
  branches: Branch[];
  customers: Customer[];
  accounts: Account[];
  transactions: Transaction[];
  onAddAccount: (account: Omit<Account, 'id' | 'createdAt'>) => void;
  onDeposit: (accountId: string, amount: number, description: string) => void;
  onWithdraw: (accountId: string, amount: number, description: string) => void;
  onTransfer: (fromAccountId: string, toAccountId: string, amount: number, description: string) => void;
}

export default function Operations({ 
  banks, 
  branches, 
  customers, 
  accounts, 
  transactions, 
  onAddAccount, 
  onDeposit, 
  onWithdraw, 
  onTransfer 
}: OperationsProps) {
  const [activeOperation, setActiveOperation] = useState<string>('accounts');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [toAccount, setToAccount] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Account creation form
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);
  const [accountForm, setAccountForm] = useState({
    customerId: '',
    bankId: '',
    branchId: '',
    accountType: 'savings' as 'savings' | 'current' | 'fixed_deposit',
    initialDeposit: 0
  });

  const filteredBranches = branches.filter(branch => branch.bankId === accountForm.bankId);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the customer and use their existing account number
    const customer = customers.find(c => c.id === accountForm.customerId);
    if (!customer || !customer.accountNumber) {
      alert('Customer must have an account number. Please update customer details first.');
      return;
    }
    
    onAddAccount({
      customerId: accountForm.customerId,
      bankId: accountForm.bankId,
      branchId: accountForm.branchId,
      accountNumber: customer.accountNumber, // Use customer's existing account number
      accountType: accountForm.accountType,
      balance: accountForm.initialDeposit,
      status: 'active'
    });

    // Reset form
    setAccountForm({
      customerId: '',
      bankId: '',
      branchId: '',
      accountType: 'savings',
      initialDeposit: 0
    });
    setIsAccountFormOpen(false);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAccount && amount && parseFloat(amount) > 0) {
      onDeposit(selectedAccount, parseFloat(amount), description || 'Cash Deposit');
      setAmount('');
      setDescription('');
      setSelectedAccount('');
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAccount && amount && parseFloat(amount) > 0) {
      const account = accounts.find(acc => acc.id === selectedAccount);
      if (account && account.balance >= parseFloat(amount)) {
        onWithdraw(selectedAccount, parseFloat(amount), description || 'Cash Withdrawal');
        setAmount('');
        setDescription('');
        setSelectedAccount('');
      } else {
        alert('Insufficient balance!');
      }
    }
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAccount && toAccount && amount && parseFloat(amount) > 0) {
      const fromAccount = accounts.find(acc => acc.id === selectedAccount);
      if (fromAccount && fromAccount.balance >= parseFloat(amount)) {
        onTransfer(selectedAccount, toAccount, parseFloat(amount), description || 'Fund Transfer');
        setAmount('');
        setDescription('');
        setSelectedAccount('');
        setToAccount('');
      } else {
        alert('Insufficient balance!');
      }
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer';
  };

  const getBankName = (bankId: string) => {
    const bank = banks.find(b => b.id === bankId);
    return bank ? bank.name : 'Unknown Bank';
  };

  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Unknown Branch';
  };

  const getAccountTransactions = (accountId: string) => {
    return transactions
      .filter(t => t.accountId === accountId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const filteredAccounts = accounts.filter(account => {
    const customer = customers.find(c => c.id === account.customerId);
    const customerName = customer ? `${customer.firstName} ${customer.lastName}` : '';
    return customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Essential banking operations only
  const operations = [
    { id: 'accounts', label: 'Account Management', icon: CreditCard },
    { id: 'deposit', label: 'Deposit', icon: TrendingUp },
    { id: 'withdraw', label: 'Withdraw', icon: TrendingDown },
    { id: 'transfer', label: 'Transfer', icon: ArrowUpDown },
    { id: 'statement', label: 'Account Statement', icon: Receipt }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-teal-600" />
          <h2 className="text-2xl font-bold text-gray-800">Banking Operations</h2>
        </div>
      </div>

      {/* Operation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
        {operations.map((op) => {
          const Icon = op.icon;
          return (
            <button
              key={op.id}
              onClick={() => setActiveOperation(op.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
                activeOperation === op.id
                  ? 'bg-teal-600 text-white border-b-2 border-teal-600'
                  : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {op.label}
            </button>
          );
        })}
      </div>

      {/* Account Management */}
      {activeOperation === 'accounts' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Account Management</h3>
            <button
              onClick={() => setIsAccountFormOpen(true)}
              className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Account
            </button>
          </div>

          {isAccountFormOpen && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold mb-4">Create New Account</h4>
              <form onSubmit={handleCreateAccount} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <select
                    required
                    value={accountForm.customerId}
                    onChange={(e) => setAccountForm({ ...accountForm, customerId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.firstName} {customer.lastName} - {customer.panNumber} 
                        {customer.accountNumber && ` (A/c: ${customer.accountNumber})`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                  <select
                    required
                    value={accountForm.accountType}
                    onChange={(e) => setAccountForm({ ...accountForm, accountType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="savings">Savings Account</option>
                    <option value="current">Current Account</option>
                    <option value="fixed_deposit">Fixed Deposit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
                  <select
                    required
                    value={accountForm.bankId}
                    onChange={(e) => setAccountForm({ ...accountForm, bankId: e.target.value, branchId: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Bank</option>
                    {banks.map(bank => (
                      <option key={bank.id} value={bank.id}>{bank.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <select
                    required
                    value={accountForm.branchId}
                    onChange={(e) => setAccountForm({ ...accountForm, branchId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    disabled={!accountForm.bankId}
                  >
                    <option value="">Select Branch</option>
                    {filteredBranches.map(branch => (
                      <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Deposit</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={accountForm.initialDeposit}
                    onChange={(e) => setAccountForm({ ...accountForm, initialDeposit: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Create Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAccountFormOpen(false)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search accounts by customer name or account number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredAccounts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No accounts found. Create your first account to get started.</p>
            ) : (
              filteredAccounts.map(account => (
                <div key={account.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">{getCustomerName(account.customerId)}</h4>
                      <p className="text-sm text-gray-600">Account: {account.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{getBankName(account.bankId)}</p>
                      <p className="text-sm text-gray-600">{getBranchName(account.branchId)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 capitalize">{account.accountType.replace('_', ' ')}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {account.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-teal-600">₹{account.balance.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Current Balance</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Deposit Funds */}
      {activeOperation === 'deposit' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Deposit Funds</h3>
          <form onSubmit={handleDeposit} className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Account</label>
              <select
                required
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Choose account</option>
                {accounts.filter(acc => acc.status === 'active').map(account => (
                  <option key={account.id} value={account.id}>
                    {getCustomerName(account.customerId)} - {account.accountNumber} (₹{account.balance.toLocaleString()})
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
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
      )}

      {/* Withdraw Funds */}
      {activeOperation === 'withdraw' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Withdraw Funds</h3>
          <form onSubmit={handleWithdraw} className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Account</label>
              <select
                required
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Choose account</option>
                {accounts.filter(acc => acc.status === 'active').map(account => (
                  <option key={account.id} value={account.id}>
                    {getCustomerName(account.customerId)} - {account.accountNumber} (₹{account.balance.toLocaleString()})
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Enter description"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Withdraw Funds
            </button>
          </form>
        </div>
      )}

      {/* Transfer Funds */}
      {activeOperation === 'transfer' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Transfer Funds</h3>
          <form onSubmit={handleTransfer} className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
              <select
                required
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Choose source account</option>
                {accounts.filter(acc => acc.status === 'active').map(account => (
                  <option key={account.id} value={account.id}>
                    {getCustomerName(account.customerId)} - {account.accountNumber} (₹{account.balance.toLocaleString()})
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Choose destination account</option>
                {accounts.filter(acc => acc.status === 'active' && acc.id !== selectedAccount).map(account => (
                  <option key={account.id} value={account.id}>
                    {getCustomerName(account.customerId)} - {account.accountNumber}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
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

      {/* Account Statement */}
      {activeOperation === 'statement' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Account Statement</h3>
          <div className="max-w-md mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Account</label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Choose account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {getCustomerName(account.customerId)} - {account.accountNumber}
                </option>
              ))}
            </select>
          </div>

          {selectedAccount && (
            <div>
              {/* Account Summary */}
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-6">
                {(() => {
                  const account = accounts.find(acc => acc.id === selectedAccount);
                  return account ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-lg font-semibold text-teal-800 mb-2">Account Details</h4>
                        <p className="text-sm text-gray-600">Account: {account.accountNumber}</p>
                        <p className="text-sm text-gray-600">Type: {account.accountType.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-600">Status: {account.status}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-teal-800 mb-2">Customer</h4>
                        <p className="text-sm text-gray-600">{getCustomerName(account.customerId)}</p>
                        <p className="text-sm text-gray-600">{getBankName(account.bankId)}</p>
                        <p className="text-sm text-gray-600">{getBranchName(account.branchId)}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-teal-800 mb-2">Current Balance</h4>
                        <p className="text-3xl font-bold text-teal-600">₹{account.balance.toLocaleString()}</p>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Transaction History */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h4 className="font-semibold">Transaction History</h4>
                </div>
                <div className="max-h-96 overflow-y-auto divide-y divide-gray-200">
                  {getAccountTransactions(selectedAccount).map(transaction => (
                    <div key={transaction.id} className="px-4 py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{new Date(transaction.createdAt).toLocaleString()}</p>
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
                  ))}
                  {getAccountTransactions(selectedAccount).length === 0 && (
                    <div className="px-4 py-8 text-center text-gray-500">
                      No transactions found
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}