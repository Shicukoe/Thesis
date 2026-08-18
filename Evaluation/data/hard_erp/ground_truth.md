Create a simple ERP web application for a small business with a clean foundation that can be gradually expanded.

Implement customer management with create, edit, delete, and browse operations.

Add vendor management that works similarly to customer management, with create, edit, delete, and browse operations. Instead of permanently deleting vendors, move deleted vendors to a recycle bin so they can be restored later. Only vendors use the recycle bin; customers and products continue using permanent deletion based on the user's permissions.

Add products. Each product must have a name, SKU, price, and current stock quantity. Each product uses a single stock quantity and haves its own configurable low-stock threshold. Product prices and stock quantities must not allow negative values.

Use a top navigation bar containing Dashboard, Customers, and Products.

The dashboard should display the total number of customers and products, show products whose stock is below their configured low-stock threshold, and have a clean and professional appearance.

Implement sales orders. A sales order should belong to one customer and contain one or more products with quantities. The total amount must be calculated automatically from the selected products and quantities. Users must not be able to confirm a sales order if any item does not have enough stock available. When a sales order is confirmed, automatically reduce product stock, generate an invoice, and record an audit log entry.

Implement purchase orders for restocking inventory. When a purchase order is marked as received, automatically increase product stock.

Invoice should have a due date 15 days after they are created and use these three payment statuses Unpaid, Partially Paid, and Paid.

Users must be able to record payments against invoices. Support payment methods Cash and Bank Transfer. Recording a payment must create an audit log entry.

Support user roles Admin, Manager, and Staff. Staff users shouldn’t be allowed to delete customers or products and should only be able to view reports they created themselves. Admin and Manager users should be able to delete customers and products, and can view all reports. Managers must not be allowed to manage user accounts.

Add a monthly sales report showing total sales for each month. Keep the monthly sales numbers in a table. Add an export feature that generates a Excel (.xlsx) file. Allow users to filter the report by a custom date range.

Add pagination to the customer, product, vendor, sales order, purchase order, and invoice list pages.

Add a search bar so users can quickly find customers and products by name.

Implement an audit log that records whenever a sales order is confirmed, an invoice is generated, or a payment is recorded. Each audit log entry must include the user who performed the action and the exact date and time it occurred.

Clean up the overall code structure where appropriate and add comments explaining the main business logic.