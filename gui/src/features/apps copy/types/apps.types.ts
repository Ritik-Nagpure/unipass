export interface Application {
  id: number;
  clientId: string;
  clientSecret: string;
  name: string;
  description?: string | null;
  redirectUri: string;
  logo?: string | null;
  website?: string | null;
  isActive: boolean;
  isPublic: boolean;
  scopes: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
}

export interface UserAppAccess {
  id: number;
  userId: number;
  applicationId: number;
  isActive: boolean;
  grantedAt: string;
  revokedAt?: string | null;
  lastAccessed?: string | null;
}

export interface UserApps {
  connected: Application[];
  available: Application[];
}

export interface CreateAppData {
  name: string;
  description?: string;
  redirectUri: string;
  website?: string;
  logo?: string;
  scopes?: string[];
}

export interface UpdateAppData extends Partial<CreateAppData> {}