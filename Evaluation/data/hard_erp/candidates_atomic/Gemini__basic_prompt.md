# Gemini basic — candidate atomic decomposition (mode=candidate, keep-all, verbatim fidelity)
# Words are verbatim spans of the candidate; connectives/pronouns are resolved into plain
# prose (no bracket markers -- brackets measurably lower AlignScore and the ground truth never uses them).
# Keep-all: implementation detail and fabrication are RETAINED on purpose so they get scored.
# Corrected: permission statements bundling 2 roles or 2 objects split fine-grained per
# (role, object), matching the ground truth's own chosen granularity.

### Requirement 1
Build a clean and professional Enterprise Resource Planning (ERP) web application.

### Requirement 2
Build a dark-themed ERP web application.

### Requirement 3
Build the ERP web application in raw HTML, CSS (Vanilla CSS), and Vanilla JavaScript (ES Modules).

### Requirement 4
Implement a system with three distinct user roles: Admin, Manager, and Staff.

### Requirement 5
Role switching must be easily testable via a dropdown in the user profile badge in the top-right header.

### Requirement 6
The role-switching dropdown dynamically swaps the active profile name, avatar initials, and re-renders UI permissions.

### Requirement 7
Admin (e.g., John Storeowner) has full read, write, edit, delete, and user administration access, including the #users configuration view.

### Requirement 8a
Manager (e.g., Mike Manager) can view, edit, create, and delete products.

### Requirement 8b
Manager (e.g., Mike Manager) can view, edit, create, and delete customer profiles.

### Requirement 9
Manager is blocked from user account administration.

### Requirement 10
Staff (e.g., Sarah Staff) can view data, record sales orders, and edit basic fields.

### Requirement 11
Staff is blocked from deleting customers.

### Requirement 12
Staff is blocked from deleting products.

### Requirement 13
Staff is blocked from accessing user account management.

### Requirement 14
Staff is blocked from manually changing sales order or purchase order statuses (status sliders/cancellations must be hidden).

### Requirement 15
Staff is blocked from editing selling prices in the product catalog.

### Requirement 16
Product selling prices, stock levels, and reorder thresholds must never accept negative numbers.

### Requirement 17
Enforce HTML-level constraints (min="0") and JavaScript-level validation on form submission.

### Requirement 18
Each product must have its own configurable low-stock alert limit (minStock).

### Requirement 19
Dynamically display a list of all low-stock products (stock <= minStock) on the main overview dashboard.

### Requirement 20
Sales Order confirmation must deduct item quantities from inventory.

### Requirement 21
Sales Order confirmation must automatically generate a commercial invoice.

### Requirement 22
Invoices must use Net-15 payment terms (due date is automatically calculated as 15 days after invoice generation).

### Requirement 23
Payments can only be recorded via Cash or Bank Transfer (exclude Credit Card option).

### Requirement 24
Maintain a persistent history of key business actions.

### Requirement 25
Whenever a sales order is confirmed, an invoice is generated, or a payment is recorded, create an audit log.

### Requirement 26
The audit log captures the specific action type.

### Requirement 27
The audit log captures a descriptive summary (e.g., total amount, invoice number).

### Requirement 28
The audit log captures the exact date and time it occurred.

### Requirement 29
The audit log captures the name of the user who performed the action.

### Requirement 30
Show the 20 most recent logs in a scrollable list card at the bottom of the main Dashboard.

### Requirement 31
Provide a Monthly Sales Analytics page (#reports) displaying order volumes, net subtotals, tax collected, and gross revenues grouped by month.

### Requirement 32
Exclude cancelled orders from report metrics.

### Requirement 33
Allow users to filter report analytics cards and the breakdown table by choosing custom Start and End dates.

### Requirement 34
Staff members must only see report numbers generated from sales orders they created themselves.

### Requirement 35a
Admins can view all reports.

### Requirement 35b
Managers can view all reports.

### Requirement 36
Include an Export Excel button to download the monthly report.

### Requirement 37
Use SheetJS (XLSX) to compile data and prompt a true binary Excel (.xlsx) file download, automatically adjusting column widths to prevent data wrapping.

### Requirement 38
Do not include CSV export.

### Requirement 39
Link Vendor profiles with Purchase Orders using active-only supplier dropdown selection fields inside PO forms.

### Requirement 40
Deleting a vendor must not permanently purge their data.

### Requirement 41
Instead, set isDeleted: true and move vendors to a soft-delete status group.

### Requirement 42
Include a Recycle Bin filter option in the Vendor Status dropdown.

### Requirement 43
Selecting the Recycle Bin filter displays soft-deleted vendors with an active Restore button (rotate-ccw icon) that restores the profile to active status.

### Requirement 44
Vendor statistics cards must exclude soft-deleted profiles.

### Requirement 45
Do not use a Recycle Bin for customers or products.

### Requirement 46
Customer and product profiles must be permanently deleted on confirmation.

### Requirement 46a
Deleting customer and product profiles is restricted to Admin roles.

### Requirement 46b
Deleting customer and product profiles is restricted to Manager roles.

### Requirement 47
Implement a live global search input in the top header bar.

### Requirement 48
When typing, show a dropdown popover listing matching customers (by name/company) and products (by name/SKU) with clickable links routing directly to their lists.

### Requirement 49
Add pagination to the tables on all list pages (including Customers, Products, Vendors, Sales Orders, and Purchase Orders).

### Requirement 50
Set pagination to 5 items per page.

### Requirement 51
Show a progress summary (e.g., Showing 1 to 5 of 12 entries).

### Requirement 52
Provide Next, Previous, and numbered page buttons.

### Requirement 53
Ensure changing search inputs or filters resets the view to page 1.
