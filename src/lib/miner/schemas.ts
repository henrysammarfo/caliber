import { z } from "zod";
import { MAX_TEXT_CHARS, MODEL_ID } from "./types";

const nonEmptyText = z
  .string()
  .min(1, "text must be non-empty")
  .max(MAX_TEXT_CHARS, `text exceeds max ${MAX_TEXT_CHARS} chars`);

export const DetectRequestSchema = z
  .object({
    text: nonEmptyText.optional(),
    query: nonEmptyText.optional(),
    texts: z.array(nonEmptyText).min(1).max(64).optional(),
  })
  .strict()
  .superRefine((v, ctx) => {
    const hasBatch = v.texts !== undefined;
    const hasSingle = v.text !== undefined || v.query !== undefined;
    if (hasBatch === hasSingle) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "provide exactly one of: text|query, or texts[]",
      });
    }
  });

export type DetectRequest = z.infer<typeof DetectRequestSchema>;

export const DetectionResultSchema = z.object({
  confidence: z.number().min(0).max(1),
  label: z.enum(["ai_generated", "human_written"]),
  reason: z.string(),
  verdict: z.enum(["ai_generated", "human_written"]),
  isAI: z.boolean(),
  model: z.literal(MODEL_ID),
  version: z.literal("2.0.0"),
});
