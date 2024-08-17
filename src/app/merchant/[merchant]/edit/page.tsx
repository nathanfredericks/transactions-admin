import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InitialValues } from "@/app/types";
import { dynamoDBClient } from "@/app/utils/dynamodb";
import { MerchantEditForm } from "@/app/merchant/[merchant]/edit/components/MerchantEditForm";
import { MerchantDeleteButton } from "@/app/merchant/[merchant]/edit/components/MerchantDeleteButton";
import { getPayees } from "@/app/utils/ynab";

export const metadata: Metadata = {
  title: "Edit Override | Transactions",
};

export default async function Page({
  params,
}: {
  params: { merchant: string };
}) {
  const merchant = decodeURIComponent(params.merchant);

  const { Item } = await dynamoDBClient.send(
    new GetItemCommand({
      TableName: "TransactionOverrides",
      Key: {
        merchant: { S: merchant },
      },
    }),
  );

  if (!Item) {
    return notFound();
  }

  const initialValues: InitialValues = {
    merchant: Item?.merchant.S || "",
    payee: Item?.payee.S || "",
  };

  const payees = await getPayees();
  if (!payees.some((payee) => payee === initialValues.payee)) {
    payees.push(initialValues.payee);
    payees.sort();
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h1>
          Edit <span className="font-monospace">{merchant}</span>
        </h1>
        <MerchantDeleteButton merchant={merchant} />
      </div>
      <MerchantEditForm initialValues={initialValues} payees={payees} />
    </>
  );
}
