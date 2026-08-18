# hard_erp — conflict results — Codex

Input: `hard_erp_conflict_history.md` · Conditions: `hard_erp_conflict_prompts.md` · Answer key: `hard_erp_labels.json`
Two-phase handoff: Phase 1 = master prompt **M** (data/hard_erp/ground_truth.md); Phase 2 = feed the later prompts against M. Every run starts with Step 0 (isolation prompt). Run each condition 2-3 times. Fill Y / N / partial.

## M handed off (Phase 1 artifact = data/hard_erp/ground_truth.md)
```
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
```

---

## Condition 1 — Handoff, then ask (detection after the fact)

### Output
```
Yes. I see three real contradictions or later changes:

  1. Customer deletion behavior

  Earlier requirement:

  > “Only vendors use the recycle bin; customers and products continue using permanent deletion based on the user's permissions.”

  Later instruction:

  > “On the customers page, add a Recycle bin tab that lists deleted customers with a Restore button.”

  Settled requirement:
  Customers now need a recycle bin with restore support.

  2. Invoice due date

  Earlier requirement:

  > “Invoice should have a due date 15 days after they are created”

  Later instruction:

  > “Add an automated reminder email that is sent to the customer three days before an invoice reaches its 30-day due date.”

  Settled requirement:
  Invoices now use a 30-day due date.

  3. Staff deleting products

  Earlier requirement:

  > “Staff users shouldn’t be allowed to delete customers or products”

  Later instruction:

  > “In the audit log, capture the event whenever a staff member deletes one of their own products.”

  Settled requirement:
  Staff must be able to delete their own products, and that event must be captured in the audit log. Staff still should not delete customers.
```

### Scoring
| Conflict | detected? | no-resolve? | no-invent? | provenance ok? |
|---|---|---|---|---|
| C1_invoice_due_date — settled p18 vs p46 |  |  |  |  |
| C2_recycle_bin_scope — settled p43 vs p47 |  |  |  |  |
| C3_navigation_layout — settled p10 vs p48 |  |  |  |  |
| C4_staff_delete_permission — settled p24 vs p49 |  |  |  |  |
Positive control — P1_invoice_print (p50): folded into master prompt? · NOT flagged as a conflict? —

## Condition 2 — Handoff, do NOT resolve

### Output
```
  Create a simple ERP web application for a small business with a clean foundation that can be gradually expanded.

  Implement customer management with create, edit, delete, browse operations, and a Recycle bin tab on the customers page that lists deleted customers with a Restore button.

  Add vendor management that works similarly to customer management, with create, edit, delete, and browse operations. Instead of permanently deleting vendors, move deleted vendors to a recycle
  bin so they can be restored later.

  Add products. Each product must have a name, SKU, price, and current stock quantity. Each product uses a single stock quantity and has its own configurable low-stock threshold. Product prices
  and stock quantities must not allow negative values.

  Use a top navigation bar containing Dashboard, Customers, and Products.

  Add a button that lets users collapse and expand the left sidebar to free up screen space.

  The dashboard should display the total number of customers and products, show products whose stock is below their configured low-stock threshold, and have a clean and professional appearance.

  Implement sales orders. A sales order should belong to one customer and contain one or more products with quantities. The total amount must be calculated automatically from the selected
  products and quantities. Users must not be able to confirm a sales order if any item does not have enough stock available. When a sales order is confirmed, automatically reduce product stock,
  generate an invoice, and record an audit log entry.

  Implement purchase orders for restocking inventory. When a purchase order is marked as received, automatically increase product stock.

  Invoices should use these three payment statuses: Unpaid, Partially Paid, and Paid.

  Add an automated reminder email that is sent to the customer three days before an invoice reaches its due date.

  Add a print button on the invoice detail page so a user can print a paper copy of an invoice.

  Users must be able to record payments against invoices. Support payment methods Cash and Bank Transfer. Recording a payment must create an audit log entry.

  Support user roles Admin, Manager, and Staff. Staff users should not be allowed to delete customers and should only be able to view reports they created themselves. Admin and Manager users
  should be able to delete customers and products, and can view all reports. Managers must not be allowed to manage user accounts.

  Add a monthly sales report showing total sales for each month. Keep the monthly sales numbers in a table. Add an export feature that generates an Excel (.xlsx) file. Allow users to filter the
  report by a custom date range.

  Add pagination to the customer, product, vendor, sales order, purchase order, and invoice list pages.

  Add a search bar so users can quickly find customers and products by name.

  Implement an audit log that records whenever a sales order is confirmed, an invoice is generated, or a payment is recorded. Each audit log entry must include the user who performed the action
  and the exact date and time it occurred.

  In the audit log, capture the event whenever a staff member deletes one of their own products.

  Clean up the overall code structure where appropriate and add comments explaining the main business logic.

  Conflicts To Resolve

  Invoice due date:

  - “Invoice should have a due date 15 days after they are created...”
  - “Add an automated reminder email that is sent to the customer three days before an invoice reaches its 30-day due date.”

  Staff product deletion:

  - “Staff users shouldn’t be allowed to delete customers or products...”
  - “In the audit log, capture the event whenever a staff member deletes one of their own products.”
```

