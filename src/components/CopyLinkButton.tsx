import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

/**
 * Lazy-load expo-clipboard. If the native module isn't in the binary
 * (common when a dependency was added without rebuilding), fall back
 * to an alert that tells the user to rebuild. This keeps the dashboard
 * usable instead of taking down the whole screen.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Clipboard: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Clipboard = require('expo-clipboard');
} catch {
  Clipboard = null;
}

interface Props {
  url: string;
  label?: string;
  compact?: boolean;
}

export function CopyLinkButton({ url, label = 'Copy Public Link', compact }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(id);
  }, [copied]);

  const onPress = async () => {
    if (!Clipboard || typeof Clipboard.setStringAsync !== 'function') {
      Alert.alert(
        'Clipboard unavailable',
        'Rebuild the app to enable copying links.\n\nURL: ' + url,
      );
      return;
    }
    try {
      await Clipboard.setStringAsync(url);
      setCopied(true);
    } catch {
      Alert.alert('Copy failed', url);
    }
  };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={copied ? 'Link copied' : label}
      hitSlop={8}
      style={({ pressed }) => [
        styles.btn,
        compact && styles.compact,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons
        name={copied ? 'checkmark' : 'link-outline'}
        size={compact ? 14 : 16}
        color={copied ? theme.color.accent : theme.color.brand}
      />
      <Text
        style={[
          styles.text,
          compact && styles.compactText,
          copied && { color: theme.color.accent },
        ]}
      >
        {copied ? 'Copied' : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.xs,
    backgroundColor: 'rgba(10, 132, 255, 0.14)',
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
    borderRadius: theme.radius.md,
    alignSelf: 'flex-start',
  },
  compact: {
    paddingHorizontal: theme.space.sm,
    paddingVertical: 4,
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    color: theme.color.brand,
    fontSize: theme.font.sm,
    fontWeight: '600',
  },
  compactText: {
    fontSize: 12,
  },
});
