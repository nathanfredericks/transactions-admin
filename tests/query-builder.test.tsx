import { useState } from "react";
import { it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TransactionQueryBuilder } from "../src/app/overrides/components/TransactionQueryBuilder";
import type { RuleGroupType } from "react-querybuilder";
function Editor() {
  const [query, setQuery] = useState<RuleGroupType>({
    combinator: "and",
    rules: [{ field: "merchant", operator: "contains", value: "" }],
  });
  return <TransactionQueryBuilder query={query} setQuery={setQuery} />;
}
it("retains long merchant values and defaults to a one-based calendar month", async () => {
  const date = vi.spyOn(Date.prototype, "getMonth").mockReturnValue(9);
  const user = userEvent.setup();
  const { container } = render(<Editor />);
  const input = container.querySelector(".rule input") as HTMLInputElement;
  await user.type(input, "FULL MERCHANT DESCRIPTOR OVER SIXTEEN CHARACTERS");
  expect(input.value).toBe("FULL MERCHANT DESCRIPTOR OVER SIXTEEN CHARACTERS");
  await user.selectOptions(
    container.querySelector(".rule-fields") as HTMLSelectElement,
    "month",
  );
  expect(
    (container.querySelector(".rule-value") as HTMLSelectElement).value,
  ).toBe("10");
  date.mockRestore();
});
