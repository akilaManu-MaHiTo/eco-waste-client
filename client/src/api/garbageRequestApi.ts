import axios from "axios";
import { z } from "zod";
import { userSchema } from "./userApi";
import { wasteBinSchema } from "./wasteBin";

export const garbageRequestSchema = z.object({
  _id: z.string(),
  userId: userSchema,
  garbageId: z.string(),
  requestDate: z.date(),
  binId: wasteBinSchema,
  createdAt: z.date(),
  collectionDate: z.date().nullable(),
  collectionTime: z.date().nullable(),
});
export type GarbageRequest = z.infer<typeof garbageRequestSchema>;
