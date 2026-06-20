import { DB_NAME, migrateDbIfNeeded } from "@/lib/db";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React, { Suspense } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Kredit-Regular": require("@/assets/fonts/Kredit.otf"),
    "Kredit-Back": require("@/assets/fonts/Kredit Back.otf"),
    "Kredit-Front": require("@/assets/fonts/Kredit Front.otf"),
    "Kredit-Shine": require("@/assets/fonts/Kredit Shine.otf"),
    "PlaywriteDEGrund-Regular": require("@/assets/fonts/PlaywriteDEGrund-Regular.ttf"),
    "Domine-Regular": require("@/assets/fonts/Domine-Regular.ttf"),
    "JosefinSans-Bold": require("@/assets/fonts/JosefinSans-Bold.ttf"),
    "JosefinSans-Regular": require("@/assets/fonts/JosefinSans-Regular.ttf"),
    "JosefinSans-Medium": require("@/assets/fonts/JosefinSans-Medium.ttf"),
    "JosefinSans-SemiBold": require("@/assets/fonts/JosefinSans-SemiBold.ttf"),
    "Roboto-Regular": require("@/assets/fonts/Roboto-Regular.ttf"),
    "Oswald-Medium": require("@/assets/fonts/Oswald-Medium.ttf"),
    "BitcountSingle-Regular": require("@/assets/fonts/BitcountSingle-Regular.ttf"),
  });
  return (
    <View style={{ flex: 1 }}>
      <Suspense fallback={<ActivityIndicator size="large" />}>
        <SQLiteProvider databaseName={DB_NAME} onInit={migrateDbIfNeeded}>
          <SafeAreaProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="new" options={{ headerShown: false }} />
            </Stack>
          </SafeAreaProvider>
        </SQLiteProvider>
      </Suspense>
    </View>
  );
}
