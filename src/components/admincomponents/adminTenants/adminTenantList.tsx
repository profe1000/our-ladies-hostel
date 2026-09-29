import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  HomeOutlined,
  RightOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Pagination, Result, Spin } from "antd";
import {
  adminGetBuildingsApi,
  adminGetOccupantApi,
  adminGetTenantsApi,
} from "../../../apiservice/admin-General-ApiService";
import {
  IAdminBuildingsData,
  IAdminOccupantData,
  IAdminTenancyApartment,
  IAdminTenantsData,
} from "../../../apiservice/admin-General-ApiService.type";
import { formatCurrency } from "../../../utils/basic.utils";
import { convertToShortDate } from "../../../utils/date.utils";
import { ILoadState } from "../../../utils/loading.utils.";
import { cleanFilter, getInitials } from "../adminTenantRequests/tenantRequest.utils";
import "../adminTenantRequests/adminTenantRequests.css";
import "./adminTenants.css";

const pageSize = 12;

type ITab = "tenants" | "occupancies";

// Status chips per tab. `filter` is sent to the API
type IStatusOption = {
  key: string;
  label: string;
  filter: Record<string, string | boolean>;
};

const tenantStatuses: IStatusOption[] = [
  { key: "", label: "All", filter: {} },
  { key: "active", label: "Rent active", filter: { status: "active" } },
  { key: "due", label: "Rent due", filter: { status: "due" } },
  { key: "none", label: "No apartment", filter: { status: "none" } },
  { key: "inactive", label: "Not activated", filter: { status: "inactive" } },
];

const occupancyStatuses: IStatusOption[] = [
  { key: "", label: "All", filter: {} },
  { key: "current", label: "Current", filter: { active: true, expired: false } },
  { key: "due", label: "Rent due", filter: { active: true, expired: true } },
  { key: "ended", label: "Ended", filter: { active: false } },
];

// "Hostel A · Room 3"
const getApartmentName = (apartment?: IAdminTenancyApartment) =>
  [apartment?.building?.title, apartment?.title].filter(Boolean).join(" · ");

export const AdminTenantList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: ITab =
    searchParams.get("tab") === "occupancies" ? "occupancies" : "tenants";

  const [loadState, setLoadState] = useState<ILoadState>("loading");
  const [tenants, setTenants] = useState<IAdminTenantsData[]>([]);
  const [occupancies, setOccupancies] = useState<IAdminOccupantData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [sharedOnly, setSharedOnly] = useState(false);
  const [buildings, setBuildings] = useState<IAdminBuildingsData[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchString, setSearchString] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const navigate = useNavigate();
  const statuses = tab === "tenants" ? tenantStatuses : occupancyStatuses;

  // Buildings for the building filter
  useEffect(() => {
    adminGetBuildingsApi({ pageSize: 100 })
      .then((response) => setBuildings(response?.data || []))
      .catch((error) => console.error("Error fetching buildings:", error));
  }, []);

  // Wait until the admin stops typing before searching
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchString(searchInput.trim());
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Load the list whenever the tab, a filter or the page changes
  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");

    const statusFilter =
      statuses.find((option) => option.key === status)?.filter || {};
    const filter = cleanFilter({
      ...statusFilter,
      searchString,
      buildingId,
      hasSecondaryOccupant: sharedOnly ? true : "",
      page: currentPage,
      pageSize,
      sort: tab === "tenants" ? "DateCreated" : "StartDate",
      order: "desc",
    });

    const request =
      tab === "tenants" ? adminGetTenantsApi(filter) : adminGetOccupantApi(filter);

    request
      .then((response) => {
        if (cancelled) return;
        const data = response?.data || [];
        if (tab === "tenants") setTenants(data);
        else setOccupancies(data);
        setTotalItems(response?.meta?.total ?? data.length);
        setLoadState(data.length ? "completed" : "noData");
      })
      .catch((error) => {
        if (cancelled) return;
        console.error(`Error fetching ${tab}:`, error);
        setLoadState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [tab, status, buildingId, sharedOnly, searchString, currentPage, reloadKey]);

  const changeTab = (value: ITab) => {
    setSearchParams(value === "tenants" ? {} : { tab: value });
    // Status options differ per tab
    setStatus("");
    setCurrentPage(1);
  };

  const changeFilter = (update: () => void) => {
    update();
    setCurrentPage(1);
  };

  const openTenant = (tenantId?: number) => {
    if (tenantId) navigate(`/admin/tenants/${tenantId}`);
  };

  const hasFilters = !!(status || buildingId || sharedOnly || searchString);

  const renderRow = (
    key: number,
    tenantId: number | undefined,
    name: string,
    lines: React.ReactNode[],
    pill: { label: string; className: string },
    aside: React.ReactNode,
    shared?: boolean
  ) => (
    <div
      key={key}
      role="button"
      tabIndex={0}
      onClick={() => openTenant(tenantId)}
      onKeyDown={(event) => {
        if (event.key === "Enter") openTenant(tenantId);
      }}
      className="adminListRow adminListRowClickable"
    >
      <span className="adminAvatar">{getInitials(name) || <UserOutlined />}</span>
      <div className="adminListMain">
        <h5 className="adminListTitle myfont3">
          {name}
          {shared && (
            <span className="tenantSharedTag myfont1">
              <TeamOutlined /> Shared
            </span>
          )}
        </h5>
        {lines.filter(Boolean).map((line, index) => (
          <p key={index} className="adminListSub myfont1">
            {line}
          </p>
        ))}
      </div>
      <div className="adminListAside">
        <span className={`adminStatusPill myfont1 ${pill.className}`}>
          {pill.label}
        </span>
        {aside}
      </div>
      <RightOutlined className="adminListChevron" />
    </div>
  );

  const getTenantPill = (tenant: IAdminTenantsData) => {
    const occupant = tenant.activeOccupant;
    if (!tenant.activated) return { label: "Not activated", className: "adminStatusDue" };
    if (!occupant) return { label: "No apartment", className: "" };
    if (occupant.expired) return { label: "Rent due", className: "adminStatusDue" };
    return { label: "Rent active", className: "adminStatusVacant" };
  };

  const getOccupancyPill = (occupancy: IAdminOccupantData) => {
    if (!occupancy.active) return { label: "Ended", className: "" };
    if (occupancy.expired) return { label: "Rent due", className: "adminStatusDue" };
    return { label: "Current", className: "adminStatusVacant" };
  };

  return (
    <div className="w3-content adminPageBody">
      {/* Page Header */}
      <div className="adminSectionHeader">
        <div>
          <h2 className="adminSectionTitle myfont5">
            {tab === "tenants" ? "Tenants" : "Occupancies"}
            {loadState !== "loading" && loadState !== "error" && (
              <span className="adminCountBadge">{totalItems}</span>
            )}
          </h2>
          <p className="adminSectionSub myfont1">
            {tab === "tenants"
              ? "Everyone who has registered or been added as a tenant."
              : "Every tenancy: who stayed where, when, and what they paid."}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="reqChips tenantTabs" role="tablist">
        {(["tenants", "occupancies"] as ITab[]).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => changeTab(value)}
            className={`reqChip myfont1 ${tab === value ? "reqChipActive" : ""}`}
          >
            {value === "tenants" ? <UserOutlined /> : <HomeOutlined />}{" "}
            {value === "tenants" ? "Tenants" : "Occupancies"}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="adminPanel reqFilters">
        <div className="reqSearch">
          <SearchOutlined className="reqSearchIcon" />
          <input
            type="search"
            aria-label={`Search ${tab}`}
            className="w3-input w3-text-white adminInput reqSearchInput"
            placeholder={
              tab === "tenants"
                ? "Search by name, email, phone or matric number"
                : "Search by tenant name, email or phone"
            }
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>
        <div className="tenantFilterRow">
          <select
            aria-label="Filter by building"
            value={buildingId}
            onChange={(event) =>
              changeFilter(() => setBuildingId(event.target.value))
            }
            className="w3-input w3-text-white adminInput tenantBuildingSelect myfont1"
          >
            <option value="">All buildings</option>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            aria-pressed={sharedOnly}
            onClick={() => changeFilter(() => setSharedOnly(!sharedOnly))}
            className={`reqChip myfont1 ${sharedOnly ? "reqChipActive" : ""}`}
          >
            <TeamOutlined /> Shared only
          </button>
        </div>
        <div className="reqChips" role="group" aria-label="Filter by status">
          {statuses.map((option) => (
            <button
              key={option.key || "all"}
              type="button"
              aria-pressed={status === option.key}
              onClick={() => changeFilter(() => setStatus(option.key))}
              className={`reqChip myfont1 ${
                status === option.key ? "reqChipActive" : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loadState === "loading" && (
        <div className="w3-col w3-center" style={{ padding: "60px 0" }}>
          <Spin size="large" />
        </div>
      )}

      {/* Error */}
      {loadState === "error" && (
        <Result
          status="500"
          title={<span className="w3-text-white">Error</span>}
          subTitle={
            <span className="w3-text-white">
              Sorry, we could not load the {tab}.
            </span>
          }
          extra={
            <Button type="primary" onClick={() => setReloadKey((key) => key + 1)}>
              Reload
            </Button>
          }
        />
      )}

      {/* Empty */}
      {loadState === "noData" && (
        <div className="adminPanel adminEmpty">
          <span className="adminEmptyIcon">
            <UserOutlined />
          </span>
          <p className="myfont1">
            {hasFilters ? `No ${tab} match your filters.` : `No ${tab} yet.`}
          </p>
        </div>
      )}

      {/* Tenants */}
      {loadState === "completed" &&
        tab === "tenants" &&
        tenants.map((tenant) => {
          const occupant = tenant.activeOccupant;
          const apartmentName = getApartmentName(occupant?.apartment);
          return renderRow(
            tenant.id,
            tenant.id,
            tenant.fullName,
            [
              [tenant.email, tenant.phoneNumber].filter(Boolean).join(" · "),
              apartmentName && (
                <>
                  <HomeOutlined /> {apartmentName}
                </>
              ),
              tenant.hasSecondaryOccupant && tenant.secondaryFullName && (
                <>
                  <TeamOutlined /> {tenant.secondaryFullName}
                </>
              ),
            ],
            getTenantPill(tenant),
            occupant?.endDate && (
              <p className="adminListSub myfont1 reqDate">
                Due {convertToShortDate(occupant.endDate)}
              </p>
            ),
            tenant.hasSecondaryOccupant
          );
        })}

      {/* Occupancies */}
      {loadState === "completed" &&
        tab === "occupancies" &&
        occupancies.map((occupancy) => {
          const apartmentName = getApartmentName(occupancy.apartment);
          return renderRow(
            occupancy.id,
            occupancy.tenantId,
            occupancy.tenant?.fullName || `Tenant #${occupancy.tenantId}`,
            [
              apartmentName && (
                <>
                  <HomeOutlined /> {apartmentName}
                </>
              ),
              `${occupancy.startDate ? convertToShortDate(occupancy.startDate) : "-"} to ${
                occupancy.endDate ? convertToShortDate(occupancy.endDate) : "-"
              }`,
              occupancy.hasSecondaryOccupant &&
                occupancy.tenant?.secondaryFullName && (
                  <>
                    <TeamOutlined /> {occupancy.tenant.secondaryFullName}
                  </>
                ),
            ],
            getOccupancyPill(occupancy),
            occupancy.amountPaid !== undefined && occupancy.amountPaid !== null && (
              <p className="adminListSub myfont1 reqDate">
                {formatCurrency(occupancy.amountPaid)}
              </p>
            ),
            occupancy.hasSecondaryOccupant
          );
        })}

      {loadState === "completed" && totalItems > pageSize && (
        <div className="adminPagination">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            showSizeChanger={false}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default AdminTenantList;
