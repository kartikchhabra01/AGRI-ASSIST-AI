/**
 * API Service
 * Handles all backend API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generic API request handler
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Auth API
 */
export const authAPI = {
  register: async (userData) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    const response = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token if login successful
    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    return request('/auth/me');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

/**
 * Advisory API
 */
export const advisoryAPI = {
  submitQuery: async (queryData) => {
    return request('/advisory/chat', {
      method: 'POST',
      body: JSON.stringify(queryData),
    });
  },

  getHistory: async () => {
    return request('/advisory/history');
  },

  getQueryById: async (id) => {
    return request(`/advisory/history/${id}`);
  },

  searchQueries: async (query) => {
    return request(`/advisory/search?q=${encodeURIComponent(query)}`);
  },
};

/**
 * Crop API
 */
export const cropAPI = {
  submitReport: async (reportData) => {
    return request('/crop/report', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  },

  getReports: async () => {
    return request('/crop/reports');
  },

  getReportById: async (id) => {
    return request(`/crop/reports/${id}`);
  },
};

/**
 * Dashboard API
 */
export const dashboardAPI = {
  getStats: async () => {
    return request('/dashboard/stats');
  },

  getUserStats: async () => {
    return request('/dashboard/user-stats');
  },
};

export default {
  authAPI,
  advisoryAPI,
  cropAPI,
  dashboardAPI,
};
