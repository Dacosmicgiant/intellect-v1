import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Supabase URL and anon key
const supabaseUrl = 'https://pkzvulvwjkkpipyaeafm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrenZ1bHZ3amtrcGlweWFlYWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTU5NjIsImV4cCI6MjA2MzQzMTk2Mn0.VGiacu8dK4rmB7zufFRsYb19BuxGeVo4P5tlMxENgrg';

// Custom storage implementation for Supabase auth state persistence using Expo SecureStore
const supabaseStorage = {
  getItem: async (key) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('SecureStore getItem error:', error);
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('SecureStore setItem error:', error);
    }
  },
  removeItem: async (key) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('SecureStore removeItem error:', error);
    }
  },
};

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper function to check if a user is authenticated
export const isUserLoggedIn = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { isLoggedIn: !!data?.session, session: data?.session, error };
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user, error };
};