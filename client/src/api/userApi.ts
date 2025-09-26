import axios from "axios";
import { z } from "zod";
import { PermissionKeysObjectSchema } from "../views/Administration/SectionList";
import { StorageFileSchema } from "../utils/StorageFiles.util";

export const userRoleSchema = z.object({
  _id: z.string(),
  userType: z.string(),
  description: z.string().optional(),
  permissionObject: PermissionKeysObjectSchema,
  createdAt: z.string(),
});
export type UserRole = z.infer<typeof userRoleSchema>;

export const userTypeSchema = z.object({
  _id: z.string(),
  userType: z.string(),
  description: z.string().optional(),
  permissionObject: PermissionKeysObjectSchema,
  createdAt: z.string(),
});
export type UserType = z.infer<typeof userTypeSchema>;

export const userSchema = z.object({
  _id: z.string(),
  email: z.string(),
  username: z.string().nullable(),
  userTypeId: z.number(),
  mobile: z.string(),
  userType: userTypeSchema,
  profileImage: z
    .array(z.union([z.instanceof(File), StorageFileSchema]))
    .optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  permissionObject: PermissionKeysObjectSchema,
});
export type User = z.infer<typeof userSchema>;

export const passwordResetSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
  newPassword_confirmation: z.string(),
});
export type PasswordReset = z.infer<typeof passwordResetSchema>;

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const res = await axios.post("/api/auth/login", {
    email,
    password,
  });
  return res.data;
}

export async function userPasswordReset(data: PasswordReset) {
  const res = await axios.post(`/api/user-change-password`, data);
  return res.data;
}

export async function registerUser({
  username,
  email,
  mobileNumber: mobile,
  password,
  confirmPassword: password_confirmation,
  isCompanyEmployee,
  department,
  jobPosition,
  assignedFactory,
  employeeNumber,
}: {
  email: string;
  password: string;
  username: string;
  mobileNumber: string;
  confirmPassword: string;
  isCompanyEmployee: boolean;
  jobPosition: string;
  department: string;
  assignedFactory: string[];
  employeeNumber: string;
}) {
  const res = await axios.post("/api/auth/register", {
    email,
    password,
    username,
    mobile,
    password_confirmation,
    isCompanyEmployee,
    jobPosition,
    department,
    assignedFactory,
    employeeNumber,
  });
  return res.data;
}

export async function validateUser() {
  const res = await axios.get("/api/auth/user");
  return res.data;
}

export async function fetchAllUsers() {
  const res = await axios.get("/api/auth/users");
  return res.data;
}

export async function forgotPassword({ email }: { email: string }) {
  const res = await axios.post("/api/forgot-password", {
    email,
  });
  return res.data;
}

export async function otpVerification({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  const res = await axios.post("/api/reset-password", {
    email,
    otp,
  });
  return res.data;
}

export async function resetPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const res = await axios.post("/api/change-password", {
    email,
    password,
  });
  return res.data;
}

export async function fetchAllAssigneeLevel() {
  const res = await axios.get("/api/assignee-level");
  return res.data;
}

export async function updateUserTypes({
  _id,
  userTypeId,
}: {
  _id: string;
  userTypeId: string;
}) {
  const res = await axios.put(`/api/auth/user-role/${_id}`, {
    userType: userTypeId.toString(),
  });

  return res.data;
}

//assignee by the responsible section
export async function fetchHazardRiskAssignee() {
  const res = await axios.get("/api/hazard-risks-assignee");
  return res.data;
}

export async function fetchAccidentAssignee() {
  const res = await axios.get("/api/accidents-assignee");
  return res.data;
}

export async function fetchIncidentAssignee() {
  const res = await axios.get("/api/incidents-assignee");
  return res.data;
}

export async function fetchMedicineRequestAssignee() {
  const res = await axios.get("/api/medicine-request-assignee");
  return res.data;
}

export async function fetchInternalAuditAssignee() {
  const res = await axios.get("/api/internal-audit-assignee");
  return res.data;
}

export async function fetchExternalAuditAssignee() {
  const res = await axios.get("/api/external-audit-assignee");
  return res.data;
}

export async function fetchGrievanceAssignee() {
  const res = await axios.get("/api/grievance-record-assignee");
  return res.data;
}

export async function updateUserProfileImage({
  id,
  imageFile,
}: {
  id: string;
  imageFile: File;
}) {
  const formData = new FormData();
  formData.append("profileImage[0]", imageFile); // Backend expects an array

  const res = await axios.post(`/api/user/${id}/profile-update`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

export async function updateUserProfileDetails({
  id,
  name,
  mobile,
}: {
  id: string;
  name: string;
  mobile: string;
}) {
  const data = {
    name,
    mobile,
  };

  const res = await axios.post(`/api/user/${id}/profile-update`, data);

  return res.data;
}

export async function resetProfileEmail({
  currentEmail,
  id,
}: {
  currentEmail: string;
  id: string;
}) {
  const res = await axios.post(`/api/user/${id}/email-change`, {
    currentEmail,
  });
  return res.data;
}

export async function resetProfileEmailVerification({
  otp,
  id,
}: {
  otp: string;
  id: string;
}) {
  const res = await axios.post(`/api/user/${id}/email-change-verify`, {
    otp,
  });
  return res.data;
}

export async function resetProfileEmailConfirm({
  newEmail,
  id,
}: {
  newEmail: string;
  id: string;
}) {
  const res = await axios.post(`/api/user/${id}/email-change-confirm`, {
    newEmail,
  });
  return res.data;
}

export async function searchUser({ query }: { query: string }) {
  const res = await axios.get(`/api/users/search?keyword=${query}`);
  return res.data;
}
