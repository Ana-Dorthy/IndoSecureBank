# Postman Setup Instructions

## The Problem
You're getting 404 because:
1. You're using **GET** method instead of **POST**
2. The `/api/reports/request` endpoint only accepts POST requests

## Solution

### 1. Change Method to POST
- In Postman, change the dropdown from `GET` to `POST`

### 2. Correct URL
```
POST http://localhost:5000/api/reports/request
```

### 3. Add Headers
Go to the **Headers** tab and add:
```
Content-Type: application/json
Authorization: Bearer demo-token
X-Banking-System-ID: banking-system-001
```

### 4. Add Request Body
Go to the **Body** tab:
- Select **raw**
- Choose **JSON** from the dropdown
- Add this JSON:

```json
{
  "reportType": "customer",
  "period": "daily",
  "filters": {
    "bankId": "",
    "branchId": "",
    "startDate": "2025-01-09",
    "endDate": "2025-01-09"
  },
  "requestedBy": "admin",
  "requestId": "REQ_1752078247210",
  "timestamp": "2025-01-09T16:25:47.210Z",
  "bankingSystemUrl": "http://localhost:5000/api"
}
```

## Available Endpoints

### GET Endpoints (for testing data):
- `GET http://localhost:5000/api/customers`
- `GET http://localhost:5000/api/banks`
- `GET http://localhost:5000/api/branches`
- `GET http://localhost:5000/api/accounts`
- `GET http://localhost:5000/api/transactions`

### POST Endpoint (for report requests):
- `POST http://localhost:5000/api/reports/request`

## Expected Response
When you use POST correctly, you should get:
```json
{
  "success": true,
  "requestId": "REQ_1752078247210",
  "status": "queued",
  "reportType": "customer",
  "period": "daily",
  "message": "Report request accepted"
}
```