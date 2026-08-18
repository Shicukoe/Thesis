# Claude loose — candidate atomic decomposition (mode=candidate, keep-all, verbatim)
# Full clean re-derivation: permission statements split fine-grained per (role, object) to
# match the ground truth's own chosen granularity (requirements_split.md Req35-38, 40-42).

### Requirement 1
Build a small business ERP web app.

### Requirement 2
Build the ERP web app using Next.js 16 (App Router), SQLite via better-sqlite3, and Tailwind CSS.

### Requirement 3
Use iron-session for encrypted cookie sessions and bcryptjs for password hashing.

### Requirement 4
Use the better-sqlite3 synchronous driver, WAL mode, with foreign keys enforced.

### Requirement 5
Use xlsx (SheetJS) for Excel export.

### Requirement 6
Provide login/logout pages.

### Requirement 7
Middleware redirects unauthenticated users to /login using a cookie-presence check only (full iron-session decryption is unavailable on the Edge runtime).

### Requirement 8
Seed one default Admin account on first run: username admin, password admin123.

### Requirement 9
Three roles: Admin, Manager, Staff.

### Requirement 10
Admin: full access, including managing user accounts.

### Requirement 11
Manager: same as Admin except cannot manage user accounts.

### Requirement 12
Staff cannot delete customers.

### Requirement 13
Staff cannot delete products.

### Requirement 14
Staff, on the sales report, sees only invoices for orders they personally created.

### Requirement 15
Extract a shared canDeleteRecords(user) helper that returns true for Admin and Manager, used wherever delete permissions are checked.

### Requirement 16
Tables: customers, products, orders, order_items, vendors, purchase_orders, purchase_order_items, invoices, invoice_payments, users, audit_logs.

### Requirement 17
products: price, stock, low_stock_threshold (configurable per product, default 10).

### Requirement 18
orders: created_by (FK → users, for Staff report scoping), status (pending / confirmed).

### Requirement 19
invoices: due_date (15 days from issue date), payment_status (Unpaid / Partially Paid / Paid).

### Requirement 20
invoice_payments: payment_method (Cash or Bank Transfer).

### Requirement 21
vendors: deleted_at TEXT (NULL = active; a timestamp = soft-deleted).

### Requirement 22
audit_logs: event, entity, entity_id, details (JSON string), user_id, username (denormalized), created_at.

### Requirement 23
Use PRAGMA table_info() migration guards for every column added to an already-existing table so the database is upgraded.

### Requirement 24
lib/constants.ts: PAGE_SIZE = 20, imported by every list page.

### Requirement 25
lib/session.ts: SessionUser type (userId, username, role), getSession(), and canDeleteRecords(user).

### Requirement 26
lib/audit.ts: logEvent(db, event, entity, entityId, details, userId, username) helper called from any Server Action that needs to write an audit entry.

### Requirement 27
components/Pagination.tsx: Server component with smart ellipsis — shows all page numbers when ≤ 7, otherwise shows first page and last; preserves the q search param in page links.

### Requirement 28
components/SearchBar.tsx: Client component using useRouter.replace, with a clear (×) button.

### Requirement 29
components/Navbar.tsx: Client component showing nav links, username, a role badge (indigo = Admin, amber = Manager, gray = Staff), and a sign-out button; hidden on the login page.

### Requirement 30
Dashboard: clean, professional design.

### Requirement 31
Four stat cards: Total Customers, Total Products, Pending Orders, and Outstanding invoice value.

### Requirement 32
A low-stock table showing every product where stock < low_stock_threshold, sorted by stock ascending.

### Requirement 33
Customers page has a list with name search and pagination.

### Requirement 34
Customers support create, edit, and delete.

### Requirement 35
Admin can delete customers (hard delete, enforced via canDeleteRecords).

### Requirement 36
Manager can delete customers (hard delete, enforced via canDeleteRecords).

### Requirement 37
Products/Inventory page has a list with name search and pagination.

### Requirement 38
Products support create, edit, and delete.

### Requirement 39
Each product has its own configurable low_stock_threshold.

### Requirement 40
Validate: price ≥ 0, stock ≥ 0, threshold ≥ 0.

### Requirement 41
Display stock in red when it falls below the product's own threshold.

### Requirement 42
Admin can delete products (hard delete).

### Requirement 43
Manager can delete products (hard delete).

### Requirement 44
Vendors page has a list with pagination.

### Requirement 45
Vendors support create and edit.

### Requirement 46
Deleting a vendor is a soft delete — set deleted_at = datetime('now') instead of removing the row.

### Requirement 47
When any soft-deleted vendors exist, show a "Recycle Bin (N)" badge link in the page header.

### Requirement 48
The recycle bin (/vendors/recycle-bin) lists soft-deleted vendors with the date they were deleted and a Restore button that sets deleted_at = NULL.

### Requirement 49
Sales Orders page has a list with pagination.

### Requirement 50
Create an order by selecting a customer and adding line items (product, quantity, unit price).

### Requirement 51
Store created_by from the session at creation time.

### Requirement 52
Confirm an order inside a single SQLite transaction: validate stock for each item, deduct stock, mark the order confirmed, and auto-generate exactly one invoice due 15 days from now.

### Requirement 53
Purchase Orders page has a list with pagination.

### Requirement 54
Create purchase orders with line items.

### Requirement 55
Receive a PO: increment stock for each item inside a transaction and mark the PO received.

### Requirement 56
Invoices page has a list with pagination.

### Requirement 57
Invoices are auto-generated when a sales order is confirmed.

### Requirement 58
Record payments using a form; accepted methods are Cash and Bank Transfer only.

### Requirement 59
After every payment, recalculate payment_status from SUM(amount) — not an incremental delta — so the status is always consistent.

### Requirement 60
Manual status override also available.

### Requirement 61
Monthly Sales Report is a table grouped by month: invoice count, total billed, amount collected, and outstanding balance.

### Requirement 62
Date range filter using a plain HTML GET form with <input type="month"> fields (no client-side JavaScript needed).

### Requirement 63
Staff see only invoices linked to orders they created.

### Requirement 64
Managers see all reports.

### Requirement 65
Admins see all reports.

### Requirement 66
Export to Excel (.xlsx) only via a route handler at /reports/export.

### Requirement 67
Apply SheetJS currency formatting to monetary columns.

### Requirement 68
When a date filter is active, include the range in the exported filename.

### Requirement 69
Audit Log is a paginated table.

### Requirement 70
Write an entry for order_confirmed (details: customer name, order total), invoice_generated (details: order ID, invoice total, due date), and payment_recorded (details: payment amount, method, resulting status).

### Requirement 71
Each entry stores the event type, entity name, entity ID, JSON details, the acting user's ID, the acting user's username (denormalized), and the exact UTC timestamp via datetime('now').

### Requirement 72
Display with color-coded event badges, clickable links to the source order or invoice, a human-readable detail summary, the username, and the full timestamp.

### Requirement 73
Add comments only where the why is non-obvious: business rules, race-condition guards, transaction boundaries, denormalization rationale; do not describe what the code already expresses through naming.

### Requirement 74
Validate inputs at Server Action boundaries only; trust internal framework guarantees elsewhere.

### Requirement 75
Build dynamic WHERE clauses using a conditions array and a params array, so Staff scoping and date range filters compose cleanly without string concatenation.
