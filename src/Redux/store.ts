import { createStore, combineReducers, applyMiddleware, Action } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk, { ThunkAction } from "redux-thunk";
import { AdminAuthDataReducer } from "./reducers/admin_auth_data";
import {
  AdminApartmentCostLoadState,
  AdminDashboardReducer,
  AdminSelectedAdminReducer,
  AdminSelectedApartmentReducer,
  AdminSelectedBuildingReducer,
  AdminSelectedOccupantReducer,
  AdminSelectedTenantReducer,
  AdminSettingsReducers,
} from "./reducers/admin_dashboard_reducer";
import { AuthDataReducer } from "./reducers/auth_data";
import {
  TenantPaymentResultReducer,
  TenantRegistrationResultReducer,
  TenantSelectedApartmentReducer,
  TenantSelectedBuildingReducer,
  TenantSettingsReducers,
} from "./reducers/tenant_reducer_group";

const reducer = combineReducers({
  AuthData: AuthDataReducer,
  AdminAuthData: AdminAuthDataReducer,
  AdminDashBoardData: AdminDashboardReducer,
  AdminSettingData: AdminSettingsReducers,
  AdminSelectedAdmin: AdminSelectedAdminReducer,
  AdminSelectedBuilding: AdminSelectedBuildingReducer,
  AdminSelectedApartment: AdminSelectedApartmentReducer,
  AdminSelectedApartmentCostLoadState: AdminApartmentCostLoadState,
  AdminSelectedOccupant: AdminSelectedOccupantReducer,
  AdminSelectedTenant: AdminSelectedTenantReducer,
  TenantSelectedBuilding: TenantSelectedBuildingReducer,
  TenantSelectedApartment: TenantSelectedApartmentReducer,
  TenantRegistrationResultData: TenantRegistrationResultReducer,
  TenantPaymentResultData: TenantPaymentResultReducer,
  TenantSettingsData: TenantSettingsReducers,
});

const initialState = {};
const middleware = [thunk]; //there can be multiple middlewares here

export const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)) // passing middleware
);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
