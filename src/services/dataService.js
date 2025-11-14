import api from './api';
import { API_ENDPOINTS } from '../constants/api';

// Dashboard Service
export const dashboardService = {
  getStats: async () => {
    try {
      return await api.get(API_ENDPOINTS.DASHBOARD_STATS);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
};

// Leads Service
export const leadsService = {
  getAllLeads: async (status = null) => {
    try {
      const params = status ? { status } : {};
      return await api.get(API_ENDPOINTS.LEADS, { params });
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  },

  getWhatsAppLeads: async () => {
    try {
      return await api.get(API_ENDPOINTS.WHATSAPP_LEADS);
    } catch (error) {
      console.error('Error fetching WhatsApp leads:', error);
      throw error;
    }
  },

  getCallLeads: async () => {
    try {
      return await api.get(API_ENDPOINTS.CALL_LEADS);
    } catch (error) {
      console.error('Error fetching call leads:', error);
      throw error;
    }
  },

  updateLead: async (id, data) => {
    try {
      const url = API_ENDPOINTS.UPDATE_LEAD.replace(':id', id);
      return await api.put(url, data);
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  },

  closeLead: async (id) => {
    try {
      const url = API_ENDPOINTS.CLOSE_LEAD.replace(':id', id);
      return await api.post(url);
    } catch (error) {
      console.error('Error closing lead:', error);
      throw error;
    }
  },

  createManualLead: async (data) => {
    try {
      return await api.post(API_ENDPOINTS.LEADS, data);
    } catch (error) {
      console.error('Error creating manual lead:', error);
      throw error;
    }
  },
};

// Bookings Service
export const bookingsService = {
  getAllBookings: async () => {
    try {
      return await api.get(API_ENDPOINTS.BOOKINGS);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  getActiveBookings: async () => {
    try {
      return await api.get(API_ENDPOINTS.ACTIVE_BOOKINGS);
    } catch (error) {
      console.error('Error fetching active bookings:', error);
      throw error;
    }
  },

  getUpcomingBookings: async () => {
    try {
      return await api.get(API_ENDPOINTS.UPCOMING_BOOKINGS);
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
      throw error;
    }
  },

  getReturnedBookings: async () => {
    try {
      return await api.get(API_ENDPOINTS.RETURNED_BOOKINGS);
    } catch (error) {
      console.error('Error fetching returned bookings:', error);
      throw error;
    }
  },

  createBooking: async (data) => {
    try {
      return await api.post(API_ENDPOINTS.CREATE_BOOKING, data);
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  updateBooking: async (id, data) => {
    try {
      const url = API_ENDPOINTS.UPDATE_BOOKING.replace(':id', id);
      return await api.put(url, data);
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  markAsReturned: async (id) => {
    try {
      const url = API_ENDPOINTS.MARK_RETURNED.replace(':id', id);
      return await api.post(url);
    } catch (error) {
      console.error('Error marking booking as returned:', error);
      throw error;
    }
  },
};

// Bikes Service
export const bikesService = {
  getAllBikes: async () => {
    try {
      return await api.get(API_ENDPOINTS.BIKES);
    } catch (error) {
      console.error('Error fetching bikes:', error);
      throw error;
    }
  },

  createBike: async (data) => {
    try {
      return await api.post(API_ENDPOINTS.CREATE_BIKE, data);
    } catch (error) {
      console.error('Error creating bike:', error);
      throw error;
    }
  },

  updateBike: async (id, data) => {
    try {
      const url = API_ENDPOINTS.UPDATE_BIKE.replace(':id', id);
      return await api.put(url, data);
    } catch (error) {
      console.error('Error updating bike:', error);
      throw error;
    }
  },

  deleteBike: async (id) => {
    try {
      const url = API_ENDPOINTS.DELETE_BIKE.replace(':id', id);
      return await api.delete(url);
    } catch (error) {
      console.error('Error deleting bike:', error);
      throw error;
    }
  },
};
