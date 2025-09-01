export interface AuthUserDTO {
  id: string;
  email: string;
  phone?: string;
  emailConfirmedAt?: string;
  phoneConfirmedAt?: string;
  lastSignInAt?: string;
  createdAt: string;
  updatedAt: string;
  isAnonymous: boolean;
  appMetadata: {
    provider?: string;
    providers?: string[];
  };
  userMetadata: {
    [key: string]: string;
  };
  identities?: Array<{
    id: string;
    userId: string;
    identityData: {
      [key: string]: string;
    };
    provider: string;
    createdAt: string;
    updatedAt: string;
  }>;
  // Related profiles count
  profilesCount: number;
}

export interface AuthUserStatsDTO {
  totalUsers: number;
  confirmedUsers: number;
  unconfirmedUsers: number;
  activeUsersToday: number;
  newUsersThisMonth: number;
  usersByProvider: {
    email: number;
    google: number;
    facebook: number;
    apple: number;
    phone: number;
    anonymous: number;
  };
}

export interface AuthUsersDataDTO {
  users: AuthUserDTO[];
  stats: AuthUserStatsDTO;
  totalCount: number;
  currentPage: number;
  perPage: number;
}
