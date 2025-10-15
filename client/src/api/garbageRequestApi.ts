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
