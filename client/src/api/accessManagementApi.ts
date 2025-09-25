import axios from "axios";
import { UserRole } from "./userApi";

export const getAccessRolesList = async () => {
  const res = await axios.get(`/api/user-permissions`);
  return res.data;
};

export const createAccessRole = async (role: UserRole) => {
  const res = await axios.post(`/api/user-permissions`, role);
  return res.data;
};

export const updateAccessRole = async (role: UserRole) => {
  const res = await axios.post(`/api/user-permissions/${role.id}/update`, role);
  return res.data;
};

export const deleteAccessRole = async (roleId: number) => {
  const res = await axios.delete(`/api/user-permissions/${roleId}/delete`);
  return res.data;
};
