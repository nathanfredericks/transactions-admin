"use client";
import {
  ActionElement,
  defaultOperators,
  type Field,
  QueryBuilder,
  type RuleGroupType,
} from "react-querybuilder";
import "react-querybuilder/dist/query-builder-layout.css";
import { BootstrapValueEditor } from "@/app/utils/BootstrapValueEditor";

type Props = {
  query: RuleGroupType;
  setQuery: (query: RuleGroupType) => void;
};

export function TransactionQueryBuilder(props: Props) {
  const { query, setQuery } = props;

  const months = [
    { name: 1, label: "January" },
    { name: 2, label: "February" },
    { name: 3, label: "March" },
    { name: 4, label: "April" },
    { name: 5, label: "May" },
    { name: 6, label: "June" },
    { name: 7, label: "July" },
    { name: 8, label: "August" },
    { name: 9, label: "September" },
    { name: 10, label: "October" },
    { name: 11, label: "November" },
    { name: 12, label: "December" },
  ];
  const date = new Date();
  const fields: Field[] = [
    {
      name: "merchant",
      label: "Merchant",
      operators: defaultOperators.filter((op) =>
        ["=", "!=", "contains", "doesNotContain"].includes(op.name),
      ),
      defaultOperator: "contains",
      className: "merchant",
    },
    {
      name: "amount",
      label: "Amount",
      inputType: "number",
      validator: (q) => typeof q === "number",
      operators: defaultOperators.filter((op) =>
        ["=", "!=", "<", ">", "<=", ">="].includes(op.name),
      ),
    },
    {
      name: "month",
      label: "Month",
      valueEditorType: "select",
      values: months,
      defaultValue: date.getMonth(),
      operators: defaultOperators.filter((op) => ["=", "!="].includes(op.name)),
    },
    {
      name: "day",
      label: "Day",
      inputType: "number",
      defaultValue: date.getDate(),
      validator: (q) => typeof q === "number" && q > 0 && q <= 31,
      operators: defaultOperators.filter((op) =>
        ["=", "!=", "<", ">", "<=", ">="].includes(op.name),
      ),
    },
  ];

  return (
    <QueryBuilder
      controlClassnames={{
        ruleGroup: "p-3 card",
        combinators: "form-select w-auto",
        addRule: "btn btn-primary",
        addGroup: "btn btn-primary",
        fields: "form-select w-25",
        operators: "form-select w-25",
        // value: "form-control w-50",
        removeRule: "btn btn-danger",
        removeGroup: "btn btn-danger",
      }}
      controlElements={{
        addGroupAction: (props) =>
          // eslint-disable-next-line react/prop-types
          props.level === 0 ? (
            <ActionElement {...props} label="Add group" />
          ) : null,
        addRuleAction: (props) => <ActionElement {...props} label="Add rule" />,
        removeRuleAction: (props) => (
          <ActionElement {...props} label="Remove" />
        ),
        removeGroupAction: (props) => (
          <ActionElement {...props} label="Remove" />
        ),
        valueEditor: BootstrapValueEditor,
      }}
      fields={fields}
      onQueryChange={setQuery}
      query={query}
    />
  );
}
