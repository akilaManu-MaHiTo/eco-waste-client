import axios from "axios";
import { UserRole } from "./userApi";

export const getAccessRolesList = async () => {
  const res = await axios.get(`/api/role`);
  return res.data;
};

export const createAccessRole = async (role: UserRole) => {
  const res = await axios.post(`/api/role`, role);
  return res.data;
};

export const updateAccessRole = async ({
  role,
  id,
}: {
  role: UserRole;
  id: string;
}) => {
  console.log(role);
  const res = await axios.put(`/api/role/${id}`, role);
  return res.data;
};


export const deleteAccessRole = async (roleId: string) => {
  const res = await axios.delete(`/api/user-permissions/${roleId}/delete`);
  return res.data;
};
