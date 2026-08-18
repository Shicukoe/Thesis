<!-- Paste the Codex "spec_guided" master prompt for hard_erp here (the "## Master prompt" section spec.md gives you when you say "consolidate"). This comment line is ignored by the scorer; the file is skipped until you paste real text. -->
• Build a simple ERP web application for a small business with a clean foundation that can be gradually expanded. Clean up the
  overall structure where appropriate and add comments explaining the main business logic. Add navigation: a top navigation bar
  with Dashboard, Customers, and Products should be enough for now. Introduce user roles. Have Admin, Staff, and Manager. Staff
  members shouldn't be allowed to delete customers or products. Admin users and Managers should be able to delete customers and
  products. Customers and products should continue using permanent deletion based on the user's permissions. Managers shouldn't be
  allowed to manage user accounts. Staff members should only be able to view reports that they created themselves. Managers and
  Admins can continue viewing all reports. The dashboard should look clean and professional. The dashboard doesn't need much yet.
  Just show the total number of customers and products. Show low-stock products on the dashboard whenever stock drops below each
  product's own configurable low-stock threshold. The first thing needed is customer management. Users should be able to create,
  edit, delete, and browse customers. Add a search bar so users can quickly find customers and products by name. Add pagination to
  all list pages, including customers, products, vendors, sales orders, purchase orders, and invoices. Add vendor management too.
  It should work similarly to customer management with create, edit, delete, and browse operations. Only vendors should use the
  recycle bin. Instead of permanently deleting vendors, move them to a recycle bin so they can be restored later. Add products.
  Each product should have a name, SKU, price, current stock quantity, and its own configurable low-stock threshold. Product
  prices and stock quantities should never be allowed to have negative values. Start implementing sales orders. A sales order
  should belong to one customer and contain one or more products with quantities. The total amount should be calculated
  automatically from the selected products and quantities. When a sales order is confirmed, reduce the inventory automatically.
  Don't let users confirm the order if any item doesn't have enough stock available. Whenever a sales order is confirmed,
  automatically generate an invoice. Invoices should have a due date 15 days after they're created. Invoices also need a payment
  status. Use these three statuses: Unpaid, Partially Paid, and Paid. Users should be able to record payments against invoices.
  Support these payment methods: Cash, Bank Transfer. Add an audit log whenever a sales order is confirmed, an invoice is
  generated, or a payment is recorded, recording which user performed the action and the exact date and time it happened. Add a
  monthly sales report showing the total sales for each month. Let users filter the monthly sales report by a custom date range.
  Add an export feature that generates an Excel (.xlsx) file for the monthly sales report. Need purchase orders so staff can
  restock inventory. When a purchase order is marked as received, increase the product stock automatically.