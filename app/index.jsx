import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { isUserLoggedIn } from '../config/supabaseConfig';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Check if the user is already authenticated and redirect accordingly
  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoading && isAuthenticated) {
        router.replace('/(tabs)/home');
      }
    };

    checkAuth();
  }, [isLoading, isAuthenticated, router]);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Welcome Image */}
      <Image
        source={require('../assets/images/landing.png')}
        className="w-full h-80 mt-16 object-contain"
      />
      
      {/* Content Container */}
      <View className="flex-1 bg-primary rounded-t-3xl px-6 pt-8 mt-6">
        <Text className="text-3xl text-white text-center font-['winky-bold'] mb-6">
          Welcome to Intellect
        </Text>
        
        <Text className="text-lg text-white text-center font-['winky'] mb-8">
          Your go-to destination for mock tests and exam preparation
        </Text>
        
        {/* Get Started Button */}
        <TouchableOpacity
          onPress={() => router.push('/(auth)/SignUp')}
          className="bg-white rounded-xl py-4 mb-4 shadow-sm"
        >
          <Text className="text-primary text-center text-lg font-['winky']">
            Get Started
          </Text>
        </TouchableOpacity>
        
        {/* Sign In Button */}
        <TouchableOpacity
          onPress={() => router.push('/(auth)/SignIn')}
          className="border border-white rounded-xl py-4 mb-4"
        >
          <Text className="text-white text-center text-lg font-['winky']">
            Already have an account?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}