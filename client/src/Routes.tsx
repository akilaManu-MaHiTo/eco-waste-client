import React, { Suspense, useMemo } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router";
import MainLayout from "./components/Layout/MainLayout";
import PageLoader from "./components/PageLoader";
import useCurrentUser from "./hooks/useCurrentUser";
import { PermissionKeys } from "./views/Administration/SectionList";
import PermissionDenied from "./components/PermissionDenied";
import { useQuery } from "@tanstack/react-query";
import { User, validateUser } from "./api/userApi";

//Login & Registration
const LoginPage = React.lazy(() => import("./views/LoginPage/LoginPage"));
const RegistrationPage = React.lazy(
  () => import("./views/RegistrationPage/RegistrationPage")
);

//Insights
const InsightsPage = React.lazy(() => import("./views/Insights/Insight"));
const PaymentPage = React.lazy(() => import("./views/Insights/Payment"));

//Administration
const UserTable = React.lazy(() => import("./views/Administration/UserTable"));
const AccessManagementTable = React.lazy(
  () => import("./views/Administration/AccessManagementTable")
);
const OrganizationTable = React.lazy(
  () =>
    import(
      "./views/Administration/OrganizationSettings/OrganizationSettingsTable"
    )
);

//Waste Management
const GarbageTable = React.lazy(() => import("./views/Garbage/GarbageTable"));


//Waste Collection Management
const WasteCollectionTable = React.lazy(
  () => import("./views/WasteCollection/WasteCollectionTable.tsx")
);

// Truck Management
const TruckTable = React.lazy(
  () => import("./views/TruckManagement/TruckTable.tsx")
);
const WasteBinTable = React.lazy(() => import("./views/WasteBin/WasteBinTable"));
const WasteBinDashboard = React.lazy(() => import("./views/WasteBin/WasteBinDashboard"));

//Waste Collection Requests
const WasteCollectionRequestTable = React.lazy(
  () => import("./views/WasteCollection/WasteCollectionRequestTable")
);
function withLayout(Layout: any, Component: any, restrictAccess = false) {
  return (
    <Layout>
      <Suspense
        fallback={
          <>
            <PageLoader />
          </>
        }
      >
        {restrictAccess ? <PermissionDenied /> : <Component />}
      </Suspense>
    </Layout>
  );
}

function withoutLayout(Component: React.LazyExoticComponent<any>) {
  return (
    <Suspense
      fallback={
        <>
          <PageLoader />
        </>
      }
    >
      <Component />
    </Suspense>
  );
}

const ProtectedRoute = () => {
  const { user, status } = useCurrentUser();

  if (status === "loading" || status === "idle" || status === "pending") {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  const { data: user, status } = useQuery<User>({
    queryKey: ["current-user"],
    queryFn: validateUser,
  });

  const userPermissionObject = useMemo(() => {
    if (user && user?.permissionObject) {
      return user?.permissionObject;
    }
  }, [user]);
  console.log("user", user);
  return (
    <Routes>
      <Route path="/" element={withoutLayout(LoginPage)} />
      <Route path="/register" element={withoutLayout(RegistrationPage)} />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/home"
          element={withLayout(
            MainLayout,
            InsightsPage,
            !userPermissionObject?.[PermissionKeys.INSIGHT_VIEW]
          )}
        />

        {/* Administration */}
        <Route
          path="/admin/organization-settings"
          element={withLayout(
            MainLayout,
            OrganizationTable,
            !userPermissionObject?.[PermissionKeys.ADMIN_USERS_VIEW]
          )}
        />
        <Route
          path="/admin/truck-management"
          element={withLayout(
            MainLayout,
            TruckTable,
            !userPermissionObject?.[PermissionKeys.ADMIN_USERS_VIEW]
          )}
        />
        <Route
          path="/admin/users"
          element={withLayout(
            MainLayout,
            UserTable,
            !userPermissionObject?.[PermissionKeys.ADMIN_USERS_VIEW]
          )}
        />
        <Route
          path="/admin/access-management"
          element={withLayout(
            MainLayout,
            AccessManagementTable,
            !userPermissionObject?.[PermissionKeys.ADMIN_ACCESS_MNG_VIEW]
          )}
        />
        <Route
          path="/payment"
          element={withLayout(
            MainLayout,
            PaymentPage,
            !userPermissionObject?.[PermissionKeys.PAYMENT_VIEW]
          )}
        />
        <Route
          path="/waste-management/history"
          element={withLayout(
            MainLayout,
            () => {
              return <GarbageTable isTodayGarbage={false} isGarbage={true}/>;
            },
            !userPermissionObject?.[
              PermissionKeys.WASTE_MNG_HISTORY_VIEW
            ]
          )}
        />
        <Route
          path="/waste-management/today-history"
          element={withLayout(
            MainLayout,
            () => {
              return <GarbageTable isTodayGarbage={true} isGarbage={false}/>;
            },
            !userPermissionObject?.[
              PermissionKeys.WASTE_MNG_HISTORY_VIEW
            ]
          )}
        />
        <Route
          path="/waste-management/dashboard"
          element={withLayout(
            MainLayout,
            WasteBinDashboard,
            !userPermissionObject?.[PermissionKeys.WASTE_MNG_DASHBOARD_VIEW]
          )}
        />
        <Route
          path="/admin/bin-management"
          element={withLayout(
            MainLayout,
            WasteBinTable,
            !userPermissionObject?.[PermissionKeys.ADMIN_BIN_MNG_VIEW]
          )}
        />
        <Route
          path="/waste-collection/collection-status"
          element={withLayout(
            MainLayout,
            WasteCollectionTable,
            !userPermissionObject?.[PermissionKeys.INSIGHT_VIEW]
          )}
        />
        <Route
          path="/admin/waste-collection-requests"
          element={withLayout(
            MainLayout,
            WasteCollectionRequestTable,
            !userPermissionObject?.[PermissionKeys.ADMIN_BIN_MNG_VIEW]
          )}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
