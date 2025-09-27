import axios from "axios";
import { z } from "zod";

export const garbageSchema = z.object({
  _id: z.string(),
  wasteWeight: z.number(),
  garbageId: z.string(),
  garbageCategory: z.string(),
});
export type Garbage = z.infer<typeof garbageSchema>;


export async function createGarbage(data: Garbage) {
  const res = await axios.post("/api/garbage", data);
  return res.data;
}

export const garbageData = [
  { _id:"1A",wasteWeight: 2, garbageId: "G001", garbageCategory: "Plastic" },
  { _id:"2A",wasteWeight: 3, garbageId: "G002", garbageCategory: "Paper" },
  { _id:"3A",wasteWeight: 1.5, garbageId: "G003", garbageCategory: "Metal" },
  { _id:"4A",wasteWeight: 4, garbageId: "G004", garbageCategory: "Glass" },
  { _id:"5A",wasteWeight: 2.5, garbageId: "G005", garbageCategory: "Organic" },
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