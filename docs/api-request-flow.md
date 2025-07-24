# API Request Flow: Banking System → Report Generation System

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    HTTP POST     ┌──────────────────────┐    HTTP GET    ┌─────────────────┐
│   Banking       │ ──────────────→  │  Report Generation   │ ─────────────→ │   Banking       │
│   System        │                  │  System              │                │   System APIs   │
│   (Frontend)    │                  │  (External Service)  │                │   (Backend)     │
└─────────────────┘                  └──────────────────────┘                └─────────────────┘
```

## 🚀 **Step-by-Step Flow**

### **Step 1: Admin Initiates Report Request**
```javascript
// User clicks "Send Report Request" in Banking System UI
const reportRequest = {
  reportType: "customer",           // customer|bank|branch
  period: "monthly",               // daily|weekly|monthly|quarterly|halfyearly|annually
  filters: {
    bankId: "bank_123",
    branchId: "branch_456", 
    startDate: "2024-01-01",
    endDate: "2024-01-31"
  },
  requestedBy: "admin",
  requestId: "REQ_1704528123456",
  timestamp: "2024-01-15T16:00:00Z",
  bankingSystemUrl: "http://localhost:5000/api"
};
```

### **Step 2: Banking System Sends Request to External System**
```javascript
// Production implementation in src/App.tsx
const sendReportRequest = async (reportType, period, filters) => {
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

    // Send to external report generation system
    const response = await fetch('http://report-generation-system.com/api/reports/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_TOKEN',
        'X-Banking-System-ID': 'your-banking-system-id'
      },
      body: JSON.stringify(reportRequest)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Report request accepted:', result);
      alert(`Report request submitted successfully! Request ID: ${result.requestId}`);
    } else {
      throw new Error('Failed to submit report request');
    }
  } catch (error) {
    console.error('Error sending report request:', error);
    alert('Failed to send report request to external system');
  }
};
```

### **Step 3: External System Receives Request**
```javascript
// External Report Generation System API endpoint
app.post('/api/reports/request', async (req, res) => {
  const {
    reportType,
    period,
    filters,
    requestedBy,
    requestId,
    timestamp,
    bankingSystemUrl
  } = req.body;

  // Validate request
  if (!reportType || !period || !bankingSystemUrl) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Store request in queue/database
  const reportJob = {
    id: requestId,
    type: reportType,
    period: period,
    filters: filters,
    status: 'queued',
    bankingSystemUrl: bankingSystemUrl,
    requestedBy: requestedBy,
    createdAt: new Date(),
    priority: getPriority(period) // daily=high, monthly=medium, etc.
  };

  await reportQueue.add(reportJob);

  res.json({
    success: true,
    requestId: requestId,
    status: 'queued',
    estimatedCompletionTime: getEstimatedTime(reportType, period),
    message: 'Report request queued for processing'
  });
});
```

### **Step 4: External System Fetches Data from Banking APIs**
```javascript
// External system worker process
const processReportRequest = async (reportJob) => {
  const { bankingSystemUrl, type, filters, period } = reportJob;
  
  try {
    // Update status to processing
    await updateReportStatus(reportJob.id, 'processing');

    let data = {};
    
    // Fetch data based on report type
    switch (type) {
      case 'customer':
        data = await fetchCustomerReportData(bankingSystemUrl, filters);
        break;
      case 'bank':
        data = await fetchBankReportData(bankingSystemUrl, filters);
        break;
      case 'branch':
        data = await fetchBranchReportData(bankingSystemUrl, filters);
        break;
    }

    // Generate report
    const reportFile = await generateReport(data, type, period, filters);
    
    // Update status to completed
    await updateReportStatus(reportJob.id, 'completed', {
      downloadUrl: reportFile.url,
      fileSize: reportFile.size,
      recordCount: data.recordCount
    });

    // Optionally notify banking system
    await notifyBankingSystem(bankingSystemUrl, reportJob.id, 'completed');

  } catch (error) {
    console.error('Report generation failed:', error);
    await updateReportStatus(reportJob.id, 'failed', { error: error.message });
  }
};

