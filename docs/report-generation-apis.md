# Banking System APIs for Report Generation System

## Base URL
```
http://localhost:5000/api
```

## Authentication
All APIs require proper authentication headers (implement as needed)

## 1. Customer Data APIs

### Get All Customers
```http
GET /customers
```
**Response:**
```json
[
  {
    "id": "customer_id",
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "address": "123 Main St, City",
    "dateOfBirth": "1990-01-15",
    "panNumber": "ABCDE1234F",
    "annualIncome": 500000,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### Get Customer by ID
```http
GET /customers/{customerId}
```

### Get Customer Accounts
```http
GET /accounts?customerId={customerId}
```
**Response:**
```json
[
  {
    "id": "account_id",
    "customerId": "customer_id",
    "bankId": "bank_id",
    "branchId": "branch_id", 
    "accountNumber": "ACC1234567890",
    "accountType": "savings",
    "balance": 25000.50,
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

## 2. Bank Data APIs

### Get All Banks
```http
GET /banks
```
**Response:**
```json
[
  {
    "id": "bank_id",
    "name": "State Bank of India",
    "code": "SBI",
    "address": "Bank Address",
    "phone": "+91-1234567890",
    "email": "info@sbi.com",
    "establishedDate": "1955-07-01",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### Get Bank by ID
```http
GET /banks/{bankId}
```

## 3. Branch Data APIs

### Get All Branches
```http
GET /branches
```

### Get Branches by Bank
```http
GET /branches?bankId={bankId}
```
**Response:**
```json
[
  {
    "id": "branch_id",
    "bankId": "bank_id",
    "name": "Main Branch",
    "code": "MB001",
    "address": "Branch Address",
    "phone": "+91-9876543210",
    "email": "mainbranch@sbi.com",
    "manager": "Manager Name",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

## 4. Account Data APIs

### Get All Accounts
```http
GET /accounts
```

### Get Accounts with Filters
```http
GET /accounts?bankId={bankId}&branchId={branchId}&customerId={customerId}&accountType={type}&status={status}
```

### Get Account by ID
```http
GET /accounts/{accountId}
```

## 5. Transaction Data APIs

### Get All Transactions
```http
GET /transactions
```

### Get Transactions with Date Range
```http
GET /transactions?from={startDate}&to={endDate}
```
**Example:**
```http
GET /transactions?from=2024-01-01&to=2024-01-31
```

### Get Transactions by Account
```http
GET /transactions?accountId={accountId}&from={startDate}&to={endDate}
```

### Get Transactions by Customer
```http
GET /transactions?customerId={customerId}&from={startDate}&to={endDate}
```
**Response:**
```json
[
  {
    "id": "txn_id",
    "accountId": "account_id",
    "type": "deposit",
    "amount": 5000.00,
    "balance": 25000.50,
    "description": "Cash Deposit",
    "referenceNumber": "TXN1234567890",
    "toAccountId": null,
    "createdAt": "2024-01-15T14:30:00Z"
  }
]
```

## 6. KYC Data APIs

### Get All KYC Records
```http
GET /kyc
```

### Get KYC by Customer
```http
GET /kyc?customerId={customerId}
```
**Response:**
```json
[
  {
    "id": "kyc_id",
    "customerId": "customer_id",
    "panNumber": "ABCDE1234F",
    "linkedBanks": ["bank_id_1", "bank_id_2"],
    "documentType": "Aadhaar",
    "documentNumber": "1234-5678-9012",
    "verificationStatus": "verified",
    "createdAt": "2024-01-10T09:00:00Z"
  }
]
```

## 7. Employee Data APIs

### Get All Employees
```http
GET /employees
```

### Get Employees by Bank/Branch
```http
GET /employees?bankId={bankId}&branchId={branchId}
```

## 8. Specialized Report APIs

### Customer Report Data
```http
GET /reports/customer-data?customerId={customerId}&from={startDate}&to={endDate}
```
**Response:**
```json
{
  "customer": {
    "id": "customer_id",
    "firstName": "John",
    "lastName": "Doe",
    "panNumber": "ABCDE1234F",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "annualIncome": 500000,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "accounts": [
    {
      "id": "account_id",
      "accountNumber": "ACC1234567890",
      "bankName": "State Bank of India",
      "branchName": "Main Branch",
      "accountType": "savings",
      "balance": 25000.50,
      "status": "active"
    }
  ],
  "transactions": [
    {
      "id": "txn_id",
      "accountNumber": "ACC1234567890",
      "type": "deposit",
      "amount": 5000.00,
      "balance": 25000.50,
      "description": "Cash Deposit",
      "referenceNumber": "TXN1234567890",
      "createdAt": "2024-01-15T14:30:00Z"
    }
  ],
  "summary": {
    "totalAccounts": 2,
    "totalBalance": 45000.50,
    "totalTransactions": 15,
    "totalDeposits": 25000.00,
    "totalWithdrawals": 5000.00
  }
}
```

### Bank Report Data
```http
GET /reports/bank-data?bankId={bankId}&from={startDate}&to={endDate}
```

### Branch Report Data  
```http
GET /reports/branch-data?branchId={branchId}&from={startDate}&to={endDate}
```

## 9. Report Generation Trigger API

### Generate Report Request
```http
POST /reports/generate
```
**Request Body:**
```json
{
  "reportType": "customer|bank|branch",
  "period": "daily|weekly|monthly|quarterly|halfyearly|annually",
  "filters": {
    "customerId": "customer_id",
    "bankId": "bank_id", 
    "branchId": "branch_id",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  },
  "format": "csv|pdf|excel",
  "requestedBy": "system|user_id",
  "requestId": "unique_request_id"
}
```

**Response:**
```json
{
  "success": true,
  "reportId": "report_12345",
  "status": "processing|completed|failed",
  "downloadUrl": "http://localhost:5000/reports/download/report_12345",
  "generatedAt": "2024-01-15T16:00:00Z",
  "recordCount": 1250,
  "fileSize": "2.5MB"
}
```

## 10. Health Check API

### System Health
```http
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-15T16:00:00Z",
  "version": "1.0.0"
}
```

## Error Responses

All APIs return consistent error format:
```json
{
  "error": true,
  "message": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T16:00:00Z"
}
```

## Rate Limiting
- **Standard APIs**: 100 requests/minute
- **Report APIs**: 10 requests/minute
- **Bulk Data APIs**: 5 requests/minute

## Data Formats
- **Dates**: ISO 8601 format (`YYYY-MM-DDTHH:mm:ssZ`)
- **Currency**: Numbers with 2 decimal places
- **Phone**: International format with country code
- **PAN**: 10-character alphanumeric (ABCDE1234F)

## Security Notes
- All APIs require authentication
- Sensitive data (account numbers, PAN) should be masked in logs
- Implement proper access controls based on user roles
- Use HTTPS in production