// Small helper to centralize auth token access.
// Use this everywhere so storage strategy can change later (e.g. httpOnly cookies).
export const getAuthToken = () => {
  try {
    return localStorage.getItem('authToken');
  } catch (e) {
    console.warn('Could not read auth token from storage', e);
    return null;
  }
};

export const setAuthToken = (token) => {
  try {
    localStorage.setItem('authToken', token);
  } catch (e) {
    console.warn('Could not write auth token to storage', e);
  }
};

export const removeAuthToken = () => {
  try {
    localStorage.removeItem('authToken');
  } catch (e) {
    console.warn('Could not remove auth token from storage', e);
  }
};

export default {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
};
