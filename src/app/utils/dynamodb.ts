import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const awsConfiguration = {
  region: process.env.TRANSACTIONS_AWS_REGION,
  credentials: {
    accessKeyId: process.env.TRANSACTIONS_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.TRANSACTIONS_AWS_SECRET_ACCESS_KEY || "",
  },
};
export const dynamoDBClient = new DynamoDBClient(awsConfiguration);
