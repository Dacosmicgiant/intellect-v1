import { Text, View } from "react-native";
import "./../global.css"; // Make sure this is correctly set up for NativeWind

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-base text-black">
        Edit app/index.tsx to edit this screen.
      </Text>
    </View>
  );
}
