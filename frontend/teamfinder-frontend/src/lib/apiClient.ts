// import axios from "axios";

// export interface ApiResponse<T> {
//   success: boolean;
//   data: T;
//   message?: string;
// }

// const api = axios.create({
//   baseURL: "/api",
//   timeout: 5000,
// });

// export async function get<T>(url: string): Promise<T> {
//   const res = await api.get<ApiResponse<T>>(url);
//   return res.data.data; // <-- normalized ONCE
// }

import axios, { AxiosRequestConfig } from "axios";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const api = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

async function request<T>(
  method: HttpMethod,
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await api.request<ApiResponse<T>>({
    method,
    url,
    data,
    ...config,
  });
  return res.data.data; // normalize ONCE here
}

export function get<T>(url: string, config?: AxiosRequestConfig) {
  return request<T>("get", url, undefined, config);
}

export function post<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
) {
  return request<T>("post", url, body, config);
}

export function put<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
) {
  return request<T>("put", url, body, config);
}

export function del<T>(
  url: string,
  config?: AxiosRequestConfig
) {
  return request<T>("delete", url, undefined, config);
}