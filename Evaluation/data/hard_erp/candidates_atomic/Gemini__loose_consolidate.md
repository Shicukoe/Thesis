# Gemini loose — candidate atomic decomposition (mode=candidate, keep-all, verbatim fidelity)
# Words are verbatim spans of the candidate; connectives/pronouns are resolved into plain
# prose (no bracket markers -- brackets measurably lower AlignScore and the ground truth never uses them).
# Corrected: permission statements bundling 2 roles split fine-grained per (role, object).

### Requirement 1
Build a clean, professional, and modern Enterprise Resource Planning (ERP) web application.

### Requirement 2
Build the ERP web application using HTML, Vanilla CSS, and Vanilla JavaScript (ES Modules).

### Requirement 3
Implement three user roles: Admin, Manager, and Staff.

### Requirement 4
Provide a dropdown selector in the top-right profile section of the header to easily swap roles for local testing.

### Requirement 5
Admin has full access to all features, including the User Accounts management view (#users) to register and manage operator accounts.

### Requirement 6
Manager can perform all operations (including deleting customers and products) except user account administration (cannot access #users).

### Requirement 7
Staff has general view and entry permissions.

### Requirement 8
Staff cannot delete customers or products (delete buttons hidden; action blocked).

### Requirement 9
Staff cannot manage user accounts (cannot access #users).

### Requirement 10
Staff cannot manually change the status of sales orders or purchase orders (status sliders and status-changing buttons hidden).

### Requirement 11
Staff cannot edit product prices in the catalog (fields disabled).

### Requirement 12
Staff can only view monthly sales report records they created themselves (filtered by the user who created the sales order).

### Requirement 13
Prevent negative values for product prices and stock quantities.

### Requirement 14
Validate negative-value prevention both in the input fields and programmatically on form submission.

### Requirement 15
Each product must have its own configurable low-stock threshold.

### Requirement 16
Show a list of all products currently below their threshold on the main dashboard.

### Requirement 17
Deleting products must permanently remove them from the system.

### Requirement 17a
Deleting products is restricted to Admins.

### Requirement 17b
Deleting products is restricted to Managers.

### Requirement 18
Deleting customers must permanently remove them from the database.

### Requirement 18a
Deleting customers is restricted to Admins.

### Requirement 18b
Deleting customers is restricted to Managers.

### Requirement 19
Manage supplier details and associate them with purchase orders.

### Requirement 20
Instead of permanently deleting vendors, move deleted vendors to a "Recycle Bin".

### Requirement 21
Provide a status filter to view Recycle Bin vendors.

### Requirement 22a
Allow Admins to restore vendors from the Recycle Bin.

### Requirement 22b
Allow Managers to restore vendors from the Recycle Bin.

### Requirement 23
Exclude Recycle Bin vendors from active supplier count statistics.

### Requirement 24
Confirming a sales order must automatically deduct item quantities from inventory stock.

### Requirement 25
Confirming a sales order must automatically generate a commercial invoice.

### Requirement 26
Automatically set invoice due dates to exactly 15 days after invoice generation (Net-15 terms).

### Requirement 27
Accept and record payments via Cash or Bank Transfer only.

### Requirement 28
Automatically create a system audit log entry whenever a sales order is confirmed, an invoice is generated, or a payment is recorded.

### Requirement 29
The log captures the action type (sales order confirmed, invoice generated, payment recorded).

### Requirement 30
The log captures the exact date and time of the event.

### Requirement 31
The log captures the user who performed the action.

### Requirement 32
The log captures the specific details of the action.

### Requirement 33
Display the 20 most recent log entries in a scrollable history card at the bottom of the main dashboard.

### Requirement 34
Provide a monthly sales report page summarizing orders volume, net subtotals, tax collected, and gross revenues in a clean table.

### Requirement 35
Exclude cancelled orders from report metrics.

### Requirement 36
Do not include any charts.

### Requirement 37
Add date pickers letting users filter the sales report by a custom Start Date and End Date range.

### Requirement 38
Provide an Export Excel button to download the monthly report as a true binary Excel (.xlsx) spreadsheet.

### Requirement 39
Apply autofit adjustments to column widths so data is displayed cleanly.

### Requirement 40
Do not support CSV export.

### Requirement 41
Add a search bar in the header to quickly find customers and products by name or SKU, displaying matching search results in a live dropdown list.

### Requirement 42
Add pagination (5 items per page) to all list tables (including customers, products, vendors, sales orders, and purchase orders).

### Requirement 43
Automatically reset the active page to 1 whenever a filter or search input changes.
