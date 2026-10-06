import { readFileSync } from "node:fs";
import { parseJsonLogic } from "react-querybuilder/parseJsonLogic";
import {
  CreateTableCommand,
  DescribeTableCommand,
} from "@aws-sdk/client-dynamodb";
import { dynamoDBClient, overridesTable } from "../src/app/utils/dynamodb";
import { saveOverride, listOverrides } from "../src/app/utils/overrides";
async function main() {
  try {
    await dynamoDBClient.send(
      new DescribeTableCommand({ TableName: overridesTable }),
    );
  } catch {
    await dynamoDBClient.send(
      new CreateTableCommand({
        TableName: overridesTable,
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        BillingMode: "PAY_PER_REQUEST",
      }),
    );
  }
  const fixture = JSON.parse(readFileSync(process.argv[2], "utf8"));
  for (const rule of fixture.rules) {
    const logic = JSON.parse(rule.query);
    const expand = (v: unknown): unknown => {
      if (Array.isArray(v)) return v.map(expand);
      if (!v || typeof v !== "object") return v;
      const o = v as Record<string, unknown>;
      if (Array.isArray(o.in) && Array.isArray(o.in[1]))
        return {
          or: o.in[1].map((n) => ({
            "==": [o.in instanceof Array ? o.in[0] : null, n],
          })),
        };
      return Object.fromEntries(
        Object.entries(o).map(([k, x]) => [k, expand(x)]),
      );
    };
    await saveOverride({
      name: rule.name,
      payee: rule.payee,
      category: rule.category || "",
      memo: rule.memo || "",
      query: parseJsonLogic(JSON.stringify(expand(logic))),
    });
  }
  const saved = await listOverrides();
  if (saved.length !== fixture.rules.length)
    throw new Error("Incomplete fixture seed");
  console.log(`Admin saved ${saved.length} contract rules to DynamoDB Local`);
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
