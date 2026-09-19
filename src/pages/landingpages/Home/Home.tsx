import { useEffect } from "react";
import { App } from "@capacitor/app";
import TopBar from "../../../components/LayoutComponent/TopBar/topBar";
import { BuildingListUser } from "../../../components/userscomponents/buildingsComp/building-list/building-list";
import "./Home.css";

export const HomePage = () => {
  useEffect(() => {
    const backHandler = () => {
      App.exitApp();
      return true;
    };
    const backButtonListener = App.addListener("backButton", backHandler);
    return () => {
      backButtonListener.remove();
    };
  }, []);
  return (
    <>
      <TopBar></TopBar>
      <BuildingListUser></BuildingListUser>
    </>
  );
};

export default HomePage;
