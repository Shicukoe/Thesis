# Claude strict — candidate atomic decomposition (mode=candidate, keep-all, verbatim)
# Full clean re-derivation matching DECOMP_SYS granularity + the ground truth's own chosen
# split (requirements_split.md): permission fine-grained per (role, object); enumerations
# GT itself keeps merged (payment methods, roles, pagination pages, search targets, price/
# stock validation, recycle-bin scope, audit event triggers, audit entry fields) stay merged
# here too, for consistency with the reference being scored against.

### Requirement 1
Build a small business ERP web app.

### Requirement 2
Support Cash and Bank Transfer payment methods.

### Requirement 3
Do not support credit cards.

### Requirement 4
There are three roles — Admin, Staff, and Manager.

### Requirement 5
Staff cannot delete customers.

### Requirement 6
Staff cannot delete products.

### Requirement 7
Admin can delete customers.

### Requirement 8
Manager can delete customers.

### Requirement 9
Admin can delete products.

### Requirement 10
Manager can delete products.

### Requirement 11
Manager cannot manage user accounts.

### Requirement 12
Make the dashboard look clean and professional.

### Requirement 13
Show low-stock products on the dashboard whenever a product's stock drops below that product's own configurable low-stock threshold (each product has its own threshold, not a shared fixed value).

### Requirement 14
Add a monthly sales report showing the total sales for each month, displayed as a table.

### Requirement 15
Add pagination to all list pages — customers, products, vendors, sales orders, purchase orders, and invoices.

### Requirement 16
Add a search bar so users can quickly find customers and products by name.

### Requirement 17
Product prices and stock quantities must never be negative.

### Requirement 18
Clean up the overall code structure where appropriate.

### Requirement 19
Add comments explaining the main business logic.

### Requirement 20
Add the ability to export the monthly sales report as an Excel (.xlsx) file.

### Requirement 21
Let users filter the monthly sales report by a custom date range.

### Requirement 22
Staff can only view reports for orders they created themselves.

### Requirement 23
Managers can view all reports.

### Requirement 24
Admins can view all reports.

### Requirement 25
Instead of permanently deleting vendors, move them to a recycle bin so they can be restored later.

### Requirement 26
Customers and products continue using permanent deletion based on the user's permissions.

### Requirement 27
Keep a history of important business events.

### Requirement 28
Record an audit log entry whenever a sales order is confirmed, an invoice is generated, or a payment is recorded.

### Requirement 29
Each entry must record which user performed the action and the exact date and time it happened.
