"use client";
import { formatQuery, transformQuery } from "react-querybuilder";
import { CategoryGroup, InitialValues, Payee } from "@/app/types";
import { OverrideForm } from "@/app/overrides/components/OverrideForm";
import { putOverride } from "@/app/overrides/new/actions";

type Props = {
  payees: Payee[];
  categoryGroups: CategoryGroup[];
};

export default function NewOverride(props: Props) {
  const { payees, categoryGroups } = props;

  const initialValues: InitialValues = {
    name: "",
    payee: "",
    category: "",
    memo: "",
    query: {
      combinator: "and",
      rules: [{ field: "merchant", operator: "contains", value: "" }],
    },
  };

  return (
    <OverrideForm
      categoryGroups={categoryGroups}
      initialValues={initialValues}
      onSubmit={async (values) => {
        // Transform the merchant to uppercase
        const transformedQuery = transformQuery(values.query, {
          ruleProcessor: (rule) => {
            if (rule.field === "merchant") {
              return {
                ...rule,
                value: (rule.value as string).toUpperCase(),
              };
            }
            return rule;
          },
        });
        const formattedQuery = JSON.stringify(
          formatQuery(transformedQuery, "jsonlogic"),
        );
        await putOverride(values, formattedQuery);
      }}
      payees={payees}
    />
  );
}
