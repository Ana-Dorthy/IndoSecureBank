// // // import React, { useState, useEffect } from 'react';
// // // import { Bank, Branch, Customer, KYC, Employee, Account, Transaction } from './types';
// // // import ManageBank from './components/ManageBank';
// // // import ManageBranch from './components/ManageBranch';
// // // import ManageCustomer from './components/ManageCustomer';
// // // import ManageKYC from './components/ManageKYC';
// // // import ManageEmployee from './components/ManageEmployee';
// // // import Operations from './components/Operations';
// // // import { banksApi, branchesApi, customersApi, kycApi, employeesApi, accountsApi, transactionsApi } from './services/api';

// // // type ActiveTab = 'banks' | 'branches' | 'customers' | 'kyc' | 'employees' | 'operations';

// // // function App() {
// // //   const [activeTab, setActiveTab] = useState<ActiveTab>('banks');
// // //   const [loading, setLoading] = useState(false);
  
// // //   const [banks, setBanks] = useState<Bank[]>([]);
// // //   const [branches, setBranches] = useState<Branch[]>([]);
// // //   const [customers, setCustomers] = useState<Customer[]>([]);
// // //   const [kycRecords, setKycRecords] = useState<KYC[]>([]);
// // //   const [employees, setEmployees] = useState<Employee[]>([]);
// // //   const [accounts, setAccounts] = useState<Account[]>([]);
// // //   const [transactions, setTransactions] = useState<Transaction[]>([]);

// // //   useEffect(() => {
// // //     loadAllData();
// // //   }, []);

// // //   const loadAllData = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const [banksData, branchesData, customersData, kycData, employeesData, accountsData, transactionsData] = await Promise.all([
// // //         banksApi.getAll(),
// // //         branchesApi.getAll(),
// // //         customersApi.getAll(),
// // //         kycApi.getAll(),
// // //         employeesApi.getAll(),
// // //         accountsApi.getAll(),
// // //         transactionsApi.getAll(),
// // //       ]);

// // //       setBanks(banksData);
// // //       setBranches(branchesData);
// // //       setCustomers(customersData);
// // //       setKycRecords(kycData);
// // //       setEmployees(employeesData);
// // //       setAccounts(accountsData);
// // //       setTransactions(transactionsData);
// // //     } catch (error) {
// // //       console.error('Error loading data:', error);
// // //       alert('Error loading data from database. Please check if MongoDB is running.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const addBank = async (bankData: Omit<Bank, 'id' | 'createdAt'>) => {
// // //     try {
// // //       const newBank = await banksApi.create(bankData);
// // //       setBanks(prev => [...prev, newBank]);
// // //     } catch (error) {
// // //       console.error('Error adding bank:', error);
// // //       alert('Error adding bank');
// // //     }
// // //   };

// // //   const updateBank = async (id: string, bankData: Omit<Bank, 'id' | 'createdAt'>) => {
// // //     try {
// // //       const updatedBank = await banksApi.update(id, bankData);
// // //       setBanks(prev => prev.map(bank => 
// // //         bank.id === id ? updatedBank : bank
// // //       ));
// // //     } catch (error) {
// // //       console.error('Error updating bank:', error);
// // //       alert('Error updating bank');
// // //     }
// // //   };

// // //   const deleteBank = async (id: string) => {
// // //     try {
// // //       await banksApi.delete(id);
// // //       setBanks(prev => prev.filter(bank => bank.id !== id));
// // //       setBranches(prev => prev.filter(branch => branch.bankId !== id));
// // //       setEmployees(prev => prev.filter(employee => employee.bankId !== id));
// // //     } catch (error) {
// // //       console.error('Error deleting bank:', error);
// // //       alert('Error deleting bank');
// // //     }
// // //   };

// // //   const addBranch = async (branchData: Omit<Branch, 'id' | 'createdAt'>) => {
// // //     try {
// // //       const newBranch = await branchesApi.create(branchData);
// // //       setBranches(prev => [...prev, newBranch]);
// // //     } catch (error) {
// // //       console.error('Error adding branch:', error);
// // //       alert('Error adding branch');
// // //     }
// // //   };

// // //   const updateBranch = async (id: string, branchData: Omit<Branch, 'id' | 'createdAt'>) => {
// // //     try {
// // //       const updatedBranch = await branchesApi.update(id, branchData);
// // //       setBranches(prev => prev.map(branch => 
// // //         branch.id === id ? updatedBranch : branch
// // //       ));
// // //     } catch (error) {
// // //       console.error('Error updating branch:', error);
// // //       alert('Error updating branch');
// // //     }
// // //   };

// // //   const deleteBranch = async (id: string) => {
// // //     try {
// // //       await branchesApi.delete(id);
// // //       setBranches(prev => prev.filter(branch => branch.id !== id));
// // //       setEmployees(prev => prev.filter(employee => employee.branchId !== id));
// // //     } catch (error) {
// // //       console.error('Error deleting branch:', error);
// // //       alert('Error deleting branch');
// // //     }
// // //   };

// // //   const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
// // //     try {
// // //       const newCustomer = await customersApi.create(customerData);
// // //       setCustomers(prev => [...prev, newCustomer]);
// // //     } catch (error) {
// // //       console.error('Error adding customer:', error);
// // //       alert('Error adding customer');
// // //     }
// // //   };

// // //   const updateCustomer = async (id: string, customerData: Omit<Customer, 'id' | 'createdAt'>) => {
// // //     try {
// // //       const updatedCustomer = await customersApi.update(id, customerData);
// // //       setCustomers(prev => prev.map(customer => 
// // //         customer.id === id ? updatedCustomer : customer
// // //       ));
// // //     } catch (error) {
// // //       console.error('Error updating customer:', error);
// // //       alert('Error updating customer');
// // //     }
// // //   };

// // //   const deleteCustomer = async (id: string) => {
// // //     try {
// // //       await customersApi.delete(id);
// // //       setCustomers(prev => prev.filter(customer => customer.id !== id));
// // //       setKycRecords(prev => prev.filter(kyc => kyc.customerId !== id));
// // //     } catch (error) {
// // //       console.error('Error deleting customer:', error);
// // //       alert('Error deleting customer');
// // //     }
// // //   };

// // //   const addKYC = async (kycData: Omit<KYC, 'id' | 'createdAt'>) => {
// // //     try {
// // //       const newKYC = await kycApi.create(kycData);
// // //       setKycRecords(prev => [...prev, newKYC]);
// // //     } catch (error) {
// // //       console.error('Error adding KYC:', error);
// // //       alert('Error adding KYC record');
// // //     }
// // //   };

// // //   const updateKYC = async (id: string, kycData: Omit<KYC, 'id' | 'createdAt'>) => {
// // //     try {
// // //       const updatedKYC = await kycApi.update(id, kycData);
// // //       setKycRecords(prev => prev.map(kyc => 
// // //         kyc.id === id ? updatedKYC : kyc
// // //       ));
// // //     } catch (error) {
// // //       console.error('Error updating KYC:', error);
// // //       alert('Error updating KYC record');
// // //     }
// // //   };

// // //   const deleteKYC = async (id: string) => {
// // //     try {
// // //       await kycApi.delete(id);
// // //       setKycRecords(prev => prev.filter(kyc => kyc.id !== id));
// // //     } catch (error) {
// // //       console.error('Error deleting KYC:', error);
// // //       alert('Error deleting KYC record');
// // //     }
// // //   };

// // //   const addEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
// // //     try {
// // //       const newEmployee = await employeesApi.create(employeeData);
// // //       setEmployees(prev => [...prev, newEmployee]);
// // //     } catch (error) {
// // //       console.error('Error adding employee:', error);
// // //       alert('Error adding employee');
// // //     }
// // //   };

// // //   const updateEmployee = async (id: string, employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
// // //     try {
// // //       const updatedEmployee = await employeesApi.update(id, employeeData);
// // //       setEmployees(prev => prev.map(employee => 
// // //         employee.id === id ? updatedEmployee : employee
// // //       ));
// // //     } catch (error) {
// // //       console.error('Error updating employee:', error);
// // //       alert('Error updating employee');
// // //     }
// // //   };

// // //   const deleteEmployee = async (id: string) => {
// // //     try {
// // //       await employeesApi.delete(id);
// // //       setEmployees(prev => prev.filter(employee => employee.id !== id));
// // //     } catch (error) {
// // //       console.error('Error deleting employee:', error);
// // //       alert('Error deleting employee');
// // //     }
// // //   };

// // //   const addAccount = async (accountData: Omit<Account, 'id' | 'createdAt'>) => {
// // //     try {
// // //       const newAccount = await accountsApi.create(accountData);
// // //       setAccounts(prev => [...prev, newAccount]);
      
// // //       if (accountData.balance > 0) {
// // //         const transactionData = {
// // //           accountId: newAccount.id,
// // //           type: 'deposit' as const,
// // //           amount: accountData.balance,
// // //           balance: accountData.balance,
// // //           description: 'Initial Deposit',
// // //           referenceNumber: `TXN${Date.now()}`
// // //         };
// // //         const newTransaction = await transactionsApi.create(transactionData);
// // //         setTransactions(prev => [...prev, newTransaction]);
// // //       }
// // //     } catch (error) {
// // //       console.error('Error adding account:', error);
// // //       alert('Error adding account');
// // //     }
// // //   };

// // //   const handleDeposit = async (accountId: string, amount: number, description: string) => {
// // //     try {
// // //       const account = accounts.find(acc => acc.id === accountId);
// // //       if (!account) return;

// // //       const newBalance = account.balance + amount;
      
// // //       await accountsApi.update(accountId, { ...account, balance: newBalance });
// // //       setAccounts(prev => prev.map(acc => 
// // //         acc.id === accountId ? { ...acc, balance: newBalance } : acc
// // //       ));

// // //       const transactionData = {
// // //         accountId,
// // //         type: 'deposit' as const,
// // //         amount,
// // //         balance: newBalance,
// // //         description,
// // //         referenceNumber: `TXN${Date.now()}`
// // //       };
// // //       const newTransaction = await transactionsApi.create(transactionData);
// // //       setTransactions(prev => [...prev, newTransaction]);

// // //       alert('Deposit successful!');
// // //     } catch (error) {
// // //       console.error('Error processing deposit:', error);
// // //       alert('Error processing deposit');
// // //     }
// // //   };

// // //   const handleWithdraw = async (accountId: string, amount: number, description: string) => {
// // //     try {
// // //       const account = accounts.find(acc => acc.id === accountId);
// // //       if (!account || account.balance < amount) return;

// // //       const newBalance = account.balance - amount;
      
// // //       await accountsApi.update(accountId, { ...account, balance: newBalance });
// // //       setAccounts(prev => prev.map(acc => 
// // //         acc.id === accountId ? { ...acc, balance: newBalance } : acc
// // //       ));

// // //       const transactionData = {
// // //         accountId,
// // //         type: 'withdraw' as const,
// // //         amount,
// // //         balance: newBalance,
// // //         description,
// // //         referenceNumber: `TXN${Date.now()}`
// // //       };
// // //       const newTransaction = await transactionsApi.create(transactionData);
// // //       setTransactions(prev => [...prev, newTransaction]);

// // //       alert('Withdrawal successful!');
// // //     } catch (error) {
// // //       console.error('Error processing withdrawal:', error);
// // //       alert('Error processing withdrawal');
// // //     }
// // //   };

// // //   const handleTransfer = async (fromAccountId: string, toAccountId: string, amount: number, description: string) => {
// // //     try {
// // //       const fromAccount = accounts.find(acc => acc.id === fromAccountId);
// // //       const toAccount = accounts.find(acc => acc.id === toAccountId);
      
// // //       if (!fromAccount || !toAccount || fromAccount.balance < amount) return;

// // //       const fromNewBalance = fromAccount.balance - amount;
// // //       const toNewBalance = toAccount.balance + amount;
// // //       const refNumber = `TXN${Date.now()}`;
      
// // //       await accountsApi.update(fromAccountId, { ...fromAccount, balance: fromNewBalance });
// // //       await accountsApi.update(toAccountId, { ...toAccount, balance: toNewBalance });
      
// // //       setAccounts(prev => prev.map(acc => {
// // //         if (acc.id === fromAccountId) return { ...acc, balance: fromNewBalance };
// // //         if (acc.id === toAccountId) return { ...acc, balance: toNewBalance };
// // //         return acc;
// // //       }));

// // //       const fromTransactionData = {
// // //         accountId: fromAccountId,
// // //         type: 'transfer_out' as const,
// // //         amount,
// // //         balance: fromNewBalance,
// // //         description,
// // //         referenceNumber: refNumber,
// // //         toAccountId
// // //       };
      
// // //       const toTransactionData = {
// // //         accountId: toAccountId,
// // //         type: 'transfer_in' as const,
// // //         amount,
// // //         balance: toNewBalance,
// // //         description,
// // //         referenceNumber: refNumber
// // //       };

// // //       const [fromTransaction, toTransaction] = await Promise.all([
// // //         transactionsApi.create(fromTransactionData),
// // //         transactionsApi.create(toTransactionData)
// // //       ]);

// // //       setTransactions(prev => [...prev, fromTransaction, toTransaction]);

// // //       alert('Transfer successful!');
// // //     } catch (error) {
// // //       console.error('Error processing transfer:', error);
// // //       alert('Error processing transfer');
// // //     }
// // //   };

// // //   const tabs = [
// // //     { id: 'banks' as ActiveTab, label: 'Manage Banks',  color: 'blue' },
// // //     { id: 'branches' as ActiveTab, label: 'Manage Branches',  color: 'green', disabled: banks.length === 0 },
// // //     { id: 'customers' as ActiveTab, label: 'Customers', color: 'purple' },
// // //     { id: 'kyc' as ActiveTab, label: 'Manage KYC',  color: 'orange' },
// // //     { id: 'employees' as ActiveTab, label: 'Manage Employees', color: 'indigo' },
// // //     { id: 'operations' as ActiveTab, label: 'Operations', color: 'teal' }
// // //   ];

// // //   const getTabColorClasses = (color: string, isActive: boolean, isDisabled: boolean) => {
// // //     if (isDisabled) {
// // //       return 'bg-gray-100 text-gray-400 cursor-not-allowed';
// // //     }
    
// // //     const colorMap = {
// // //       blue: isActive ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50',
// // //       green: isActive ? 'bg-green-600 text-white' : 'bg-white text-green-600 hover:bg-green-50',
// // //       purple: isActive ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 hover:bg-purple-50',
// // //       orange: isActive ? 'bg-orange-600 text-white' : 'bg-white text-orange-600 hover:bg-orange-50',
// // //       indigo: isActive ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 hover:bg-indigo-50',
// // //       teal: isActive ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 hover:bg-teal-50'
// // //     };
    
// // //     return colorMap[color as keyof typeof colorMap] || colorMap.blue;
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
// // //         <div className="text-center">
// // //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
// // //           <p className="text-gray-600">Loading data from MongoDB...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
// // //       <div className="container mx-auto px-4 py-8">
// // //         <div className="text-center mb-8">
// // //           <h1 className="text-4xl font-bold text-gray-800 mb-2">Bank Management System</h1>
// // //           <p className="text-gray-600">Comprehensive banking operations management platform with MongoDB</p>
// // //         </div>

// // //         <div className="flex flex-wrap justify-center gap-4 mb-8">
// // //           {tabs.map((tab) => {
// // //             // const Icon = tab.icon;
// // //             const isActive = activeTab === tab.id;
// // //             const isDisabled = tab.disabled;
            
// // //             return (
// // //               <button
// // //                 key={tab.id}
// // //                 onClick={() => !isDisabled && setActiveTab(tab.id)}
// // //                 disabled={isDisabled}
// // //                 className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm ${getTabColorClasses(tab.color, isActive, isDisabled)}`}
// // //                 title={isDisabled ? 'Create a bank first to enable this feature' : ''}
// // //               >
// // //                 {tab.label}
// // //                 {isDisabled && (
// // //                   <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1 rounded">
// // //                     Disabled
// // //                   </span>
// // //                 )}
// // //               </button>
// // //             );
// // //           })}
// // //         </div>

// // //         <div className="max-w-7xl mx-auto">
// // //           {activeTab === 'banks' && (
// // //             <ManageBank
// // //               banks={banks}
// // //               onAddBank={addBank}
// // //               onUpdateBank={updateBank}
// // //               onDeleteBank={deleteBank}
// // //             />
// // //           )}
          
// // //           {activeTab === 'branches' && (
// // //             <ManageBranch
// // //               banks={banks}
// // //               branches={branches}
// // //               onAddBranch={addBranch}
// // //               onUpdateBranch={updateBranch}
// // //               onDeleteBranch={deleteBranch}
// // //             />
// // //           )}

// // //           {activeTab === 'customers' && (
// // //             <ManageCustomer
// // //               customers={customers}
// // //               onAddCustomer={addCustomer}
// // //               onUpdateCustomer={updateCustomer}
// // //               onDeleteCustomer={deleteCustomer}
// // //             />
// // //           )}

// // //           {activeTab === 'kyc' && (
// // //             <ManageKYC
// // //               banks={banks}
// // //               customers={customers}
// // //               kycRecords={kycRecords}
// // //               onAddKYC={addKYC}
// // //               onUpdateKYC={updateKYC}
// // //               onDeleteKYC={deleteKYC}
// // //             />
// // //           )}

// // //           {activeTab === 'employees' && (
// // //             <ManageEmployee
// // //               banks={banks}
// // //               branches={branches}
// // //               employees={employees}
// // //               onAddEmployee={addEmployee}
// // //               onUpdateEmployee={updateEmployee}
// // //               onDeleteEmployee={deleteEmployee}
// // //             />
// // //           )}

// // //           {activeTab === 'operations' && (
// // //             <Operations
// // //               banks={banks}
// // //               branches={branches}
// // //               customers={customers}
// // //               accounts={accounts}
// // //               transactions={transactions}
// // //               onAddAccount={addAccount}
// // //               onDeposit={handleDeposit}
// // //               onWithdraw={handleWithdraw}
// // //               onTransfer={handleTransfer}
// // //             />
// // //           )}
// // //         </div>

// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default App;
// // ============================================================================================================================================
// // import React, { useState, useEffect } from 'react';
// // import { Bank, Branch, Customer, KYC, Employee, Account, Transaction } from './types';
// // import ManageBank from './components/ManageBank';
// // import ManageBranch from './components/ManageBranch';
// // import ManageCustomer from './components/ManageCustomer';
// // import ManageKYC from './components/ManageKYC';
// // import ManageEmployee from './components/ManageEmployee';
// // import Operations from './components/Operations';
// // import LoanContainer from './components/LoanManagement';
// // import { banksApi, branchesApi, customersApi, kycApi, employeesApi, accountsApi, transactionsApi } from './services/api';

// // type ActiveTab = 'banks' | 'branches' | 'customers' | 'kyc' | 'employees' | 'operations' | 'loans';

// // function App() {
// //   const [activeTab, setActiveTab] = useState<ActiveTab>('banks');
// //   const [loading, setLoading] = useState(false);
  
// //   const [banks, setBanks] = useState<Bank[]>([]);
// //   const [branches, setBranches] = useState<Branch[]>([]);
// //   const [customers, setCustomers] = useState<Customer[]>([]);
// //   const [kycRecords, setKycRecords] = useState<KYC[]>([]);
// //   const [employees, setEmployees] = useState<Employee[]>([]);
// //   const [accounts, setAccounts] = useState<Account[]>([]);
// //   const [transactions, setTransactions] = useState<Transaction[]>([]);
// //   const [selectedBankIdForBranch, setSelectedBankIdForBranch] = useState<string | null>(null);
// //   useEffect(() => {
// //     loadAllData();
// //   }, []);

// //   const loadAllData = async () => {
// //     setLoading(true);
// //     try {
// //       const [banksData, branchesData, customersData, kycData, employeesData, accountsData, transactionsData] = await Promise.all([
// //         banksApi.getAll(),
// //         branchesApi.getAll(),
// //         customersApi.getAll(),
// //         kycApi.getAll(),
// //         employeesApi.getAll(),
// //         accountsApi.getAll(),
// //         transactionsApi.getAll(),
// //       ]);

// //       setBanks(banksData);
// //       setBranches(branchesData);
// //       setCustomers(customersData);
// //       setKycRecords(kycData);
// //       setEmployees(employeesData);
// //       setAccounts(accountsData);
// //       setTransactions(transactionsData);
// //     } catch (error) {
// //       console.error('Error loading data:', error);
// //       alert('Error loading data from database. Please check if MongoDB is running.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const addBank = async (bankData: Omit<Bank, 'id' | 'createdAt'>) => {
// //     try {
// //       const newBank = await banksApi.create(bankData);
// //       setBanks(prev => [...prev, newBank]);
// //     } catch (error) {
// //       console.error('Error adding bank:', error);
// //       alert('Error adding bank');
// //     }
// //   };

