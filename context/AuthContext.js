import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, isUserLoggedIn, getCurrentUser } from '../config/supabaseConfig';
import storageAdapter from '../utils/storageAdapter';

// Create the authentication context
export const AuthContext = createContext({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updateUserProfile: async () => {},
  refreshUser: async () => {},
});

// Create the authentication provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for existing session
        const { isLoggedIn, session, error } = await isUserLoggedIn();
        
        if (error) {
          console.error('Error checking auth state:', error);
        }
        
        if (isLoggedIn && session) {
          setSession(session);
          
          // Fetch user profile
          const { user, error: userError } = await getCurrentUser();
          if (userError) {
            console.error('Error fetching user:', userError);
          }
          
          if (user) {
            // Get additional user data from Supabase 'profiles' table
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();
              
            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Error fetching profile:', profileError);
            }
            
            // Combine auth data with profile data
            setUser({ ...user, profile: profileData || {} });
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setIsLoading(true);
          
          // Fetch user and profile data
          if (session?.user) {
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (profileError && profileError.code !== 'PGRST116') {
                console.error('Error fetching profile on auth change:', profileError);
              }
              
              setUser({ ...session.user, profile: profileData || {} });
            } catch (err) {
              console.error('Error handling auth state change:', err);
            }
          }
          
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    // Cleanup subscription on unmount
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);
  
  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true, data };
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign up with email and password
  const signUp = async (email, password, userData = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      // If signup successful, create a profile record
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id,
              name: userData.name || '',
              email: email.toLowerCase(),
              is_admin: false,
              subscription_status: 'free',
              tests_remaining: 3,
              subscription_expiry: null,
              enrolled_certifications: [],
              created_at: new Date(),
            },
          ]);
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
          // We don't throw here as the auth account was created successfully
        }
      }
      
      return { success: true, data };
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setSession(null);
      
      // Clear any stored tokens or data
      await storageAdapter.multiRemove([
        'supabase.auth.token',
        'userData',
        // Add other keys as needed
      ]);
      
      return { success: true };
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset password
  const resetPassword = async (email) => {
    try {
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'intellectv1://reset-password',
      });
      
      if (error) {
        throw error;
      }
      
      return { success: true };
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err);
      return { success: false, error: err };
    }
  };
  
  // Update user profile
  const updateUserProfile = async (profileData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }
      
      // Update auth metadata if name is provided
      if (profileData.name) {
        const { error: authUpdateError } = await supabase.auth.updateUser({
          data: { name: profileData.name },
        });
        
        if (authUpdateError) {
          console.error('Error updating auth metadata:', authUpdateError);
        }
      }
      
      // Update profile in the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Refresh user data
      await refreshUser();
      
      return { success: true, data };
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Refresh user data
  const refreshUser = async () => {
    try {
      if (!user || !user.id) {
        return { success: false, error: 'User not authenticated' };
      }
      
      // Get latest user data from auth
      const { user: authUser, error: authError } = await getCurrentUser();
      
      if (authError) {
        throw authError;
      }
      
      if (authUser) {
        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error refreshing profile:', profileError);
        }
        
        // Update user state
        setUser({ ...authUser, profile: profileData || {} });
        
        return { success: true, user: { ...authUser, profile: profileData || {} } };
      }
      
      return { success: false, error: 'User not found' };
    } catch (err) {
      console.error('Refresh user error:', err);
      return { success: false, error: err };
    }
  };
  
  // Memoize the auth value to prevent unnecessary re-renders
  const authValue = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUserProfile,
    refreshUser,
  };
  
  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export named components and hooks
export default {
  AuthProvider,
  AuthContext,
  useAuth,
};