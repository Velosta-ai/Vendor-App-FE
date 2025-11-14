import Constants from "expo-constants";
import { Platform } from "react-native";

const getApiUrl = () => {
  // In development, use your Mac's IP
  if (__DEV__) {
    return "http://10.24.36.143:3001/api"; // your LAN IP
  }
  // In production, use your production URL
  return `${process.env.API_BASE_URL}`;
};

const API_BASE = getApiUrl();

/* ------------------------------ LEADS ------------------------------ */
export const leadsService = {
  async getLeads() {
    const res = await fetch(`${API_BASE}/leads`);
    return await res.json();
  },

  async createLead(payload) {
    const res = await fetch(`${API_BASE}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  async closeLead(id) {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "closed" }),
    });
    return await res.json();
  },
};

/* ------------------------------ BIKES ------------------------------ */
export const bikesService = {
  async getBikes() {
    const res = await fetch(`${API_BASE}/bikes`);
    return await res.json();
  },

  async getBikeById(id) {
    const res = await fetch(`${API_BASE}/bikes/${id}`);
    return await res.json();
  },

  async createBike(payload) {
    const res = await fetch(`${API_BASE}/bikes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  async updateBike(id, payload) {
    const res = await fetch(`${API_BASE}/bikes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  async updateBikeStatus(id, status) {
    const res = await fetch(`${API_BASE}/bikes/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  },
  async deleteBike(id) {
    const res = await fetch(`${API_BASE}/bikes/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  },
};

/* ------------------------------ BOOKINGS ------------------------------ */
export const bookingsService = {
  async getBookings(status = null) {
    const url = status
      ? `${API_BASE}/bookings?status=${status}`
      : `${API_BASE}/bookings`;

    const res = await fetch(url);
    return await res.json();
  },

  async getBookingById(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}`);
    return await res.json();
  },

  async createBooking(payload) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  async updateBooking(id, payload) {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  async markReturned(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}/returned`, {
      method: "PATCH",
    });
    return await res.json();
  },

  async deleteBooking(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: "DELETE",
    });
    return await res.json();
  },
};
