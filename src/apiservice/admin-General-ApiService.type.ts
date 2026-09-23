// Admin Dashboard

export interface IAdminDashboardAPI {
  status: number;
  message: string;
  data: IAdminDashboardData;
}

export interface IAdminDashboardData {
  revenue: Revenue;
  upcomingRevenue: UpcomingRevenue[];
  upcomingRevenuePeriods: RevenuePeriod[];
  overdueRevenuePeriods: RevenuePeriod[];
  occupancyRate: OccupancyRate;
  cashFlow: CashFlow[];
  cashProjection: CashProjection[];
  cashFlowSummary: CashFlowSummary[];
  cashProjectionSummary: CashProjectionSummary[];
}

export interface RevenuePeriod {
  year: number;
  month: number;
  period: string;
  totalAmount: number;
  revenues: Revenue2[];
}

export interface Revenue2 {
  buildingId: number;
  building: Building2;
  apartmentId: number;
  apartment: Apartment2;
  tenantId: number;
  tenant: Tenant;
  amount: number;
  expectedDate: string;
}

export interface Tenant {
  id: number;
  fullName: string;
}

export interface Building2 {
  id: number;
  title: string;
}

export interface Apartment2 {
  id: number;
  title: string;
}

export interface Revenue {
  totalRevenue: number;
  amountCollected: number;
  extraCharges: number;
  currentYear: CurrentYear;
  apartmentDetails: ApartmentDetails;
}

export interface ApartmentDetails {
  total: number;
  noOfPaid: number;
  noOfUnpaid: number;
}

export interface CurrentYear {
  totalRevenue: number;
  amountCollected: number;
  extraCharges: number;
}

export interface UpcomingRevenue {
  buildingId: number;
  building: Building;
  apartmentId: number;
  apartment: Apartment;
  amount: number;
  expectedDate: string;
}

export interface Building {
  id: number;
  title: string;
}

export interface Apartment {
  id: number;
  title: string;
}

export interface OccupancyRate {
  noOfApartments: number;
  noOfOccupied: number;
  noOfEmpty: number;
}

export interface CashFlow {
  id: number;
  dateName: string;
  revenueAmount: number;
  costAmount: number;
  startDate: string;
  endDate: string;
}

export interface CashProjection {
  id: number;
  dateName: string;
  amount: number;
  startDate: string;
  endDate: string;
}

export interface CashFlowSummary {
  buildingId?: number;
  buildingTitle?: string;
  apartmentId: number;
  apartmentTitle?: string;
  year: number;
  title: string;
  amount: number;
  typeId: number;
  type: string;
  entryId: number;
  entry: string;
  date: string;
  dateModified: string;
  dateCreated: string;
}

export interface CashProjectionSummary {
  buildingId: number;
  title: string;
  amount: number;
  year: number;
  date: string;
}

// Admin Buildings
export interface IAdminBuildings {
  status: number;
  message: string;
  data: IAdminBuildingsData[];
  meta: Meta;
}

export interface IAdminBuildingsData {
  id: number;
  title: string;
  description: string;
  price: number;
  serviceCharge: number;
  noOfApartments: number;
  imageUrl: string;
  dateModified: string;
  dateCreated: string;
}

export interface Meta {
  total: number;
}

// Admin Apartments
export interface IAdminApartment {
  status: number;
  message: string;
  data: IAdminApartmentData[];
  meta: Meta;
}

export interface IAdminApartmentData {
  id: number;
  title: string;
  price: number;
  serviceCharge: number;
  isOccupied: boolean;
  buildingId?: number;
  currentOccupant?: CurrentOccupant;
  dateModified: string;
  dateCreated: string;
}

export interface CurrentOccupant {
  id: number;
  expired: boolean;
  startDate: string;
  endDate: string;
  tenantId: number;
  tenant: IAdminTenantsData;
  apartmentId: number;
  amountPaid: number;
  active: boolean;
  dateModified: string;
  dateCreated: string;
}

export interface Meta {
  total: number;
}

// Admin  Admins Users
export interface IAdminUsers {
  status: number;
  message: string;
  data: IAdminUsersData[];
  meta: Meta;
}

