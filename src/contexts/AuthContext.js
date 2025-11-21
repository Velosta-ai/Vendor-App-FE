import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../services/dataService';

const AuthContext = createContext();

const AUTH_KEY = '@velosta_auth';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check authentication on app start
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('[AuthContext] Checking authentication...');
      const authData = await AsyncStorage.getItem(AUTH_KEY);
      
      if (authData) {
        const { timestamp, user: savedUser } = JSON.parse(authData);
        const now = Date.now();
        
        // Check if session is still valid (within 7 days)
        if (now - timestamp < SESSION_DURATION) {
          console.log('[AuthContext] Valid session found, restoring...');
          
          // CRITICAL: Set token FIRST before updating state
          if (savedUser.token) {
            setAuthToken(savedUser.token);
            console.log('[AuthContext] Token restored from storage');
            
            // Small delay to ensure token is set in module
            await new Promise(resolve => setTimeout(resolve, 100));
            
            setIsAuthenticated(true);
            setUser(savedUser);
          } else {
            console.warn('[AuthContext] No token found in saved user data');
            // No token means invalid session, logout
            await logout();
          }
        } else {
          // Session expired, clear storage
          console.log('[AuthContext] Session expired, logging out...');
          await logout();
        }
      } else {
        console.log('[AuthContext] No saved authentication found');
      }
    } catch (error) {
      console.error('[AuthContext] Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      console.log('[AuthContext] Logging in user...');
      const authData = {
        timestamp: Date.now(),
        user: userData,
      };
      
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      console.log('[AuthContext] Auth data saved to AsyncStorage');
      
      // CRITICAL: Set the token in dataService immediately
      if (userData.token) {
        setAuthToken(userData.token);
        console.log('[AuthContext] Token set in dataService');
      } else {
        console.warn('[AuthContext] No token in userData during login');
      }
      
      setIsAuthenticated(true);
      setUser(userData);
      console.log('[AuthContext] Login complete');
      return true;
    } catch (error) {
      console.error('[AuthContext] Error saving auth:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('[AuthContext] Logging out...');
      await AsyncStorage.removeItem(AUTH_KEY);
      setAuthToken(null); // Clear token from dataService
      setIsAuthenticated(false);
      setUser(null);
      console.log('[AuthContext] Logout complete');
    } catch (error) {
      console.error('[AuthContext] Error logging out:', error);
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      const authData = await AsyncStorage.getItem(AUTH_KEY);
      if (authData) {
        const parsed = JSON.parse(authData);
        parsed.user = updatedUser;
        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(parsed));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
