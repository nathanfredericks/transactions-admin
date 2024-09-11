import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dynamoDBClient } from "@/app/utils/dynamodb";
import { getCategories, getPayees } from "@/app/utils/ynab";
import { DeleteOverrideButton } from "@/app/overrides/[override]/edit/components/DeleteOverrideButton";
import EditOverride from "@/app/overrides/[override]/edit/components/EditOverride";

export const metadata: Metadata = {
  title: "Edit Override | Transactions",
};

export default async function Page({
  params,
}: {
  params: { override: string };
}) {
  const override = decodeURIComponent(params.override);

  const { Item } = await dynamoDBClient.send(
    new GetItemCommand({
      TableName: "TransactionOverrides",
      Key: {
        id: { S: override },
      },
    }),
  );

  if (!Item) {
    return notFound();
  }

  const payees = await getPayees();
  const categoryGroups = await getCategories();

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Edit {Item.name?.S || "Override"}</h1>
        <DeleteOverrideButton id={override} />
      </div>
      <EditOverride
        category={Item.category?.S || ""}
        categoryGroups={categoryGroups}
        memo={Item.memo.S || ""}
        name={Item.name?.S || ""}
        payee={Item.payee?.S || ""}
        payees={payees}
        query={Item.query?.S || ""}
      />
    </>
  );
}
