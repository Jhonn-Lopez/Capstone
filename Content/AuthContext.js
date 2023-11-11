import React, { createContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext({
  isAuthenticated: false,
  authenticate: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authenticate = async (token) => {
    await SecureStore.setItemAsync('userToken', token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
