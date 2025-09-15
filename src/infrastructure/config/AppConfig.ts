export interface AppConfig {
  readonly PUBLIC_APP_URL: string;
}

export const DEFAULT_APP_CONFIG: AppConfig = {
  PUBLIC_APP_URL: "https://shopqueue.app",
};

export class AppConfigProvider {
  private config: AppConfig;
  private static instance: AppConfigProvider;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): AppConfigProvider {
    if (!AppConfigProvider.instance) {
      AppConfigProvider.instance = new AppConfigProvider();
    }
    return AppConfigProvider.instance;
  }

  private loadConfig(): AppConfig {
    const config = { ...DEFAULT_APP_CONFIG };

    // Override with environment variables if available
    if (process.env.NEXT_PUBLIC_APP_URL) {
      config.PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;
    }

    return config;
  }

  /**
   * Get current configuration
   */
  public getConfig(): AppConfig {
    return { ...this.config };
  }
}

export function getAppConfig(): AppConfig {
  return AppConfigProvider.getInstance().getConfig();
}

export function getAppUrl(): string {
  return getAppConfig().PUBLIC_APP_URL;
}
