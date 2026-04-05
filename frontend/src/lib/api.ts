const BASE_URL = 'http://localhost:3000/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

export const api = {
    // Auth endpoints
    async login(data: any) {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return response.json();
    },

    async signup(data: any) {
        const response = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return response.json();
    },

    async getMe() {
        const response = await fetch(`${BASE_URL}/auth/me`, {
            method: 'GET',
            headers: getHeaders()
        });
        return response.json();
    },

    // User Profile endpoints
    async getUserProfile(userId: number) {
        const response = await fetch(`${BASE_URL}/users/${userId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        return response.json();
    },

    async updateProfile(userId: number, data: any) {
        const response = await fetch(`${BASE_URL}/users/${userId}/profile`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return response.json();
    },

    async searchUsers(params: Record<string, string>) {
        const queryParams = new URLSearchParams(params).toString();
        const response = await fetch(`${BASE_URL}/users/search?${queryParams}`, {
            method: 'GET',
            headers: getHeaders()
        });
        return response.json();
    }
};
