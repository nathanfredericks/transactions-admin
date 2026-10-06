# Admin validation and integration

Run `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test:coverage`, and `npm run build`. Install Chromium with `npx playwright install chromium`, then run `../transactions/scripts/integration.sh` with the backend checkout alongside this repo. The runner provides DynamoDB Local and fake YNAB credentials/lookup data. No production account is required. See the backend README for ports and rollback/deployment instructions.

Rules are validated and serialized on the server. Amounts are positive finite numbers; days are integers 1–31, months 1–12. Merchant strings preserve the entire descriptor and normalize casing. Optional category and memo are saved as DynamoDB NULL and decoded as empty controls. Updates fail if the record has been removed. Scans paginate and use the same timestamp/ID precedence as Go.

Memo templates use Go syntax: `{{.Date}}`, `{{formatDate .Date "January 2006"}}`, and `{{formatDate (subtractMonthFromDate .Date) "January 2006"}}`. The Go importer renders them in the budget timezone.

The cross-repository suite saves every legacy and active subscription fixture using this application's persistence path, then consumes them from Go and asserts exact fake YNAB payloads. Browser tests cover real server-action create/edit/delete, full merchant strings, optional metadata and invalid-query feedback. GitHub Actions runs both repositories' checks and integration tests for pushes and pull requests and retains failure artifacts.
