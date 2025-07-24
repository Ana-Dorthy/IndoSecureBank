const express = require('express');
const router = express.Router();

// Store report requests in memory (in production, use a database)
let reportRequests = [];

// POST /api/reports/request - Submit a new report request
router.post('/request', (req, res) => {
  try {
    console.log('📋 Received report request:', req.body);
    
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
    if (!reportType || !period || !requestId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: reportType, period, requestId'
      });
    }

    // Create report request record
    const reportRequest = {
      requestId,
      reportType,
      period,
      filters: filters || {},
      requestedBy: requestedBy || 'unknown',
      timestamp: timestamp || new Date().toISOString(),
      bankingSystemUrl: bankingSystemUrl || 'http://localhost:5000/api',
      status: 'queued',
      createdAt: new Date().toISOString(),
      estimatedCompletionTime: getEstimatedCompletionTime(period)
    };

    // Store the request
    reportRequests.push(reportRequest);

    console.log('✅ Report request stored:', reportRequest);

    // Send success response
    res.status(200).json({
      success: true,
      requestId: reportRequest.requestId,
      status: reportRequest.status,
      reportType: reportRequest.reportType,
      period: reportRequest.period,
      estimatedCompletionTime: reportRequest.estimatedCompletionTime,
      message: 'Report request accepted and queued for processing',
      timestamp: reportRequest.createdAt
    });

  } catch (error) {
    console.error('❌ Error processing report request:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// GET /api/reports/status/:requestId - Get status of a specific report request
router.get('/status/:requestId', (req, res) => {
  try {
    const { requestId } = req.params;
    
    const reportRequest = reportRequests.find(req => req.requestId === requestId);
    
    if (!reportRequest) {
      return res.status(404).json({
        success: false,
        error: 'Report request not found',
        requestId
      });
    }

    res.json({
      success: true,
      ...reportRequest
    });

  } catch (error) {
    console.error('❌ Error getting report status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// GET /api/reports/requests - Get all report requests
router.get('/requests', (req, res) => {
  try {
    res.json({
      success: true,
      requests: reportRequests,
      total: reportRequests.length
    });
  } catch (error) {
    console.error('❌ Error getting report requests:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Helper function to estimate completion time
function getEstimatedCompletionTime(period) {
  const now = new Date();
  let minutes = 5; // default 5 minutes
  
  switch (period) {
    case 'daily':
      minutes = 2;
      break;
    case 'weekly':
      minutes = 5;
      break;
    case 'monthly':
      minutes = 10;
      break;
    case 'quarterly':
      minutes = 15;
      break;
    case 'halfyearly':
      minutes = 20;
      break;
    case 'annually':
      minutes = 30;
      break;
  }
  
  const completionTime = new Date(now.getTime() + minutes * 60000);
  return completionTime.toISOString();
}

module.exports = router;