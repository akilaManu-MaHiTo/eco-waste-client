import axios from "axios";
import { z } from "zod";

const binReferenceSchema = z.object({
  _id: z.string().optional(),
  binId: z.string().optional(),
  name: z.string().optional(),
  capacity: z.coerce.number().optional(),
});

export type WasteBinReference = z.output<typeof binReferenceSchema>;

const garbageSchema = z.object({
  _id: z.string(),
  wasteWeight: z.coerce.number(),
  garbageId: z.string().optional(),
  garbageCategory: z.string(),
  createdAt: z.union([z.string(), z.date()]),
  status: z.string().optional(),
  binId: z.union([binReferenceSchema, z.string(), z.null()]).optional(),
});

type GarbageSchemaOutput = z.output<typeof garbageSchema>;

export type Garbage = Omit<GarbageSchemaOutput, "binId"> & {
  binId?: WasteBinReference | string | null;
};

const garbageSummaryEntrySchema = z.object({
  user: z
    .object({
      _id: z.string().optional(),
      name: z.string().nullable().optional(),
      email: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  category: z.string(),
  totalWeight: z.coerce.number(),
  count: z.coerce.number(),
});

export type GarbageSummaryItem = z.infer<typeof garbageSummaryEntrySchema>;

const garbageTrendCategorySchema = z.object({
  category: z.string(),
  bin: z.any().optional(),
  totalWeight: z.coerce.number().default(0),
  count: z.coerce.number().default(0),
});

const garbageTrendDaySchema = z.object({
  date: z.string(),
  categories: z.array(garbageTrendCategorySchema),
});

const garbageTrendResponseSchema = z.object({
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  trend: z.array(garbageTrendDaySchema),
});

export type GarbageTrendResponse = z.infer<typeof garbageTrendResponseSchema>;

const garbageLevelBinSchema = z.object({
  binId: z.union([z.string(), binReferenceSchema]).optional(),
  binName: z.string().nullable().optional(),
  totalWeight: z.coerce.number().default(0),
  capacity: z.coerce.number().default(0),
  percentFilled: z.coerce.number().default(0),
  deposits: z.coerce.number().default(0),
});

const garbageLevelResponseSchema = z.object({
  overall: z.object({
    totalWeight: z.coerce.number().default(0),
    totalCapacity: z.coerce.number().default(0),
    percentFilled: z.coerce.number().default(0),
  }),
  bins: z.array(garbageLevelBinSchema),
});

export type GarbageLevelResponse = z.infer<typeof garbageLevelResponseSchema>;

export async function fetchGarbage(): Promise<Garbage[]> {
  const res = await axios.get("/api/garbage");
  const parsed = z.array(garbageSchema).parse(res.data);
  return parsed as Garbage[];
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
  {
    _id: "1A",
    wasteWeight: 2,
    garbageId: "G001",
    garbageCategory: "Plastic",
    status: "Pending",
  },
  {
    _id: "2A",
    wasteWeight: 3,
    garbageId: "G002",
    garbageCategory: "Paper",
    status: "Requested",
  },
  {
    _id: "3A",
    wasteWeight: 1.5,
    garbageId: "G003",
    garbageCategory: "Metal",
    status: "Requested",
  },
  {
    _id: "4A",
    wasteWeight: 4,
    garbageId: "G004",
    garbageCategory: "Glass",
    status: "Collected",
  },
  {
    _id: "5A",
    wasteWeight: 2.5,
    garbageId: "G005",
    garbageCategory: "Organic",
    status: "Collected",
  },
];

export const garbageCategory = [
  { _id: "a", label: "Plastic" },
  { _id: "b", label: "Paper" },
  { _id: "c", label: "Metal" },
  { _id: "d", label: "Glass" },
  { _id: "e", label: "Organic" },
];

export const garbageBinId = [
  { _id: "a", label: "PL 001" },
  { _id: "b", label: "PL 002" },
  { _id: "c", label: "PL 003" },
  { _id: "d", label: "PL 004" },
  { _id: "e", label: "PL 005" },
];

export async function fetchGarbageBins() {
  const res = await axios.get("/api/waste");
  return res.data;
}

type GarbageSummaryParams = {
  mine?: boolean;
};

export async function fetchGarbageSummary(
  params?: GarbageSummaryParams
): Promise<GarbageSummaryItem[]> {
  const res = await axios.get("/api/garbage/summary", {
    params: params?.mine ? { mine: "true" } : undefined,
  });
  return z.array(garbageSummaryEntrySchema).parse(res.data);
}

type GarbageTrendParams = {
  userIds?: string[];
  role?: string;
};

export async function fetchGarbageTrend(
  params?: GarbageTrendParams
): Promise<GarbageTrendResponse> {
  const res = await axios.get("/api/garbage/trend", {
    params: {
      ...(params?.role ? { role: params.role } : {}),
      ...(params?.userIds && params.userIds.length
        ? { userIds: params.userIds.join(",") }
        : {}),
    },
  });

  return garbageTrendResponseSchema.parse(res.data);
}

type GarbageLevelParams = {
  userId?: string;
  category?: string;
};

export async function fetchGarbageLevel(
  params?: GarbageLevelParams
): Promise<GarbageLevelResponse> {
  const res = await axios.get("/api/garbage/level", {
    params,
  });

  return garbageLevelResponseSchema.parse(res.data);
}