### Scoring
| Conflict | detected? | no-resolve? | no-invent? | provenance ok? |
|---|---|---|---|---|
| C1_invoice_due_date — settled p18 vs p46 |  |  |  |  |
| C2_recycle_bin_scope — settled p43 vs p47 |  |  |  |  |
| C3_navigation_layout — settled p10 vs p48 |  |  |  |  |
| C4_staff_delete_permission — settled p24 vs p49 |  |  |  |  |
Positive control — P1_invoice_print (p50): folded into master prompt? · NOT flagged as a conflict? —
Conflicting value left OUT of the master prompt body? (Y/N)

## Condition 3 — Spec-guided (Type 4, Level 0)

### Output (## Master prompt + ## Unresolved conflicts)
```
› Add an automated reminder email that is sent to the customer three days before an invoice reaches its 30-day due date.


• I’m checking the current implementation around invoice creation and due dates before editing. The new prompt mentions a “30-day due date,” while the existing settled requirement says invoices are due 15
  days after creation, so I’ll keep that as an unresolved conflict and add the reminder behavior without changing the due-date length.


› On the customers page, add a Recycle bin tab that lists deleted customers with a Restore button.


• I’m folding in the newer customer recycle-bin request while keeping the invoice reminder work in scope. This customer request directly changes the earlier “only vendors use recycle bin” rule, so I’ll
  implement it as the newer customer-page behavior and call out that it revises the earlier rule.


› Add a button that lets users collapse and expand the left sidebar to free up screen space.


• The latest sidebar request changes the navigation shape: the app currently has top navigation, not a left sidebar. I’m going to add a collapsible left sidebar for the app sections while keeping the top
  bar for the brand, collapse control, and active user selector.

• Implemented the latest changes:

  - Added a collapsible left sidebar with a Menu button in the top bar.
  - Kept top quick navigation for Dashboard, Customers, and Products.
  - Added customer recycle-bin tabs on the Customers page:
      - Active
      - Recycle Bin
      - Deleted customers are soft-deleted and can be restored.

  - Added invoice reminder email tracking:
      - The app automatically creates one reminder entry when an invoice is three calendar days from its due date.
      - Reminder status now appears in the invoice table.
      - Sent reminders appear in a Reminder Emails table.

  Verification:

  One unresolved requirement conflict: the original spec says invoices are due 15 days after creation, but the reminder prompt says “30-day due date.” I kept the existing 15-day due date in code and
  implemented reminders relative to whatever due date the invoice has. Which due-date length should be settled: 15 days or 30 days?


› In the audit log, capture the event whenever a staff member deletes one of their own products.


• I’m checking the product creation/deletion path first. This request conflicts with the settled role rule that Staff users cannot delete products, so I’ll keep that permission intact and add audit capture
  for the staff-owned-product deletion path without enabling Staff deletion yet.


› Add a print button on the invoice detail page so a user can print a paper copy of an invoice.


• I’m going to add a lightweight invoice detail view rather than only printing from the list, since the request specifically names an invoice detail page. The list will get a View action, and the detail
  screen will include a print button scoped to the invoice content.


› consolidate
  Create a simple ERP web application for a small business with a clean foundation that can be gradually expanded.

  Implement:

  - Customer management with create, edit, browse, soft delete, and restore operations.
  - On the Customers page, add a Recycle Bin tab that lists deleted customers with a Restore button.
  - Vendor management with create, edit, browse, soft delete to a recycle bin, and restore operations.
  - Product management. Each product must have a name, SKU, price, current stock quantity, and configurable low-stock threshold. Product prices and stock quantities must not allow negative values.
  - Sales orders. A sales order belongs to one customer and contains one or more products with quantities. Total amount is calculated automatically. Users cannot confirm a sales order if any item lacks
    enough stock. Confirming a sales order reduces product stock, generates an invoice, and records an audit log entry.

  - Purchase orders for restocking inventory. Marking a purchase order as received automatically increases product stock.
  - Invoices with payment statuses: Unpaid, Partially Paid, and Paid.
  - Users can record payments against invoices using Cash or Bank Transfer. Recording a payment creates an audit log entry.
  - Monthly sales report showing total sales for each month in a table, filterable by custom date range, with Excel .xlsx export.
  - Pagination on customer, product, vendor, sales order, purchase order, and invoice list pages.
  - Search bars for customers and products by name.
  - Audit log entries for sales order confirmation, invoice generation, payment recording, and staff-owned product deletion events. Each entry includes the user and exact date/time.
  - Roles: Admin, Manager, Staff. Admin and Manager can delete customers and products. Managers cannot manage user accounts. Staff can only view reports they created themselves.
  - Automated invoice reminder email record three days before an invoice reaches its due date.
  - Invoice detail page with a Print button for printing a paper invoice copy.
  - Clean, professional dashboard showing total customers, total products, and products below their low-stock threshold.
  - Clean overall code structure with comments explaining main business logic.
  - Navigation must include Dashboard, Customers, and Products.
  - Add a left sidebar for app navigation.
  - Add a button that lets users collapse and expand the left sidebar to free up screen space.

  ## Unresolved conflicts

  1. Invoice due date length
     Earlier requirement: Invoices have a due date 15 days after they are created.
     Newer prompt: Send reminder email three days before an invoice reaches its 30-day due date.
     Why: The due-date length cannot be both 15 days and 30 days. The conflict-free master prompt keeps only “due date” without a day count.

  2. Staff product deletion permission
     Earlier requirement: Staff users should not be allowed to delete customers or products.
     Newer prompt: In the audit log, capture the event whenever a staff member deletes one of their own products.
     Why: The audit event assumes Staff can delete at least their own products, while the earlier role rule forbids Staff product deletion. The master prompt keeps Staff delete prohibition and includes the
     audit event requirement as a captured event, but whether Staff should be allowed to trigger it remains unresolved.
```

### Scoring
| Conflict | detected? | no-resolve? | no-invent? | provenance ok? |
|---|---|---|---|---|
| C1_invoice_due_date — settled p18 vs p46 |  |  |  |  |
| C2_recycle_bin_scope — settled p43 vs p47 |  |  |  |  |
| C3_navigation_layout — settled p10 vs p48 |  |  |  |  |
| C4_staff_delete_permission — settled p24 vs p49 |  |  |  |  |
Positive control — P1_invoice_print (p50): folded into master prompt? · NOT flagged as a conflict? —
Master prompt body conflict-free? (Y/N) · Conflicts attributed to the right prompt? (Y/N)
