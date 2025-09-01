import { PaginatedResult } from "../../interfaces/pagination-types";

export interface AuthUserIdentity {
  id: string;
  userId: string;
  identityData: Record<string, string>;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUserAppMetadata {
  provider?: string;
  providers?: string[];
}

export interface AuthUserUserMetadata {
  [key: string]: string;
}

export class AuthUserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly phone: string | null,
    public readonly emailConfirmedAt: Date | null,
    public readonly phoneConfirmedAt: Date | null,
    public readonly lastSignInAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly isAnonymous: boolean,
    public readonly appMetadata: AuthUserAppMetadata,
    public readonly userMetadata: AuthUserUserMetadata,
    public readonly identities: AuthUserIdentity[],
    public readonly profilesCount: number = 0
  ) { }

  get isEmailConfirmed(): boolean {
    return this.emailConfirmedAt !== null;
  }

  get isPhoneConfirmed(): boolean {
    return this.phoneConfirmedAt !== null;
  }

  get primaryProvider(): string {
    return this.appMetadata.provider || 'email';
  }

  get hasMultipleProviders(): boolean {
    return (this.appMetadata.providers?.length || 0) > 1;
  }

  get isActive(): boolean {
    // Consider user active if they've signed in within the last 30 days
    if (!this.lastSignInAt) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.lastSignInAt > thirtyDaysAgo;
  }
}

export class AuthUserStatsEntity {
  constructor(
    public readonly totalUsers: number,
    public readonly confirmedUsers: number,
    public readonly unconfirmedUsers: number,
    public readonly activeUsersToday: number,
    public readonly newUsersThisMonth: number,
    public readonly usersByProvider: {
      email: number;
      google: number;
      facebook: number;
      apple: number;
      phone: number;
      anonymous: number;
    }
  ) { }

  get confirmationRate(): number {
    return this.totalUsers > 0 ? (this.confirmedUsers / this.totalUsers) * 100 : 0;
  }

  get growthRate(): number {
    const previousMonthUsers = this.totalUsers - this.newUsersThisMonth;
    return previousMonthUsers > 0 ? (this.newUsersThisMonth / previousMonthUsers) * 100 : 0;
  }
}


export type PaginatedAuthUsersEntity = PaginatedResult<AuthUserEntity>;