// //   const updateBank = async (id: string, bankData: Omit<Bank, 'id' | 'createdAt'>) => {
// //     try {
// //       const updatedBank = await banksApi.update(id, bankData);
// //       setBanks(prev => prev.map(bank => 
// //         bank.id === id ? updatedBank : bank
// //       ));
// //     } catch (error) {
// //       console.error('Error updating bank:', error);
// //       alert('Error updating bank');
// //     }
// //   };

// //   const deleteBank = async (id: string) => {
// //     try {
// //       await banksApi.delete(id);
// //       setBanks(prev => prev.filter(bank => bank.id !== id));
// //       setBranches(prev => prev.filter(branch => branch.bankId !== id));
// //       setEmployees(prev => prev.filter(employee => employee.bankId !== id));
// //     } catch (error) {
// //       console.error('Error deleting bank:', error);
// //       alert('Error deleting bank');
// //     }
// //   };

// //   const addBranch = async (branchData: Omit<Branch, 'id' | 'createdAt'>) => {
// //     try {
// //       const newBranch = await branchesApi.create(branchData);
// //       setBranches(prev => [...prev, newBranch]);
// //     } catch (error) {
// //       console.error('Error adding branch:', error);
// //       alert('Error adding branch');
// //     }
// //   };

// //   const updateBranch = async (id: string, branchData: Omit<Branch, 'id' | 'createdAt'>) => {
// //     try {
// //       const updatedBranch = await branchesApi.update(id, branchData);
// //       setBranches(prev => prev.map(branch => 
// //         branch.id === id ? updatedBranch : branch
// //       ));
// //     } catch (error) {
// //       console.error('Error updating branch:', error);
// //       alert('Error updating branch');
// //     }
// //   };

// //   const deleteBranch = async (id: string) => {
// //     try {
// //       await branchesApi.delete(id);
// //       setBranches(prev => prev.filter(branch => branch.id !== id));
// //       setEmployees(prev => prev.filter(employee => employee.branchId !== id));
// //     } catch (error) {
// //       console.error('Error deleting branch:', error);
// //       alert('Error deleting branch');
// //     }
// //   };

// //   const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
// //     try {
// //       const newCustomer = await customersApi.create(customerData);
// //       setCustomers(prev => [...prev, newCustomer]);
// //     } catch (error) {
// //       console.error('Error adding customer:', error);
// //       alert('Error adding customer');
// //     }
// //   };

// //   const updateCustomer = async (id: string, customerData: Omit<Customer, 'id' | 'createdAt'>) => {
// //     try {
// //       const updatedCustomer = await customersApi.update(id, customerData);
// //       setCustomers(prev => prev.map(customer => 
// //         customer.id === id ? updatedCustomer : customer
// //       ));
// //     } catch (error) {
// //       console.error('Error updating customer:', error);
// //       alert('Error updating customer');
// //     }
// //   };

// //   const deleteCustomer = async (id: string) => {
// //     try {
// //       await customersApi.delete(id);
// //       setCustomers(prev => prev.filter(customer => customer.id !== id));
// //       setKycRecords(prev => prev.filter(kyc => kyc.customerId !== id));
// //     } catch (error) {
// //       console.error('Error deleting customer:', error);
// //       alert('Error deleting customer');
// //     }
// //   };

// //   const addKYC = async (kycData: Omit<KYC, 'id' | 'createdAt'>) => {
// //     try {
// //       const newKYC = await kycApi.create(kycData);
// //       setKycRecords(prev => [...prev, newKYC]);
// //     } catch (error) {
// //       console.error('Error adding KYC:', error);
// //       alert('Error adding KYC record');
// //     }
// //   };

// //   const updateKYC = async (id: string, kycData: Omit<KYC, 'id' | 'createdAt'>) => {
// //     try {
// //       const updatedKYC = await kycApi.update(id, kycData);
// //       setKycRecords(prev => prev.map(kyc => 
// //         kyc.id === id ? updatedKYC : kyc
// //       ));
// //     } catch (error) {
// //       console.error('Error updating KYC:', error);
// //       alert('Error updating KYC record');
// //     }
// //   };

// //   const deleteKYC = async (id: string) => {
// //     try {
// //       await kycApi.delete(id);
// //       setKycRecords(prev => prev.filter(kyc => kyc.id !== id));
// //     } catch (error) {
// //       console.error('Error deleting KYC:', error);
// //       alert('Error deleting KYC record');
// //     }
// //   };

// //   const addEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
// //     try {
// //       const newEmployee = await employeesApi.create(employeeData);
// //       setEmployees(prev => [...prev, newEmployee]);
// //     } catch (error) {
// //       console.error('Error adding employee:', error);
// //       alert('Error adding employee');
// //     }
// //   };

// //   const updateEmployee = async (id: string, employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
// //     try {
// //       const updatedEmployee = await employeesApi.update(id, employeeData);
// //       setEmployees(prev => prev.map(employee => 
// //         employee.id === id ? updatedEmployee : employee
// //       ));
// //     } catch (error) {
// //       console.error('Error updating employee:', error);
// //       alert('Error updating employee');
// //     }
// //   };

// //   const deleteEmployee = async (id: string) => {
// //     try {
// //       await employeesApi.delete(id);
// //       setEmployees(prev => prev.filter(employee => employee.id !== id));
// //     } catch (error) {
// //       console.error('Error deleting employee:', error);
// //       alert('Error deleting employee');
// //     }
// //   };

// //   const addAccount = async (accountData: Omit<Account, 'id' | 'createdAt'>) => {
// //     try {
// //       const newAccount = await accountsApi.create(accountData);
// //       setAccounts(prev => [...prev, newAccount]);
      
// //       if (accountData.balance > 0) {
// //         const transactionData = {
// //           accountId: newAccount.id,
// //           type: 'deposit' as const,
// //           amount: accountData.balance,
// //           balance: accountData.balance,
// //           description: 'Initial Deposit',
// //           referenceNumber: `TXN${Date.now()}`
// //         };
// //         const newTransaction = await transactionsApi.create(transactionData);
// //         setTransactions(prev => [...prev, newTransaction]);
// //       }
// //     } catch (error) {
// //       console.error('Error adding account:', error);
// //       alert('Error adding account');
// //     }
// //   };

// //   const handleDeposit = async (accountId: string, amount: number, description: string) => {
// //     try {
// //       const account = accounts.find(acc => acc.id === accountId);
// //       if (!account) return;

// //       const newBalance = account.balance + amount;
      
// //       await accountsApi.update(accountId, { ...account, balance: newBalance });
// //       setAccounts(prev => prev.map(acc => 
// //         acc.id === accountId ? { ...acc, balance: newBalance } : acc
// //       ));

// //       const transactionData = {
// //         accountId,
// //         type: 'deposit' as const,
// //         amount,
// //         balance: newBalance,
// //         description,
// //         referenceNumber: `TXN${Date.now()}`
// //       };
// //       const newTransaction = await transactionsApi.create(transactionData);
// //       setTransactions(prev => [...prev, newTransaction]);

// //       alert('Deposit successful!');
// //     } catch (error) {
// //       console.error('Error processing deposit:', error);
// //       alert('Error processing deposit');
// //     }
// //   };

// //   const handleWithdraw = async (accountId: string, amount: number, description: string) => {
// //     try {
// //       const account = accounts.find(acc => acc.id === accountId);
// //       if (!account || account.balance < amount) return;

// //       const newBalance = account.balance - amount;
      
// //       await accountsApi.update(accountId, { ...account, balance: newBalance });
// //       setAccounts(prev => prev.map(acc => 
// //         acc.id === accountId ? { ...acc, balance: newBalance } : acc
// //       ));

// //       const transactionData = {
// //         accountId,
// //         type: 'withdraw' as const,
// //         amount,
// //         balance: newBalance,
// //         description,
// //         referenceNumber: `TXN${Date.now()}`
// //       };
// //       const newTransaction = await transactionsApi.create(transactionData);
// //       setTransactions(prev => [...prev, newTransaction]);

// //       alert('Withdrawal successful!');
// //     } catch (error) {
// //       console.error('Error processing withdrawal:', error);
// //       alert('Error processing withdrawal');
// //     }
// //   };

// //   const handleTransfer = async (fromAccountId: string, toAccountId: string, amount: number, description: string) => {
// //     try {
// //       const fromAccount = accounts.find(acc => acc.id === fromAccountId);
// //       const toAccount = accounts.find(acc => acc.id === toAccountId);
      
// //       if (!fromAccount || !toAccount || fromAccount.balance < amount) return;

// //       const fromNewBalance = fromAccount.balance - amount;
// //       const toNewBalance = toAccount.balance + amount;
// //       const refNumber = `TXN${Date.now()}`;
      
// //       await accountsApi.update(fromAccountId, { ...fromAccount, balance: fromNewBalance });
// //       await accountsApi.update(toAccountId, { ...toAccount, balance: toNewBalance });
      
// //       setAccounts(prev => prev.map(acc => {
// //         if (acc.id === fromAccountId) return { ...acc, balance: fromNewBalance };
// //         if (acc.id === toAccountId) return { ...acc, balance: toNewBalance };
// //         return acc;
// //       }));

// //       const fromTransactionData = {
// //         accountId: fromAccountId,
// //         type: 'transfer_out' as const,
// //         amount,
// //         balance: fromNewBalance,
// //         description,
// //         referenceNumber: refNumber,
// //         toAccountId
// //       };
      
// //       const toTransactionData = {
// //         accountId: toAccountId,
// //         type: 'transfer_in' as const,
// //         amount,
// //         balance: toNewBalance,
// //         description,
// //         referenceNumber: refNumber
// //       };

// //       const [fromTransaction, toTransaction] = await Promise.all([
// //         transactionsApi.create(fromTransactionData),
// //         transactionsApi.create(toTransactionData)
// //       ]);

// //       setTransactions(prev => [...prev, fromTransaction, toTransaction]);

// //       alert('Transfer successful!');
// //     } catch (error) {
// //       console.error('Error processing transfer:', error);
// //       alert('Error processing transfer');
// //     }
// //   };

// //   const tabs = [
// //     { id: 'banks' as ActiveTab, label: 'Manage Banks',  color: 'blue' },
// //     { id: 'branches' as ActiveTab, label: 'Manage Branches',  color: 'green', disabled: banks.length === 0 },
// //     { id: 'customers' as ActiveTab, label: 'Customers', color: 'purple' },
// //     { id: 'kyc' as ActiveTab, label: 'Manage KYC',  color: 'orange' },
// //     { id: 'employees' as ActiveTab, label: 'Manage Employees', color: 'indigo' },
// //     { id: 'operations' as ActiveTab, label: 'Operations', color: 'teal' },
// //     { id: 'loans' as ActiveTab, label: 'Loans', color: 'pink' }
// //   ];

// //   const getTabColorClasses = (color: string, isActive: boolean, isDisabled: boolean) => {
// //     if (isDisabled) {
// //       return 'bg-gray-100 text-gray-400 cursor-not-allowed';
// //     }
    
// //     const colorMap = {
// //       blue: isActive ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50',
// //       green: isActive ? 'bg-green-600 text-white' : 'bg-white text-green-600 hover:bg-green-50',
// //       purple: isActive ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 hover:bg-purple-50',
// //       orange: isActive ? 'bg-orange-600 text-white' : 'bg-white text-orange-600 hover:bg-orange-50',
// //       indigo: isActive ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 hover:bg-indigo-50',
// //       teal: isActive ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 hover:bg-teal-50',
// //       pink: isActive? 'bg-pink-600 text-white': 'bg-white text-pink-600 hover:bg-pink-50'
// //     };
    
// //     return colorMap[color as keyof typeof colorMap] || colorMap.blue;
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
// //           <p className="text-gray-600">Loading data from MongoDB...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
// //       <div className="container mx-auto px-4 py-8">
// //         <div className="text-center mb-8">
// //           <h1 className="text-4xl font-bold text-gray-800 mb-2">Bank Management System</h1>
// //           <p className="text-gray-600">Comprehensive banking operations management platform with MongoDB</p>
// //         </div>

// //         <div className="flex flex-wrap justify-center gap-4 mb-8">
// //           {tabs.map((tab) => {
// //             // const Icon = tab.icon;
// //             const isActive = activeTab === tab.id;
// //             const isDisabled = tab.disabled;
            
// //             return (
// //               <button
// //                 key={tab.id}
// //                 onClick={() => !isDisabled && setActiveTab(tab.id)}
// //                 disabled={isDisabled}
// //                 className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm ${getTabColorClasses(tab.color, isActive, isDisabled)}`}
// //                 title={isDisabled ? 'Create a bank first to enable this feature' : ''}
// //               >
// //                 {tab.label}
// //                 {isDisabled && (
// //                   <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1 rounded">
// //                     Disabled
// //                   </span>
// //                 )}
// //               </button>
// //             );
// //           })}
// //         </div>

// //         <div className="max-w-7xl mx-auto">
// //           {activeTab === 'banks' && (
// //             <ManageBank
// //             banks={banks}
// //             onAddBank={addBank}
// //             onUpdateBank={updateBank}
// //             onDeleteBank={deleteBank}
// //             onAddBranchClick={(bankId) => {
// //               setSelectedBankIdForBranch(bankId);
// //               setActiveTab('branches');
// //             }}
// //           />
          
          
// //           )}
          
// //           {activeTab === 'branches' && (
// //   <ManageBranch
// //     banks={banks}
// //     branches={branches}
// //     onAddBranch={addBranch}
// //     onUpdateBranch={updateBranch}
// //     onDeleteBranch={deleteBranch}
// //     selectedBankId={selectedBankIdForBranch}
// //   />
// // )}


// //           {activeTab === 'customers' && (
// //             <ManageCustomer
// //               customers={customers}
// //               onAddCustomer={addCustomer}
// //               onUpdateCustomer={updateCustomer}
// //               onDeleteCustomer={deleteCustomer}
// //             />
// //           )}

// //           {activeTab === 'kyc' && (
// //             <ManageKYC
// //               banks={banks}
// //               customers={customers}
// //               kycRecords={kycRecords}
// //               onAddKYC={addKYC}
// //               onUpdateKYC={updateKYC}
// //               onDeleteKYC={deleteKYC}
// //             />
// //           )}

// //           {activeTab === 'employees' && (
// //             <ManageEmployee
// //               banks={banks}
// //               branches={branches}
// //               employees={employees}
// //               onAddEmployee={addEmployee}
// //               onUpdateEmployee={updateEmployee}
// //               onDeleteEmployee={deleteEmployee}
// //             />
// //           )}

// //           {activeTab === 'operations' && (
// //             <Operations
// //               banks={banks}
// //               branches={branches}
// //               customers={customers}
// //               accounts={accounts}
// //               transactions={transactions}
// //               onAddAccount={addAccount}
// //               onDeposit={handleDeposit}
// //               onWithdraw={handleWithdraw}
// //               onTransfer={handleTransfer}
              
// //             />
// //           )}
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }

// // export default App;
// import React, { useState, useEffect } from 'react';
// import { Building2, MapPin, Users, FileCheck, User as UserTie, CreditCard, Shield, Banknote } from 'lucide-react';
// import { Bank, Branch, Customer, KYC, Employee, Account, Transaction } from './types';
// import ManageBank from './components/ManageBank';
// import ManageBranch from './components/ManageBranch';
// import ManageCustomer from './components/ManageCustomer';
// import ManageKYC from './components/ManageKYC';
// import ManageEmployee from './components/ManageEmployee';
// import Operations from './components/Operations';
// // import BankingOperations from './components/BankingOperations';
// import LoanManagement from './components/LoanManagement';
// import { banksApi, branchesApi, customersApi, kycApi, employeesApi, accountsApi, transactionsApi } from './services/api';

// type ActiveTab = 'banks' | 'branches' | 'customers' | 'kyc' | 'employees' | 'operations' | 'loans' ;

// function App() {
//   const [activeTab, setActiveTab] = useState<ActiveTab>('banks');
//   const [loading, setLoading] = useState(false);
  
//   // State management for all entities
//   const [banks, setBanks] = useState<Bank[]>([]);
//   const [branches, setBranches] = useState<Branch[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [kycRecords, setKycRecords] = useState<KYC[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [accounts, setAccounts] = useState<Account[]>([]);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);

//   // Load data on component mount
//   useEffect(() => {
//     loadAllData();
//   }, []);

//   const loadAllData = async () => {
//     setLoading(true);
//     try {
//       const [banksData, branchesData, customersData, kycData, employeesData, accountsData, transactionsData] = await Promise.all([
//         banksApi.getAll(),
//         branchesApi.getAll(),
//         customersApi.getAll(),
//         kycApi.getAll(),
//         employeesApi.getAll(),
//         accountsApi.getAll(),
//         transactionsApi.getAll(),
//       ]);

//       setBanks(banksData);
//       setBranches(branchesData);
//       setCustomers(customersData);
//       setKycRecords(kycData);
//       setEmployees(employeesData);
//       setAccounts(accountsData);
//       setTransactions(transactionsData);
//     } catch (error) {
//       console.error('Error loading data:', error);
//       alert('Error loading data from database. Please check if MongoDB is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Bank management functions
//   const addBank = async (bankData: Omit<Bank, 'id' | 'createdAt'>) => {
//     try {
//       const newBank = await banksApi.create(bankData);
//       setBanks(prev => [...prev, newBank]);
//     } catch (error) {
//       console.error('Error adding bank:', error);
//       alert('Error adding bank');
//     }
//   };

//   const updateBank = async (id: string, bankData: Omit<Bank, 'id' | 'createdAt'>) => {
//     try {
//       const updatedBank = await banksApi.update(id, bankData);
//       setBanks(prev => prev.map(bank => 
//         bank.id === id ? updatedBank : bank
//       ));
//     } catch (error) {
//       console.error('Error updating bank:', error);
//       alert('Error updating bank');
//     }
//   };

//   const deleteBank = async (id: string) => {
//     try {
//       await banksApi.delete(id);
//       setBanks(prev => prev.filter(bank => bank.id !== id));
//       // Also remove related branches and employees from state
//       setBranches(prev => prev.filter(branch => branch.bankId !== id));
//       setEmployees(prev => prev.filter(employee => employee.bankId !== id));
//     } catch (error) {
//       console.error('Error deleting bank:', error);
//       alert('Error deleting bank');
//     }
//   };

//   // Branch management functions
//   const addBranch = async (branchData: Omit<Branch, 'id' | 'createdAt'>) => {
//     try {
//       const newBranch = await branchesApi.create(branchData);
//       setBranches(prev => [...prev, newBranch]);
//     } catch (error) {
//       console.error('Error adding branch:', error);
//       alert('Error adding branch');
//     }
//   };

//   const updateBranch = async (id: string, branchData: Omit<Branch, 'id' | 'createdAt'>) => {
//     try {
//       const updatedBranch = await branchesApi.update(id, branchData);
//       setBranches(prev => prev.map(branch => 
//         branch.id === id ? updatedBranch : branch
//       ));
//     } catch (error) {
//       console.error('Error updating branch:', error);
//       alert('Error updating branch');
//     }
//   };

//   const deleteBranch = async (id: string) => {
//     try {
//       await branchesApi.delete(id);
//       setBranches(prev => prev.filter(branch => branch.id !== id));
//       // Also remove related employees from state
//       setEmployees(prev => prev.filter(employee => employee.branchId !== id));
//     } catch (error) {
//       console.error('Error deleting branch:', error);
//       alert('Error deleting branch');
//     }
//   };

//   // Customer management functions
//   const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
//     try {
//       const newCustomer = await customersApi.create(customerData);
//       setCustomers(prev => [...prev, newCustomer]);
//     } catch (error) {
//       console.error('Error adding customer:', error);
//       alert('Error adding customer');
//     }
//   };

//   const updateCustomer = async (id: string, customerData: Omit<Customer, 'id' | 'createdAt'>) => {
//     try {
//       const updatedCustomer = await customersApi.update(id, customerData);
//       setCustomers(prev => prev.map(customer => 
//         customer.id === id ? updatedCustomer : customer
//       ));
//     } catch (error) {
//       console.error('Error updating customer:', error);
//       alert('Error updating customer');
//     }
//   };

//   const deleteCustomer = async (id: string) => {
//     try {
//       await customersApi.delete(id);
//       setCustomers(prev => prev.filter(customer => customer.id !== id));
//       // Also remove related KYC records from state
//       setKycRecords(prev => prev.filter(kyc => kyc.customerId !== id));
//     } catch (error) {
//       console.error('Error deleting customer:', error);
//       alert('Error deleting customer');
//     }
//   };

