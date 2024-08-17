import type { Metadata } from "next";
import { MerchantCreateForm } from "@/app/merchant/create/components/MerchantCreateForm";
import { getPayees } from "@/app/utils/ynab";

export const metadata: Metadata = {
  title: "Create Override | Transactions",
};

export default async function Page() {
  const payees = await getPayees();

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Create override</h1>
      </div>
      <MerchantCreateForm payees={payees} />
    </>
  );
}
