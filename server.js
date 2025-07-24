@@ .. @@
const banksRouter = require('./routes/banks');
const branchesRouter = require('./routes/branches');
const customersRouter = require('./routes/customers');
const kycRouter = require('./routes/kyc');
const employeesRouter = require('./routes/employees');
const accountsRouter = require('./routes/accounts');
const transactionsRouter = require('./routes/transactions');
+const reportsRouter = require('./routes/reports');

// Middleware
@@ .. @@
app.use('/api/employees', employeesRouter);
app.use('/api/accounts', accountsRouter);
app.use('/api/transactions', transactionsRouter);
+app.use('/api/reports', reportsRouter);

// Health check endpoint