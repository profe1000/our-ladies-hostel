import { ThemeConfig } from "antd";

/** Light admin theme with the brand's gold as the primary colour */
export const saasAdminTheme: ThemeConfig = {
  token: {
    colorPrimary: "#947a1e",
    colorLink: "#947a1e",
    colorLinkHover: "#b8952f",
    fontFamily: "Poppins, sans-serif",
    borderRadius: 8,
  },
  components: {
    // Black sidebar to match the rest of the brand
    Menu: {
      darkItemBg: "#000000",
      darkItemSelectedBg: "#947a1e",
    },
  },
};

export const formatNaira = (value?: number | null) =>
  value === null || value === undefined ? "Custom" : `₦${Number(value).toLocaleString("en-NG")}`;

export const formatLimit = (value?: number | null) => (value === null || value === undefined ? "Unlimited" : value);

export const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "-";
