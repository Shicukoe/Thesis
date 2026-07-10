    Please build a project with the following requirements:

    1.  **User Roles & Permissions**:
        *   Implement **Admin**, **Manager**, and **Staff** user roles.
        *   Staff members shouldn't be allowed to delete customers or products. Only Admin and Manager users can do that.
        *   Managers shouldn't be allowed to manage user accounts.
        *   Staff members should only be able to view reports that they created themselves. Managers and Admins can continue viewing all reports.

    2.  **Dashboard & Low-Stock Alerts**:
        *   Show low-stock products on the dashboard.
        *   Each product should have its own configurable low-stock threshold.
        *   The dashboard must look clean and professional.

    3.  **Monthly Sales Report & Date Filters**:
        *   Add a monthly sales report showing the total sales for each month in a table. Do not include a chart.
        *   Let users filter the report by a custom date range.
        *   Add an export feature for the monthly sales report that generates an Excel (.xlsx) file. Do not export CSV.

    4.  **Pagination & Search**:
        *   Add pagination to all list pages, including customers, products, vendors, sales orders, purchase orders, and invoices.
        *   Add a search bar so users can quickly find customers and products by name.

    5.  **Validation**:
        *   Product prices and stock quantities should never be allowed to have negative values.

    6.  **Recycle Bin & Deletion Policy**:
        *   Instead of permanently deleting vendors, move them to a recycle bin so they can be restored later.
        *   Only vendors should use the recycle bin. Customers and products should continue using permanent deletion based on the user's permissions.

    7.  **Audit Logs**:
        *   Add an audit log whenever a sales order is confirmed, an invoice is generated, or a payment is recorded.
        *   The audit log must record which user performed the action and the exact date and time it happened.

    8.  **Code Maintenance**:
        *   Clean up the overall structure where appropriate and add comments explaining the main business logic.