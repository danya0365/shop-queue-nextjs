export type ProfileRole = 'user' | 'moderator' | 'admin';

export interface Profile {
  id: string;
  authId: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  role: ProfileRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileCreate {
  authId: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  role?: ProfileRole;
  isActive?: boolean;
}

export interface ProfileUpdate {
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  isActive?: boolean;
}