//   // KYC management functions
//   const addKYC = async (kycData: Omit<KYC, 'id' | 'createdAt'>) => {
//     try {
//       const newKYC = await kycApi.create(kycData);
//       setKycRecords(prev => [...prev, newKYC]);
//     } catch (error) {
//       console.error('Error adding KYC:', error);
//       alert('Error adding KYC record');
//     }
//   };

//   const updateKYC = async (id: string, kycData: Omit<KYC, 'id' | 'createdAt'>) => {
//     try {
//       const updatedKYC = await kycApi.update(id, kycData);
//       setKycRecords(prev => prev.map(kyc => 
//         kyc.id === id ? updatedKYC : kyc
//       ));
//     } catch (error) {
//       console.error('Error updating KYC:', error);
//       alert('Error updating KYC record');
//     }
//   };

//   const deleteKYC = async (id: string) => {
//     try {
//       await kycApi.delete(id);
//       setKycRecords(prev => prev.filter(kyc => kyc.id !== id));
//     } catch (error) {
//       console.error('Error deleting KYC:', error);
//       alert('Error deleting KYC record');
//     }
//   };

//   // Employee management functions
//   const addEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
//     try {
//       const newEmployee = await employeesApi.create(employeeData);
//       setEmployees(prev => [...prev, newEmployee]);
//     } catch (error) {
//       console.error('Error adding employee:', error);
//       alert('Error adding employee');
//     }
//   };

//   const updateEmployee = async (id: string, employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
//     try {
//       const updatedEmployee = await employeesApi.update(id, employeeData);
//       setEmployees(prev => prev.map(employee => 
//         employee.id === id ? updatedEmployee : employee
//       ));
//     } catch (error) {
//       console.error('Error updating employee:', error);
//       alert('Error updating employee');
//     }
//   };

//   const deleteEmployee = async (id: string) => {
//     try {
//       await employeesApi.delete(id);
//       setEmployees(prev => prev.filter(employee => employee.id !== id));
//     } catch (error) {
//       console.error('Error deleting employee:', error);
//       alert('Error deleting employee');
//     }
//   };

//   // Account management functions
//   const addAccount = async (accountData: Omit<Account, 'id' | 'createdAt'>) => {
//     try {
//       const newAccount = await accountsApi.create(accountData);
//       setAccounts(prev => [...prev, newAccount]);
      
//       // Create initial deposit transaction if balance > 0
//       if (accountData.balance > 0) {
//         const transactionData = {
//           accountId: newAccount.id,
//           type: 'deposit' as const,
//           amount: accountData.balance,
//           balance: accountData.balance,
//           description: 'Initial Deposit',
//           referenceNumber: `TXN${Date.now()}`
//         };
//         const newTransaction = await transactionsApi.create(transactionData);
//         setTransactions(prev => [...prev, newTransaction]);
//       }
//     } catch (error) {
//       console.error('Error adding account:', error);
//       alert('Error adding account');
//     }
//   };

//   // Transaction functions
//   const handleDeposit = async (accountId: string, amount: number, description: string) => {
//     try {
//       const account = accounts.find(acc => acc.id === accountId);
//       if (!account) return;

//       const newBalance = account.balance + amount;
      
//       // Update account balance
//       await accountsApi.update(accountId, { ...account, balance: newBalance });
//       setAccounts(prev => prev.map(acc => 
//         acc.id === accountId ? { ...acc, balance: newBalance } : acc
//       ));

//       // Create transaction record
//       const transactionData = {
//         accountId,
//         type: 'deposit' as const,
//         amount,
//         balance: newBalance,
//         description,
//         referenceNumber: `TXN${Date.now()}`
//       };
//       const newTransaction = await transactionsApi.create(transactionData);
//       setTransactions(prev => [...prev, newTransaction]);

//       alert('Deposit successful!');
//     } catch (error) {
//       console.error('Error processing deposit:', error);
//       alert('Error processing deposit');
//     }
//   };

//   const handleWithdraw = async (accountId: string, amount: number, description: string) => {
//     try {
//       const account = accounts.find(acc => acc.id === accountId);
//       if (!account || account.balance < amount) return;

//       const newBalance = account.balance - amount;
      
//       // Update account balance
//       await accountsApi.update(accountId, { ...account, balance: newBalance });
//       setAccounts(prev => prev.map(acc => 
//         acc.id === accountId ? { ...acc, balance: newBalance } : acc
//       ));

//       // Create transaction record
//       const transactionData = {
//         accountId,
//         type: 'withdraw' as const,
//         amount,
//         balance: newBalance,
//         description,
//         referenceNumber: `TXN${Date.now()}`
//       };
//       const newTransaction = await transactionsApi.create(transactionData);
//       setTransactions(prev => [...prev, newTransaction]);

//       alert('Withdrawal successful!');
//     } catch (error) {
//       console.error('Error processing withdrawal:', error);
//       alert('Error processing withdrawal');
//     }
//   };

//   const handleTransfer = async (fromAccountId: string, toAccountId: string, amount: number, description: string) => {
//     try {
//       const fromAccount = accounts.find(acc => acc.id === fromAccountId);
//       const toAccount = accounts.find(acc => acc.id === toAccountId);
      
//       if (!fromAccount || !toAccount || fromAccount.balance < amount) return;

//       const fromNewBalance = fromAccount.balance - amount;
//       const toNewBalance = toAccount.balance + amount;
//       const refNumber = `TXN${Date.now()}`;
      
//       // Update both account balances
//       await accountsApi.update(fromAccountId, { ...fromAccount, balance: fromNewBalance });
//       await accountsApi.update(toAccountId, { ...toAccount, balance: toNewBalance });
      
//       setAccounts(prev => prev.map(acc => {
//         if (acc.id === fromAccountId) return { ...acc, balance: fromNewBalance };
//         if (acc.id === toAccountId) return { ...acc, balance: toNewBalance };
//         return acc;
//       }));

//       // Create transaction records for both accounts
//       const fromTransactionData = {
//         accountId: fromAccountId,
//         type: 'transfer_out' as const,
//         amount,
//         balance: fromNewBalance,
//         description,
//         referenceNumber: refNumber,
//         toAccountId
//       };
      
//       const toTransactionData = {
//         accountId: toAccountId,
//         type: 'transfer_in' as const,
//         amount,
//         balance: toNewBalance,
//         description,
//         referenceNumber: refNumber
//       };

//       const [fromTransaction, toTransaction] = await Promise.all([
//         transactionsApi.create(fromTransactionData),
//         transactionsApi.create(toTransactionData)
//       ]);

//       setTransactions(prev => [...prev, fromTransaction, toTransaction]);

//       alert('Transfer successful!');
//     } catch (error) {
//       console.error('Error processing transfer:', error);
//       alert('Error processing transfer');
//     }
//   };

//   const tabs = [
//     { id: 'banks' as ActiveTab, label: 'Manage Banks', icon: Building2, color: 'blue' },
//     { id: 'branches' as ActiveTab, label: 'Manage Branches', icon: MapPin, color: 'green', disabled: banks.length === 0 },
//     { id: 'customers' as ActiveTab, label: 'Customers', icon: Users, color: 'purple' },
//     { id: 'kyc' as ActiveTab, label: 'Manage KYC', icon: FileCheck, color: 'orange' },
//     { id: 'employees' as ActiveTab, label: 'Manage Employees', icon: UserTie, color: 'indigo' },
//     { id: 'operations' as ActiveTab, label: 'Customer Operations', icon: CreditCard, color: 'teal' },
//     { id: 'loans' as ActiveTab, label: 'Loan Management', icon: Banknote, color: 'rose' },
//     { id: 'banking-ops' as ActiveTab, label: 'Banking Operations', icon: Shield, color: 'violet' }
//   ];

//   const getTabColorClasses = (color: string, isActive: boolean, isDisabled: boolean) => {
//     if (isDisabled) {
//       return 'bg-gray-100 text-gray-400 cursor-not-allowed';
//     }
    
//     const colorMap = {
//       blue: isActive ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50',
//       green: isActive ? 'bg-green-600 text-white' : 'bg-white text-green-600 hover:bg-green-50',
//       purple: isActive ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 hover:bg-purple-50',
//       orange: isActive ? 'bg-orange-600 text-white' : 'bg-white text-orange-600 hover:bg-orange-50',
//       indigo: isActive ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 hover:bg-indigo-50',
//       teal: isActive ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 hover:bg-teal-50',
//       rose: isActive ? 'bg-rose-600 text-white' : 'bg-white text-rose-600 hover:bg-rose-50',
//       violet: isActive ? 'bg-violet-600 text-white' : 'bg-white text-violet-600 hover:bg-violet-50'
//     };
    
//     return colorMap[color as keyof typeof colorMap] || colorMap.blue;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading data from MongoDB...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">Bank Management System</h1>
//           <p className="text-gray-600">Comprehensive banking operations management platform with MongoDB</p>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="flex flex-wrap justify-center gap-4 mb-8">
//           {tabs.map((tab) => {
//             const Icon = tab.icon;
//             const isActive = activeTab === tab.id;
//             const isDisabled = tab.disabled;
            
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => !isDisabled && setActiveTab(tab.id)}
//                 disabled={isDisabled}
//                 className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm ${getTabColorClasses(tab.color, isActive, isDisabled)}`}
//                 title={isDisabled ? 'Create a bank first to enable this feature' : ''}
//               >
//                 <Icon className="h-5 w-5" />
//                 {tab.label}
//                 {isDisabled && (
//                   <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1 rounded">
//                     Disabled
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </div>

//         {/* Content Area */}
//         <div className="max-w-7xl mx-auto">
//           {activeTab === 'banks' && (
//             <ManageBank
//               banks={banks}
//               onAddBank={addBank}
//               onUpdateBank={updateBank}
//               onDeleteBank={deleteBank}
//             />
//           )}
          
//           {activeTab === 'branches' && (
//             <ManageBranch
//               banks={banks}
//               branches={branches}
//               onAddBranch={addBranch}
//               onUpdateBranch={updateBranch}
//               onDeleteBranch={deleteBranch}
//             />
//           )}

//           {activeTab === 'customers' && (
//             <ManageCustomer
//               customers={customers}
//               onAddCustomer={addCustomer}
//               onUpdateCustomer={updateCustomer}
//               onDeleteCustomer={deleteCustomer}
//             />
//           )}

//           {activeTab === 'kyc' && (
//             <ManageKYC
//               banks={banks}
//               customers={customers}
//               kycRecords={kycRecords}
//               onAddKYC={addKYC}
//               onUpdateKYC={updateKYC}
//               onDeleteKYC={deleteKYC}
//             />
//           )}

//           {activeTab === 'employees' && (
//             <ManageEmployee
//               banks={banks}
//               branches={branches}
//               employees={employees}
//               onAddEmployee={addEmployee}
//               onUpdateEmployee={updateEmployee}
//               onDeleteEmployee={deleteEmployee}
//             />
//           )}

//           {activeTab === 'operations' && (
//             <Operations
//               banks={banks}
//               branches={branches}
//               customers={customers}
//               accounts={accounts}
//               transactions={transactions}
//               onAddAccount={addAccount}
//               onDeposit={handleDeposit}
//               onWithdraw={handleWithdraw}
//               onTransfer={handleTransfer}
//             />
//           )}

//           {activeTab === 'loans' && (
//             <LoanManagement
//               banks={banks}
//               branches={branches}
//               customers={customers}
//               accounts={accounts}
//             />
//           )}

//           {activeTab === 'banking-ops' && (
//             <BankingOperations
//               banks={banks}
//               branches={branches}
//               customers={customers}
//               accounts={accounts}
//               transactions={transactions}
//             />
//           )}
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-12 pt-8 border-t border-gray-200">
//           <p className="text-gray-500">Bank Management System - Enterprise Banking Operations Platform</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
//==================================================================================================================================================
// import React, { useState, useEffect } from 'react';
// import { Building2, MapPin, Users, FileCheck, User as UserTie, CreditCard, Shield, Banknote, FileText } from 'lucide-react';
// import { Bank, Branch, Customer, KYC, Employee, Account, Transaction } from './types';
// import HomePage from './components/HomePage';
// import CustomerPortal from './components/CustomerPortal';
// import ManageBank from './components/ManageBank';
// import ManageBranch from './components/ManageBranch';
// import ManageCustomer from './components/ManageCustomer';
// import ManageKYC from './components/ManageKYC';
// import ManageEmployee from './components/ManageEmployee';
// import Operations from './components/Operations';
// import BankingOperations from './components/BankingOperations';
// import LoanManagement from './components/LoanManagement';
// import Reports from './components/Reports';
// import { banksApi, branchesApi, customersApi, kycApi, employeesApi, accountsApi, transactionsApi } from './services/api';

// type ActiveTab = 'banks' | 'branches' | 'customers' | 'kyc' | 'employees' | 'operations' | 'loans' | 'banking-ops' | 'reports';
// type UserMode = 'home' | 'admin' | 'customer';

// function App() {
//   const [userMode, setUserMode] = useState<UserMode>('home');
//   const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
//   const [activeTab, setActiveTab] = useState<ActiveTab>('banks');
//   const [loading, setLoading] = useState(false);
  
//   // State management for all entities
//   const [banks, setBanks] = useState<Bank[]>([]);
//   const [branches, setBranches] = useState<Branch[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [kycRecords, setKycRecords] = useState<KYC[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [accounts, setAccounts] = useState<Account[]>([]);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);

//   // Load data on component mount
//   useEffect(() => {
//     if (userMode !== 'home') {
//       loadAllData();
//     }
//   }, [userMode]);

//   const loadAllData = async () => {
//     setLoading(true);
//     try {
//       const [banksData, branchesData, customersData, kycData, employeesData, accountsData, transactionsData] = await Promise.all([
//         banksApi.getAll(),
//         branchesApi.getAll(),
//         customersApi.getAll(),
//         kycApi.getAll(),
//         employeesApi.getAll(),
//         accountsApi.getAll(),
//         transactionsApi.getAll(),
//       ]);

//       setBanks(banksData);
//       setBranches(branchesData);
//       setCustomers(customersData);
//       setKycRecords(kycData);
//       setEmployees(employeesData);
//       setAccounts(accountsData);
//       setTransactions(transactionsData);
//     } catch (error) {
//       console.error('Error loading data:', error);
//       alert('Error loading data from database. Please check if MongoDB is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Authentication handlers
//   const handleAdminLogin = (username: string, password: string) => {
//     // Simple admin authentication (in production, use proper authentication)
//     if (username === 'admin' && password === 'admin123') {
//       setUserMode('admin');
//       setActiveTab('banks');
//     } else {
//       alert('Invalid admin credentials');
//     }
//   };

//   const handleCustomerLogin = (customerId: string, password: string) => {
//     // Find customer by ID (in production, use proper authentication)
//     const customer = customers.find(c => c.id === customerId || c.panNumber === customerId);
//     if (customer && password === 'customer123') { // Simple password check
//       setCurrentCustomer(customer);
//       setUserMode('customer');
//     } else {
//       alert('Invalid customer credentials');
//     }
//   };

//   const handleLogout = () => {
//     setUserMode('home');
//     setCurrentCustomer(null);
//     setActiveTab('banks');
//   };

//   // Check withdrawal eligibility API
//   const checkWithdrawEligibility = async (customerId: string, amount: number): Promise<{ eligible: boolean; message: string }> => {
//     try {
//       const response = await fetch('http://localhost:5000/api/check-withdraw-eligibility', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ customerId, amount }),
//       });
      
//       const result = await response.json();
//       return result;
//     } catch (error) {
//       console.error('Error checking withdrawal eligibility:', error);
//       return { eligible: false, message: 'Error checking eligibility' };
//     }
//   };

//   // Generate report API
//   const generateReport = async (reportType: string, period: string, filters: any) => {
//     try {
//       const response = await fetch('http://localhost:5000/api/generate-report', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ reportType, period, filters }),
//       });
      
//       if (response.ok) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.style.display = 'none';
//         a.href = url;
//         a.download = `${reportType}_${period}_report.csv`;
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         alert('Report downloaded successfully!');
//       } else {
//         alert('Error generating report');
//       }
//     } catch (error) {
//       console.error('Error generating report:', error);
//       alert('Error generating report');
//     }
//   };

//   // Bank management functions
//   const addBank = async (bankData: Omit<Bank, 'id' | 'createdAt'>) => {
//     try {
//       const newBank = await banksApi.create(bankData);
//       setBanks(prev => [...prev, newBank]);
//     } catch (error) {
//       console.error('Error adding bank:', error);
//       alert('Error adding bank');
//     }
//   };

//   const updateBank = async (id: string, bankData: Omit<Bank, 'id' | 'createdAt'>) => {
//     try {
//       const updatedBank = await banksApi.update(id, bankData);
//       setBanks(prev => prev.map(bank => 
//         bank.id === id ? updatedBank : bank
//       ));
//     } catch (error) {
//       console.error('Error updating bank:', error);
//       alert('Error updating bank');
//     }
//   };

//   const deleteBank = async (id: string) => {
//     try {
//       await banksApi.delete(id);
//       setBanks(prev => prev.filter(bank => bank.id !== id));
//       // Also remove related branches and employees from state
//       setBranches(prev => prev.filter(branch => branch.bankId !== id));
//       setEmployees(prev => prev.filter(employee => employee.bankId !== id));
//     } catch (error) {
//       console.error('Error deleting bank:', error);
//       alert('Error deleting bank');
//     }
//   };

//   // Branch management functions
//   const addBranch = async (branchData: Omit<Branch, 'id' | 'createdAt'>) => {
//     try {
//       const newBranch = await branchesApi.create(branchData);
//       setBranches(prev => [...prev, newBranch]);
//     } catch (error) {
//       console.error('Error adding branch:', error);
//       alert('Error adding branch');
//     }
//   };

//   const updateBranch = async (id: string, branchData: Omit<Branch, 'id' | 'createdAt'>) => {
//     try {
//       const updatedBranch = await branchesApi.update(id, branchData);
//       setBranches(prev => prev.map(branch => 
//         branch.id === id ? updatedBranch : branch
//       ));
//     } catch (error) {
//       console.error('Error updating branch:', error);
//       alert('Error updating branch');
//     }
//   };

//   const deleteBranch = async (id: string) => {
//     try {
//       await branchesApi.delete(id);
//       setBranches(prev => prev.filter(branch => branch.id !== id));
//       // Also remove related employees from state
//       setEmployees(prev => prev.filter(employee => employee.branchId !== id));
//     } catch (error) {
//       console.error('Error deleting branch:', error);
//       alert('Error deleting branch');
//     }
//   };

//   // Customer management functions
//   const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
//     try {
//       const newCustomer = await customersApi.create(customerData);
//       setCustomers(prev => [...prev, newCustomer]);
//     } catch (error) {
//       console.error('Error adding customer:', error);
//       alert('Error adding customer');
//     }
//   };

//   const updateCustomer = async (id: string, customerData: Omit<Customer, 'id' | 'createdAt'>) => {
//     try {
//       const updatedCustomer = await customersApi.update(id, customerData);
//       setCustomers(prev => prev.map(customer => 
//         customer.id === id ? updatedCustomer : customer
//       ));
//     } catch (error) {
//       console.error('Error updating customer:', error);
//       alert('Error updating customer');
//     }
//   };

//   const deleteCustomer = async (id: string) => {
//     try {
//       await customersApi.delete(id);
//       setCustomers(prev => prev.filter(customer => customer.id !== id));
//       // Also remove related KYC records from state
//       setKycRecords(prev => prev.filter(kyc => kyc.customerId !== id));
//     } catch (error) {
//       console.error('Error deleting customer:', error);
//       alert('Error deleting customer');
//     }
//   };

//   // KYC management functions
//   const addKYC = async (kycData: Omit<KYC, 'id' | 'createdAt'>) => {
//     try {
//       const newKYC = await kycApi.create(kycData);
//       setKycRecords(prev => [...prev, newKYC]);
//     } catch (error) {
//       console.error('Error adding KYC:', error);
//       alert('Error adding KYC record');
//     }
//   };

//   const updateKYC = async (id: string, kycData: Omit<KYC, 'id' | 'createdAt'>) => {
//     try {
//       const updatedKYC = await kycApi.update(id, kycData);
//       setKycRecords(prev => prev.map(kyc => 
//         kyc.id === id ? updatedKYC : kyc
//       ));
//     } catch (error) {
//       console.error('Error updating KYC:', error);
//       alert('Error updating KYC record');
//     }
//   };

