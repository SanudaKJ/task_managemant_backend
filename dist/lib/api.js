"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiFetch = apiFetch;
const tokenStore_1 = require("../cont/tokenStore");
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
async function apiFetch(endpoint, options = {}) {
    let accessToken = (0, tokenStore_1.getAccessToken)();
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            ...(options.headers || {}),
        },
    });
    // If token expired → try refresh
    if (response.status === 401) {
        const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
        });
        if (!refreshResponse.ok) {
            (0, tokenStore_1.setAccessToken)(null);
            throw new Error("Session expired");
        }
        const refreshData = await refreshResponse.json();
        (0, tokenStore_1.setAccessToken)(refreshData.accessToken);
        // Retry original request
        return apiFetch(endpoint, options);
    }
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return response.json();
}
