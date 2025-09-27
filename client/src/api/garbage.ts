import axios from "axios";
import { z } from "zod";

export const binSchema = z.object({
  _id: z.string(),
  binId: z.string(),
});
export type WasteBin = z.infer<typeof binSchema>;

export const garbageSchema = z.object({
  _id: z.string(),
  wasteWeight: z.number(),
  garbageId: z.string(),
  garbageCategory: z.string(),
  createdAt: z.date(),
  status: z.string(),
  binId: binSchema,
});
export type Garbage = z.infer<typeof garbageSchema>;

export async function fetchGarbage() {
  const res = await axios.get("/api/garbage");
  return res.data;
}

export async function createGarbage(data: Garbage) {
  const res = await axios.post("/api/garbage", data);
  return res.data;
}

export async function updateGarbage(data: Garbage) {
  const res = await axios.put(`/api/garbage/${data._id}`, data);
  return res.data;
}

export async function deleteGarbage(id: string) {
  const res = await axios.delete(`/api/garbage/${id}`);
  return res.data;
}
export const garbageData = [
  { _id:"1A",wasteWeight: 2, garbageId: "G001", garbageCategory: "Plastic",status: "Pending" },
  { _id:"2A",wasteWeight: 3, garbageId: "G002", garbageCategory: "Paper",status: "Requested" },
  { _id:"3A",wasteWeight: 1.5, garbageId: "G003", garbageCategory: "Metal",status: "Requested" },
  { _id:"4A",wasteWeight: 4, garbageId: "G004", garbageCategory: "Glass",status: "Collected" },
  { _id:"5A",wasteWeight: 2.5, garbageId: "G005", garbageCategory: "Organic",status: "Collected" },
];

export const garbageCategory = [
    { _id: "a",label: "Plastic" },
    { _id: "b",label: "Paper" },
    { _id: "c",label: "Metal" },
    { _id: "d",label: "Glass" },
    { _id: "e",label: "Organic" },
]

export const garbageBinId = [
    { _id: "a",label: "PL 001" },
    { _id: "b",label: "PL 002" },
    { _id: "c",label: "PL 003" },
    { _id: "d",label: "PL 004" },
    { _id: "e",label: "PL 005" },
]

export async function fetchGarbageBins() {
  const res = await axios.get("/api/waste");
  return res.data;
}