//   const deleteKYC = async (id: string) => {
//     try {
//       await kycApi.delete(id);
//       setKycRecords(prev => prev.filter(kyc => kyc.id !== id));
//     } catch (error) {
//       console.error('Error deleting KYC:', error);
//       alert('Error deleting KYC record');
//     }
//   };

//   // Employee management functions
//   const addEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
//     try {
//       const newEmployee = await employeesApi.create(employeeData);
//       setEmployees(prev => [...prev, newEmployee]);
//     } catch (error) {
//       console.error('Error adding employee:', error);
//       alert('Error adding employee');
//     }
//   };

//   const updateEmployee = async (id: string, employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
//     try {
//       const updatedEmployee = await employeesApi.update(id, employeeData);
//       setEmployees(prev => prev.map(employee => 
//         employee.id === id ? updatedEmployee : employee
//       ));
//     } catch (error) {
//       console.error('Error updating employee:', error);
//       alert('Error updating employee');
//     }
//   };

//   const deleteEmployee = async (id: string) => {
//     try {
//       await employeesApi.delete(id);
//       setEmployees(prev => prev.filter(employee => employee.id !== id));
//     } catch (error) {
//       console.error('Error deleting employee:', error);
//       alert('Error deleting employee');
//     }
//   };

//   // Account management functions
//   const addAccount = async (accountData: Omit<Account, 'id' | 'createdAt'>) => {
//     try {
//       const newAccount = await accountsApi.create(accountData);
//       setAccounts(prev => [...prev, newAccount]);
      
//       // Create initial deposit transaction if balance > 0
//       if (accountData.balance > 0) {
//         const transactionData = {
//           accountId: newAccount.id,
//           type: 'deposit' as const,
//           amount: accountData.balance,
//           balance: accountData.balance,
//           description: 'Initial Deposit',
//           referenceNumber: `TXN${Date.now()}`
//         };
//         const newTransaction = await transactionsApi.create(transactionData);
//         setTransactions(prev => [...prev, newTransaction]);
//       }
//     } catch (error) {
//       console.error('Error adding account:', error);
//       alert('Error adding account');
//     }
//   };

//   // Transaction functions
//   const handleDeposit = async (accountId: string, amount: number, description: string) => {
//     try {
//       const account = accounts.find(acc => acc.id === accountId);
//       if (!account) return;

//       const newBalance = account.balance + amount;
      
//       // Update account balance
//       await accountsApi.update(accountId, { ...account, balance: newBalance });
//       setAccounts(prev => prev.map(acc => 
//         acc.id === accountId ? { ...acc, balance: newBalance } : acc
//       ));

//       // Create transaction record
//       const transactionData = {
//         accountId,
//         type: 'deposit' as const,
//         amount,
//         balance: newBalance,
//         description,
//         referenceNumber: `TXN${Date.now()}`
//       };
//       const newTransaction = await transactionsApi.create(transactionData);
//       setTransactions(prev => [...prev, newTransaction]);

//       alert('Deposit successful!');
//     } catch (error) {
//       console.error('Error processing deposit:', error);
//       alert('Error processing deposit');
//     }
//   };

//   const handleWithdraw = async (accountId: string, amount: number, description: string) => {
//     try {
//       const account = accounts.find(acc => acc.id === accountId);
//       if (!account || account.balance < amount) return;

//       const newBalance = account.balance - amount;
      
//       // Update account balance
//       await accountsApi.update(accountId, { ...account, balance: newBalance });
//       setAccounts(prev => prev.map(acc => 
//         acc.id === accountId ? { ...acc, balance: newBalance } : acc
//       ));

//       // Create transaction record
//       const transactionData = {
//         accountId,
//         type: 'withdraw' as const,
//         amount,
//         balance: newBalance,
//         description,
//         referenceNumber: `TXN${Date.now()}`
//       };
//       const newTransaction = await transactionsApi.create(transactionData);
//       setTransactions(prev => [...prev, newTransaction]);

//       alert('Withdrawal successful!');
//     } catch (error) {
//       console.error('Error processing withdrawal:', error);
//       alert('Error processing withdrawal');
//     }
//   };

//   const handleTransfer = async (fromAccountId: string, toAccountId: string, amount: number, description: string) => {
//     try {
//       const fromAccount = accounts.find(acc => acc.id === fromAccountId);
//       const toAccount = accounts.find(acc => acc.id === toAccountId);
      
//       if (!fromAccount || !toAccount || fromAccount.balance < amount) return;

//       const fromNewBalance = fromAccount.balance - amount;
//       const toNewBalance = toAccount.balance + amount;
//       const refNumber = `TXN${Date.now()}`;
      
//       // Update both account balances
//       await accountsApi.update(fromAccountId, { ...fromAccount, balance: fromNewBalance });
//       await accountsApi.update(toAccountId, { ...toAccount, balance: toNewBalance });
      
//       setAccounts(prev => prev.map(acc => {
//         if (acc.id === fromAccountId) return { ...acc, balance: fromNewBalance };
//         if (acc.id === toAccountId) return { ...acc, balance: toNewBalance };
//         return acc;
//       }));

//       // Create transaction records for both accounts
//       const fromTransactionData = {
//         accountId: fromAccountId,
//         type: 'transfer_out' as const,
//         amount,
//         balance: fromNewBalance,
//         description,
//         referenceNumber: refNumber,
//         toAccountId
//       };
      
//       const toTransactionData = {
//         accountId: toAccountId,
//         type: 'transfer_in' as const,
//         amount,
//         balance: toNewBalance,
//         description,
//         referenceNumber: refNumber
//       };

//       const [fromTransaction, toTransaction] = await Promise.all([
//         transactionsApi.create(fromTransactionData),
//         transactionsApi.create(toTransactionData)
//       ]);

//       setTransactions(prev => [...prev, fromTransaction, toTransaction]);

//       alert('Transfer successful!');
//     } catch (error) {
//       console.error('Error processing transfer:', error);
//       alert('Error processing transfer');
//     }
//   };

//   // Show home page
//   if (userMode === 'home') {
//     return (
//       <HomePage 
//         onAdminLogin={handleAdminLogin}
//         onCustomerLogin={handleCustomerLogin}
//       />
//     );
//   }

//   // Show customer portal
//   if (userMode === 'customer' && currentCustomer) {
//     return (
//       <CustomerPortal
//         customer={currentCustomer}
//         accounts={accounts}
//         transactions={transactions}
//         onLogout={handleLogout}
//         onDeposit={handleDeposit}
//         onWithdraw={handleWithdraw}
//         onTransfer={handleTransfer}
//         onCheckWithdrawEligibility={checkWithdrawEligibility}
//       />
//     );
//   }

//   // Admin interface
//   const tabs = [
//     { id: 'banks' as ActiveTab, label: 'Manage Banks', icon: Building2, color: 'blue' },
//     { id: 'branches' as ActiveTab, label: 'Manage Branches', icon: MapPin, color: 'green', disabled: banks.length === 0 },
//     { id: 'customers' as ActiveTab, label: 'Customers', icon: Users, color: 'purple' },
//     { id: 'kyc' as ActiveTab, label: 'Manage KYC', icon: FileCheck, color: 'orange' },
//     { id: 'employees' as ActiveTab, label: 'Manage Employees', icon: UserTie, color: 'indigo' },
//     { id: 'operations' as ActiveTab, label: 'Customer Operations', icon: CreditCard, color: 'teal' },
//     { id: 'loans' as ActiveTab, label: 'Loan Management', icon: Banknote, color: 'rose' },
//     { id: 'banking-ops' as ActiveTab, label: 'Banking Operations', icon: Shield, color: 'violet' },
//     { id: 'reports' as ActiveTab, label: 'Reports', icon: FileText, color: 'emerald' }
//   ];

//   const getTabColorClasses = (color: string, isActive: boolean, isDisabled: boolean) => {
//     if (isDisabled) {
//       return 'bg-gray-100 text-gray-400 cursor-not-allowed';
//     }
    
//     const colorMap = {
//       blue: isActive ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50',
//       green: isActive ? 'bg-green-600 text-white' : 'bg-white text-green-600 hover:bg-green-50',
//       purple: isActive ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 hover:bg-purple-50',
//       orange: isActive ? 'bg-orange-600 text-white' : 'bg-white text-orange-600 hover:bg-orange-50',
//       indigo: isActive ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 hover:bg-indigo-50',
//       teal: isActive ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 hover:bg-teal-50',
//       rose: isActive ? 'bg-rose-600 text-white' : 'bg-white text-rose-600 hover:bg-rose-50',
//       violet: isActive ? 'bg-violet-600 text-white' : 'bg-white text-violet-600 hover:bg-violet-50',
//       emerald: isActive ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 hover:bg-emerald-50'
//     };
    
//     return colorMap[color as keyof typeof colorMap] || colorMap.blue;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading data from MongoDB...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div className="text-center flex-1">
//             <h1 className="text-4xl font-bold text-gray-800 mb-2">Bank Management System - Admin Panel</h1>
//             <p className="text-gray-600">Comprehensive banking operations management platform with MongoDB</p>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//           >
//             <Shield className="h-4 w-4" />
//             Logout
//           </button>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="flex flex-wrap justify-center gap-4 mb-8">
//           {tabs.map((tab) => {
//             const Icon = tab.icon;
//             const isActive = activeTab === tab.id;
//             const isDisabled = tab.disabled;
            
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => !isDisabled && setActiveTab(tab.id)}
//                 disabled={isDisabled}
//                 className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm ${getTabColorClasses(tab.color, isActive, isDisabled)}`}
//                 title={isDisabled ? 'Create a bank first to enable this feature' : ''}
//               >
//                 <Icon className="h-5 w-5" />
//                 {tab.label}
//                 {isDisabled && (
//                   <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1 rounded">
//                     Disabled
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </div>

//         {/* Content Area */}
//         <div className="max-w-7xl mx-auto">
//           {activeTab === 'banks' && (
//             <ManageBank
//               banks={banks}
//               onAddBank={addBank}
//               onUpdateBank={updateBank}
//               onDeleteBank={deleteBank}
//             />
//           )}
          
//           {activeTab === 'branches' && (
//             <ManageBranch
//               banks={banks}
//               branches={branches}
//               onAddBranch={addBranch}
//               onUpdateBranch={updateBranch}
//               onDeleteBranch={deleteBranch}
//             />
//           )}

//           {activeTab === 'customers' && (
//             <ManageCustomer
//               customers={customers}
//               onAddCustomer={addCustomer}
//               onUpdateCustomer={updateCustomer}
//               onDeleteCustomer={deleteCustomer}
//             />
//           )}

//           {activeTab === 'kyc' && (
//             <ManageKYC
//               banks={banks}
//               customers={customers}
//               kycRecords={kycRecords}
//               onAddKYC={addKYC}
//               onUpdateKYC={updateKYC}
//               onDeleteKYC={deleteKYC}
//             />
//           )}

//           {activeTab === 'employees' && (
//             <ManageEmployee
//               banks={banks}
//               branches={branches}
//               employees={employees}
//               onAddEmployee={addEmployee}
//               onUpdateEmployee={updateEmployee}
//               onDeleteEmployee={deleteEmployee}
//             />
//           )}

//           {activeTab === 'operations' && (
//             <Operations
//               banks={banks}
//               branches={branches}
//               customers={customers}
//               accounts={accounts}
//               transactions={transactions}
//               onAddAccount={addAccount}
//               onDeposit={handleDeposit}
//               onWithdraw={handleWithdraw}
//               onTransfer={handleTransfer}
//             />
//           )}

//           {activeTab === 'loans' && (
//             <LoanManagement
//               banks={banks}
//               branches={branches}
//               customers={customers}
//               accounts={accounts}
//             />
//           )}

//           {activeTab === 'banking-ops' && (
//             <BankingOperations
//               banks={banks}
//               branches={branches}
//               customers={customers}
//               accounts={accounts}
//               transactions={transactions}
//             />
//           )}

//           {activeTab === 'reports' && (
//             <Reports
//               banks={banks}
//               branches={branches}
//               customers={customers}
//               accounts={accounts}
//               transactions={transactions}
//               onGenerateReport={generateReport}
//             />
//           )}
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-12 pt-8 border-t border-gray-200">
//           <p className="text-gray-500">Bank Management System - Enterprise Banking Operations Platform</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
//=====================================================================================================
// import React, { useState, useEffect } from 'react';
// import { Building2, MapPin, Users, FileCheck, User as UserTie, CreditCard, Shield, Banknote, FileText } from 'lucide-react';
// import { Bank, Branch, Customer, KYC, Employee, Account, Transaction } from './types';
// import HomePage from './components/HomePage';
// import CustomerPortal from './components/CustomerPortal';
// import ManageBank from './components/ManageBank';
// import ManageBranch from './components/ManageBranch';
// import ManageCustomer from './components/ManageCustomer';
// import ManageKYC from './components/ManageKYC';
// import ManageEmployee from './components/ManageEmployee';
// import Operations from './components/Operations';
// import BankingOperations from './components/BankingOperations';
// import LoanManagement from './components/LoanManagement';
// import Reports from './components/ReportRequest';
// import { banksApi, branchesApi, customersApi, kycApi, employeesApi, accountsApi, transactionsApi } from './services/api';

// type ActiveTab = 'banks' | 'branches' | 'customers' | 'kyc' | 'employees' | 'operations' | 'loans' | 'banking-ops' | 'reports';
// type UserMode = 'home' | 'admin' | 'customer';

// function App() {
//   const [userMode, setUserMode] = useState<UserMode>('home');
//   const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
//   const [activeTab, setActiveTab] = useState<ActiveTab>('banks');
//   const [loading, setLoading] = useState(false);
  
//   // State management for all entities
//   const [banks, setBanks] = useState<Bank[]>([]);
//   const [branches, setBranches] = useState<Branch[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [kycRecords, setKycRecords] = useState<KYC[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [accounts, setAccounts] = useState<Account[]>([]);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);

//   // Load data on component mount
//   useEffect(() => {
//     if (userMode !== 'home') {
//       loadAllData();
//     }
//   }, [userMode]);

//   const loadAllData = async () => {
//     setLoading(true);
//     try {
//       const [banksData, branchesData, customersData, kycData, employeesData, accountsData, transactionsData] = await Promise.all([
//         banksApi.getAll(),
//         branchesApi.getAll(),
//         customersApi.getAll(),
//         kycApi.getAll(),
//         employeesApi.getAll(),
//         accountsApi.getAll(),
//         transactionsApi.getAll(),
//       ]);

//       setBanks(banksData);
//       setBranches(branchesData);
//       setCustomers(customersData);
//       setKycRecords(kycData);
//       setEmployees(employeesData);
//       setAccounts(accountsData);
//       setTransactions(transactionsData);
//     } catch (error) {
//       console.error('Error loading data:', error);
//       alert('Error loading data from database. Please check if MongoDB is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Authentication handlers
//   const handleAdminLogin = (username: string, password: string) => {
//     // Simple admin authentication (in production, use proper authentication)
//     if (username === 'admin' && password === 'admin123') {
//       setUserMode('admin');
//       setActiveTab('banks');
//     } else {
//       alert('Invalid admin credentials');
//     }
//   };

//   const handleCustomerLogin = (panNumber: string, password: string) => {
//     // Find customer by PAN number and check password
//     const customer = customers.find(c => c.panNumber === panNumber);
//     if (customer && password === '12345678') {
//       setCurrentCustomer(customer);
//       setUserMode('customer');
//     } else {
//       alert('Invalid customer credentials. Please check your PAN number and password.');
//     }
//   };

//   const handleLogout = () => {
//     setUserMode('home');
//     setCurrentCustomer(null);
//     setActiveTab('banks');
//   };

//   // Check withdrawal eligibility API
//   const checkWithdrawEligibility = async (customerId: string, amount: number): Promise<{ eligible: boolean; message: string }> => {
//     try {
//       const response = await fetch('http://localhost:5000/api/check-withdraw-eligibility', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ customerId, amount }),
//       });
      
//       const result = await response.json();
//       return result;
//     } catch (error) {
//       console.error('Error checking withdrawal eligibility:', error);
//       return { eligible: false, message: 'Error checking eligibility' };
//     }
//   };

//   // Generate report API
//   const generateReport = async (reportType: string, period: string, filters: any) => {
//     try {
//       const response = await fetch('http://localhost:5000/api/generate-report', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ reportType, period, filters }),
//       });
      
//       if (response.ok) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.style.display = 'none';
//         a.href = url;
//         a.download = `${reportType}_${period}_report.csv`;
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         alert('Report downloaded successfully!');
//       } else {
//         alert('Error generating report');
//       }
//     } catch (error) {
//       console.error('Error generating report:', error);
//       alert('Error generating report');
//     }
//   };

//   // Bank management functions
//   const addBank = async (bankData: Omit<Bank, 'id' | 'createdAt'>) => {
//     try {
//       const newBank = await banksApi.create(bankData);
//       setBanks(prev => [...prev, newBank]);
//     } catch (error) {
//       console.error('Error adding bank:', error);
//       alert('Error adding bank');
//     }
//   };

//   const updateBank = async (id: string, bankData: Omit<Bank, 'id' | 'createdAt'>) => {
//     try {
//       const updatedBank = await banksApi.update(id, bankData);
//       setBanks(prev => prev.map(bank => 
//         bank.id === id ? updatedBank : bank
//       ));
//     } catch (error) {
//       console.error('Error updating bank:', error);
//       alert('Error updating bank');
//     }
//   };

//   const deleteBank = async (id: string) => {
//     try {
//       await banksApi.delete(id);
//       setBanks(prev => prev.filter(bank => bank.id !== id));
//       // Also remove related branches and employees from state
//       setBranches(prev => prev.filter(branch => branch.bankId !== id));
//       setEmployees(prev => prev.filter(employee => employee.bankId !== id));
//     } catch (error) {
//       console.error('Error deleting bank:', error);
//       alert('Error deleting bank');
//     }
//   };

//   // Branch management functions
//   const addBranch = async (branchData: Omit<Branch, 'id' | 'createdAt'>) => {
//     try {
//       const newBranch = await branchesApi.create(branchData);
//       setBranches(prev => [...prev, newBranch]);
//     } catch (error) {
//       console.error('Error adding branch:', error);
//       alert('Error adding branch');
//     }
//   };

//   const updateBranch = async (id: string, branchData: Omit<Branch, 'id' | 'createdAt'>) => {
//     try {
//       const updatedBranch = await branchesApi.update(id, branchData);
//       setBranches(prev => prev.map(branch => 
//         branch.id === id ? updatedBranch : branch
//       ));
//     } catch (error) {
//       console.error('Error updating branch:', error);
//       alert('Error updating branch');
//     }
//   };

//   const deleteBranch = async (id: string) => {
//     try {
//       await branchesApi.delete(id);
//       setBranches(prev => prev.filter(branch => branch.id !== id));
//       // Also remove related employees from state
//       setEmployees(prev => prev.filter(employee => employee.branchId !== id));
//     } catch (error) {
//       console.error('Error deleting branch:', error);
//       alert('Error deleting branch');
//     }
//   };

//   // Customer management functions
//   const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
//     try {
//       const newCustomer = await customersApi.create(customerData);
//       setCustomers(prev => [...prev, newCustomer]);
//     } catch (error) {
//       console.error('Error adding customer:', error);
//       alert('Error adding customer');
//     }
//   };

//   const updateCustomer = async (id: string, customerData: Omit<Customer, 'id' | 'createdAt'>) => {
//     try {
//       const updatedCustomer = await customersApi.update(id, customerData);
//       setCustomers(prev => prev.map(customer => 
//         customer.id === id ? updatedCustomer : customer
//       ));
//     } catch (error) {
//       console.error('Error updating customer:', error);
//       alert('Error updating customer');
//     }
//   };

//   const deleteCustomer = async (id: string) => {
//     try {
//       await customersApi.delete(id);
//       setCustomers(prev => prev.filter(customer => customer.id !== id));
//       // Also remove related KYC records from state
//       setKycRecords(prev => prev.filter(kyc => kyc.customerId !== id));
//     } catch (error) {
//       console.error('Error deleting customer:', error);
//       alert('Error deleting customer');
//     }
//   };

//   // KYC management functions
//   const addKYC = async (kycData: Omit<KYC, 'id' | 'createdAt'>) => {
//     try {
//       const newKYC = await kycApi.create(kycData);
//       setKycRecords(prev => [...prev, newKYC]);
//     } catch (error) {
//       console.error('Error adding KYC:', error);
//       alert('Error adding KYC record');
//     }
//   };

//   const updateKYC = async (id: string, kycData: Omit<KYC, 'id' | 'createdAt'>) => {
//     try {
//       const updatedKYC = await kycApi.update(id, kycData);
//       setKycRecords(prev => prev.map(kyc => 
//         kyc.id === id ? updatedKYC : kyc
//       ));
//     } catch (error) {
//       console.error('Error updating KYC:', error);
//       alert('Error updating KYC record');
//     }
//   };

