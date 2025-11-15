import { useState, useCallback, useEffect } from 'react';
import { getAuthToken } from '../lib/token';

/**
 * useNotifications Hook
 * Manages real-time notifications for transfers, matches, and system events
 * 
 * Returns:
 *   - notifications: Array of current notifications
 *   - isLoading: Boolean indicating if notifications are being fetched
 *   - error: Error message if operation failed
 *   - fetchNotifications: Fetch all notifications for current user
 *   - subscribeToNotifications: Subscribe to real-time notifications (WebSocket)
 *   - markAsRead: Mark a notification as read
 *   - deleteNotification: Delete a notification
 *   - unreadCount: Number of unread notifications
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wsConnection, setWsConnection] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';

  const getAuthToken = () => localStorage.getItem('authToken');

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
      return data.notifications;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const subscribeToNotifications = useCallback(() => {
    try {
      const token = getAuthToken();
      const ws = new WebSocket(`${WS_BASE_URL}/notifications?token=${token}`);

      ws.onopen = () => {
        console.log('Connected to notifications');
        setWsConnection(ws);
      };

      ws.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data);
          setNotifications(prev => [notification, ...prev]);
        } catch (err) {
          console.error('Failed to parse notification:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        setError('Connection to notifications failed');
      };

      ws.onclose = () => {
        console.log('Disconnected from notifications');
        setWsConnection(null);
      };

      return ws;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Subscribe to notifications on mount
  useEffect(() => {
    // subscribeToNotifications returns the WebSocket instance we should close on cleanup
    const ws = subscribeToNotifications();
    return () => {
      if (ws) {
        try { ws.close(); } catch (e) { /* ignore */ }
      }
    };
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications/${notificationId}/read`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [notifications]);

  const deleteNotification = useCallback(async (notificationId) => {
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications/${notificationId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    subscribeToNotifications,
    markAsRead,
    deleteNotification,
    unreadCount,
  };
};
