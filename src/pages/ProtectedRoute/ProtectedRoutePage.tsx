import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

type IProtectRoutesType = {
  children: any;
  VerificationUserType?: "user" | "admin";
  customUrl?: string;
};

export const ProtectedRoute: React.FC<IProtectRoutesType> = ({
  children,
  VerificationUserType = "user",
  customUrl = "/",
}) => {
  const authState = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    navigateAway();
  }, [authState.isAutheticatedUser, authState.isAutheticatedAdmin]);

  const navigateAway = () => {
    if (!authState.isAutheticatedUser && VerificationUserType === "user") {
      // user is not authenticated
      navigate(customUrl);
    }

    if (!authState.isAutheticatedAdmin && VerificationUserType === "admin") {
      // Admin is not authenticated
      navigate(customUrl);
    }
  };

  return children;
};
