import { useState, useCallback } from 'react';
import { getAuthToken } from '../lib/token';

/**
 * useMatching Hook
 * Manages AI-powered matching between donors and recipients
 *
 * Notes: Matching is generic and not tied to specific dining halls — it may
 * consider optional redemption locations, timing, user priority, and proximity.
 *
 * Returns:
 *   - matches: Array of matched swipes/users
 *   - isLoading: Boolean indicating if matching is in progress
 *   - error: Error message if matching failed
 *   - getMatches: Get AI-matched swipes for current user (recipient view)
 *   - getRecipientMatches: Get AI-matched recipients for current user's swipes (donor view)
 *   - acceptMatch: Accept a matched transfer
 *   - rejectMatch: Reject a matched transfer
 */
export const useMatching = () => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const getAuthToken = () => localStorage.getItem('authToken');

  const getMatches = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
  // Get AI-matched swipes available for current recipient. Filters can be
  // generic (e.g. redeemLocation, maxDaysOld, availableOnly) rather than
  // being specific to dining halls.
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(
        `${API_BASE_URL}/matching/swipes?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get matches');
      }

  const data = await response.json();
  setMatches(data.matches || []);
      return data.matches;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRecipientMatches = useCallback(async (swipeId, filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
  // Get AI-matched recipients for a specific swipe (donor view). Filters
  // are generic and may include redeemLocation, timing constraints, or
  // priority flags.
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(
        `${API_BASE_URL}/matching/recipients/${swipeId}?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get recipient matches');
      }

      const data = await response.json();
      setMatches(data.matches || []);
      return data.matches;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acceptMatch = useCallback(async (matchId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/matching/${matchId}/accept`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to accept match');
      }

  const updatedMatch = await response.json();
  setMatches(prev => prev.map(m => m.id === matchId ? updatedMatch : m));
      return updatedMatch;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [matches]);

  const rejectMatch = useCallback(async (matchId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/matching/${matchId}/reject`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject match');
      }

  setMatches(prev => prev.filter(m => m.id !== matchId));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [matches]);

  return {
    matches,
    isLoading,
    error,
    getMatches,
    getRecipientMatches,
    acceptMatch,
    rejectMatch,
  };
};
