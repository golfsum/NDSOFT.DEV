import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useCredentialsStore } from '@/store/credentials';
import { bootstrapIap } from '@/iap/storekit';

export default function RootLayout() {
  const scheme = useColorScheme();
  const hydrateCreds = useCredentialsStore((s) => s.hydrate);

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              // Don't retry auth or permission errors — user must act.
              const code = (error as { code?: string } | null)?.code;
              if (code === 'UNAUTHORIZED' || code === 'FORBIDDEN') return false;
              return failureCount < 2;
            },
            refetchOnReconnect: true,
          },
        },
      }),
    [],
  );

  useEffect(() => {
    hydrateCreds();
    bootstrapIap();
  }, [hydrateCreds]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style={scheme === 'light' ? 'dark' : 'light'} />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#0B0B0F' },
            headerTintColor: '#F2F2F7',
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: '#0B0B0F' },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Build Tracker' }} />
          <Stack.Screen name="app/[appId]" options={{ title: '' }} />
          <Stack.Screen name="settings" options={{ title: 'Settings' }} />
          <Stack.Screen
            name="paywall"
            options={{ presentation: 'modal', title: 'Unlock' }}
          />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
