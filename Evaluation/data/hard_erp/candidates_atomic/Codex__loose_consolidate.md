# Codex loose — candidate atomic decomposition (mode=candidate, keep-all, verbatim)
# Corrected: permission statements bundling 2 roles or 2 objects split fine-grained per
# (role, object), matching the ground truth's own chosen granularity.

### Requirement 1
Build a simple ERP web application for a small business as a clean foundation that can be gradually expanded.

### Requirement 2
Use a top navigation bar, not a sidebar.

### Requirement 3
Include these modules: Dashboard, Customers, Vendors, Products, Sales Orders, Invoices, Purchase Orders, and Reports.

### Requirement 4
Show the total number of customers on the dashboard.

### Requirement 5
Show the total number of products on the dashboard.

### Requirement 6
Show the total number of active vendors on the dashboard.

### Requirement 7
Show low-stock products on the dashboard.

### Requirement 8
Low-stock detection must use each product's configurable low-stock threshold, not a fixed threshold.

### Requirement 9
A product is low-stock when its current stock quantity is below its configured threshold.

### Requirement 10
Show recent audit log entries on the dashboard.

### Requirement 11
Make the dashboard look clean and professional.

### Requirement 12
Users can browse, create, edit, delete, and search customers by name.

### Requirement 13
Customer deletion is permanent.

### Requirement 14a
Admin users can delete customers.

### Requirement 14b
Manager users can delete customers.

### Requirement 15
Users can browse, create, edit, delete, and search vendors.

### Requirement 16
Vendor deletion must move the vendor to a recycle bin instead of permanently deleting it.

### Requirement 17
Deleted vendors can be restored later.

### Requirement 18
Only vendors should use the recycle bin.

### Requirement 19
Active workflows, including purchase order creation, should only show active vendors.

### Requirement 20
Vendor lists must support pagination.

### Requirement 21
Users can browse, create, edit, delete, and search products by name.

### Requirement 22
Each product has: Name, SKU, Price, Current stock quantity, and Configurable low-stock threshold.

### Requirement 23
Product prices must not be negative.

### Requirement 24
Product stock quantities must not be negative.

### Requirement 25
Product low-stock thresholds must not be negative.

### Requirement 26
Product deletion is permanent.

### Requirement 27a
Admin users can delete products.

### Requirement 27b
Manager users can delete products.

### Requirement 28
Staff users cannot delete products.

### Requirement 29
Product lists must support pagination.

### Requirement 30
Users can browse, create, edit, and delete sales orders.

### Requirement 31
A sales order belongs to one customer.

### Requirement 32
A sales order contains one or more products with quantities.

### Requirement 33
The total amount is calculated automatically from selected products and quantities.

### Requirement 34
Users cannot confirm a sales order if any item does not have enough stock available.

### Requirement 35
When a sales order is confirmed, reduce product inventory automatically.

### Requirement 36
When a sales order is confirmed, automatically generate an invoice.

### Requirement 37
Sales order lists must support pagination.

### Requirement 38
Invoices are generated automatically when sales orders are confirmed.

### Requirement 39
Each sales order should create at most one invoice.

### Requirement 40
Each invoice has a due date 15 days after it is created.

### Requirement 41
Each invoice has one payment status: Unpaid, Partially Paid, or Paid.

### Requirement 42
Users can record payments against invoices.

### Requirement 43
Supported payment methods are: Cash and Bank Transfer.

### Requirement 44
Credit Card must not be a supported payment method.

### Requirement 45
Invoice payment status updates based on recorded payments.

### Requirement 46
Invoice lists must support pagination.

### Requirement 47
Users can browse, create, edit, and delete purchase orders.

### Requirement 48
A purchase order belongs to one active vendor.

### Requirement 49
A purchase order contains one or more products with quantities.

### Requirement 50
When a purchase order is marked as received, increase product stock automatically.

### Requirement 51
Purchase order lists must support pagination.

### Requirement 52
Add a monthly sales report.

### Requirement 53
Show total sales for each month in a table.

### Requirement 54
Do not include a chart.

### Requirement 55
Users can filter the monthly sales report by a custom invoice issue date range.

### Requirement 56
Users can export the filtered monthly sales report as an Excel .xlsx file.

### Requirement 57
Do not provide CSV export.

### Requirement 58a
Admin users can view all report data.

### Requirement 58b
Manager users can view all report data.

### Requirement 59
Staff users can only view report data from records they created.

### Requirement 60
Support these roles: Admin, Manager, and Staff.

### Requirement 61
Admin users can manage user accounts.

### Requirement 62a
Manager users can delete customers.

### Requirement 62b
Manager users can delete products.

### Requirement 63
Manager users cannot manage user accounts.

### Requirement 64
Staff users cannot delete customers.

### Requirement 65
Staff users cannot delete products.

### Requirement 66
Staff users can only view reports they created themselves.

### Requirement 67a
Admin users can view all reports.

### Requirement 67b
Manager users can view all reports.

### Requirement 68
Keep a history of important business events.

### Requirement 69
Add audit log entries whenever a sales order is confirmed, an invoice is generated, or a payment is recorded.

### Requirement 70
Each audit log entry must record: Event type, Related record, User who performed the action, User role, Exact date and time, and Readable event summary.

### Requirement 71
Display recent audit log entries on the dashboard.

### Requirement 72
Keep inventory as a single stock quantity per product.

### Requirement 73
Do not support multiple warehouses.

### Requirement 74
Add pagination to all list pages, including customers, products, vendors, sales orders, purchase orders, and invoices.

### Requirement 75
Add basic validation so product prices, stock quantities, and low-stock thresholds cannot be negative.

### Requirement 76
Keep the codebase clean and organized.

### Requirement 77
Add comments explaining the main business logic.
