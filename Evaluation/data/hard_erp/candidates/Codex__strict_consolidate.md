Build a simple ERP web application for a small business with a clean foundation that can be gradually expanded.

  Use a top navigation bar instead of a sidebar.

  Include customer management:

  - Users can create, edit, delete, and browse customers.
  - Users can search customers by name.
  - Customer lists should have pagination.
  - Customer deletion should remain permanent.
  - Staff cannot delete customers.
  - Admin and Manager users can delete customers.

  Include product management:

  - Users can create, edit, delete, and browse products.
  - Users can search products by name.
  - Product lists should have pagination.
  - Each product should have a name, SKU, price, current stock quantity, and configurable low-stock threshold.
  - Product prices and stock quantities should never be negative.
  - Product deletion should remain permanent.
  - Staff cannot delete products.
  - Admin and Manager users can delete products.

  Include vendor management:

  - Users can create, edit, delete, and browse vendors.
  - Vendor management should work similarly to customer management.
  - Vendor lists should have pagination.
  - Vendor deletion should move vendors to a recycle bin instead of permanently deleting them.
  - Deleted vendors should be restorable later.
  - Only vendors should use the recycle bin.

  Include a dashboard:

  - Show the total number of customers.
  - Show the total number of products.
  - Show low-stock products.
  - Low-stock products should be based on each product’s configurable low-stock threshold.
  - Make the dashboard look clean and professional.

  Include sales orders:

  - Users can browse sales orders.
  - Sales order lists should have pagination.
  - A sales order belongs to one customer.
  - A sales order contains one or more products with quantities.
  - The total amount should be calculated automatically from selected products and quantities.
  - When a sales order is confirmed, reduce inventory automatically.
  - Do not allow users to confirm an order if any item does not have enough stock available.
  - When a sales order is confirmed, automatically generate an invoice.

  Include purchase orders:

  - Users can browse purchase orders.
  - Purchase order lists should have pagination.
  - Staff can restock inventory with purchase orders.
  - When a purchase order is marked as received, increase product stock automatically.
  - Purchase orders are used for buying from suppliers/vendors.

  Include invoices:

  - Invoice lists should have pagination.
  - Invoices should have a due date 15 days after they are created.
  - Invoices need these payment statuses:
      - Unpaid
      - Partially Paid
      - Paid

  - Users should be able to record payments against invoices.
  - Supported payment methods:
      - Cash
      - Bank Transfer

  - Do not support Credit Card payments.

  Include roles:

  - Admin
  - Manager
  - Staff
  - Staff should not be allowed to delete customers or products.
  - Managers should be allowed to delete customers and products.
  - Managers should not be allowed to manage user accounts.
  - Only Admin users should be able to manage user accounts.

  Include reports:

  - Add a monthly sales report showing total sales for each month.
  - Show the monthly sales report as a table.
  - Do not include a chart.
  - Users should be able to filter the monthly sales report by a custom date range.
  - Users should be able to export the monthly sales report as an Excel .xlsx file.
  - Do not include CSV export.
  - Staff members should only be able to view reports they created themselves.
  - Managers and Admins can view all reports.

  Include audit logging:

  - Keep a history of important business events.
  - Add an audit log entry whenever:
      - A sales order is confirmed
      - An invoice is generated
      - A payment is recorded

  - The audit log should record which user performed the action.
  - The audit log should record the exact date and time the action happened.

  Inventory:

  - Track inventory as a single stock quantity per product.
  - Do not support multiple warehouses.

  General:

  - Add pagination to all list pages, including customers, products, vendors, sales orders, purchase orders, and invoices.
  - Clean up the overall code structure where appropriate.
  - Add comments explaining the main business logic.
