const config = {
  appId: 'com.atelier.coffeemuseum',
  appName: '拾光咖啡博物馆',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#F6F1E7',
  },
  android: {
    backgroundColor: '#F6F1E7',
    allowMixedContent: false,
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#F6F1E7',
    },
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#F6F1E7',
      showSpinner: false,
    },
  },
}

export default config
