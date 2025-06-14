import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { TextInput } from 'react-native';
import useRegisterViewModel, { RegisterStep } from '../viewmodels/useRegisterViewModel';
import { useToast, Toast } from '../components/common/Toast';

const ProgressIndicator = ({ currentStep, theme }: { currentStep: RegisterStep, theme: any }) => {
  const steps = [
    { key: RegisterStep.EMAIL_INPUT, label: 'E-posta', icon: 'mail' },
    { key: RegisterStep.EMAIL_VERIFICATION, label: 'Doğrulama', icon: 'shield-checkmark' },
    { key: RegisterStep.USER_DETAILS, label: 'Bilgiler', icon: 'person' },
  ];

  const getStepStatus = (stepKey: RegisterStep) => {
    const stepIndex = steps.findIndex(s => s.key === stepKey);
    const currentIndex = steps.findIndex(s => s.key === currentStep);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <View style={styles.progressContainer}>
      {steps.map((step, index) => {
        const status = getStepStatus(step.key);
        return (
          <View key={step.key} style={styles.progressStepContainer}>
            <View style={[
              styles.progressStep,
              { 
                backgroundColor: status === 'completed' ? theme.primary : 
                               status === 'active' ? theme.primary : theme.muted,
              }
            ]}>
              <Ionicons 
                name={step.icon as any} 
                size={16} 
                color={status === 'pending' ? theme.mutedForeground : 'white'} 
              />
            </View>
            <Text style={[
              styles.progressLabel,
              { 
                color: status === 'pending' ? theme.mutedForeground : theme.foreground,
                fontWeight: status === 'active' ? '600' : '400'
              }
            ]}>
              {step.label}
            </Text>
            {index < steps.length - 1 && (
              <View style={[
                styles.progressLine,
                { backgroundColor: index < steps.findIndex(s => s.key === currentStep) ? theme.primary : theme.muted }
              ]} />
            )}
          </View>
        );
      })}
    </View>
  );
};

const EmailStep = ({ email, onEmailChange, onNext, isLoading, theme }: any) => (
  <View style={styles.stepContainer}>
    <View style={styles.stepHeader}>
      <Ionicons name="mail-outline" size={48} color={theme.primary} />
      <Text style={[styles.stepTitle, { color: theme.foreground }]}>
        E-posta Adresinizi Girin
      </Text>
      <Text style={[styles.stepSubtitle, { color: theme.mutedForeground }]}>
        Hesabınızı doğrulamak için e-posta adresinize bir kod göndereceğiz
      </Text>
    </View>

    <View style={styles.formContainer}>
      <Text style={[styles.inputLabel, { color: theme.foreground }]}>E-posta Adresi</Text>
      <TextInput
        value={email}
        onChangeText={onEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="ornek@email.com"
        placeholderTextColor={theme.mutedForeground}
        style={[styles.input, { borderColor: theme.border, color: theme.foreground, backgroundColor: theme.card }]}
      />

      <TouchableOpacity
        style={[styles.primaryButton, 
          { backgroundColor: email.trim() ? theme.primary : theme.muted }
        ]}
        onPress={onNext}
        disabled={!email.trim() || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Text style={[styles.buttonText, { color: 'white' }]}>
              Doğrulama Kodu Gönder
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </>
        )}
      </TouchableOpacity>
    </View>
  </View>
);

