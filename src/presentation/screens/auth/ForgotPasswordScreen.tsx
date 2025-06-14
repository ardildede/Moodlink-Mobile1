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
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeProvider';
import { useToast, Toast } from '../../components/common/Toast';
import { useForgotPasswordViewModel, ForgotPasswordStep } from '../../viewmodels/auth/useForgotPasswordViewModel';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { toast, showError, showSuccess, hideToast } = useToast();
  
  const {
    currentStep,
    email,
    code,
    newPassword,
    confirmPassword,
    isLoading,
    error,
    setEmail,
    setCode,
    setNewPassword,
    setConfirmPassword,
    sendResetCode,
    verifyCode,
    resetPassword,
    clearError,
    goBackToEmail,
    goBackToCode,
    resetAll,
  } = useForgotPasswordViewModel();

  // Hata durumunda toast göster
  React.useEffect(() => {
    if (error) {
      showError(error);
      clearError();
    }
  }, [error, showError, clearError]);

  const handleSendCode = async () => {
    const success = await sendResetCode();
    if (success) {
      showSuccess('Doğrulama kodu e-posta adresinize gönderildi');
    }
  };

  const handleVerifyCode = async () => {
    const success = await verifyCode();
    if (success) {
      showSuccess('Kod doğrulandı. Şimdi yeni şifrenizi belirleyebilirsiniz');
    }
  };

  const handleResetPassword = async () => {
    const success = await resetPassword();
    if (success) {
      showSuccess('Şifreniz başarıyla sıfırlandı');
      setTimeout(() => {
        resetAll();
        navigation.navigate('Login' as never);
      }, 2000);
    }
  };

  const navigateToLogin = () => {
    resetAll();
    navigation.navigate('Login' as never);
  };

  const renderProgressIndicator = () => {
    const steps = ['email', 'code', 'password'];
    const currentStepIndex = steps.indexOf(currentStep);

    return (
      <View style={styles.progressContainer}>
        {steps.map((step, index) => (
          <View key={step} style={styles.progressStep}>
            <View
              style={[
                styles.progressDot,
                {
                  backgroundColor: index <= currentStepIndex ? theme.primary : theme.muted,
                },
              ]}
            >
              <Text
                style={[
                  styles.progressDotText,
                  {
                    color: index <= currentStepIndex ? theme.primaryForeground : theme.mutedForeground,
                  },
                ]}
              >
                {index + 1}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.progressLine,
                  {
                    backgroundColor: index < currentStepIndex ? theme.primary : theme.muted,
                  },
                ]}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'email':
        return renderEmailStep();
      case 'code':
        return renderCodeStep();
      case 'password':
        return renderPasswordStep();
      default:
        return renderEmailStep();
    }
  };

  const renderEmailStep = () => (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Şifremi Unuttum</Text>
        <Text style={styles.subtitle}>
          E-posta adresinizi girin, size doğrulama kodu gönderelim
        </Text>
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
          editable={!isLoading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSendCode}
          disabled={isLoading}
          style={[styles.resetButton, isLoading && styles.disabledButton]}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.primaryForeground} />
          ) : (
            <Text style={styles.buttonText}>Doğrulama Kodu Gönder</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={navigateToLogin}>
          <Text style={styles.linkText}>← Giriş ekranına dön</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderCodeStep = () => (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Doğrulama Kodu</Text>
        <Text style={styles.subtitle}>
          {email} adresine gönderilen 6 haneli kodu girin
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Doğrulama Kodu"
          placeholderTextColor={theme.mutedForeground}
          value={code}
          onChangeText={setCode}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={6}
          editable={!isLoading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleVerifyCode}
          disabled={isLoading}
          style={[styles.resetButton, isLoading && styles.disabledButton]}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.primaryForeground} />
          ) : (
            <Text style={styles.buttonText}>Kodu Doğrula</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={goBackToEmail}>
          <Text style={styles.linkText}>← E-posta adresini değiştir</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Yeni Şifre</Text>
        <Text style={styles.subtitle}>
          Hesabınız için yeni bir şifre belirleyin
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Yeni Şifre"
          placeholderTextColor={theme.mutedForeground}
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.input}
          secureTextEntry
          editable={!isLoading}
        />
        <TextInput
          placeholder="Şifre Tekrar"
          placeholderTextColor={theme.mutedForeground}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          secureTextEntry
          editable={!isLoading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleResetPassword}
          disabled={isLoading}
          style={[styles.resetButton, isLoading && styles.disabledButton]}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.primaryForeground} />
          ) : (
            <Text style={styles.buttonText}>Şifreyi Sıfırla</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={goBackToCode}>
          <Text style={styles.linkText}>← Kodu tekrar gir</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const styles = getStyles(theme);

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
                {renderProgressIndicator()}
                {renderStepContent()}
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
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.foreground,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: theme.mutedForeground,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: theme.input,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.foreground,
    marginBottom: 15,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: theme.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
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
    alignItems: 'center',
  },
  linkText: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDotText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
  },
}); 