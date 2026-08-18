# Gemini strict — candidate atomic decomposition (mode=candidate, keep-all, verbatim fidelity)
# Words are verbatim spans of the candidate; connectives/pronouns are resolved into plain
# prose (no bracket markers -- brackets measurably lower AlignScore and the ground truth never uses them).
# Corrected: permission statements bundling 2 roles split fine-grained per (role, object).

### Requirement 1
Implement Admin, Manager, and Staff user roles.

### Requirement 2
Staff members shouldn't be allowed to delete customers.

### Requirement 3
Staff members shouldn't be allowed to delete products.

### Requirement 4a
Admin users can delete customers.

### Requirement 4b
Manager users can delete customers.

### Requirement 5a
Admin users can delete products.

### Requirement 5b
Manager users can delete products.

### Requirement 6
Managers shouldn't be allowed to manage user accounts.

### Requirement 7
Staff members should only be able to view reports that they created themselves.

### Requirement 8
Managers can continue viewing all reports.

### Requirement 9
Admins can continue viewing all reports.

### Requirement 10
Show low-stock products on the dashboard.

### Requirement 11
Each product should have its own configurable low-stock threshold.

### Requirement 12
The dashboard must look clean and professional.

### Requirement 13
Add a monthly sales report showing the total sales for each month in a table.

### Requirement 14
Do not include a chart.

### Requirement 15
Let users filter the report by a custom date range.

### Requirement 16
Add an export feature for the monthly sales report that generates an Excel (.xlsx) file.

### Requirement 17
Do not export CSV.

### Requirement 18
Add pagination to all list pages, including customers, products, vendors, sales orders, purchase orders, and invoices.

### Requirement 19
Add a search bar so users can quickly find customers and products by name.

### Requirement 20
Product prices and stock quantities should never be allowed to have negative values.

### Requirement 21
Instead of permanently deleting vendors, move them to a recycle bin so they can be restored later.

### Requirement 22
Only vendors should use the recycle bin.

### Requirement 23
Customers and products should continue using permanent deletion based on the user's permissions.

### Requirement 24
Add an audit log whenever a sales order is confirmed, an invoice is generated, or a payment is recorded.

### Requirement 25
The audit log must record which user performed the action and the exact date and time it happened.

### Requirement 26
Clean up the overall structure where appropriate.

### Requirement 27
Add comments explaining the main business logic.