//   const deleteKYC = async (id: string) => {
//     try {
//       await kycApi.delete(id);
//       setKycRecords(prev => prev.filter(kyc => kyc.id !== id));
//     } catch (error) {
//       console.error('Error deleting KYC:', error);
//       alert('Error deleting KYC record');
//     }
//   };

//   // Employee management functions
//   const addEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
//     try {
//       const newEmployee = await employeesApi.create(employeeData);
//       setEmployees(prev => [...prev, newEmployee]);
//     } catch (error) {
//       console.error('Error adding employee:', error);
//       alert('Error adding employee');
//     }
//   };

//   const updateEmployee = async (id: string, employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
//     try {
//       const updatedEmployee = await employeesApi.update(id, employeeData);
//       setEmployees(prev => prev.map(employee => 
//         employee.id === id ? updatedEmployee : employee
//       ));
//     } catch (error) {
//       console.error('Error updating employee:', error);
//       alert('Error updating employee');
//     }
//   };

//   const deleteEmployee = async (id: string) => {
//     try {
//       await employeesApi.delete(id);
//       setEmployees(prev => prev.filter(employee => employee.id !== id));
//     } catch (error) {
//       console.error('Error deleting employee:', error);
//       alert('Error deleting employee');
//     }
//   };

//   // Account management functions
//   const addAccount = async (accountData: Omit<Account, 'id' | 'createdAt'>) => {
//     try {
//       const newAccount = await accountsApi.create(accountData);
//       setAccounts(prev => [...prev, newAccount]);
      
//       // Create initial deposit transaction if balance > 0
//       if (accountData.balance > 0) {
//         const transactionData = {
//           accountId: newAccount.id,
//           type: 'deposit' as const,
//           amount: accountData.balance,
//           balance: accountData.balance,
//           description: 'Initial Deposit',
//           referenceNumber: `TXN${Date.now()}`
//         };
//         const newTransaction = await transactionsApi.create(transactionData);
//         setTransactions(prev => [...prev, newTransaction]);
//       }
//     } catch (error) {
//       console.error('Error adding account:', error);
//       alert('Error adding account');
//     }
//   };

//   // Transaction functions
//   const handleDeposit = async (accountId: string, amount: number, description: string) => {
//     try {
//       const account = accounts.find(acc => acc.id === accountId);
//       if (!account) return;

//       const newBalance = account.balance + amount;
      
//       // Update account balance
//       await accountsApi.update(accountId, { ...account, balance: newBalance });
//       setAccounts(prev => prev.map(acc => 
//         acc.id === accountId ? { ...acc, balance: newBalance } : acc
//       ));

//       // Create transaction record
//       const transactionData = {
//         accountId,
//         type: 'deposit' as const,
//         amount,
//         balance: newBalance,
//         description,
//         referenceNumber: `TXN${Date.now()}`
//       };
//       const newTransaction = await transactionsApi.create(transactionData);
//       setTransactions(prev => [...prev, newTransaction]);

//       alert('Deposit successful!');
//     } catch (error) {
//       console.error('Error processing deposit:', error);
//       alert('Error processing deposit');
//     }
//   };

//   const handleWithdraw = async (accountId: string, amount: number, description: string) => {
//     try {
//       const account = accounts.find(acc => acc.id === accountId);
//       if (!account || account.balance < amount) return;

//       const newBalance = account.balance - amount;
      
//       // Update account balance
//       await accountsApi.update(accountId, { ...account, balance: newBalance });
//       setAccounts(prev => prev.map(acc => 
//         acc.id === accountId ? { ...acc, balance: newBalance } : acc
//       ));

//       // Create transaction record
//       const transactionData = {
//         accountId,
//         type: 'withdraw' as const,
//         amount,
//         balance: newBalance,
//         description,
//         referenceNumber: `TXN${Date.now()}`
//       };
//       const newTransaction = await transactionsApi.create(transactionData);
//       setTransactions(prev => [...prev, newTransaction]);

//       alert('Withdrawal successful!');
//     } catch (error) {
//       console.error('Error processing withdrawal:', error);
//       alert('Error processing withdrawal');
//     }
//   };

//   const handleTransfer = async (fromAccountId: string, toAccountId: string, amount: number, description: string) => {
//     try {
//       const fromAccount = accounts.find(acc => acc.id === fromAccountId);
//       const toAccount = accounts.find(acc => acc.id === toAccountId);
      
//       if (!fromAccount || !toAccount || fromAccount.balance < amount) return;

//       const fromNewBalance = fromAccount.balance - amount;
//       const toNewBalance = toAccount.balance + amount;
//       const refNumber = `TXN${Date.now()}`;
      
//       // Update both account balances
//       await accountsApi.update(fromAccountId, { ...fromAccount, balance: fromNewBalance });
//       await accountsApi.update(toAccountId, { ...toAccount, balance: toNewBalance });
      
//       setAccounts(prev => prev.map(acc => {
//         if (acc.id === fromAccountId) return { ...acc, balance: fromNewBalance };
//         if (acc.id === toAccountId) return { ...acc, balance: toNewBalance };
//         return acc;
//       }));

//       // Create transaction records for both accounts
//       const fromTransactionData = {
//         accountId: fromAccountId,
//         type: 'transfer_out' as const,
//         amount,
//         balance: fromNewBalance,
//         description,
//         referenceNumber: refNumber,
//         toAccountId
//       };
      
//       const toTransactionData = {
//         accountId: toAccountId,
//         type: 'transfer_in' as const,
//         amount,
//         balance: toNewBalance,
//         description,
//         referenceNumber: refNumber
//       };

//       const [fromTransaction, toTransaction] = await Promise.all([
//         transactionsApi.create(fromTransactionData),
//         transactionsApi.create(toTransactionData)
//       ]);

//       setTransactions(prev => [...prev, fromTransaction, toTransaction]);

//       alert('Transfer successful!');
//     } catch (error) {
//       console.error('Error processing transfer:', error);
//       alert('Error processing transfer');
//     }
//   };

//   // Show home page
//   if (userMode === 'home') {
//     return (
//       <HomePage 
//         onAdminLogin={handleAdminLogin}
//         onCustomerLogin={handleCustomerLogin}
//       />
//     );
//   }

//   // Show customer portal
//   if (userMode === 'customer' && currentCustomer) {
//     return (
//       <CustomerPortal
//         customer={currentCustomer}
//         accounts={accounts}
//         transactions={transactions}
//         banks={banks}
//         branches={branches}
//         kycRecords={kycRecords}
//         onLogout={handleLogout}
//         onDeposit={handleDeposit}
//         onWithdraw={handleWithdraw}
//         onTransfer={handleTransfer}
//         onCheckWithdrawEligibility={checkWithdrawEligibility}
//       />
//     );
//   }

//   // Admin interface
//   const tabs = [
//     { id: 'banks' as ActiveTab, label: 'Manage Banks', icon: Building2, color: 'blue' },
//     { id: 'branches' as ActiveTab, label: 'Manage Branches', icon: MapPin, color: 'green', disabled: banks.length === 0 },
//     { id: 'customers' as ActiveTab, label: 'Customers', icon: Users, color: 'purple' },
//     { id: 'kyc' as ActiveTab, label: 'Manage KYC', icon: FileCheck, color: 'orange' },
//     { id: 'employees' as ActiveTab, label: 'Manage Employees', icon: UserTie, color: 'indigo' },
//     { id: 'operations' as ActiveTab, label: 'Customer Operations', icon: CreditCard, color: 'teal' },
//     { id: 'loans' as ActiveTab, label: 'Loan Management', icon: Banknote, color: 'rose' },
//     { id: 'banking-ops' as ActiveTab, label: 'Banking Operations', icon: Shield, color: 'violet' },
//     { id: 'reports' as ActiveTab, label: 'Reports', icon: FileText, color: 'emerald' }
//   ];

//   const getTabColorClasses = (color: string, isActive: boolean, isDisabled: boolean) => {
//     if (isDisabled) {
//       return 'bg-gray-100 text-gray-400 cursor-not-allowed';
//     }
    
//     const colorMap = {
//       blue: isActive ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50',
//       green: isActive ? 'bg-green-600 text-white' : 'bg-white text-green-600 hover:bg-green-50',
//       purple: isActive ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 hover:bg-purple-50',
//       orange: isActive ? 'bg-orange-600 text-white' : 'bg-white text-orange-600 hover:bg-orange-50',
//       indigo: isActive ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 hover:bg-indigo-50',
//       teal: isActive ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 hover:bg-teal-50',
//       rose: isActive ? 'bg-rose-600 text-white' : 'bg-white text-rose-600 hover:bg-rose-50',
//       violet: isActive ? 'bg-violet-600 text-white' : 'bg-white text-violet-600 hover:bg-violet-50',
//       emerald: isActive ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 hover:bg-emerald-50'
//     };
    
//     return colorMap[color as keyof typeof colorMap] || colorMap.blue;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading data from MongoDB...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div className="text-center flex-1">
//             <h1 className="text-4xl font-bold text-gray-800 mb-2">Bank Management System - Admin Panel</h1>
//             <p className="text-gray-600">Comprehensive banking operations management platform with MongoDB</p>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//           >
//             <Shield className="h-4 w-4" />
//             Logout
//           </button>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="flex flex-wrap justify-center gap-4 mb-8">
//           {tabs.map((tab) => {
//             const Icon = tab.icon;
//             const isActive = activeTab === tab.id;
//             const isDisabled = tab.disabled;
            
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => !isDisabled && setActiveTab(tab.id)}
//                 disabled={isDisabled}
//                 className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm ${getTabColorClasses(tab.color, isActive, isDisabled)}`}
//                 title={isDisabled ? 'Create a bank first to enable this feature' : ''}
//               >
//                 <Icon className="h-5 w-5" />
//                 {tab.label}
//                 {isDisabled && (
//                   <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1 rounded">
//                     Disabled
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </div>

//         {/* Content Area */}
//         <div className="max-w-7xl mx-auto">
//           {activeTab === 'banks' && (
//             <ManageBank
//               banks={banks}
//               onAddBank={addBank}
//               onUpdateBank={updateBank}
//               onDeleteBank={deleteBank}
//             />
//           )}
          
//           {activeTab === 'branches' && (
//             <ManageBranch
//               banks={banks}
//               branches={branches}
//               onAddBranch={addBranch}
//               onUpdateBranch={updateBranch}
//               onDeleteBranch={deleteBranch}
//             />
//           )}

//           {activeTab === 'customers' && (
//             <ManageCustomer
//               customers={customers}
//               onAddCustomer={addCustomer}
//               onUpdateCustomer={updateCustomer}
//               onDeleteCustomer={deleteCustomer}
//             />
//           )}

//           {activeTab === 'kyc' && (
//             <ManageKYC
//               banks={banks}
//               customers={customers}
//               kycRecords={kycRecords}
//               onAddKYC={addKYC}
//               onUpdateKYC={updateKYC}
//               onDeleteKYC={deleteKYC}
//             />
//           )}

//           {activeTab === 'employees' && (
//             <ManageEmployee
//               banks={banks}
//               branches={branches}
//               employees={employees}
//               onAddEmployee={addEmployee}
//               onUpdateEmployee={updateEmployee}
//               onDeleteEmployee={deleteEmployee}
//             />
//           )}

//           {activeTab === 'operations' && (
//             <Operations
//               banks={banks}
//               branches={branches}
//               customers={customers}
//               accounts={accounts}
//               transactions={transactions}
//               onAddAccount={addAccount}
//               onDeposit={handleDeposit}
//               onWithdraw={handleWithdraw}
//               onTransfer={handleTransfer}
//             />
//           )}

//           {activeTab === 'loans' && (
//             <LoanManagement
//               banks={banks}
//               branches={branches}
//               customers={customers}
//               accounts={accounts}
//             />
//           )}

//           {activeTab === 'banking-ops' && (
//             <BankingOperations
//               banks={banks}
//               branches={branches}
//               customers={customers}
//               accounts={accounts}
//               transactions={transactions}
//             />
//           )}

//           {activeTab === 'reports' && (
//             <Reports
//               banks={banks}
//               branches={branches}
//               customers={customers}
//               accounts={accounts}
//               transactions={transactions}
//               onGenerateReport={generateReport}
//             />
//           )}
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-12 pt-8 border-t border-gray-200">
//           <p className="text-gray-500">Bank Management System - Enterprise Banking Operations Platform</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
// import React, { useState, useEffect } from 'react';
// import { Building2, MapPin, Users, FileCheck, User as UserTie, CreditCard, Shield, Banknote, FileText } from 'lucide-react';
// import { Bank, Branch, Customer, KYC, Employee, Account, Transaction } from './types';
// import HomePage from './components/HomePage';
// import CustomerPortal from './components/CustomerPortal';
// import ManageBank from './components/ManageBank';
// import ManageBranch from './components/ManageBranch';
// import ManageCustomer from './components/ManageCustomer';
// import ManageKYC from './components/ManageKYC';
// import ManageEmployee from './components/ManageEmployee';
// import Operations from './components/Operations';
// import BankingOperations from './components/BankingOperations';
// import LoanManagement from './components/LoanManagement';
// import ReportRequest from './components/ReportRequest';
// import { banksApi, branchesApi, customersApi, kycApi, employeesApi, accountsApi, transactionsApi } from './services/api';

// type ActiveTab = 'banks' | 'branches' | 'customers' | 'kyc' | 'employees' | 'operations' | 'loans' | 'banking-ops' | 'reports';
// type UserMode = 'home' | 'admin' | 'customer';

// function App() {
//   const [userMode, setUserMode] = useState<UserMode>('home');
//   const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
//   const [activeTab, setActiveTab] = useState<ActiveTab>('banks');
//   const [loading, setLoading] = useState(false);
  
//   // State management for all entities
//   const [banks, setBanks] = useState<Bank[]>([]);
//   const [branches, setBranches] = useState<Branch[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [kycRecords, setKycRecords] = useState<KYC[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [accounts, setAccounts] = useState<Account[]>([]);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);

//   // Load data on component mount
//   useEffect(() => {
//     if (userMode !== 'home') {
//       loadAllData();
//     }
//   }, [userMode]);

//   const loadAllData = async () => {
//     setLoading(true);
//     try {
//       const [banksData, branchesData, customersData, kycData, employeesData, accountsData, transactionsData] = await Promise.all([
//         banksApi.getAll(),
//         branchesApi.getAll(),
//         customersApi.getAll(),
//         kycApi.getAll(),
//         employeesApi.getAll(),
//         accountsApi.getAll(),
//         transactionsApi.getAll(),
//       ]);

//       setBanks(banksData);
//       setBranches(branchesData);
//       setCustomers(customersData);
//       setKycRecords(kycData);
//       setEmployees(employeesData);
//       setAccounts(accountsData);
//       setTransactions(transactionsData);
//     } catch (error) {
//       console.error('Error loading data:', error);
//       alert('Error loading data from database. Please check if MongoDB is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Authentication handlers
//   const handleAdminLogin = (username: string, password: string) => {
//     // Simple admin authentication (in production, use proper authentication)
//     if (username === 'admin' && password === 'admin123') {
//       setUserMode('admin');
//       setActiveTab('banks');
//     } else {
//       alert('Invalid admin credentials');
//     }
//   };

//   const handleCustomerLogin = (panNumber: string, password: string) => {
//     // Find customer by PAN number and check password
//     const customer = customers.find(c => c.panNumber === panNumber);
//     if (customer && password === '12345678') {
//       setCurrentCustomer(customer);
//       setUserMode('customer');
//     } else {
//       alert('Invalid customer credentials. Please check your PAN number and password.');
//     }
//   };

//   const handleLogout = () => {
//     setUserMode('home');
//     setCurrentCustomer(null);
//     setActiveTab('banks');
//   };

//   // Check withdrawal eligibility API
//   const checkWithdrawEligibility = async (customerId: string, amount: number): Promise<{ eligible: boolean; message: string }> => {
//     try {
//       const response = await fetch('http://localhost:5000/api/check-withdraw-eligibility', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ customerId, amount }),
//       });
      
//       const result = await response.json();
//       return result;
//     } catch (error) {
//       console.error('Error checking withdrawal eligibility:', error);
//       return { eligible: false, message: 'Error checking eligibility' };
//     }
//   };

//   // Send report request to external system
//   const sendReportRequest = async (reportType: string, period: string, filters: any) => {
//     try {
//       const reportRequest = {
//         reportType,
//         period,
//         filters,
//         requestedBy: 'admin',
//         requestId: `REQ_${Date.now()}`,
//         timestamp: new Date().toISOString(),
//         bankingSystemUrl: 'http://localhost:5000/api'
//       };

//       const REPORT_GENERATION_API_URL = import.meta.env.VITE_REPORT_GENERATION_API_URL || 'http://localhost:5000/api';

//       // Log payload for debugging
//       console.log('🚀 Sending Report Request Payload:', reportRequest);

//       const response = await fetch(`${REPORT_GENERATION_API_URL}/reports`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${import.meta.env.VITE_REPORT_API_TOKEN || 'demo-token'}`,
//           'X-Banking-System-ID': import.meta.env.VITE_BANKING_SYSTEM_ID || 'banking-system-001'
//         },
//         body: JSON.stringify(reportRequest)
//       });

//       const result = await response.json();
//       console.log('✅ Response from backend:', result);

//       if (response.ok) {
//         alert(`✅ Report request submitted successfully!\n\nRequest ID: ${reportRequest.requestId}\nType: ${reportType}\nPeriod: ${period}\n\nResponse: ${JSON.stringify(result, null, 2)}`);
//       } else {
//         throw new Error(result.message || 'Failed to submit report request');
//       }

//     } catch (error: any) {
//       console.error('❌ Error sending report request:', error);

//       if (error.message.includes('fetch')) {
//         console.log('🔄 External system not available, showing demo response');
//         const demoRequest = {
//           reportType,
//           period,
//           filters,
//           requestedBy: 'admin',
//           requestId: `REQ_${Date.now()}`,
//           timestamp: new Date().toISOString(),
//           bankingSystemUrl: 'http://localhost:5000/api'
//         };

//         console.log('Report Request (Demo Mode):', demoRequest);
//         alert(`📋 Report request prepared for external system!\n\nRequest ID: ${demoRequest.requestId}\nType: ${reportType}\nPeriod: ${period}\n\n⚠️ Demo Mode: External report generation system not configured.\nIn production, this would be sent to: ${REPORT_GENERATION_API_URL}\n\n🔗 Banking System APIs available at: http://localhost:5000/api`);
//       } else {
//         alert(`❌ Error sending report request: ${error.message}`);
//       }
//     }
//   };

//   // Bank management functions
//   const addBank = async (bankData: Omit<Bank, 'id' | 'createdAt'>) => {
//     try {
//       const newBank = await banksApi.create(bankData);
//       setBanks(prev => [...prev, newBank]);
//     } catch (error) {
//       console.error('Error adding bank:', error);
//       alert('Error adding bank');
//     }
//   };

//   const updateBank = async (id: string, bankData: Omit<Bank, 'id' | 'createdAt'>) => {
//     try {
//       const updatedBank = await banksApi.update(id, bankData);
//       setBanks(prev => prev.map(bank => 
//         bank.id === id ? updatedBank : bank
//       ));
//     } catch (error) {
//       console.error('Error updating bank:', error);
//       alert('Error updating bank');
//     }
//   };

//   const deleteBank = async (id: string) => {
//     try {
//       await banksApi.delete(id);
//       setBanks(prev => prev.filter(bank => bank.id !== id));
//       // Also remove related branches and employees from state
//       setBranches(prev => prev.filter(branch => branch.bankId !== id));
//       setEmployees(prev => prev.filter(employee => employee.bankId !== id));
//     } catch (error) {
//       console.error('Error deleting bank:', error);
//       alert('Error deleting bank');
//     }
//   };

//   // Branch management functions
//   const addBranch = async (branchData: Omit<Branch, 'id' | 'createdAt'>) => {
//     try {
//       const newBranch = await branchesApi.create(branchData);
//       setBranches(prev => [...prev, newBranch]);
//     } catch (error) {
//       console.error('Error adding branch:', error);
//       alert('Error adding branch');
//     }
//   };

//   const updateBranch = async (id: string, branchData: Omit<Branch, 'id' | 'createdAt'>) => {
//     try {
//       const updatedBranch = await branchesApi.update(id, branchData);
//       setBranches(prev => prev.map(branch => 
//         branch.id === id ? updatedBranch : branch
//       ));
//     } catch (error) {
//       console.error('Error updating branch:', error);
//       alert('Error updating branch');
//     }
//   };

