import axios from "axios";
import { z } from "zod";
import { userSchema } from "./userApi";
import { garbageRequestSchema } from "./garbageRequestApi";

export const truckSchema = z.object({
  _id: z.string(),
  truckId: z.string(),
  capacity: z.number(),
  status: z.string(),
  driver: userSchema.nullable(),
  currentLocation: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),  
  assignRoute: garbageRequestSchema.nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Truck = z.infer<typeof truckSchema>;

export async function fetchTrucks() {
  const res = await axios.get("/api/truck");
  return res.data;
}

export async function createTruck(data: Truck) {
  const res = await axios.post("/api/truck", data);
  return res.data;
}

export async function updateTruck(data: Truck) {
  const res = await axios.put(`/api/truck/${data._id}`, data);
  return res.data;
}

export async function deleteTruck(id: string) {
  const res = await axios.delete(`/api/truck/${id}`);
  return res.data;
}

export const truckStatusData = [
  { _id: "active", label: "Available" },
  { _id: "inservice", label: "In Service" },
  { _id: "maintenance", label: "Under Maintenance" },
];