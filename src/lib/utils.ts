import { z, ZodIssueCode } from "zod";
import * as ynab from "ynab";

export function parseJsonPreprocessor(value: any, ctx: z.RefinementCtx) {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (e) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: (e as Error).message,
      });
    }
  }
  return value;
}

export async function getYNABPayees() {
  const ynabAPI = new ynab.API(
    process.env.TRANSACTIONS_YNAB_ACCESS_TOKEN || "",
  );
  const { data } = await ynabAPI.payees.getPayees(
    process.env.TRANSACTIONS_YNAB_BUDGET_ID || "",
    undefined,
    {
      next: { revalidate: 300 },
    },
  );
  return data.payees
    .filter((payee) => !payee.transfer_account_id && !payee.deleted)
    .map((payee) => payee.name)
    .sort();
}
