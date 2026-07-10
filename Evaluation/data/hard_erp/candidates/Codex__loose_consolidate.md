Build a simple ERP web application for a small business as a clean foundation that can be gradually expanded.

  Use a top navigation bar, not a sidebar. Include these modules:

  - Dashboard
  - Customers
  - Vendors
  - Products
  - Sales Orders
  - Invoices
  - Purchase Orders
  - Reports

  Dashboard:

  - Show the total number of customers.
  - Show the total number of products.
  - Show the total number of active vendors.
  - Show low-stock products.
  - Low-stock detection must use each product’s configurable low-stock threshold, not a fixed threshold.
  - A product is low-stock when its current stock quantity is below its configured threshold.
  - Show recent audit log entries.
  - Make the dashboard look clean and professional.

  Customers:

  - Users can browse, create, edit, delete, and search customers by name.
  - Customer deletion is permanent.
  - Only Admin and Manager users can delete customers.
  - Users can browse, create, edit, delete, and search vendors.
  - Vendor deletion must move the vendor to a recycle bin instead of permanently deleting it.
  - Deleted vendors can be restored later.
  - Only vendors should use the recycle bin.
  - Active workflows, including purchase order creation, should only show active vendors.
  - Vendor lists must support pagination.

  Products:

  - Users can browse, create, edit, delete, and search products by name.
  - Each product has:
      - Name
      - SKU
      - Price
      - Current stock quantity
      - Configurable low-stock threshold

  - Product prices must not be negative.
  - Product stock quantities must not be negative.
  - Product low-stock thresholds must not be negative.
  - Product deletion is permanent.
  - Only Admin and Manager users can delete products.
  - Staff users cannot delete products.
  - Product lists must support pagination.

  Sales orders:

  - Users can browse, create, edit, and delete sales orders.
  - A sales order belongs to one customer.
  - A sales order contains one or more products with quantities.
  - The total amount is calculated automatically from selected products and quantities.
  - Users cannot confirm a sales order if any item does not have enough stock available.
  - When a sales order is confirmed, reduce product inventory automatically.
  - When a sales order is confirmed, automatically generate an invoice.
  - Sales order lists must support pagination.

  Invoices:

  - Invoices are generated automatically when sales orders are confirmed.
  - Each sales order should create at most one invoice.
  - Each invoice has a due date 15 days after it is created.
  - Each invoice has one payment status:
      - Unpaid
      - Partially Paid
      - Paid

  - Users can record payments against invoices.
  - Supported payment methods are:
      - Cash
      - Bank Transfer

  - Credit Card must not be a supported payment method.
  - Invoice payment status updates based on recorded payments.
  - Invoice lists must support pagination.

  Purchase orders:

  - Users can browse, create, edit, and delete purchase orders.
  - A purchase order belongs to one active vendor.
  - A purchase order contains one or more products with quantities.
  - When a purchase order is marked as received, increase product stock automatically.
  - Purchase order lists must support pagination.

  Reports:

  - Add a monthly sales report.
  - Show total sales for each month in a table.
  - Do not include a chart.
  - Users can filter the monthly sales report by a custom invoice issue date range.
  - Users can export the filtered monthly sales report as an Excel .xlsx file.
  - Do not provide CSV export.
  - Admin and Manager users can view all report data.
  - Staff users can only view report data from records they created.

  Roles and permissions:

  - Support these roles:
      - Admin
      - Manager
      - Staff

  - Admin users can manage user accounts.
  - Manager users can delete customers and products but cannot manage user accounts.
  - Staff users cannot delete customers or products.
  - Staff users can only view reports they created themselves.
  - Admin and Manager users can view all reports.

  Audit log:

  - Keep a history of important business events.
  - Add audit log entries whenever:
      - A sales order is confirmed
      - An invoice is generated
      - A payment is recorded

  - Each audit log entry must record:
      - Event type
      - Related record
      - User who performed the action
      - User role
      - Exact date and time
      - Readable event summary

  - Display recent audit log entries on the dashboard.

  General:

  - Keep inventory as a single stock quantity per product.
  - Do not support multiple warehouses.
  - Add pagination to all list pages, including customers, products, vendors, sales orders, purchase orders, and invoices.
  - Add basic validation so product prices, stock quantities, and low-stock thresholds cannot be negative.
  - Keep the codebase clean and organized.
  - Add comments explaining the main business logic.