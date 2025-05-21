import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Storage adapter that works across platforms
 * - Uses SecureStore on native platforms
 * - Falls back to localStorage on web
 */
export const storageAdapter = {
  async getItem(key) {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error getting item: ${key}`, error);
      return null;
    }
  },
  
  async setItem(key, value) {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error setting item: ${key}`, error);
    }
  },
  
  async removeItem(key) {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error removing item: ${key}`, error);
    }
  },
  
  async multiRemove(keys) {
    try {
      if (Platform.OS === 'web') {
        keys.forEach(key => localStorage.removeItem(key));
        return;
      }
      
      // SecureStore doesn't have a native multiRemove, so we do it sequentially
      await Promise.all(keys.map(key => SecureStore.deleteItemAsync(key)));
    } catch (error) {
      console.error(`Error removing multiple items`, error);
    }
  },
};

export default storageAdapter;