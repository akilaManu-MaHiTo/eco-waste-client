import axios from "axios";
import { z } from "zod";

export const binCollectionRequestSchema = z.object({
  _id: z.string().optional(),
  binId: z.string(),
  userId: z.string(),
  collectionDate: z.string(), 
  collectionTime: z.string(), 
  latitude: z.number(),
  longitude: z.number(),
  orderId: z.string(),
  amount: z.number(),
  paymentStatus: z.string(),
  createdAt: z.date().optional(),
});

export type BinCollectionRequest = z.infer<typeof binCollectionRequestSchema>;

export async function createBinCollectionRequest(data: Omit<BinCollectionRequest, '_id' | 'createdAt'>) {
  const res = await axios.post("/api/bin-collection-request", data);
  return res.data;
}
