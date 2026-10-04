import { useState } from "react";
import { Dropdown, message } from "antd";
import { DownOutlined, LoginOutlined } from "@ant-design/icons";
import { getApiErrorMessage } from "../../../apiservice/public-ApiService";
import { openLoginAsSession } from "../../../utils/loginAs";

type Props = {
  /** Estate admin sessions open the admin app, tenant sessions the tenant app */
  isAdmin: boolean;
  /** Calls the server's login-as endpoint */
  start: (readOnly: boolean) => Promise<any>;
  size?: "small" | "middle";
  label?: string;
  disabled?: boolean;
};

/** "Login as" with a choice of full access (default) or view only; opens the session in a new tab */
const LoginAsButton = ({ isAdmin, start, size = "small", label = "Login as", disabled }: Props) => {
  const [loading, setLoading] = useState(false);

  const run = async (readOnly: boolean) => {
    setLoading(true);
    try {
      const result = await start(readOnly);
      openLoginAsSession(isAdmin, result);
    } catch (e: any) {
      message.error(getApiErrorMessage(e, "Could not log in as this account"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dropdown.Button
      size={size}
      disabled={disabled}
      loading={loading}
      icon={<DownOutlined />}
      onClick={(e) => {
        e.stopPropagation();
        run(false);
      }}
      menu={{
        items: [
          { key: "full", label: "Full access" },
          { key: "view", label: "View only" },
        ],
        onClick: ({ key, domEvent }) => {
          domEvent.stopPropagation();
          run(key === "view");
        },
      }}
    >
      <LoginOutlined /> {label}
    </Dropdown.Button>
  );
};

export default LoginAsButton;
