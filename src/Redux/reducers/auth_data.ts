import { IAuthType } from "../../apiservice/authService.type";

export const AuthDataReducer = (state: IAuthType = {}, action) => {
  switch (action.type) {
    case "AUTH_ADD_DATA":
      return { ...state, ...action.payload };
    case "AUTH_REMOVE_DATA":
      return {};
    default:
      return state;
  }
};
