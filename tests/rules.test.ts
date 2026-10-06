import { describe, it, expect } from "vitest";
import {
  serializeQuery,
  validNumber,
  validateValues,
} from "../src/app/utils/rules";
const query = (field = "amount", value: unknown = "5.69", operator = "=") => ({
  combinator: "and",
  rules: [{ field, operator, value }],
});
describe("rule serialization", () => {
  it("saves numeric operands and full merchant descriptors", () => {
    expect(JSON.parse(serializeQuery(query()))).toEqual({
      and: [{ "==": [{ var: "amount" }, 5.69] }],
    });
    expect(
      serializeQuery(
        query("merchant", "  openai *chatgpt subscription  ", "contains"),
      ),
    ).toContain("OPENAI *CHATGPT SUBSCRIPTION");
  });
  it.each([
    ["amount", ""],
    ["amount", 0],
    ["amount", "NaN"],
    ["amount", Infinity],
    ["day", 32],
    ["day", 1.5],
    ["month", 0],
    ["month", 13],
  ])("rejects %s %s", (field, value) => {
    expect(validNumber(value, field as string)).toBe(false);
    expect(() => serializeQuery(query(field as string, value))).toThrow();
  });
  it("handles nested groups and calendar months", () => {
    expect(
      serializeQuery({
        combinator: "or",
        rules: [query("month", 12), query("day", 31)],
      }),
    ).toContain('"month"},12');
  });
  it("rejects empty groups, unknown operators and fields", () => {
    for (const q of [
      { combinator: "and", rules: [] },
      query("merchant", "", "contains"),
      query("amount", 1, "contains"),
      query("injected", 1),
    ])
      expect(() => serializeQuery(q)).toThrow();
  });
  it("validates server input and optional metadata", () => {
    const v = {
      name: "test",
      payee: "payee",
      category: "",
      memo: "",
      query: query(),
    };
    expect(validateValues(v)).toBe(serializeQuery(v.query));
    for (const bad of [
      { ...v, name: "" },
      { ...v, payee: "" },
      { ...v, memo: "x".repeat(501) },
    ])
      expect(() => validateValues(bad)).toThrow();
  });
});
