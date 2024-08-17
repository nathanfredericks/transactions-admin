"use server";

import { PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { dynamoDBClient } from "@/app/utils/dynamodb";

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
  revalidatePath("/");
  redirect("/");
}
