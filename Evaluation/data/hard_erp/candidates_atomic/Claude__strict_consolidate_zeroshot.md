# Claude strict — ZERO-SHOT candidate atomic decomposition
# Derived from Claude__strict_consolidate.md (guided, 27 reqs) by mechanically exploding
# every enumeration/conjunction into one requirement per member (no merge-enumeration rule).

### Requirement 1
Build a small business ERP web app.

### Requirement 2
Support Cash [as a payment method].

### Requirement 3
Support Bank Transfer [as a payment method].

### Requirement 4
Do not support credit cards.

### Requirement 5
[There is an] Admin role.

### Requirement 6
[There is a] Staff role.

### Requirement 7
[There is a] Manager role.

### Requirement 8
Staff cannot delete customers.

### Requirement 9
Staff cannot delete products.

### Requirement 10
Admin can delete customers.

### Requirement 11
Manager can delete customers.

### Requirement 12
Admin can delete products.

### Requirement 13
Manager can delete products.

### Requirement 14
Manager cannot manage user accounts.

### Requirement 15
Make the dashboard look clean and professional.

### Requirement 16
Show low-stock products on the dashboard whenever a product's stock drops below that product's own configurable low-stock threshold.

### Requirement 17
Each product has its own threshold, not a shared fixed value.

### Requirement 18
Add a monthly sales report showing the total sales for each month.

### Requirement 19
[Display the monthly sales report] as a table.

### Requirement 20
Add pagination to the customer list page.

### Requirement 21
Add pagination to the product list page.

### Requirement 22
Add pagination to the vendor list page.

### Requirement 23
Add pagination to the sales order list page.

### Requirement 24
Add pagination to the purchase order list page.

### Requirement 25
Add pagination to the invoice list page.

### Requirement 26
Add a search bar so users can quickly find customers by name.

### Requirement 27
Add a search bar so users can quickly find products by name.

### Requirement 28
Product prices must never be negative.

### Requirement 29
[Product] stock quantities must never be negative.

### Requirement 30
Clean up the overall code structure where appropriate.

### Requirement 31
Add comments explaining the main business logic.

### Requirement 32
Add the ability to export the monthly sales report as an Excel (.xlsx) file.

### Requirement 33
Let users filter the monthly sales report by a custom date range.

### Requirement 34
Staff can only view reports for orders they created themselves.

### Requirement 35
Managers can view all reports.

### Requirement 36
Admins can view all reports.

### Requirement 37
Instead of permanently deleting vendors, move them to a recycle bin so they can be restored later.

### Requirement 38
Customers continue using permanent deletion based on the user's permissions.

### Requirement 39
Products continue using permanent deletion based on the user's permissions.

### Requirement 40
Keep a history of important business events.

### Requirement 41
Record an audit log entry whenever a sales order is confirmed.

### Requirement 42
Record an audit log entry whenever an invoice is generated.

### Requirement 43
Record an audit log entry whenever a payment is recorded.

### Requirement 44
Each entry must record which user performed the action.

### Requirement 45
Each entry must record the exact date and time it happened.
