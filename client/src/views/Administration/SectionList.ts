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
      {
        name: "Payment",
        key: "PAYMENT",
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
          CREATE: false,
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
    ],
  },
  {
    mainSection: "Waste Management",
    subSections: [
      {
        break: true,
        name: "Waste Bin Request",
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
        name: "Garbage History",
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
  PAYMENT_VIEW = "PAYMENT_VIEW",

  ADMIN_VIEW = "ADMIN_VIEW",

  ADMIN_USERS_VIEW = "ADMIN_USERS_VIEW",
  ADMIN_USERS_CREATE = "ADMIN_USERS_CREATE",
  ADMIN_USERS_EDIT = "ADMIN_USERS_EDIT",
  ADMIN_USERS_DELETE = "ADMIN_USERS_DELETE",

  ADMIN_ACCESS_MNG_VIEW = "ADMIN_ACCESS_MNG_VIEW",
  ADMIN_ACCESS_MNG_CREATE = "ADMIN_ACCESS_MNG_CREATE",
  ADMIN_ACCESS_MNG_EDIT = "ADMIN_ACCESS_MNG_EDIT",
  ADMIN_ACCESS_MNG_DELETE = "ADMIN_ACCESS_MNG_DELETE",

  ADMIN_BIN_MNG_VIEW = "ADMIN_BIN_MNG_VIEW",
  ADMIN_BIN_MNG_CREATE = "ADMIN_BIN_MNG_CREATE",
  ADMIN_BIN_MNG_EDIT = "ADMIN_BIN_MNG_EDIT",
  ADMIN_BIN_MNG_DELETE = "ADMIN_BIN_MNG_DELETE",

  WASTE_MNG_VIEW = "WASTE_MNG_VIEW",
  WASTE_MNG_DASHBOARD_VIEW = "WASTE_MNG_DASHBOARD_VIEW",

  BIN_REQUEST_VIEW = "BIN_REQUEST_VIEW",
  BIN_REQUEST_CREATE = "BIN_REQUEST_CREATE",
  BIN_REQUEST_EDIT = "BIN_REQUEST_EDIT",
  BIN_REQUEST_DELETE = "BIN_REQUEST_DELETE",

  WASTE_MNG_HISTORY_VIEW = "WASTE_MNG_HISTORY_VIEW",
  WASTE_MNG_HISTORY_CREATE = "WASTE_MNG_HISTORY_CREATE",
  WASTE_MNG_HISTORY_EDIT = "WASTE_MNG_HISTORY_EDIT",
  WASTE_MNG_HISTORY_DELETE = "WASTE_MNG_HISTORY_DELETE",
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
  INSIGHT_VIEW: true,
  PAYMENT_VIEW: true,
  ADMIN_VIEW: true,
  ADMIN_USERS_VIEW: true,
  ADMIN_ACCESS_MNG_VIEW: true,
  ADMIN_BIN_MNG_VIEW: true,
  WASTE_MNG_VIEW: true,
  BIN_REQUEST_VIEW: true,
  WASTE_MNG_DASHBOARD_VIEW: true,
  WASTE_MNG_HISTORY_VIEW: true,
};
