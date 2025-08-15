import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wehand.tennis',
  appName: 'WeHand Tennis',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'wehand.app',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0, // 스플래시 화면 즉시 숨김
      launchAutoHide: true,
      launchFadeOutDuration: 0,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      iosSpinnerStyle: 'small',
      spinnerColor: '#059669',
      splashFullScreen: true,
      splashImmersive: true,
      useDialog: false,
    },
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    limitsNavigationsToAppBoundDomains: false,
    allowsLinkPreview: false,
    scrollEnabled: true,
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;