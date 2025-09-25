import { z } from "zod";

export const StorageFileSchema = z.object({
  gsutil_uri: z.string(),
  imageUrl: z.string(),
  fileName: z.string(),
});

export type StorageFile = z.infer<typeof StorageFileSchema>;

export function getStorageFileTypeFromName(fileName: string) {
  const extension = fileName.split(".").pop();
  if (!extension) return null;
  if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
  if (["pdf"].includes(extension)) return "pdf";
  return null;
}
