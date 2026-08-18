# Claude__spec_guided - candidate atomic decomposition (mode=candidate, keep-all)
# Re-decomposed sentence-by-sentence following DECOMP_SYS literally (src/decompose_prompts.py):
# fidelity first (reuse exact source words; pronouns/connectives resolved into plain prose,
# no bracket markers -- brackets measurably lower AlignScore and are never used by the
# ground truth), then granularity rules (role x object permissions fine-grained, compound actions split,
# enumerations stated together merged). Supersedes the earlier pass, which had silently
# substituted verbs in a few places (e.g. "Add sales orders" for a sentence that had no such
# existence clause) instead of keeping the source's own wording.

### Requirement 1
Build a simple ERP web application for a small business with a clean foundation that can be gradually expanded.

### Requirement 2
The first module is customer management.

### Requirement 3
Users should be able to create, edit, delete, and browse customers.

### Requirement 4
Add products.

### Requirement 5
Each product has a name, SKU, price, current stock quantity, and a configurable low-stock threshold.

### Requirement 6
Price and stock quantity should never be allowed to have negative values.

### Requirement 7
Add navigation: a top navigation bar.

### Requirement 8
The top navigation bar contains Dashboard, Customers, and Products.

### Requirement 9
The dashboard should show the total number of customers and products.

### Requirement 10
The dashboard should show low-stock products whenever a product's stock drops below its own configured low-stock threshold.

### Requirement 11
The dashboard should look clean and professional.

### Requirement 12
Add sales orders.

### Requirement 13
A sales order belongs to one customer.

### Requirement 14
A sales order contains one or more products with quantities.

### Requirement 15
A sales order's total amount is calculated automatically from the selected products and quantities.

### Requirement 16
When a sales order is confirmed, inventory is reduced automatically.

### Requirement 17
Confirmation is blocked if any item doesn't have enough stock available.

### Requirement 18
Add purchase orders so staff can restock inventory.

### Requirement 19
When a purchase order is marked as received, product stock is increased automatically.

### Requirement 20
Since the business is buying from suppliers, add vendor management too, working similarly to customer management with create, edit, delete, and browse operations.

### Requirement 21
Instead of permanently deleting a vendor, move it to a recycle bin so it can be restored later.

### Requirement 22
Only vendors use the recycle bin.

### Requirement 23
Customers and products continue using permanent deletion, based on the user's permissions.

### Requirement 24
Whenever a sales order is confirmed, automatically generate an invoice.

### Requirement 25
The invoice has a due date 15 days after it's created.

### Requirement 26
The invoice has a payment status of Unpaid, Partially Paid, or Paid.

### Requirement 27
Users should be able to record payments against invoices.

### Requirement 28
Payment methods are Cash or Bank Transfer.

### Requirement 29
Introduce user roles: Admin, Staff, and Manager.

### Requirement 30
Staff members should not be allowed to delete customers.

### Requirement 31
Staff members should not be allowed to delete products.

### Requirement 32
Admin users can delete customers.

### Requirement 33
Admin users can delete products.

### Requirement 34
Manager users can delete customers.

### Requirement 35
Manager users can delete products.

### Requirement 36
Managers should not be allowed to manage user accounts.

### Requirement 37
Staff members should only be able to view reports that they created themselves.

### Requirement 38
Managers can continue viewing all reports.

### Requirement 39
Admins can continue viewing all reports.

### Requirement 40
Add a monthly sales report showing the total sales for each month.

### Requirement 41
The monthly sales report has an export feature that generates an Excel (.xlsx) file so it can be shared with the accountant.

### Requirement 42
Support filtering the report by a custom date range.

### Requirement 43
Add pagination to all list pages, including customers, products, vendors, sales orders, purchase orders, and invoices.

### Requirement 44
Add a search bar so users can quickly find customers and products by name.

### Requirement 45
Add an audit log recording a history of important business events: whenever a sales order is confirmed, an invoice is generated, or a payment is recorded.

### Requirement 46
Each audit log entry records which user performed the action and the exact date and time it happened.
