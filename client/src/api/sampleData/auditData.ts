export const sampleAuditData = [
  {
    id: "1",
    referenceNumber: "AUD-001",
    auditDate: new Date("2025-02-15T09:30:00Z"),
    created_At: new Date("2024-03-01T10:00:00Z"),
    approvalDate: new Date("2024-03-01T10:00:00Z"),
    auditExpiryDate: new Date("2024-03-01T10:00:00Z"),
    assesmentDate: new Date("2024-03-01T10:00:00Z"),
    auditType: "Internal",
    auditCategory: "Quality",
    auditStandard: "ISO 9001",
    customer: "ABC Corp",
    auditFirm: "XYZ Auditors",
    division: "Manufacturing",
    auditStatus: "Completed",
    lapsedStatus: "Active",
    auditorName: "Bat Man",
    status: "Approved",
    auditScore: "10",
    gracePeriod: "10",
    numberOfNonCom: "258",
    auditFee: "1230.00",
    auditGrade: "A+",
    documents: [
      {
        fileName: "water_saving_plan.pdf",
        imageUrl: "https://example.com/water_saving_plan.pdf"
      }
    ],
    createdBy: "Mama Thama",
    announcement: "Announced",
    remarks: "Hiii",
    approver: {
      name: "Akila"
    },
    representer: {
      name: "Akila"
    }
  }
];

export const auditTypeData = [
  {
    id:"1",
    type: "Internal Audit"
  },
  {
    id:"2",
    type: "External Audit"
  },
]
