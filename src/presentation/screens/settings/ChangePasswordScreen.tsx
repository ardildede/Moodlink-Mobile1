import React, { useState } from 'react';
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

export function ChangePasswordScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { toast, showError, showSuccess, hideToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!currentPassword.trim()) {
      showError('Mevcut şifrenizi girin');
      return false;
    }

    if (!newPassword.trim()) {
      showError('Yeni şifrenizi girin');
      return false;
    }

    if (newPassword.length < 8) {
      showError('Yeni şifre en az 8 karakter olmalıdır');
      return false;
    }

    if (newPassword !== confirmPassword) {
      showError('Yeni şifreler eşleşmiyor');
      return false;
    }

    if (currentPassword === newPassword) {
      showError('Yeni şifre mevcut şifreden farklı olmalıdır');
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: API çağrısı yapılacak
      // await changePasswordUseCase.execute(currentPassword, newPassword);
      
      // Simüle ediyoruz
      setTimeout(() => {
        setIsLoading(false);
        showSuccess('Şifreniz başarıyla değiştirildi');
        
        // Form'u temizle ve geri git
        setTimeout(() => {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          navigation.goBack();
        }, 2000);
      }, 1500);

    } catch (error: any) {
      setIsLoading(false);
      showError(error.message || 'Şifre değiştirilirken bir hata oluştu');
    }
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.foreground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Şifre Değiştir</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="lock-closed" size={48} color={theme.primary} />
              </View>

              <Text style={styles.title}>Şifrenizi Değiştirin</Text>
              <Text style={styles.subtitle}>
                Hesabınızın güvenliği için güçlü bir şifre seçin
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Mevcut Şifre</Text>
                <TextInput
                  placeholder="Mevcut şifrenizi girin"
                  placeholderTextColor={theme.mutedForeground}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  style={styles.input}
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Yeni Şifre</Text>
                <TextInput
                  placeholder="Yeni şifrenizi girin"
                  placeholderTextColor={theme.mutedForeground}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  style={styles.input}
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Yeni Şifre Tekrar</Text>
                <TextInput
                  placeholder="Yeni şifrenizi tekrar girin"
                  placeholderTextColor={theme.mutedForeground}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={styles.input}
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>

              <View style={styles.passwordRequirements}>
                <Text style={styles.requirementsTitle}>Şifre Gereksinimleri:</Text>
                <Text style={styles.requirementItem}>• En az 8 karakter</Text>
                <Text style={styles.requirementItem}>• En az bir büyük harf</Text>
                <Text style={styles.requirementItem}>• En az bir küçük harf</Text>
                <Text style={styles.requirementItem}>• En az bir rakam</Text>
              </View>

              <TouchableOpacity
                onPress={handleChangePassword}
                disabled={isLoading}
                style={[styles.changeButton, isLoading && styles.disabledButton]}
              >
                {isLoading ? (
                  <ActivityIndicator color={theme.primaryForeground} />
                ) : (
                  <Text style={styles.buttonText}>Şifreyi Değiştir</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Toast Bildirimi */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </SafeAreaView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.card,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.foreground,
  },
  placeholder: {
    width: 40,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
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
    padding: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.foreground,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.mutedForeground,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.foreground,
    marginBottom: 8,
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
  },
  passwordRequirements: {
    backgroundColor: theme.muted,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.foreground,
    marginBottom: 8,
  },
  requirementItem: {
    fontSize: 13,
    color: theme.mutedForeground,
    marginBottom: 4,
  },
  changeButton: {
    backgroundColor: theme.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.primaryForeground,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 