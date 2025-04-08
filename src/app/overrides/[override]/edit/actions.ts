"use server";

import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { redirect } from "next/navigation";
import { dynamoDBClient } from "@/app/utils/dynamodb";
import { InitialValues } from "@/app/types";

export async function updateOverride(
  id: string,
  { name, payee, category, memo }: InitialValues,
  query: string,
) {
  await dynamoDBClient.send(
    new UpdateItemCommand({
      TableName: "TransactionOverrides",
      Key: {
        id: { S: id },
      },
      UpdateExpression:
        "SET #name = :name, payee = :payee, category = :category, memo = :memo, #query = :query, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#name": "name",
        "#query": "query",
      },
      ExpressionAttributeValues: {
        ":name": { S: name },
        ":payee": { S: payee },
        ":category": category ? { S: category } : { NULL: true },
        ":memo": memo ? { S: memo } : { NULL: true },
        ":query": { S: query },
        ":updatedAt": { S: new Date().toISOString() },
      },
    }),
  );
  redirect("/");
}
