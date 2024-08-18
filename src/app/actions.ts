"use server";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { dynamoDBClient } from "@/app/utils/dynamodb";

export async function deleteOverride(merchant?: string) {
  await dynamoDBClient.send(
    new DeleteItemCommand({
      TableName: "TransactionOverrides",
      Key: {
        merchant: { S: merchant || "" },
      },
    }),
  );
  revalidatePath("/");
  redirect("/");
}
