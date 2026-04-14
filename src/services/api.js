// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to get auth token
const getAuthToken = () => {
    const token = localStorage.getItem('chronos-token');
    return token ? `Bearer ${token}` : '';
};

// Helper to handle API responses
const handleResponse = async (response) => {
    if (!response) {
        throw new Error('No response from server. Is the backend running on http://localhost:5000?');
    }

    try {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || `HTTP ${response.status}: An error occurred`);
        }
        return data;
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error('Invalid JSON response from server');
        }
        throw error;
    }
};

// API Service
const api = {
    // ============ AUTH ============
    auth: {
        register: async (userData) => {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            return handleResponse(response);
        },

        login: async (email, password) => {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            return handleResponse(response);
        },

        getMe: async () => {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: { 'Authorization': getAuthToken() }
            });
            return handleResponse(response);
        },

        updateProfile: async (data) => {
            const response = await fetch(`${API_BASE_URL}/auth/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthToken()
                },
                body: JSON.stringify(data)
            });
            return handleResponse(response);
        }
    },

    // ============ PRODUCTS ============
    products: {
        getAll: async (params = {}) => {
            try {
                const queryString = new URLSearchParams(params).toString();
                const response = await fetch(`${API_BASE_URL}/products?${queryString}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                return handleResponse(response);
            } catch (error) {
                console.error('Failed to fetch products:', error);
                throw new Error(`Products API Error: ${error.message}`);
            }
        },

        getById: async (id) => {
            try {
                const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                return handleResponse(response);
            } catch (error) {
                console.error(`Failed to fetch product ${id}:`, error);
                throw new Error(`Product API Error: ${error.message}`);
            }
        },

        getFeatured: async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/products/featured`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                return handleResponse(response);
            } catch (error) {
                console.error('Failed to fetch featured products:', error);
                throw error;
            }
        },

        getNewArrivals: async () => {
            const response = await fetch(`${API_BASE_URL}/products/new-arrivals`);
            return handleResponse(response);
        },

        getCategories: async () => {
            const response = await fetch(`${API_BASE_URL}/products/categories`);
            return handleResponse(response);
        },

        getBrands: async () => {
            const response = await fetch(`${API_BASE_URL}/products/brands`);
            return handleResponse(response);
        },

        create: async (productData) => {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthToken()
                },
                body: JSON.stringify(productData)
            });
            return handleResponse(response);
        },

        update: async (id, productData) => {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthToken()
                },
                body: JSON.stringify(productData)
            });
            return handleResponse(response);
        },

        delete: async (id) => {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': getAuthToken() }
            });
            return handleResponse(response);
        }
    },

    // ============ ORDERS ============
    orders: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                headers: { 'Authorization': getAuthToken() }
            });
            return handleResponse(response);
        },

        getMyOrders: async () => {
            const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
                headers: { 'Authorization': getAuthToken() }
            });
            return handleResponse(response);
        },

        getById: async (id) => {
            const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
                headers: { 'Authorization': getAuthToken() }
            });
            return handleResponse(response);
        },

        create: async (orderData) => {
            const headers = { 'Content-Type': 'application/json' };
            const token = getAuthToken();
            if (token) headers['Authorization'] = token;

            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers,
                body: JSON.stringify(orderData)
            });
            return handleResponse(response);
        },

        updateStatus: async (id, status) => {
            const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthToken()
                },
                body: JSON.stringify({ status })
            });
            return handleResponse(response);
        },

        delete: async (id) => {
            const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': getAuthToken() }
            });
            return handleResponse(response);
        }
    },

    // ============ CUSTOMERS ============
    customers: {
        getAll: async (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            const response = await fetch(`${API_BASE_URL}/customers?${queryString}`, {
                headers: { 'Authorization': getAuthToken() }
            });
            return handleResponse(response);
        },

        getById: async (id) => {
            const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
                headers: { 'Authorization': getAuthToken() }
            });
            return handleResponse(response);
        },

        updateStatus: async (id, status) => {
            const response = await fetch(`${API_BASE_URL}/customers/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthToken()
                },
                body: JSON.stringify({ status })
            });
            return handleResponse(response);
        },

        delete: async (id) => {
            const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': getAuthToken() }
            });
            return handleResponse(response);
        }
    },

    // ============ WISHLIST ============
    wishlist: {
        get: async () => {
            const response = await fetch(`${API_BASE_URL}/wishlist`, {
                headers: { 'Authorization': getAuthToken() }
            });
            return handleResponse(response);
        },

        add: async (productId) => {
            const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
                method: 'POST',
                headers: { 'Authorization': getAuthToken() }
            });
            return handleResponse(response);
        },

        remove: async (productId) => {
            const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': getAuthToken() }
            });
            return handleResponse(response);
        },

        toggle: async (productId) => {
            const response = await fetch(`${API_BASE_URL}/wishlist/toggle/${productId}`, {
                method: 'POST',
                headers: { 'Authorization': getAuthToken() }
            });
            return handleResponse(response);
        }
    },

    // ============ ADMIN ============
    admin: {
        getDashboard: async () => {
            const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
                headers: { 'Authorization': getAuthToken() }
            });
            return handleResponse(response);
        },

        seedProducts: async (watches) => {
            const response = await fetch(`${API_BASE_URL}/admin/seed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthToken()
                },
                body: JSON.stringify({ watches })
            });
            return handleResponse(response);
        },

        // Feature 7: Push delivery timeline stage
        pushTimeline: async (orderId, stage, note = '') => {
            const response = await fetch(`${API_BASE_URL}/orders/${orderId}/timeline`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthToken()
                },
                body: JSON.stringify({ stage, note })
            });
            return handleResponse(response);
        }
    },

    // ============ CONCIERGE (Feature 1) ============
    concierge: {
        chat: async (message, history = []) => {
            const response = await fetch(`${API_BASE_URL}/concierge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, history })
            });
            return handleResponse(response);
        },
        requestCallback: async (note = '') => {
            const response = await fetch(`${API_BASE_URL}/concierge/callback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthToken()
                },
                body: JSON.stringify({ note })
            });
            return handleResponse(response);
        }
    },

    // ============ CONFIGURATIONS (Feature 3) ============
    configurations: {
        get: async (id) => {
            const response = await fetch(`${API_BASE_URL}/configurations/${id}`);
            return handleResponse(response);
        },
        save: async (data) => {
            const response = await fetch(`${API_BASE_URL}/configurations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthToken()
                },
                body: JSON.stringify(data)
            });
            return handleResponse(response);
        }
    },

    // ============ MATCHMAKER (Feature 4) ============
    matchmaker: {
        submit: async (answers, brands = []) => {
            const response = await fetch(`${API_BASE_URL}/matchmaker`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers, brands })
            });
            return handleResponse(response);
        }
    },

    // ============ VAULT (Feature 5) ============
    vault: {
        get: async (customerId) => {
            const response = await fetch(`${API_BASE_URL}/vault/${encodeURIComponent(customerId)}`, {
                headers: { 'Authorization': getAuthToken() }
            });
            return handleResponse(response);
        }
    },

    // ============ GIFTS (Feature 8) ============
    gifts: {
        get: async (token) => {
            const response = await fetch(`${API_BASE_URL}/gifts/${token}`);
            return handleResponse(response);
        }
    }
};

export default api;

