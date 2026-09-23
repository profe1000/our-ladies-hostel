import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.woodlodge.app',
  appName: 'Our Ladies Lodge',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
