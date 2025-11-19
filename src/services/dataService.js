import Constants from "expo-constants";
import { Platform } from "react-native";

const getApiUrl = () => {
  // In development, use your Mac's IP
  if (__DEV__) {
    return "https://vendor-app-be.vercel.app/api"; // your LAN IP
  }
  // In production, use your production URL
  return `https://vendor-app-be.vercel.app/api`;
};

const API_BASE = getApiUrl();

// Loading manager - will be set by the app
let loadingManager = null;

export const setLoadingManager = (manager) => {
  loadingManager = manager;
};

// Helper to wrap API calls with loading
const withLoading = async (apiCall) => {
  if (loadingManager) {
    loadingManager.showLoading();
  }
  try {
    const result = await apiCall();
    return result;
  } finally {
    if (loadingManager) {
      loadingManager.hideLoading();
    }
  }
};

/* ------------------------------ LEADS ------------------------------ */
export const leadsService = {
  async getLeads() {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/leads`);
      return await res.json();
    });
  },

  async createLead(payload) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    });
  },

  async closeLead(id) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "closed" }),
      });
      return await res.json();
    });
  },
};

/* ------------------------------ BIKES ------------------------------ */
export const bikesService = {
  async getBikes() {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bikes`);
      return await res.json();
    });
  },

  async getBikeById(id) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bikes/${id}`);
      return await res.json();
    });
  },

  async createBike(payload) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bikes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    });
  },

  async updateBike(id, payload) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bikes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    });
  },

  async updateBikeStatus(id, status) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bikes/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return await res.json();
    });
  },
  async deleteBike(id) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bikes/${id}`, {
        method: "DELETE",
      });
      return await res.json();
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

      const res = await fetch(url);
      return await res.json();
    });
  },

  async getBookingById(id) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bookings/${id}`);
      return await res.json();
    });
  },

  async createBooking(payload) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    });
  },

  async updateBooking(id, payload) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    });
  },

  async markReturned(id) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bookings/${id}/returned`, {
        method: "PATCH",
      });
      return await res.json();
    });
  },

  async deleteBooking(id) {
    return withLoading(async () => {
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: "DELETE",
      });
      return await res.json();
    });
  },
};
