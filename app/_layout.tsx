// app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: "PuoBBQ - Início" }}
        />
        <Stack.Screen
          name="criar-orcamento"
          options={{ title: "Criar Orçamento" }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
