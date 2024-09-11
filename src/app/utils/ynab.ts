import * as ynab from "ynab";

export async function getPayees() {
  const ynabAPI = new ynab.API(
    process.env.TRANSACTIONS_YNAB_ACCESS_TOKEN || "",
  );
  const { data } = await ynabAPI.payees.getPayees(
    process.env.TRANSACTIONS_YNAB_BUDGET_ID || "",
    undefined,
  );
  return data.payees
    .filter((payee) => !payee.transfer_account_id && !payee.deleted)
    .filter(
      (payee) =>
        ![
          "Manual Balance Adjustment",
          "Reconciliation Balance Adjustment",
          "Starting Balance",
        ].includes(payee.name),
    )
    .map((payee) => ({
      id: payee.id,
      name: payee.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCategories() {
  const ynabAPI = new ynab.API(
    process.env.TRANSACTIONS_YNAB_ACCESS_TOKEN || "",
  );
  const { data } = await ynabAPI.categories.getCategories(
    process.env.TRANSACTIONS_YNAB_BUDGET_ID || "",
    undefined,
  );
  return data.category_groups
    .filter((group) => !group.deleted)
    .filter(
      (group) =>
        ![
          "Internal Master Category",
          "Credit Card Payments",
          "Hidden Categories",
        ].includes(group.name),
    )
    .map((group) => ({
      id: group.id,
      name: group.name,
      categories: group.categories
        .filter((category) => !category.deleted)
        .map(({ id, name }) => ({ id, name })),
    }));
}
