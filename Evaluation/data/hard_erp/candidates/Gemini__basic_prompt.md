Build a clean, professional, and dark-themed Enterprise Resource Planning (ERP) web application in raw HTML, CSS (Vanilla CSS), and Vanilla JavaScript (ES Modules). The application must incorporate the following comprehensive features, rules, and restrictions:

1. Role-Based Access Control (RBAC)
Implement a system with three distinct user roles: Admin, Manager, and Staff. Role switching must be easily testable via a dropdown in the user profile badge in the top-right header, which dynamically swaps the active profile name, avatar initials, and re-renders UI permissions:
Admin (e.g., John Storeowner): Full read, write, edit, delete, and user administration access (including the #users configuration view).
Manager (e.g., Mike Manager): Can view, edit, create, and delete products and customer profiles. Blocked from user account administration.
Staff (e.g., Sarah Staff): Can view data, record sales orders, and edit basic fields. Blocked from:
Deleting customers or products.
Accessing user account management.
Manually changing sales order or purchase order statuses (status sliders/cancellations must be hidden).
Editing selling prices in the product catalog.

2. Inventory Catalog & Validation Rules
Negative Values Prevention: Product selling prices, stock levels, and reorder thresholds must never accept negative numbers. Enforce HTML-level constraints (min="0") and JavaScript-level validation on form submission.
Customizable Low-Stock Thresholds: Each product must have its own configurable low-stock alert limit (minStock).
Dashboard Alerts: Dynamically display a list of all low-stock products (stock <= minStock) on the main overview dashboard.

3. Invoicing, Payments, & System Audit Logs
Billing Lifecycle: Sales Order confirmation must deduct item quantities from inventory and automatically generate a commercial invoice.
Due Dates: Invoices must use Net-15 payment terms (due date is automatically calculated as 15 days after invoice generation).
Supported Payment Methods: Payments can only be recorded via Cash or Bank Transfer (exclude Credit Card option).
Audit Logging: Maintain a persistent history of key business actions. Whenever a sales order is confirmed, an invoice is generated, or a payment is recorded, create an audit log capturing:
The specific action type.
A descriptive summary (e.g., total amount, invoice number).
The exact date and time it occurred.
The name of the user who performed the action.
Show the 20 most recent logs in an scrollable list card at the bottom of the main Dashboard.

4. Monthly Sales Reports & Data Exporter
Financial Reports Ledger: Provide a Monthly Sales Analytics page (#reports) displaying order volumes, net subtotals, tax collected, and gross revenues grouped by month. Exclude cancelled orders from report metrics.
Date Range Filtering: Allow users to filter report analytics cards and the breakdown table by choosing custom Start and End dates.
Staff View Restrictions: Staff members must only see report numbers generated from sales orders they created themselves. Admins and Managers can view all reports.
Excel Exporter: Include an Export Excel button to download the monthly report. Use SheetJS (XLSX) to compile data and prompt a true binary Excel (.xlsx) file download, automatically adjusting column widths to prevent data wrapping. Do not include CSV export.

5. Vendor Directory & Soft-Delete Recycle Bin
Supplier Association: Link Vendor profiles with Purchase Orders using active-only supplier dropdown selection fields inside PO forms.
Soft-Delete Recycle Bin:
Deleting a vendor must not permanently purge their data. Instead, set isDeleted: true and move them to a soft-delete status group.
Include a Recycle Bin filter option in the Vendor Status dropdown. Selecting it displays soft-deleted vendors with an active Restore button (rotate-ccw icon) that restores the profile to active status.
Vendor statistics cards must exclude soft-deleted profiles.
Customer & Product Deletions: Do not use a Recycle Bin for customers or products. Customer and product profiles must be permanently deleted on confirmation (restricting delete privileges to Admin and Manager roles).

6. Global Search & Pagination UI Controls
Header Search: Implement a live global search input in the top header bar. When typing, show a dropdown popover listing matching customers (by name/company) and products (by name/SKU) with clickable links routing directly to their lists.
Table Pagination: Add pagination to the tables on all list pages (including Customers, Products, Vendors, Sales Orders, and Purchase Orders).
Set pagination to 5 items per page.
Show a progress summary (e.g., Showing 1 to 5 of 12 entries).
Provide Next, Previous, and numbered page buttons.
Ensure changing search inputs or filters resets the view to page 1.