// src/utils/api.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Define a generic interface for API response
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Default API base URL (can be modified)
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10 seconds

});

// Generic function to handle the Axios response
const handleResponse = <T>(response: AxiosResponse<T>): ApiResponse<T> => {
  return { data: response.data, error: null };
};

// Generic function to handle errors
const handleError = <T>(error: any): ApiResponse<T> => {
  let errorMessage = 'Network Error';

  if (!navigator.onLine) {
    errorMessage = 'You are offline. Please check your internet connection.';
  } else if (error.response) {
    // The server responded with a status other than 2xx
    errorMessage = error.response.data?.message || error.response.statusText;
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'No response from server';
  } else {
    // Something else happened during the request setup
    errorMessage = error.message;
  }

  return { data: null, error: errorMessage };
};

// GET request
const apiGet = async <T>(url: string, params?: { [key: string]: any } // Accept a params object
  , config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.get<T>(url, { ...config, params });
    return handleResponse(response);
  } catch (error) {
    return handleError<T>(error);
  }
};

// POST request
const apiPost = async <T, R>(
  url: string,
  body: T,
  config?: AxiosRequestConfig
): Promise<ApiResponse<R>> => {
  try {
    const response = await apiClient.post<R>(url, body, config);
    return handleResponse(response);
  } catch (error) {
    return handleError<R>(error);
  }
};

// PUT request
const apiPut = async <T, R>(
  url: string,
  body: T,
  config?: AxiosRequestConfig
): Promise<ApiResponse<R>> => {
  try {
    const response = await apiClient.put<R>(url, body, config);
    return handleResponse(response);
  } catch (error) {
    return handleError<R>(error);
  }
};

// DELETE request
const apiDelete = async <R>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<R>> => {
  try {
    const response = await apiClient.delete<R>(url, config);
    return handleResponse(response);
  } catch (error) {
    return handleError<R>(error);
  }
};

export { apiGet, apiPost, apiPut, apiDelete };
