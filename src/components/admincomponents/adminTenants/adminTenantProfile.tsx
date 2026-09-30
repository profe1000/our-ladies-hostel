import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HistoryOutlined, HomeOutlined, TeamOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import {
  adminGetOccupantApi,
  adminLoginAsTenantApi,
} from "../../../apiservice/admin-General-ApiService";
import { IAdminOccupantData } from "../../../apiservice/admin-General-ApiService.type";
import { formatCurrency } from "../../../utils/basic.utils";
import { convertToShortDate } from "../../../utils/date.utils";
import AdminTenantDetails from "../adminApartmentsUnitcomp/admin-tenant-detail/admin-tenant-detail";
import "../adminContextHeader/adminContextHeader.css";
import "./adminTenants.css";
import LoginAsButton from "../../../pages/saaspages/admin/LoginAsButton";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import { RootState } from "../../../Redux/store";
import { isSuperAdminRole } from "../../../utils/admin.utils";

// A tenant's details, documents and every tenancy they have had
export const AdminTenantProfile = () => {
  const params = useParams();
  const [occupancies, setOccupancies] = useState<IAdminOccupantData[]>();
  const adminAuthData: any = useAppSelector((state: RootState) => state?.AdminAuthData);
  const isSuperAdmin = isSuperAdminRole(adminAuthData?.data?.credentials?.adminRole);

  useEffect(() => {
    let cancelled = false;
    setOccupancies(undefined);
    adminGetOccupantApi({
      tenantId: params?.id,
      sort: "StartDate",
      order: "desc",
      pageSize: 50,
    })
      .then((response) => {
        if (!cancelled) setOccupancies(response?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching tenancies:", error);
        if (!cancelled) setOccupancies([]);
      });
    return () => {
      cancelled = true;
    };
  }, [params?.id]);

  const activeOccupancy = occupancies?.find((occupancy) => occupancy.active);

  return (
    <div className="w3-content adminPageBody">
      <nav className="adminCtxCrumbs myfont1" aria-label="Breadcrumb">
        <Link to="/admin/tenants">Tenants</Link>
        <span className="adminCtxCrumbSep">›</span>
        <span className="adminCtxCrumbCurrent">Details</span>
      </nav>

      {/* See the app as this tenant sees it, without their password */}
      {isSuperAdmin && params?.id && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <LoginAsButton
            isAdmin={false}
            size="middle"
            label="Login as tenant"
            start={(readOnly) => adminLoginAsTenantApi(params.id!, { readOnly })}
          />
        </div>
      )}

      <AdminTenantDetails
        tenantId={params?.id}
        occupant={activeOccupancy || {}}
      ></AdminTenantDetails>

      {/* Tenancy history */}
      <div className="adminPanel">
        <div className="adminPanelHeader">
          <h3 className="adminPanelTitle myfont3">
            <span className="adminPanelIcon">
              <HistoryOutlined />
            </span>
            Tenancy History
          </h3>
        </div>

        {occupancies === undefined && (
          <div className="w3-center" style={{ padding: "24px 0" }}>
            <Spin />
          </div>
        )}

        {occupancies?.length === 0 && (
          <p className="adminListSub myfont1">No tenancies yet.</p>
        )}

        {occupancies?.map((occupancy) => (
          <div key={occupancy.id} className="tenantHistoryRow myfont1">
            <div>
              <p className="adminListTitle myfont3">
                <HomeOutlined />{" "}
                {[occupancy.apartment?.building?.title, occupancy.apartment?.title]
                  .filter(Boolean)
                  .join(" · ") || `Apartment #${occupancy.apartmentId}`}
                {occupancy.hasSecondaryOccupant && (
                  <span className="tenantSharedTag">
                    <TeamOutlined /> Shared
                  </span>
                )}
              </p>
              <p className="adminListSub">
                {occupancy.startDate ? convertToShortDate(occupancy.startDate) : "-"}{" "}
                to {occupancy.endDate ? convertToShortDate(occupancy.endDate) : "-"}
                {occupancy.source && ` · via ${occupancy.source === "RentPayment" ? "payment" : occupancy.source.toLowerCase()}`}
              </p>
            </div>
            <div className="adminListAside">
              <span
                className={`adminStatusPill ${
                  !occupancy.active
                    ? ""
                    : occupancy.expired
                    ? "adminStatusDue"
                    : "adminStatusVacant"
                }`}
              >
                {!occupancy.active ? "Ended" : occupancy.expired ? "Rent due" : "Current"}
              </span>
              {occupancy.amountPaid !== undefined && occupancy.amountPaid !== null && (
                <p className="adminListSub reqDate">
                  {formatCurrency(occupancy.amountPaid)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTenantProfile;
