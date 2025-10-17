import axios from "axios";
import { z } from "zod";
import { userSchema } from "./userApi";
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
export async function fetchGarbageCollectionDataApproved() {
  const res = await axios.get(`/api/garbage-request/approved`);
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

//get all completed requests
export async function fetchAllCompletedRequests() {
  const res = await axios.get(`/api/collection-route/completed`);
  return res.data;
}

//get all inprogress requests
export async function fetchAllInProgressRequests() {
  const res = await axios.get(`/api/collection-route/in-progress`);
  return res.data;
}

//delivery status update
export async function updateDeliveryStatusInProgress(truckId: string, collectionRouteId: string) {
  const res = await axios.put(`/api/collection-route/inprogress/${truckId}/${collectionRouteId}`);
  return res.data;
}

export async function updateDeliveryStatusCompleted(truckId: string, collectionRouteId: string) {
  console.log("Updating to completed:", truckId, collectionRouteId);
  const res = await axios.put(`/api/collection-route/completed/${truckId}/${collectionRouteId}`);
  return res.data;
}

// Dashboard API s
export async function fetchGarbageByCategory() {
  const res = await axios.get(`/api/garbage-request/garbage-by-category`);
  return res.data;
}

export async function fetchRequestsByStatus() {
  const res = await axios.get(`/api/garbage-request/requests-by-status`);
  return res.data;
}

export async function fetchWasteByBinType() {
  const res = await axios.get(`/api/garbage-request/waste-by-bin-type`);
  return res.data;
}

export async function fetchDailyCollections() {
  const res = await axios.get(`/api/garbage-request/daily-collections`);
  return res.data;
}

export async function fetchRevenueByCategory() {
  const res = await axios.get(`/api/garbage-request/revenue-by-category`);
  return res.data;
}

export async function fetchMonthlyRequests() {
  const res = await axios.get(`/api/garbage-request/monthly-requests`);
  return res.data;
}

export async function fetchDailyRequestsByDateAndTime() {
  const res = await axios.get(`/api/garbage-request/daily-requests`);
  return res.data;
}