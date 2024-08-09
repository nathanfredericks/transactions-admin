import {z, ZodIssueCode} from "zod";
import * as ynab from "ynab";
import {DynamoDBClient, GetItemCommand, ScanCommand} from "@aws-sdk/client-dynamodb";

export function parseJsonPreprocessor(value: any, ctx: z.RefinementCtx) {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (e) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: (e as Error).message,
      });
    }
  }
  return value;
}

export async function getPayees() {
  const ynabAPI = new ynab.API(process.env.YNAB_ACCESS_TOKEN || "");
  const { data } = await ynabAPI.payees.getPayees(process.env.YNAB_BUDGET_ID || "", undefined, {
    next: { revalidate: 300 },
  });
  return data.payees
    .filter((payee) => !payee.transfer_account_id && !payee.deleted)
    .map((payee) => payee.name)
    .sort();
}

export async function getOverride(merchant: string) {
  const dynamoDBClient = new DynamoDBClient();
  const { Item } = await dynamoDBClient.send(
    new GetItemCommand({
      TableName: "TransactionOverrides",
      Key: {
        merchant: { S: merchant },
      },
    }),
  );
  return {
    merchant: Item?.merchant.S,
    payee: Item?.payee.S,
  };
}

export async function getOverrides() {
  const dynamoDbClient = new DynamoDBClient();
  const { Items } = await dynamoDbClient.send(
    new ScanCommand({ TableName: "TransactionOverrides" }),
  );
  return Items?.map((item) => ({
    merchant: item.merchant.S,
    payee: item.payee.S,
  })) ?? [];
}