const VerificationStep = ({ email, verificationCode, onCodeChange, onNext, onBack, onResend, isLoading, theme }: any) => (
  <View style={styles.stepContainer}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Ionicons name="arrow-back" size={24} color={theme.primary} />
    </TouchableOpacity>

    <View style={styles.stepHeader}>
      <Ionicons name="shield-checkmark-outline" size={48} color={theme.primary} />
      <Text style={[styles.stepTitle, { color: theme.foreground }]}>
        Doğrulama Kodu
      </Text>
      <Text style={[styles.stepSubtitle, { color: theme.mutedForeground }]}>
        {email} adresine gönderilen 6 haneli kodu girin
      </Text>
    </View>

    <View style={styles.formContainer}>
      <Text style={[styles.inputLabel, { color: theme.foreground }]}>Doğrulama Kodu</Text>
      <TextInput
        value={verificationCode}
        onChangeText={onCodeChange}
        keyboardType="number-pad"
        placeholder="123456"
        maxLength={6}
        placeholderTextColor={theme.mutedForeground}
        style={[styles.input, { borderColor: theme.border, color: theme.foreground, backgroundColor: theme.card }]}
      />

      <TouchableOpacity
        style={[styles.primaryButton, 
          { backgroundColor: verificationCode.trim() ? theme.primary : theme.muted }
        ]}
        onPress={onNext}
        disabled={!verificationCode.trim() || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Text style={[styles.buttonText, { color: 'white' }]}>
              Kodu Doğrula
            </Text>
            <Ionicons name="checkmark" size={20} color="white" />
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondaryButton, { borderColor: theme.border }]}
        onPress={onResend}
        disabled={isLoading}
      >
        <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>
          Kodu Tekrar Gönder
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const DetailsStep = ({ 
  localFormData, 
  setLocalFormData, 
  onNext, 
  onBack, 
  isLoading, 
  theme 
}: any) => (
  <View style={styles.stepContainer}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Ionicons name="arrow-back" size={24} color={theme.primary} />
    </TouchableOpacity>

    <View style={styles.stepHeader}>
      <Ionicons name="person-outline" size={48} color={theme.primary} />
      <Text style={[styles.stepTitle, { color: theme.foreground }]}>
        Hesap Bilgileriniz
      </Text>
      <Text style={[styles.stepSubtitle, { color: theme.mutedForeground }]}>
        Hesabınızı oluşturmak için gerekli bilgileri girin
      </Text>
    </View>

    <View style={styles.formContainer}>
      <Text style={[styles.inputLabel, { color: theme.foreground }]}>Ad</Text>
      <TextInput
        value={localFormData.firstName || ''}
        onChangeText={(value) => setLocalFormData({ ...localFormData, firstName: value })}
        placeholder="Adınız"
        placeholderTextColor={theme.mutedForeground}
        style={[styles.input, { borderColor: theme.border, color: theme.foreground, backgroundColor: theme.card }]}
      />

      <Text style={[styles.inputLabel, { color: theme.foreground }]}>Soyad</Text>
      <TextInput
        value={localFormData.lastName || ''}
        onChangeText={(value) => setLocalFormData({ ...localFormData, lastName: value })}
        placeholder="Soyadınız"
        placeholderTextColor={theme.mutedForeground}
        style={[styles.input, { borderColor: theme.border, color: theme.foreground, backgroundColor: theme.card }]}
      />

      <Text style={[styles.inputLabel, { color: theme.foreground }]}>Kullanıcı Adı</Text>
      <TextInput
        value={localFormData.userName || ''}
        onChangeText={(value) => setLocalFormData({ ...localFormData, userName: value })}
        placeholder="kullaniciadi"
        autoCapitalize="none"
        placeholderTextColor={theme.mutedForeground}
        style={[styles.input, { borderColor: theme.border, color: theme.foreground, backgroundColor: theme.card }]}
      />

      <Text style={[styles.inputLabel, { color: theme.foreground }]}>Şifre</Text>
      <TextInput
        value={localFormData.password || ''}
        onChangeText={(value) => setLocalFormData({ ...localFormData, password: value })}
        placeholder="En az 8 karakter"
        secureTextEntry
        placeholderTextColor={theme.mutedForeground}
        style={[styles.input, { borderColor: theme.border, color: theme.foreground, backgroundColor: theme.card }]}
      />

      <Text style={[styles.inputLabel, { color: theme.foreground }]}>Şifre Tekrar</Text>
      <TextInput
        value={localFormData.confirmPassword || ''}
        onChangeText={(value) => setLocalFormData({ ...localFormData, confirmPassword: value })}
        placeholder="Şifrenizi tekrar girin"
        secureTextEntry
        placeholderTextColor={theme.mutedForeground}
        style={[styles.input, { borderColor: theme.border, color: theme.foreground, backgroundColor: theme.card }]}
      />

      <TouchableOpacity
        style={[styles.primaryButton, 
          { backgroundColor: (localFormData.firstName && localFormData.lastName && 
                            localFormData.userName && localFormData.password && 
                            localFormData.confirmPassword) ? theme.primary : theme.muted }
        ]}
        onPress={onNext}
        disabled={!(localFormData.firstName && localFormData.lastName && 
                   localFormData.userName && localFormData.password && 
                   localFormData.confirmPassword) || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Text style={[styles.buttonText, { color: 'white' }]}>
              Hesap Oluştur
            </Text>
            <Ionicons name="checkmark-circle" size={20} color="white" />
          </>
        )}
      </TouchableOpacity>
    </View>
  </View>
);

