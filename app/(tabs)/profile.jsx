import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/SignIn');
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="p-6">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-['winky-bold']">Profile</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#0075ff" />
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-xl p-6 shadow-sm mt-6">
          <View className="items-center mb-4">
            <View className="w-20 h-20 rounded-full bg-gray-200 items-center justify-center mb-2">
              <Ionicons name="person" size={36} color="#666" />
            </View>
            <Text className="text-xl font-['winky-bold']">
              {user?.user_metadata?.name || 'User'}
            </Text>
            <Text className="text-gray-500 font-['winky']">
              {user?.email}
            </Text>
          </View>

          <View className="bg-gray-100 p-4 rounded-lg mt-4">
            <Text className="font-['winky'] text-gray-700">
              Account Information:
            </Text>
            <Text className="font-['winky'] text-gray-500 mt-2">
              • Subscription: {user?.profile?.subscription_status || 'Free'}
            </Text>
            <Text className="font-['winky'] text-gray-500 mt-1">
              • Tests Remaining: {user?.profile?.tests_remaining || 0}
            </Text>
            {user?.profile?.is_admin && (
              <Text className="font-['winky'] text-primary mt-1">
                • Admin Access: Yes
              </Text>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}