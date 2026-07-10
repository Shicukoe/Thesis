<!-- Paste the Claude "basic_prompt" master prompt for hard_erp here. This comment line is ignored by the scorer; the file is skipped until you paste real text. -->
Build a small business ERP web app using Next.js 16 (App Router), SQLite via better-sqlite3, and Tailwind CSS v4.

Tech stack

- Auth: iron-session for encrypted cookie sessions, bcryptjs for password hashing
- Database: better-sqlite3 synchronous driver, WAL mode, foreign keys enforced
- Excel export: xlsx (SheetJS)
- Styling: Tailwind CSS v4

---
Authentication & roles

- Login/logout pages. Middleware redirects to /login if the session cookie is absent (cookie-presence check only — no full decryption on Edge runtime).
- Seed one default Admin account on first run: admin / admin123.
- Three roles: Admin, Manager, Staff.
  - Admin: full access including user account management.
  - Manager: same as Admin except cannot manage user accounts.
  - Staff: cannot delete customers or products; reports are scoped to their own orders only.
- Extract a canDeleteRecords(user) helper that returns true for Admin and Manager.

---
Database schema

Tables: customers, products, orders, order_items, vendors, purchase_orders, purchase_order_items, invoices, invogs.

Key columns:
- products: stock, low_stock_threshold (configurable per product, default 10)
- orders: created_by (FK to users, for Staff report scoping)
- invoices: due_date (15 days from issue), payment_status (Unpaid / Partially Paid / Paid)
- invoice_payments: payment_method (Cash or Bank Transfer — no credit card)
- vendors: deleted_at TEXT (soft delete)
- audit_logs: event, entity, entity_id, details (JSON), user_id, username (denormalized), created_at

Use PRAGMA table_info() migration guards for all new columns so existing databases are upgraded without data los

---
Pages & features

Dashboard (/)

Clean, professional design. Four stat cards (Total Customers, Total Products, Pending Orders, Outstanding invoice value). A low-stock table showing products where stock < low_stock_threshold, ordered by stock ascending.

Customers (/customers)

List with name search, pagination. Create/edit/delete. Only Admin and Manager can delete (hard delete).                                                                                                                                                
Products / Inventory (/inventory)

List with name search, pagination. Create/edit/delete. Validate: price ≥ 0, stock ≥ 0, low-stock threshold ≥ 0. Only Admin and Manager can delete (hard delete). Stock shown in red when below the product's threshold.

Vendors (/vendors)

List with pagination. Create/edit. Soft delete only — clicking Delete stamps deleted_at = datetime('now') instead of removing the row. Show a "Recycle Bin (N)" badge in the header whenever deleted vendors exist. The recycle bin page (/vendors/recycle-bin) lists deleted vendors with their deletion date and a Restore button that clears deleted_at.

Sales Orders (/orders)

List with pagination. Create orders (select customer + add line items with quantity and unit price). Confirm order: inside a single SQLite transaction, validate stock, deduct stock for each item, mark order confirmed, and auto-generate exactly oneinvoice (due 15 days from now). Store created_by from the session on creation.

Purchase Orders (/purchases)                                                                                                                                                                                                                           
List with pagination. Create purchase orders. Receive a PO: increment product stock inside a transaction, mark PO received.
                                                                                                                                                                                                                                                       Invoices (/invoices)

List with pagination. Auto-generated when an order is confirmed. Record payments (Cash or Bank Transfer). Payment status recalculated from SUM(amount) — not a delta — so it stays consistent if records are edited later. Manual status override also available. Due date shown; overdue invoices highlighted.

Monthly Sales Report (/reports)

Table by month: invoice count, total billed, collected, outstanding. Date range filter using plain <input type="month"> GET form (no client JS needed). Staff see only invoices linked to orders they created; Managers and Admins see all. Export to Excel
(.xlsx) only via a route handler at /reports/export. Filename includes the date range when a filter is active. Sd to monetary columns.

Audit Log (/audit-log)

Paginated table of business events. Record an entry for:
1. order_confirmed — details: customer name, order total
2. invoice_generated — details: order ID, invoice total, due date
3. payment_recorded — details: amount, payment method, resulting status

Each entry stores the acting user's ID and username (denormalized), and the exact UTC timestamp via SQLite datetime('now'). Display with color-coded event badges (Indigo / Blue / Green), clickable links to the source order or invoice, a human-readable
detail summary, the username, and the timestamp.

User Management (/users) — Admin only

Create and manage user accounts. Accessible only to Admin role.

---
Shared components & utilities

- lib/constants.ts: PAGE_SIZE = 20 imported by all list pages.
- lib/session.ts: SessionUser type, canDeleteRecords(user) helper, getSession().
- lib/audit.ts: logEvent(db, event, entity, entityId, details, userId, username) helper used by order and invoice actions.
- components/Pagination.tsx: Server component. Smart ellipsis (show all pages ≤ 7, else show first, window aroun (search) param in page links.
- components/SearchBar.tsx: Client component with useRouter.replace and a clear (×) button.
- components/Navbar.tsx: Client component. Shows nav links, username, role badge (indigo = Admin, amber = Manager, gray = Staff), and sign-out button. Nav links: Dashboard, Customers, Vendors, Products, Invoices, Purchases, Reports, Audit Log.

---
Code quality

- Add comments only where the why is non-obvious: business rules, race-condition guards, transaction boundaries, denormalization rationale.
- Do not comment what the code already clearly expresses.
- No negative price, stock, or threshold values allowed — validate in Server Actions before writing to the datab
- Dynamic WHERE clause building using a conditions array and a params array to compose Staff scoping and date filters cleanly.