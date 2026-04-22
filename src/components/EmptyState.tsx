import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = 'cube-outline',
  title,
  message,
  actionLabel,
  onAction,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={40} color={theme.color.textDim} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.space.xl,
    paddingVertical: theme.space.xl * 2,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.color.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.space.lg,
  },
  title: {
    color: theme.color.text,
    fontSize: theme.font.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    color: theme.color.textDim,
    fontSize: theme.font.md,
    textAlign: 'center',
    marginTop: theme.space.sm,
    maxWidth: 320,
    lineHeight: 22,
  },
  button: {
    marginTop: theme.space.xl,
    backgroundColor: theme.color.brand,
    paddingHorizontal: theme.space.xl,
    paddingVertical: theme.space.md,
    borderRadius: theme.radius.md,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: theme.color.text,
    fontSize: theme.font.md,
    fontWeight: '600',
  },
});
