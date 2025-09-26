import axios from "axios";
import { UserRole } from "./userApi";

export const getAccessRolesList = async () => {
  const res = await axios.get(`/api/role`);
  return res.data;
};

export const createAccessRole = async (role: UserRole) => {
  const res = await axios.post(`/api/user-permissions`, role);
  return res.data;
};

export const updateAccessRole = async (role: UserRole) => {
  const res = await axios.post(`/api/user-permissions/${role._id}/update`, role);
  return res.data;
};

export const deleteAccessRole = async (roleId: string) => {
  const res = await axios.delete(`/api/user-permissions/${roleId}/delete`);
  return res.data;
};
