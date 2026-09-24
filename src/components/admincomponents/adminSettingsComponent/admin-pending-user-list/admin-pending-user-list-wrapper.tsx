import { useState } from "react";
import { AdminPendingUsersList } from "./admin-pending-user-list";
import "./admin-pending-user-list.css";

export const AdminPendingUsersListWrapper = () => {
  const [totalPending, setTotalPending] = useState<number | null>(null);

  return (
    <>
      <div className="w3-content adminPageBody">
        {/* Page Header */}
        <div className="adminSectionHeader">
          <div>
            <h2 className="adminSectionTitle myfont5">
              Pending Payments
              {totalPending !== null && (
                <span className="adminCountBadge">{totalPending}</span>
              )}
            </h2>
            <p className="adminSectionSub myfont1">
              Tenants who say they have paid. Check your bank account, then
              confirm or decline each payment.
            </p>
          </div>
        </div>

        <AdminPendingUsersList
          initialDefaultFilter={{
            sort: "dateCreated",
            order: "desc",
            paymentStatusId: 0,
            perPage: 10,
          }}
          hidePagination={false}
          onTotalChange={setTotalPending}
        ></AdminPendingUsersList>
      </div>
    </>
  );
};

export default AdminPendingUsersListWrapper;
