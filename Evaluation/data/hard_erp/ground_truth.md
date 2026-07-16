<!-- DRAFT ground-truth master prompt ("Master Prompt 1") for the hard ERP project.
     Human-consolidated from the 45-prompt history with every temporal conflict
     resolved: sidebar->top nav (P4->P10), multi-warehouse cancelled (P14->P15),
     due date 30->15 days (P17->P18), credit card removed (P21->P22), Manager role
     added (P25), fixed 10 threshold -> per-product threshold (P26->P27), chart
     removed (P29->P30), CSV->xlsx->both->xlsx-only (P36..P39). Keep ONLY what the
     user actually asked for - no tech stack, file names, or libraries. REVIEW/EDIT. -->

Create a simple ERP web application for a small business with a clean foundation that can be gradually expanded.

Implement customer management with create, edit, delete, and browse operations.

Implement vendor management with create, edit, browse, and recycle bin deletion so deleted vendors can be restored later.

Implement product management with create, edit, delete, and browse operations. Each product must have a name, SKU, price, current stock quantity, and a configurable low-stock threshold. Product prices and stock quantities must not allow negative values.

Use a top navigation bar containing Dashboard, Customers, and Products.

The dashboard should display the total number of customers and products, show products whose stock is below their configured low-stock threshold, and have a clean and professional appearance.

Implement sales orders. A sales order must belong to one customer and contain one or more products with quantities. The total amount must be calculated automatically from the selected products and quantities. Users must not be able to confirm a sales order if any item does not have enough stock available. When a sales order is confirmed, automatically reduce product stock, generate an invoice, and record an audit log entry.

Implement purchase orders for restocking inventory. When a purchase order is marked as received, automatically increase product stock.

Implement invoices. Each invoice must have a due date 15 days after it is created and support the payment statuses Unpaid, Partially Paid, and Paid. Users must be able to record payments against invoices using the payment methods Cash and Bank Transfer. Recording a payment must create an audit log entry.

Support user roles Admin, Manager, and Staff. Staff users must not be allowed to delete customers or products and may only view reports they created themselves. Admin and Manager users may delete customers and products, and may view all reports. Managers must not be allowed to manage user accounts.

Provide a monthly sales report showing total sales for each month in a table. Allow users to filter the report by a custom date range and export it as an Excel (.xlsx) file.

Add pagination to the customer, product, vendor, sales order, purchase order, and invoice list pages.

Add search functionality so users can find customers and products by name.

Implement an audit log that records whenever a sales order is confirmed, an invoice is generated, or a payment is recorded. Each audit log entry must include the user who performed the action and the exact date and time it occurred.