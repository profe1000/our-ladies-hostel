export interface IAuthType {
  status?: number;
  data?: IData;
}

export interface IData {
  token: string;
  credentials: ICredentials;
}

export interface ICredentials {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  gender: string;
  address: string;
  maritalStatus: string;
  religion: string;
  reason: string;
  noOfOccupants: number;
  noOfVehicles: number;
  agreementFormUrl: any;
  dpUrl: string;
  activated: boolean;
  blocked: boolean;
  activeOccupant: ActiveOccupant;
  tenantGuarantors: TenantGuarantor[];
}
export interface ActiveOccupant {
  id: number;
  apartmentId: number;
  amountPaid: number;
  expired: boolean;
  active: boolean;
  startDate: string;
  endDate: string;
}

export interface TenantGuarantor {
  id: number;
  fullName?: string;
  address?: string;
  phoneNumber?: string;
  occupation?: string;
}
