import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-6">
        <Text className="text-2xl font-['winky-bold'] mb-4">Explore</Text>
        <Text className="font-['winky'] text-gray-600">
          Discover certifications and courses available for enrollment.
        </Text>
      </View>
    </SafeAreaView>
  );
}