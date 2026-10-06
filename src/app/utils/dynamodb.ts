import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
export const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "ca-central-1",
  ...(process.env.DYNAMODB_ENDPOINT
    ? { endpoint: process.env.DYNAMODB_ENDPOINT }
    : {}),
});
export const overridesTable =
  process.env.AWS_TRANSACTION_OVERRIDES_DYNAMODB_TABLE_NAME ||
  "TransactionOverrides";
