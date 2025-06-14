import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLoginViewModel } from '../../viewmodels/auth/useLoginViewModel';
import { LoginScreenProps } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';
import { useToast, Toast } from '../../components/common/Toast';

export function LoginScreen({ navigation }: LoginScreenProps) {
  const { theme } = useTheme();
  const { toast, showError, hideToast } = useToast();
  const {
    email,
    password,
    isLoading,
    error,
    setEmail,
    setPassword,
    handleLogin,
  } = useLoginViewModel();

  const styles = getStyles(theme);

  // Hata durumunda toast göster
  React.useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Ionicons name="heart" size={32} color={theme.primaryForeground} />
              </View>
              <Text style={styles.logoText}>MoodLink</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.headerContainer}>
                  <Text style={styles.title}>Tekrar Hoş Geldin!</Text>
                  <Text style={styles.subtitle}>Kaldığın yerden devam et</Text>
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="E-posta"
                    placeholderTextColor={theme.mutedForeground}
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  <TextInput
                    placeholder="Şifre"
                    placeholderTextColor={theme.mutedForeground}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                  />
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={handleLogin}
                    disabled={isLoading}
                    style={[styles.loginButton, isLoading && styles.disabledButton]}
                  >
                    {isLoading ? (
                      <ActivityIndicator color={theme.primaryForeground} />
                    ) : (
                      <Text style={styles.buttonText}>Giriş Yap</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.linkContainer}>
                  <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.linkContainer}>
                  <Text style={styles.linkPrefix}>Hesabın yok mu? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.linkText}>Kayıt Ol</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      
      {/* Toast Bildirimi */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={3000}
        onHide={hideToast}
      />
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.primary,
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.foreground,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: theme.mutedForeground,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: theme.input,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    color: theme.foreground,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: theme.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.primaryForeground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  linkPrefix: {
    color: theme.mutedForeground,
    fontSize: 14,
  },
  linkText: {
    color: theme.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  forgotPasswordText: {
    color: theme.primary,
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
}); 