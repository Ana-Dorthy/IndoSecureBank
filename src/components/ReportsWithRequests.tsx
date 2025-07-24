//modified by prasanna-11/07/25
import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import ReportRequest from './ReportRequest';
import { Bank, Branch, Customer, Account, Transaction, ReportResponse } from '../types';

export default function ReportsWithRequest() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportResponse, setReportResponse] = useState<ReportResponse | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const [banksRes, branchesRes, customersRes, accountsRes, transactionsRes] = await Promise.all([
        fetch('http://localhost:5000/api/banks').then(res => res.json()),
        fetch('http://localhost:5000/api/branches').then(res => res.json()),
        fetch('http://localhost:5000/api/customers').then(res => res.json()),
        fetch('http://localhost:5000/api/accounts').then(res => res.json()),
        fetch('http://localhost:5000/api/transactions').then(res => res.json())
      ]);

      setBanks(Array.isArray(banksRes) ? banksRes : []);
      setBranches(Array.isArray(branchesRes) ? branchesRes : []);
      setCustomers(Array.isArray(customersRes) ? customersRes : []);
      setAccounts(Array.isArray(accountsRes) ? accountsRes : []);
      setTransactions(Array.isArray(transactionsRes) ? transactionsRes : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReportRequest = async (reportType: string, period: string, filters: any, providedRequestId?: string) => {
    setRequestLoading(true);
    setReportResponse(null);

    try {
      let requestId = providedRequestId;
      
      if (!requestId) {
        // Generate request ID using the same structure as ReportRequest component
        const requestData = {
          reportType,
          period,
          filters
        };
        
        // Sort the object keys to ensure consistent ordering
        const sortedRequestData = JSON.stringify(requestData, Object.keys(requestData).sort());
        const requestHash = btoa(sortedRequestData).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
        requestId = `REQ_${requestHash}`;
      }

      const requestPayload = {
        requestId,
        reportType,
        period,
        filters,
        timestamp: new Date().toISOString(),
        requestedBy: 'admin@bankms.com'
      };

      console.log('Request data for hash generation:', { reportType, period, filters });
      console.log('Sending report request:', requestPayload);

      const response = await fetch('http://localhost:5000/api/reports/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      });

      const data = await response.json();
      console.log('Report response:', data);
      setReportResponse(data);
    } catch (error) {
      console.error('Error sending report request:', error);
      setReportResponse({
        success: false,
        requestId: '',
        status: 'error',
        estimatedCompletionTime: '',
        message: 'Failed to send report request. Please try again.'
      });
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReportRequest
        banks={banks}
        branches={branches}
        customers={customers}
        accounts={accounts}
        transactions={transactions}
        onSendReportRequest={handleSendReportRequest}
      />

      {/* Report Request Status */}
      {(requestLoading || reportResponse) && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Report Request Status
          </h3>
          
          {requestLoading && (
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <Loader className="h-5 w-5 text-blue-600 animate-spin" />
              <div>
                <p className="font-medium text-blue-800">Sending Report Request...</p>
                <p className="text-sm text-blue-600">Please wait while we process your request</p>
              </div>
            </div>
          )}

          {reportResponse && !requestLoading && (
            <div className={`p-4 rounded-lg ${
              reportResponse.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start space-x-3">
                {reportResponse.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${
                    reportResponse.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {reportResponse.message}
                  </p>
                  {reportResponse.success && (
                    <div className="mt-3 space-y-2 text-sm text-green-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p><strong>Request ID:</strong> {reportResponse.requestId}</p>
                          <p><strong>Status:</strong> <span className="capitalize">{reportResponse.status}</span></p>
                        </div>
                        <div>
                          <p><strong>Estimated Completion:</strong> {reportResponse.estimatedCompletionTime}</p>
                          {reportResponse.reportType && (
                            <p><strong>Report Type:</strong> <span className="capitalize">{reportResponse.reportType}</span></p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-green-100 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Next Steps:</strong> The external report generation system has received your request. 
                          You can track the progress using Request ID: <code className="bg-green-200 px-1 rounded">{reportResponse.requestId}</code>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Requests History */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Recent Report Requests
        </h3>
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No recent report requests found</p>
          <p className="text-sm">Send a report request to see it appear here</p>
        </div>
      </div>
    </div>
  );
}