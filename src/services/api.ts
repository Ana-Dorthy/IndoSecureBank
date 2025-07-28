import { SignJWT } from 'jose';

const API_BASE_URL = 'http://localhost:5000/api';

// 🔐 Load private.key and convert it into CryptoKey
async function loadPrivateKey(): Promise<CryptoKey> {
  const res = await fetch('/keys/private.key');
  const pem = await res.text();

  const pemContents = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');

  const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  return await crypto.subtle.importKey(
    'pkcs8',
    binaryDer.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
}

// 🔐 Encrypt data with RS256 using private key
async function encryptPayload(data: any): Promise<string> {
  const key = await loadPrivateKey();

  return await new SignJWT({ data })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt()
    .setExpirationTime('2m')
    .sign(key);
}

// 🌐 Generic encrypted API function for secure POST
async function encryptedPost<T>(endpoint: string, data: any): Promise<T> {
  const token = await encryptPayload(data);
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

// ✅ Generic API function for all HTTP requests
async function apiRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// 🔁 APIs using encryptedPost for sensitive POSTs
export const customersApi = {
  getAll: () => apiRequest('/customers', { method: 'GET' }),
  create: (data: any) => encryptedPost('/customers', data),
  update: (id: string, data: any) => apiRequest(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/customers/${id}`, { method: 'DELETE' }),
};

export const transactionsApi = {
  getAll: () => apiRequest('/transactions', { method: 'GET' }),
  create: (data: any) => encryptedPost('/transactions', data),
  update: (id: string, data: any) => apiRequest(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/transactions/${id}`, { method: 'DELETE' }),
};

// 🏦 Banks API
export const banksApi = {
  getAll: () => apiRequest('/banks', { method: 'GET' }),
  create: (data: any) => encryptedPost('/banks', data),
  update: (id: string, data: any) => apiRequest(`/banks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/banks/${id}`, { method: 'DELETE' }),
};

// 🏢 Branches API
export const branchesApi = {
  getAll: () => apiRequest('/branches', { method: 'GET' }),
  create: (data: any) => encryptedPost('/branches', data),
  update: (id: string, data: any) => apiRequest(`/branches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/branches/${id}`, { method: 'DELETE' }),
};

// 🔍 KYC API
export const kycApi = {
  getAll: () => apiRequest('/kyc', { method: 'GET' }),
  create: (data: any) => encryptedPost('/kyc', data),
  update: (id: string, data: any) => apiRequest(`/kyc/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/kyc/${id}`, { method: 'DELETE' }),
};

// 👩‍💼 Employees API
export const employeesApi = {
  getAll: () => apiRequest('/employees', { method: 'GET' }),
  create: (data: any) => encryptedPost('/employees', data),
  update: (id: string, data: any) => apiRequest(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/employees/${id}`, { method: 'DELETE' }),
};

// 🧾 Accounts API
export const accountsApi = {
  getAll: () => apiRequest('/accounts', { method: 'GET' }),
  create: (data: any) => encryptedPost('/accounts', data),
  update: (id: string, data: any) => apiRequest(`/accounts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/accounts/${id}`, { method: 'DELETE' }),
};
