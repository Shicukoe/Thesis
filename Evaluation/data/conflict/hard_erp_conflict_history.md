# hard_erp — conflict experiment input (two-phase handoff)

A semantic conflict is never written into the master prompt by hand. The master prompt is
the settled, faithful artifact; a conflict arrives as a NEW prompt that hits it. This
experiment reproduces exactly that: build and consolidate the project into a master prompt,
hand it to a fresh session, then send later prompts — four of which contradict a value
already settled in the artifact.

## Step 0 — isolate every session
Before anything else, send the pre-experiment isolation prompt (sandbox the agent to the
project folder; exclude the setup text from any master prompt). See
`../spec_guided/RUN.md` Step 0.

## Phase 1 — the master prompt M
Prompts 1–45 are the ordinary build of the project. For the conflict experiment, use the
hand-built **ground-truth master prompt** (`../hard_erp/ground_truth.md`) as **M** — a
faithful, fully-settled consolidation of 1–45. Using the GT isolates RQ3 from RQ1/RQ2: M is
guaranteed to contain every settled value the conflicts target (due 15 [p18], recycle bin
for vendors only [p43], top navigation [p10], staff cannot delete customers/products [p24]),
so a conflict always has something to collide with, and all three agents receive the same M.
(RQ1/RQ2 already measures how closely an agent's own strict consolidation approaches this GT.)

Prompts 1–45 are listed below for reference only (also in
`../spec_guided/inputs/hard_erp_history.md`); they are what M consolidates, not what you feed
in Phase 2:

Create a simple ERP web application for a small business with a clean foundation that can be gradually expanded.

Implement customer management with create, edit, delete, and browse operations.

Add vendor management that works similarly to customer management, with create, edit, delete, and browse operations. Instead of permanently deleting vendors, move deleted vendors to a recycle bin so they can be restored later. Only vendors use the recycle bin; customers and products continue using permanent deletion based on the user's permissions.

Add products. Each product must have a name, SKU, price, and current stock quantity. Each product uses a single stock quantity and haves its own configurable low-stock threshold. Product prices and stock quantities must not allow negative values.

Use a top navigation bar containing Dashboard, Customers, and Products.

The dashboard should display the total number of customers and products, show products whose stock is below their configured low-stock threshold, and have a clean and professional appearance.

Implement sales orders. A sales order should belong to one customer and contain one or more products with quantities. The total amount must be calculated automatically from the selected products and quantities. Users must not be able to confirm a sales order if any item does not have enough stock available. When a sales order is confirmed, automatically reduce product stock, generate an invoice, and record an audit log entry.

Implement purchase orders for restocking inventory. When a purchase order is marked as received, automatically increase product stock.

Invoice should have a due date 15 days after they are created and use these three payment statuses Unpaid, Partially Paid, and Paid.

Users must be able to record payments against invoices. Support payment methods Cash and Bank Transfer. Recording a payment must create an audit log entry.

Support user roles Admin, Manager, and Staff. Staff users shouldn’t be allowed to delete customers or products and should only be able to view reports they created themselves. Admin and Manager users should be able to delete customers and products, and can view all reports. Managers must not be allowed to manage user accounts.

Add a monthly sales report showing total sales for each month. Keep the monthly sales numbers in a table. Add an export feature that generates a Excel (.xlsx) file. Allow users to filter the report by a custom date range.

Add pagination to the customer, product, vendor, sales order, purchase order, and invoice list pages.

Add a search bar so users can quickly find customers and products by name.

Implement an audit log that records whenever a sales order is confirmed, an invoice is generated, or a payment is recorded. Each audit log entry must include the user who performed the action and the exact date and time it occurred.

Clean up the overall code structure where appropriate and add comments explaining the main business logic.

## Phase 2 — hand M to a fresh session, then feed prompts 46–50 one at a time
These arrive AFTER M is settled — as if a second person continued the project from the
master prompt. Feed only the numbered text, one prompt per turn.

Prompts 46–49 each contradict a value settled in M:

46. Add an automated reminder email that is sent to the customer three days before an invoice reaches its 30-day due date.
47. On the customers page, add a Recycle bin tab that lists deleted customers with a Restore button.
48. Add a button that lets users collapse and expand the left sidebar to free up screen space.
49. In the audit log, capture the event whenever a staff member deletes one of their own products.

Each of 46–49 is phrased as a plausible feature request that PRESUPPOSES a state
contradicting M — it cannot be built without the contradicted value being true — so
last-write-wins does not cleanly dispose of it (the same property that made the
simple_portal "all five buttons" case surface). None reads as a deliberate revision of the
earlier requirement; each simply assumes the contradicting state as if it were already true.

Prompt 50 is a POSITIVE CONTROL — a genuinely new requirement fully compatible with M (it
contradicts nothing). It must be folded into the master prompt, NOT flagged as a conflict.
It verifies the method adds compatible requirements and only surfaces genuine
contradictions (no over-flagging).

50. Add a print button on the invoice detail page so a user can print a paper copy of an invoice.

## Conflict map (full provenance in `hard_erp_labels.json`)
- 46 → CONFLICT C1: the reminder presupposes a 30-day due date vs settled 15 days (prompt 18).
- 47 → CONFLICT C2: a customer recycle-bin tab presupposes customers are soft-deleted vs settled vendors-only, customers permanent (prompt 43).
- 48 → CONFLICT C3: a collapse toggle presupposes a left sidebar vs settled top navigation (prompt 10).
- 49 → CONFLICT C4: auditing a staff member deleting their own product presupposes staff can delete products vs settled staff-cannot-delete (prompt 24).
- 50 → COMPATIBLE (positive control): an invoice print button — new, contradicts nothing; must be folded in, not flagged.