export const RegisterScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { toast, showError, showSuccess, hideToast } = useToast();

  // Local form state for details step
  const [localFormData, setLocalFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
    confirmPassword: '',
  });

  const {
    // State
    currentStep,
    isLoading,
    error,
    email,
    verificationCode,
    isEmailVerified,

    // Actions
    sendEmailValidation,
    verifyEmailCode,
    completeRegistration,
    resetRegistration,
    goBackToStep,
    resendEmailValidation,

    // Setters
    setError,
  } = useRegisterViewModel();

  // Toast mesajları için effect
  React.useEffect(() => {
    if (error) {
      showError(error);
      setError(null);
    }
  }, [error, showError, setError]);

  // Local input handlers
  const [localEmail, setLocalEmail] = useState('');
  const [localVerificationCode, setLocalVerificationCode] = useState('');

  const handleSendEmailValidation = async () => {
    await sendEmailValidation(localEmail);
  };

  const handleVerifyCode = async () => {
    await verifyEmailCode(localVerificationCode);
  };

  const handleRegister = async () => {
    try {
      const registerData = {
        email: email,
        password: localFormData.password,
        confirmPassword: localFormData.confirmPassword,
        userName: localFormData.userName,
        firstName: localFormData.firstName,
        lastName: localFormData.lastName,
      };

      await completeRegistration(registerData);
      showSuccess('Hesabınız başarıyla oluşturuldu!');
    } catch (err: any) {
      // Error handling is done in ViewModel
    }
  };

  const handleGoBack = () => {
    switch (currentStep) {
      case RegisterStep.EMAIL_VERIFICATION:
        goBackToStep(RegisterStep.EMAIL_INPUT);
        break;
      case RegisterStep.USER_DETAILS:
        goBackToStep(RegisterStep.EMAIL_VERIFICATION);
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case RegisterStep.EMAIL_INPUT:
        return (
          <EmailStep
            email={localEmail}
            onEmailChange={setLocalEmail}
            onNext={handleSendEmailValidation}
            isLoading={isLoading}
            theme={theme}
          />
        );
      case RegisterStep.EMAIL_VERIFICATION:
        return (
          <VerificationStep
            email={email}
            verificationCode={localVerificationCode}
            onCodeChange={setLocalVerificationCode}
            onNext={handleVerifyCode}
            onBack={handleGoBack}
            onResend={resendEmailValidation}
            isLoading={isLoading}
            theme={theme}
          />
        );
      case RegisterStep.USER_DETAILS:
        return (
          <DetailsStep
            localFormData={localFormData}
            setLocalFormData={setLocalFormData}
            onNext={handleRegister}
            onBack={handleGoBack}
            isLoading={isLoading}
            theme={theme}
          />
        );
      case RegisterStep.COMPLETED:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Ionicons name="checkmark-circle" size={64} color={theme.primary} />
              <Text style={[styles.stepTitle, { color: theme.foreground }]}>
                Hesap Oluşturuldu!
              </Text>
              <Text style={[styles.stepSubtitle, { color: theme.mutedForeground }]}>
                Hesabınız başarıyla oluşturuldu. Ana sayfaya yönlendiriliyorsunuz...
              </Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.foreground }]}>
            Hesap Oluştur
          </Text>
          <ProgressIndicator currentStep={currentStep} theme={theme} />
        </View>

        {renderCurrentStep()}

        {currentStep === RegisterStep.EMAIL_INPUT && (
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.mutedForeground }]}>
              Zaten hesabınız var mı?{' '}
              <Text 
                style={[styles.linkText, { color: theme.primary }]}
                onPress={() => navigation.goBack()}
              >
                Giriş Yap
              </Text>
            </Text>
          </View>
        )}
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={3000}
        onHide={hideToast}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  progressStepContainer: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  progressStep: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  progressLine: {
    position: 'absolute',
    top: 20,
    left: '60%',
    width: '80%',
    height: 2,
    zIndex: -1,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: -40,
    left: 0,
    padding: 8,
    zIndex: 1,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  formContainer: {
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  secondaryButton: {
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
  },
  linkText: {
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  validationInfo: {
    fontSize: 12,
    textAlign: 'center',
  },
}); 