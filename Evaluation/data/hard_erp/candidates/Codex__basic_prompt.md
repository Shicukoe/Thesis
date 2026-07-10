Build a simple ERP web application for a small business with a clean, professional foundation that can be expanded gradually.

  The app should include these modules:

  - Dashboard
  - Customers
  - Vendors
  - Products
  - Sales Orders
  - Invoices
  - Purchase Orders
  - Reports

  Use a top navigation bar, not a sidebar.

  Dashboard requirements:

  - Show total number of customers.
  - Show total number of products.
  - Show total number of active vendors.
  - Show low-stock products.
  - Each product has its own configurable low-stock threshold.
  - A product is low-stock when its current stock quantity is below its configured threshold.
  - Show a recent audit log of important business events.
  - Keep the dashboard visually clean and professional.

  Customer management:

  - Users can browse, search by name, create, edit, and delete customers.
  - Customer deletion is permanent.
  - Only Admin and Manager users can delete customers.
  - Staff users cannot delete customers.
  - Customer lists should support pagination.

  Vendor management:

  - Users can browse, search, create, edit, and delete vendors.
  - Vendor deletion should move the vendor to a recycle bin instead of permanently deleting it.
  - Deleted vendors can be restored later.
  - Active workflows, such as purchase order creation, should only show active vendors.
  - Vendor lists should support pagination.

  Product management:

  - Users can browse, search by name, create, edit, and delete products.
  - Each product should have:
      - Name
      - SKU
      - Price
      - Current stock quantity
      - Low-stock threshold

  - Product prices, stock quantities, and low-stock thresholds must not allow negative values.
  - Product deletion is permanent.
  - Only Admin and Manager users can delete products.
  - Staff users cannot delete products.
  - Product lists should support pagination.

  Sales orders:

  - Users can browse, create, edit, and delete sales orders.
  - A sales order belongs to one customer.
  - A sales order contains one or more products with quantities.
  - The total amount should be calculated automatically from selected products and quantities.
  - Users should not be able to confirm a sales order if any item lacks enough stock.
  - When a sales order is confirmed, reduce product inventory automatically.
  - When a sales order is confirmed, automatically generate an invoice.
  - Sales order lists should support pagination.

  Invoices:

  - Invoices are generated automatically from confirmed sales orders.
  - Each invoice should have a due date 15 days after it is created.
  - Invoices need a payment status:
      - Unpaid
      - Partially Paid
      - Paid

  - Users can record payments against invoices.
  - Supported payment methods:
      - Cash
      - Bank Transfer

  - Invoice payment status should update based on recorded payments.
  - Invoice lists should support pagination.

  Purchase orders:

  - Users can browse, create, edit, and delete purchase orders.
  - A purchase order belongs to one vendor.
  - A purchase order contains one or more products with quantities.
  - When a purchase order is marked as received, increase product stock automatically.
  - Purchase order lists should support pagination.

  Reports:

  - Add a monthly sales report.
  - The report should show total sales for each month in a table.
  - Do not include a chart.
  - Users can filter the monthly sales report by a custom invoice issue date range.
  - Users can export the filtered monthly sales report as an Excel .xlsx file.
  - CSV export is not required.
  - Admin and Manager users can view all report data.
  - Staff users can only view report data from records they created.

  Roles and permissions:

  - Support three roles:
      - Admin
      - Manager
      - Staff

  - Admin users can manage user accounts.
  - Manager users can delete customers and products but cannot manage user accounts.
  - Staff users cannot delete customers or products.
  - Staff users can only view reports for records they created.
  - Admin and Manager users can view all reports.

  Audit log:

  - Record audit log entries whenever:
      - A sales order is confirmed

  - Each audit log entry should include:
      - Event type
      - Related record
      - User who performed the action
      - User role
      - Exact date and time
      - Readable event summary

  - Display recent audit log entries on the dashboard.

  General requirements:

  - Keep the codebase clean and organized.
  - Add comments explaining the main business logic.
  - Use a simple structure suitable for gradual expansion.
  - Use client-side pagination for all major list pages:
      - Customers
      - Products
      - Vendors
      - Sales Orders
      - Purchase Orders
      - Invoices

  - Keep inventory as a single stock quantity per product. Do not support multiple warehouses.