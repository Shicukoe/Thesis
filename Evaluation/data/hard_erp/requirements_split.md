# Hard ERP Project — Atomic Requirement Split

## Method — how this ground truth was built

This file is the **ground truth** for the hard_erp project, built by hand as an **atomic
requirement-level traceability map** rather than as free prose. It is the reference every
candidate master prompt is scored against, and it supplies the gold atomic units for
requirement-level evaluation.

Construction steps:

1. Start from the raw numbered prompt history (`Codex/additional prompts.txt`, 45 prompts).
2. Decompose the consolidated intent into **atomic requirements** — the smallest unit that
   can be independently satisfied or missed — grouped by feature/module.
3. Tag each requirement with the **source prompt number(s)** that produced its *final*
   form, including every prompt that touched it (e.g. Requirement 27 — Prompts 17 *and* 18,
   because 17 set a 30-day due date and 18 changed it to 15).
4. State each requirement in its **final resolved form**: all temporal conflicts are
   already collapsed to the last decision (single stock, per-product threshold, xlsx-only
   export, vendor recycle-bin, etc.).
5. Choose **granularity** by these rules:
   - **Keep permission rules fine-grained** — one requirement per (role × object), so a
     candidate that gets a single permission wrong is caught.
   - **Split a compound requirement** that bundles distinct facts, actions, or side-effects
     into one atomic requirement each, especially when it was drawn from more than one
     prompt: a sales order both *belongs to a customer* and *contains line items* → two;
     confirming an order that *reduces stock*, *generates an invoice*, and *writes an audit
     entry* → three; *recording payments* vs the *methods* supported → two; *cleaning up the
     code* vs *adding comments* → two; the navigation bar's *existence* vs its *contents*
     → two. Each is a separate decision a candidate can satisfy or miss independently.
   - **Merge an enumeration when its members are stated together as one set or as the
     values of one field** (the payment statuses, the payment methods, the user roles, the
     product's attribute list, the two dashboard totals, the audit-log event list, the
     pagination list pages): it is one decision a candidate satisfies as a set.
6. **Match the modal verb to the ground truth** (`should` / `must` / `must be able to` /
   `can` / imperative) instead of forcing every requirement to "must", so wording is
   consistent with the reference being scored against.
7. Record **corrections** to the raw history inline (e.g. the sidebar was removed in
   Prompt 10, not Prompt 5).

A separate **added-then-modified/removed** list at the end records requirements that were
introduced and later changed or cancelled; those are the *negative* gold (a candidate that
still asserts a superseded form is non-traceable) and the seed for the RQ3 conflict
scenarios.

---

## Project Foundation

### Requirement 1 — Prompt 1

Create a simple ERP web application for a small business with a clean foundation that can be gradually expanded.

---

## Customer Management

### Requirement 2 — Prompt 2

Implement customer management with create, edit, delete, and browse operations.

---

## Vendor Management

### Requirement 3 — Prompt 13

Add vendor management with create, edit, delete, and browse operations, working similarly to customer management.

### Requirement 4 — Prompt 42

Instead of permanently deleting a vendor, move it to a recycle bin so it can be restored later.

### Requirement 5 — Prompt 43

Only vendors use the recycle bin

### Requirement 6 — Prompt 43

Customers and products should continue using permanent deletion based on the user's permissions.


---

## Products

### Requirement 7 — Prompt 3

Add products.

### Requirement 8 — Prompt 3

Each product must have a name, SKU, price, and current stock quantity.

### Requirement 9 — Prompt 15

Each product uses a single stock quantity.

### Requirement 10 — Prompt 27

Each product has its own configurable low-stock threshold.

### Requirement 11 — Prompt 34

Product prices and stock quantities must not allow negative values.

---

## Navigation

### Requirement 12 — Prompts 4 and 10

Use a top navigation bar.

### Requirement 13 — Prompt 4

The top navigation bar should contain Dashboard, Customers, and Products.

