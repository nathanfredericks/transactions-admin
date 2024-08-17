import * as ynab from "ynab";

export async function getPayees() {
  const ynabAPI = new ynab.API(
    process.env.TRANSACTIONS_YNAB_ACCESS_TOKEN || "",
  );
  const { data } = await ynabAPI.payees.getPayees(
    process.env.TRANSACTIONS_YNAB_BUDGET_ID || "",
    undefined,
    {
      next: { revalidate: 3600 },
    },
  );
  return data.payees
    .filter((payee) => !payee.transfer_account_id && !payee.deleted)
    .map((payee) => payee.name)
    .sort();
}
