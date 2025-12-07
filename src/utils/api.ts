import { projectId, publicAnonKey } from './supabase/info.tsx';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2ab21562`;

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// Products API
export const productsApi = {
  getAll: async () => {
    const data = await apiCall('/products');
    return data.products || [];
  },

  create: async (product: any) => {
    return await apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  update: async (id: string, updates: any) => {
    return await apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string) => {
    return await apiCall(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  bulkImport: async (products: any[]) => {
    return await apiCall('/products/bulk', {
      method: 'POST',
      body: JSON.stringify({ products }),
    });
  },

  bulkDelete: async (action: 'baby' | 'pharmaceutical' | 'purge') => {
    return await apiCall(`/products/bulk/${action}`, {
      method: 'DELETE',
    });
  },
};

// User data API
export const userApi = {
  get: async (email: string) => {
    return await apiCall(`/users/${encodeURIComponent(email)}`);
  },

  update: async (email: string, userData: any) => {
    return await apiCall(`/users/${encodeURIComponent(email)}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};
