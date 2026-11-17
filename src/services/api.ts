// Frontend API client communicating with backend /api endpoints

const API_BASE = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // sends cookies
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const authAPI = {
  registerCustomer: (payload: any) => 
    request<any>('/auth/register-customer', { method: 'POST', body: JSON.stringify(payload) }),

  registerHelper: (payload: any) => 
    request<any>('/auth/register-helper', { method: 'POST', body: JSON.stringify(payload) }),

  login: (payload: { identifier?: string; phone?: string; email?: string; password?: string }) => 
    request<any>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

  logout: () => 
    request<any>('/auth/logout', { method: 'POST' }),

  getMe: () => 
    request<any>('/auth/me', { method: 'GET' }),
};

export const helpersAPI = {
  search: (params?: { category?: string; pincode?: string; search?: string; sortBy?: string; lat?: number; lng?: number }) => {
    const q = new URLSearchParams();
    if (params?.category) q.append('category', params.category);
    if (params?.pincode) q.append('pincode', params.pincode);
    if (params?.search) q.append('search', params.search);
    if (params?.sortBy) q.append('sortBy', params.sortBy);
    if (params?.lat !== undefined) q.append('lat', params.lat.toString());
    if (params?.lng !== undefined) q.append('lng', params.lng.toString());
    return request<any>(`/helpers?${q.toString()}`, { method: 'GET' });
  },

  getById: (id: string) => 
    request<any>(`/helpers/${id}`, { method: 'GET' }),

  updateProfile: (id: string, payload: any) => 
    request<any>(`/helpers/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
};

export const bookingsAPI = {
  create: (payload: any) => 
    request<any>('/bookings', { method: 'POST', body: JSON.stringify(payload) }),

  getAll: (params?: { helperId?: string; customerPhone?: string; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.helperId) q.append('helperId', params.helperId);
    if (params?.customerPhone) q.append('customerPhone', params.customerPhone);
    if (params?.status) q.append('status', params.status);
    return request<any>(`/bookings?${q.toString()}`, { method: 'GET' });
  },

  getById: (id: string) => 
    request<any>(`/bookings/${id}`, { method: 'GET' }),

  updateStatus: (id: string, status: string, notes?: string, finalPrice?: number, cancellationReason?: string) => 
    request<any>(`/bookings/${id}/status`, { 
      method: 'PATCH', 
      body: JSON.stringify({ status, notes, finalPrice, cancellationReason }) 
    }),
};

export const adminAPI = {
  getStats: () => 
    request<any>('/admin/stats', { method: 'GET' }),

  getHelpers: () => 
    request<any>('/admin/helpers', { method: 'GET' }),

  getCustomers: () => 
    request<any>('/admin/customers', { method: 'GET' }),

  toggleHelperActive: (id: string) => 
    request<any>(`/admin/helpers/${id}/toggle`, { method: 'PATCH' }),

  resetDemo: () => 
    request<any>('/admin/reset', { method: 'POST' }),
};
