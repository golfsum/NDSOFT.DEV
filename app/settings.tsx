import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pingApps } from '@/api/endpoints/apps';
import type { AscApiError } from '@/api/asc-client';
import { restorePurchases } from '@/iap/storekit';
import { useCredentialsStore, type Credentials } from '@/store/credentials';
import { useEntitlement } from '@/hooks/useEntitlement';
import { useEntitlementStore } from '@/store/entitlement';
import { theme } from '@/theme';
import { looksLikeP8, normalizeP8 } from '@/utils/pem';

type TestStatus = 'idle' | 'testing' | 'ok' | 'fail';

export default function SettingsScreen() {
  const creds = useCredentialsStore((s) => s.creds);
  const save = useCredentialsStore((s) => s.save);
  const clear = useCredentialsStore((s) => s.clear);
  const { unlocked } = useEntitlement();

  const [issuerId, setIssuerId] = useState(creds?.issuerId ?? '');
  const [keyId, setKeyId] = useState(creds?.keyId ?? '');
  const [privateKeyPem, setPrivateKeyPem] = useState(creds?.privateKeyPem ?? '');
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');
  const [testError, setTestError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const canSave =
    issuerId.trim().length >= 8 &&
    keyId.trim().length >= 6 &&
    looksLikeP8(privateKeyPem);

  const handleTest = async () => {
    if (!canSave) {
      setTestStatus('fail');
      setTestError('Fill in all three fields with valid values.');
      return;
    }
    const probe: Credentials = {
      issuerId: issuerId.trim(),
      keyId: keyId.trim(),
      privateKeyPem: normalizeP8(privateKeyPem),
    };
    setTestStatus('testing');
    setTestError(null);
    try {
      // Save first so the fetch wrapper can read creds from the store.
      await save(probe);
      await pingApps(probe);
      setTestStatus('ok');
    } catch (e) {
      const err = e as AscApiError;
      setTestStatus('fail');
      setTestError(err?.message ?? 'Connection failed.');
    }
  };

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await save({
        issuerId: issuerId.trim(),
        keyId: keyId.trim(),
        privateKeyPem: normalizeP8(privateKeyPem),
      });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Clear credentials?',
      'This removes your App Store Connect API key from this device. You can add it again anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clear();
            setIssuerId('');
            setKeyId('');
            setPrivateKeyPem('');
            setTestStatus('idle');
            setTestError(null);
          },
        },
      ],
    );
  };

  const handleUnlock = () => {
    router.push('/paywall');
  };

  const handleRestore = async () => {
    const ok = await restorePurchases();
    Alert.alert(
      'Restore Purchases',
      ok ? 'Your unlock has been restored.' : 'No prior purchase was found on this Apple ID.',
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.section}>App Store Connect API Key</Text>
          <Text style={styles.helper}>
            Create a key with Developer role in App Store Connect → Users and Access → Integrations.
            All three values are stored only in your device Keychain.
          </Text>

          <Field label="Issuer ID" value={issuerId} onChangeText={setIssuerId} placeholder="69a6de70-…" autoCapitalize="none" />
          <Field label="Key ID" value={keyId} onChangeText={setKeyId} placeholder="ABCDEF1234" autoCapitalize="characters" />
          <Field
            label="Private Key (.p8 contents)"
            value={privateKeyPem}
            onChangeText={setPrivateKeyPem}
            placeholder="-----BEGIN PRIVATE KEY-----&#10;…&#10;-----END PRIVATE KEY-----"
            multiline
            monospace
            autoCapitalize="none"
          />

          <View style={styles.actionRow}>
            <PrimaryButton
              label={testStatus === 'testing' ? 'Testing…' : 'Test Connection'}
              onPress={handleTest}
              disabled={!canSave || testStatus === 'testing'}
              style={{ flex: 1 }}
            />
            <PrimaryButton
              label={saving ? 'Saving…' : 'Save'}
              onPress={handleSave}
              disabled={!canSave || saving}
              style={{ flex: 1 }}
              solid
            />
          </View>

          {testStatus === 'ok' ? (
            <Text style={styles.okText}>✓ Connection successful.</Text>
          ) : testStatus === 'fail' && testError ? (
            <Text style={styles.errorText}>{testError}</Text>
          ) : null}

          {creds ? (
            <Pressable
              onPress={handleClear}
              accessibilityRole="button"
              style={({ pressed }) => [styles.dangerButton, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="trash-outline" size={16} color={theme.color.danger} />
              <Text style={styles.dangerText}>Clear Credentials</Text>
            </Pressable>
          ) : null}

          <Text style={styles.section}>Unlock</Text>
          {unlocked ? (
            <View style={styles.unlockedBox}>
              <Ionicons name="checkmark-circle" size={20} color={theme.color.accent} />
              <Text style={styles.unlockedText}>Unlimited Apps unlocked.</Text>
            </View>
          ) : (
            <PrimaryButton label="Upgrade to BuildPad Pro" onPress={handleUnlock} solid />
          )}
          <Pressable
            onPress={handleRestore}
            accessibilityRole="button"
            style={({ pressed }) => [styles.linkButton, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.linkText}>Restore Purchases</Text>
          </Pressable>

          {__DEV__ ? <DevPanel /> : null}

          <Text style={styles.section}>About</Text>
          <Row label="Version" value={Constants.expoConfig?.version ?? '1.0.0'} />
          <Row
            label="Build"
            value={Constants.expoConfig?.ios?.buildNumber?.toString() ?? '1'}
          />
          <LinkRow
            label="Support"
            url="https://ndsoft.dev/testflight-tracker/support"
          />
          <LinkRow
            label="Privacy Policy"
            url="https://ndsoft.dev/testflight-tracker/privacy"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  multiline,
  monospace,
  ...rest
}: React.ComponentProps<typeof TextInput> & { label: string; monospace?: boolean }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...rest}
        multiline={multiline}
        placeholderTextColor={theme.color.textDim}
        style={[
          styles.input,
          multiline && styles.inputMulti,
          monospace && styles.inputMono,
        ]}
        autoCorrect={false}
        spellCheck={false}
        smartDashesType="no"
        smartInsertDelete={false}
      />
    </View>
  );
}