//   const deleteBranch = async (id: string) => {
//     try {
//       await branchesApi.delete(id);
//       setBranches(prev => prev.filter(branch => branch.id !== id));
//       // Also remove related employees from state
//       setEmployees(prev => prev.filter(employee => employee.branchId !== id));
//     } catch (error) {
//       console.error('Error deleting branch:', error);
//       alert('Error deleting branch');
//     }
//   };

//   // Customer management functions
//   const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
//     try {
//       const newCustomer = await customersApi.create(customerData);
//       setCustomers(prev => [...prev, newCustomer]);
//     } catch (error) {
//       console.error('Error adding customer:', error);
//       alert('Error adding customer');
//     }
//   };

//   const updateCustomer = async (id: string, customerData: Omit<Customer, 'id' | 'createdAt'>) => {
//     try {
//       const updatedCustomer = await customersApi.update(id, customerData);
//       setCustomers(prev => prev.map(customer => 
//         customer.id === id ? updatedCustomer : customer
//       ));
//     } catch (error) {
//       console.error('Error updating customer:', error);
//       alert('Error updating customer');
//     }
//   };

//   const deleteCustomer = async (id: string) => {
//     try {
//       await customersApi.delete(id);
//       setCustomers(prev => prev.filter(customer => customer.id !== id));
//       // Also remove related KYC records from state
//       setKycRecords(prev => prev.filter(kyc => kyc.customerId !== id));
//     } catch (error) {
//       console.error('Error deleting customer:', error);
//       alert('Error deleting customer');
//     }
//   };

//   // KYC management functions
//   const addKYC = async (kycData: Omit<KYC, 'id' | 'createdAt'>) => {
//     try {
//       const newKYC = await kycApi.create(kycData);
//       setKycRecords(prev => [...prev, newKYC]);
//     } catch (error) {
//       console.error('Error adding KYC:', error);
//       alert('Error adding KYC record');
//     }
//   };

//   const updateKYC = async (id: string, kycData: Omit<KYC, 'id' | 'createdAt'>) => {
//     try {
//       const updatedKYC = await kycApi.update(id, kycData);
//       setKycRecords(prev => prev.map(kyc => 
//         kyc.id === id ? updatedKYC : kyc
//       ));
//     } catch (error) {
//       console.error('Error updating KYC:', error);
//       alert('Error updating KYC record');
//     }
//   };

//   const deleteKYC = async (id: string) => {
//     try {
//       await kycApi.delete(id);
//       setKycRecords(prev => prev.filter(kyc => kyc.id !== id));
//     } catch (error) {
//       console.error('Error deleting KYC:', error);
//       alert('Error deleting KYC record');
//     }
//   };

//   // Employee management functions
//   const addEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
//     try {
//       const newEmployee = await employeesApi.create(employeeData);
//       setEmployees(prev => [...prev, newEmployee]);
//     } catch (error) {
//       console.error('Error adding employee:', error);
//       alert('Error adding employee');
//     }
//   };

//   const updateEmployee = async (id: string, employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
//     try {
//       const updatedEmployee = await employeesApi.update(id, employeeData);
//       setEmployees(prev => prev.map(employee => 
//         employee.id === id ? updatedEmployee : employee
//       ));
//     } catch (error) {
//       console.error('Error updating employee:', error);
//       alert('Error updating employee');
//     }
//   };

//   const deleteEmployee = async (id: string) => {
//     try {
//       await employeesApi.delete(id);
//       setEmployees(prev => prev.filter(employee => employee.id !== id));
//     } catch (error) {
//       console.error('Error deleting employee:', error);
//       alert('Error deleting employee');
//     }
//   };

//   // Account management functions
//   const addAccount = async (accountData: Omit<Account, 'id' | 'createdAt'>) => {
//     try {
//       const newAccount = await accountsApi.create(accountData);
//       setAccounts(prev => [...prev, newAccount]);
      
//       // Create initial deposit transaction if balance > 0
//       if (accountData.balance > 0) {
//         const transactionData = {
//           accountId: newAccount.id,
//           type: 'deposit' as const,
//           amount: accountData.balance,
//           balance: accountData.balance,
//           description: 'Initial Deposit',
//           referenceNumber: `TXN${Date.now()}`
//         };
//         const newTransaction = await transactionsApi.create(transactionData);
//         setTransactions(prev => [...prev, newTransaction]);
//       }
//     } catch (error) {
//       console.error('Error adding account:', error);
//       alert('Error adding account');
//     }
//   };

//   // Transaction functions
//   const handleDeposit = async (accountId: string, amount: number, description: string) => {
//     try {
//       const account = accounts.find(acc => acc.id === accountId);
//       if (!account) return;

//       const newBalance = account.balance + amount;
      
//       // Update account balance
//       await accountsApi.update(accountId, { ...account, balance: newBalance });
//       setAccounts(prev => prev.map(acc => 
//         acc.id === accountId ? { ...acc, balance: newBalance } : acc
//       ));

//       // Create transaction record
//       const transactionData = {
//         accountId,
//         type: 'deposit' as const,
//         amount,
//         balance: newBalance,
//         description,
//         referenceNumber: `TXN${Date.now()}`
//       };
//       const newTransaction = await transactionsApi.create(transactionData);
//       setTransactions(prev => [...prev, newTransaction]);

//       alert('Deposit successful!');
//     } catch (error) {
//       console.error('Error processing deposit:', error);
//       alert('Error processing deposit');
//     }
//   };

//   const handleWithdraw = async (accountId: string, amount: number, description: string) => {
//     try {
//       const account = accounts.find(acc => acc.id === accountId);
//       if (!account || account.balance < amount) return;

//       const newBalance = account.balance - amount;
      
//       // Update account balance
//       await accountsApi.update(accountId, { ...account, balance: newBalance });
//       setAccounts(prev => prev.map(acc => 
//         acc.id === accountId ? { ...acc, balance: newBalance } : acc
//       ));

//       // Create transaction record
//       const transactionData = {
//         accountId,
//         type: 'withdraw' as const,
//         amount,
//         balance: newBalance,
//         description,
//         referenceNumber: `TXN${Date.now()}`
//       };
//       const newTransaction = await transactionsApi.create(transactionData);
//       setTransactions(prev => [...prev, newTransaction]);

//       alert('Withdrawal successful!');
//     } catch (error) {
//       console.error('Error processing withdrawal:', error);
//       alert('Error processing withdrawal');
//     }
//   };

//   const handleTransfer = async (fromAccountId: string, toAccountId: string, amount: number, description: string) => {
//     try {
//       const fromAccount = accounts.find(acc => acc.id === fromAccountId);
//       const toAccount = accounts.find(acc => acc.id === toAccountId);
      
//       if (!fromAccount || !toAccount || fromAccount.balance < amount) return;

//       const fromNewBalance = fromAccount.balance - amount;
//       const toNewBalance = toAccount.balance + amount;
//       const refNumber = `TXN${Date.now()}`;
      
//       // Update both account balances
//       await accountsApi.update(fromAccountId, { ...fromAccount, balance: fromNewBalance });
//       await accountsApi.update(toAccountId, { ...toAccount, balance: toNewBalance });
      
//       setAccounts(prev => prev.map(acc => {
//         if (acc.id === fromAccountId) return { ...acc, balance: fromNewBalance };
//         if (acc.id === toAccountId) return { ...acc, balance: toNewBalance };
//         return acc;
//       }));

//       // Create transaction records for both accounts
//       const fromTransactionData = {
//         accountId: fromAccountId,
//         type: 'transfer_out' as const,
//         amount,
//         balance: fromNewBalance,
//         description,
//         referenceNumber: refNumber,
//         toAccountId
//       };
      
//       const toTransactionData = {
//         accountId: toAccountId,
//         type: 'transfer_in' as const,
//         amount,
//         balance: toNewBalance,
//         description,
//         referenceNumber: refNumber
//       };

//       const [fromTransaction, toTransaction] = await Promise.all([
//         transactionsApi.create(fromTransactionData),
//         transactionsApi.create(toTransactionData)
//       ]);

//       setTransactions(prev => [...prev, fromTransaction, toTransaction]);

//       alert('Transfer successful!');
//     } catch (error) {
//       console.error('Error processing transfer:', error);
//       alert('Error processing transfer');
//     }
//   };

//   // Show home page
//   if (userMode === 'home') {
//     return (
//       <HomePage 
//         onAdminLogin={handleAdminLogin}
//         onCustomerLogin={handleCustomerLogin}
//       />
//     );
//   }

//   // Show customer portal
//   if (userMode === 'customer' && currentCustomer) {
//     return (
//       <CustomerPortal
//         customer={currentCustomer}
//         accounts={accounts}
//         transactions={transactions}
//         banks={banks}
//         branches={branches}
//         kycRecords={kycRecords}
//         onLogout={handleLogout}
//         onDeposit={handleDeposit}
//         onWithdraw={handleWithdraw}
//         onTransfer={handleTransfer}
//         onCheckWithdrawEligibility={checkWithdrawEligibility}
//       />
//     );
//   }

//   // Admin interface
//   const tabs = [
//     { id: 'banks' as ActiveTab, label: 'Manage Banks', icon: Building2, color: 'blue' },
//     { id: 'branches' as ActiveTab, label: 'Manage Branches', icon: MapPin, color: 'green', disabled: banks.length === 0 },
//     { id: 'customers' as ActiveTab, label: 'Customers', icon: Users, color: 'purple' },
//     { id: 'kyc' as ActiveTab, label: 'Manage KYC', icon: FileCheck, color: 'orange' },
//     { id: 'employees' as ActiveTab, label: 'Manage Employees', icon: UserTie, color: 'indigo' },
//     { id: 'operations' as ActiveTab, label: 'Customer Operations', icon: CreditCard, color: 'teal' },
//     { id: 'loans' as ActiveTab, label: 'Loan Management', icon: Banknote, color: 'rose' },
//     { id: 'banking-ops' as ActiveTab, label: 'Banking Operations', icon: Shield, color: 'violet' },
//     { id: 'reports' as ActiveTab, label: 'Reports', icon: FileText, color: 'emerald' }
//   ];

//   const getTabColorClasses = (color: string, isActive: boolean, isDisabled: boolean) => {
//     if (isDisabled) {
//       return 'bg-gray-100 text-gray-400 cursor-not-allowed';
//     }
    
//     const colorMap = {
//       blue: isActive ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50',
//       green: isActive ? 'bg-green-600 text-white' : 'bg-white text-green-600 hover:bg-green-50',
//       purple: isActive ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 hover:bg-purple-50',
//       orange: isActive ? 'bg-orange-600 text-white' : 'bg-white text-orange-600 hover:bg-orange-50',
//       indigo: isActive ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 hover:bg-indigo-50',
//       teal: isActive ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 hover:bg-teal-50',
//       rose: isActive ? 'bg-rose-600 text-white' : 'bg-white text-rose-600 hover:bg-rose-50',
//       violet: isActive ? 'bg-violet-600 text-white' : 'bg-white text-violet-600 hover:bg-violet-50',
//       emerald: isActive ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 hover:bg-emerald-50'
//     };
    
//     return colorMap[color as keyof typeof colorMap] || colorMap.blue;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading data from MongoDB...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div className="text-center flex-1">
//             <h1 className="text-4xl font-bold text-gray-800 mb-2">Bank Management System - Admin Panel</h1>
//             <p className="text-gray-600">Comprehensive banking operations management platform with MongoDB</p>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//           >
//             <Shield className="h-4 w-4" />
//             Logout
//           </button>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="flex flex-wrap justify-center gap-4 mb-8">
//           {tabs.map((tab) => {
//             const Icon = tab.icon;
//             const isActive = activeTab === tab.id;
//             const isDisabled = tab.disabled;
            
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => !isDisabled && setActiveTab(tab.id)}
//                 disabled={isDisabled}
//                 className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm ${getTabColorClasses(tab.color, isActive, isDisabled)}`}
//                 title={isDisabled ? 'Create a bank first to enable this feature' : ''}
//               >
//                 <Icon className="h-5 w-5" />
//                 {tab.label}
//                 {isDisabled && (
//                   <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1 rounded">
//                     Disabled
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </div>

//         {/* Content Area */}
//         <div className="max-w-7xl mx-auto">
//           {activeTab === 'banks' && (
//             <ManageBank
//               banks={banks}
//               onAddBank={addBank}
//               onUpdateBank={updateBank}
//               onDeleteBank={deleteBank}
//             />
//           )}
          
//           {activeTab === 'branches' && (
//             <ManageBranch
//               banks={banks}
//               branches={branches}
//               onAddBranch={addBranch}
//               onUpdateBranch={updateBranch}
//               onDeleteBranch={deleteBranch}
//             />
//           )}

//           {activeTab === 'customers' && (
//             <ManageCustomer
//               customers={customers}
//               onAddCustomer={addCustomer}
//               onUpdateCustomer={updateCustomer}
//               onDeleteCustomer={deleteCustomer}
//             />
//           )}

//           {activeTab === 'kyc' && (
//             <ManageKYC
//               banks={banks}
//               customers={customers}
//               kycRecords={kycRecords}
//               onAddKYC={addKYC}
//               onUpdateKYC={updateKYC}
//               onDeleteKYC={deleteKYC}
//             />
//           )}

//           {activeTab === 'employees' && (
//             <ManageEmployee
//               banks={banks}
//               branches={branches}
//               employees={employees}
//               onAddEmployee={addEmployee}
//               onUpdateEmployee={updateEmployee}
//               onDeleteEmployee={deleteEmployee}
//             />
//           )}

//           {activeTab === 'operations' && (
//             <Operations
//               banks={banks}
//               branches={branches}
//               customers={customers}
//               accounts={accounts}
//               transactions={transactions}
//               onAddAccount={addAccount}
//               onDeposit={handleDeposit}
//               onWithdraw={handleWithdraw}
//               onTransfer={handleTransfer}
//             />
//           )}

//           {activeTab === 'loans' && (
//             <LoanManagement
//               banks={banks}
//               branches={branches}
//               customers={customers}
//               accounts={accounts}
//             />
//           )}

//           {activeTab === 'banking-ops' && (
//             <BankingOperations
//               banks={banks}
//               branches={branches}
//               customers={customers}
//               accounts={accounts}
//               transactions={transactions}
//             />
//           )}

//           {activeTab === 'reports' && (
//             <ReportRequest
//               banks={banks}
//               branches={branches}
//               customers={customers}
//               accounts={accounts}
//               transactions={transactions}
//               onSendReportRequest={sendReportRequest}
//             />
//           )}
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-12 pt-8 border-t border-gray-200">
//           <p className="text-gray-500">Bank Management System - Enterprise Banking Operations Platform</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

// import React, { useState, useEffect } from 'react';
// import { Building2, MapPin, Users, FileCheck, User as UserTie, CreditCard, Shield, Banknote, FileText } from 'lucide-react';
// import { Bank, Branch, Customer, KYC, Employee, Account, Transaction } from './types';
// import HomePage from './components/HomePage';
// import CustomerPortal from './components/CustomerPortal';
// import ManageBank from './components/ManageBank';
// import ManageBranch from './components/ManageBranch';
// import ManageCustomer from './components/ManageCustomer';
// import ManageKYC from './components/ManageKYC';
// import ManageEmployee from './components/ManageEmployee';
// import Operations from './components/Operations';
// import BankingOperations from './components/BankingOperations';
// import LoanManagement from './components/LoanManagement';
// import ReportRequest from './components/ReportRequest';
// import { banksApi, branchesApi, customersApi, kycApi, employeesApi, accountsApi, transactionsApi } from './services/api';

// type ActiveTab = 'banks' | 'branches' | 'customers' | 'kyc' | 'employees' | 'operations' | 'loans' | 'banking-ops' | 'reports';
// type UserMode = 'home' | 'admin' | 'customer';

// function App() {
//   const [userMode, setUserMode] = useState<UserMode>('home');
//   const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
//   const [activeTab, setActiveTab] = useState<ActiveTab>('banks');
//   const [loading, setLoading] = useState(false);
  
//   // State management for all entities
//   const [banks, setBanks] = useState<Bank[]>([]);
//   const [branches, setBranches] = useState<Branch[]>([]);
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [kycRecords, setKycRecords] = useState<KYC[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [accounts, setAccounts] = useState<Account[]>([]);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);

//   // Load data on component mount
//   useEffect(() => {
//     if (userMode !== 'home') {
//       loadAllData();
//     }
//   }, [userMode]);

//   const loadAllData = async () => {
//     setLoading(true);
//     try {
//       const [banksData, branchesData, customersData, kycData, employeesData, accountsData, transactionsData] = await Promise.all([
//         banksApi.getAll(),
//         branchesApi.getAll(),
//         customersApi.getAll(),
//         kycApi.getAll(),
//         employeesApi.getAll(),
//         accountsApi.getAll(),
//         transactionsApi.getAll(),
//       ]);

//       setBanks(banksData);
//       setBranches(branchesData);
//       setCustomers(customersData);
//       setKycRecords(kycData);
//       setEmployees(employeesData);
//       setAccounts(accountsData);
//       setTransactions(transactionsData);
//     } catch (error) {
//       console.error('Error loading data:', error);
//       alert('Error loading data from database. Please check if MongoDB is running.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Authentication handlers
//   const handleAdminLogin = (username: string, password: string) => {
//     // Simple admin authentication (in production, use proper authentication)
//     if (username === 'admin' && password === 'admin123') {
//       setUserMode('admin');
//       setActiveTab('banks');
//     } else {
//       alert('Invalid admin credentials');
//     }
//   };

//   const handleCustomerLogin = (panNumber: string, password: string) => {
//     // Find customer by PAN number and check password
//     const customer = customers.find(c => c.panNumber === panNumber);
//     if (customer && password === '12345678') {
//       setCurrentCustomer(customer);
//       setUserMode('customer');
//     } else {
//       alert('Invalid customer credentials. Please check your PAN number and password.');
//     }
//   };

//   const handleLogout = () => {
//     setUserMode('home');
//     setCurrentCustomer(null);
//     setActiveTab('banks');
//   };

//   // Check withdrawal eligibility API
//   const checkWithdrawEligibility = async (customerId: string, amount: number): Promise<{ eligible: boolean; message: string }> => {
//     try {
//       const response = await fetch('http://localhost:5000/api/check-withdraw-eligibility', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ customerId, amount }),
//       });
      
//       const result = await response.json();
//       return result;
//     } catch (error) {
//       console.error('Error checking withdrawal eligibility:', error);
//       return { eligible: false, message: 'Error checking eligibility' };
//     }
//   };

//   // Send report request to external system
//   // const sendReportRequest = async (reportType: string, period: string, filters: any) => {
//   //   try {
//   //     console.log('🔄 Starting report request process...');
      
//   //     const reportRequest = {
//   //       reportType,
//   //       period,
//   //       filters,
//   //       requestedBy: 'admin',
//   //       requestId: `REQ_${Date.now()}`,
//   //       timestamp: new Date().toISOString(),
//   //       bankingSystemUrl: 'http://localhost:5000/api'
//   //     };

//   //     const REPORT_GENERATION_API_URL = import.meta.env.VITE_REPORT_GENERATION_API_URL || 'http://localhost:5000/api';

//   //     // Log payload for debugging
//   //     console.log('🚀 Sending Report Request Payload:', reportRequest);
//   //     console.log('📡 Target API URL:', `${REPORT_GENERATION_API_URL}/reports/request`);
//   //     console.log('🔑 API Token:', import.meta.env.VITE_REPORT_API_TOKEN || 'demo-token');
//   //     console.log('🏦 Banking System ID:', import.meta.env.VITE_BANKING_SYSTEM_ID || 'banking-system-001');
//   //     console.log('📤 HTTP Method: POST (not GET!)');

//   //     const response = await fetch(`${REPORT_GENERATION_API_URL}/reports/request`, {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //         'Authorization': `Bearer ${import.meta.env.VITE_REPORT_API_TOKEN || 'demo-token'}`,
//   //         'X-Banking-System-ID': import.meta.env.VITE_BANKING_SYSTEM_ID || 'banking-system-001'
//   //       },
//   //       body: JSON.stringify(reportRequest)
//   //     });

//   //     console.log('📊 Response Status:', response.status, response.statusText);
//   //     console.log('📋 Response Headers:', Object.fromEntries(response.headers.entries()));
      
//   //     if (!response.ok) {
//   //       console.error('❌ HTTP Error:', response.status, response.statusText);
//   //       const errorText = await response.text();
//   //       console.error('❌ Error Response Body:', errorText);
//   //       throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//   //     }
      
