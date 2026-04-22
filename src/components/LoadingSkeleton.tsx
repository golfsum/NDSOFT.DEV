import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { theme } from '../theme';

function useShimmer() {
  const value = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, { toValue: 0.9, duration: 700, useNativeDriver: true }),
        Animated.timing(value, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [value]);
  return value;
}

function Row({ widthPct }: { widthPct: number }) {
  const opacity = useShimmer();
  return (
    <Animated.View
      style={[
        styles.row,
        { width: `${widthPct}%`, opacity },
      ]}
    />
  );
}

export function LoadingSkeleton() {
  return (
    <View>
      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.card}>
          <View style={styles.header}>
            <View style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Row widthPct={60} />
              <View style={{ height: theme.space.sm }} />
              <Row widthPct={40} />
            </View>
          </View>
          <View style={{ height: theme.space.lg }} />
          <Row widthPct={85} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.card,
    borderRadius: theme.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.color.border,
    padding: theme.space.lg,
    marginBottom: theme.space.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: '#2A2A36',
  },
  row: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2A2A36',
  },
});
