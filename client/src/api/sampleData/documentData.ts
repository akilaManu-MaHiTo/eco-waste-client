import { Document, DocumentType } from "../documentApi";

export const sampleDivisions = [
  {
    id: "div_1",
    name: "Corporate",
  },
  {
    id: "div_2",
    name: "Vintage Denim Ltd",
  },
  {
    id: "div_3",
    name: "Vintage Denim Apparels Ltd.",
  },
  {
    id: "div_4",
    name: "Vintage Denim Studio Ltd.",
  },
  {
    id: "div_5",
    name: "All units",
  },
];

export const sampleDepartments = [
  {
    id: "dept_1",
    name: "IE",
  },
  {
    id: "dept_2",
    name: "Audit",
  },
  {
    id: "dept_3",
    name: "Finance and Accounts",
  },
  {
    id: "dept_4",
    name: "3D",
  },
  {
    id: "dept_5",
    name: "Store",
  },
  {
    id: "dept_6",
    name: "Sample",
  },
  {
    id: "dept_7",
    name: "Quality",
  },
  {
    id: "dept_8",
    name: "Wait Process",
  },
  {
    id: "dept_9",
    name: "Cutting",
  },
];

export const sampleDocuments: Document[] = [
  {
    id: "doc_1",
    documentNumber: 1,
    versionNumber: 1,
    documentType: DocumentType.POLICY_AND_PROCEDURES,
    title: "Policy Title",
    division: "Corporate",
    issuingAuthority: "Authority 1",
    documentReviewer: "Reviewer 1",
    issuedDate: new Date("2021-10-10"),
    isNoExpiry: false,
    expiryDate: new Date("2022-10-10"),
    notifyDate: new Date("2022-09-10"),
    createdDate: new Date("2021-10-10"),
    createdBy: "Admin",
    documentHistory: [
      {
        documentNumber: "12",
        issuedDate: new Date("2021-10-10"),
        expiryDate: new Date("2022-10-10"),
        notifyDate: new Date("2022-09-10"),
      },
      {
        documentNumber: "14",
        issuedDate: new Date("2021-10-10"),
        expiryDate: new Date("2022-10-10"),
        notifyDate: new Date("2022-09-10"),
      },
      {
        documentNumber: "15",
        issuedDate: new Date("2021-10-10"),
        expiryDate: new Date("2022-10-10"),
        notifyDate: new Date("2022-09-10"),
      },
    ],
  },
  {
    id: "doc_2",
    documentNumber: 2,
    versionNumber: 1,
    documentType: DocumentType.POLICY_AND_PROCEDURES,
    title: "Policy Title",
    division: "Vintage Denim Ltd",
    issuingAuthority: "Authority 2",
    documentReviewer: "Reviewer 2",
    issuedDate: new Date("2021-10-10"),
    isNoExpiry: false,
    expiryDate: new Date("2022-10-10"),
    notifyDate: new Date("2022-09-10"),
    createdDate: new Date("2021-10-10"),
    createdBy: "Admin",
    documentHistory: [
      {
        documentNumber: "12",
        issuedDate: new Date("2021-10-10"),
        expiryDate: new Date("2022-10-10"),
        notifyDate: new Date("2022-09-10"),
      },
      {
        documentNumber: "14",
        issuedDate: new Date("2021-10-10"),
        expiryDate: new Date("2022-10-10"),
        notifyDate: new Date("2022-09-10"),
      },
      {
        documentNumber: "15",
        issuedDate: new Date("2021-10-10"),
        expiryDate: new Date("2022-10-10"),
        notifyDate: new Date("2022-09-10"),
      },
    ],
    activityStream: [
      {
        date: new Date("2021-10-10 10:00"),
        user: "Admin",
        action: "created a new document",
      },
      {
        date: new Date("2021-10-10 10:00"),
        user: "Admin",
        action: "updated the document",
      },
      {
        date: new Date("2021-10-10 10:00"),
        user: "Admin",
        action: "deleted the document",
      },
    ],
  },
];
