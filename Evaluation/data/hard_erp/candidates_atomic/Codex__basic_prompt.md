# Codex basic — candidate atomic decomposition (mode=candidate, keep-all, verbatim)
# Corrected: permission statements bundling 2 roles or 2 objects split fine-grained per
# (role, object), matching the ground truth's own chosen granularity.

### Requirement 1
Build a simple ERP web application for a small business with a clean, professional foundation that can be expanded gradually.

### Requirement 2
The app should include these modules: Dashboard, Customers, Vendors, Products, Sales Orders, Invoices, Purchase Orders, and Reports.

### Requirement 3
Use a top navigation bar, not a sidebar.

### Requirement 4
Show total number of customers on the dashboard.

### Requirement 5
Show total number of products on the dashboard.

### Requirement 6
Show total number of active vendors on the dashboard.

### Requirement 7
Show low-stock products on the dashboard.

### Requirement 8
Each product has its own configurable low-stock threshold.

### Requirement 9
A product is low-stock when its current stock quantity is below its configured threshold.

### Requirement 10
Show a recent audit log of important business events on the dashboard.

### Requirement 11
Keep the dashboard visually clean and professional.

### Requirement 12
Users can browse, search by name, create, edit, and delete customers.

### Requirement 13
Customer deletion is permanent.

### Requirement 14a
Admin users can delete customers.

### Requirement 14b
Manager users can delete customers.

### Requirement 15
Staff users cannot delete customers.

### Requirement 16
Customer lists should support pagination.

### Requirement 17
Users can browse, search, create, edit, and delete vendors.

### Requirement 18
Vendor deletion should move the vendor to a recycle bin instead of permanently deleting it.

### Requirement 19
Deleted vendors can be restored later.

### Requirement 20
Active workflows, such as purchase order creation, should only show active vendors.

### Requirement 21
Vendor lists should support pagination.

### Requirement 22
Users can browse, search by name, create, edit, and delete products.

### Requirement 23
Each product should have: Name, SKU, Price, Current stock quantity, and Low-stock threshold.

### Requirement 24
Product prices, stock quantities, and low-stock thresholds must not allow negative values.

### Requirement 25
Product deletion is permanent.

### Requirement 26a
Admin users can delete products.

### Requirement 26b
Manager users can delete products.

### Requirement 27
Staff users cannot delete products.

### Requirement 28
Product lists should support pagination.

### Requirement 29
Users can browse, create, edit, and delete sales orders.

### Requirement 30
A sales order belongs to one customer.

### Requirement 31
A sales order contains one or more products with quantities.

### Requirement 32
The total amount should be calculated automatically from selected products and quantities.

### Requirement 33
Users should not be able to confirm a sales order if any item lacks enough stock.

### Requirement 34
When a sales order is confirmed, reduce product inventory automatically.

### Requirement 35
When a sales order is confirmed, automatically generate an invoice.

### Requirement 36
Sales order lists should support pagination.

### Requirement 37
Invoices are generated automatically from confirmed sales orders.

### Requirement 38
Each invoice should have a due date 15 days after it is created.

### Requirement 39
Invoices need a payment status: Unpaid, Partially Paid, or Paid.

### Requirement 40
Users can record payments against invoices.

### Requirement 41
Supported payment methods: Cash and Bank Transfer.

### Requirement 42
Invoice payment status should update based on recorded payments.

### Requirement 43
Invoice lists should support pagination.

### Requirement 44
Users can browse, create, edit, and delete purchase orders.

### Requirement 45
A purchase order belongs to one vendor.

### Requirement 46
A purchase order contains one or more products with quantities.

### Requirement 47
When a purchase order is marked as received, increase product stock automatically.

### Requirement 48
Purchase order lists should support pagination.

### Requirement 49
Add a monthly sales report.

### Requirement 50
The report should show total sales for each month in a table.

### Requirement 51
Do not include a chart.

### Requirement 52
Users can filter the monthly sales report by a custom invoice issue date range.

### Requirement 53
Users can export the filtered monthly sales report as an Excel .xlsx file.

### Requirement 54
CSV export is not required.

### Requirement 55a
Admin users can view all report data.

### Requirement 55b
Manager users can view all report data.

### Requirement 56
Staff users can only view report data from records they created.

### Requirement 57
Support three roles: Admin, Manager, and Staff.

### Requirement 58
Admin users can manage user accounts.

### Requirement 59a
Manager users can delete customers.

### Requirement 59b
Manager users can delete products.

### Requirement 60
Manager users cannot manage user accounts.

### Requirement 61
Staff users cannot delete customers.

### Requirement 62
Staff users cannot delete products.

### Requirement 63
Staff users can only view reports for records they created.

### Requirement 64a
Admin users can view all reports.

### Requirement 64b
Manager users can view all reports.

### Requirement 65
Record audit log entries whenever a sales order is confirmed.

### Requirement 66
Each audit log entry should include: Event type, Related record, User who performed the action, User role, Exact date and time, and Readable event summary.

### Requirement 67
Display recent audit log entries on the dashboard.

### Requirement 68
Keep the codebase clean and organized.

### Requirement 69
Add comments explaining the main business logic.

### Requirement 70
Use a simple structure suitable for gradual expansion.

### Requirement 71
Use client-side pagination for all major list pages: Customers, Products, Vendors, Sales Orders, Purchase Orders, and Invoices.

### Requirement 72
Keep inventory as a single stock quantity per product.

### Requirement 73
Do not support multiple warehouses.
