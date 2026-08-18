# Claude basic — candidate atomic decomposition (mode=candidate, keep-all, verbatim)
# Keep-all: tech stack, schema, file paths, component names are RETAINED so they get scored.
# Full clean re-derivation: permission statements split fine-grained per (role, object) to
# match the ground truth's own chosen granularity (requirements_split.md Req35-38, 40-42);
# every other enumeration (tech stack, CRUD lists, schema fields) is kept as GT keeps its
# corresponding enumerations merged, or is implementation detail with no GT counterpart
# either way, so its internal granularity does not affect the traceability verdict.

### Requirement 1
Build a small business ERP web app.

### Requirement 2
Build the ERP web app using Next.js 16 (App Router), SQLite via better-sqlite3, and Tailwind CSS v4.

### Requirement 3
Use iron-session for encrypted cookie sessions and bcryptjs for password hashing.

### Requirement 4
Use the better-sqlite3 synchronous driver, WAL mode, with foreign keys enforced.

### Requirement 5
Use xlsx (SheetJS) for Excel export.

### Requirement 6
Use Tailwind CSS v4 for styling.

### Requirement 7
Provide login/logout pages.

### Requirement 8
Middleware redirects to /login if the session cookie is absent (cookie-presence check only — no full decryption on Edge runtime).

### Requirement 9
Seed one default Admin account on first run: admin / admin123.

### Requirement 10
Three roles: Admin, Manager, Staff.

### Requirement 11
Admin: full access including user account management.

### Requirement 12
Manager: same as Admin except cannot manage user accounts.

### Requirement 13
Staff cannot delete customers.

### Requirement 14
Staff cannot delete products.

### Requirement 15
Staff reports are scoped to their own orders only.

### Requirement 16
Extract a canDeleteRecords(user) helper that returns true for Admin and Manager.

### Requirement 17
Tables: customers, products, orders, order_items, vendors, purchase_orders, purchase_order_items, invoices, invogs.

### Requirement 18
products: stock, low_stock_threshold (configurable per product, default 10).

### Requirement 19
orders: created_by (FK to users, for Staff report scoping).

### Requirement 20
invoices: due_date (15 days from issue), payment_status (Unpaid / Partially Paid / Paid).

### Requirement 21
invoice_payments: payment_method (Cash or Bank Transfer — no credit card).

### Requirement 22
vendors: deleted_at TEXT (soft delete).

### Requirement 23
audit_logs: event, entity, entity_id, details (JSON), user_id, username (denormalized), created_at.

### Requirement 24
Use PRAGMA table_info() migration guards for all new columns so existing databases are upgraded without data loss.

### Requirement 25
Dashboard: clean, professional design.

### Requirement 26
The dashboard has four stat cards (Total Customers, Total Products, Pending Orders, Outstanding invoice value).

### Requirement 27
The dashboard has a low-stock table showing products where stock < low_stock_threshold, ordered by stock ascending.

### Requirement 28
Customers page has a list with name search and pagination.

### Requirement 29
Customers support create/edit/delete.

### Requirement 30
Admin can delete customers (hard delete).

### Requirement 31
Manager can delete customers (hard delete).

### Requirement 32
Products/Inventory page has a list with name search and pagination.

### Requirement 33
Products support create/edit/delete.

### Requirement 34
Validate: price ≥ 0, stock ≥ 0, low-stock threshold ≥ 0.

### Requirement 35
Admin can delete products (hard delete).

### Requirement 36
Manager can delete products (hard delete).

### Requirement 37
Stock shown in red when below the product's threshold.

### Requirement 38
Vendors page has a list with pagination.

### Requirement 39
Vendors support create/edit.

### Requirement 40
Soft delete only — clicking Delete stamps deleted_at = datetime('now') instead of removing the row.

### Requirement 41
Show a "Recycle Bin (N)" badge in the header whenever deleted vendors exist.

### Requirement 42
The recycle bin page (/vendors/recycle-bin) lists deleted vendors with their deletion date and a Restore button that clears deleted_at.

### Requirement 43
Sales Orders page has a list with pagination.

### Requirement 44
Create orders (select customer + add line items with quantity and unit price).

### Requirement 45
Confirm order: inside a single SQLite transaction, validate stock, deduct stock for each item, mark order confirmed, and auto-generate exactly one invoice (due 15 days from now).

### Requirement 46
Store created_by from the session on creation.

### Requirement 47
Purchase Orders page has a list with pagination.

### Requirement 48
Create purchase orders.

### Requirement 49
Receive a PO: increment product stock inside a transaction, mark PO received.

### Requirement 50
Invoices page has a list with pagination.

### Requirement 51
Invoices are auto-generated when an order is confirmed.

### Requirement 52
Record payments (Cash or Bank Transfer).

### Requirement 53
Payment status recalculated from SUM(amount) — not a delta — so it stays consistent if records are edited later.

### Requirement 54
Manual status override also available.

### Requirement 55
Due date shown; overdue invoices highlighted.

### Requirement 56
Monthly Sales Report is a table by month: invoice count, total billed, collected, outstanding.

### Requirement 57
Date range filter using plain <input type="month"> GET form (no client JS needed).

### Requirement 58
Staff see only invoices linked to orders they created.

### Requirement 59
Managers see all reports.

### Requirement 60
Admins see all reports.

### Requirement 61
Export to Excel (.xlsx) only via a route handler at /reports/export.

### Requirement 62
Filename includes the date range when a filter is active.

### Requirement 63
Audit Log is a paginated table of business events.

### Requirement 64
Record an entry for order_confirmed (details: customer name, order total), invoice_generated (details: order ID, invoice total, due date), and payment_recorded (details: amount, payment method, resulting status).

### Requirement 65
Each entry stores the acting user's ID and username (denormalized), and the exact UTC timestamp via SQLite datetime('now').

### Requirement 66
Display with color-coded event badges (Indigo / Blue / Green), clickable links to the source order or invoice, a human-readable detail summary, the username, and the timestamp.

### Requirement 67
Create and manage user accounts, accessible only to Admin role.

### Requirement 68
lib/constants.ts: PAGE_SIZE = 20 imported by all list pages.

### Requirement 69
lib/session.ts: SessionUser type, canDeleteRecords(user) helper, getSession().

### Requirement 70
lib/audit.ts: logEvent(db, event, entity, entityId, details, userId, username) helper used by order and invoice actions.

### Requirement 71
components/Pagination.tsx: Server component with smart ellipsis.

### Requirement 72
components/SearchBar.tsx: Client component with useRouter.replace and a clear (×) button.

### Requirement 73
components/Navbar.tsx: Client component showing nav links, username, a role badge (indigo = Admin, amber = Manager, gray = Staff), and a sign-out button; nav links: Dashboard, Customers, Vendors, Products, Invoices, Purchases, Reports, Audit Log.

### Requirement 74
Add comments only where the why is non-obvious: business rules, race-condition guards, transaction boundaries, denormalization rationale.

### Requirement 75
Do not comment what the code already clearly expresses.

### Requirement 76
No negative price, stock, or threshold values allowed — validate in Server Actions before writing to the database.

### Requirement 77
Dynamic WHERE clause building using a conditions array and a params array to compose Staff scoping and date filters cleanly.
