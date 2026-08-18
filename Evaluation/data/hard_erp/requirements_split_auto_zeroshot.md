# hard_erp — Automatic Atomic Requirement Split (ZERO-SHOT)

> **Config.** Same `DECOMP_SYS` core + FIDELITY block as `requirements_split_auto.md`,
> but with the **few-shot examples removed** and the **4 granularity rules removed**.
> Only "split into the simplest self-contained atomic requirements, reuse exact words,
> edits only in [brackets]" remains. With no enumeration-merge rule, every list (module
> operations, product attributes, payment statuses/methods, roles, pagination pages,
> audit events, etc.) is split per item.
>
> Purpose: show that the closeness of `requirements_split_auto.md` to the manual
> `../../../requirements_split.md` (52 vs 52) came from the author's granularity policy,
> not the LLM. Compound actions still split (that follows from "atomic" alone); the
> divergence is almost entirely enumeration over-splitting. Run by an LLM (Opus)
> applying the zero-shot prompt directly (metered API unavailable, $0 credit).

### Requirement 1

Create a simple ERP web application for a small business with a clean foundation that can be gradually expanded.

### Requirement 2

Implement customer management with [a] create operation.

### Requirement 3

Implement customer management with [an] edit operation.

### Requirement 4

Implement customer management with [a] delete operation.

### Requirement 5

Implement customer management with [a] browse operation.

### Requirement 6

Add vendor management that works similarly to customer management.

### Requirement 7

[Vendor management has a] create operation.

### Requirement 8

[Vendor management has an] edit operation.

### Requirement 9

[Vendor management has a] delete operation.

### Requirement 10

[Vendor management has a] browse operation.

### Requirement 11

Instead of permanently deleting vendors, move deleted vendors to a recycle bin.

### Requirement 12

[Deleted vendors in the recycle bin] can be restored later.

### Requirement 13

Only vendors use the recycle bin.

### Requirement 14

Customers [continue using permanent deletion based on the user's permissions].

### Requirement 15

Products continue using permanent deletion based on the user's permissions.

### Requirement 16

Add products.

### Requirement 17

Each product must have a name.

### Requirement 18

Each product must have a SKU.

### Requirement 19

Each product must have a price.

### Requirement 20

Each product must have a current stock quantity.

### Requirement 21

Each product uses a single stock quantity.

### Requirement 22

Each product haves its own configurable low-stock threshold.

### Requirement 23

Product prices must not allow negative values.

### Requirement 24

[Product] stock quantities must not allow negative values.

### Requirement 25

Use a top navigation bar.

### Requirement 26

[The top navigation bar contains] Dashboard.

### Requirement 27

[The top navigation bar contains] Customers.

### Requirement 28

[The top navigation bar contains] Products.

### Requirement 29

The dashboard should display the total number of customers.

### Requirement 30

The dashboard should display the total number of products.

### Requirement 31

The dashboard should show products whose stock is below their configured low-stock threshold.

### Requirement 32

The dashboard should have a clean and professional appearance.

### Requirement 33

Implement sales orders.

### Requirement 34

A sales order should belong to one customer.

### Requirement 35

A sales order should contain one or more products with quantities.

### Requirement 36

The total amount must be calculated automatically from the selected products and quantities.

### Requirement 37

Users must not be able to confirm a sales order if any item does not have enough stock available.

### Requirement 38

When a sales order is confirmed, automatically reduce product stock.

### Requirement 39

When a sales order is confirmed, [automatically] generate an invoice.

### Requirement 40

When a sales order is confirmed, [automatically] record an audit log entry.

### Requirement 41

Implement purchase orders for restocking inventory.

### Requirement 42

When a purchase order is marked as received, automatically increase product stock.

### Requirement 43

Invoice should have a due date 15 days after they are created.

### Requirement 44

Invoice [should] use the payment status Unpaid.

### Requirement 45

Invoice [should] use the payment status Partially Paid.

### Requirement 46

Invoice [should] use the payment status Paid.

### Requirement 47

Users must be able to record payments against invoices.

### Requirement 48

Support [the] payment method Cash.

### Requirement 49

Support [the] payment method Bank Transfer.

### Requirement 50

Recording a payment must create an audit log entry.

### Requirement 51

Support [the] user role Admin.

### Requirement 52

Support [the] user role Manager.

### Requirement 53

Support [the] user role Staff.

### Requirement 54

Staff users shouldn't be allowed to delete customers.

### Requirement 55

Staff users shouldn't be allowed to delete products.

### Requirement 56

Staff users should only be able to view reports they created themselves.

### Requirement 57

Admin users should be able to delete customers.

### Requirement 58

Admin users should be able to delete products.

### Requirement 59

Manager users should be able to delete customers.

### Requirement 60

Manager users should be able to delete products.

### Requirement 61

Admin [users] can view all reports.

### Requirement 62

Manager [users] can view all reports.

### Requirement 63

Managers must not be allowed to manage user accounts.

### Requirement 64

Add a monthly sales report showing total sales for each month.

### Requirement 65

Keep the monthly sales numbers in a table.

### Requirement 66

Add an export feature that generates a Excel (.xlsx) file.

### Requirement 67

Allow users to filter the report by a custom date range.

### Requirement 68

Add pagination to the customer list page.

### Requirement 69

Add pagination to the product list page.

### Requirement 70

Add pagination to the vendor list page.

### Requirement 71

Add pagination to the sales order list page.

### Requirement 72

Add pagination to the purchase order list page.

### Requirement 73

Add pagination to the invoice list page.

### Requirement 74

Add a search bar so users can quickly find customers by name.

### Requirement 75

Add a search bar so users can quickly find products by name.

### Requirement 76

Implement an audit log that records whenever a sales order is confirmed.

### Requirement 77

Implement an audit log that records whenever an invoice is generated.

### Requirement 78

Implement an audit log that records whenever a payment is recorded.

### Requirement 79

Each audit log entry must include the user who performed the action.

### Requirement 80

Each audit log entry must include the exact date and time it occurred.

### Requirement 81

Clean up the overall code structure where appropriate.

### Requirement 82

Add comments explaining the main business logic.
