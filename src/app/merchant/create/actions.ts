"use server";

import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { dynamoDBClient } from "@/app/utils/dynamodb";

export async function createOverride(merchant: string, payee: string) {
  await dynamoDBClient.send(
    new PutItemCommand({
      TableName: "TransactionOverrides",
      Item: {
        merchant: { S: merchant.toUpperCase() },
        payee: { S: payee },
      },
    }),
  );
  revalidatePath("/");
  redirect("/");
}
