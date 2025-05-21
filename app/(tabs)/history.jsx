import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function HistoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-6">
        <Text className="text-2xl font-['winky-bold'] mb-4">Test History</Text>
        <Text className="font-['winky'] text-gray-600">
          Your completed tests and performance results will appear here.
        </Text>
      </View>
    </SafeAreaView>
  );
}