function DevPanel() {
  const unlocked = useEntitlementStore((s) => s.unlocked);
  const setUnlocked = useEntitlementStore((s) => s.setUnlocked);

  return (
    <>
      <Text style={styles.section}>Developer</Text>
      <View style={styles.devBox}>
        <View style={styles.devRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.devTitle}>Force Pro unlock</Text>
            <Text style={styles.devSubtitle}>
              Local override. Next RevenueCat sync will overwrite this based on
              the real entitlement.
            </Text>
          </View>
          <Switch
            value={unlocked}
            onValueChange={(v) => setUnlocked(v)}
            trackColor={{ true: theme.color.accent, false: '#3A3A46' }}
          />
        </View>
      </View>
      <Text style={styles.devHint}>
        Visible in debug builds only. Sandbox testers and StoreKit config files
        are still the real path for verifying purchases.
      </Text>
    </>
  );
}

function PrimaryButton({
  label,
  onPress,
  disabled,
  style,
  solid,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: any;
  solid?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        solid ? styles.buttonSolid : styles.buttonOutline,
        disabled && styles.buttonDisabled,
        pressed && { opacity: 0.7 },
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          solid ? styles.buttonTextSolid : styles.buttonTextOutline,
          disabled && { opacity: 0.6 },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function LinkRow({ label, url }: { label: string; url: string }) {
  return (
    <Pressable
      onPress={() => Linking.openURL(url)}
      accessibilityRole="link"
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <Ionicons name="open-outline" size={16} color={theme.color.textDim} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  devBox: {
    marginTop: theme.space.sm,
    padding: theme.space.md,
    backgroundColor: theme.color.card,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.color.border,
  },
  devRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.md,
  },
  devTitle: {
    color: theme.color.text,
    fontSize: theme.font.md,
    fontWeight: '600',
  },
  devSubtitle: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    marginTop: 4,
    lineHeight: 18,
  },
  devHint: {
    color: theme.color.textDim,
    fontSize: 11,
    marginTop: theme.space.sm,
    paddingHorizontal: 2,
  },
  safe: { flex: 1, backgroundColor: theme.color.bg },
  content: { padding: theme.space.lg, paddingBottom: theme.space.xl * 2 },
  section: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: theme.space.xl,
    marginBottom: theme.space.sm,
  },
  helper: {
    color: theme.color.textDim,
    fontSize: theme.font.sm,
    lineHeight: 20,
    marginBottom: theme.space.md,
  },
  field: { marginBottom: theme.space.md },
  fieldLabel: {
    color: theme.color.text,
    fontSize: theme.font.sm,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: theme.color.card,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.color.border,
    paddingHorizontal: theme.space.md,
    paddingVertical: 12,
    fontSize: theme.font.md,
    color: theme.color.text,
  },
  inputMulti: {
    minHeight: 140,
    textAlignVertical: 'top',
  },
  inputMono: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.space.md,
    marginTop: theme.space.sm,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: theme.space.lg,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSolid: {
    backgroundColor: theme.color.brand,
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: theme.color.border,
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: theme.font.md,
    fontWeight: '600',
  },
  buttonTextSolid: { color: theme.color.text },
  buttonTextOutline: { color: theme.color.text },
  okText: {
    color: theme.color.accent,
    fontSize: theme.font.sm,
    marginTop: theme.space.md,
    fontWeight: '600',
  },
  errorText: {
    color: theme.color.danger,
    fontSize: theme.font.sm,
    marginTop: theme.space.md,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
    marginTop: theme.space.lg,
    alignSelf: 'flex-start',
    padding: theme.space.sm,
  },
  dangerText: {
    color: theme.color.danger,
    fontSize: theme.font.md,
    fontWeight: '600',
  },
  unlockedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
    backgroundColor: 'rgba(48,209,88,0.12)',
    padding: theme.space.md,
    borderRadius: theme.radius.md,
  },
  unlockedText: {
    color: theme.color.text,
    fontSize: theme.font.md,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: theme.space.md,
    alignSelf: 'flex-start',
    padding: theme.space.sm,
  },
  linkText: {
    color: theme.color.brand,
    fontSize: theme.font.md,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.color.border,
  },
  rowLabel: {
    color: theme.color.text,
    fontSize: theme.font.md,
  },
  rowValue: {
    color: theme.color.textDim,
    fontSize: theme.font.md,
  },
});
