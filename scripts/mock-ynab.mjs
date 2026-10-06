import http from "node:http";
import fs from "node:fs";
const { rules } = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const payees = [...new Set(rules.map((r) => r.payee))].map((id) => ({
  id,
  name: id,
  deleted: false,
  transfer_account_id: null,
}));
const categories = [
  ...new Set(rules.map((r) => r.category).filter(Boolean)),
].map((id) => ({ id, name: id, deleted: false }));
http
  .createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.url.endsWith("/payees"))
      res.end(JSON.stringify({ data: { payees } }));
    else if (req.url.endsWith("/categories"))
      res.end(
        JSON.stringify({
          data: {
            category_groups: [
              {
                id: "test-group",
                name: "Subscriptions",
                deleted: false,
                categories,
              },
            ],
          },
        }),
      );
    else {
      res.statusCode = 404;
      res.end("{}");
    }
  })
  .listen(Number(process.env.MOCK_YNAB_PORT || 18001), "127.0.0.1");
