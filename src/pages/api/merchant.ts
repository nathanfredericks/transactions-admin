import type { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { parseJsonPreprocessor } from "@/lib/utils";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { awsConfiguration, createOverride } from "@/lib/override";

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
