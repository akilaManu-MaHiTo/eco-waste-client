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
    ],
  },
  {
    mainSection: "Sustainability Apps",
    subSections: [
      {
        break: true,
        name: "Audit & Inspection",
      },
      {
        name: "Dashboard",
        key: "AUDIT_INSPECTION_DASHBOARD",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Calendar",
        key: "AUDIT_INSPECTION_CALENDAR",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Internal Audit > Audit Form Builder",
        key: "AUDIT_INSPECTION_INTERNAL_AUDIT_FORM_BUILDER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Internal Audit > Scheduled Audit",
        key: "AUDIT_INSPECTION_INTERNAL_AUDIT_REGISTER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      // {
      //   name: "Internal Audit > Task",
      //   key: "AUDIT_INSPECTION_INTERNAL_AUDIT_TASK",
      //   permissionsExists: {
      //     VIEW: true,
      //     CREATE: true,
      //     EDIT: true,
      //     DELETE: true,
      //   },
      // },
      // {
      //   name: "Internal Audit > Queue",
      //   key: "AUDIT_INSPECTION_INTERNAL_AUDIT_QUEUE",
      //   permissionsExists: {
      //     VIEW: true,
      //     CREATE: true,
      //     EDIT: true,
      //     DELETE: true,
      //   },
      // },
      // {
      //   name: "Internal Audit > Corrective Action",
      //   key: "AUDIT_INSPECTION_INTERNAL_AUDIT_CORRECTIVE_ACTION",
      //   permissionsExists: {
      //     VIEW: true,
      //     CREATE: true,
      //     EDIT: true,
      //     DELETE: true,
      //   },
      // },
      {
        name: "External Audit > Register",
        key: "AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "External Audit > Task",
        key: "AUDIT_INSPECTION_EXTERNAL_AUDIT_TASK",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "External Audit > Queue",
        key: "AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "External Audit > Corrective Action",
        key: "AUDIT_INSPECTION_EXTERNAL_AUDIT_CORRECTIVE_ACTION",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        break: true,
        name: "Sustainability",
      },
      {
        name: "SDG Reporting",
        key: "SUSTAINABILITY_SDG_REPORTING",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        break: true,
        name: "Environment",
      },
      {
        name: "Dashboard",
        key: "ENVIRONMENT_DASHBOARD",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "History > Consumption",
        key: "ENVIRONMENT_HISTORY_CONSUMPTION",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "History > Target Setting",
        key: "ENVIRONMENT_HISTORY_TARGET_SETTING",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Assigned Tasks > Consumption",
        key: "ENVIRONMENT_ASSIGNED_TASKS_CONSUMPTION",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Assigned Tasks > Target Setting",
        key: "ENVIRONMENT_ASSIGNED_TASKS_TARGET_SETTING",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        break: true,
        name: "Chemical MNG",
      },
      {
        name: "Dashboard",
        key: "CHEMICAL_MNG_DASHBOARD",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Request Register",
        key: "CHEMICAL_MNG_REQUEST_REGISTER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Purchase & Inventory",
        key: "CHEMICAL_MNG_PURCHASE_INVENTORY",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Transaction",
        key: "CHEMICAL_MNG_TRANSACTION",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Assigned Tasks",
        key: "CHEMICAL_MNG_ASSIGNED_TASKS",
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
    mainSection: "Health & Safety Apps",
    subSections: [
      {
        name: "Hazard & Risk > Dashboard",
        key: "HAZARD_RISK_DASHBOARD",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Hazard & Risk > Register",
        key: "HAZARD_RISK_REGISTER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Hazard & Risk > Assigned Tasks",
        key: "HAZARD_RISK_ASSIGNED_TASKS",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        break: true,
        name: "Incident & Accident",
      },
      {
        name: "Dashboard",
        key: "INCIDENT_ACCIDENT_DASHBOARD",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Register > Accident",
        key: "INCIDENT_ACCIDENT_REGISTER_ACCIDENT",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Register > Incident",
        key: "INCIDENT_ACCIDENT_REGISTER_INCIDENT",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Assigned Tasks > Accident",
        key: "INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Assigned Tasks > Incident",
        key: "INCIDENT_ACCIDENT_ASSIGNED_TASKS_INCIDENT",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        break: true,
        name: "Document",
      },
      {
        name: "Register",
        key: "DOCUMENT_REGISTER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        break: true,
        name: "Occupational Health",
      },
      {
        name: "Dashboard",
        key: "OCCUPATIONAL_HEALTH_DASHBOARD",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Clinical Suite > Patient Register",
        key: "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PATIENT_REGISTER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Clinical Suite > Consultation",
        key: "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_CONSULTATION",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Clinical Suite > Medicine Stock",
        key: "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_MEDICINE_STOCK",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Clinical Suite > Pharmacy Queue",
        key: "OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PHARMACY_QUEUE",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Medicine Inventory > Medicine Request",
        key: "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_MEDICINE_REQUEST",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Medicine Inventory > Purchase & Inventory",
        key: "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_PURCHASE_INVENTORY",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Medicine Inventory > Transaction",
        key: "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_TRANSACTION",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Medicine Inventory > Assigned Tasks",
        key: "OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_ASSIGNED_TASKS",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Medical Records > Maternity Register",
        key: "OCCUPATIONAL_HEALTH_MEDICAL_RECORDS_MATERNITY_REGISTER",
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
    mainSection: "Social Apps",
    subSections: [
      {
        name: "Grievance > Dashboard",
        key: "GRIEVANCE_DASHBOARD",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Grievance > Register",
        key: "GRIEVANCE_REGISTER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Grievance > Assigned Tasks",
        key: "GRIEVANCE_ASSIGNED_TASKS",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        break: true,
        name: "RAG",
      },
      {
        name: "Dashboard",
        key: "RAG_DASHBOARD",
        permissionsExists: {
          VIEW: true,
          CREATE: false,
          EDIT: false,
          DELETE: false,
        },
      },
      {
        name: "Register",
        key: "RAG_REGISTER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        name: "Assigned Tasks",
        key: "RAG_ASSIGNED_TASKS",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        break: true,
        name: "Engagement",
      },
      {
        name: "Register",
        key: "ENGAGEMENT_REGISTER",
        permissionsExists: {
          VIEW: true,
          CREATE: true,
          EDIT: true,
          DELETE: true,
        },
      },
      {
        break: true,
        name: "Attrition",
      },
      {
        name: "Register",
        key: "ATTRITION_REGISTER",
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
  HOME_TEXT = "HOME_TEXT",
  HOME_VIEW = "HOME_VIEW",
  ADMIN_TEXT = "ADMIN_TEXT",
  ADMIN_USERS_VIEW = "ADMIN_USERS_VIEW",
  ADMIN_ACCESS_MNG_VIEW = "ADMIN_ACCESS_MNG_VIEW",
  WASTE_MNG_TEXT = "WASTE_MNG_TEXT",
  WASTE_MNG_DASHBOARD = "WASTE_MNG_DASHBOARD",
  WASTE_MNG_HISTORY = "WASTE_MNG_HISTORY",
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
  HOME_TEXT: true,
  HOME_VIEW: true,
  ADMIN_TEXT: true,
  ADMIN_USERS_VIEW: true,
  ADMIN_ACCESS_MNG_VIEW: true,
  WASTE_MNG_TEXT: true,
  WASTE_MNG_DASHBOARD: true,
  WASTE_MNG_HISTORY: true,
};
