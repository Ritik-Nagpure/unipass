export interface DashboardStats {
  totalApps: number;
  connectedApps: number;
  availableApps: number;
  totalUsers?: number;
}

export interface DashboardActivity {
  id: number;
  action: string;
  resource?: string;
  details?: any;
  createdAt: string;
  user?: {
    id: number;
    name?: string | null;
    email: string;
  };
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: DashboardActivity[];
  connectedApps: any[];
  availableApps: any[];
}