import {
  CategoryType,
  HazardAndRiskStatus,
  RiskLevel,
  UnsafeActOrCondition,
} from "../hazardRiskApi";
import { sampleDivisions } from "./documentData";

export const sampleHazardRiskData = [
  {
    id: "1",
    category: CategoryType.HEALTH_AND_HSE_MANAGEMENT,
    subCategory: "HSE Policy",
    observationType: "Observation",
    division: "Division A",
    locationOrDepartment: "Location 1",
    subLocation: "Sub-location 1",
    description: "Description of the hazard or risk",
    riskLevel: RiskLevel.HIGH,
    unsafeActOrCondition: UnsafeActOrCondition.UNSAFE_ACT,
    dueDate: new Date("2023-12-31"),
    assignee: "User A",
    documents: ["https://example.com/document1.pdf"],
    createdDate: new Date("2023-01-01"),
    createdByUser: "Admin",
    status: HazardAndRiskStatus.OPEN,
  },
  {
    id: "2",
    category: CategoryType.CHEMICAL_AND_ENVIRONMENTAL,
    subCategory: "Chemical Management",
    observationType: "Inspection",
    division: "Division B",
    locationOrDepartment: "Location 2",
    subLocation: "Sub-location 2",
    description: "Description of the hazard or risk",
    riskLevel: RiskLevel.MEDIUM,
    unsafeActOrCondition: UnsafeActOrCondition.UNSAFE_CONDITION,
    dueDate: new Date("2023-11-30"),
    assignee: "User B",
    documents: ["https://example.com/document2.pdf"],
    createdDate: new Date("2023-02-01"),
    createdByUser: "Admin",
    status: HazardAndRiskStatus.DRAFT,
  },
  {
    id: "3",
    category: CategoryType.MACHINE_SAFETY,
    subCategory: "Machine Safety Policy",
    observationType: "Audit",
    division: "Division C",
    locationOrDepartment: "Location 3",
    subLocation: "Sub-location 3",
    description: "Description of the hazard or risk",
    riskLevel: RiskLevel.LOW,
    unsafeActOrCondition: UnsafeActOrCondition.UNSAFE_ACT,
    dueDate: new Date("2023-10-31"),
    assignee: "User C",
    documents: ["https://example.com/document3.pdf"],
    createdDate: new Date("2023-03-01"),
    createdByUser: "Admin",
    status: HazardAndRiskStatus.OPEN,
  },
];

export const hazardRiskChartData1 = [
  {
    name: sampleDivisions[0].name,
    uv: 4000,
    pv: 2400,
  },
  {
    name: sampleDivisions[1].name,
    uv: 3000,
    pv: 1398,
  },
  {
    name: sampleDivisions[2].name,
    uv: 2000,
    pv: 9800,
  },
  {
    name: sampleDivisions[3].name,
    uv: 2780,
    pv: 3908,
  },
  {
    name: sampleDivisions[4].name,
    uv: 1890,
    pv: 4800,
  },
];

export const hazardRiskChartData2 = [
  { name: "Completed", value: 30 },
  { name: "Not completed", value: 70 },
];
