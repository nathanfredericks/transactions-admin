import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OverrideForm } from "../src/app/overrides/components/OverrideForm";
vi.mock("../src/app/overrides/components/TransactionQueryBuilder", () => ({
  TransactionQueryBuilder: () => <div>Query builder</div>,
}));
const values = {
  name: "Watch",
  payee: "p",
  category: "",
  memo: "",
  query: {
    combinator: "and",
    rules: [{ field: "amount", operator: "=", value: 5.69 }],
  },
};
const props = {
  initialValues: values,
  payees: [{ id: "p", name: "Apple" }],
  categoryGroups: [],
};
it("uses a single form and shows server failures", async () => {
  const user = userEvent.setup();
  const onSubmit = vi
    .fn()
    .mockRejectedValue(new Error("Unable to save override."));
  const { container } = render(<OverrideForm {...props} onSubmit={onSubmit} />);
  expect(container.querySelectorAll("form")).toHaveLength(1);
  await user.click(screen.getByRole("button", { name: "Save" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Unable to save override.",
  );
  expect(onSubmit).toHaveBeenCalledWith(values);
  expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
});
it("blocks missing required payee", async () => {
  const onSubmit = vi.fn();
  render(
    <OverrideForm
      {...props}
      initialValues={{ ...values, payee: "" }}
      onSubmit={onSubmit}
    />,
  );
  await userEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(await screen.findByText("Payee is a required field")).toBeVisible();
  expect(onSubmit).not.toHaveBeenCalled();
});
