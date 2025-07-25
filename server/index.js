//modified by prasanna-17/07/25
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const PORT = 5000;

// MongoDB connection
const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'Banking';

let db;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`Connected to MongoDB successfully - Database: ${DB_NAME}`);
    
    // List all collections to verify connection
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Root API route
app.get('/api', (req, res) => {
  res.json({
    message: 'Banking Management System API',
    version: '1.0.0',
    endpoints: {
      banks: '/api/banks',
      branches: '/api/branches', 
      customers: '/api/customers',
      kyc: '/api/kyc',
      employees: '/api/employees',
      accounts: '/api/accounts',
      transactions: '/api/transactions',
      reports: '/api/reports',
      health: '/api/health',
      check:'/check',
      transfer:'/transfer',
      settle:'/settle',
      refund:'/refund'
    }
  });
});
//check
app.post('/check', async (req, res) => {
  try {
    const { accountNumber } = req.body;

    if (!accountNumber) {
      return res.status(400).json({ valid: false, error: 'Account number is required.' });
    }

    // Step 1: Find the account
    const account = await db.collection('accounts').findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({ valid: false, error: 'Bank account not found.' });
    }

    // Step 2: Find the bank details using bankId
    const bank = await db.collection('banks').findOne({ _id: new ObjectId(account.bankId) });
  //   const bank = await db.collection('banks').findOne({
  // _id: ObjectId.isValid(account.bankId) ? new ObjectId(account.bankId) : account.bankId
  // });


    if (!bank) {
      return res.status(404).json({ valid: false, error: 'Bank information not found.' });
    }

    // Step 3: Send response with both account and bank info
    res.json({
      valid: true,
      account: {
        accountNumber: account.accountNumber,
        accountHolderName: account.accountHolderName,
        balance: account.balance,
      }// },
      // bank: {
      //   name: bank.name,
      //   code: bank.code,
      //   address: bank.address,
      //   phone: bank.phone,
      //   email: bank.email
      // }
    });

  } catch (err) {
    console.error('❌ Bank check error:', err);
    res.status(500).json({ valid: false, error: 'Internal error checking account' });
  }
});

//transfer
app.post('/transfer', async (req, res) => {
  try {
    const { fromAccountNumber, toAccountNumber, amount } = req.body;

    if (!fromAccountNumber || !toAccountNumber || !amount) {
      return res.status(400).json({ status: 'failed', message: 'Missing required fields.' });
    }

    const fromAccount = await db.collection('accounts').findOne({ accountNumber: fromAccountNumber });
    const toAccount = await db.collection('accounts').findOne({ accountNumber: toAccountNumber });

    if (!fromAccount || !toAccount) {
      return res.status(404).json({ status: 'failed', message: 'Invalid account(s).' });
    }

    if (fromAccount.balance < amount) {
      return res.status(400).json({ status: 'failed', message: 'Insufficient balance.' });
    }

    // Remove session and transactions for now
    await db.collection('accounts').updateOne(
      { accountNumber: fromAccountNumber },
      { $inc: { balance: -amount } }
    );

    await db.collection('accounts').updateOne(
      { accountNumber: toAccountNumber },
      { $inc: { balance: amount } }
    );

    res.json({
      status: 'success',
      message: 'Funds transferred successfully.',
      transactionId: `BANKTXN-${Date.now()}`
    });

  } catch (err) {
    console.error('❌ Transfer error:', err);
    res.status(500).json({ status: 'failed', message: 'Internal server error' });
  }
});

