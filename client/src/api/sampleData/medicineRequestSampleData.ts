import { MedicineRequest } from "../medicineRequestApi";

export const sampleMedicines = [
  { id: "1", medicineName: "Biogesic" },
  { id: "2", medicineName: "Neozep" },
  { id: "3", medicineName: "Solmux" },
  { id: "4", medicineName: "Alaxan" },
  { id: "5", medicineName: "Bioflu" },
  { id: "6", medicineName: "Dolfenal" },
  { id: "7", medicineName: "Decolgen" },
];

export const medicineRequestSampleData: MedicineRequest[] = [
  {
    id: "1",
    createdAt: "2021-10-01",
    division: "Pharmacy",
    genericName: "Paracetamol",
    medicineName: "Biogesic",
    medicineId: "1",
    publishedAt: "2021-10-01",
    referenceNumber: "123456",
    requestDate: "2021-10-01",
    requestQuantity: "10",
    status: "Approved",
    updatedAt: "2021-10-01",
  },
  {
    id: "2",
    createdAt: "2021-10-01",
    division: "Pharmacy",
    genericName: "Paracetamol",
    medicineName: "Biogesic",
    medicineId: "1",
    publishedAt: "2021-10-01",
    referenceNumber: "123456",
    requestDate: "2021-10-01",
    requestQuantity: "10",
    status: "Approved",
    updatedAt: "2021-10-01",
  },
];
