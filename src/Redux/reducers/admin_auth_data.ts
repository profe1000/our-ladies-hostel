import { IAdminAuthType } from "../../apiservice/admin-AuthService.type";


export const AdminAuthDataReducer = (state: IAdminAuthType = {}, action) => {
  switch (action.type) {
    case "ADMIN_AUTH_ADD_DATA":
      return { ...state, ...action.payload };
    case "ADMIN_AUTH_REMOVE_DATA":
      return {};
    default:
      return state;
  }
};
