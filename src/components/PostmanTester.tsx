// import React, { useState } from 'react';
// import { Send, Copy, CheckCircle, AlertCircle, Code } from 'lucide-react';

// export default function PostmanTester() {
//   const [testResult, setTestResult] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   const samplePayload = {
//     requestId: "REQ_1752084626962",
//     reportType: "customer",
//     period: "monthly",
//     filters: {
//       bankId: "686e8b8b739665b64d8b3bcb",
//       branchId: "686e8bdd739665b64d8b3bcc",
//       startDate: "2025-07-09",
//       endDate: "2025-07-09"
//     },
//     timestamp: new Date().toISOString(),
//     requestedBy: "admin@bankms.com"
//   };

//   const testDirectRequest = async () => {
//     setLoading(true);
//     setTestResult(null);

//     try {
//       console.log('Testing direct request with payload:', samplePayload);
      
//       const response = await fetch('http://localhost:5000/api/reports/request', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         body: JSON.stringify(samplePayload)
//       });

//       const data = await response.json();
      
//       setTestResult({
//         success: response.ok,
//         status: response.status,
//         statusText: response.statusText,
//         data: data,
//         headers: Object.fromEntries(response.headers.entries())
//       });

//       console.log('Response:', {
//         status: response.status,
//         data: data
//       });

//     } catch (error) {
//       console.error('Request failed:', error);
//       setTestResult({
//         success: false,
//         error: error.message
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text);
//   };

//   const curlCommand = `curl -X POST http://localhost:5000/api/reports/request \\
//   -H "Content-Type: application/json" \\
//   -H "Accept: application/json" \\
//   -d '${JSON.stringify(samplePayload, null, 2)}'`;

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Postman Request Tester</h2>
//         <button
//           onClick={testDirectRequest}
//           disabled={loading}
//           className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
//         >
//           <Send className="h-4 w-4" />
//           {loading ? 'Testing...' : 'Test Request'}
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Request Configuration */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">Request Configuration</h3>
          
//           <div className="space-y-4">
//             <div className="bg-gray-50 rounded-lg p-4">
//               <h4 className="font-medium text-gray-700 mb-2">Method & URL</h4>
//               <div className="space-y-2 text-sm">
//                 <p><span className="font-medium">Method:</span> <code className="bg-gray-200 px-1 rounded">POST</code></p>
//                 <p><span className="font-medium">URL:</span> <code className="bg-gray-200 px-1 rounded">http://localhost:5000/api/reports/request</code></p>
//               </div>
//             </div>

//             <div className="bg-gray-50 rounded-lg p-4">
//               <h4 className="font-medium text-gray-700 mb-2">Headers</h4>
//               <div className="space-y-1 text-sm">
//                 <p><code className="bg-gray-200 px-1 rounded">Content-Type: application/json</code></p>
//                 <p><code className="bg-gray-200 px-1 rounded">Accept: application/json</code></p>
//               </div>
//             </div>

//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-center justify-between mb-2">
//                 <h4 className="font-medium text-gray-700">Request Body (JSON)</h4>
//                 <button
//                   onClick={() => copyToClipboard(JSON.stringify(samplePayload, null, 2))}
//                   className="text-gray-600 hover:text-gray-800"
//                 >
//                   <Copy className="h-4 w-4" />
//                 </button>
//               </div>
//               <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
//                 {JSON.stringify(samplePayload, null, 2)}
//               </pre>
//             </div>

//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <div className="flex items-center justify-between mb-2">
//                 <h4 className="font-medium text-blue-700">cURL Command</h4>
//                 <button
//                   onClick={() => copyToClipboard(curlCommand)}
//                   className="text-blue-600 hover:text-blue-800"
//                 >
//                   <Copy className="h-4 w-4" />
//                 </button>
//               </div>
//               <pre className="text-xs text-blue-700 bg-blue-100 p-2 rounded overflow-x-auto">
//                 {curlCommand}
//               </pre>
//             </div>
//           </div>
//         </div>

//         {/* Test Results */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">Test Results</h3>
          
//           {loading && (
//             <div className="flex items-center justify-center p-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
//             </div>
//           )}

//           {testResult && !loading && (
//             <div className={`rounded-lg p-4 ${
//               testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
//             }`}>
//               <div className="flex items-center gap-2 mb-3">
//                 {testResult.success ? (
//                   <CheckCircle className="h-5 w-5 text-green-600" />
//                 ) : (
//                   <AlertCircle className="h-5 w-5 text-red-600" />
//                 )}
//                 <h4 className={`font-medium ${
//                   testResult.success ? 'text-green-800' : 'text-red-800'
//                 }`}>
//                   {testResult.success ? 'Request Successful' : 'Request Failed'}
//                 </h4>
//               </div>

//               {testResult.status && (
//                 <p className="text-sm mb-2">
//                   <span className="font-medium">Status:</span> {testResult.status} {testResult.statusText}
//                 </p>
//               )}

//               {testResult.data && (
//                 <div className="mb-3">
//                   <h5 className="font-medium text-sm mb-1">Response Data:</h5>
//                   <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
//                     {JSON.stringify(testResult.data, null, 2)}
//                   </pre>
//                 </div>
//               )}

//               {testResult.error && (
//                 <div className="mb-3">
//                   <h5 className="font-medium text-sm mb-1 text-red-700">Error:</h5>
//                   <p className="text-sm text-red-600">{testResult.error}</p>
//                 </div>
//               )}

//               {testResult.headers && (
//                 <div>
//                   <h5 className="font-medium text-sm mb-1">Response Headers:</h5>
//                   <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
//                     {JSON.stringify(testResult.headers, null, 2)}
//                   </pre>
//                 </div>
//               )}
//             </div>
//           )}

//           {!testResult && !loading && (
//             <div className="text-center py-8 text-gray-500">
//               <Code className="h-12 w-12 mx-auto mb-3 text-gray-300" />
//               <p>Click "Test Request" to test the API endpoint</p>
//               <p className="text-sm">This will help debug Postman issues</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Troubleshooting Guide */}
//       <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
//         <h3 className="text-lg font-semibold text-yellow-800 mb-4">Troubleshooting Guide</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-yellow-700">
//           <div>
//             <h4 className="font-medium mb-2">If Postman request fails:</h4>
//             <ul className="space-y-1 list-disc list-inside">
//               <li>Check if server is running on port 5000</li>
//               <li>Verify Content-Type header is set</li>
//               <li>Ensure JSON body format is correct</li>
//               <li>Check for CORS issues</li>
//               <li>Verify server has express.json() middleware</li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="font-medium mb-2">Server debugging steps:</h4>
//             <ul className="space-y-1 list-disc list-inside">
//               <li>Add console.log in route handler</li>
//               <li>Check req.body is not empty</li>
//               <li>Verify route path matches exactly</li>
//               <li>Check middleware order</li>
//               <li>Test with cURL command above</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }