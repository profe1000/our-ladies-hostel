import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  InboxOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Pagination, Result, Spin } from "antd";
import { adminGetApartmentRequestsApi } from "../../../apiservice/admin-General-ApiService";
import { IAdminApartmentRequestData } from "../../../apiservice/admin-General-ApiService.type";
import { convertToShortDate } from "../../../utils/date.utils";
import { ILoadState } from "../../../utils/loading.utils.";
import {
  cleanFilter,
  getInitials,
  getRequestName,
  getRequestStatus,
  getRequestStatusClass,
  getRequestStatusLabel,
  requestStatuses,
} from "./tenantRequest.utils";
import "./adminTenantRequests.css";

const pageSize = 12;

export const AdminTenantRequestList = () => {
  const [loadState, setLoadState] = useState<ILoadState>("loading");
  const [requests, setRequests] = useState<IAdminApartmentRequestData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusId, setStatusId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchString, setSearchString] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const navigate = useNavigate();

  // Wait until the admin stops typing before searching
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchString(searchInput.trim());
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Load the requests whenever a filter or the page changes
  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");

    adminGetApartmentRequestsApi(
      cleanFilter({
        statusId,
        searchString,
        page: currentPage,
        pageSize,
        sort: "dateCreated",
        order: "desc",
      })
    )
      .then((response) => {
        if (cancelled) return;
        const data: IAdminApartmentRequestData[] = response?.data || [];
        setRequests(data);
        setTotalItems(response?.meta?.total ?? data.length);
        setLoadState(data.length ? "completed" : "noData");
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Error fetching tenant requests:", error);
        setLoadState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [statusId, searchString, currentPage, reloadKey]);

  const changeStatusFilter = (value: string) => {
    setStatusId(value);
    setCurrentPage(1);
  };

  return (
    <div className="w3-content adminPageBody">
      {/* Page Header */}
      <div className="adminSectionHeader">
        <div>
          <h2 className="adminSectionTitle myfont5">
            Tenant Requests
            {loadState !== "loading" && loadState !== "error" && (
              <span className="adminCountBadge">{totalItems}</span>
            )}
          </h2>
          <p className="adminSectionSub myfont1">
            Review apartment requests and accept or reject them.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="adminPanel reqFilters">
        <div className="reqSearch">
          <SearchOutlined className="reqSearchIcon" />
          <input
            type="search"
            aria-label="Search tenant requests"
            className="w3-input w3-text-white adminInput reqSearchInput"
            placeholder="Search by name, email or phone"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>
        <div className="reqChips" role="group" aria-label="Filter by status">
          {["", ...requestStatuses].map((status) => (
            <button
              key={status || "all"}
              type="button"
              aria-pressed={statusId === status}
              onClick={() => changeStatusFilter(status)}
              className={`reqChip myfont1 ${
                statusId === status ? "reqChipActive" : ""
              }`}
            >
              {status ? getRequestStatusLabel(status) : "All"}
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
              Sorry, we could not load the tenant requests.
            </span>
          }
          extra={
            <Button
              type="primary"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              Reload
            </Button>
          }
        />
      )}

      {/* Empty */}
      {loadState === "noData" && (
        <div className="adminPanel adminEmpty">
          <span className="adminEmptyIcon">
            <InboxOutlined />
          </span>
          <p className="myfont1">
            {statusId || searchString
              ? "No tenant requests match your filters."
              : "No tenant requests yet."}
          </p>
        </div>
      )}

      {/* Requests */}
      {loadState === "completed" && (
        <>
          {requests.map((request) => {
            const name = getRequestName(request);
            const status = getRequestStatus(request);
            const apartmentTitle = request?.apartment?.title;
            const buildingTitle =
              request?.building?.title || request?.apartment?.building?.title;
            const buildingImageUrl =
              request?.building?.imageUrl ||
              request?.apartment?.building?.imageUrl;
            return (
              <div
                key={request.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/admin/tenant-requests/${request.id}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    navigate(`/admin/tenant-requests/${request.id}`);
                  }
                }}
                className="adminListRow adminListRowClickable"
              >
                {buildingImageUrl ? (
                  <img
                    className="reqListBuildingImage"
                    src={buildingImageUrl}
                    alt={buildingTitle || "Building"}
                  />
                ) : (
                  <span className="adminAvatar">
                    {getInitials(name) || "?"}
                  </span>
                )}
                <div className="adminListMain">
                  <h5 className="adminListTitle myfont3">{name}</h5>
                  <p className="adminListSub myfont1">
                    {request.email}
                    {request.phoneNumber && ` · ${request.phoneNumber}`}
                  </p>
                  {(apartmentTitle || buildingTitle || request.apartmentId) && (
                    <p className="adminListSub myfont1">
                      <HomeOutlined />{" "}
                      {[buildingTitle, apartmentTitle].filter(Boolean).join(
                        " · "
                      ) || `Apartment #${request.apartmentId}`}
                    </p>
                  )}
                </div>
                <div className="adminListAside">
                  <span
                    className={`adminStatusPill myfont1 ${getRequestStatusClass(
                      status
                    )}`}
                  >
                    {getRequestStatusLabel(status)}
                  </span>
                  {request.dateCreated && (
                    <p className="adminListSub myfont1 reqDate">
                      {convertToShortDate(request.dateCreated)}
                    </p>
                  )}
                </div>
                <RightOutlined className="adminListChevron" />
              </div>
            );
          })}

          {totalItems > pageSize && (
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
        </>
      )}
    </div>
  );
};

export default AdminTenantRequestList;
