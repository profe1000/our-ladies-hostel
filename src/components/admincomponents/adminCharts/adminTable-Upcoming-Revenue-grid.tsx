import React, { useState } from "react";
import "./adminChart_tw.css";
import { CloseOutlined } from "@ant-design/icons";
import {
  IAdminDashboardData,
  RevenuePeriod,
} from "../../../apiservice/admin-General-ApiService.type";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import { RootState } from "../../../Redux/store";

// type RevenueItem = {
//   buildingId: number;
//   building: { id: number; title: string };
//   apartmentId: number;
//   apartment: { id: number; title: string };
//   amount: number;
//   expectedDate: string;
// };

// type RevenuePeriod = {
//   year: number;
//   month: number;
//   period: string;
//   totalAmount: number;
//   revenues: RevenueItem[];
// };

// type Props = {
//   data: RevenuePeriod[];
// };

const RevenueGrid = () => {
  const adminDashboardData: IAdminDashboardData = useAppSelector(
    (state: RootState) => state?.AdminDashBoardData
  );
  const [selectedPeriod, setSelectedPeriod] =
    useState<RevenuePeriod | null>(null);

  return (
    <div className="w3-col w3-margin-bottom">
      <div className="w3-col w3-card chartBackground w3-padding w3-round-large">
        {/* Title */}
        <div className="w3-col">
          <span className="w3-small w3-text-white myfont1">
            Revenue BreakDown By Months
          </span>
        </div>
        <div className="w3-col">
          <div className="py-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {(adminDashboardData.upcomingRevenuePeriods || []).map(
                (period) => (
                  <div
                    key={period.period}
                    className="bg-zinc-800 text-white shadow-md rounded-lg p-4 cursor-pointer"
                    onClick={() => setSelectedPeriod(period)}
                  >
                    <h2 className="text-lg font-semibold text-white mb-2">
                      {period.period}
                    </h2>
                    <p className="text-gray-400 mt-4 text-sm">
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
                    <div className="text-whote font-bold">
                      ₦{rev.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right font-semibold text-gray-100">
                Total: ₦{selectedPeriod.totalAmount.toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueGrid;
