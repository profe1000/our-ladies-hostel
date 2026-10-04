/**
 * Every estate has its own roles, so only the original estate's Super Admin has role id 1.
 * Newer servers send isSuperAdmin; the id check keeps older sessions working
 */
export const isSuperAdminRole = (adminRole?: { id?: number; isSuperAdmin?: boolean } | null) =>
  adminRole?.isSuperAdmin ?? adminRole?.id === 1;
