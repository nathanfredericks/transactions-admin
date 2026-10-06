import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, expect, vi } from "vitest";
const { remove } = vi.hoisted(() => ({ remove: vi.fn() }));
vi.mock("../src/app/actions", () => ({ deleteOverride: remove }));
import { DeleteOverrideButton } from "../src/app/overrides/[override]/edit/components/DeleteOverrideButton";
it("displays failed deletion feedback and allows retry", async () => {
  remove
    .mockResolvedValueOnce({
      error: "Unable to delete override. Please try again.",
    })
    .mockResolvedValueOnce(undefined);
  render(<DeleteOverrideButton id="test" />);
  await userEvent.click(screen.getByRole("button", { name: "Delete" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Unable to delete override",
  );
  await userEvent.click(screen.getByRole("button", { name: "Delete" }));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(remove).toHaveBeenCalledTimes(2);
});
