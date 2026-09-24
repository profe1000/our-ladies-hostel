import {
  DashboardOutlined,
  HomeOutlined,
  InsertRowLeftOutlined,
  SettingOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IAdminAuthType } from "../../../apiservice/admin-AuthService.type";
import { useAppSelector } from "../../../Redux/reduxCustomHook";
import { RootState } from "../../../Redux/store";
import "./Tabbar.css";

const Tabbar = () => {
  const location = useLocation();
  const [currentUrlPath, setCurrentUrlPath] = useState("");
  const [menu, setMenu] = useState<IMenuType[]>([]);

  const authData: IAdminAuthType = useAppSelector(
    (state: RootState) => state?.AdminAuthData
  );

  const navigate = useNavigate();

  type IMenuType = {
    icon: string | any;
    url: string;
    title: string;
    onClick?: () => void;
  };

  const superMenu: IMenuType[] = [
    {
      icon: <HomeOutlined />,
      url: "/admin",
      title: "Home",
    },
    {
      icon: <InsertRowLeftOutlined />,
      url: "/admin/Buildings",
      title: "Buildings",
    },
    {
      icon: <SolutionOutlined />,
      url: "/admin/tenant-requests",
      title: "Requests",
    },
    {
      icon: <SettingOutlined />,
      url: "/admin/Settings",
      title: "Settings",
    },
  ];

  const generalMenu: IMenuType[] = [
    {
      icon: <HomeOutlined />,
      url: "/admin/Buildings",
      title: "Home",
    },
    {
      icon: <InsertRowLeftOutlined />,
      url: "/admin/Buildings",
      title: "Buildings",
    },
    {
      icon: <SolutionOutlined />,
      url: "/admin/tenant-requests",
      title: "Requests",
    },
    {
      icon: <SettingOutlined />,
      url: "/admin/Settings",
      title: "Settings",
    },
  ];

  useEffect(() => {
    setCurrentUrlPath(location.pathname);
    updateMenuType();
  }, [location, authData]);

  const updateMenuType = () => {
    // Used Url path to check
    if (authData.data?.credentials?.adminRole?.id === 1) {
      setMenu(superMenu);
    } else {
      setMenu(generalMenu);
    }
  };
  // Share the bar equally between the tabs
  const tabWidth = `${100 / (menu.length || 1)}%`;

  return (
    <>
      <div className="w3-col tabBarSpace">
        &nbsp; <br />
      </div>
      <div className="w3-col bottomBar w3-border-top safeAreaBottom">
        {menu.map((menu: IMenuType, index: number) => (
          <div
            key={index}
            className="w3-col w3-center w3-padding-top tabbarcolor"
            style={{ width: tabWidth }}
          >
            <div className="w3-padding" style={{ marginTop: "2px" }}>
              <Link className="link" to={menu.url}>
                <span
                  className={currentUrlPath === menu.url ? "selectedcolor" : ""}
                  style={{ zoom: "1.2" }}
                >
                  {menu.icon}
                </span>
                <br />
                <span
                  className={
                    "w3-tiny myfont1 subtext " +
                    (currentUrlPath === menu.url ? "selectedcolor" : "")
                  }
                >
                  {menu.title}
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Tabbar;
