import axios from "axios";
import { z } from "zod";

export const deliverySchema = z.object({
  _id: z.string(),
  garbage: z.array(
    z.object({
      _id: z.string(),
      garbageId: z.object({
        _id: z.string(),
        wasteWeight: z.number(),
        garbageCategory: z.string(),
        status: z.string(),
        binId: z.object({
          _id: z.string(),
          binId: z.string(),
          location: z.string(),
          currentWasteLevel: z.number(),
          thresholdLevel: z.number(),
          binType: z.string(),
          availability: z.boolean(),
          latitude: z.number(),
          longitude: z.number(),
        }),
        createdBy: z.object({
          _id: z.string(),
          username: z.string(),
          mobile: z.string(),
          email: z.string(),
        }),
      }),
      price: z.number(),
      currency: z.string(),
      status: z.string(),
      dateAndTime: z.string(),
    })
  ),
  truck: z.object({
    _id: z.string(),
    truckId: z.string(),
    capacity: z.number(),
    status: z.string(),
    currentLocation: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  deliveryStatus: z.string(),
});

export type Delivery = z.infer<typeof deliverySchema>;