//   //     const result = await response.json();
//   //     console.log('✅ Response from backend:', result);

//   //     if (response.ok) {
//   //       alert(`✅ Report request submitted successfully!\n\nRequest ID: ${result.requestId}\nStatus: ${result.status}\nEstimated completion: ${result.estimatedCompletionTime || 'Unknown'}\n\n📊 Report Type: ${result.reportType}\n📅 Period: ${result.period}`);
//   //     } else {
//   //       throw new Error(result.message || 'Failed to submit report request');
//   //     }

//   //   } catch (error: any) {
//   //     console.error('❌ Error sending report request:', error);
//   //     console.log('🔍 Error details:', {
//   //       message: error.message,
//   //       stack: error.stack,
//   //       name: error.name
//   //     });

//   //     if (error.message.includes('fetch')) {
//   //       console.log('🔄 External system not available, showing demo response');
//   //       const demoRequest = {
//   //         reportType,
//   //         period,
//   //         filters,
//   //         requestedBy: 'admin',
//   //         requestId: `REQ_${Date.now()}`,
//   //         timestamp: new Date().toISOString(),
//   //         bankingSystemUrl: 'http://localhost:5000/api'
//   //       };

//   //       console.log('Report Request (Demo Mode):', demoRequest);
//   //       alert(`📋 Report request prepared for external system!\n\nRequest ID: ${demoRequest.requestId}\nType: ${reportType}\nPeriod: ${period}\n\n⚠️ Demo Mode: External report generation system not configured.\nIn production, this would be sent to: ${REPORT_GENERATION_API_URL}\n\n🔗 Banking System APIs available at: http://localhost:5000/api`);
//   //     } else {
//   //       alert(`❌ Error sending report request: ${error.message}`);
//   //     }
//   //   }
//   // };
//   const sendReportRequest = async (reportType: string, period: string, filters: any) => {
//     try {
//       console.log('🔄 Starting report request process...');
//       console.log('📝 Input parameters:', { reportType, period, filters });
      
//       const reportRequest = {
//         reportType,
//         period,
//         filters,
//         requestedBy: 'admin',
//         requestId: `REQ_${Date.now()}`,
//         timestamp: new Date().toISOString(),
//         bankingSystemUrl: 'http://localhost:5000/api'
//       };

//       const REPORT_GENERATION_API_URL = 'http://localhost:5000/api';

//       // Log payload for debugging
//       console.log('🚀 Sending Report Request Payload:', reportRequest);
//       console.log('📡 Target API URL:', `${REPORT_GENERATION_API_URL}/reports/request`);
//       console.log('📦 Request body as JSON:', JSON.stringify(reportRequest, null, 2));

//       const response = await fetch(`${REPORT_GENERATION_API_URL}/reports/request`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer demo-token',
//           'X-Banking-System-ID': 'banking-system-001'
//         },
//         body: JSON.stringify(reportRequest)
//       });

//       console.log('📊 Response Status:', response.status, response.statusText);
      
//       if (!response.ok) {
//         console.error('❌ HTTP Error:', response.status, response.statusText);
//         const errorText = await response.text();
//         console.error('❌ Error Response Body:', errorText);
        
//         // Try to parse error as JSON for better debugging
//         try {
//           const errorJson = JSON.parse(errorText);
//           console.error('❌ Parsed Error:', errorJson);
//         } catch (e) {
//           console.error('❌ Raw Error Text:', errorText);
//         }
        
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
      
//       const result = await response.json();
//       console.log('✅ Response from backend:', result);

//       // Show success message based on the actual response
//       if (result.success) {
//         alert(`✅ Report request submitted successfully!\n\nRequest ID: ${result.requestId}\nStatus: ${result.status}\nMessage: ${result.message}\n\n📊 Report Type: ${result.reportType}\n📅 Period: ${result.period}\n\n🔄 Your report is being processed and will be available shortly.`);
//       } else {
//         throw new Error(result.message || 'Failed to submit report request');
//       }

//     } catch (error: any) {
//       console.error('❌ Error sending report request:', error);
      
//       if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
//         console.log('🔄 External system not available, showing demo response');
//         const demoRequest = {
//           reportType,
//           period,
//           filters,
//           requestedBy: 'admin',
//           requestId: `REQ_${Date.now()}`,
//           timestamp: new Date().toISOString(),
//           bankingSystemUrl: 'http://localhost:5000/api'
//         };

//         console.log('Report Request (Demo Mode):', demoRequest);
//         alert(`📋 Report request prepared for external system!\n\nRequest ID: ${demoRequest.requestId}\nType: ${reportType}\nPeriod: ${period}\n\n⚠️ Demo Mode: External report generation system not available.\nIn production, this would be sent to the report generation API.\n\n🔗 Banking System APIs available at: http://localhost:5000/api`);
//       } else {
//         alert(`❌ Error sending report request: ${error.message}`);
//       }
//     }
//   };
//   // Bank management functions
//   const addBank = async (bankData: Omit<Bank, 'id' | 'createdAt'>) => {
//     try {
//       const newBank = await banksApi.create(bankData);
//       setBanks(prev => [...prev, newBank]);
//     } catch (error) {
//       console.error('Error adding bank:', error);
//       alert('Error adding bank');
//     }
//   };

//   const updateBank = async (id: string, bankData: Omit<Bank, 'id' | 'createdAt'>) => {
//     try {
//       const updatedBank = await banksApi.update(id, bankData);
//       setBanks(prev => prev.map(bank => 
//         bank.id === id ? updatedBank : bank
//       ));
//     } catch (error) {
//       console.error('Error updating bank:', error);
//       alert('Error updating bank');
//     }
//   };

//   const deleteBank = async (id: string) => {
//     try {
//       await banksApi.delete(id);
//       setBanks(prev => prev.filter(bank => bank.id !== id));
//       // Also remove related branches and employees from state
//       setBranches(prev => prev.filter(branch => branch.bankId !== id));
//       setEmployees(prev => prev.filter(employee => employee.bankId !== id));
//     } catch (error) {
//       console.error('Error deleting bank:', error);
//       alert('Error deleting bank');
//     }
//   };

//   // Branch management functions
//   const addBranch = async (branchData: Omit<Branch, 'id' | 'createdAt'>) => {
//     try {
//       const newBranch = await branchesApi.create(branchData);
//       setBranches(prev => [...prev, newBranch]);
//     } catch (error) {
//       console.error('Error adding branch:', error);
//       alert('Error adding branch');
//     }
//   };

//   const updateBranch = async (id: string, branchData: Omit<Branch, 'id' | 'createdAt'>) => {
//     try {
//       const updatedBranch = await branchesApi.update(id, branchData);
//       setBranches(prev => prev.map(branch => 
//         branch.id === id ? updatedBranch : branch
//       ));
//     } catch (error) {
//       console.error('Error updating branch:', error);
//       alert('Error updating branch');
//     }
//   };

//   const deleteBranch = async (id: string) => {
//     try {
//       await branchesApi.delete(id);
//       setBranches(prev => prev.filter(branch => branch.id !== id));
//       // Also remove related employees from state
//       setEmployees(prev => prev.filter(employee => employee.branchId !== id));
//     } catch (error) {
//       console.error('Error deleting branch:', error);
//       alert('Error deleting branch');
//     }
//   };

//   // Customer management functions
//   const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
//     try {
//       const newCustomer = await customersApi.create(customerData);
//       setCustomers(prev => [...prev, newCustomer]);
//     } catch (error) {
//       console.error('Error adding customer:', error);
//       alert('Error adding customer');
//     }
//   };

//   const updateCustomer = async (id: string, customerData: Omit<Customer, 'id' | 'createdAt'>) => {
//     try {
//       const updatedCustomer = await customersApi.update(id, customerData);
//       setCustomers(prev => prev.map(customer => 
//         customer.id === id ? updatedCustomer : customer
//       ));
//     } catch (error) {
//       console.error('Error updating customer:', error);
//       alert('Error updating customer');
//     }
//   };

//   const deleteCustomer = async (id: string) => {
//     try {
//       await customersApi.delete(id);
//       setCustomers(prev => prev.filter(customer => customer.id !== id));
//       // Also remove related KYC records from state
//       setKycRecords(prev => prev.filter(kyc => kyc.customerId !== id));
//     } catch (error) {
//       console.error('Error deleting customer:', error);
//       alert('Error deleting customer');
//     }
//   };

//   // KYC management functions
//   const addKYC = async (kycData: Omit<KYC, 'id' | 'createdAt'>) => {
//     try {
//       const newKYC = await kycApi.create(kycData);
//       setKycRecords(prev => [...prev, newKYC]);
//     } catch (error) {
//       console.error('Error adding KYC:', error);
//       alert('Error adding KYC record');
//     }
//   };

//   const updateKYC = async (id: string, kycData: Omit<KYC, 'id' | 'createdAt'>) => {
//     try {
//       const updatedKYC = await kycApi.update(id, kycData);
//       setKycRecords(prev => prev.map(kyc => 
//         kyc.id === id ? updatedKYC : kyc
//       ));
//     } catch (error) {
//       console.error('Error updating KYC:', error);
//       alert('Error updating KYC record');
//     }
//   };

//   const deleteKYC = async (id: string) => {
//     try {
//       await kycApi.delete(id);
//       setKycRecords(prev => prev.filter(kyc => kyc.id !== id));
//     } catch (error) {
//       console.error('Error deleting KYC:', error);
//       alert('Error deleting KYC record');
//     }
//   };

//   // Employee management functions
//   const addEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
//     try {
//       const newEmployee = await employeesApi.create(employeeData);
//       setEmployees(prev => [...prev, newEmployee]);
//     } catch (error) {
//       console.error('Error adding employee:', error);
//       alert('Error adding employee');
//     }
//   };

//   const updateEmployee = async (id: string, employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
//     try {
//       const updatedEmployee = await employeesApi.update(id, employeeData);
//       setEmployees(prev => prev.map(employee => 
//         employee.id === id ? updatedEmployee : employee
//       ));
//     } catch (error) {
//       console.error('Error updating employee:', error);
//       alert('Error updating employee');
//     }
//   };

//   const deleteEmployee = async (id: string) => {
//     try {
//       await employeesApi.delete(id);
//       setEmployees(prev => prev.filter(employee => employee.id !== id));
//     } catch (error) {
//       console.error('Error deleting employee:', error);
//       alert('Error deleting employee');
//     }
//   };

//   // Account management functions
//   const addAccount = async (accountData: Omit<Account, 'id' | 'createdAt'>) => {
//     try {
//       const newAccount = await accountsApi.create(accountData);
//       setAccounts(prev => [...prev, newAccount]);
      
//       // Create initial deposit transaction if balance > 0
//       if (accountData.balance > 0) {
//         const transactionData = {
//           accountId: newAccount.id,
//           type: 'deposit' as const,
//           amount: accountData.balance,
//           balance: accountData.balance,
//           description: 'Initial Deposit',
//           referenceNumber: `TXN${Date.now()}`
//         };
//         const newTransaction = await transactionsApi.create(transactionData);
//         setTransactions(prev => [...prev, newTransaction]);
//       }
//     } catch (error) {
//       console.error('Error adding account:', error);
//       alert('Error adding account');
//     }
//   };

//   // Transaction functions
//   const handleDeposit = async (accountId: string, amount: number, description: string) => {
//     try {
//       const account = accounts.find(acc => acc.id === accountId);
//       if (!account) return;

//       const newBalance = account.balance + amount;
      
//       // Update account balance
//       await accountsApi.update(accountId, { ...account, balance: newBalance });
//       setAccounts(prev => prev.map(acc => 
//         acc.id === accountId ? { ...acc, balance: newBalance } : acc
//       ));

//       // Create transaction record
//       const transactionData = {
//         accountId,
//         type: 'deposit' as const,
//         amount,
//         balance: newBalance,
//         description,
//         referenceNumber: `TXN${Date.now()}`
//       };
//       const newTransaction = await transactionsApi.create(transactionData);
//       setTransactions(prev => [...prev, newTransaction]);

//       alert('Deposit successful!');
//     } catch (error) {
//       console.error('Error processing deposit:', error);
//       alert('Error processing deposit');
//     }
//   };

//   const handleWithdraw = async (accountId: string, amount: number, description: string) => {
//     try {
//       const account = accounts.find(acc => acc.id === accountId);
//       if (!account || account.balance < amount) return;

//       const newBalance = account.balance - amount;
      
//       // Update account balance
//       await accountsApi.update(accountId, { ...account, balance: newBalance });
//       setAccounts(prev => prev.map(acc => 
//         acc.id === accountId ? { ...acc, balance: newBalance } : acc
//       ));

//       // Create transaction record
//       const transactionData = {
//         accountId,
//         type: 'withdraw' as const,
//         amount,
//         balance: newBalance,
//         description,
//         referenceNumber: `TXN${Date.now()}`
//       };
//       const newTransaction = await transactionsApi.create(transactionData);
//       setTransactions(prev => [...prev, newTransaction]);

//       alert('Withdrawal successful!');
//     } catch (error) {
//       console.error('Error processing withdrawal:', error);
//       alert('Error processing withdrawal');
//     }
//   };

//   const handleTransfer = async (fromAccountId: string, toAccountId: string, amount: number, description: string) => {
//     try {
//       const fromAccount = accounts.find(acc => acc.id === fromAccountId);
//       const toAccount = accounts.find(acc => acc.id === toAccountId);
      
//       if (!fromAccount || !toAccount || fromAccount.balance < amount) return;

//       const fromNewBalance = fromAccount.balance - amount;
//       const toNewBalance = toAccount.balance + amount;
//       const refNumber = `TXN${Date.now()}`;
      
//       // Update both account balances
//       await accountsApi.update(fromAccountId, { ...fromAccount, balance: fromNewBalance });
//       await accountsApi.update(toAccountId, { ...toAccount, balance: toNewBalance });
      
//       setAccounts(prev => prev.map(acc => {
//         if (acc.id === fromAccountId) return { ...acc, balance: fromNewBalance };
//         if (acc.id === toAccountId) return { ...acc, balance: toNewBalance };
//         return acc;
//       }));

//       // Create transaction records for both accounts
//       const fromTransactionData = {
//         accountId: fromAccountId,
//         type: 'transfer_out' as const,
//         amount,
//         balance: fromNewBalance,
//         description,
//         referenceNumber: refNumber,
//         toAccountId
//       };
      
//       const toTransactionData = {
//         accountId: toAccountId,
//         type: 'transfer_in' as const,
//         amount,
//         balance: toNewBalance,
//         description,
//         referenceNumber: refNumber
//       };

//       const [fromTransaction, toTransaction] = await Promise.all([
//         transactionsApi.create(fromTransactionData),
//         transactionsApi.create(toTransactionData)
//       ]);

//       setTransactions(prev => [...prev, fromTransaction, toTransaction]);

//       alert('Transfer successful!');
//     } catch (error) {
//       console.error('Error processing transfer:', error);
//       alert('Error processing transfer');
//     }
//   };

//   // Show home page
//   if (userMode === 'home') {
//     return (
//       <HomePage 
//         onAdminLogin={handleAdminLogin}
//         onCustomerLogin={handleCustomerLogin}
//       />
//     );
//   }

//   // Show customer portal
//   if (userMode === 'customer' && currentCustomer) {
//     return (
//       <CustomerPortal
//         customer={currentCustomer}
//         accounts={accounts}
//         transactions={transactions}
//         banks={banks}
//         branches={branches}
//         kycRecords={kycRecords}
//         onLogout={handleLogout}
//         onDeposit={handleDeposit}
//         onWithdraw={handleWithdraw}
//         onTransfer={handleTransfer}
//         onCheckWithdrawEligibility={checkWithdrawEligibility}
//       />
//     );
//   }

//   // Admin interface
//   const tabs = [
//     { id: 'banks' as ActiveTab, label: 'Manage Banks', icon: Building2, color: 'blue' },
//     { id: 'branches' as ActiveTab, label: 'Manage Branches', icon: MapPin, color: 'green', disabled: banks.length === 0 },
//     { id: 'customers' as ActiveTab, label: 'Customers', icon: Users, color: 'purple' },
//     { id: 'kyc' as ActiveTab, label: 'Manage KYC', icon: FileCheck, color: 'orange' },
//     { id: 'employees' as ActiveTab, label: 'Manage Employees', icon: UserTie, color: 'indigo' },
//     { id: 'operations' as ActiveTab, label: 'Customer Operations', icon: CreditCard, color: 'teal' },
//     { id: 'loans' as ActiveTab, label: 'Loan Management', icon: Banknote, color: 'rose' },
//     { id: 'banking-ops' as ActiveTab, label: 'Banking Operations', icon: Shield, color: 'violet' },
//     { id: 'reports' as ActiveTab, label: 'Reports', icon: FileText, color: 'emerald' }
//   ];

//   const getTabColorClasses = (color: string, isActive: boolean, isDisabled: boolean) => {
//     if (isDisabled) {
//       return 'bg-gray-100 text-gray-400 cursor-not-allowed';
//     }
    
//     const colorMap = {
//       blue: isActive ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50',
//       green: isActive ? 'bg-green-600 text-white' : 'bg-white text-green-600 hover:bg-green-50',
//       purple: isActive ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 hover:bg-purple-50',
//       orange: isActive ? 'bg-orange-600 text-white' : 'bg-white text-orange-600 hover:bg-orange-50',
//       indigo: isActive ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 hover:bg-indigo-50',
//       teal: isActive ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 hover:bg-teal-50',
//       rose: isActive ? 'bg-rose-600 text-white' : 'bg-white text-rose-600 hover:bg-rose-50',
//       violet: isActive ? 'bg-violet-600 text-white' : 'bg-white text-violet-600 hover:bg-violet-50',
//       emerald: isActive ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 hover:bg-emerald-50'
//     };
    
//     return colorMap[color as keyof typeof colorMap] || colorMap.blue;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading data from MongoDB...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div className="text-center flex-1">
//             <h1 className="text-4xl font-bold text-gray-800 mb-2">Bank Management System - Admin Panel</h1>
//             <p className="text-gray-600">Comprehensive banking operations management platform with MongoDB</p>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//           >
//             <Shield className="h-4 w-4" />
//             Logout
//           </button>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="flex flex-wrap justify-center gap-4 mb-8">
//           {tabs.map((tab) => {
//             const Icon = tab.icon;
//             const isActive = activeTab === tab.id;
//             const isDisabled = tab.disabled;
            
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => !isDisabled && setActiveTab(tab.id)}
//                 disabled={isDisabled}
//                 className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm ${getTabColorClasses(tab.color, isActive, isDisabled)}`}
//                 title={isDisabled ? 'Create a bank first to enable this feature' : ''}
//               >
//                 <Icon className="h-5 w-5" />
//                 {tab.label}
//                 {isDisabled && (
//                   <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1 rounded">
//                     Disabled
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </div>

//         {/* Content Area */}
//         <div className="max-w-7xl mx-auto">
//           {activeTab === 'banks' && (
//             <ManageBank
//               banks={banks}
//               onAddBank={addBank}
//               onUpdateBank={updateBank}
//               onDeleteBank={deleteBank}
//             />
//           )}
          
//           {activeTab === 'branches' && (
//             <ManageBranch
//               banks={banks}
//               branches={branches}
//               onAddBranch={addBranch}
//               onUpdateBranch={updateBranch}
//               onDeleteBranch={deleteBranch}
//             />
//           )}

//           {activeTab === 'customers' && (
//             <ManageCustomer
//               customers={customers}
//               onAddCustomer={addCustomer}
//               onUpdateCustomer={updateCustomer}
//               onDeleteCustomer={deleteCustomer}
//             />
//           )}

//           {activeTab === 'kyc' && (
//             <ManageKYC
//               banks={banks}
//               customers={customers}
//               kycRecords={kycRecords}
//               onAddKYC={addKYC}
//               onUpdateKYC={updateKYC}
//               onDeleteKYC={deleteKYC}
//             />
//           )}

//           {activeTab === 'employees' && (
//             <ManageEmployee
//               banks={banks}
//               branches={branches}
//               employees={employees}
//               onAddEmployee={addEmployee}
//               onUpdateEmployee={updateEmployee}
//               onDeleteEmployee={deleteEmployee}
//             />
//           )}

//           {activeTab === 'operations' && (
//             <Operations
//               banks={banks}
//               branches={branches}
//               customers={customers}
//               accounts={accounts}
//               transactions={transactions}
//               onAddAccount={addAccount}
//               onDeposit={handleDeposit}
//               onWithdraw={handleWithdraw}
//               onTransfer={handleTransfer}
//             />
//           )}

//           {activeTab === 'loans' && (
//             <LoanManagement
//               banks={banks}
//               branches={branches}
//               customers={customers}
//               accounts={accounts}
//             />
//           )}

