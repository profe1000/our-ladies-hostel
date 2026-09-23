//  Tenant Buildings Type

export interface ITenantBuildings {
  status: number;
  message: string;
  data: ITenantBuildingsData[];
  meta: Meta;
}

export interface ITenantBuildingsData {
  id: number;
  title: string;
  description: string;
  price: number;
  noOfApartments: number;
  imageUrl: string;
  dateModified: string;
  dateCreated: string;
}

export interface Meta {
  total: number;
}

//  Tenant Apartments Type
export interface ITenantApartment {
  status: number;
  message: string;
  data: ITenantApartmentData[];
  meta: Meta;
}

export interface ITenantApartmentData {
  id: number;
  title: string;
  price: number;
  isOccupied: boolean;
  buildingId?: number;
  dateModified: string;
  dateCreated: string;
}

export interface Meta {
  total: number;
}

//Tenant Registration
export interface ITenantRegistration {
  status: number;
  data: ITenantRegistrationData;
}

export interface ITenantRegistrationData {
  token: string;
  credentials: Credentials;
}

export interface Credentials {
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
}

// Tenant Payment Api
export interface ITenantPaymentResult {
  status: number;
  message: string;
  paystackMetadata: PaystackMetadata;
}

export interface PaystackMetadata {
  rentPaymentId: number;
  paymentOption: string;
}

// Tenant Payment Request

export interface ITenantRentPaymentDetailsApi {
  status: number;
  message: string;
  data: ITenantRentPaymentDetailsApiData;
}

export interface ITenantRentPaymentDetailsApiData {
  total: number;
  details: Details;
}

export interface Details {
  "Apartment Price"?: number;
  "Legal Fee"?: number;
  "Caution Fee"?: number;
  "Service Charge"?: number;
}

// Settings

export interface IUsersSettings {
  success: boolean;
  statusCode: number;
  message: string;
  data: IUserSettingsData;
}

export interface IUserSettingsData {
  accountNumber: any;
  accountName: any;
  bankName: any;
}