//settle to merchant
app.post('/settle', async (req, res) => {
  try {
    const { fromAccountNumber, toAccountNumber, amount } = req.body;

    if (!fromAccountNumber || !toAccountNumber || !amount) {
      return res.status(400).json({ status: 'failed', message: 'Missing required fields.' });
    }

    const fromAccount = await db.collection('accounts').findOne({ accountNumber: fromAccountNumber });
    const toAccount = await db.collection('accounts').findOne({ accountNumber: toAccountNumber });

    if (!fromAccount || !toAccount) {
      return res.status(404).json({ status: 'failed', message: 'Invalid account(s).' });
    }

    if (fromAccount.balance < amount) {
      return res.status(400).json({ status: 'failed', message: 'Insufficient balance.' });
    }

    // No session — simple balance update
    await db.collection('accounts').updateOne(
      { accountNumber: fromAccountNumber },
      { $inc: { balance: -amount } }
    );

    await db.collection('accounts').updateOne(
      { accountNumber: toAccountNumber },
      { $inc: { balance: amount } }
    );

    res.json({
      status: 'success',
      message: '✅ Amount settled to merchant successfully.',
      transactionId: `BANKTXN-${Date.now()}`
    });

  } catch (err) {
    console.error('❌ Settle error:', err);
    res.status(500).json({ status: 'failed', message: 'Internal server error during settle' });
  }
});

//refund
app.post('/refund', async (req, res) => {
  try {
    const { fromAccountNumber, toAccountNumber, amount } = req.body;

    if (!fromAccountNumber || !toAccountNumber || !amount) {
      return res.status(400).json({ status: 'failed', message: 'Missing required fields.' });
    }

    const admin = await db.collection('accounts').findOne({ accountNumber: fromAccountNumber });
    const payer = await db.collection('accounts').findOne({ accountNumber: toAccountNumber });

    if (!admin || !payer) {
      return res.status(404).json({ status: 'failed', message: 'Admin or Payer account not found.' });
    }

    if (admin.balance < amount) {
      return res.status(400).json({ status: 'failed', message: 'Admin has insufficient balance for refund.' });
    }

    await db.collection('accounts').updateOne(
      { accountNumber: fromAccountNumber },
      { $inc: { balance: -amount } }
    );

    await db.collection('accounts').updateOne(
      { accountNumber: toAccountNumber },
      { $inc: { balance: amount } }
    );

    res.json({
      status: 'success',
      message: '❌ Amount refunded to payer successfully.',
      transactionId: `BANKTXN-${Date.now()}`
    });

  } catch (err) {
    console.error('❌ Refund error:', err);
    res.status(500).json({ status: 'failed', message: 'Internal server error during refund' });
  }
});


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: db ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Helper function to convert MongoDB _id to id
const transformDocument = (doc) => {
  if (doc) {
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...rest };
  }
  return doc;
};

