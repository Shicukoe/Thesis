# Small Business ERP Foundation

A clean, zero-dependency ERP web app foundation for a small business. The app is currently frontend-only and uses sample data so modules can be expanded gradually.

## Run

Open `index.html` in a browser.

## Current Modules

- Dashboard
- Customers
- Vendors
- Products
- Sales Orders
- Invoices
- Purchase Orders
- Reports

The dashboard currently shows total customer, vendor, and product counts, plus products whose current stock has dropped below their configured low-stock threshold.
It also shows a recent audit log for important business events.

Navigation is provided through a top navigation bar.

Customer, vendor, product, sales order, invoice, and purchase order registers use client-side pagination to keep long lists manageable.

The app currently supports three user roles: Admin, Manager, and Staff. The selected role is shown in the header and stored in the browser with `localStorage`. Admin and Manager users can delete customers or products and view all report data; Staff users can only view report data from records they created. Only Admin users can manage user accounts.

## Customer Management

The Customers module supports browsing, searching, creating, editing, and permanently deleting customer records when the current role has deletion permission. Changes are stored in the browser with `localStorage` until a backend is added.

## Vendor Management

The Vendors module supports browsing, searching, creating, editing, and moving supplier records to a recycle bin. Deleted vendors can be restored later, and active workflows such as purchase order creation only show active vendors. Changes are stored in the browser with `localStorage` until a backend is added.

## Product Management

The Products module supports browsing, searching, creating, editing, and permanently deleting product records when the current role has deletion permission. Each product has a name, SKU, price, current stock quantity, and configurable low-stock threshold. Changes are stored in the browser with `localStorage` until a backend is added.

## Sales Orders

The Sales Orders module supports browsing, creating, editing, and deleting orders. Each order belongs to one customer and contains one or more product lines with quantities. The total amount is calculated from selected product prices and quantities. When an order is confirmed, product stock is reduced automatically, confirmation is blocked if any item lacks enough stock, and an invoice is generated automatically. Changes are stored in the browser with `localStorage` until a backend is added.

## Invoices

The Invoices module shows invoices generated from confirmed sales orders. Each sales order creates at most one invoice, with a due date set 15 days after the invoice issue date. Users can record payments against invoices by Cash or Bank Transfer, and payment status is calculated as Unpaid, Partially Paid, or Paid from the recorded payment total.

## Purchase Orders

The Purchase Orders module supports browsing, creating, editing, and deleting vendor restock orders. Each purchase order belongs to one vendor and contains one or more product lines with quantities. When an order is received, product stock is increased automatically. Changes are stored in the browser with `localStorage` until a backend is added.

## Reports

The Reports module includes a monthly sales report table that totals confirmed sales orders by invoice issue month. Users can filter the report by custom invoice issue date ranges and export the filtered result as an Excel `.xlsx` file for sharing with accounting. Admin and Manager users can view all monthly sales report data, while Staff users only see sales orders they created.

## Audit Log

The app records audit log entries whenever a sales order is confirmed, an invoice is generated, or a payment is recorded. Audit entries include the event type, related record, user, role, exact date and time, and a readable event summary. The latest entries are shown on the dashboard and stored in the browser with `localStorage`.

## Project Structure

```text
.
+-- index.html
+-- src
|   +-- app.js
|   +-- data.js
|   +-- styles.css
+-- README.md
```

## Next Expansion Points

- Replace sample data in `src/data.js` with API calls.
- Add create/edit forms for orders, invoices, products, and customers.
- Introduce authentication and role-based access.
- Add persistence with a database-backed API.
