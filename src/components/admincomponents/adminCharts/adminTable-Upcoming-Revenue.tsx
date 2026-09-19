import { IAdminDashboardData } from "../../../apiservice/admin-General-ApiService.type";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import { RootState } from "../../../Redux/store";
import { formatCurrency } from "../../../utils/basic.utils";
import { convertToShortDate } from "../../../utils/date.utils";
import "./adminChart.css";

export const AdminTableUpcomingRevenue = () => {
  const adminDashboardData: IAdminDashboardData = useAppSelector(
    (state: RootState) => state?.AdminDashBoardData
  );
  return (
    <>
      <div className="w3-col w3-margin-bottom">
        <div className="w3-col w3-card chartBackground w3-padding w3-round-large">
          {/* Title */}
          <div className="w3-col">
            <span className="w3-small w3-text-white myfont1">
              Upcoming Revenue
            </span>
          </div>

          {/* Grid */}
          <div className="w3-col w3-margin-top">
            {adminDashboardData?.upcomingRevenue?.length > 0 ? (
              <>
                {adminDashboardData?.upcomingRevenue.map(
                  (upcomingRevenue, index) => (
                    <div
                      key={index}
                      className="w3-col gridBackGround w3-round w3-margin-bottom w3-round-large w3-padding"
                    >
                      <div
                        className="w3-col l12 s12 m12"
                        style={{ padding: "2px" }}
                      >
                        <b className="myfont1 w3-small">{`${upcomingRevenue.building.title} ${upcomingRevenue.apartment.title}`}</b>
                      </div>
                      <div
                        className="w3-col l5 s5 m5"
                        style={{ padding: "2px" }}
                      >
                        <span className="myfont1 w3-tiny">
                          {convertToShortDate(upcomingRevenue.expectedDate)}
                        </span>
                      </div>
                      <div
                        className="w3-col l7 s7 m7 w3-right-align"
                        style={{ padding: "2px" }}
                      >
                        <b className="myfont1 w3-small">
                          {formatCurrency(upcomingRevenue.amount)}
                        </b>
                      </div>
                    </div>
                  )
                )}
              </>
            ) : (
              <div className="w3-col gridBackGround w3-round w3-margin-bottom w3-round-large w3-padding">
                <p> No Upcoming Revenue At the moment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminTableUpcomingRevenue;
