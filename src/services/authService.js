import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const authService = {
  login: async (username, password) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      });
      return data;
    } catch {
      throw new Error("Invalid credentials");
    }
  },
};
