import { IAdminApartmentRequestData } from "../../../apiservice/admin-General-ApiService.type";

// Status values accepted by `PATCH apartment-requests/:id/status`.
// "Completed" is set by the server once the tenant's payment is accepted.
export const requestStatuses = ["Pending", "Accepted", "Rejected", "Completed"];

// Matches the server's ApartmentRequestStatus enum
const statusNamesById = ["Pending", "Accepted", "Rejected", "Completed"];

// The API may return the status as a string, an id or an object
export const getRequestStatus = (request?: IAdminApartmentRequestData) => {
  const status = request?.status;
  if (status && typeof status === "object") {
    return String(status.name ?? status.id ?? "Pending");
  }
  if (status || request?.statusName) {
    return String(status || request?.statusName);
  }
  const statusId = request?.statusId;
  if (typeof statusId === "number") {
    return statusNamesById[statusId] ?? "Pending";
  }
  return String(statusId ?? "Pending");
};

// Accepted requests wait for the tenant to pay, then become Completed
export const getRequestStatusLabel = (status: string) => {
  const value = status.toLowerCase();
  if (value.startsWith("accept")) return "Awaiting Payment";
  if (value.startsWith("complet")) return "Paid";
  return status;
};

export const getRequestStatusClass = (status: string) => {
  const value = status.toLowerCase();
  if (value.startsWith("complet")) {
    return "adminStatusVacant";
  }
  if (value.startsWith("reject") || value.startsWith("declin")) {
    return "adminStatusDue";
  }
  return "adminStatusOccupied";
};

export const getRequestName = (request?: IAdminApartmentRequestData) =>
  request?.fullName ||
  request?.tenantFullName ||
  [request?.firstName, request?.lastName].filter(Boolean).join(" ") ||
  request?.email ||
  `Request #${request?.id ?? ""}`;

export const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

// Drop empty values so they are not sent as "undefined" in the query string
export const cleanFilter = (filter: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(filter).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );
