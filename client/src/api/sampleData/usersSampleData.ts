import { defaultAdminPermissions } from "../../views/Administration/SectionList";
import { User } from "../userApi";

export const sampleAssignees = [
  {
    id: "1",
    name: "John Doe",
  },
  {
    id: "2",
    name: "Jane Doe",
  },
  {
    id: "3",
    name: "John Smith",
  },
  {
    id: "4",
    name: "Jane Smith",
  },
];

export const sampleUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "johnd@gmail.com",
    mobile: "1234567890",
    emailVerifiedAt: "2021-10-10",
    status: "Active",
    isCompanyEmployee: true,
    createdAt: "2021-10-10",
    updatedAt: "2021-10-10",
    department: "IT",
    assignedFactory: ["1", "2"],
    jobPosition: "Software Engineer",
    role: "Admin",
    roleId: "1",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "janeD@gmail.com",
    mobile: "1234567890",
    role: "Manager",
    roleId: "2",
    emailVerifiedAt: "2021-10-10",
    status: "Active",
    isCompanyEmployee: true,
    createdAt: "2021-10-10",
    updatedAt: "2021-10-10",
    department: "IT",
    assignedFactory: ["1", "2"],
    jobPosition: "Associate Software Engineer",
  },
];

export const sampleRoles = [
  {
    id: "1",
    name: "Admin",
    description: "Admin role",
    accessSettings: defaultAdminPermissions,
  },
  {
    id: "2",
    name: "Manager",
    description: "Manager role",
    accessSettings: defaultAdminPermissions,
  },
];

export const sampleOrganization = [
  {
    id: 1,
    logoUrl: [
      {
        fileName: "681c9863425b5_map.png",
        imageUrl:
          "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg",
      },
    ],
    organizationName: "ABA GROUP",
    insightImage: [
      {
        fileName: "681c9863425b5_map.png",
        imageUrl:
          "https://storage.googleapis.com/mas_silueta_bucket/uploads/profile/681c9863425b5_map.png?GoogleAccessId=silueta-storage-service-accoun%40silueta-image-upload.iam.gserviceaccount.com&Expires=1747220527&Signature=o3DicV%2B1mveiAoMxDtLh9J8%2BTyZX9Fkb1ebLliroPbqPf2s7fKVd6cqxpo25DSmjCIelULJ5oVxvGZ0CA%2BeQ99KpkbmDokF%2FvyJW2jcFmNODobZtQdWVo7ELaAdveToemKtTDKQdRG5Z35hpdCfBLJNOlJM7WZFiN4eoPvh%2FAEsGgANUYl5hDyw2MtjjE2GqaHDSFzfxv1tHyrPuhyRmCHKVxT9d0%2BZu4p6%2FlyOV0RUOMEZIqblLgcUOnmbFC27DHt7MnPtGBpGIzuurEgAuI0j3wkriUVDCC1GDgmgryGeH1QnK9jxcnvQnHZH4fHQ552ay6QbG0W160PSQHqwHwA%3D%3D",
      },
    ],
    insightDescription: "Hi",
    colorPallet: [
      {
        primaryColor: "#1E3A8A",
        secondaryColor: "#60A5FA",
        buttonColor: "#10B981",
      },
    ],
    created_at: "2025.05.14",
  },
];
