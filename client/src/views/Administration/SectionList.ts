import { z } from "zod";

export const PermissionSectionsMap: PermissionSection[] = [
  {
    mainSection: "Main",
    subSections: [
      {
        name: "Insight",
        key: "INSIGHT",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
    ],
  },
  {
    mainSection: "Administration",
    subSections: [
      {
        name: "Administration Text",
        key: "ADMIN",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Administration > Users",
        key: "ADMIN_USERS",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Administration > Access Management",
        key: "ADMIN_ACCESS_MNG",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Administration > Bin Management",
        key: "ADMIN_BIN_MNG",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Administration > Truck Management",
        key: "ADMIN_TRUCK_MNG",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Administration > Collection Request > Dashboard",
        key: "ADMIN_COLLECTION_MNG_DASHBOARD",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Administration > Collection Request > Pending Request",
        key: "ADMIN_COLLECTION_MNG_PENDING",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Administration > Collection Request > Approved Request",
        key: "ADMIN_COLLECTION_MNG_APPROVED",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
    ],
  },
  {
    mainSection: "Waste Management",
    subSections: [
      {
        break: true,
        name: "Waste Management",
      },
      {
        name: "Waste Management Text",
        key: "WASTE_MNG",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Dashboard",
        key: "WASTE_MNG_DASHBOARD",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Bin Request",
        key: "BIN_REQUEST",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Daily Waste",
        key: "WASTE_MNG_HISTORY_DAILY",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Waste History",
        key: "WASTE_MNG_HISTORY",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
    ],
  },
  {
    mainSection: "Waste Collection",
    subSections: [
      {
        break: true,
        name: "Waste Collection",
      },
      {
        name: "Waste Collection Text",
        key: "WASTE_COLLECTION",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Waste Collection Dashboard",
        key: "WASTE_COLLECTION_DASHBOARD",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Waste Daily Collection",
        key: "WASTE_COLLECTION_DAILY",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
    ],
  },
];

export interface PermissionSection {
  mainSection: string;
  subSections: SubSection[];
}

export interface SubSectionWithPermissions {
  name: string;
  key: string;
  permissionsExists: PermissionsExists;
}

export interface SubSectionBreak {
  break: boolean;
  name: string;
}

export type SubSection = SubSectionWithPermissions | SubSectionBreak;

export interface PermissionsExists {
  VIEW: boolean;
  CREATE: boolean;
  EDIT: boolean;
  DELETE: boolean;
}

export enum PermissionKeys {
  INSIGHT_VIEW = "INSIGHT_VIEW",

  // Administration
  ADMIN_VIEW = "ADMIN_VIEW",
  // Users
  ADMIN_USERS_VIEW = "ADMIN_USERS_VIEW",
  ADMIN_USERS_CREATE = "ADMIN_USERS_CREATE",
  ADMIN_USERS_EDIT = "ADMIN_USERS_EDIT",
  ADMIN_USERS_DELETE = "ADMIN_USERS_DELETE",
  // Access Management
  ADMIN_ACCESS_MNG_VIEW = "ADMIN_ACCESS_MNG_VIEW",
  ADMIN_ACCESS_MNG_CREATE = "ADMIN_ACCESS_MNG_CREATE",
  ADMIN_ACCESS_MNG_EDIT = "ADMIN_ACCESS_MNG_EDIT",
  ADMIN_ACCESS_MNG_DELETE = "ADMIN_ACCESS_MNG_DELETE",
  // Bin Management
  ADMIN_BIN_MNG_VIEW = "ADMIN_BIN_MNG_VIEW",
  ADMIN_BIN_MNG_CREATE = "ADMIN_BIN_MNG_CREATE",
  ADMIN_BIN_MNG_EDIT = "ADMIN_BIN_MNG_EDIT",
  ADMIN_BIN_MNG_DELETE = "ADMIN_BIN_MNG_DELETE",
  // Truck Management
  ADMIN_TRUCK_MNG_VIEW = "ADMIN_TRUCK_MNG_VIEW",
  ADMIN_TRUCK_MNG_CREATE = "ADMIN_TRUCK_MNG_CREATE",
  ADMIN_TRUCK_MNG_EDIT = "ADMIN_TRUCK_MNG_EDIT",
  ADMIN_TRUCK_MNG_DELETE = "ADMIN_TRUCK_MNG_DELETE",

  // Collection Management - Dashboard
  ADMIN_COLLECTION_MNG_DASHBOARD_VIEW = "ADMIN_COLLECTION_MNG_DASHBOARD_VIEW",
  // Collection Management - Pending
  ADMIN_COLLECTION_MNG_PENDING_VIEW = "ADMIN_COLLECTION_MNG_PENDING_VIEW",
  ADMIN_COLLECTION_MNG_PENDING_CREATE = "ADMIN_COLLECTION_MNG_PENDING_CREATE",
  ADMIN_COLLECTION_MNG_PENDING_EDIT = "ADMIN_COLLECTION_MNG_PENDING_EDIT",
  ADMIN_COLLECTION_MNG_PENDING_DELETE = "ADMIN_COLLECTION_MNG_PENDING_DELETE",
  // Collection Management - Approved
  ADMIN_COLLECTION_MNG_APPROVED_VIEW = "ADMIN_COLLECTION_MNG_APPROVED_VIEW",
  ADMIN_COLLECTION_MNG_APPROVED_CREATE = "ADMIN_COLLECTION_MNG_APPROVED_CREATE",
  ADMIN_COLLECTION_MNG_APPROVED_EDIT = "ADMIN_COLLECTION_MNG_APPROVED_EDIT",
  ADMIN_COLLECTION_MNG_APPROVED_DELETE = "ADMIN_COLLECTION_MNG_APPROVED_DELETE",

  // Waste Management
  WASTE_MNG_VIEW = "WASTE_MNG_VIEW",
  WASTE_MNG_DASHBOARD_VIEW = "WASTE_MNG_DASHBOARD_VIEW",
  // Bin Request
  BIN_REQUEST_VIEW = "BIN_REQUEST_VIEW",
  BIN_REQUEST_CREATE = "BIN_REQUEST_CREATE",
  BIN_REQUEST_EDIT = "BIN_REQUEST_EDIT",
  BIN_REQUEST_DELETE = "BIN_REQUEST_DELETE",
  // Daily Waste
  WASTE_MNG_HISTORY_DAILY_VIEW = "WASTE_MNG_HISTORY_DAILY_VIEW",
  WASTE_MNG_HISTORY_DAILY_CREATE = "WASTE_MNG_HISTORY_DAILY_CREATE",
  WASTE_MNG_HISTORY_DAILY_EDIT = "WASTE_MNG_HISTORY_DAILY_EDIT",
  WASTE_MNG_HISTORY_DAILY_DELETE = "WASTE_MNG_HISTORY_DAILY_DELETE",
  // Waste History
  WASTE_MNG_HISTORY_VIEW = "WASTE_MNG_HISTORY_VIEW",
  WASTE_MNG_HISTORY_CREATE = "WASTE_MNG_HISTORY_CREATE",
  WASTE_MNG_HISTORY_EDIT = "WASTE_MNG_HISTORY_EDIT",
  WASTE_MNG_HISTORY_DELETE = "WASTE_MNG_HISTORY_DELETE",

  // Waste Collection
  WASTE_COLLECTION = "WASTE_COLLECTION",
  WASTE_COLLECTION_DASHBOARD_VIEW = "WASTE_COLLECTION_DASHBOARD_VIEW",
  // Daily Collection
  WASTE_COLLECTION_DAILY_VIEW = "WASTE_COLLECTION_DAILY_VIEW",
  WASTE_COLLECTION_DAILY_CREATE = "WASTE_COLLECTION_DAILY_CREATE",
  WASTE_COLLECTION_DAILY_EDIT = "WASTE_COLLECTION_DAILY_EDIT",
  WASTE_COLLECTION_DAILY_DELETE = "WASTE_COLLECTION_DAILY_DELETE",
}

// Create the Zod schema using the enum values
export const PermissionKeysObjectSchema = z.object(
  Object.values(PermissionKeys).reduce((acc, key) => {
    acc[key] = z.boolean();
    return acc;
  }, {} as Record<PermissionKeys, z.ZodBoolean>)
);

// Infer the TypeScript type from the Zod schema
export type PermissionKeysObject = z.infer<typeof PermissionKeysObjectSchema>;

export const defaultAdminPermissions = Object.values(PermissionKeys).reduce(
  (acc, key) => {
    acc[key] = true;
    return acc;
  },
  {} as Record<PermissionKeys, boolean>
);

export const defaultViewerPermissions: PermissionKeysObject = {
  // Insight
  INSIGHT_VIEW: true,

  // Administration (landing)
  ADMIN_VIEW: true,

  // Administration > Users
  ADMIN_USERS_VIEW: true,
  ADMIN_USERS_CREATE: true,
  ADMIN_USERS_EDIT: true,
  ADMIN_USERS_DELETE: true,

  // Administration > Access Management
  ADMIN_ACCESS_MNG_VIEW: true,
  ADMIN_ACCESS_MNG_CREATE: true,
  ADMIN_ACCESS_MNG_EDIT: true,
  ADMIN_ACCESS_MNG_DELETE: true,

  // Administration > Bin Management
  ADMIN_BIN_MNG_VIEW: true,
  ADMIN_BIN_MNG_CREATE: true,
  ADMIN_BIN_MNG_EDIT: true,
  ADMIN_BIN_MNG_DELETE: true,

  // Administration > Truck Management
  ADMIN_TRUCK_MNG_VIEW: true,
  ADMIN_TRUCK_MNG_CREATE: true,
  ADMIN_TRUCK_MNG_EDIT: true,
  ADMIN_TRUCK_MNG_DELETE: true,

  // Administration > Collection Request > Dashboard
  ADMIN_COLLECTION_MNG_DASHBOARD_VIEW: true,

  // Administration > Collection Request > Pending
  ADMIN_COLLECTION_MNG_PENDING_VIEW: true,
  ADMIN_COLLECTION_MNG_PENDING_CREATE: true,
  ADMIN_COLLECTION_MNG_PENDING_EDIT: true,
  ADMIN_COLLECTION_MNG_PENDING_DELETE: true,

  // Administration > Collection Request > Approved
  ADMIN_COLLECTION_MNG_APPROVED_VIEW: true,
  ADMIN_COLLECTION_MNG_APPROVED_CREATE: true,
  ADMIN_COLLECTION_MNG_APPROVED_EDIT: true,
  ADMIN_COLLECTION_MNG_APPROVED_DELETE: true,

  // Waste Management
  WASTE_MNG_VIEW: true,
  WASTE_MNG_DASHBOARD_VIEW: true,

  // Waste Management > Bin Request
  BIN_REQUEST_VIEW: true,
  BIN_REQUEST_CREATE: true,
  BIN_REQUEST_EDIT: true,
  BIN_REQUEST_DELETE: true,

  // Waste Management > Daily Waste
  WASTE_MNG_HISTORY_DAILY_VIEW: true,
  WASTE_MNG_HISTORY_DAILY_CREATE: true,
  WASTE_MNG_HISTORY_DAILY_EDIT: true,
  WASTE_MNG_HISTORY_DAILY_DELETE: true,

  // Waste Management > Waste History
  WASTE_MNG_HISTORY_VIEW: true,
  WASTE_MNG_HISTORY_CREATE: true,
  WASTE_MNG_HISTORY_EDIT: true,
  WASTE_MNG_HISTORY_DELETE: true,

  // Waste Collection
  WASTE_COLLECTION: true,
  WASTE_COLLECTION_DASHBOARD_VIEW: true,

  // Waste Collection > Daily Collection
  WASTE_COLLECTION_DAILY_VIEW: true,
  WASTE_COLLECTION_DAILY_CREATE: true,
  WASTE_COLLECTION_DAILY_EDIT: true,
  WASTE_COLLECTION_DAILY_DELETE: true,
};
