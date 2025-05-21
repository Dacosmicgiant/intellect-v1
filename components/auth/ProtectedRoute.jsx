import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import Colors from '../../constants/Colors';

// Component to protect routes that require authentication
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // If not loading and not authenticated, redirect to sign in
    if (!loading && !isAuthenticated) {
      router.replace('/auth/SignIn');
    }
    
    // If admin is required but user is not admin, redirect to home
    if (!loading && isAuthenticated && requireAdmin && !isAdmin) {
      router.replace('/(tabs)/home');
    }
  }, [loading, isAuthenticated, requireAdmin, isAdmin, router]);
  
  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }
  
  // If authenticated and meets admin requirement (if any), render children
  if (isAuthenticated && (!requireAdmin || isAdmin)) {
    return children;
  }
  
  // Return null while redirecting
  return null;
}

// AdminRoute component that extends ProtectedRoute with admin requirement
export function AdminRoute({ children }) {
  return <ProtectedRoute requireAdmin={true}>{children}</ProtectedRoute>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});