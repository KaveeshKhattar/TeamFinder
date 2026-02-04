import axios from "axios";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const api = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

export async function get<T>(url: string): Promise<T> {
  const res = await api.get<ApiResponse<T>>(url);
  return res.data.data; // <-- normalized ONCE
}