// Utility functions for managing auth token in localStorage
// Token is stored after login/signup and removed on logout
// All other pages can call getToken() to check if user is logged in

const TOKEN_KEY = 'recoop_token';
const USER_KEY = 'recoop_user';

// save token and user to localStorage after login/signup
export const saveAuth = (token: string, user: object) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// get the stored token
export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

// get the stored user object
export const getUser = () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

// check if a user is currently logged in
export const isAuthenticated = (): boolean => {
    return !!getToken();
};

// clear token and user on logout
export const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};