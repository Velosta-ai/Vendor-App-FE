export const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatPhoneNumber = (phone) => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as +91 XXXXX XXXXX
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  return phone;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getTimeAgo = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds

  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
};

export const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  return diff + 1; // Include both start and end date
};

export const validatePhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('91'));
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
