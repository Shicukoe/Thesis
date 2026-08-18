# Codex__spec_guided - candidate atomic decomposition (mode=candidate, keep-all)
# Re-decomposed sentence-by-sentence following DECOMP_SYS literally (src/decompose_prompts.py):
# fidelity first (reuse exact source words; pronouns/connectives resolved into plain prose,
# no bracket markers -- brackets measurably lower AlignScore and are never used by the
# ground truth), then granularity rules (role x object permissions fine-grained, compound actions split,
# enumerations stated together merged). Supersedes the earlier pass, which had silently
# substituted "Add sales orders" / "Add purchase orders" / "Add customer management" for
# sentences that actually read "Start implementing sales orders" / "Need purchase orders" /
# "The first thing needed is customer management" -- a real fidelity violation, not the
# source's own wording.

### Requirement 1
Build a simple ERP web application for a small business with a clean foundation that can be gradually expanded.

### Requirement 2
Clean up the overall structure where appropriate.

### Requirement 3
Add comments explaining the main business logic.

### Requirement 4
Add navigation: a top navigation bar.

### Requirement 5
A top navigation bar with Dashboard, Customers, and Products should be enough for now.

### Requirement 6
Introduce user roles.

### Requirement 7
Have Admin, Staff, and Manager.

### Requirement 8
Staff members shouldn't be allowed to delete customers.

### Requirement 9
Staff members shouldn't be allowed to delete products.

### Requirement 10
Admin users should be able to delete customers.

### Requirement 11
Admin users should be able to delete products.

### Requirement 12
Managers should be able to delete customers.

### Requirement 13
Managers should be able to delete products.

### Requirement 14
Customers and products should continue using permanent deletion based on the user's permissions.

### Requirement 15
Managers shouldn't be allowed to manage user accounts.

### Requirement 16
Staff members should only be able to view reports that they created themselves.

### Requirement 17
Managers can continue viewing all reports.

### Requirement 18
Admins can continue viewing all reports.

### Requirement 19
The dashboard should look clean and professional.

### Requirement 20
The dashboard doesn't need much yet.

### Requirement 21
Just show the total number of customers and products.

### Requirement 22
Show low-stock products on the dashboard whenever stock drops below each product's own configurable low-stock threshold.

### Requirement 23
The first thing needed is customer management.

### Requirement 24
Users should be able to create, edit, delete, and browse customers.

### Requirement 25
Add a search bar so users can quickly find customers and products by name.

### Requirement 26
Add pagination to all list pages, including customers, products, vendors, sales orders, purchase orders, and invoices.

### Requirement 27
Add vendor management too.

### Requirement 28
Vendor management should work similarly to customer management with create, edit, delete, and browse operations.

### Requirement 29
Only vendors should use the recycle bin.

### Requirement 30
Instead of permanently deleting vendors, move them to a recycle bin so they can be restored later.

### Requirement 31
Add products.

### Requirement 32
Each product should have a name, SKU, price, current stock quantity, and its own configurable low-stock threshold.

### Requirement 33
Product prices and stock quantities should never be allowed to have negative values.

### Requirement 34
Start implementing sales orders.

### Requirement 35
A sales order should belong to one customer.

### Requirement 36
A sales order should contain one or more products with quantities.

### Requirement 37
The total amount should be calculated automatically from the selected products and quantities.

### Requirement 38
When a sales order is confirmed, reduce the inventory automatically.

### Requirement 39
Don't let users confirm the order if any item doesn't have enough stock available.

### Requirement 40
Whenever a sales order is confirmed, automatically generate an invoice.

### Requirement 41
Invoices should have a due date 15 days after they're created.

### Requirement 42
Invoices also need a payment status.

### Requirement 43
Use these three statuses: Unpaid, Partially Paid, and Paid.

### Requirement 44
Users should be able to record payments against invoices.

### Requirement 45
Support these payment methods: Cash, Bank Transfer.

### Requirement 46
Add an audit log whenever a sales order is confirmed, an invoice is generated, or a payment is recorded.

### Requirement 47
The audit log entry records which user performed the action and the exact date and time it happened.

### Requirement 48
Add a monthly sales report showing the total sales for each month.

### Requirement 49
Let users filter the monthly sales report by a custom date range.

### Requirement 50
Add an export feature that generates an Excel (.xlsx) file for the monthly sales report.

### Requirement 51
Need purchase orders so staff can restock inventory.

### Requirement 52
When a purchase order is marked as received, increase the product stock automatically.
