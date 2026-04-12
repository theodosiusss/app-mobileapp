import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function Layout() {
  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fde047' }}>
        <Stack screenOptions={{ headerShown: false,
          contentStyle: { backgroundColor: "#fde047" }
        }} />
      </SafeAreaView>
  );
}