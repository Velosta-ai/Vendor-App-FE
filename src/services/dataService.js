// src/services/dataService.js
import Constants from "expo-constants";
import { Platform } from "react-native";

const getApiUrl = () => {
  if (__DEV__) {
    // your dev LAN IP (keep as supplied)
    return "http://10.63.36.143:3001/api";
  }
  return "https://vendor-app-be.vercel.app/api";
};

const API_BASE = getApiUrl();

// JWT token storage (set after login/register)
let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

// Loading Manager
let loadingManager = null;

export const setLoadingManager = (manager) => {
  loadingManager = manager;
};

const withLoading = async (apiCall) => {
  if (loadingManager?.showLoading) loadingManager.showLoading();
  try {
    return await apiCall();
  } finally {
    if (loadingManager?.hideLoading) loadingManager.hideLoading();
  }
};

// AUTH HEADERS
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${authToken}`,
});

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
  getDashboard() {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/dashboard`, {
        headers: authHeaders(),
      });
      return await res.json();
    });
  },
};

/* ------------------------------ BIKES ------------------------------ */
export const bikesService = {
  async getBikes() {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bikes`, { headers: authHeaders() });
      return await res.json();
    });
  },

  async getBikeAvailability(id) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bikes/${id}/availability`, {
        headers: authHeaders(),
      });
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        console.warn("Non-JSON availability response:", text);
        throw new Error("Invalid response from server");
      }
    });
  },

  async getBikeById(id) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bikes/${id}`, {
        headers: authHeaders(),
      });
      return await res.json();
    });
  },

  async createBike(payload) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bikes`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      return await res.json();
    });
  },

  async updateBike(id, payload) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bikes/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      return await res.json();
    });
  },

  async updateBikeStatus(id, status) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bikes/${id}/status`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status }),
      });
      return await res.json();
    });
  },

  // NEW: toggle maintenance flag
  async toggleMaintenance(id) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bikes/${id}/maintenance`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        console.warn("Non-JSON toggleMaintenance response:", text);
        throw new Error("Invalid response from server");
      }
    });
  },
};

/* ------------------------------ BOOKINGS ------------------------------ */
export const bookingsService = {
  async getBookings(status = null) {
    return withLoading(async () => {
      const url = status
        ? `${API_BASE}/bookings?status=${status}`
        : `${API_BASE}/bookings`;

      const res = await fetch(url, { headers: authHeaders() });
      return await res.json();
    });
  },

  async getBookingById(id) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        headers: authHeaders(),
      });
      return await res.json();
    });
  },

  async createBooking(payload) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      return await res.json();
    });
  },

  async updateBooking(id, payload) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      return await res.json();
    });
  },

  async markReturned(id) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bookings/${id}/returned`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      return await res.json();
    });
  },

  async deleteBooking(id) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      return await res.json();
    });
  },
};
