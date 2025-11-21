// src/services/dataService.js
import Constants from "expo-constants";
import { Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const getApiUrl = () => {
  if (__DEV__) {
    // your dev LAN IP (keep as supplied)
    return "http://10.63.36.143:3001/api";
  }
  return "https://vendor-app-be.vercel.app/api";
};

const API_BASE = getApiUrl();

const AUTH_KEY = '@velosta_auth';

// JWT token storage (set after login/register)
let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

// Helper to get token from AsyncStorage if not in memory
const getAuthToken = async () => {
  if (authToken) return authToken;
  
  try {
    const authData = await AsyncStorage.getItem(AUTH_KEY);
    if (authData) {
      const { user } = JSON.parse(authData);
      if (user?.token) {
        authToken = user.token;
        return authToken;
      }
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return null;
};

// Loading Manager
let loadingManager = null;

export const setLoadingManager = (manager) => {
  loadingManager = manager;
};

const withLoading = async (apiCall, options = {}) => {
  const { skipGlobalLoader = false } = options;
  
  if (!skipGlobalLoader && loadingManager?.showLoading) {
    loadingManager.showLoading();
  }
  
  try {
    return await apiCall();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  } finally {
    if (!skipGlobalLoader && loadingManager?.hideLoading) {
      loadingManager.hideLoading();
    }
  }
};

// AUTH HEADERS
const authHeaders = async () => {
  const token = await getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/* ------------------------------ AUTH ------------------------------ */
export const authService = {
  registerOrg(payload) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/auth/register-org`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    });
  },

  joinOrg(payload) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/auth/join-org`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    });
  },

  login(payload) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    });
  },
};

/* ------------------------------ DASHBOARD ------------------------------ */
export const dashboardService = {
  getDashboard(options) {
    return withLoading(async () => {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/dashboard`, { headers });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      return data;
    }, options);
  },
};

/* ------------------------------ BIKES ------------------------------ */
export const bikesService = {
  async getBikes(options) {
    return withLoading(async () => {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/bikes`, { headers });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Server error" }));
        throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      return await res.json();
    }, options);
  },

  async getBikeAvailability(id, options) {
    return withLoading(async () => {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/bikes/${id}/availability`, { headers });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Server error" }));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        console.warn("Non-JSON availability response:", text);
        throw new Error("Invalid response from server");
      }
    }, options);
  },

  async getBikeById(id, options) {
    return withLoading(async () => {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/bikes/${id}`, { headers });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Server error" }));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      return await res.json();
    }, options);
  },

  async createBike(payload, options) {
    return withLoading(async () => {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/bikes`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      return data;
    }, options);
  },

  async updateBike(id, payload, options) {
    return withLoading(async () => {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/bikes/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      return data;
    }, options);
  },

  async updateBikeStatus(id, status, options) {
    return withLoading(async () => {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/bikes/${id}/status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      return data;
    }, options);
  },

  // NEW: toggle maintenance flag
  async toggleMaintenance(id, options) {
    return withLoading(async () => {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/bikes/${id}/maintenance`, {
        method: "PATCH",
        headers,
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Server error" }));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        console.warn("Non-JSON toggleMaintenance response:", text);
        throw new Error("Invalid response from server");
      }
    }, options);
  },

  async deleteBike(id, options) {
    return withLoading(async () => {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/bikes/${id}`, {
        method: "DELETE",
        headers,
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      return data;
    }, options);
  },
};

/* ------------------------------ BOOKINGS ------------------------------ */
export const bookingsService = {
  async getBookings(status = null, options) {
    return withLoading(async () => {
      const url = status
        ? `${API_BASE}/bookings?status=${status}`
        : `${API_BASE}/bookings`;

      const headers = await authHeaders();
      const res = await fetch(url, { headers });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      return data;
    }, options);
  },

  async getBookingById(id, options) {
    return withLoading(async () => {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/bookings/${id}`, { headers });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      return data;
    }, options);
  },

  async createBooking(payload, options) {
    return withLoading(async () => {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      return data;
    }, options);
  },

  async updateBooking(id, payload, options) {
    return withLoading(async () => {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      return data;
    }, options);
  },

  async markReturned(id, options) {
    return withLoading(async () => {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/bookings/${id}/returned`, {
        method: "PATCH",
        headers,
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      return data;
    }, options);
  },

  async deleteBooking(id, options) {
    return withLoading(async () => {
      const headers = await authHeaders();
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: "DELETE",
        headers,
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      return data;
    }, options);
  },
};
