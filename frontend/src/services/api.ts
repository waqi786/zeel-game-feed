import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1",
  withCredentials: true
});

export const apiOrigin = api.defaults.baseURL?.replace(/\/api\/v1\/?$/, "") ?? "";

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url ?? "";
    if (error.response?.status === 401 && (url.includes("/users/me") || url.includes("/auth/logout"))) {
      return Promise.reject(error);
    }
    const message = error.response?.data?.message ?? "Please check your connection.";
    window.dispatchEvent(new CustomEvent("zeel:toast", { detail: message }));
    return Promise.reject(error);
  }
);
