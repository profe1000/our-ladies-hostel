"use client";

import type React from "react";
import { useState } from "react";
import "./adminChart_tw.css";
import { CloseOutlined } from "@ant-design/icons";
import type {
  IAdminDashboardData,
  RevenuePeriod,
} from "../../../apiservice/admin-General-ApiService.type";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import type { RootState } from "../../../Redux/store";

import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import { appZIndex } from "../../../utils/appconst";
import { adminExtendOccupantApi } from "../../../apiservice/admin-General-ApiService";

type RevenueGridOverDueProps = {
  onSuccess?: (message: string) => void;
  onFailure?: (message: string) => void;
};

const RevenueGridOverDue: React.FC<RevenueGridOverDueProps> = ({
  onSuccess,
  onFailure,
}) => {
  const adminDashboardData: IAdminDashboardData = useAppSelector(
    (state: RootState) => state?.AdminDashBoardData
  );
  const [selectedPeriod, setSelectedPeriod] = useState<RevenuePeriod | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { confirm } = Modal;

  const showExtendOccupantApiConfirm = (index: number) => {
    confirm({
      title:
        "Are you sure you want to Renew (Extend) this Occupant in this Apartment, This cannot be undone",
      icon: <ExclamationCircleFilled rev={undefined} />,
      content: "",
      centered: true,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      zIndex: appZIndex.modal,
      onOk() {
        console.log("OK");
        handleRenewRent(index);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleRenewRent = async (index: number) => {
    if (!selectedPeriod) return;

    const tenantId = selectedPeriod.revenues[index].tenantId || 0;
    const apartmentId = selectedPeriod.revenues[index].apartmentId || 0;
    const amountPaid = selectedPeriod.revenues[index].amount || 0;

    setIsLoading(true);

    try {
      const response = await adminExtendOccupantApi({
        tenantId,
        apartmentId,
        amountPaid,
      });

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess("Rent renewed successfully!");
        alert("Rent renewed successfully!");
      } else {
        // Fallback to alert if no callback provided
        alert("Rent renewed successfully!");
      }

      // Close modal after successful operation
      setSelectedPeriod(null);
    } catch (error) {
      console.error("Error renewing rent:", error);

      // Call onFailure callback if provided
      if (onFailure) {
        onFailure("Failed to renew rent. Please try again.");
        alert("Failed to renew rent. Please try again.");
      } else {
        // Fallback to alert if no callback provided
        alert("Failed to renew rent. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w3-col w3-margin-bottom">
      <div className="w3-col w3-card chartBackground w3-padding w3-round-large">
        {/* Title */}
        <div className="w3-col">
          <span className="w3-small w3-text-white myfont1">
            Over Due Revenue BreakDown By Months
          </span>
        </div>
        <div className="w3-col">
          <div className="py-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {(adminDashboardData?.overdueRevenuePeriods || []).map(
                (period) => (
                  <div
                    key={period.period}
                    className="bg-zinc-800 text-white shadow-md rounded-lg p-4 cursor-pointer"
                    onClick={() => setSelectedPeriod(period)}
                  >
                    <h2 className="text-lg font-semibold text-white mb-2">
                      {period.period}
                    </h2>
                    <p className="text-red-400 mt-4 text-sm">
                      Total Revenue: ₦{period.totalAmount.toLocaleString()}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        {/* Modal */}
        {selectedPeriod && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="chartBackground w-full max-w-md md:max-w-xl rounded-lg p-6 shadow-lg relative transition duration-300 transform hover:scale-95">
              <button
                onClick={() => setSelectedPeriod(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
                disabled={isLoading}
              >
                <CloseOutlined />
              </button>

              <h2 className="text-xl font-bold text-white mb-4">
                {selectedPeriod.period}
              </h2>

              <div className="space-y-3 p-1 max-h-[60vh] overflow-y-auto">
                {selectedPeriod.revenues.map((rev, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-800 border border-amber-400 rounded-md p-3"
                  >
                    <div className="font-medium text-gray-100">
                      {rev.building.title} - {rev.apartment.title}
                    </div>
                    <div className="text-sm text-gray-200">
                      Expected:{" "}
                      {new Date(rev.expectedDate).toLocaleDateString()}
                    </div>
                    <div className=" text-red-400 font-bold">
                      ₦{rev.amount.toLocaleString()}
                    </div>
                    <button
                      className={`mt-3 px-2 py-1 text-sm rounded transition-colors ${
                        isLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-amber-400 hover:bg-amber-700 cursor-pointer"
                      } text-white`}
                      onClick={() => showExtendOccupantApiConfirm(idx)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Renew Rent"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right font-semibold text-red-400">
                Total: ₦{selectedPeriod.totalAmount.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueGridOverDue;
