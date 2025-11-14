// API Base URL - Update this with your backend URL
export const API_BASE_URL = 'https://api.velosta.com/api/v1';

// API Endpoints
export const API_ENDPOINTS = {
  // Dashboard
  DASHBOARD_STATS: '/vendor/dashboard/stats',
  
  // Leads
  LEADS: '/vendor/leads',
  WHATSAPP_LEADS: '/vendor/leads/whatsapp',
  CALL_LEADS: '/vendor/leads/calls',
  UPDATE_LEAD: '/vendor/leads/:id',
  CLOSE_LEAD: '/vendor/leads/:id/close',
  
  // Bookings
  BOOKINGS: '/vendor/bookings',
  ACTIVE_BOOKINGS: '/vendor/bookings/active',
  UPCOMING_BOOKINGS: '/vendor/bookings/upcoming',
  RETURNED_BOOKINGS: '/vendor/bookings/returned',
  CREATE_BOOKING: '/vendor/bookings',
  UPDATE_BOOKING: '/vendor/bookings/:id',
  MARK_RETURNED: '/vendor/bookings/:id/return',
  
  // Bikes
  BIKES: '/vendor/bikes',
  CREATE_BIKE: '/vendor/bikes',
  UPDATE_BIKE: '/vendor/bikes/:id',
  DELETE_BIKE: '/vendor/bikes/:id',
  
  // Auth
  LOGIN: '/vendor/auth/login',
  LOGOUT: '/vendor/auth/logout',
};

// Lead Status
export const LEAD_STATUS = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  CLOSED: 'closed',
};

// Lead Source
export const LEAD_SOURCE = {
  WHATSAPP: 'whatsapp',
  CALL: 'call',
  MANUAL: 'manual',
};

// Booking Status
export const BOOKING_STATUS = {
  ACTIVE: 'active',
  UPCOMING: 'upcoming',
  RETURNED: 'returned',
};

// Bike Availability
export const BIKE_AVAILABILITY = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
};
