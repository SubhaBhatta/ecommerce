export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://fakestoreapi.com";

export const ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/products`,
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  CARTS: `${API_BASE_URL}/carts`,
};
