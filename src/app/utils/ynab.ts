import * as ynab from "ynab";

export async function getPayees() {
  try {
    if (!process.env.YNAB_ACCESS_TOKEN || !process.env.YNAB_BUDGET_ID) {
      throw new Error("YNAB access token and budget must be configured.");
    }

    const ynabAPI = new ynab.API(
      process.env.YNAB_ACCESS_TOKEN,
      process.env.YNAB_API_URL,
    );
    const { data } = await ynabAPI.payees.getPayees(process.env.YNAB_BUDGET_ID);
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
  } catch {
    throw new Error(
      "Unable to load YNAB payees. Check configuration and retry.",
    );
  }
}

export async function getCategories() {
  try {
    if (!process.env.YNAB_ACCESS_TOKEN || !process.env.YNAB_BUDGET_ID) {
      throw new Error("YNAB access token and budget must be configured.");
    }

    const ynabAPI = new ynab.API(
      process.env.YNAB_ACCESS_TOKEN,
      process.env.YNAB_API_URL,
    );
    const { data } = await ynabAPI.categories.getCategories(
      process.env.YNAB_BUDGET_ID,
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
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error(
      "Unable to load YNAB categories. Check configuration and retry.",
    );
  }
}
