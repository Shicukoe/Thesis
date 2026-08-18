# Gemini__spec_guided - candidate atomic decomposition (mode=candidate, keep-all)
# Re-decomposed sentence-by-sentence following DECOMP_SYS literally (src/decompose_prompts.py):
# fidelity first (reuse exact source words; pronouns/connectives resolved into plain prose,
# no bracket markers -- brackets measurably lower AlignScore and are never used by the
# ground truth), then granularity rules (role x object permissions fine-grained, compound
# actions split, enumerations stated together merged).
# Requirement 5 kept verbatim including "Vendors" in the nav bar contents -- not stated in
# any raw prompt (ground truth nav is Dashboard/Customers/Products only); Requirement 35 and
# the last line of the audit-log pair likewise kept verbatim as elaborations beyond what the
# raw prompts state -- not corrected, since AlignScore is meant to catch exactly this.

### Requirement 1
Build a simple ERP web application for a small business with a clean foundation that can be gradually expanded.

### Requirement 2
Users should be able to create, edit, delete, and browse customers.

### Requirement 3
Add products.

### Requirement 4
Each product should have a name, SKU, price, and current stock quantity.

### Requirement 5
A top navigation bar with Dashboard, Customers, Vendors, and Products should be enough for now.

### Requirement 6
The dashboard doesn't need much yet.

### Requirement 7
The dashboard should just show the total number of customers and products.

### Requirement 8
Implement sales orders.

### Requirement 9
A sales order should belong to one customer.

### Requirement 10
A sales order should contain one or more products with quantities.

### Requirement 11
The total amount should be calculated automatically from the selected products and quantities.

### Requirement 12
Don't let users confirm the order if any item doesn't have enough stock available.

### Requirement 13
When a sales order is confirmed, reduce the inventory automatically.

### Requirement 14
Whenever a sales order is confirmed, automatically generate an invoice.

### Requirement 15
Invoices should have a due date 15 days after they're created.

### Requirement 16
Invoices also need a payment status.

### Requirement 17
Use these three statuses: Unpaid, Partially Paid, and Paid.

### Requirement 18
Users should be able to record payments against invoices.

### Requirement 19
Payments support Cash and Bank Transfer as payment methods.

### Requirement 20
Implement purchase orders so staff can restock inventory.

### Requirement 21
When a purchase order is marked as received, increase the product stock automatically.

### Requirement 22
Add vendor management.

### Requirement 23
Users should be able to create, edit, delete, and browse vendors.

### Requirement 24
Instead of permanently deleting vendors, move them to a recycle bin where they can be viewed and restored.

### Requirement 25
Introduce Admin, Manager, and Staff user roles.

### Requirement 26
Managers can delete customers.

### Requirement 27
Managers can delete products.

### Requirement 28
Admins can delete customers.

### Requirement 29
Admins can delete products.

### Requirement 30
Staff cannot delete customers.

### Requirement 31
Staff cannot delete products.

### Requirement 32
Customers and products use permanent deletion based on the user's permissions, and do not use a recycle bin.

### Requirement 33
Managers are not allowed to manage user accounts.

### Requirement 34
Staff are not allowed to manage user accounts.

### Requirement 35
The User Accounts management view is restricted to Admin only.

### Requirement 36
Each product has its own configurable low-stock threshold.

### Requirement 37
Products are shown as low stock on the dashboard when their stock drops below this threshold.

### Requirement 38
Add a monthly sales report view showing the total sales for each month in a table.

### Requirement 39
The monthly sales report has filters for a custom date range.

### Requirement 40
Staff members should only be able to view report data for orders that they created themselves.

### Requirement 41
Managers can view report data for all orders.

### Requirement 42
Admins can view report data for all orders.

### Requirement 43
Make the dashboard clean, professional, and visually appealing.

### Requirement 44
Add pagination to all list pages, including customers, products, vendors, sales orders, purchase orders, and invoices.

### Requirement 45
Connect a global search bar in the header to quickly locate products and customers by name.

### Requirement 46
Ensure that product prices and stock quantities are never allowed to have negative values.

### Requirement 47
Maintain a clean overall codebase structure.

### Requirement 48
Maintain clear comments explaining the main business logic.

### Requirement 49
Provide a monthly sales report export feature that generates and downloads an Excel (.xlsx) file.

### Requirement 50
Add a business event audit log that tracks whenever a sales order is confirmed, an invoice is generated, or a payment is recorded.

### Requirement 51
The audit log displays the exact date and time, the specific user who performed the action, their active user role, event type, and details.

### Requirement 52
Provide a user interface to browse these logs.
