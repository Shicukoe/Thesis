# Codex strict — candidate atomic decomposition (mode=candidate, keep-all, verbatim)
# Corrected: permission statements bundling 2 roles split fine-grained per (role, object).

### Requirement 1
Build a simple ERP web application for a small business with a clean foundation that can be gradually expanded.

### Requirement 2
Use a top navigation bar instead of a sidebar.

### Requirement 3
Users can create, edit, delete, and browse customers.

### Requirement 4
Users can search customers by name.

### Requirement 5
Customer lists should have pagination.

### Requirement 6
Customer deletion should remain permanent.

### Requirement 7
Staff cannot delete customers.

### Requirement 8a
Admin users can delete customers.

### Requirement 8b
Manager users can delete customers.

### Requirement 9
Users can create, edit, delete, and browse products.

### Requirement 10
Users can search products by name.

### Requirement 11
Product lists should have pagination.

### Requirement 12
Each product should have a name, SKU, price, current stock quantity, and configurable low-stock threshold.

### Requirement 13
Product prices and stock quantities should never be negative.

### Requirement 14
Product deletion should remain permanent.

### Requirement 15
Staff cannot delete products.

### Requirement 16a
Admin users can delete products.

### Requirement 16b
Manager users can delete products.

### Requirement 17
Users can create, edit, delete, and browse vendors.

### Requirement 18
Vendor management should work similarly to customer management.

### Requirement 19
Vendor lists should have pagination.

### Requirement 20
Vendor deletion should move vendors to a recycle bin instead of permanently deleting them.

### Requirement 21
Deleted vendors should be restorable later.

### Requirement 22
Only vendors should use the recycle bin.

### Requirement 23
Show the total number of customers on the dashboard.

### Requirement 24
Show the total number of products on the dashboard.

### Requirement 25
Show low-stock products on the dashboard.

### Requirement 26
Low-stock products should be based on each product's configurable low-stock threshold.

### Requirement 27
Make the dashboard look clean and professional.

### Requirement 28
Users can browse sales orders.

### Requirement 29
Sales order lists should have pagination.

### Requirement 30
A sales order belongs to one customer.

### Requirement 31
A sales order contains one or more products with quantities.

### Requirement 32
The total amount should be calculated automatically from selected products and quantities.

### Requirement 33
When a sales order is confirmed, reduce inventory automatically.

### Requirement 34
Do not allow users to confirm an order if any item does not have enough stock available.

### Requirement 35
When a sales order is confirmed, automatically generate an invoice.

### Requirement 36
Users can browse purchase orders.

### Requirement 37
Purchase order lists should have pagination.

### Requirement 38
Staff can restock inventory with purchase orders.

### Requirement 39
When a purchase order is marked as received, increase product stock automatically.

### Requirement 40
Purchase orders are used for buying from suppliers/vendors.

### Requirement 41
Invoice lists should have pagination.

### Requirement 42
Invoices should have a due date 15 days after they are created.

### Requirement 43
Invoices need these payment statuses: Unpaid, Partially Paid, and Paid.

### Requirement 44
Users should be able to record payments against invoices.

### Requirement 45
Supported payment methods: Cash and Bank Transfer.

### Requirement 46
Do not support Credit Card payments.

### Requirement 47
Roles: Admin, Manager, and Staff.

### Requirement 48
Staff should not be allowed to delete customers.

### Requirement 49
Staff should not be allowed to delete products.

### Requirement 50
Managers should be allowed to delete customers.

### Requirement 51
Managers should be allowed to delete products.

### Requirement 52
Managers should not be allowed to manage user accounts.

### Requirement 53
Only Admin users should be able to manage user accounts.

### Requirement 54
Add a monthly sales report showing total sales for each month.

### Requirement 55
Show the monthly sales report as a table.

### Requirement 56
Do not include a chart.

### Requirement 57
Users should be able to filter the monthly sales report by a custom date range.

### Requirement 58
Users should be able to export the monthly sales report as an Excel .xlsx file.

### Requirement 59
Do not include CSV export.

### Requirement 60
Staff members should only be able to view reports they created themselves.

### Requirement 61
Managers can view all reports.

### Requirement 62
Admins can view all reports.

### Requirement 63
Keep a history of important business events.

### Requirement 64
Add an audit log entry whenever a sales order is confirmed, an invoice is generated, or a payment is recorded.

### Requirement 65
The audit log should record which user performed the action.

### Requirement 66
The audit log should record the exact date and time the action happened.

### Requirement 67
Track inventory as a single stock quantity per product.

### Requirement 68
Do not support multiple warehouses.

### Requirement 69
Add pagination to all list pages, including customers, products, vendors, sales orders, purchase orders, and invoices.

### Requirement 70
Clean up the overall code structure where appropriate.

### Requirement 71
Add comments explaining the main business logic.