// Banks API Routes
app.get('/api/banks', async (req, res) => {
  try {
    const banks = await db.collection('banks').find({}).toArray();
    res.json(banks.map(transformDocument));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/banks', async (req, res) => {
  try {
    const bankData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const result = await db.collection('banks').insertOne(bankData);
    const newBank = await db.collection('banks').findOne({ _id: result.insertedId });
    res.status(201).json(transformDocument(newBank));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/banks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.createdAt;
    
    await db.collection('banks').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    const updatedBank = await db.collection('banks').findOne({ _id: new ObjectId(id) });
    res.json(transformDocument(updatedBank));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/banks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete related branches and employees
    await db.collection('branches').deleteMany({ bankId: id });
    await db.collection('employees').deleteMany({ bankId: id });
    
    await db.collection('banks').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Bank deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Branches API Routes
app.get('/api/branches', async (req, res) => {
  try {
    const branches = await db.collection('branches').find({}).toArray();
    res.json(branches.map(transformDocument));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/branches', async (req, res) => {
  try {
    const branchData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const result = await db.collection('branches').insertOne(branchData);
    const newBranch = await db.collection('branches').findOne({ _id: result.insertedId });
    res.status(201).json(transformDocument(newBranch));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/branches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.createdAt;
    
    await db.collection('branches').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    const updatedBranch = await db.collection('branches').findOne({ _id: new ObjectId(id) });
    res.json(transformDocument(updatedBranch));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/branches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete related employees
    await db.collection('employees').deleteMany({ branchId: id });
    
    await db.collection('branches').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Customers API Routes
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await db.collection('customers').find({}).toArray();
    res.json(customers.map(transformDocument));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const customerData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const result = await db.collection('customers').insertOne(customerData);
    const newCustomer = await db.collection('customers').findOne({ _id: result.insertedId });
    res.status(201).json(transformDocument(newCustomer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.createdAt;
    
    await db.collection('customers').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    const updatedCustomer = await db.collection('customers').findOne({ _id: new ObjectId(id) });
    res.json(transformDocument(updatedCustomer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete related KYC records
    await db.collection('kyc').deleteMany({ customerId: id });
    
    await db.collection('customers').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// KYC API Routes
app.get('/api/kyc', async (req, res) => {
  try {
    const kycRecords = await db.collection('kyc').find({}).toArray();
    res.json(kycRecords.map(transformDocument));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/kyc', async (req, res) => {
  try {
    const kycData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const result = await db.collection('kyc').insertOne(kycData);
    const newKYC = await db.collection('kyc').findOne({ _id: result.insertedId });
    res.status(201).json(transformDocument(newKYC));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/kyc/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.createdAt;
    
    await db.collection('kyc').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    const updatedKYC = await db.collection('kyc').findOne({ _id: new ObjectId(id) });
    res.json(transformDocument(updatedKYC));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/kyc/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('kyc').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'KYC record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Employees API Routes
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await db.collection('employees').find({}).toArray();
    res.json(employees.map(transformDocument));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const employeeData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const result = await db.collection('employees').insertOne(employeeData);
    const newEmployee = await db.collection('employees').findOne({ _id: result.insertedId });
    res.status(201).json(transformDocument(newEmployee));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.createdAt;
    
    await db.collection('employees').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    const updatedEmployee = await db.collection('employees').findOne({ _id: new ObjectId(id) });
    res.json(transformDocument(updatedEmployee));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('employees').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accounts API Routes
app.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await db.collection('accounts').find({}).toArray();
    res.json(accounts.map(transformDocument));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/accounts', async (req, res) => {
  try {
    const accountData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const result = await db.collection('accounts').insertOne(accountData);
    const newAccount = await db.collection('accounts').findOne({ _id: result.insertedId });
    res.status(201).json(transformDocument(newAccount));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.createdAt;
    
    await db.collection('accounts').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    const updatedAccount = await db.collection('accounts').findOne({ _id: new ObjectId(id) });
    res.json(transformDocument(updatedAccount));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/accounts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete related transactions
    await db.collection('transactions').deleteMany({ accountId: id });
    
    await db.collection('accounts').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transactions API Routes
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await db.collection('transactions').find({}).toArray();
    res.json(transactions.map(transformDocument));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    const result = await db.collection('transactions').insertOne(transactionData);
    const newTransaction = await db.collection('transactions').findOne({ _id: result.insertedId });
    res.status(201).json(transformDocument(newTransaction));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.createdAt;
    
    await db.collection('transactions').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    const updatedTransaction = await db.collection('transactions').findOne({ _id: new ObjectId(id) });
    res.json(transformDocument(updatedTransaction));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('transactions').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check Withdrawal Eligibility API
app.post('/api/check-withdraw-eligibility', async (req, res) => {
  try {
    const { customerId, amount } = req.body;
    
    // Get customer accounts
    const accounts = await db.collection('accounts').find({ customerId }).toArray();
    
    if (accounts.length === 0) {
      return res.json({
        eligible: false,
        message: 'No accounts found for this customer'
      });
    }
    
    // Calculate total balance across all accounts
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    
    if (totalBalance >= amount) {
      res.json({
        eligible: true,
        message: `Sufficient balance available. Total balance: ₹${totalBalance.toLocaleString()}`
      });
    } else {
      res.json({
        eligible: false,
        message: `Insufficient balance. Available: ₹${totalBalance.toLocaleString()}, Requested: ₹${amount.toLocaleString()}`
      });
    }
  } catch (error) {
    res.status(500).json({
      eligible: false,
      message: 'Error checking withdrawal eligibility'
    });
  }
});

// Generate Report API
app.post('/api/generate-report', async (req, res) => {
  try {
    const { reportType, period, filters } = req.body;
    
    let data = [];
    let filename = `${reportType}_${period}_report.csv`;
    
    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'daily':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'weekly':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarterly':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'halfyearly':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'annually':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    // Use custom date range if provided
    if (filters.startDate && filters.endDate) {
      startDate = new Date(filters.startDate);
      now.setTime(new Date(filters.endDate).getTime());
    }
    
    // Generate report based on type
    switch (reportType) {
      case 'customer':
        const customers = await db.collection('customers').find({
          createdAt: { $gte: startDate.toISOString(), $lte: now.toISOString() }
        }).toArray();
        
        data = customers.map(customer => ({
          'Customer ID': customer._id.toString(),
          'First Name': customer.firstName,
          'Last Name': customer.lastName,
          'Email': customer.email,
          'Phone': customer.phone,
          'PAN Number': customer.panNumber,
          'Annual Income': customer.annualIncome || 0,
          'Date of Birth': customer.dateOfBirth,
          'Address': customer.address,
          'Created Date': customer.createdAt
        }));
        break;
        
      case 'bank':
        const banks = await db.collection('banks').find({
          createdAt: { $gte: startDate.toISOString(), $lte: now.toISOString() }
        }).toArray();
        
        data = banks.map(bank => ({
          'Bank ID': bank._id.toString(),
          'Bank Name': bank.name,
          'Bank Code': bank.code,
          'Address': bank.address,
          'Phone': bank.phone,
          'Email': bank.email,
          'Established Date': bank.establishedDate,
          'Created Date': bank.createdAt
        }));
        break;
        
      case 'branch':
        let branchQuery = {
          createdAt: { $gte: startDate.toISOString(), $lte: now.toISOString() }
        };
        
        if (filters.bankId) {
          branchQuery.bankId = filters.bankId;
        }
        
        const branches = await db.collection('branches').find(branchQuery).toArray();
        const banksMap = {};
        const allBanks = await db.collection('banks').find({}).toArray();
        allBanks.forEach(bank => {
          banksMap[bank._id.toString()] = bank.name;
        });
        
        data = branches.map(branch => ({
          'Branch ID': branch._id.toString(),
          'Branch Name': branch.name,
          'Branch Code': branch.code,
          'Bank Name': banksMap[branch.bankId] || 'Unknown',
          'Address': branch.address,
          'Phone': branch.phone,
          'Email': branch.email,
          'Manager': branch.manager,
          'Created Date': branch.createdAt
        }));
        break;
    }
    
    // Convert to CSV
    if (data.length === 0) {
      return res.status(404).json({ error: 'No data found for the specified criteria' });
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);
    
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Error generating report' });
  }
});

// Report request endpoint (for external system integration)
app.post('/api/reports/request', async (req, res) => {
  try {
    const {
      reportType,
      period,
      filters,
      requestedBy,
      requestId,
      timestamp,
      bankingSystemUrl
    } = req.body;

    // Validate required fields
    if (!reportType || !period) {
      return res.status(400).json({
        error: 'Missing required fields: reportType and period are required'
      });
    }

    // Calculate date range for transaction data
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    // Use custom date range if provided, otherwise calculate based on period
    if (filters?.startDate && filters?.endDate) {
      startDate = new Date(filters.startDate);
      endDate = new Date(filters.endDate);
    } else {
      // Calculate date range based on period
      switch (period) {
        case 'daily':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'weekly':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'monthly':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarterly':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'halfyearly':
          startDate.setMonth(now.getMonth() - 6);
          break;
        case 'annually':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(now.getMonth() - 1); // Default to monthly
      }
      endDate = now;
    }

    // Fetch transaction data for the specified period
    console.log(`Fetching transactions from ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    const transactionQuery = {
      createdAt: {
        $gte: startDate.toISOString(),
        $lte: endDate.toISOString()
      }
    };

    const transactions = await db.collection('transactions').find(transactionQuery).toArray();
    console.log(`Found ${transactions.length} transactions in date range`);

    // Calculate transaction summary
    const transactionSummary = {
      totalTransactions: transactions.length,
      totalAmount: transactions.reduce((sum, txn) => sum + txn.amount, 0),
      depositCount: transactions.filter(t => t.type === 'deposit' || t.type === 'transfer_in').length,
      withdrawalCount: transactions.filter(t => t.type === 'withdraw' || t.type === 'transfer_out').length,
      totalDeposits: transactions
        .filter(t => t.type === 'deposit' || t.type === 'transfer_in')
        .reduce((sum, txn) => sum + txn.amount, 0),
      totalWithdrawals: transactions
        .filter(t => t.type === 'withdraw' || t.type === 'transfer_out')
        .reduce((sum, txn) => sum + txn.amount, 0),
      dateRange: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    };

    // Get additional data based on report type
    let additionalData = {};
    
    if (reportType === 'customer') {
      const customers = await db.collection('customers').find({}).toArray();
      const accounts = await db.collection('accounts').find({}).toArray();
      
      additionalData = {
        totalCustomers: customers.length,
        totalAccounts: accounts.length,
        activeAccounts: accounts.filter(acc => acc.status === 'active').length,
        totalAccountBalance: accounts.reduce((sum, acc) => sum + acc.balance, 0)
      };
    } else if (reportType === 'bank') {
      const banks = await db.collection('banks').find({}).toArray();
      const branches = await db.collection('branches').find({}).toArray();
      
      additionalData = {
        totalBanks: banks.length,
        totalBranches: branches.length,
        banksWithBranches: banks.map(bank => ({
          bankId: bank._id.toString(),
          bankName: bank.name,
          branchCount: branches.filter(b => b.bankId === bank._id.toString()).length
        }))
      };
    } else if (reportType === 'branch') {
      const branches = await db.collection('branches').find(
        filters?.bankId ? { bankId: filters.bankId } : {}
      ).toArray();
      
      additionalData = {
        totalBranches: branches.length,
        branchDetails: branches.map(branch => ({
          branchId: branch._id.toString(),
          branchName: branch.name,
          bankId: branch.bankId
        }))
      };
    }
    // Store the report request in MongoDB
    const reportRequestData = {
      requestId: requestId || `REQ_${Date.now()}`,
      reportType,
      period,
      filters: filters || {},
      transactionSummary,
      additionalData,
      requestedBy: requestedBy || 'admin',
      timestamp: timestamp || new Date().toISOString(),
      bankingSystemUrl: bankingSystemUrl || 'http://localhost:5000/api',
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedCompletionTime: getEstimatedCompletionTime(period),
      priority: getPriority(period),
      dataFetched: {
        transactionCount: transactions.length,
        dateRange: transactionSummary.dateRange,
        fetchedAt: new Date().toISOString()
      }
    };

    // Insert into MongoDB Reports collection
    console.log('Attempting to save report to MongoDB...');
    console.log('Database name:', db.databaseName);
    console.log('Report data:', reportRequestData);
    
    const result = await db.collection('reports').insertOne(reportRequestData);
    console.log('MongoDB insert result:', result);
    
    const savedReport = await db.collection('reports').findOne({ _id: result.insertedId });
    console.log('Saved report retrieved:', savedReport);
    
    const response = {
      success: true,
      requestId: savedReport.requestId,
      status: savedReport.status,
      estimatedCompletionTime: savedReport.estimatedCompletionTime,
      message: 'Report request saved and queued for processing',
      reportType,
      period,
      filters,
      mongoId: savedReport._id.toString(),
      createdAt: savedReport.createdAt,
      transactionSummary: savedReport.transactionSummary,
      additionalData: savedReport.additionalData
    };

    console.log('Report request saved to MongoDB:', savedReport);
    res.status(202).json(response);

  } catch (error) {
    console.error('Error processing report request:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Internal server error while processing report request',
      message: error.message
    });
  }
});

// Helper functions for report processing
function getEstimatedCompletionTime(period) {
  const timeMap = {
    'daily': '2 minutes',
    'weekly': '5 minutes', 
    'monthly': '10 minutes',
    'quarterly': '15 minutes',
    'halfyearly': '20 minutes',
    'annually': '30 minutes'
  };
  return timeMap[period] || '10 minutes';
}

function getPriority(period) {
  const priorityMap = {
    'daily': 'high',
    'weekly': 'high',
    'monthly': 'medium',
    'quarterly': 'medium', 
    'halfyearly': 'low',
    'annually': 'low'
  };
  return priorityMap[period] || 'medium';
}
// Create loan application
app.post('/api/loans', async (req, res) => {
  try {
    const loan = {
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const result = await db.collection('loans').insertOne(loan);
    res.status(201).json({ id: result.insertedId, ...loan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all loan applications
app.get('/api/loans', async (req, res) => {
  const { customerId } = req.query;

  try {
    const query = customerId ? { customerId } : {}; // filter if customerId provided
    const loans = await db.collection('loan_applications').find(query).toArray();
    res.status(200).json(loans);
  } catch (error) {
    console.error("Error fetching loan applications:", error);
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
});


// Update loan status
app.put('/api/loans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.collection('loans').updateOne({ _id: new ObjectId(id) }, { $set: { status } });
    res.json({ message: 'Loan status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Report status endpoint
app.get('/api/reports/status/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // Check MongoDB for the actual report status
    const report = await db.collection('reports').findOne({ requestId });
    
    if (!report) {
      return res.status(404).json({
        error: 'Report not found',
        requestId
      });
    }

    const status = {
      requestId: report.requestId,
      status: report.status,
      reportType: report.reportType,
      period: report.period,
      progress: report.status === 'completed' ? 100 : report.status === 'processing' ? 50 : 0,
      downloadUrl: report.status === 'completed' ? `http://localhost:5000/api/reports/download/${requestId}` : null,
      createdAt: report.createdAt,
      estimatedCompletionTime: report.estimatedCompletionTime,
      recordCount: report.recordCount || null,
      fileSize: report.fileSize || null,
      mongoId: report._id.toString()
    };

    res.json(status);
  } catch (error) {
    console.error('Error checking report status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all report requests
app.get('/api/reports', async (req, res) => {
  try {
    console.log('Fetching all reports from database:', db.databaseName);
    const reports = await db.collection('reports').find({}).sort({ createdAt: -1 }).toArray();
    console.log(`Found ${reports.length} reports in collection`);
    res.json(reports.map(transformDocument));
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to check database and collections
app.get('/api/debug/database', async (req, res) => {
  try {
    const dbStats = await db.stats();
    const collections = await db.listCollections().toArray();
    const reportsCount = await db.collection('reports').countDocuments();
    
    res.json({
      databaseName: db.databaseName,
      collections: collections.map(c => c.name),
      reportsCollectionCount: reportsCount,
      dbStats: {
        collections: dbStats.collections,
        objects: dbStats.objects,
        dataSize: dbStats.dataSize
      }
    });
  } catch (error) {
    console.error('Error getting database debug info:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update report status (for external system to update)
app.put('/api/reports/:requestId/status', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, recordCount, fileSize, downloadUrl } = req.body;
    
    const updateData = {
      status,
      ...(recordCount && { recordCount }),
      ...(fileSize && { fileSize }),
      ...(downloadUrl && { downloadUrl }),
      updatedAt: new Date().toISOString()
    };
    
    if (status === 'completed') {
      updateData.completedAt = new Date().toISOString();
    }
    
    await db.collection('reports').updateOne(
      { requestId },
      { $set: updateData }
    );
    
    const updatedReport = await db.collection('reports').findOne({ requestId });
    res.json(transformDocument(updatedReport));
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({ error: error.message });
  }
});
// Report download endpoint (mock)
app.get('/api/reports/download/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // Generate mock CSV content
    const csvContent = `Report ID,Generated At,Status\n${requestId},${new Date().toISOString()},Completed\n`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="report_${requestId}.csv"`);
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', async (req, res) => {
  console.log("Im fine");
});

// Generic error handler for undefined routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    method: req.method,
    path: req.path,
    message: `The endpoint ${req.method} ${req.path} does not exist`,
    availableEndpoints: [
      'GET /api',
      'GET /api/health',
      'GET,POST,PUT,DELETE /api/banks',
      'GET,POST,PUT,DELETE /api/branches',
      'GET,POST,PUT,DELETE /api/customers',
      'GET,POST,PUT,DELETE /api/kyc',
      'GET,POST,PUT,DELETE /api/employees',
      'GET,POST,PUT,DELETE /api/accounts',
      'GET,POST,PUT,DELETE /api/transactions',
      'POST /api/reports/request',
      'GET /api/reports/status/:requestId'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

// Start server
connectToMongoDB().then(() => {
 app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

});