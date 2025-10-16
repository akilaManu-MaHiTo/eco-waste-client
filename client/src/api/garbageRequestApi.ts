import axios from "axios";
import { z } from "zod";
import { userSchema } from "./userApi";
import { wasteBinSchema } from "./wasteBin";
import { garbageSchema } from "./garbage";

export const garbageRequestSchema = z.object({
  _id: z.string(),
  userId: userSchema,
  createdBy: userSchema,
  garbageId: garbageSchema,
  createdAt: z.date(),
  collectionDate: z.date().nullable(),
  collectionTime: z.date().nullable(),
  dateAndTime: z.string().nullable(),
  price: z.number().nullable(),
});
export type GarbageRequest = z.infer<typeof garbageRequestSchema>;

export async function fetchGarbageCollectionData() {
  const res = await axios.get(`/api/garbage-request`);
  return res.data;
}

export async function createGarbageCollectionRoute(data: any) {
  const res = await axios.post(`/api/collection-route`, data);
  return res.data;
}

// get route by truck id
export async function fetchRouteByTruckId(truckId: string) {
  const res = await axios.get(`/api/collection-route/${truckId}`);
  return res.data;
}

//get all routes
export async function fetchAllRoutes() {
  const res = await axios.get(`/api/collection-route`);
  return res.data;
}

//get all pending requests
export async function fetchAllPendingRequests() {
  const res = await axios.get(`/api/collection-route/pending`);
  return res.data;
}

//delivery status update
export async function updateDeliveryStatusInProgress(truckId: string, collectionRouteId: string) {
  const res = await axios.put(`/api/collection-route/inprogress/${truckId}/${collectionRouteId}`);
  return res.data;
}

export async function updateDeliveryStatusCompleted(truckId: string, collectionRouteId: string) {
  const res = await axios.put(`/api/collection-route/completed/${truckId}/${collectionRouteId}`);
  return res.data;
}