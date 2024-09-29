"use client";
import { formatQuery, transformQuery } from "react-querybuilder";
import { parseJsonLogic } from "react-querybuilder/parseJsonLogic";
import { useParams } from "next/navigation";
import { CategoryGroup, InitialValues, Payee } from "@/app/types";
import { OverrideForm } from "@/app/overrides/components/OverrideForm";
import { updateOverride } from "@/app/overrides/[override]/edit/actions";

type Props = {
  payees: Payee[];
  categoryGroups: CategoryGroup[];
  name: string;
  payee: string;
  category: string;
  memo: string;
  query: string;
};

export default function EditOverride(props: Props) {
  const { payees, categoryGroups, name, payee, category, memo, query } = props;
  const { override: id } = useParams();

  const parsedJsonLogic = parseJsonLogic(query);
  const initialValues: InitialValues = {
    name,
    payee,
    category,
    memo,
    query: parsedJsonLogic,
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
                value: (rule.value as string).toUpperCase().slice(0, 16),
              };
            }
            return rule;
          },
        });
        const formattedQuery = JSON.stringify(
          formatQuery(transformedQuery, "jsonlogic"),
        );
        await updateOverride(id as string, values, formattedQuery);
      }}
      payees={payees}
    />
  );
}
