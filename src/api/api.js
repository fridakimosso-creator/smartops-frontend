const API_URL = "https://smartops-backend-1.onrender.com/api";

// ==========================
// 🔥 HELPER (clean response handler)
// ==========================
const request = async (url, options = {}) => {
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "API Error");
    }

    return data;

  } catch (error) {
    console.error("API ERROR:", error.message);
    throw error;
  }
};



// ==========================
// 👤 CUSTOMERS
// ==========================
export const getCustomers = () =>
  request(`${API_URL}/customers`);

export const createCustomer = (data) =>
  request(`${API_URL}/customers`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const searchCustomers = (query) =>
  request(`${API_URL}/customers?search=${query}`);



// ==========================
// 📦 ORDERS
// ==========================
export const getOrders = () =>
  request(`${API_URL}/orders`);

export const createOrder = (data) =>
  request(`${API_URL}/orders`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateOrderStatus = (id, data) =>
  request(`${API_URL}/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify(data),
  });



// ==========================
// 💰 PAYMENT SYSTEM (REAL ERP STYLE)
// ==========================
export const updateOrderPayment = (id, paid_amount) =>
  request(`${API_URL}/orders/${id}/payment`, {
    method: "PUT",
    body: JSON.stringify({ paid_amount }),
  });



// ==========================
// 🛒 SALES (POS SYSTEM)
// ==========================
export const createSale = (data) =>
  request(`${API_URL}/sales`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getSales = () =>
  request(`${API_URL}/sales`);



// ==========================
// 📊 TRANSACTIONS
// ==========================
export const getTransactions = () =>
  request(`${API_URL}/transactions`);



// ==========================
// 📈 REPORTS
// ==========================
export const getDailyRevenue = () =>
  request(`${API_URL}/reports/daily`);



// ==========================
// 📲 SMS (manual trigger optional)
// ==========================
export const sendSMS = (data) =>
  request(`${API_URL}/sms`, {
    method: "POST",
    body: JSON.stringify(data),
  });