---

## Dashboard

### Requirement 14 — Prompt 5

The dashboard should display the total number of customers and products.

### Requirement 15 — Prompts 26 and 27

The dashboard should show products whose stock is below their configured low-stock threshold.

### Requirement 16 — Prompt 31

The dashboard should have a clean and professional appearance.

---

## Sales Orders

### Requirement 17 — Prompt 6

Implement sales orders.

### Requirement 18 — Prompt 6

A sales order should belong to one customer.

### Requirement 19 — Prompt 6

A sales order should contain one or more products with quantities.

### Requirement 20 — Prompt 7

The total amount must be calculated automatically from the selected products and quantities.

### Requirement 21 — Prompt 9

Users must not be able to confirm a sales order if any item does not have enough stock available.

### Requirement 22 — Prompt 8

When a sales order is confirmed, automatically reduce product stock.

### Requirement 23 — Prompt 16

When a sales order is confirmed, automatically generate an invoice.

### Requirement 24 — Prompt 44

When a sales order is confirmed, record an audit log entry.

---

## Purchase Orders

### Requirement 25 — Prompt 11

Implement purchase orders for restocking inventory.

### Requirement 26 — Prompt 12

When a purchase order is marked as received, automatically increase product stock.

---

## Invoices

### Requirement 27 — Prompts 17 and 18

Each invoice should have a due date 15 days after it is created.

### Requirement 28 — Prompt 19

Each invoice uses the payment statuses Unpaid, Partially Paid, and Paid.

---

## Invoice Payments

### Requirement 29 — Prompt 20

Users must be able to record payments against invoices.

### Requirement 30 — Prompts 21 and 22

Support the payment methods Cash and Bank Transfer.

### Requirement 31 — Prompt 44

Recording a payment must create an audit log entry.

---

## User Roles

### Requirement 32 — Prompts 23 and 25

Support the user roles Admin, Manager, and Staff.

---

## User Permissions

### Requirement 33 — Prompt 24

Staff users shouldn't be allowed to delete customers.

### Requirement 34 — Prompt 24

Staff users shouldn't be allowed to delete products.

### Requirement 35 — Prompts 24 and 25

Admin users should be able to delete customers.

### Requirement 36 — Prompts 24 and 25

Admin users should be able to delete products.

### Requirement 37 — Prompt 25

Manager users should be able to delete customers.

### Requirement 38 — Prompt 25

Manager users should be able to delete products.

### Requirement 39 — Prompt 25

Managers must not be allowed to manage user accounts.

---

## Report-Viewing Permissions

### Requirement 40 — Prompt 41

Staff users should only be able to view reports they created themselves.

### Requirement 41 — Prompt 41

Manager users can view all reports.

### Requirement 42 — Prompt 41

Admin users can view all reports.

---

## Monthly Sales Report

### Requirement 43 — Prompt 28

Add a monthly sales report showing total sales for each month.

### Requirement 44 — Prompt 30

Keep the monthly sales numbers in a table.

### Requirement 45 — Prompts 36-39

Add an export feature that generates an Excel (.xlsx) file.

### Requirement 46 — Prompt 40

Allow users to filter the report by a custom date range.

---

## Pagination

### Requirement 47 — Prompt 32

Add pagination to the customer, product, vendor, sales order, purchase order, and invoice list pages.

---

## Search

### Requirement 48 — Prompt 33

Add a search bar so users can quickly find customers and products by name.

---

## Audit Log

### Requirement 49 — Prompt 44

Implement an audit log that records whenever a sales order is confirmed, an invoice is generated, or a payment is recorded.

### Requirement 50 — Prompt 45

Each audit log entry must include the user who performed the action and the exact date and time it occurred.

---

## Code Structure and Comments

### Requirement 51 — Prompt 35

Clean up the overall code structure where appropriate.

### Requirement 52 — Prompt 35

Add comments explaining the main business logic.

