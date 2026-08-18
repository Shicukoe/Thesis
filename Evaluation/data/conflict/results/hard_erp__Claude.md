# hard_erp — conflict results — Claude

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
> I have given you a sequence of prompts to build a project, in order. Some prompts
added a new requirement, some changed an earlier requirement, and some canceled or
undo an earlier requirement completely. Read them in the exact order given. Create
a master prompt that consolidate all of them into one single prompt.

Make sure that if I have modified or remove a requirement, this is correctly
reflected in the final single prompt. The final single prompt should have the exact
same meaning of all prompts without any additional or missing features.

Important rule: every requirement in the master prompt must be something I actually
wrote in one of these prompts. Do not add any requirement, detail, file name,
library, or design choice that I did not explicitly ask for, even if it seems like
a reasonable or natural thing to include. If something is not directly traceable
back to one of these numbered prompts, leave it out.

Create a simple ERP web application for a small business with a clean foundation that can be gradually expanded.

Implement customer management with create, edit, delete, and browse operations. On the customers page, add a Recycle bin tab that lists deleted customers with a Restore button.

Add vendor management that works similarly to customer management, with create, edit, delete, and browse operations. Instead of permanently deleting vendors, move deleted vendors to a recycle bin so they can be restored later. Products continue using permanent deletion based on the user's permissions.

Add products. Each product must have a name, SKU, price, and current stock quantity. Each product uses a single stock quantity and has its own configurable low-stock threshold. Product prices and stock quantities must not allow negative values.

Use a top navigation bar containing Dashboard, Customers, and Products. Add a button that lets users collapse and expand the left sidebar to free up screen space.

The dashboard should display the total number of customers and products, show products whose stock is below their configured low-stock threshold, and have a clean and professional appearance.

Implement sales orders. A sales order should belong to one customer and contain one or more products with quantities. The total amount must be calculated automatically from the selected products and quantities. Users must not be able to confirm a sales order if any item does not have enough stock available. When a sales order is confirmed, automatically reduce product stock, generate an invoice, and record an audit log entry.

Implement purchase orders for restocking inventory. When a purchase order is marked as received, automatically increase product stock.

Invoice should have a due date 15 days after they are created and use these three payment statuses Unpaid, Partially Paid, and Paid. Add an automated reminder email that is sent to the customer three days before an invoice reaches its 30-day due date. Add a print button on the invoice detail page so a user can print a paper copy of an invoice.

Users must be able to record payments against invoices. Support payment methods Cash and Bank Transfer. Recording a payment must create an audit log entry.

Support user roles Admin, Manager, and Staff. Staff users shouldn't be allowed to delete customers or products and should only be able to view reports they created themselves. Admin and Manager users should be able to delete customers and products, and can view all reports. Managers must not be allowed to manage user accounts.

Add a monthly sales report showing total sales for each month. Keep the monthly sales numbers in a table. Add an export feature that generates a Excel (.xlsx) file. Allow users to filter the report by a custom date range.

Add pagination to the customer, product, vendor, sales order, purchase order, and invoice list pages.

Add a search bar so users can quickly find customers and products by name.

Implement an audit log that records whenever a sales order is confirmed, an invoice is generated, or a payment is recorded, and whenever a staff member deletes one of their own products. Each audit log entry must include the user who performed the action and the exact date and time it occurred.

Clean up the overall code structure where appropriate and add comments explaining the main business logic.

Note on unresolved tensions I deliberately did not silently fix, since resolving them would mean adding a decision you didn't make: the invoice section now states both a 15-day due date and references a 30-day due date for the reminder email; the nav section asks for both a top navigation bar and a left-sidebar collapse toggle; and the audit log section both forbids Staff from deleting products and asks to log Staff deleting "their own" products. These came from prompts that were left mid-clarification, so I preserved them as-is rather than guessing your intent.

> Before I use this master prompt, are there any requirements that contradict each other —
two that cannot both be true in one implementation? List each one and quote the settled
requirement and the later instruction it came from.

Yes — three pairs of requirements in the master prompt cannot both be true in a single implementation:

1. Invoice due date: 15 days vs. 30 days

Settled requirement: "Invoice should have a due date 15 days after they are created and use these three payment statuses Unpaid, Partially Paid, and Paid."
Later instruction: "Add an automated reminder email that is sent to the customer three days before an invoice reaches its 30-day due date."
These can't coexist as written — an invoice can't simultaneously be due in 15 days and have a "30-day due date."
2. Top navigation bar vs. left sidebar