export interface IAdminUsersData {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  dpUrl: any;
  phoneNumber?: string;
  adminRoleId: number;
  adminRole: AdminRole;
  isSystemAdmin: boolean;
  blocked: boolean;
  dateModified: string;
  dateCreated: string;
}

export interface AdminRole {
  id: number;
  title: string;
}

export interface Meta {
  total: number;
}

// Admin User Roles
export interface IAdminUserRoles {
  status: number;
  message: string;
  data: IAdminUserRolesData[];
  meta: Meta;
}

export interface IAdminUserRolesData {
  id: number;
  title: string;
  dateModified: string;
  dateCreated: string;
}

export interface Meta {
  total: number;
}

// Admin Tenants

export interface IAdminTenants {
  status: number;
  message: string;
  data: IAdminTenantsData[];
  meta: Meta;
}

export interface IAdminTenantsData {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  gender?: string;
  address: string;
  maritalStatus?: string;
  religion?: string;
  nin?: string;
  reason: string;
  noOfOccupants: number;
  noOfVehicles: number;
  aggrementFormUrl: any;
  dpUrl: any;
  activated: boolean;
  activeOccupant?: any;
  blocked: boolean;
  tenantGuarantors: TenantGuarantor[];
  dateModified: string;
  dateCreated: string;
}

export interface TenantGuarantor {
  id: number;
  fullName?: string;
  address?: string;
  phoneNumber?: string;
  occupation?: string;
}

export interface Meta {
  total: number;
}

// Admin Occupant

export type IAdminOccupant = {
  status: number;
  message: string;
  data: IAdminOccupantData[];
  meta: IAdminOccupantMeta;
};

export type IAdminOccupantData = {
  id: number;
  tenantId: number;
  tenant: IAdminTenantsData;
  apartmentId?: number;
  amountPaid?: number;
  expired: boolean;
  active?: boolean;
  startDate: string; // This should ideally be a Date object if you're parsing dates
  endDate: string; // This should ideally be a Date object if you're parsing dates
  dateModified?: string; // This should ideally be a Date object if you're parsing dates
  dateCreated?: string; // This should ideally be a Date object if you're parsing dates
};

export type IAdminOccupantMeta = {
  total: number;
};

//Admin Add Tenant Result
export interface IAdminAddTenantResult {
  status: number;
  message: string;
  data: IAdminTenantsData;
  meta: Meta;
}

export interface Meta {
  tenantPassword: string;
}

// Admin Apartment Cost

export interface IApartmentCost {
  status: number;
  message: string;
  data: IApartmentCostData[];
  meta: Meta;
}

export interface IApartmentCostData {
  id: number;
  title: string;
  amount: number;
  apartmentId: number;
  dateIssued: string;
  dateModified: string;
  dateCreated: string;
}

export interface Meta {
  total: number;
}

// Settings
export interface IAdminSettings {
  success: boolean;
  statusCode: number;
  message: string;
  data: IAdminSettingsData;
}

export interface IAdminSettingsData {
  accountNumber: any;
  accountName: any;
  bankName: any;
}

// Pending Rent Payment

export interface IPendingRentPayment {
  success: boolean;
  statusCode: number;
  message: string;
  data: IPendingRentPaymentData[];
  meta: Meta;
}

export interface IPendingRentPaymentData {
  id: number;
  amount: number;
  netAmount: number;
  serviceCharge: number;
  amountPaid?: number;
  tenantId: number;
  tenant: Tenant;
  apartmentId: number;
  apartment: Apartment;
  paymentVerified: boolean;
  paymentStatusId: number;
  paymentStatus: string;
  paymentReceivedAt?: string;
  paymentReference?: string;
  paymentGateway?: string;
  dateModified: string;
  dateCreated: string;
}

export interface Tenant {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface Apartment {
  id: number;
  title: string;
  building: Building;
}

export interface Building {
  id: number;
  title: string;
}

export interface Meta {
  total: number;
}

export interface Meta {
  total: number;
}

// Notifications

export interface INotifications {
  status: number;
  message: string;
  data: INotificationsData[];
  meta: Meta;
}

export interface INotificationsData {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  dateModified: string;
  dateCreated: string;
}

export interface Meta {
  total: number;
}
