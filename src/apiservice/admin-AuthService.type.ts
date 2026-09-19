// Admin Auth Data
export interface IAdminAuthType {
  status?: number;
  data?: IAdminTypeData;
}

export interface IAdminTypeData {
  token: string;
  credentials: ICredentials;
}

export interface ICredentials {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dpUrl: string;
  phoneNumber: string;
  isSystemAdmin: boolean;
  adminRole: AdminRole;
  buildings: Building[];
  years: number[];
}

export interface AdminRole {
  id: number;
  title: string;
}

export interface Building {
  id: number;
  title: string;
}
