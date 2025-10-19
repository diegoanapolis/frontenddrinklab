import { z } from "zod";
import { BEVERAGE_TYPES } from "@/lib/constants";

export const profileSchema = z.object({
  beverageType: z.enum(BEVERAGE_TYPES, {
    message: "Selecione o tipo de bebida",
  }),
  labelAbv: z
    .number()
    .min(30, "Mínimo 30% v/v")
    .max(60, "Máximo 60% v/v")
    .optional(),
  brand: z.string().max(60).optional(),
});

export const waterTempSchema = z.object({
  waterType: z.enum([
    "Mineral (recomendável)",
    "Potável/torneira",
    "Deionizada/Destilada (quando disponível)",
  ], {
    message: "Selecione o tipo de água",
  }),
  conductivity: z.number().optional(),
  temperature: z
    .number()
    .min(20, "Mínimo 20 °C")
    .max(50, "Máximo 50 °C"),
});

export const densitySchema = z.object({
  waterMasses: z.array(z.number()).min(1),
  sampleMasses: z.array(z.number()).min(1),
});

export const timesSchema = z.object({
  waterTimes: z.array(z.number()).min(2, "Informe pelo menos dois tempos de escoamento"),
  sampleTimes: z.array(z.number()).min(2, "Informe pelo menos dois tempos de escoamento"),
});

export type ProfileData = z.infer<typeof profileSchema>;
export type WaterTempData = z.infer<typeof waterTempSchema>;
export type DensityData = z.infer<typeof densitySchema>;
export type TimesData = z.infer<typeof timesSchema>;