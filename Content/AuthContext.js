import React, { createContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  error: null,
  authenticate: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const authenticate = async (token) => {
    setIsLoading(true);
    try {
      await SecureStore.setItemAsync('userToken', token);
      setIsAuthenticated(true);
      setError(null);
    } catch (e) {
      setError(e);
      console.error('Error storing the user token', e);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await SecureStore.deleteItemAsync('userToken');
      setIsAuthenticated(false);
      setError(null);
    } catch (e) {
      setError(e);
      console.error('Error removing the user token', e);
    }
    setIsLoading(false);
  };

  const loadToken = async () => {
    setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      setIsAuthenticated(!!token);
    } catch (e) {
      setError(e);
      console.error('Error loading the user token', e);
    }
    setIsLoading(false);
  };

  // Cargar el token al iniciar la aplicación
  React.useEffect(() => {
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, error, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
