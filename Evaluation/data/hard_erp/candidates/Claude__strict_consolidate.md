Build a small business ERP web app.

Payment methods: Support Cash and Bank Transfer. Do not support credit cards.

User roles: There are three roles — Admin, Staff, and Manager.
- Staff cannot delete customers or products. Only Admin and Manager can delete customers or products.
- Manager cannot manage user accounts.

Dashboard: Make the dashboard look clean and professional. Show low-stock products on the dashboard whenever a product's stock drops below that product's own configurable low-stock threshold (each product has its own threshold, not a shared fixed value).

Monthly sales report: Add a monthly sales report showing the total sales for each month, displayed as a table.

Pagination: Add pagination to all list pages — customers, products, vendors, sales orders, purchase orders, and invoices.

Search: Add a search bar so users can quickly find customers and products by name.

Validation: Product prices and stock quantities must never be negative.

Code quality: Clean up the overall code structure where appropriate and add comments explaining the main business logic.

Report export: Add the ability to export the monthly sales report as an Excel (.xlsx) file.

Report date filter: Let users filter the monthly sales report by a custom date range.

Report permissions: Staff can only view reports for orders they created themselves. Managers and Admins can view all reports.

Vendor recycle bin: Instead of permanently deleting vendors, move them to a recycle bin so they can be restored later. Customers and products continue using permanent deletion based on the user's permissions.

Audit log: Keep a history of important business events. Record an entry whenever a sales order is confirmed, an invoice is generated, or a payment is recorded. Each entry must record which user performed the action and the exact date and time it happened.