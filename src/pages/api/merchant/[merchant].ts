import type { NextApiRequest, NextApiResponse } from "next";
import {
  DeleteItemCommand,
  DynamoDBClient,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { z } from "zod";
import { awsConfiguration, parseJsonPreprocessor } from "@/utils";

export const schema = z.object({
  payee: z.string(),
});
const jsonSchema = z.preprocess(parseJsonPreprocessor, schema);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const merchant = req.query.merchant as string;
  const dynamoDBClient = new DynamoDBClient(awsConfiguration);

  try {
    if (req.method === "PATCH") {
      const { payee } = await jsonSchema.parseAsync(req.body);
      await dynamoDBClient.send(
        new UpdateItemCommand({
          TableName: "TransactionOverrides",
          Key: {
            merchant: { S: merchant.toUpperCase() },
          },
          UpdateExpression: "SET payee = :payee",
          ExpressionAttributeValues: {
            ":payee": { S: payee },
          },
        }),
      );
      res.status(200).json({
        merchant,
        payee,
      });
    } else if (req.method === "DELETE") {
      await dynamoDBClient.send(
        new DeleteItemCommand({
          TableName: "TransactionOverrides",
          Key: {
            merchant: { S: merchant },
          },
        }),
      );
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