Settled requirement: "Use a top navigation bar containing Dashboard, Customers, and Products."
Later instruction: "Add a button that lets users collapse and expand the left sidebar to free up screen space."
The second instruction presupposes a left sidebar exists as the primary navigation, which conflicts with a top nav bar being the navigation structure.
3. Staff can't delete products vs. staff deleting their own products

Settled requirement: "Staff users shouldn't be allowed to delete customers or products..."
Later instruction: "In the audit log, capture the event whenever a staff member deletes one of their own products."
The second instruction presupposes Staff can delete products (at least ones they own), which directly contradicts the explicit restriction.
All three came from prompts that were interrupted before I could get clarification on how they should reconcile with the earlier spec, so the master prompt currently carries them unresolved rather than guessing which side should win.
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
Master Prompt
Build the following features:

Add an automated reminder email that is sent to the customer three days before an invoice reaches its 30-day due date.
On the customers page, add a Recycle bin tab that lists deleted customers with a Restore button.
Add a button that lets users collapse and expand the left sidebar to free up screen space.
In the audit log, capture the event whenever a staff member deletes one of their own products.
Add a print button on the invoice detail page so a user can print a paper copy of an invoice.
Conflicts found between prompts
None. Each of the five prompts introduced a distinct, independent feature — none of them modified, redefined, or canceled a requirement from an earlier prompt, so there was nothing to merge or drop.
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
First time:
Master prompt
Create a simple ERP web application for a small business with a clean foundation that can be gradually expanded.

Customers: create, edit, delete, and browse operations. Permanent deletion.

Vendors: create, edit, delete, and browse operations, working similarly to customers. Instead of permanent deletion, deleted vendors move to a recycle bin so they can be restored later. Only vendors use the recycle bin; customers and products continue using permanent deletion based on the user's permissions.

Products: each product must have a name, SKU, price, and current stock quantity. Each product uses a single stock quantity and has its own configurable low-stock threshold. Product prices and stock quantities must not allow negative values.

Navigation: a top navigation bar containing Dashboard, Customers, and Products.

Dashboard: displays the total number of customers and products, shows products whose stock is below their configured low-stock threshold, and has a clean and professional appearance.

Sales orders: belong to one customer and contain one or more products with quantities. The total amount is calculated automatically from the selected products and quantities. Users must not be able to confirm a sales order if any item does not have enough stock available. When a sales order is confirmed, automatically reduce product stock, generate an invoice, and record an audit log entry.

Purchase orders: for restocking inventory. When a purchase order is marked as received, automatically increase product stock.

Invoices: use three payment statuses — Unpaid, Partially Paid, and Paid.

Payments: users must be able to record payments against invoices. Support payment methods Cash and Bank Transfer. Recording a payment must create an audit log entry.

Print: a print button on the invoice detail page lets a user print a paper copy of an invoice.

User roles: Admin, Manager, and Staff.

Staff shouldn't be allowed to delete customers or products, and should only be able to view reports they created themselves.
Admin and Manager can delete customers and products, and can view all reports.
Managers must not be allowed to manage user accounts.
Monthly sales report: shows total sales for each month, kept in a table. Export feature generates an Excel (.xlsx) file. Users can filter the report by a custom date range.

Pagination: added to the customer, product, vendor, sales order, purchase order, and invoice list pages.

Search: a search bar lets users quickly find customers and products by name.

Audit log: records whenever a sales order is confirmed, an invoice is generated, or a payment is recorded. Each entry includes the user who performed the action and the exact date and time it occurred.

Code quality: clean overall code structure where appropriate, with comments explaining the main business logic.

Unresolved conflicts
Invoice due date: 15 days vs. 30 days

Earlier requirement: "Invoice should have a due date 15 days after they are created."
Later prompt: "Add an automated reminder email that is sent to the customer three days before an invoice reaches its 30-day due date" — implies a 30-day due date.
Not resolved; you said both should be left standing for now.
Reminder email delivery mechanism

Prompt: "Add an automated reminder email..." — no email-sending setup (SMTP/provider/credentials) has ever been specified.
You chose to hold off entirely rather than have me invent a mechanism.
Blocked on conflict #1 as well, since the trigger timing depends on the due-date rule.
Customer recycle bin vs. permanent deletion

