const API_BASE_URL = 'http://localhost:5000/api';

// Generic API function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Banks API
export const banksApi = {
  getAll: () => apiRequest('/banks'),
  create: (data: any) => apiRequest('/banks', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/banks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/banks/${id}`, {
    method: 'DELETE',
  }),
};

// Branches API
export const branchesApi = {
  getAll: () => apiRequest('/branches'),
  create: (data: any) => apiRequest('/branches', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/branches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/branches/${id}`, {
    method: 'DELETE',
  }),
};

// Customers API
export const customersApi = {
  getAll: () => apiRequest('/customers'),
  create: (data: any) => apiRequest('/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/customers/${id}`, {
    method: 'DELETE',
  }),
};

// KYC API
export const kycApi = {
  getAll: () => apiRequest('/kyc'),
  create: (data: any) => apiRequest('/kyc', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/kyc/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/kyc/${id}`, {
    method: 'DELETE',
  }),
};

// Employees API
export const employeesApi = {
  getAll: () => apiRequest('/employees'),
  create: (data: any) => apiRequest('/employees', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/employees/${id}`, {
    method: 'DELETE',
  }),
};

// Accounts API
export const accountsApi = {
  getAll: () => apiRequest('/accounts'),
  create: (data: any) => apiRequest('/accounts', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/accounts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/accounts/${id}`, {
    method: 'DELETE',
  }),
};

// Transactions API
export const transactionsApi = {
  getAll: () => apiRequest('/transactions'),
  create: (data: any) => apiRequest('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/transactions/${id}`, {
    method: 'DELETE',
  }),
};