// Fetch customer data from banking system
const fetchCustomerReportData = async (bankingSystemUrl, filters) => {
  const { startDate, endDate, bankId, branchId } = filters;
  
  // Build query parameters
  const params = new URLSearchParams();
  if (startDate) params.append('from', startDate);
  if (endDate) params.append('to', endDate);
  if (bankId) params.append('bankId', bankId);
  if (branchId) params.append('branchId', branchId);

  // Fetch customers
  const customersResponse = await fetch(`${bankingSystemUrl}/customers?${params}`, {
    headers: {
      'Authorization': 'Bearer API_TOKEN',
      'Content-Type': 'application/json'
    }
  });
  const customers = await customersResponse.json();

  // Fetch accounts for each customer
  const customerData = await Promise.all(
    customers.map(async (customer) => {
      const accountsResponse = await fetch(`${bankingSystemUrl}/accounts?customerId=${customer.id}`);
      const accounts = await accountsResponse.json();
      
      const transactionsResponse = await fetch(`${bankingSystemUrl}/transactions?customerId=${customer.id}&from=${startDate}&to=${endDate}`);
      const transactions = await transactionsResponse.json();

      return {
        ...customer,
        accounts,
        transactions,
        totalBalance: accounts.reduce((sum, acc) => sum + acc.balance, 0),
        transactionCount: transactions.length
      };
    })
  );

  return {
    customers: customerData,
    recordCount: customerData.length,
    summary: {
      totalCustomers: customerData.length,
      totalAccounts: customerData.reduce((sum, c) => sum + c.accounts.length, 0),
      totalBalance: customerData.reduce((sum, c) => sum + c.totalBalance, 0)
    }
  };
};
```

### **Step 5: Report Generation and Delivery**
```javascript
// Generate CSV/PDF/Excel report
const generateReport = async (data, reportType, period, filters) => {
  const fileName = `${reportType}_${period}_${Date.now()}.csv`;
  const filePath = `/reports/${fileName}`;
  
  // Generate CSV content
  let csvContent = '';
  
  if (reportType === 'customer') {
    csvContent = generateCustomerCSV(data.customers);
  } else if (reportType === 'bank') {
    csvContent = generateBankCSV(data.banks);
  } else if (reportType === 'branch') {
    csvContent = generateBranchCSV(data.branches);
  }
  
  // Save file
  await fs.writeFile(filePath, csvContent);
  
  return {
    fileName,
    url: `http://report-system.com/download/${fileName}`,
    size: Buffer.byteLength(csvContent, 'utf8'),
    format: 'csv'
  };
};

// Generate customer CSV
const generateCustomerCSV = (customers) => {
  const headers = [
    'Customer ID',
    'First Name', 
    'Last Name',
    'Email',
    'Phone',
    'PAN Number',
    'Annual Income',
    'Account Numbers',
    'Total Balance',
    'Transaction Count',
    'Created Date'
  ];
  
  const rows = customers.map(customer => [
    customer.id,
    customer.firstName,
    customer.lastName,
    customer.email,
    customer.phone,
    customer.panNumber,
    customer.annualIncome,
    customer.accounts.map(acc => acc.accountNumber).join('; '),
    customer.totalBalance,
    customer.transactionCount,
    customer.createdAt
  ]);
  
  return [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
};
```

### **Step 6: Status Updates and Notifications**
```javascript
// Banking system can check report status
app.get('/api/reports/status/:requestId', async (req, res) => {
  const { requestId } = req.params;
  
  // Check with external system
  const statusResponse = await fetch(`http://report-system.com/api/reports/status/${requestId}`, {
    headers: { 'Authorization': 'Bearer API_TOKEN' }
  });
  
  const status = await statusResponse.json();
  res.json(status);
});

// External system can notify banking system when complete
const notifyBankingSystem = async (bankingSystemUrl, requestId, status) => {
  await fetch(`${bankingSystemUrl}/reports/notification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer API_TOKEN'
    },
    body: JSON.stringify({
      requestId,
      status,
      timestamp: new Date().toISOString()
    })
  });
};
```

## 🔧 **Configuration Requirements**

### **Environment Variables**
```bash
# Banking System
REPORT_GENERATION_API_URL=http://report-system.com/api
REPORT_GENERATION_API_TOKEN=your_api_token
BANKING_SYSTEM_ID=your_banking_system_id

# Report Generation System  
BANKING_SYSTEM_API_URL=http://localhost:5000/api
BANKING_SYSTEM_API_TOKEN=banking_api_token
```

### **API Authentication**
```javascript
// Both systems need proper authentication
const headers = {
  'Authorization': 'Bearer API_TOKEN',
  'Content-Type': 'application/json',
  'X-System-ID': 'system_identifier'
};
```

## 📊 **Data Flow Summary**

1. **Banking System** → Sends report request to external system
2. **External System** → Queues request and responds with request ID
3. **External System** → Fetches data from banking system APIs
4. **External System** → Processes data and generates report
5. **External System** → Stores report file and updates status
6. **External System** → Optionally notifies banking system of completion
7. **Banking System** → Can check status or receive notifications

## 🔒 **Security Considerations**

- Use HTTPS for all API communications
- Implement proper API authentication (JWT tokens)
- Rate limiting on both systems
- Data encryption for sensitive information
- Audit logging for all report requests
- Access control based on user roles

## 📈 **Monitoring and Logging**

- Log all report requests and their status
- Monitor API response times and failures
- Set up alerts for failed report generations
- Track report generation metrics and usage patterns