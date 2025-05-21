import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { AuthProvider } from "../context/AuthContext";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { SplashScreen } from "expo-router";
import "../global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'winky': require('./../assets/fonts/WinkyRough-Regular.ttf'),
    'winky-bold': require('./../assets/fonts/WinkyRough-Bold.ttf')
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after fonts have loaded (or if there was an error)
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Render a loading screen until fonts have loaded
  if (!fontsLoaded && !fontError) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-600 text-lg">Loading...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}