//           {activeTab === 'banking-ops' && (
//             <BankingOperations
//               banks={banks}
//               branches={branches}
//               customers={customers}
//               accounts={accounts}
//               transactions={transactions}
//             />
//           )}

//           {activeTab === 'reports' && (
//             <ReportRequest
//               banks={banks}
//               branches={branches}
//               customers={customers}
//               accounts={accounts}
//               transactions={transactions}
//               onSendReportRequest={sendReportRequest}
//             />
//           )}
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-12 pt-8 border-t border-gray-200">
//           <p className="text-gray-500">Bank Management System - Enterprise Banking Operations Platform</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

//modified by prasanna-11/07/25
import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Users, FileCheck, User as UserTie, CreditCard, Shield, Banknote, FileText } from 'lucide-react';
import { Bank, Branch, Customer, KYC, Employee, Account, Transaction } from './types';
import HomePage from './components/HomePage';
import CustomerPortal from './components/CustomerPortal';
import ManageBank from './components/ManageBank';
import ManageBranch from './components/ManageBranch';
import ManageCustomer from './components/ManageCustomer';
import ManageKYC from './components/ManageKYC';
import ManageEmployee from './components/ManageEmployee';
import Operations from './components/Operations';
import BankingOperations from './components/BankingOperations';
import LoanManagement from './components/LoanManagement';
import ReportRequest from './components/ReportRequest';
import { banksApi, branchesApi, customersApi, kycApi, employeesApi, accountsApi, transactionsApi } from './services/api';

type ActiveTab = 'banks' | 'branches' | 'customers' | 'kyc' | 'employees' | 'operations' | 'loans' | 'banking-ops' | 'reports';
type UserMode = 'home' | 'admin' | 'customer';

function App() {
  const [userMode, setUserMode] = useState<UserMode>('home');
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('banks');
  const [loading, setLoading] = useState(false);
  
  // State management for all entities
  const [banks, setBanks] = useState<Bank[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [kycRecords, setKycRecords] = useState<KYC[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load data on component mount
  useEffect(() => {
    if (userMode !== 'home') {
      loadAllData();
    }
  }, [userMode]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [banksData, branchesData, customersData, kycData, employeesData, accountsData, transactionsData] = await Promise.all([
        banksApi.getAll(),
        branchesApi.getAll(),
        customersApi.getAll(),
        kycApi.getAll(),
        employeesApi.getAll(),
        accountsApi.getAll(),
        transactionsApi.getAll(),
      ]);

      setBanks(banksData);
      setBranches(branchesData);
      setCustomers(customersData);
      setKycRecords(kycData);
      setEmployees(employeesData);
      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading data from database. Please check if MongoDB is running.');
    } finally {
      setLoading(false);
    }
  };

  // Authentication handlers
  const handleAdminLogin = (username: string, password: string) => {
    // Simple admin authentication (in production, use proper authentication)
    if (username === 'admin' && password === 'admin123') {
      setUserMode('admin');
      setActiveTab('banks');
    } else {
      alert('Invalid admin credentials');
    }
  };
const handleCustomerLogin = (panNumber: string, password: string) => {
  const customer = customers.find(
    (c) => c.panNumber?.trim().toLowerCase() === panNumber.trim().toLowerCase()
  );

  if (customer && password === '12345678') {
    setCurrentCustomer(customer);
    setUserMode('customer');
  } else {
    alert('Invalid customer credentials. Please check your PAN number and password.');
  }
};
  // const handleCustomerLogin = (panNumber: string, password: string) => {
  //   // Find customer by PAN number and check password
  //   const customer = customers.find(c => c.panNumber === panNumber);
  //   if (customer && password === '12345678') {
  //     setCurrentCustomer(customer);
  //     setUserMode('customer');
  //   } else {
  //     alert('Invalid customer credentials. Please check your PAN number and password.');
  //   }
  // };

  const handleLogout = () => {
    setUserMode('home');
    setCurrentCustomer(null);
    setActiveTab('banks');
  };

  // Check withdrawal eligibility API
  const checkWithdrawEligibility = async (customerId: string, amount: number): Promise<{ eligible: boolean; message: string }> => {
    try {
      const response = await fetch('http://localhost:5000/api/check-withdraw-eligibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId, amount }),
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error checking withdrawal eligibility:', error);
      return { eligible: false, message: 'Error checking eligibility' };
    }
  };

  // Send report request to external system
  const sendReportRequest = async (reportType: string, period: string, filters: any) => {
    try {
      const reportRequest = {
        reportType,
        period,
        filters,
        requestedBy: 'admin',
        requestId: `REQ_${Date.now()}`,
        timestamp: new Date().toISOString(),
        bankingSystemUrl: 'http://localhost:5000/api'
      };

      // Use Vite environment variables (VITE_ prefix)
      const REPORT_GENERATION_API_URL = import.meta.env.VITE_REPORT_GENERATION_API_URL || 'http://localhost:5000/api';
      
      // Send to external report generation system
      const response = await fetch(`${REPORT_GENERATION_API_URL}/reports/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_REPORT_API_TOKEN || 'demo-token'}`,
          'X-Banking-System-ID': import.meta.env.VITE_BANKING_SYSTEM_ID || 'banking-system-001'
        },
        body: JSON.stringify(reportRequest)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Report request accepted:', result);
        alert(`✅ Report request submitted successfully!\n\nRequest ID: ${result.requestId}\nStatus: ${result.status}\nEstimated completion: ${result.estimatedCompletionTime || 'Unknown'}\n\n📊 Report Type: ${result.reportType}\n📅 Period: ${result.period}`);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit report request');
      }
      
    } catch (error) {
      console.error('Error sending report request:', error);
      
      // Fallback for demo/development
      if (error.message.includes('fetch')) {
        console.log('🔄 External system not available, showing demo response');
        const reportRequest = {
          reportType,
          period,
          filters,
          requestedBy: 'admin',
          requestId: `REQ_${Date.now()}`,
          timestamp: new Date().toISOString(),
          bankingSystemUrl: 'http://localhost:5000/api'
        };
        
        console.log('Report Request (Demo Mode):', reportRequest);
        alert(`📋 Report request prepared for external system!\n\nRequest ID: ${reportRequest.requestId}\nType: ${reportType}\nPeriod: ${period}\n\n⚠️ Demo Mode: External report generation system not configured.\nIn production, this would be sent to: ${import.meta.env.VITE_REPORT_GENERATION_API_URL || 'http://report-system.com/api'}\n\n🔗 Banking System APIs available at: http://localhost:5000/api`);
      } else {
        alert(`❌ Error sending report request: ${error.message}`);
      }
    }
  };

  // Bank management functions
  const addBank = async (bankData: Omit<Bank, 'id' | 'createdAt'>) => {
    try {
      const newBank = await banksApi.create(bankData);
      setBanks(prev => [...prev, newBank]);
    } catch (error) {
      console.error('Error adding bank:', error);
      alert('Error adding bank');
    }
  };

  const updateBank = async (id: string, bankData: Omit<Bank, 'id' | 'createdAt'>) => {
    try {
      const updatedBank = await banksApi.update(id, bankData);
      setBanks(prev => prev.map(bank => 
        bank.id === id ? updatedBank : bank
      ));
    } catch (error) {
      console.error('Error updating bank:', error);
      alert('Error updating bank');
    }
  };

  const deleteBank = async (id: string) => {
    try {
      await banksApi.delete(id);
      setBanks(prev => prev.filter(bank => bank.id !== id));
      // Also remove related branches and employees from state
      setBranches(prev => prev.filter(branch => branch.bankId !== id));
      setEmployees(prev => prev.filter(employee => employee.bankId !== id));
    } catch (error) {
      console.error('Error deleting bank:', error);
      alert('Error deleting bank');
    }
  };

  // Branch management functions
  const addBranch = async (branchData: Omit<Branch, 'id' | 'createdAt'>) => {
    try {
      const newBranch = await branchesApi.create(branchData);
      setBranches(prev => [...prev, newBranch]);
    } catch (error) {
      console.error('Error adding branch:', error);
      alert('Error adding branch');
    }
  };

  const updateBranch = async (id: string, branchData: Omit<Branch, 'id' | 'createdAt'>) => {
    try {
      const updatedBranch = await branchesApi.update(id, branchData);
      setBranches(prev => prev.map(branch => 
        branch.id === id ? updatedBranch : branch
      ));
    } catch (error) {
      console.error('Error updating branch:', error);
      alert('Error updating branch');
    }
  };

  const deleteBranch = async (id: string) => {
    try {
      await branchesApi.delete(id);
      setBranches(prev => prev.filter(branch => branch.id !== id));
      // Also remove related employees from state
      setEmployees(prev => prev.filter(employee => employee.branchId !== id));
    } catch (error) {
      console.error('Error deleting branch:', error);
      alert('Error deleting branch');
    }
  };

  // Customer management functions
  const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    try {
      const newCustomer = await customersApi.create(customerData);
      setCustomers(prev => [...prev, newCustomer]);
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Error adding customer');
    }
  };

  const updateCustomer = async (id: string, customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    try {
      const updatedCustomer = await customersApi.update(id, customerData);
      setCustomers(prev => prev.map(customer => 
        customer.id === id ? updatedCustomer : customer
      ));
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Error updating customer');
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await customersApi.delete(id);
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      // Also remove related KYC records from state
      setKycRecords(prev => prev.filter(kyc => kyc.customerId !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Error deleting customer');
    }
  };

  // KYC management functions
  const addKYC = async (kycData: Omit<KYC, 'id' | 'createdAt'>) => {
    try {
      const newKYC = await kycApi.create(kycData);
      setKycRecords(prev => [...prev, newKYC]);
    } catch (error) {
      console.error('Error adding KYC:', error);
      alert('Error adding KYC record');
    }
  };

  const updateKYC = async (id: string, kycData: Omit<KYC, 'id' | 'createdAt'>) => {
    try {
      const updatedKYC = await kycApi.update(id, kycData);
      setKycRecords(prev => prev.map(kyc => 
        kyc.id === id ? updatedKYC : kyc
      ));
    } catch (error) {
      console.error('Error updating KYC:', error);
      alert('Error updating KYC record');
    }
  };

  const deleteKYC = async (id: string) => {
    try {
      await kycApi.delete(id);
      setKycRecords(prev => prev.filter(kyc => kyc.id !== id));
    } catch (error) {
      console.error('Error deleting KYC:', error);
      alert('Error deleting KYC record');
    }
  };

  // Employee management functions
  const addEmployee = async (employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
    try {
      const newEmployee = await employeesApi.create(employeeData);
      setEmployees(prev => [...prev, newEmployee]);
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee');
    }
  };

  const updateEmployee = async (id: string, employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
    try {
      const updatedEmployee = await employeesApi.update(id, employeeData);
      setEmployees(prev => prev.map(employee => 
        employee.id === id ? updatedEmployee : employee
      ));
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Error updating employee');
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await employeesApi.delete(id);
      setEmployees(prev => prev.filter(employee => employee.id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error deleting employee');
    }
  };

  // Account management functions
  const addAccount = async (accountData: Omit<Account, 'id' | 'createdAt'>) => {
    try {
      const newAccount = await accountsApi.create(accountData);
      setAccounts(prev => [...prev, newAccount]);
      
      // Create initial deposit transaction if balance > 0
      if (accountData.balance > 0) {
        const transactionData = {
          accountId: newAccount.id,
          type: 'deposit' as const,
          amount: accountData.balance,
          balance: accountData.balance,
          description: 'Initial Deposit',
          referenceNumber: `TXN${Date.now()}`
        };
        const newTransaction = await transactionsApi.create(transactionData);
        setTransactions(prev => [...prev, newTransaction]);
      }
    } catch (error) {
      console.error('Error adding account:', error);
      alert('Error adding account');
    }
  };

  // Transaction functions
  const handleDeposit = async (accountId: string, amount: number, description: string) => {
    try {
      const account = accounts.find(acc => acc.id === accountId);
      if (!account) return;

      const newBalance = account.balance + amount;
      
      // Update account balance
      await accountsApi.update(accountId, { ...account, balance: newBalance });
      setAccounts(prev => prev.map(acc => 
        acc.id === accountId ? { ...acc, balance: newBalance } : acc
      ));

      // Create transaction record
      const transactionData = {
        accountId,
        type: 'deposit' as const,
        amount,
        balance: newBalance,
        description,
        referenceNumber: `TXN${Date.now()}`
      };
      const newTransaction = await transactionsApi.create(transactionData);
      setTransactions(prev => [...prev, newTransaction]);

      alert('Deposit successful!');
    } catch (error) {
      console.error('Error processing deposit:', error);
      alert('Error processing deposit');
    }
  };

  const handleWithdraw = async (accountId: string, amount: number, description: string) => {
    try {
      const account = accounts.find(acc => acc.id === accountId);
      if (!account || account.balance < amount) return;

      const newBalance = account.balance - amount;
      
      // Update account balance
      await accountsApi.update(accountId, { ...account, balance: newBalance });
      setAccounts(prev => prev.map(acc => 
        acc.id === accountId ? { ...acc, balance: newBalance } : acc
      ));

      // Create transaction record
      const transactionData = {
        accountId,
        type: 'withdraw' as const,
        amount,
        balance: newBalance,
        description,
        referenceNumber: `TXN${Date.now()}`
      };
      const newTransaction = await transactionsApi.create(transactionData);
      setTransactions(prev => [...prev, newTransaction]);

      alert('Withdrawal successful!');
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('Error processing withdrawal');
    }
  };

  const handleTransfer = async (fromAccountId: string, toAccountId: string, amount: number, description: string) => {
    try {
      const fromAccount = accounts.find(acc => acc.id === fromAccountId);
      const toAccount = accounts.find(acc => acc.id === toAccountId);
      
      if (!fromAccount || !toAccount || fromAccount.balance < amount) return;

      const fromNewBalance = fromAccount.balance - amount;
      const toNewBalance = toAccount.balance + amount;
      const refNumber = `TXN${Date.now()}`;
      
      // Update both account balances
      await accountsApi.update(fromAccountId, { ...fromAccount, balance: fromNewBalance });
      await accountsApi.update(toAccountId, { ...toAccount, balance: toNewBalance });
      
      setAccounts(prev => prev.map(acc => {
        if (acc.id === fromAccountId) return { ...acc, balance: fromNewBalance };
        if (acc.id === toAccountId) return { ...acc, balance: toNewBalance };
        return acc;
      }));

      // Create transaction records for both accounts
      const fromTransactionData = {
        accountId: fromAccountId,
        type: 'transfer_out' as const,
        amount,
        balance: fromNewBalance,
        description,
        referenceNumber: refNumber,
        toAccountId
      };
      
      const toTransactionData = {
        accountId: toAccountId,
        type: 'transfer_in' as const,
        amount,
        balance: toNewBalance,
        description,
        referenceNumber: refNumber
      };

      const [fromTransaction, toTransaction] = await Promise.all([
        transactionsApi.create(fromTransactionData),
        transactionsApi.create(toTransactionData)
      ]);

      setTransactions(prev => [...prev, fromTransaction, toTransaction]);

      alert('Transfer successful!');
    } catch (error) {
      console.error('Error processing transfer:', error);
      alert('Error processing transfer');
    }
  };

  // Show home page
  if (userMode === 'home') {
    return (
      <HomePage 
        onAdminLogin={handleAdminLogin}
        onCustomerLogin={handleCustomerLogin}
      />
    );
  }

  // Show customer portal
  if (userMode === 'customer' && currentCustomer) {
    return (
      <CustomerPortal
        customer={currentCustomer}
        accounts={accounts}
        transactions={transactions}
        banks={banks}
        branches={branches}
        kycRecords={kycRecords}
        onLogout={handleLogout}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
        onTransfer={handleTransfer}
        onCheckWithdrawEligibility={checkWithdrawEligibility}
      />
    );
  }

  // Admin interface
  const tabs = [
    { id: 'banks' as ActiveTab, label: 'Manage Banks', icon: Building2, color: 'blue' },
    { id: 'branches' as ActiveTab, label: 'Manage Branches', icon: MapPin, color: 'green', disabled: banks.length === 0 },
    { id: 'customers' as ActiveTab, label: 'Customers', icon: Users, color: 'purple' },
    { id: 'kyc' as ActiveTab, label: 'Manage KYC', icon: FileCheck, color: 'orange' },
    { id: 'employees' as ActiveTab, label: 'Manage Employees', icon: UserTie, color: 'indigo' },
    { id: 'operations' as ActiveTab, label: 'Customer Operations', icon: CreditCard, color: 'teal' },
    { id: 'loans' as ActiveTab, label: 'Loan Management', icon: Banknote, color: 'rose' },
    { id: 'banking-ops' as ActiveTab, label: 'Banking Operations', icon: Shield, color: 'violet' },
    { id: 'reports' as ActiveTab, label: 'Reports', icon: FileText, color: 'emerald' }
  ];

  const getTabColorClasses = (color: string, isActive: boolean, isDisabled: boolean) => {
    if (isDisabled) {
      return 'bg-gray-100 text-gray-400 cursor-not-allowed';
    }
    
    const colorMap = {
      blue: isActive ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50',
      green: isActive ? 'bg-green-600 text-white' : 'bg-white text-green-600 hover:bg-green-50',
      purple: isActive ? 'bg-purple-600 text-white' : 'bg-white text-purple-600 hover:bg-purple-50',
      orange: isActive ? 'bg-orange-600 text-white' : 'bg-white text-orange-600 hover:bg-orange-50',
      indigo: isActive ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 hover:bg-indigo-50',
      teal: isActive ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 hover:bg-teal-50',
      rose: isActive ? 'bg-rose-600 text-white' : 'bg-white text-rose-600 hover:bg-rose-50',
      violet: isActive ? 'bg-violet-600 text-white' : 'bg-white text-violet-600 hover:bg-violet-50',
      emerald: isActive ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 hover:bg-emerald-50'
    };
    
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data from MongoDB...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Bank Management System - Admin Panel</h1>
            <p className="text-gray-600">Comprehensive banking operations management platform with MongoDB</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Shield className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isDisabled = tab.disabled;
            
            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && setActiveTab(tab.id)}
                disabled={isDisabled}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm ${getTabColorClasses(tab.color, isActive, isDisabled)}`}
                title={isDisabled ? 'Create a bank first to enable this feature' : ''}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
                {isDisabled && (
                  <span className="ml-1 text-xs bg-gray-200 text-gray-600 px-1 rounded">
                    Disabled
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto">
          {activeTab === 'banks' && (
            <ManageBank
              banks={banks}
              onAddBank={addBank}
              onUpdateBank={updateBank}
              onDeleteBank={deleteBank}
            />
          )}
          
          {activeTab === 'branches' && (
            <ManageBranch
              banks={banks}
              branches={branches}
              onAddBranch={addBranch}
              onUpdateBranch={updateBranch}
              onDeleteBranch={deleteBranch}
            />
          )}

          {activeTab === 'customers' && (
            <ManageCustomer
              customers={customers}
              onAddCustomer={addCustomer}
              onUpdateCustomer={updateCustomer}
              onDeleteCustomer={deleteCustomer}
            />
          )}

          {activeTab === 'kyc' && (
            <ManageKYC
              banks={banks}
              customers={customers}
              kycRecords={kycRecords}
              onAddKYC={addKYC}
              onUpdateKYC={updateKYC}
              onDeleteKYC={deleteKYC}
            />
          )}

          {activeTab === 'employees' && (
            <ManageEmployee
              banks={banks}
              branches={branches}
              employees={employees}
              onAddEmployee={addEmployee}
              onUpdateEmployee={updateEmployee}
              onDeleteEmployee={deleteEmployee}
            />
          )}

          {activeTab === 'operations' && (
            <Operations
              banks={banks}
              branches={branches}
              customers={customers}
              accounts={accounts}
              transactions={transactions}
              onAddAccount={addAccount}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              onTransfer={handleTransfer}
            />
          )}

          {activeTab === 'loans' && (
            <LoanManagement
              banks={banks}
              branches={branches}
              customers={customers}
              accounts={accounts}
            />
          )}

          {activeTab === 'banking-ops' && (
            <BankingOperations
              banks={banks}
              branches={branches}
              customers={customers}
              accounts={accounts}
              transactions={transactions}
            />
          )}

          {activeTab === 'reports' && (
            <ReportRequest
              banks={banks}
              branches={branches}
              customers={customers}
              accounts={accounts}
              transactions={transactions}
              onSendReportRequest={sendReportRequest}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500">Bank Management System - Enterprise Banking Operations Platform</p>
        </div>
      </div>
    </div>
  );
}

export default App;