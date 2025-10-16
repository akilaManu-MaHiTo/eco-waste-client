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

//Administration
const UserTable = React.lazy(() => import("./views/Administration/UserTable"));
const AccessManagementTable = React.lazy(
  () => import("./views/Administration/AccessManagementTable")
);
const CollectionRequestDashboard = React.lazy(
  () => import("./views/WasteCollectionRequest/Dashboard.tsx")
);

//Waste Management
const GarbageTable = React.lazy(() => import("./views/Garbage/GarbageTable"));

//Waste Collection Management
const DailyCollection = React.lazy(
  () => import("./views/WasteCollection/DailyCollection.tsx")
);
const CollectionDashboard = React.lazy(
  () => import("./views/WasteCollection/CollectorDashboard.tsx")
);
//Waste Collection Management
const BinRequestTable = React.lazy(
  () => import("./views/BinRequest/BinRequestTable.tsx")
);

// Truck Management
const TruckTable = React.lazy(
  () => import("./views/TruckManagement/TruckTable.tsx")
);
const WasteBinTable = React.lazy(
  () => import("./views/WasteBin/WasteBinTable")
);
const WasteBinDashboard = React.lazy(
  () => import("./views/WasteBin/WasteBinDashboard")
);

//Waste Collection Requests
const WasteCollectionRequestTable = React.lazy(
  () => import("./views/WasteCollectionRequest/WasteCollectionRequestTable")
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
        {/* Home */}
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
          path="/admin/bin-management"
          element={withLayout(
            MainLayout,
            WasteBinTable,
            !userPermissionObject?.[PermissionKeys.ADMIN_BIN_MNG_VIEW]
          )}
        />
        <Route
          path="/admin/truck-management"
          element={withLayout(
            MainLayout,
            TruckTable,
            !userPermissionObject?.[PermissionKeys.ADMIN_TRUCK_MNG_VIEW]
          )}
        />
        <Route
          path="/admin/collection-dashboard"
          element={withLayout(
            MainLayout,
            CollectionRequestDashboard,
            !userPermissionObject?.[PermissionKeys.ADMIN_COLLECTION_MNG_DASHBOARD_VIEW]
          )}
        />
        <Route
          path="/admin/waste-collection-requests"
          element={withLayout(
            MainLayout,
            () => {
              return (
                <WasteCollectionRequestTable
                  isPendingData={true}
                  isApprovedData={false}
                />
              );
            },
            !userPermissionObject?.[PermissionKeys.ADMIN_COLLECTION_MNG_PENDING_VIEW]
          )}
        />
        <Route
          path="/admin/waste-collection-approved"
          element={withLayout(
            MainLayout,
            () => {
              return (
                <WasteCollectionRequestTable
                  isPendingData={false}
                  isApprovedData={true}
                />
              );
            },
            !userPermissionObject?.[PermissionKeys.ADMIN_COLLECTION_MNG_APPROVED_VIEW]
          )}
        />

        {/* Waste Management */}
        <Route
          path="/waste-management/dashboard"
          element={withLayout(
            MainLayout,
            WasteBinDashboard,
            !userPermissionObject?.[PermissionKeys.WASTE_MNG_DASHBOARD_VIEW]
          )}
        />
        <Route
          path="/waste-collection/dashboard-collection"
          element={withLayout(
            MainLayout,
            CollectionDashboard,
            !userPermissionObject?.[PermissionKeys.WASTE_COLLECTION_DASHBOARD_VIEW]
          )}
        />
        <Route
          path="/waste-management/bin-request"
          element={withLayout(
            MainLayout,
            BinRequestTable,
            !userPermissionObject?.[PermissionKeys.BIN_REQUEST_VIEW]
          )}
        />
        <Route
          path="/waste-management/today-history"
          element={withLayout(
            MainLayout,
            () => {
              return <GarbageTable isTodayGarbage={true} isGarbage={false} />;
            },
            !userPermissionObject?.[PermissionKeys.WASTE_MNG_HISTORY_DAILY_VIEW]
          )}
        />
        <Route
          path="/waste-management/history"
          element={withLayout(
            MainLayout,
            () => {
              return <GarbageTable isTodayGarbage={false} isGarbage={true} />;
            },
            !userPermissionObject?.[PermissionKeys.WASTE_MNG_HISTORY_VIEW]
          )}
        />

        {/* Waste Collection */}
        <Route
          path="/waste-collection/daily-collection"
          element={withLayout(
            MainLayout,
            DailyCollection,
            !userPermissionObject?.[PermissionKeys.WASTE_COLLECTION_DAILY_VIEW]
          )}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
