  Build a clean, professional, and modern Enterprise Resource Planning (ERP) web application using HTML, Vanilla CSS, and Vanilla JavaScript (ES Modules). The application must implement the
  following unified specifications:

    ---

    ### 1. User Roles & Access Control (RBAC)
    Implement three user roles: **Admin**, **Manager**, and **Staff**. Provide a dropdown selector in the top-right profile section of the header to easily swap roles for local testing.
    *   **Admin**: Full access to all features, including the User Accounts management view (`#users`) to register and manage operator accounts.
    *   **Manager**: Can perform all operations (including deleting customers and products) except user account administration (cannot access `#users`).
    *   **Staff**: General view and entry permissions, with the following restrictions:
        *   Cannot delete customers or products (delete buttons hidden; action blocked).
        *   Cannot manage user accounts (cannot access `#users`).
        *   Cannot manually change the status of sales orders or purchase orders (status sliders and status-changing buttons hidden).
        *   Cannot edit product prices in the catalog (fields disabled).
        *   Can only view monthly sales report records they created themselves (filtered by the user who created the sales order).

    ---

    ### 2. Customers & Product Catalog
    *   **Validation Rules**: Prevent negative values for product prices and stock quantities. Validate this both in the input fields and programmatically on form submission.
    *   **Low-Stock Alerts**: Each product must have its own configurable low-stock threshold. Show a list of all products currently below their threshold on the main dashboard.
    *   **Product Deletion**: Deleting products must permanently remove them from the system (restricted to Admins and Managers).

    ---

    ### 3. Customers Directory
    *   **Customer Deletion**: Deleting customers must permanently remove them from the database (restricted to Admins and Managers).

    ---

    ### 4. Vendor Directory & Recycle Bin
    *   **Directory**: Manage supplier details and associate them with purchase orders.
    *   **Recycle Bin**: Instead of permanently deleting vendors, move deleted vendors to a "Recycle Bin".
        *   Provide a status filter to view Recycle Bin vendors.
        *   Allow Admins and Managers to restore vendors from the Recycle Bin.
        *   Exclude Recycle Bin vendors from active supplier count statistics.

    ---

    ### 5. Sales Orders, Invoices, & Payments
    *   **Invoicing**: Confirming a sales order must automatically deduct item quantities from inventory stock and generate a commercial invoice.
    *   **Due Dates**: Automatically set invoice due dates to exactly 15 days after invoice generation (Net-15 terms).
    *   **Payment Registration**: Accept and record payments via Cash or Bank Transfer only.
    *   **Audit Logging**: Automatically create a system audit log entry whenever a sales order is confirmed, an invoice is generated, or a payment is recorded. The log must capture:
        *   The action type (sales order confirmed, invoice generated, payment recorded).
        *   The exact date and time of the event.
        *   The user who performed the action.
        *   The specific details of the action.
        *   Display the 20 most recent log entries in a scrollable history card at the bottom of the main dashboard.

    ---

    ### 6. Monthly Sales Reports
    *   **Table Ledger**: Provide a monthly sales report page summarizing orders volume, net subtotals, tax collected, and gross revenues in a clean table. Exclude cancelled orders from report
  metrics. *Do not include any charts.*
    *   **Date Range Filtering**: Add date pickers letting users filter the sales report by a custom Start Date and End Date range.
    *   **Data Exporting**: Provide an **Export Excel** button to download the monthly report as a true binary Excel (`.xlsx`) spreadsheet. Apply autofit adjustments to column widths so data is
  displayed cleanly. *Do not support CSV export.*

    ---

    ### 7. Search & Pagination Controls
    *   **Global Search**: Add a search bar in the header to quickly find customers and products by name or SKU, displaying matching search results in a live dropdown list.
    *   **Table Pagination**: Add pagination (5 items per page) to all list tables (including customers, products, vendors, sales orders, and purchase orders). Automatically reset the active page
  to 1 whenever a filter or search input changes.