Earlier requirement: "Only vendors use the recycle bin; customers and products continue using permanent deletion based on the user's permissions."
Later prompt: "On the customers page, add a Recycle bin tab that lists deleted customers with a Restore button."
Not resolved; both stand on record.
Top navigation bar vs. left sidebar

Earlier requirement: "Use a top navigation bar containing Dashboard, Customers, and Products."
Later prompt: "Add a button that lets users collapse and expand the left sidebar..." — assumes a left sidebar exists, which it doesn't.
Not resolved; no collapsible sidebar (or collapse behavior for the top nav) has been added.
Staff deleting their own products

Earlier requirement: "Staff users shouldn't be allowed to delete customers or products."
Later prompt: "capture the event whenever a staff member deletes one of their own products" — assumes Staff can delete products they own, and assumes products have an owner/creator, neither of which is in the spec.
Not resolved; Staff still cannot delete products, and no product-ownership concept or related audit entry has been added.

Second time:
Master prompt
Overview
A simple ERP web application for a small business, built with a clean foundation that can be gradually expanded.

Customer management
Create, edit, delete, and browse operations. Customers use permanent deletion (subject to user permissions).

Vendor management
Works like customer management (create, edit, delete, browse), except deletion is not permanent: deleted vendors move to a recycle bin and can be restored later. Only vendors use the recycle bin; customers and products continue using permanent deletion based on the user's permissions.

Products
Each product has a name, SKU, price, and current stock quantity. Each product uses a single stock quantity and has its own configurable low-stock threshold. Prices and stock quantities must not allow negative values.

Navigation
A top navigation bar contains Dashboard, Customers, and Products.

Dashboard
Displays the total number of customers and products, shows products whose stock is below their configured low-stock threshold, and has a clean and professional appearance.

Sales orders
Belongs to one customer and contains one or more products with quantities. Total amount is calculated automatically from selected products and quantities. Users cannot confirm a sales order if any item lacks sufficient stock. On confirmation: automatically reduce product stock, generate an invoice, and record an audit log entry.

Purchase orders
Used for restocking inventory. When marked as received, automatically increase product stock.

Invoices
Due date is 15 days after creation. Payment statuses: Unpaid, Partially Paid, Paid.

Payments
Users can record payments against invoices. Supported methods: Cash and Bank Transfer. Recording a payment creates an audit log entry.

User roles
Admin, Manager, Staff.

Staff: cannot delete customers or products; can only view reports they created themselves.
Admin and Manager: can delete customers and products; can view all reports.
Managers: must not be allowed to manage user accounts.
Monthly sales report
Shows total sales for each month in a table. Exportable to Excel (.xlsx). Filterable by a custom date range.

Pagination
Added to the customer, product, vendor, sales order, purchase order, and invoice list pages.

Search
A search bar lets users find customers and products by name.

Audit log
Records whenever a sales order is confirmed, an invoice is generated, or a payment is recorded. Each entry includes the user who performed the action and the exact date/time it occurred.

Invoice printing
A print button on the invoice detail page lets a user print a paper copy of the invoice.

Code quality
Clean code structure where appropriate, with comments explaining the main business logic.

Unresolved conflicts
Invoice due-date period, and reminder email delivery

Settled: invoices are due 15 days after creation.
New request: "an automated reminder email... three days before an invoice reaches its 30-day due date" — implies a 30-day due date, contradicting the settled 15-day rule.
Also open regardless of which period is chosen: no email-sending infrastructure exists; unclear whether the reminder should be a real SMTP send (requiring you to supply credentials) or a log-only simulation.
Kept out of the master prompt until resolved; feature not built.
Customer deletion: permanent vs. recycle bin

Settled: "Only vendors use the recycle bin; customers and products continue using permanent deletion."
New request: "Add a Recycle bin tab on the customers page... with a Restore button" — contradicts the settled rule.
Kept out of the master prompt until resolved; feature not built.
Navigation: top bar vs. left sidebar

Settled: "Use a top navigation bar containing Dashboard, Customers, and Products."
New request: "collapse and expand the left sidebar" — presumes a left sidebar layout that was never specified and contradicts the settled top-nav design.
Kept out of the master prompt until resolved; feature not built.
Staff deleting products, and product ownership

Settled: "Staff users shouldn't be allowed to delete customers or products."
New request: "capture the event whenever a staff member deletes one of their own products" — presumes Staff can delete products (contradicting the settled restriction) and introduces an unspecified "product ownership by staff" concept not present anywhere in the spec.
Kept out of the master prompt until resolved; feature not built.
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
