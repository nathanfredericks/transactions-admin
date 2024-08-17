import { Button } from "react-bootstrap";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import OverridesList from "@/app/components/OverridesList";
import { dynamoDBClient } from "@/app/utils/dynamodb";

async function getOverrides() {
  const { Items } = await dynamoDBClient.send(
    new ScanCommand({ TableName: "TransactionOverrides" }),
  );
  return Items?.map((item) => ({
    merchant: item.merchant.S,
    payee: item.payee.S,
  }))
    .filter(
      (item): item is { merchant: string; payee: string } => !!item.merchant,
    )
    .sort((a, b) => a.merchant.localeCompare(b.merchant));
}

export default async function Page() {
  const cachedOverrides = unstable_cache(getOverrides, undefined, {
    revalidate: 3600,
    tags: ["overrides"],
  });
  const overrides = (await cachedOverrides()) ?? [];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Overrides</h1>
        <Link href="/merchant/create">
          <Button>Create</Button>
        </Link>
      </div>
      <OverridesList overrides={overrides} />
    </>
  );
}
