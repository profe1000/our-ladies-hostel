import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.woodlodge.app',
  appName: 'Wood Lodge App',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
