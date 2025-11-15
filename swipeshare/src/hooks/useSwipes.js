import { useState, useCallback } from 'react';
import { getAuthToken } from '../lib/token';

/**
 * useSwipes Hook
 * Manages swipe creation, fetching, and deletion
 * centralizes all logic related to borrowing, lending or tracking meal swipes
 * 
 * Returns:
 *   - swipes: Array of user's swipes
 *   - isLoading: Boolean indicating if swipes are being fetched
 *   - error: Error message if operation failed
 *   - fetchSwipes: Fetch all swipes for current user
 *   - createSwipe: Create a new swipe transfer
 *   - deleteSwipe: Delete an existing swipe
 *   - transferSwipe: Transfer swipe to another user
 */
export const useSwipes = () => {
  const [swipes, setSwipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchSwipes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/swipes`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch swipes');
      }

      const data = await response.json();
  setSwipes(data.swipes || []);
      return data.swipes;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSwipe = useCallback(async (swipeData) => {
    setIsLoading(true);
    setError(null);
    try {
      // swipeData should include:
      // - quantity: number of swipes
      // - validUntil: expiration date
      // - location: optional redemption location (e.g. campus building, dining hall, or "online")
      // - notes: optional notes
      const response = await fetch(`${API_BASE_URL}/swipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(swipeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create swipe');
      }

  const newSwipe = await response.json();
  setSwipes(prev => [...prev, newSwipe]);
      return newSwipe;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSwipe = useCallback(async (swipeId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/swipes/${swipeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete swipe');
      }

  setSwipes(prev => prev.filter(s => s.id !== swipeId));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const transferSwipe = useCallback(async (swipeId, recipientId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/swipes/${swipeId}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ recipientId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transfer swipe');
      }

  const updatedSwipe = await response.json();
  setSwipes(prev => prev.map(s => s.id === swipeId ? updatedSwipe : s));
      return updatedSwipe;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    swipes,
    isLoading,
    error,
    fetchSwipes,
    createSwipe,
    deleteSwipe,
    transferSwipe,
  };
};
