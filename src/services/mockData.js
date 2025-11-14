// Mock data for development and testing

export const mockDashboardStats = {
  activeBookings: 12,
  pendingReturns: 3,
  newLeads: 8,
  totalRevenue: 145000,
};

export const mockWhatsAppLeads = [
  {
    id: '1',
    phone: '+919876543210',
    message: 'Hi, is Royal Enfield available tomorrow?',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 mins ago
    status: 'new',
    source: 'whatsapp',
  },
  {
    id: '2',
    phone: '+919876543211',
    message: 'I need a bike for 3 days. What are the rates?',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    status: 'in_progress',
    source: 'whatsapp',
  },
  {
    id: '3',
    phone: '+919876543212',
    message: 'Can I rent a Bullet for weekend?',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    status: 'new',
    source: 'whatsapp',
  },
];

export const mockCallLeads = [
  {
    id: '4',
    phone: '+919812345678',
    message: 'Missed Call',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 mins ago
    status: 'new',
    source: 'call',
  },
  {
    id: '5',
    phone: '+919812345679',
    message: 'Incoming Call',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    status: 'in_progress',
    source: 'call',
  },
];

export const mockBookings = {
  active: [
    {
      id: '1',
      customerName: 'Rahul Sharma',
      phone: '+919876543210',
      bikeName: 'Royal Enfield Classic 350',
      startDate: '2025-11-10',
      endDate: '2025-11-15',
      totalAmount: 7500,
      paidAmount: 7500,
      status: 'active',
    },
    {
      id: '2',
      customerName: 'Priya Patel',
      phone: '+919876543211',
      bikeName: 'Honda Activa 6G',
      startDate: '2025-11-12',
      endDate: '2025-11-14',
      totalAmount: 1500,
      paidAmount: 1500,
      status: 'active',
    },
  ],
  upcoming: [
    {
      id: '3',
      customerName: 'Amit Kumar',
      phone: '+919876543212',
      bikeName: 'Bajaj Pulsar 150',
      startDate: '2025-11-20',
      endDate: '2025-11-25',
      totalAmount: 5000,
      paidAmount: 2500,
      status: 'upcoming',
    },
  ],
  returned: [
    {
      id: '4',
      customerName: 'Neha Singh',
      phone: '+919876543213',
      bikeName: 'TVS Apache RTR 160',
      startDate: '2025-11-05',
      endDate: '2025-11-08',
      totalAmount: 3000,
      paidAmount: 3000,
      status: 'returned',
    },
  ],
};

export const mockBikes = [
  {
    id: '1',
    name: 'Royal Enfield Classic 350',
    registrationNumber: 'GJ01AB1234',
    dailyRate: 1500,
    availability: 'booked',
  },
  {
    id: '2',
    name: 'Honda Activa 6G',
    registrationNumber: 'GJ01CD5678',
    dailyRate: 500,
    availability: 'booked',
  },
  {
    id: '3',
    name: 'Bajaj Pulsar 150',
    registrationNumber: 'GJ01EF9012',
    dailyRate: 1000,
    availability: 'booked',
  },
  {
    id: '4',
    name: 'TVS Apache RTR 160',
    registrationNumber: 'GJ01GH3456',
    dailyRate: 1000,
    availability: 'available',
  },
  {
    id: '5',
    name: 'Yamaha FZ-S',
    registrationNumber: 'GJ01IJ7890',
    dailyRate: 1200,
    availability: 'available',
  },
];
