<!-- Paste the Claude "spec_guided" master prompt for hard_erp here (the "## Master prompt" section spec.md gives you when you say "consolidate"). This comment line is ignored by the scorer; the file is skipped until you paste real text. -->
Build a simple ERP web application for a small business with a clean foundation that can be gradually expanded.

The first module is customer management: users should be able to create, edit, delete, and browse customers.

Add products, each with a name, SKU, price, current stock quantity, and a configurable low-stock threshold; price and stock quantity should never be allowed to have negative values.

Add navigation: a top navigation bar with Dashboard, Customers, and Products.

The dashboard should show the total number of customers and products, and low-stock products whenever a product's stock drops below its own configured low-stock threshold, and should look clean and professional.

Add sales orders. A sales order belongs to one customer and contains one or more products with quantities, its total amount is calculated automatically from the selected products and quantities, and when a sales order is confirmed, inventory is reduced automatically, but confirmation is blocked if any item doesn't have enough stock available.

Add purchase orders so staff can restock inventory; when a purchase order is marked as received, product stock is increased automatically.

Since the business is buying from suppliers, add vendor management too, working similarly to customer management with create, edit, delete, and browse operations. Instead of permanently deleting a vendor, move it to a recycle bin so it can be restored later; only vendors use the recycle bin — customers and products continue using permanent deletion, based on the user's permissions.

Whenever a sales order is confirmed, automatically generate an invoice with a due date 15 days after it's created and a payment status of Unpaid, Partially Paid, or Paid. Users should be able to record payments against invoices, using one of these payment methods: Cash or Bank Transfer.

Introduce user roles: Admin, Staff, and Manager. Staff members should not be allowed to delete customers or products; Admin and Manager users can do that. Managers should not be allowed to manage user accounts. Staff members should only be able to view reports that they created themselves; Managers and Admins can continue viewing all reports.

Add a monthly sales report showing the total sales for each month, with an export feature that generates an Excel (.xlsx) file so it can be shared with the accountant, and support filtering the report by a custom date range.

Add pagination to all list pages, including customers, products, vendors, sales orders, purchase orders, and invoices.

Add a search bar so users can quickly find customers and products by name.

Add an audit log recording a history of important business events: whenever a sales order is confirmed, an invoice is generated, or a payment is recorded, along with which user performed the action and the exact date and time it happened.