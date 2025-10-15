import axios from "axios";
import { z } from "zod";
import { userSchema } from "./userApi";
import { garbageSchema } from "./garbage";

export const truckSchema = z.object({
  _id: z.string(),
  truckId: z.string(),
  capacity: z.number(),
  status: z.string(),
  driver: userSchema.nullable(),
  currentLocation: z.string().nullable(),  
  assignRoute: garbageSchema.array().nullable(),
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