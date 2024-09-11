"use server";

import { randomUUID } from "node:crypto";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { dynamoDBClient } from "@/app/utils/dynamodb";
import { InitialValues } from "@/app/types";

export async function putOverride(
  { name, payee, category, memo }: InitialValues,
  query: string,
) {
  await dynamoDBClient.send(
    new PutItemCommand({
      TableName: "TransactionOverrides",
      Item: {
        id: { S: randomUUID() },
        name: { S: name },
        payee: { S: payee },
        category: category.length ? { S: category } : { NULL: true },
        memo: memo.length ? { S: memo } : { NULL: true },
        query: { S: query },
        createdAt: { S: new Date().toISOString() },
        updatedAt: { S: new Date().toISOString() },
      },
    }),
  );
  revalidatePath("/");
  redirect("/");
}
