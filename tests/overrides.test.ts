import { beforeEach, it, expect, vi } from "vitest";
const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("../src/app/utils/dynamodb", () => ({
  dynamoDBClient: { send },
  overridesTable: "test",
}));
import {
  listOverrides,
  getOverride,
  saveOverride,
  removeOverride,
  decodeItem,
} from "../src/app/utils/overrides";
beforeEach(() => {
  send.mockReset();
});
it("paginates and sorts with stable ties, decoding NULL fields", async () => {
  send
    .mockResolvedValueOnce({
      Items: [{ id: { S: "b" }, updatedAt: { S: "2026-10-01" } }],
      LastEvaluatedKey: { id: { S: "b" } },
    })
    .mockResolvedValueOnce({
      Items: [
        {
          id: { S: "a" },
          updatedAt: { S: "2026-10-01" },
          memo: { NULL: true },
        },
      ],
    });
  const items = await listOverrides();
  expect(items.map((x) => x.id)).toEqual(["a", "b"]);
  expect(items[0].memo).toBe("");
  expect(send.mock.calls[1][0].input.ExclusiveStartKey).toEqual({
    id: { S: "b" },
  });
});
it("reads optional records consistently", async () => {
  send.mockResolvedValue({});
  expect(await getOverride("missing")).toBeUndefined();
  expect(send.mock.calls[0][0].input.ConsistentRead).toBe(true);
  expect(decodeItem({})).toMatchObject({ memo: "", category: "" });
});
const values = {
  name: " Test ",
  payee: "p",
  category: "",
  memo: "",
  query: {
    combinator: "and",
    rules: [{ field: "amount", operator: "=", value: "5.69" }],
  },
};
it("serializes on the server, writes NULL fields, and conditionally updates", async () => {
  send.mockResolvedValue({});
  const id = await saveOverride(values);
  expect(id).toMatch(/^[a-f0-9-]{36}$/);
  const put = send.mock.calls[0][0].input;
  expect(put.Item.memo).toEqual({ NULL: true });
  expect(put.Item.name.S).toBe("Test");
  expect(put.Item.query.S).toContain("5.69");
  await saveOverride(values, id);
  expect(send.mock.calls[1][0].input.ConditionExpression).toBe(
    "attribute_exists(id)",
  );
});
it("rejects malformed records before sending and propagates database failures", async () => {
  await expect(saveOverride({ ...values, payee: "" })).rejects.toThrow();
  expect(send).not.toHaveBeenCalled();
  send.mockRejectedValue(new Error("unavailable"));
  await expect(saveOverride(values)).rejects.toThrow("unavailable");
  await expect(removeOverride("")).rejects.toThrow();
  await expect(removeOverride("id")).rejects.toThrow("unavailable");
});
