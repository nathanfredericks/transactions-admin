import { randomUUID } from "node:crypto";
import {
  ScanCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  type AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { dynamoDBClient, overridesTable } from "./dynamodb";
import { validateValues } from "./rules";
import type { InitialValues, Override } from "../types";
export function decodeItem(item: Record<string, AttributeValue>): Override {
  const value = (key: string) => item[key]?.S || "";
  return {
    id: value("id"),
    name: value("name"),
    payee: value("payee"),
    category: value("category"),
    memo: value("memo"),
    query: value("query"),
    updatedAt: value("updatedAt"),
  };
}
export async function listOverrides(): Promise<Override[]> {
  const items: Override[] = [];
  let cursor: Record<string, AttributeValue> | undefined;
  do {
    const result = await dynamoDBClient.send(
      new ScanCommand({ TableName: overridesTable, ExclusiveStartKey: cursor }),
    );
    items.push(...(result.Items || []).map(decodeItem));
    cursor = result.LastEvaluatedKey;
  } while (cursor && Object.keys(cursor).length);
  return items.sort(
    (a, b) =>
      (Date.parse(b.updatedAt) || 0) - (Date.parse(a.updatedAt) || 0) ||
      a.id.localeCompare(b.id),
  );
}
export async function getOverride(id: string): Promise<Override | undefined> {
  if (!id) throw new Error("Override ID is required.");
  const result = await dynamoDBClient.send(
    new GetItemCommand({
      TableName: overridesTable,
      Key: { id: { S: id } },
      ConsistentRead: true,
    }),
  );
  return result.Item ? decodeItem(result.Item) : undefined;
}
export async function saveOverride(
  values: InitialValues,
  id?: string,
): Promise<string> {
  const query = validateValues(values);
  const now = new Date().toISOString();
  const fields = {
    name: { S: values.name.trim() },
    payee: { S: values.payee },
    category: values.category ? { S: values.category } : { NULL: true },
    memo: values.memo ? { S: values.memo } : { NULL: true },
    query: { S: query },
    updatedAt: { S: now },
  };
  if (id) {
    await dynamoDBClient.send(
      new UpdateItemCommand({
        TableName: overridesTable,
        Key: { id: { S: id } },
        ConditionExpression: "attribute_exists(id)",
        UpdateExpression:
          "SET #name=:name, payee=:payee, category=:category, memo=:memo, #query=:query, updatedAt=:updatedAt",
        ExpressionAttributeNames: { "#name": "name", "#query": "query" },
        ExpressionAttributeValues: Object.fromEntries(
          Object.entries(fields).map(([k, v]) => [":" + k, v]),
        ),
      }),
    );
  } else {
    id = randomUUID();
    await dynamoDBClient.send(
      new PutItemCommand({
        TableName: overridesTable,
        ConditionExpression: "attribute_not_exists(id)",
        Item: { id: { S: id }, createdAt: { S: now }, ...fields },
      }),
    );
  }
  return id;
}
export async function removeOverride(id: string) {
  if (!id) throw new Error("Override ID is required.");
  await dynamoDBClient.send(
    new DeleteItemCommand({
      TableName: overridesTable,
      Key: { id: { S: id } },
    }),
  );
}
