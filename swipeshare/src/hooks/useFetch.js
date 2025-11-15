import { useState, useCallback } from 'react';
import { getAuthToken } from '../lib/token';

/**
 * useFetch Hook
 * Generic data fetching hook with loading and error states
 * 
 * Usage:
 *   const { data, isLoading, error, execute } = useFetch();
 *   await execute('GET', '/api/endpoint');
 * 
 * Returns:
 *   - data: Response data from API call
 *   - isLoading: Boolean indicating if fetch is in progress
 *   - error: Error message if fetch failed
 *   - execute: Function to execute a fetch call (method, url, body?, options?)
 */
export const useFetch = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const execute = useCallback(async (method, endpoint, body = null, options = {}) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const url = endpoint.startsWith('http')
        ? endpoint
        : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

      const fetchOptions = {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
          ...options.headers,
        },
        ...options,
      };

      if (body) {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        // Try to parse error body, but tolerate non-json
        const errorText = await response.text().catch(() => '');
        let errorData = {};
        try {
          errorData = errorText ? JSON.parse(errorText) : {};
        } catch (_) {
          errorData = { message: errorText };
        }

        throw new Error(
          errorData.error || errorData.message || `HTTP ${response.status}`
        );
      }

      // Handle 204 No Content and non-JSON responses
      if (response.status === 204) {
        setData(null);
        return null;
      }

      const text = await response.text();
      if (!text) {
        setData(null);
        return null;
      }

      try {
        const parsed = JSON.parse(text);
        setData(parsed);
        return parsed;
      } catch (err) {
        // Not JSON, return raw text
        setData(text);
        return text;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const get = useCallback((endpoint, options = {}) => {
    return execute('GET', endpoint, null, options);
  }, [execute]);

  const post = useCallback((endpoint, body, options = {}) => {
    return execute('POST', endpoint, body, options);
  }, [execute]);

  const put = useCallback((endpoint, body, options = {}) => {
    return execute('PUT', endpoint, body, options);
  }, [execute]);

  const patch = useCallback((endpoint, body, options = {}) => {
    return execute('PATCH', endpoint, body, options);
  }, [execute]);

  const del = useCallback((endpoint, options = {}) => {
    return execute('DELETE', endpoint, null, options);
  }, [execute]);

  return {
    data,
    isLoading,
    error,
    execute,
    get,
    post,
    put,
    patch,
    delete: del,
  };
};
