import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function AuthIndex() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/SignIn');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading indicator while checking auth status
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#0075ff" />
    </View>
  );
}