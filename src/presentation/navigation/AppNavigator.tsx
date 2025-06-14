import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../stores/authStore';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { SplashScreen } from '../screens/SplashScreen';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { TokenService } from '../../common/services/TokenService';
import { useToast, Toast } from '../components/common/Toast';

// Dependency Injection (DI) için hazırlık
// Normalde bu işlem daha merkezi bir DI container (örn: InversifyJS, tsyringe)
// ile yapılır. Projenin bu aşaması için manuel DI yeterlidir.
import { GetUserProfileUseCase } from '../../core/domain/usecases/user/GetUserProfileUseCase';
import { UserRepositoryImpl } from '../../core/data/repositories/UserRepositoryImpl';
import UserApi from '../../core/data/datasources/remote/UserApi';
import { GetFromAuthUseCase } from '../../core/domain/usecases/user/GetFromAuthUseCase';
import { setLogoutCallback, setToastCallback } from '../../core/data/datasources/remote/ApiService';

const userRepository = new UserRepositoryImpl(UserApi);
const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
const getFromAuthUseCase = new GetFromAuthUseCase(userRepository);

// Minimum splash screen süresi (milisaniye)
const MINIMUM_SPLASH_DURATION = 2000;

export function AppNavigator() {
  const { isAuthenticated, isLoading, login, setLoading, logout } = useAuthStore();
  const { toast, showError, showWarning, hideToast } = useToast();

  // ApiService callback'lerini ayarla
  useEffect(() => {
    setLogoutCallback(async () => {
      await logout();
    });
    
    setToastCallback((message, type) => {
      switch (type) {
        case 'error':
          showError(message);
          break;
        case 'warning':
          showWarning(message);
          break;
        default:
          showWarning(message);
      }
    });
  }, [logout, showError, showWarning]);

  useEffect(() => {
    const checkSession = async () => {
      console.log('Session check started...');
      
      // Splash screen başlangıç zamanını kaydet
      const startTime = Date.now();
      
      try {
        const accessToken = await TokenService.getToken();
        console.log('Access Token:', accessToken ? 'Found' : 'Not Found');

        if (accessToken) {
          // Token var, şimdi kullanıcı bilgilerini alıp state'i güncelle
          console.log('Getting user from auth...');
          const user = await getFromAuthUseCase.execute();
          console.log('User data received:', user);
          login(user); // user ve isAuthenticated state'ini ayarlar
        }
      } catch (e) {
        console.error("Session check failed, token might be invalid:", e);
        // Token varsa ama geçersizse silmek iyi bir pratik olabilir.
        await TokenService.deleteToken();
      } finally {
        // Session check tamamlandı, şimdi minimum süre kontrolü yap
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MINIMUM_SPLASH_DURATION - elapsedTime);
        
        console.log(`Session check finished in ${elapsedTime}ms, waiting ${remainingTime}ms more for minimum splash duration`);
        
        // Kalan süre kadar bekle, sonra loading'i false yap
        setTimeout(() => {
          setLoading(false);
          console.log('Splash screen finished.');
        }, remainingTime);
      }
    };

    checkSession();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <ErrorBoundary>
      <NavigationContainer>
        {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
      
      {/* Global Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={3000}
        onHide={hideToast}
      />
    </ErrorBoundary>
  );
} 