import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { parseJsonPreprocessor } from "@/lib/utils";
import { deleteOverride, updateOverride } from "@/lib/override";
export const schema = z.object({
  payee: z.string(),
});
const jsonSchema = z.preprocess(parseJsonPreprocessor, schema);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const merchant = req.query.merchant as string;

  try {
    if (req.method === "PATCH") {
      const { payee } = await jsonSchema.parseAsync(req.body);
      await updateOverride(merchant, payee);
      res.status(200).json({
        merchant,
        payee,
      });
    } else if (req.method === "DELETE") {
      await deleteOverride(merchant);
      res.status(200).json({});
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
