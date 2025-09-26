import axios from "axios";
import { z } from "zod";

export const paymentSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  mobile: z.string(),
  address: z.string(),
  city: z.string(),
});
export type Payment = z.infer<typeof paymentSchema>;

export async function generatePayhereHash(
  orderId: string,
  amount: number,
  currency: string,
  packageName: string
) {
  const res = await axios.post("/api/payhere/hash", {
    orderId,
    amount,
    currency,
    packageName,
  });
  return res.data;
}
