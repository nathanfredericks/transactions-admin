"use server";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { redirect } from "next/navigation";
import { dynamoDBClient } from "@/app/utils/dynamodb";

export async function deleteOverride(id: string) {
  await dynamoDBClient.send(
    new DeleteItemCommand({
      TableName: "TransactionOverrides",
      Key: {
        id: { S: id },
      },
    }),
  );
  redirect("/");
}
