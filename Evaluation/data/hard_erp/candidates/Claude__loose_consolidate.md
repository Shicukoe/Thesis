Build a small business ERP web app using Next.js 16 (App Router), SQLite via better-sqlite3, and Tailwind CSS.

Tech stack

- Auth: iron-session for encrypted cookie sessions, bcryptjs for password hashing
- Database: better-sqlite3 synchronous driver, WAL mode, foreign keys enforced
- Excel export: xlsx (SheetJS)

---
Authentication

- Login/logout pages. Middleware redirects unauthenticated users to /login using a cookie-presence check only (full iron-session decryption is unavailable on the Edge runtime).
- Seed one default Admin account on first run: username admin, password admin123.
- Three roles: Admin, Manager, Staff.
  - Admin: full access, including managing user accounts.
  - Manager: same as Admin except cannot manage user accounts.
  - Staff: cannot delete customers or products; on the sales report, sees only invoices for orders they personally created.
- Extract a shared canDeleteRecords(user) helper that returns true for Admin and Manager, used wherever delete permissions are checked.

---
Database schema

Tables: customers, products, orders, order_items, vendors, purchase_orders, purchase_order_items, invoices, invoice_payments, users, audit_logs.

Key fields:
- products: price, stock, low_stock_threshold (configurable per product, default 10)
- orders: created_by (FK → users, for Staff report scoping), status (pending / confirmed)
- invoices: due_date (15 days from issue date), payment_status (Unpaid / Partially Paid / Paid)
- invoice_payments: payment_method (Cash or Bank Transfer)
- vendors: deleted_at TEXT (NULL = active; a timestamp = soft-deleted)
- audit_logs: event, entity, entity_id, details (JSON string), user_id, username (denormalized), created_at

Use PRAGMA table_info() migration guards for every column added to an already-existing table so the database is upgraded

---
Shared utilities

- lib/constants.ts: PAGE_SIZE = 20, imported by every list page.
- lib/session.ts: SessionUser type (userId, username, role), getSession(), and canDeleteRecords(user).
- lib/audit.ts: logEvent(db, event, entity, entityId, details, userId, username) helper called from any Server Action that needs to write an audit entry.
- components/Pagination.tsx: Server component with smart ellipsis — shows all page numbers when ≤ 7, otherwise shows first page, and last. Preserves the q search param in page links.
- components/SearchBar.tsx: Client component using useRouter.replace, with a clear (×) button.
- components/Navbar.tsx: Client component showing nav links, username, a role badge (indigo = Admin, amber = Manager, gray = Staff), and a sign-out button. Hidden on the login page.

---
Pages

Dashboard (/)

Clean, professional design. Four stat cards: Total Customers, Total Products, Pending Orders, and Outstanding invoice val every product where stock < low_stock_threshold, sorted by stock ascending.

Customers (/customers)

List with name search and pagination. Create, edit, and delete. Only Admin and Manager can delete (hard delete, enforced via canDeleteRecords).

Products / Inventory (/inventory)

List with name search and pagination. Create, edit, and delete. Each product has its own configurable low_stock_threshold. Validate: price ≥ 0, stock ≥ 0, threshold ≥ 0. Display stock in red when it falls below the product's own threshold. Only Admin and Manager can
delete (hard delete).

Vendors (/vendors)

List with pagination. Create and edit. Deleting a vendor is a soft delete — set deleted_at = datetime('now') instead of removing the row. When any soft-deleted vendors exist, show a "Recycle Bin (N)" badge link in the page header.

Recycle bin (/vendors/recycle-bin): Lists soft-deleted vendors with the date they were deleted and a Restore button that sets deleted_at = NULL.
                                                                                                                                                                                                                                                                               Sales Orders (/orders)

List with pagination. Create an order by selecting a customer and adding line items (product, quantity, unit price). Store created_by from the session at creation time. Confirm an order inside a single SQLite transaction: validate stock for each item, deduct stock, mark the order confirmed, and auto-generate exactly one invoice due 15 days from now.

Purchase Orders (/purchases)

List with pagination. Create purchase orders with line items. Receive a PO: increment stock for each item inside a transaction and mark the PO received.

Invoices (/invoices)

List with pagination. Auto-generated when a sales order is confirmed. Record payments using a form; accepted methods are Cash and Bank Transfer only. After every payment, recalculate payment_status from SUM(amount) — not an incremental delta — so the status is always
consistent. Manual status override also available.

Monthly Sales Report (/reports)

Table grouped by month: invoice count, total billed, amount collected, and outstanding balance. Date range filter using a plain HTML GET form with <input type="month"> fields (no client-side JavaScript needed). Staff see only invoices linked to orders they created; Managers and Admins see all. Export to Excel (.xlsx) only via a route handler at /reports/export. Apply SheetJS currency formatting to monetary columns. When a date filter is active, include the range in the exported filename.

Audit Log (/audit-log)

Paginated table. Write an entry for each of these events:

- order_confirmed — details: customer name, order total
- invoice_generated — details: order ID, invoice total, due date
- payment_recorded — details: payment amount, method, resulting status

Each entry stores the event type, entity name, entity ID, JSON details, the acting user's ID, the acting user's username (denormalized so the record stays readable if the account is later deleted), and the exact UTC timestamp via datetime('now').

Display with color-coded event badges, clickable links to the source order or invoice, a human-readable detail summary, the username, and the full timestamp.

---
Code quality

- Add comments only where the why is non-obvious: business rules, race-condition guards, transaction boundaries, denormalization rationale. Do not describe what the code already expresses through naming.
- Validate inputs at Server Action boundaries only; trust internal framework guarantees elsewhere.
- Build dynamic WHERE clauses using a conditions array and a params array, so Staff scoping and date range filters compose cleanly without string concatenation.