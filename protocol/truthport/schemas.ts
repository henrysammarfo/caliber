import { z } from "zod";
import { MAX_TEXT_CHARS, MODEL_ID } from "../shared/types.js";

const nonEmptyText = z
  .string()
  .min(1, "text must be non-empty")
  .max(MAX_TEXT_CHARS, `text exceeds max ${MAX_TEXT_CHARS} chars`);

export const DetectRequestSchema = z
  .object({
    text: nonEmptyText.optional(),
    texts: z.array(nonEmptyText).min(1).max(64).optional(),
  })
  .strict()
  .refine((v) => (v.text !== undefined) !== (v.texts !== undefined), {
    message: "provide exactly one of text or texts",
  });

export type DetectRequest = z.infer<typeof DetectRequestSchema>;

export const DetectionResultSchema = z.object({
  confidence: z.number().min(0).max(1),
  isAI: z.boolean(),
  explanation: z.string(),
  model: z.literal(MODEL_ID),
});

export const DetectResponseSchema = z.union([
  DetectionResultSchema,
  z.object({
    results: z.array(DetectionResultSchema),
  }),
]);

export type DetectResponse = z.infer<typeof DetectResponseSchema>;
