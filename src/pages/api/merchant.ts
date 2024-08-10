import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { parseJsonPreprocessor } from "@/lib/utils";
import { createOverride, getOverrides } from "@/lib/override";

export const schema = z.object({
  merchant: z.string(),
  payee: z.string(),
});
const jsonSchema = z.preprocess(parseJsonPreprocessor, schema);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "POST") {
      const { merchant, payee } = await jsonSchema.parseAsync(req.body);
      const overrides = (await getOverrides()) ?? [];
      const merchants = overrides
        .map(({ merchant }) => merchant)
        .filter((merchant): merchant is string => !!merchant);
      if (merchants.includes(merchant)) {
        return res.status(409).json({});
      }
      await createOverride(merchant, payee);
      res.status(201).json({
        merchant,
        payee,
      });
    } else {
      res.status(405).json({});
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(error.errors);
    } else {
      console.error(error);
      return res.status(500).json({});
    }
  }
}
