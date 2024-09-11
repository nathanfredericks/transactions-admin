import { Button } from "react-bootstrap";
import Link from "next/link";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { unstable_cache } from "next/cache";
import OverridesList from "@/app/components/OverridesList";
import { dynamoDBClient } from "@/app/utils/dynamodb";

async function getOverrides() {
  const { Items } = await dynamoDBClient.send(
    new ScanCommand({ TableName: "TransactionOverrides" }),
  );
  return Items?.map((item) => ({
    id: item.id?.S || "",
    name: item.name?.S || "",
    payee: item.payee?.S || "",
    category: item.category?.S || "",
    memo: item.memo?.S || "",
    query: item.query?.S || "",
    updatedAt: item.updatedAt?.S || "",
  }));
}

export default async function Page() {
  const cachedOverrides = unstable_cache(getOverrides, undefined, {
    revalidate: 3600,
    tags: ["overrides"],
  });
  const overrides = (await cachedOverrides()) ?? [];
  const sortedOverrides = overrides.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Overrides</h1>
        <Link href="/overrides/new">
          <Button>New</Button>
        </Link>
      </div>

      <OverridesList overrides={sortedOverrides} />
    </>
  );
}
