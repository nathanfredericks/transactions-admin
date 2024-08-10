import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

export const awsConfiguration =
  process.env.NODE_ENV === "production"
    ? {
        region: process.env.TRANSACTIONS_AWS_REGION || "",
        credentials: {
          accessKeyId: process.env.TRANSACTIONS_AWS_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.TRANSACTIONS_AWS_SECRET_ACCESS_KEY || "",
        },
      }
    : {};
export const dynamoDBClient = new DynamoDBClient(awsConfiguration);

export async function getOverrides() {
  const { Items } = await dynamoDBClient.send(
    new ScanCommand({ TableName: "TransactionOverrides" }),
  );
  return Items?.map((item) => ({
    merchant: item.merchant.S,
    payee: item.payee.S,
  }))
    .filter(
      (item): item is { merchant: string; payee: string } => !!item.merchant,
    )
    .sort((a, b) => a.merchant.localeCompare(b.merchant));
}

export async function getOverride(merchant: string) {
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

export async function createOverride(merchant: string, payee: string) {
  await dynamoDBClient.send(
    new PutItemCommand({
      TableName: "TransactionOverrides",
      Item: {
        merchant: { S: merchant },
        payee: { S: payee },
      },
    }),
  );
}

export async function updateOverride(merchant: string, payee: string) {
  await dynamoDBClient.send(
    new UpdateItemCommand({
      TableName: "TransactionOverrides",
      Key: {
        merchant: { S: merchant },
      },
      UpdateExpression: "SET payee = :payee",
      ExpressionAttributeValues: {
        ":payee": { S: payee },
      },
    }),
  );
}

export async function deleteOverride(merchant: string) {
  await dynamoDBClient.send(
    new DeleteItemCommand({
      TableName: "TransactionOverrides",
      Key: {
        merchant: { S: merchant },
      },
    }),
  );
}
