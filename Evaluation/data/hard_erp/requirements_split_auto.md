# hard_erp — Automatic Atomic Requirement Split

> **How this was produced.** The `DECOMP_SYS` decomposition prompt of
> `src/decompose_prompts.py` (Claimify decomposition stage, candidate mode) applied to
> `data/hard_erp/ground_truth.md`. The consolidated prose is split into sentences, then
> each sentence is decomposed into the simplest self-contained atomic requirements under
> the granularity rules (permissions per role×object; compound actions/side-effects
> split; enumerations kept as one set; verbatim words, no paraphrase, **no typo
> normalization**; back-references resolved in [brackets]).
>
> Because the metered API is unavailable ($0 credit), the LLM step was run by an LLM
> (Opus) applying `DECOMP_SYS` directly, not the trivial `mock` backend. Candidate mode
> carries **no provenance** (no source-prompt tags) and does **not** re-resolve
> conflicts — both are manual-only steps in `requirements_split.md`. Compare against the
> hand-built `../../../requirements_split.md`.

### Requirement 1

Create a simple ERP web application for a small business with a clean foundation that can be gradually expanded.

### Requirement 2

Implement customer management with create, edit, delete, and browse operations.

### Requirement 3

Add vendor management that works similarly to customer management, with create, edit, delete, and browse operations.

### Requirement 4

Instead of permanently deleting vendors, move deleted vendors to a recycle bin so they can be restored later.

### Requirement 5

Only vendors use the recycle bin.

### Requirement 6

Customers and products continue using permanent deletion based on the user's permissions.

### Requirement 7

Add products.

### Requirement 8

Each product must have a name, SKU, price, and current stock quantity.

### Requirement 9

Each product uses a single stock quantity.

### Requirement 10

Each product haves its own configurable low-stock threshold.

### Requirement 11

Product prices and stock quantities must not allow negative values.

### Requirement 12

Use a top navigation bar containing Dashboard, Customers, and Products.

### Requirement 13

The dashboard should display the total number of customers and products.

### Requirement 14

The dashboard should show products whose stock is below their configured low-stock threshold.

### Requirement 15

The dashboard should have a clean and professional appearance.

### Requirement 16

Implement sales orders.

### Requirement 17

A sales order should belong to one customer.

### Requirement 18

A sales order should contain one or more products with quantities.

### Requirement 19

The total amount must be calculated automatically from the selected products and quantities.

### Requirement 20

Users must not be able to confirm a sales order if any item does not have enough stock available.

### Requirement 21

When a sales order is confirmed, automatically reduce product stock.

### Requirement 22

When a sales order is confirmed, [automatically] generate an invoice.

### Requirement 23

When a sales order is confirmed, [automatically] record an audit log entry.

### Requirement 24

Implement purchase orders for restocking inventory.

### Requirement 25

When a purchase order is marked as received, automatically increase product stock.

### Requirement 26

Invoice should have a due date 15 days after they are created.

### Requirement 27

Invoice [should] use these three payment statuses Unpaid, Partially Paid, and Paid.

### Requirement 28

Users must be able to record payments against invoices.

### Requirement 29

Support payment methods Cash and Bank Transfer.

### Requirement 30

Recording a payment must create an audit log entry.

### Requirement 31

Support user roles Admin, Manager, and Staff.

### Requirement 32

Staff users shouldn't be allowed to delete customers.

### Requirement 33

Staff users shouldn't be allowed to delete products.

### Requirement 34

Staff users should only be able to view reports they created themselves.

### Requirement 35

Admin users should be able to delete customers.

### Requirement 36

Admin users should be able to delete products.

### Requirement 37

Manager users should be able to delete customers.

### Requirement 38

Manager users should be able to delete products.

### Requirement 39

Admin [users] can view all reports.

### Requirement 40

Manager [users] can view all reports.

### Requirement 41

Managers must not be allowed to manage user accounts.

### Requirement 42

Add a monthly sales report showing total sales for each month.

### Requirement 43

Keep the monthly sales numbers in a table.

### Requirement 44

Add an export feature that generates a Excel (.xlsx) file.

### Requirement 45

Allow users to filter the report by a custom date range.

### Requirement 46

Add pagination to the customer, product, vendor, sales order, purchase order, and invoice list pages.

### Requirement 47

Add a search bar so users can quickly find customers and products by name.

### Requirement 48

Implement an audit log that records whenever a sales order is confirmed, an invoice is generated, or a payment is recorded.

### Requirement 49

Each audit log entry must include the user who performed the action.

### Requirement 50

Each audit log entry must include the exact date and time it occurred.

### Requirement 51

Clean up the overall code structure where appropriate.

### Requirement 52

Add comments explaining the main business logic.
