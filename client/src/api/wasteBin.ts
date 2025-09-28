import axios from "axios";
import { create } from "domain";
import { z } from "zod";

export const wasteBinSchema = z.object({
    _id: z.string(),
  binId: z.string(),
  location: z.string(),
  currentWasteLevel: z.number(),
  thresholdLevel: z.number(),
  availability: z.boolean(),
  binType: z.string(),
  createdAt: z.date(),
});
export type WasteBin = z.infer<typeof wasteBinSchema>;

export async function fetchWasteBins() {
  const res = await axios.get("/api/waste");
  return res.data;
}

export async function fetchWasteBinById(id: string) {
  const res = await axios.get(`/api/waste/${id}`);
  return res.data;
}

export async function createWasteBin(data: WasteBin) {
  const res = await axios.post("/api/waste", data);
  return res.data;
}

export async function updateWasteBin(data: WasteBin) {
  const res = await axios.put(`/api/waste/${data._id}`, data);
  return res.data;
}

export async function deleteWasteBin(id: string) {
  const res = await axios.delete(`/api/waste/${id}`);
  return res.data;
}
export const binTypeData = [
  { _id: "a", label: "Plastic" },
  { _id: "b", label: "Paper" },
];
