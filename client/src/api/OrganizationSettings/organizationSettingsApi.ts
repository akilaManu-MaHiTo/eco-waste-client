import axios from "axios";
import { z } from "zod";
import { StorageFileSchema } from "../../utils/StorageFiles.util";

export const ColorPalletSchema = z.object({
  palletId: z.number(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  buttonColor: z.string(),
});
export type ColorPallet = z.infer<typeof ColorPalletSchema>;

export const OrganizationSchema = z.object({
  id: z.number(),
  organizationName: z.string(),
  organizationFactoryName: z.string(),
  logoUrl: z.array(z.union([z.instanceof(File), StorageFileSchema])).optional(),
  insightDescription: z.string(),
  colorPallet: z.array(ColorPalletSchema),
  insightImage: z
    .array(z.union([z.instanceof(File), StorageFileSchema]))
    .optional(),
  created_at: z.date(),
});
export type Organization = z.infer<typeof OrganizationSchema>;

export async function getOrganization() {
  const res = await axios.get(`/api/organizations`);
  return res.data;
}

export const updateOrganization = async (organization: Organization) => {
  if (!organization.id) {
    throw new Error("Org must have an ID for an update.");
  }

  const formData = new FormData();

  // Explicitly handle logoUrl
  if (Array.isArray(organization.logoUrl)) {
    const logo = organization.logoUrl[0];
    if (logo instanceof File) {
      formData.append("logoUrl", logo);
    }
  }

  // Explicitly handle insightImage
  if (Array.isArray(organization.insightImage)) {
    const insight = organization.insightImage[0];
    if (insight instanceof File) {
      formData.append("insightImage", insight);
    }
  }

  // Handle all other fields
  Object.keys(organization).forEach((key) => {
    const value = organization[key as keyof Organization];

    if (key === "logoUrl" || key === "insightImage") return;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, JSON.stringify(item));
      });
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  });
  console.log("datass", formData);
  try {
    const response = await axios.post(
      `/api/organizations/${organization.id}/update`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating Org:", error);
    throw error;
  }
};
