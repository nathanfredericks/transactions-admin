import { test, expect } from "@playwright/test";
test("create, edit nullable metadata, and delete a rule through server actions", async ({
  page,
}) => {
  await page.goto("/overrides/new");
  await page.getByLabel("Override name").fill("Browser integration rule");
  await page
    .locator(".rule input")
    .fill("FULL MERCHANT DESCRIPTOR OVER SIXTEEN CHARACTERS");
  await page.getByLabel("Select a payee").selectOption({ index: 1 });
  await page.getByLabel("Select a category").selectOption({ index: 1 });
  await page
    .getByLabel("Memo", { exact: true })
    .fill('Subscription {{formatDate .Date "January 2006"}}');
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page).toHaveURL("/");
  let row = page
    .locator(".list-group-item")
    .filter({ hasText: "Browser integration rule" });
  await row.getByRole("button", { name: "Edit", exact: true }).click();
  await expect(page.locator(".rule input")).toHaveValue(
    "FULL MERCHANT DESCRIPTOR OVER SIXTEEN CHARACTERS",
  );
  await page.getByLabel("Override name").fill("Browser integration edited");
  await page.getByLabel("Select a category").selectOption("");
  await page.getByLabel("Memo", { exact: true }).fill("");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page).toHaveURL("/");
  row = page
    .locator(".list-group-item")
    .filter({ hasText: "Browser integration edited" });
  await row.getByRole("button", { name: "Edit", exact: true }).click();
  await expect(page.getByLabel("Memo", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Select a category")).toHaveValue("");
  await page.goto("/");
  await page
    .locator(".list-group-item")
    .filter({ hasText: "Browser integration edited" })
    .getByRole("button", { name: "Delete", exact: true })
    .click();
  await expect(
    page.getByText("Browser integration edited", { exact: true }),
  ).toHaveCount(0);
});
test("invalid query is visible and cannot be saved", async ({ page }) => {
  await page.goto("/overrides/new");
  await page.getByLabel("Override name").fill("Invalid");
  await page.getByLabel("Select a payee").selectOption({ index: 1 });
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Check your matching rules." }),
  ).toContainText("Check your matching rules.");
  await expect(page).toHaveURL("/overrides/new");
});
