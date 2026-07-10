const app = document.querySelector("#app");
const { activities, business, inventory, metrics, moduleData, modules, orders } = window.ERP_DATA;

// Storage keys keep this frontend-only prototype persistent without a backend.
const customerStorageKey = "erp.customers.v1";
const vendorStorageKey = "erp.vendors.v1";
const productStorageKey = "erp.products.v1";
const salesOrderStorageKey = "erp.salesOrders.v1";
const invoiceStorageKey = "erp.invoices.v1";
const purchaseOrderStorageKey = "erp.purchaseOrders.v1";
const auditLogStorageKey = "erp.auditLog.v1";
const roleStorageKey = "erp.currentRole.v1";
const pageSize = 10;

// Application state is intentionally centralized until the app grows into modules.
let activeModule = "dashboard";
let currentRole = loadCurrentRole();
let customers = loadCustomers();
let vendors = loadVendors();
let products = loadProducts();
let salesOrders = loadSalesOrders();
let invoices = loadInvoices();
let purchaseOrders = loadPurchaseOrders();
let auditLog = loadAuditLog();
ensureInvoicesForConfirmedSalesOrders();
ensureInvoiceDueDates();
ensureInvoicePaymentStatuses();
let customerSearch = "";
let vendorSearch = "";
let productSearch = "";
let salesOrderSearch = "";
let invoiceSearch = "";
let purchaseOrderSearch = "";
let reportStartDate = "";
let reportEndDate = "";
let listPagination = {
  customers: 1,
  vendors: 1,
  products: 1,
  salesOrders: 1,
  invoices: 1,
  purchaseOrders: 1,
};
let editingCustomerId = null;
let editingVendorId = null;
let editingProductId = null;
let editingSalesOrderId = null;
let editingPurchaseOrderId = null;
let recordingPaymentInvoiceId = null;
let restoreCustomerSearchFocus = false;
let restoreVendorSearchFocus = false;
let restoreProductSearchFocus = false;
let restoreSalesOrderSearchFocus = false;
let restoreInvoiceSearchFocus = false;
let restorePurchaseOrderSearchFocus = false;

// Data loading and normalization

function loadCustomers() {
  try {
    const stored = localStorage.getItem(customerStorageKey);
    return stored ? JSON.parse(stored) : structuredClone(window.ERP_DATA.customers);
  } catch (error) {
    return structuredClone(window.ERP_DATA.customers);
  }
}

function saveCustomers() {
  localStorage.setItem(customerStorageKey, JSON.stringify(customers));
}

function loadVendors() {
  try {
    const stored = localStorage.getItem(vendorStorageKey);
    return normalizeVendors(stored ? JSON.parse(stored) : structuredClone(window.ERP_DATA.vendors));
  } catch (error) {
    return normalizeVendors(structuredClone(window.ERP_DATA.vendors));
  }
}

function saveVendors() {
  localStorage.setItem(vendorStorageKey, JSON.stringify(vendors));
}

function normalizeVendors(vendorList) {
  // Vendor deletion is reversible; older records are active until moved to the recycle bin.
  return vendorList.map((vendor) => ({
    ...vendor,
    deletedAt: vendor.deletedAt || null,
  }));
}

function loadProducts() {
  try {
    const stored = localStorage.getItem(productStorageKey);
    return normalizeProducts(stored ? JSON.parse(stored) : structuredClone(window.ERP_DATA.products));
  } catch (error) {
    return normalizeProducts(structuredClone(window.ERP_DATA.products));
  }
}

function saveProducts() {
  localStorage.setItem(productStorageKey, JSON.stringify(products));
}

function normalizeProductStock(productList) {
  let oldBalances = [];
  try {
    oldBalances = JSON.parse(localStorage.getItem("erp.inventoryBalances.v1") || "[]");
  } catch (error) {
    oldBalances = [];
  }

  return productList.map((product) => {
    if (Number.isFinite(Number(product.stock))) {
      return product;
    }

    const stock = oldBalances
      .filter((balance) => balance.productId === product.id)
      .reduce((total, balance) => total + Number(balance.quantity || 0), 0);

    return { ...product, stock };
  });
}

function normalizeProducts(productList) {
  // Older product records did not have per-product thresholds, so default them.
  return normalizeProductStock(productList).map((product) => ({
    ...product,
    lowStockThreshold: Number.isFinite(Number(product.lowStockThreshold)) ? Number(product.lowStockThreshold) : 10,
  }));
}

function loadSalesOrders() {
  try {
    const stored = localStorage.getItem(salesOrderStorageKey);
    return normalizeSalesOrders(stored ? JSON.parse(stored) : structuredClone(window.ERP_DATA.salesOrders));
  } catch (error) {
    return normalizeSalesOrders(structuredClone(window.ERP_DATA.salesOrders));
  }
}

function saveSalesOrders() {
  localStorage.setItem(salesOrderStorageKey, JSON.stringify(salesOrders));
}

function normalizeSalesOrders(orderList) {
  // Older orders did not track ownership, so assign them to the current workspace user.
  return orderList.map((order) => ({
    ...order,
    createdBy: order.createdBy || business.user,
  }));
}

function loadInvoices() {
  try {
    const stored = localStorage.getItem(invoiceStorageKey);
    return stored ? JSON.parse(stored) : structuredClone(window.ERP_DATA.invoices || []);
  } catch (error) {
    return structuredClone(window.ERP_DATA.invoices || []);
  }
}

function saveInvoices() {
  localStorage.setItem(invoiceStorageKey, JSON.stringify(invoices));
}

function loadCurrentRole() {
  try {
    const stored = localStorage.getItem(roleStorageKey);
    return getUserRoles().includes(stored) ? stored : "Admin";
  } catch (error) {
    return "Admin";
  }
}

function saveCurrentRole() {
  localStorage.setItem(roleStorageKey, currentRole);
}

function loadPurchaseOrders() {
  try {
    const stored = localStorage.getItem(purchaseOrderStorageKey);
    return stored ? JSON.parse(stored) : structuredClone(window.ERP_DATA.purchaseOrders);
  } catch (error) {
    return structuredClone(window.ERP_DATA.purchaseOrders);
  }
}

function savePurchaseOrders() {
  localStorage.setItem(purchaseOrderStorageKey, JSON.stringify(purchaseOrders));
}

function loadAuditLog() {
  try {
    const stored = localStorage.getItem(auditLogStorageKey);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
}

function saveAuditLog() {
  localStorage.setItem(auditLogStorageKey, JSON.stringify(auditLog));
}

const icons = {
  grid: "#",
  receipt: "=",
  invoice: "IV",
  boxes: "[]",
  tag: "%",
  truck: ">",
  wallet: "$",
  users: "@",
  vendor: "&",
  badge: "*",
};

// App shell and module routing

function render() {
  const current = modules.find((module) => module.id === activeModule);

  app.innerHTML = `
    <header class="app-header">
      <div class="brand">
        <span class="brand-mark">N</span>
        <div>
          <strong>${business.name}</strong>
          <span>ERP Workspace</span>
        </div>
      </div>
      <nav class="nav" aria-label="Main modules">
        ${modules.map(renderNavItem).join("")}
      </nav>
      <div class="user-chip" aria-label="Current user">
        <span class="user-avatar">${business.user.split(" ").map((part) => part[0]).join("")}</span>
        <div class="user-meta">
          <strong>${business.user}</strong>
          <label>
            <span>Role</span>
            <select id="role-selector" aria-label="Current role">
              ${getUserRoles().map((role) => `<option value="${role}" ${currentRole === role ? "selected" : ""}>${role}</option>`).join("")}
            </select>
          </label>
        </div>
      </div>
    </header>
    <main class="main">
      <header class="topbar">
        <div>
          <p class="eyebrow">${business.period}</p>
          <h1>${current.title}</h1>
          <p>${current.summary}</p>
        </div>
      </header>
      ${renderActiveModule(current)}
    </main>
  `;

  app.querySelectorAll("[data-module]").forEach((button) => {
    button.addEventListener("click", () => {
      activeModule = button.dataset.module;
      resetEditingState();
      render();
    });
  });

  const roleSelector = app.querySelector("#role-selector");
  roleSelector.addEventListener("change", (event) => {
    currentRole = event.target.value;
    saveCurrentRole();
    render();
  });
  bindPaginationEvents();

  if (activeModule === "customers") {
    bindCustomerEvents();
  }

  if (activeModule === "vendors") {
    bindVendorEvents();
  }

  if (activeModule === "products") {
    bindProductEvents();
  }

  if (activeModule === "sales-orders") {
    bindSalesOrderEvents();
  }

  if (activeModule === "invoices") {
    bindInvoiceEvents();
  }

  if (activeModule === "purchase-orders") {
    bindPurchaseOrderEvents();
  }

  if (activeModule === "reports") {
    bindReportEvents();
  }
}

function renderActiveModule(current) {
  const renderers = {
    dashboard: renderDashboard,
    customers: renderCustomers,
    vendors: renderVendors,
    products: renderProducts,
    "sales-orders": renderSalesOrders,
    invoices: renderInvoices,
    "purchase-orders": renderPurchaseOrders,
    reports: renderReports,
  };

  return renderers[activeModule] ? renderers[activeModule]() : renderModule(current);
}

function resetEditingState() {
  editingCustomerId = null;
  editingVendorId = null;
  editingProductId = null;
  editingSalesOrderId = null;
  editingPurchaseOrderId = null;
  recordingPaymentInvoiceId = null;
}

function renderNavItem(module) {
  const isActive = module.id === activeModule;
  return `
    <button class="nav-item ${isActive ? "active" : ""}" data-module="${module.id}" type="button">
      <span class="nav-icon" aria-hidden="true">${icons[module.icon]}</span>
      <span>${module.label}</span>
    </button>
  `;
}

// Dashboard

function renderDashboard() {
  const lowStockProducts = getLowStockProducts();
  return `
    <section class="dashboard-overview">
      <div>
        <span class="section-kicker">Today</span>
        <h2>Business Snapshot</h2>
        <p>Key records and inventory exceptions for the current workspace.</p>
      </div>
      <div class="overview-pill ${lowStockProducts.length ? "warn-bg" : "good-bg"}">
        ${lowStockProducts.length ? `${lowStockProducts.length.toLocaleString()} low-stock item${lowStockProducts.length === 1 ? "" : "s"}` : "Inventory healthy"}
      </div>
    </section>
    <section class="metric-grid dashboard-counts" aria-label="Business totals">
      <article class="metric-card accent-card">
        <span>Total Customers</span>
        <strong>${customers.length.toLocaleString()}</strong>
        <small>Active customer records</small>
      </article>
      <article class="metric-card">
        <span>Total Products</span>
        <strong>${products.length.toLocaleString()}</strong>
        <small>Catalog items tracked</small>
      </article>
      <article class="metric-card">
        <span>Total Vendors</span>
        <strong>${getActiveVendors().length.toLocaleString()}</strong>
        <small>Supplier accounts</small>
      </article>
    </section>
    ${renderLowStockPanel(lowStockProducts)}
    ${renderAuditLogPanel()}
  `;
}

function renderLowStockPanel(lowStockProducts) {
  return `
    <section class="panel full dashboard-panel">
      <div class="panel-heading">
        <div>
          <h2>Low-Stock Products</h2>
          <p>Products below their configured low-stock threshold.</p>
        </div>
        <span class="status-pill ${lowStockProducts.length ? "danger-bg" : "good-bg"}">${lowStockProducts.length.toLocaleString()} flagged</span>
      </div>
      ${lowStockProducts.length ? `
        <div class="stock-list">
          ${lowStockProducts.map(renderLowStockProduct).join("")}
        </div>
      ` : `
        <div class="empty-state compact">
          <strong>No low-stock products</strong>
          <p>All products are at or above their configured threshold.</p>
        </div>
      `}
    </section>
  `;
}

function renderLowStockProduct(product) {
  return `
    <div class="stock-item low-stock-item">
      <div>
        <strong>${escapeHtml(product.name)}</strong>
        <span>${escapeHtml(product.sku)}</span>
      </div>
      <div class="stock-meta">
        <span>On Hand</span>
        <strong>${Number(product.stock || 0).toLocaleString()}</strong>
      </div>
      <div class="stock-meta">
        <span>Threshold</span>
        <strong>${Number(product.lowStockThreshold || 0).toLocaleString()}</strong>
      </div>
      <span class="status-pill danger-bg">Low Stock</span>
    </div>
  `;
}

function renderAuditLogPanel() {
  const recentEntries = auditLog.slice(0, 10);

  return `
    <section class="panel full dashboard-panel">
      <div class="panel-heading">
        <div>
          <h2>Audit Log</h2>
          <p>Important sales, invoice, and payment events retained for business review.</p>
        </div>
        <span class="status-pill neutral-bg">${auditLog.length.toLocaleString()} event${auditLog.length === 1 ? "" : "s"}</span>
      </div>
      ${recentEntries.length ? renderAuditLogTable(recentEntries) : `
        <div class="empty-state compact">
          <strong>No audit events yet</strong>
          <p>Confirmed sales orders, generated invoices, and recorded payments will appear here.</p>
        </div>
      `}
    </section>
  `;
}

function renderAuditLogTable(rows) {
  return `
    <div class="table-wrap">
      <table class="customer-table">
        <thead>
          <tr>
            <th>Exact Date and Time</th>
            <th>Event</th>
            <th>User</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((entry) => `
            <tr>
              <td>${escapeHtml(formatDateTime(entry.createdAt))}</td>
              <td><span class="status-pill neutral-bg">${escapeHtml(entry.type)}</span></td>
              <td>
                ${escapeHtml(entry.actor)}
                <span>${escapeHtml(entry.role)}</span>
              </td>
              <td>${escapeHtml(entry.message)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderModule(module) {
  const data = moduleData[module.id];
  const singularLabels = {
    sales: "Sales Order",
    inventory: "Stock Item",
    products: "Product",
    purchasing: "Purchase Order",
    finance: "Finance Entry",
    team: "Team Member",
  };

  return `
    <section class="module-actions">
      <button class="primary-action" type="button">New ${singularLabels[module.id]}</button>
      <button class="secondary-action" type="button">Export</button>
      <button class="secondary-action" type="button">Filters</button>
    </section>
    <section class="panel full">
      <div class="panel-heading">
        <div>
          <h2>${module.title} Register</h2>
          <p>Starter list view wired to sample data.</p>
        </div>
      </div>
      ${renderTable(data.columns, data.rows)}
    </section>
  `;
}

// Module renderers

function renderCustomers() {
  const editingCustomer = customers.find((customer) => customer.id === editingCustomerId);
  const visibleCustomers = getVisibleCustomers();
  const pagedCustomers = getPaginatedRows("customers", visibleCustomers);

  return `
    <section class="customer-layout">
      <article class="panel customer-register">
        <div class="panel-heading customer-heading">
          <div>
            <h2>Customer Register</h2>
            <p>Browse customer accounts, balances, contacts, and status.</p>
          </div>
          <label class="search-field">
            <span>Search</span>
            <input id="customer-search" type="search" value="${escapeAttribute(customerSearch)}" placeholder="Name, contact, email, or phone" />
          </label>
        </div>
        ${visibleCustomers.length ? `${renderCustomerTable(pagedCustomers)}${renderPagination("customers", visibleCustomers.length)}` : renderEmptyCustomers()}
      </article>

      <article class="panel customer-form-panel">
        <div class="panel-heading">
          <div>
            <h2>${editingCustomer ? "Edit Customer" : "Create Customer"}</h2>
            <p>${editingCustomer ? "Update the selected account." : "Add a new customer account."}</p>
          </div>
        </div>
        ${renderCustomerForm(editingCustomer)}
      </article>
    </section>
  `;
}

function renderVendors() {
  const deletedVendors = getDeletedVendors();
  const editingVendor = getActiveVendors().find((vendor) => vendor.id === editingVendorId);
  const visibleVendors = getVisibleVendors();
  const pagedVendors = getPaginatedRows("vendors", visibleVendors);

  return `
    <section class="customer-layout">
      <article class="panel customer-register">
        <div class="panel-heading customer-heading">
          <div>
            <h2>Vendor Register</h2>
            <p>Browse supplier accounts, contacts, terms, and status.</p>
          </div>
          <label class="search-field">
            <span>Search</span>
            <input id="vendor-search" type="search" value="${escapeAttribute(vendorSearch)}" placeholder="Name, contact, email, or phone" />
          </label>
        </div>
        ${visibleVendors.length ? `${renderVendorTable(pagedVendors)}${renderPagination("vendors", visibleVendors.length)}` : renderEmptyVendors()}
      </article>

      <article class="panel customer-form-panel">
        <div class="panel-heading">
          <div>
            <h2>${editingVendor ? "Edit Vendor" : "Create Vendor"}</h2>
            <p>${editingVendor ? "Update the selected supplier." : "Add a new supplier account."}</p>
          </div>
        </div>
        ${renderVendorForm(editingVendor)}
      </article>
    </section>
    ${renderVendorRecycleBin(deletedVendors)}
  `;
}

function renderProducts() {
  const editingProduct = products.find((product) => product.id === editingProductId);
  const visibleProducts = getVisibleProducts();
  const pagedProducts = getPaginatedRows("products", visibleProducts);

  return `
    <section class="customer-layout">
      <article class="panel customer-register">
        <div class="panel-heading customer-heading">
          <div>
            <h2>Product Register</h2>
            <p>Browse catalog items, SKUs, pricing, and stock levels.</p>
          </div>
          <label class="search-field">
            <span>Search</span>
            <input id="product-search" type="search" value="${escapeAttribute(productSearch)}" placeholder="Name or SKU" />
          </label>
        </div>
        ${visibleProducts.length ? `${renderProductTable(pagedProducts)}${renderPagination("products", visibleProducts.length)}` : renderEmptyProducts()}
      </article>

      <article class="panel customer-form-panel">
        <div class="panel-heading">
          <div>
            <h2>${editingProduct ? "Edit Product" : "Create Product"}</h2>
            <p>${editingProduct ? "Update the selected product." : "Add a new catalog item."}</p>
          </div>
        </div>
        ${renderProductForm(editingProduct)}
      </article>
    </section>
  `;
}

function renderSalesOrders() {
  const editingOrder = salesOrders.find((order) => order.id === editingSalesOrderId);
  const visibleOrders = getVisibleSalesOrders();
  const pagedOrders = getPaginatedRows("salesOrders", visibleOrders);

  return `
    <section class="customer-layout">
      <article class="panel customer-register">
        <div class="panel-heading customer-heading">
          <div>
            <h2>Sales Order Register</h2>
            <p>Browse customer orders and product quantities.</p>
          </div>
          <label class="search-field">
            <span>Search</span>
            <input id="sales-order-search" type="search" value="${escapeAttribute(salesOrderSearch)}" placeholder="Order or customer" />
          </label>
        </div>
        ${visibleOrders.length ? `${renderSalesOrderTable(pagedOrders)}${renderPagination("salesOrders", visibleOrders.length)}` : renderEmptySalesOrders()}
      </article>

      <article class="panel customer-form-panel">
        <div class="panel-heading">
          <div>
            <h2>${editingOrder ? "Edit Sales Order" : "Create Sales Order"}</h2>
            <p>${editingOrder ? "Update the selected order." : "Select a customer and add product lines."}</p>
          </div>
        </div>
        ${renderSalesOrderForm(editingOrder)}
      </article>
    </section>
  `;
}

function renderInvoices() {
  const visibleInvoices = getVisibleInvoices();
  const pagedInvoices = getPaginatedRows("invoices", visibleInvoices);

  return `
    <section class="panel full">
      <div class="panel-heading customer-heading">
        <div>
          <h2>Invoice Register</h2>
          <p>Invoices generated when sales orders are confirmed.</p>
        </div>
        <label class="search-field">
          <span>Search</span>
          <input id="invoice-search" type="search" value="${escapeAttribute(invoiceSearch)}" placeholder="Invoice, order, or customer" />
        </label>
      </div>
      ${visibleInvoices.length ? `${renderInvoiceTable(pagedInvoices)}${renderPagination("invoices", visibleInvoices.length)}` : renderEmptyInvoices()}
    </section>
  `;
}

function renderInvoiceTable(rows) {
  return `
    <div class="table-wrap">
      <table class="customer-table">
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Sales Order</th>
            <th>Customer</th>
            <th>Issue Date</th>
            <th>Due Date</th>
            <th>Payment Status</th>
            <th>Amount</th>
            <th>Paid</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((invoice) => renderInvoiceRow(invoice)).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderInvoiceRow(invoice) {
  const paidAmount = getInvoicePaidAmount(invoice);
  const balance = getInvoiceBalance(invoice);
  const isPaid = balance <= 0;

  return `
    <tr>
      <td>
        <strong>${escapeHtml(invoice.id)}</strong>
        ${invoice.payments?.length ? `<span>${invoice.payments.length.toLocaleString()} payment${invoice.payments.length === 1 ? "" : "s"}</span>` : ""}
      </td>
      <td>${escapeHtml(invoice.salesOrderId)}</td>
      <td>${escapeHtml(getCustomerName(invoice.customerId))}</td>
      <td>${escapeHtml(invoice.issueDate)}</td>
      <td>${escapeHtml(invoice.dueDate)}</td>
      <td><span class="status-pill ${getPaymentStatusClass(invoice.paymentStatus)}">${escapeHtml(invoice.paymentStatus)}</span></td>
      <td>${formatMoney(invoice.amount)}</td>
      <td>${formatMoney(paidAmount)}</td>
      <td>${formatMoney(balance)}</td>
      <td>
        <div class="row-actions">
          <button class="secondary-action small" data-record-payment="${invoice.id}" type="button" ${isPaid ? "disabled" : ""}>Record Payment</button>
        </div>
      </td>
    </tr>
    ${recordingPaymentInvoiceId === invoice.id ? renderInvoicePaymentRow(invoice, balance) : ""}
  `;
}

function renderInvoicePaymentRow(invoice, balance) {
  return `
    <tr class="payment-entry-row">
      <td colspan="10">
        <form class="payment-form" data-payment-form="${invoice.id}">
          <label>
            <span>Payment Amount</span>
            <input name="amount" type="number" min="0.01" max="${balance}" step="0.01" value="${balance.toFixed(2)}" required />
          </label>
          <label>
            <span>Payment Date</span>
            <input name="date" type="date" value="${new Date().toISOString().slice(0, 10)}" required />
          </label>
          <label>
            <span>Payment Method</span>
            <select name="method" required>
              ${getPaymentMethods().map((method) => `<option value="${method}">${method}</option>`).join("")}
            </select>
          </label>
          <div class="form-actions">
            <button class="primary-action small" type="submit">Save Payment</button>
            <button class="secondary-action small" data-cancel-payment type="button">Cancel</button>
          </div>
        </form>
      </td>
    </tr>
  `;
}

function renderEmptyInvoices() {
  return `
    <div class="empty-state">
      <strong>No invoices found</strong>
      <p>Confirm a sales order to generate an invoice.</p>
    </div>
  `;
}

function renderPurchaseOrders() {
  const editingOrder = purchaseOrders.find((order) => order.id === editingPurchaseOrderId);
  const visibleOrders = getVisiblePurchaseOrders();
  const pagedOrders = getPaginatedRows("purchaseOrders", visibleOrders);

  return `
    <section class="customer-layout">
      <article class="panel customer-register">
        <div class="panel-heading customer-heading">
          <div>
            <h2>Purchase Order Register</h2>
            <p>Browse supplier restock orders and received quantities.</p>
          </div>
          <label class="search-field">
            <span>Search</span>
            <input id="purchase-order-search" type="search" value="${escapeAttribute(purchaseOrderSearch)}" placeholder="Order or supplier" />
          </label>
        </div>
        ${visibleOrders.length ? `${renderPurchaseOrderTable(pagedOrders)}${renderPagination("purchaseOrders", visibleOrders.length)}` : renderEmptyPurchaseOrders()}
      </article>

      <article class="panel customer-form-panel">
        <div class="panel-heading">
          <div>
            <h2>${editingOrder ? "Edit Purchase Order" : "Create Purchase Order"}</h2>
            <p>${editingOrder ? "Update the selected restock order." : "Choose products and quantities to restock."}</p>
          </div>
        </div>
        ${renderPurchaseOrderForm(editingOrder)}
      </article>
    </section>
  `;
}

function renderReports() {
  const monthlySales = getMonthlySalesReport();
  const hasInvalidRange = isInvalidReportDateRange();
  const reportScope = canViewAllReports() ? "Managers and Admins can view all report data." : "Staff can view only report data they created.";

  return `
    <section class="panel full">
      <div class="panel-heading">
        <div>
          <h2>Monthly Sales Report</h2>
          <p>Total confirmed sales grouped by invoice issue month. Date filters use invoice issue dates. ${reportScope}</p>
        </div>
        <button class="primary-action" id="export-monthly-sales-xlsx" type="button" ${monthlySales.length ? "" : "disabled"}>Export XLSX</button>
      </div>
      ${renderMonthlySalesFilters()}
      ${hasInvalidRange ? renderInvalidMonthlySalesRange() : ""}
      ${monthlySales.length ? renderMonthlySalesTable(monthlySales) : renderEmptyMonthlySalesReport()}
    </section>
  `;
}

function renderMonthlySalesFilters() {
  return `
    <form class="report-filter-bar" id="monthly-sales-filters">
      <label>
        <span>Start Date</span>
        <input name="startDate" type="date" value="${escapeAttribute(reportStartDate)}" />
      </label>
      <label>
        <span>End Date</span>
        <input name="endDate" type="date" value="${escapeAttribute(reportEndDate)}" />
      </label>
      <button class="secondary-action" id="clear-monthly-sales-filters" type="button" ${reportStartDate || reportEndDate ? "" : "disabled"}>Clear</button>
    </form>
  `;
}

function renderMonthlySalesTable(rows) {
  return `
    <div class="table-wrap">
      <table class="customer-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Confirmed Orders</th>
            <th>Total Sales</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td><strong>${escapeHtml(row.monthLabel)}</strong></td>
              <td>${row.orderCount.toLocaleString()}</td>
              <td>${formatMoney(row.totalSales)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderEmptyMonthlySalesReport() {
  return `
    <div class="empty-state">
      <strong>No sales to report</strong>
      <p>${getEmptyMonthlySalesMessage()}</p>
    </div>
  `;
}

function getEmptyMonthlySalesMessage() {
  if (!canViewAllReports()) {
    return isReportDateFiltered()
      ? "No confirmed sales orders created by you match the selected date range."
      : "Confirm sales orders created by you to include them in monthly sales totals.";
  }

  return isReportDateFiltered()
    ? "No confirmed sales orders match the selected date range."
    : "Confirm sales orders to include them in monthly sales totals.";
}

function renderInvalidMonthlySalesRange() {
  return `
    <div class="form-alert">
      Start date must be on or before end date.
    </div>
  `;
}

function renderPurchaseOrderTable(rows) {
  return `
    <div class="table-wrap">
      <table class="customer-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Supplier</th>
            <th>Status</th>
            <th>Lines</th>
            <th>Units</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((order) => `
            <tr>
              <td><strong>${escapeHtml(order.id)}</strong></td>
              <td>${escapeHtml(getVendorName(order.vendorId, order.supplier))}</td>
              <td>
                <span class="status-pill ${order.inventoryApplied ? "good-bg" : "neutral-bg"}">${escapeHtml(order.status)}</span>
                ${order.inventoryApplied ? `<span>Inventory received</span>` : ""}
              </td>
              <td>${order.lines.length.toLocaleString()}</td>
              <td>${getPurchaseOrderUnits(order).toLocaleString()}</td>
              <td>
                <div class="row-actions">
                  <button class="secondary-action small" data-edit-purchase-order="${order.id}" type="button">Edit</button>
                  <button class="danger-action small" data-delete-purchase-order="${order.id}" type="button">Delete</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderPurchaseOrderForm(order) {
  const activeVendors = getActiveVendors();
  if ((!activeVendors.length && !order) || !products.length) {
    return `
      <div class="empty-state">
        <strong>Setup required</strong>
        <p>Create at least one vendor and one product before creating a purchase order.</p>
      </div>
    `;
  }

  const values = {
    vendorId: activeVendors[0]?.id || "",
    status: "Draft",
    lines: [{ productId: products[0]?.id || "", quantity: 1 }],
    ...(order || {}),
  };
  const selectableVendors = getSelectableVendorsForPurchaseOrder(values.vendorId);

  return `
    <form id="purchase-order-form" class="entity-form">
      <div class="form-grid">
        <label>
          <span>Vendor</span>
          <select name="vendorId" required>
            ${selectableVendors.map((vendor) => `
              <option value="${vendor.id}" ${values.vendorId === vendor.id ? "selected" : ""}>${escapeHtml(vendor.name)}</option>
            `).join("")}
          </select>
        </label>
        <label>
          <span>Status</span>
          <select name="status">
            ${["Draft", "Ordered", "Received", "Cancelled"].map((status) => `
              <option value="${status}" ${values.status === status ? "selected" : ""}>${status}</option>
            `).join("")}
          </select>
        </label>
      </div>
      <div class="line-editor">
        <div class="line-editor-heading">
          <h3>Products</h3>
          <button class="secondary-action small" id="add-purchase-line" type="button">Add Line</button>
        </div>
        <div id="purchase-lines" class="order-lines">
          ${values.lines.map((line) => renderPurchaseOrderLine(line)).join("")}
        </div>
        <div class="order-total">
          <span>Total Units</span>
          <strong id="purchase-order-units">${getPurchaseOrderUnits(values).toLocaleString()}</strong>
        </div>
      </div>
      <div class="form-actions">
        <button class="primary-action" type="submit">${order ? "Save Changes" : "Create Purchase Order"}</button>
        ${order ? `<button class="secondary-action" id="cancel-purchase-order-edit" type="button">Cancel</button>` : `<button class="secondary-action" type="reset">Clear</button>`}
      </div>
    </form>
  `;
}

function renderPurchaseOrderLine(line = {}) {
  return `
    <div class="order-line">
      <label>
        <span>Product</span>
        <select name="productId" required>
          ${products.map((product) => `
            <option value="${product.id}" ${line.productId === product.id ? "selected" : ""}>${escapeHtml(product.name)} (${escapeHtml(product.sku)})</option>
          `).join("")}
        </select>
      </label>
      <label>
        <span>Quantity</span>
        <input name="quantity" type="number" min="1" step="1" value="${escapeAttribute(line.quantity || 1)}" required />
      </label>
      <button class="danger-action small remove-purchase-line" type="button">Remove</button>
    </div>
  `;
}

function renderEmptyPurchaseOrders() {
  return `
    <div class="empty-state">
      <strong>No purchase orders found</strong>
      <p>Adjust the search or create a new purchase order.</p>
    </div>
  `;
}

function renderSalesOrderTable(rows) {
  return `
    <div class="table-wrap">
      <table class="customer-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Lines</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((order) => `
            <tr>
              <td><strong>${escapeHtml(order.id)}</strong></td>
              <td>${escapeHtml(getCustomerName(order.customerId))}</td>
              <td>
                <span class="status-pill ${order.inventoryApplied ? "good-bg" : "neutral-bg"}">${escapeHtml(order.status)}</span>
                ${order.inventoryApplied ? `<span>Inventory reduced</span>` : ""}
              </td>
              <td>${order.lines.length.toLocaleString()}</td>
              <td>${formatMoney(getSalesOrderTotal(order))}</td>
              <td>
                <div class="row-actions">
                  <button class="secondary-action small" data-edit-sales-order="${order.id}" type="button">Edit</button>
                  <button class="danger-action small" data-delete-sales-order="${order.id}" type="button">Delete</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderSalesOrderForm(order) {
  if (!customers.length || !products.length) {
    return `
      <div class="empty-state">
        <strong>Setup required</strong>
        <p>Create at least one customer and one product before creating a sales order.</p>
      </div>
    `;
  }

  const values = {
    customerId: customers[0]?.id || "",
    status: "Draft",
    lines: [{ productId: products[0]?.id || "", quantity: 1 }],
    ...(order || {}),
  };

  return `
    <form id="sales-order-form" class="entity-form">
      <div class="form-grid">
        <label>
          <span>Customer</span>
          <select name="customerId" required>
            ${customers.map((customer) => `
              <option value="${customer.id}" ${values.customerId === customer.id ? "selected" : ""}>${escapeHtml(customer.name)}</option>
            `).join("")}
          </select>
        </label>
        <label>
          <span>Status</span>
          <select name="status">
            ${["Draft", "Confirmed", "Fulfilled", "Cancelled"].map((status) => `
              <option value="${status}" ${values.status === status ? "selected" : ""}>${status}</option>
            `).join("")}
          </select>
        </label>
      </div>
      <div class="line-editor">
        <div class="line-editor-heading">
          <h3>Products</h3>
          <button class="secondary-action small" id="add-order-line" type="button">Add Line</button>
        </div>
        <div id="order-lines" class="order-lines">
          ${values.lines.map((line) => renderSalesOrderLine(line)).join("")}
        </div>
        <div class="order-total">
          <span>Total Amount</span>
          <strong id="sales-order-total">${formatMoney(getSalesOrderTotal(values))}</strong>
        </div>
      </div>
      <div class="form-actions">
        <button class="primary-action" type="submit">${order ? "Save Changes" : "Create Sales Order"}</button>
        ${order ? `<button class="secondary-action" id="cancel-sales-order-edit" type="button">Cancel</button>` : `<button class="secondary-action" type="reset">Clear</button>`}
      </div>
    </form>
  `;
}

function renderSalesOrderLine(line = {}) {
  return `
    <div class="order-line">
      <label>
        <span>Product</span>
        <select name="productId" required>
          ${products.map((product) => `
            <option value="${product.id}" ${line.productId === product.id ? "selected" : ""}>${escapeHtml(product.name)} (${escapeHtml(product.sku)})</option>
          `).join("")}
        </select>
      </label>
      <label>
        <span>Quantity</span>
        <input name="quantity" type="number" min="1" step="1" value="${escapeAttribute(line.quantity || 1)}" required />
      </label>
      <button class="danger-action small remove-order-line" type="button">Remove</button>
    </div>
  `;
}

function renderEmptySalesOrders() {
  return `
    <div class="empty-state">
      <strong>No sales orders found</strong>
      <p>Adjust the search or create a new sales order.</p>
    </div>
  `;
}

function renderProductTable(rows) {
  return `
    <div class="table-wrap">
      <table class="customer-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Current Stock</th>
            <th>Low-Stock Threshold</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((product) => `
            <tr>
              <td><strong>${escapeHtml(product.name)}</strong></td>
              <td>${escapeHtml(product.sku)}</td>
              <td>${formatMoney(product.price)}</td>
              <td>${Number(product.stock || 0).toLocaleString()}</td>
              <td>${Number(product.lowStockThreshold || 0).toLocaleString()}</td>
              <td>
                <div class="row-actions">
                  <button class="secondary-action small" data-edit-product="${product.id}" type="button">Edit</button>
                  ${canDeleteMasterData() ? `<button class="danger-action small" data-delete-product="${product.id}" type="button">Delete</button>` : ""}
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderProductForm(product) {
  const values = product || {
    name: "",
    sku: "",
    price: 0,
    stock: 0,
    lowStockThreshold: 10,
  };

  return `
    <form id="product-form" class="entity-form">
      <div class="form-grid">
        ${renderField("name", "Product Name", values.name, "text", true)}
        ${renderField("sku", "SKU", values.sku, "text", true)}
        <label>
          <span>Price</span>
          <input name="price" type="number" min="0" step="0.01" value="${escapeAttribute(values.price)}" required />
        </label>
        <label>
          <span>Current Stock</span>
          <input name="stock" type="number" min="0" step="1" value="${escapeAttribute(values.stock)}" required />
        </label>
        <label>
          <span>Low-Stock Threshold</span>
          <input name="lowStockThreshold" type="number" min="0" step="1" value="${escapeAttribute(values.lowStockThreshold ?? 10)}" required />
        </label>
      </div>
      <div class="form-actions">
        <button class="primary-action" type="submit">${product ? "Save Changes" : "Create Product"}</button>
        ${product ? `<button class="secondary-action" id="cancel-product-edit" type="button">Cancel</button>` : `<button class="secondary-action" type="reset">Clear</button>`}
      </div>
    </form>
  `;
}

function renderEmptyProducts() {
  return `
    <div class="empty-state">
      <strong>No products found</strong>
      <p>Adjust the search or create a new product.</p>
    </div>
  `;
}

function renderCustomerTable(rows) {
  return `
    <div class="table-wrap">
      <table class="customer-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Contact</th>
            <th>Balance</th>
            <th>Status</th>
            <th>Last Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((customer) => `
            <tr>
              <td>
                <strong>${escapeHtml(customer.name)}</strong>
                <span>${escapeHtml(customer.email)}</span>
              </td>
              <td>
                ${escapeHtml(customer.contact)}
                <span>${escapeHtml(customer.phone)}</span>
              </td>
              <td>${formatMoney(customer.balance)}</td>
              <td><span class="status-pill ${getStatusClass(customer.status)}">${escapeHtml(customer.status)}</span></td>
              <td>${escapeHtml(customer.lastOrder || "-")}</td>
              <td>
                <div class="row-actions">
                  <button class="secondary-action small" data-edit-customer="${customer.id}" type="button">Edit</button>
                  ${canDeleteMasterData() ? `<button class="danger-action small" data-delete-customer="${customer.id}" type="button">Delete</button>` : ""}
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderVendorTable(rows) {
  return `
    <div class="table-wrap">
      <table class="customer-table">
        <thead>
          <tr>
            <th>Vendor</th>
            <th>Contact</th>
            <th>Terms</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((vendor) => `
            <tr>
              <td>
                <strong>${escapeHtml(vendor.name)}</strong>
                <span>${escapeHtml(vendor.email)}</span>
              </td>
              <td>
                ${escapeHtml(vendor.contact)}
                <span>${escapeHtml(vendor.phone)}</span>
              </td>
              <td>${escapeHtml(vendor.terms)}</td>
              <td><span class="status-pill ${getVendorStatusClass(vendor.status)}">${escapeHtml(vendor.status)}</span></td>
              <td>
                <div class="row-actions">
                  <button class="secondary-action small" data-edit-vendor="${vendor.id}" type="button">Edit</button>
                  <button class="danger-action small" data-delete-vendor="${vendor.id}" type="button">Delete</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderVendorRecycleBin(rows) {
  return `
    <section class="panel full recycle-bin-panel">
      <div class="panel-heading">
        <div>
          <h2>Vendor Recycle Bin</h2>
          <p>Deleted vendors are kept here so they can be restored later.</p>
        </div>
        <span class="status-pill neutral-bg">${rows.length.toLocaleString()} deleted</span>
      </div>
      ${rows.length ? renderDeletedVendorTable(rows) : `
        <div class="empty-state compact">
          <strong>No deleted vendors</strong>
          <p>Vendors moved to the recycle bin will appear here.</p>
        </div>
      `}
    </section>
  `;
}

function renderDeletedVendorTable(rows) {
  return `
    <div class="table-wrap">
      <table class="customer-table">
        <thead>
          <tr>
            <th>Vendor</th>
            <th>Contact</th>
            <th>Deleted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((vendor) => `
            <tr>
              <td>
                <strong>${escapeHtml(vendor.name)}</strong>
                <span>${escapeHtml(vendor.email)}</span>
              </td>
              <td>
                ${escapeHtml(vendor.contact)}
                <span>${escapeHtml(vendor.phone)}</span>
              </td>
              <td>${escapeHtml(formatDate(vendor.deletedAt))}</td>
              <td>
                <button class="secondary-action small" data-restore-vendor="${vendor.id}" type="button">Restore</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderCustomerForm(customer) {
  const values = customer || {
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    balance: 0,
    status: "Current",
    lastOrder: "",
    notes: "",
  };

  return `
    <form id="customer-form" class="entity-form">
      <div class="form-grid">
        ${renderField("name", "Business Name", values.name, "text", true)}
        ${renderField("contact", "Primary Contact", values.contact, "text", true)}
        ${renderField("email", "Email", values.email, "email", true)}
        ${renderField("phone", "Phone", values.phone, "tel", true)}
        ${renderField("balance", "Balance", values.balance, "number", false)}
        ${renderField("lastOrder", "Last Order", values.lastOrder, "text", false)}
        <label>
          <span>Status</span>
          <select name="status">
            ${["Current", "Payment due", "On hold", "Inactive"].map((status) => `
              <option value="${status}" ${values.status === status ? "selected" : ""}>${status}</option>
            `).join("")}
          </select>
        </label>
        <label class="span-2">
          <span>Address</span>
          <input name="address" value="${escapeAttribute(values.address)}" />
        </label>
        <label class="span-2">
          <span>Notes</span>
          <textarea name="notes" rows="4">${escapeHtml(values.notes)}</textarea>
        </label>
      </div>
      <div class="form-actions">
        <button class="primary-action" type="submit">${customer ? "Save Changes" : "Create Customer"}</button>
        ${customer ? `<button class="secondary-action" id="cancel-edit" type="button">Cancel</button>` : `<button class="secondary-action" type="reset">Clear</button>`}
      </div>
    </form>
  `;
}

function renderVendorForm(vendor) {
  const values = vendor || {
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    terms: "Net 30",
    status: "Active",
    notes: "",
  };

  return `
    <form id="vendor-form" class="entity-form">
      <div class="form-grid">
        ${renderField("name", "Vendor Name", values.name, "text", true)}
        ${renderField("contact", "Primary Contact", values.contact, "text", true)}
        ${renderField("email", "Email", values.email, "email", true)}
        ${renderField("phone", "Phone", values.phone, "tel", true)}
        ${renderField("terms", "Payment Terms", values.terms, "text", false)}
        <label>
          <span>Status</span>
          <select name="status">
            ${["Active", "On hold", "Inactive"].map((status) => `
              <option value="${status}" ${values.status === status ? "selected" : ""}>${status}</option>
            `).join("")}
          </select>
        </label>
        <label class="span-2">
          <span>Address</span>
          <input name="address" value="${escapeAttribute(values.address)}" />
        </label>
        <label class="span-2">
          <span>Notes</span>
          <textarea name="notes" rows="4">${escapeHtml(values.notes)}</textarea>
        </label>
      </div>
      <div class="form-actions">
        <button class="primary-action" type="submit">${vendor ? "Save Changes" : "Create Vendor"}</button>
        ${vendor ? `<button class="secondary-action" id="cancel-vendor-edit" type="button">Cancel</button>` : `<button class="secondary-action" type="reset">Clear</button>`}
      </div>
    </form>
  `;
}

function renderField(name, label, value, type, required) {
  return `
    <label>
      <span>${label}</span>
      <input name="${name}" type="${type}" value="${escapeAttribute(value)}" ${required ? "required" : ""} />
    </label>
  `;
}

function renderEmptyCustomers() {
  return `
    <div class="empty-state">
      <strong>No customers found</strong>
      <p>Adjust the search or create a new customer.</p>
    </div>
  `;
}

function renderEmptyVendors() {
  return `
    <div class="empty-state">
      <strong>No vendors found</strong>
      <p>Adjust the search or create a new vendor.</p>
    </div>
  `;
}

function bindCustomerEvents() {
  const form = app.querySelector("#customer-form");
  const search = app.querySelector("#customer-search");
  const cancel = app.querySelector("#cancel-edit");

  search.addEventListener("input", (event) => {
    customerSearch = event.target.value;
    listPagination.customers = 1;
    restoreCustomerSearchFocus = true;
    render();
  });

  if (restoreCustomerSearchFocus) {
    search.focus();
    search.setSelectionRange(search.value.length, search.value.length);
    restoreCustomerSearchFocus = false;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    upsertCustomer(new FormData(form));
  });

  if (cancel) {
    cancel.addEventListener("click", () => {
      editingCustomerId = null;
      render();
    });
  }

  app.querySelectorAll("[data-edit-customer]").forEach((button) => {
    button.addEventListener("click", () => {
      editingCustomerId = button.dataset.editCustomer;
      render();
    });
  });

  app.querySelectorAll("[data-delete-customer]").forEach((button) => {
    button.addEventListener("click", () => {
      deleteCustomer(button.dataset.deleteCustomer);
    });
  });
}

function bindPaginationEvents() {
  app.querySelectorAll("[data-page-list]").forEach((button) => {
    button.addEventListener("click", () => {
      const listKey = button.dataset.pageList;
      const direction = button.dataset.pageDirection;
      const delta = direction === "next" ? 1 : -1;
      listPagination[listKey] = (listPagination[listKey] || 1) + delta;
      render();
    });
  });
}

function bindVendorEvents() {
  const form = app.querySelector("#vendor-form");
  const search = app.querySelector("#vendor-search");
  const cancel = app.querySelector("#cancel-vendor-edit");

  search.addEventListener("input", (event) => {
    vendorSearch = event.target.value;
    listPagination.vendors = 1;
    restoreVendorSearchFocus = true;
    render();
  });

  if (restoreVendorSearchFocus) {
    search.focus();
    search.setSelectionRange(search.value.length, search.value.length);
    restoreVendorSearchFocus = false;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    upsertVendor(new FormData(form));
  });

  if (cancel) {
    cancel.addEventListener("click", () => {
      editingVendorId = null;
      render();
    });
  }

  app.querySelectorAll("[data-edit-vendor]").forEach((button) => {
    button.addEventListener("click", () => {
      editingVendorId = button.dataset.editVendor;
      render();
    });
  });

  app.querySelectorAll("[data-delete-vendor]").forEach((button) => {
    button.addEventListener("click", () => {
      deleteVendor(button.dataset.deleteVendor);
    });
  });

  app.querySelectorAll("[data-restore-vendor]").forEach((button) => {
    button.addEventListener("click", () => {
      restoreVendor(button.dataset.restoreVendor);
    });
  });
}

function bindProductEvents() {
  const form = app.querySelector("#product-form");
  const search = app.querySelector("#product-search");
  const cancel = app.querySelector("#cancel-product-edit");

  search.addEventListener("input", (event) => {
    productSearch = event.target.value;
    listPagination.products = 1;
    restoreProductSearchFocus = true;
    render();
  });

  if (restoreProductSearchFocus) {
    search.focus();
    search.setSelectionRange(search.value.length, search.value.length);
    restoreProductSearchFocus = false;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    upsertProduct(new FormData(form));
  });

  if (cancel) {
    cancel.addEventListener("click", () => {
      editingProductId = null;
      render();
    });
  }

  app.querySelectorAll("[data-edit-product]").forEach((button) => {
    button.addEventListener("click", () => {
      editingProductId = button.dataset.editProduct;
      render();
    });
  });

  app.querySelectorAll("[data-delete-product]").forEach((button) => {
    button.addEventListener("click", () => {
      deleteProduct(button.dataset.deleteProduct);
    });
  });
}

function bindSalesOrderEvents() {
  const form = app.querySelector("#sales-order-form");
  const search = app.querySelector("#sales-order-search");
  const cancel = app.querySelector("#cancel-sales-order-edit");
  const addLine = app.querySelector("#add-order-line");
  const lines = app.querySelector("#order-lines");

  search.addEventListener("input", (event) => {
    salesOrderSearch = event.target.value;
    listPagination.salesOrders = 1;
    restoreSalesOrderSearchFocus = true;
    render();
  });

  if (restoreSalesOrderSearchFocus) {
    search.focus();
    search.setSelectionRange(search.value.length, search.value.length);
    restoreSalesOrderSearchFocus = false;
  }

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    upsertSalesOrder(new FormData(form));
  });

  addLine.addEventListener("click", () => {
    lines.insertAdjacentHTML("beforeend", renderSalesOrderLine({ productId: products[0]?.id || "", quantity: 1 }));
    updateSalesOrderFormTotal();
  });

  lines.addEventListener("click", (event) => {
    if (!event.target.classList.contains("remove-order-line")) {
      return;
    }

    const line = event.target.closest(".order-line");
    if (lines.querySelectorAll(".order-line").length > 1) {
      line.remove();
      updateSalesOrderFormTotal();
    }
  });

  lines.addEventListener("input", updateSalesOrderFormTotal);
  lines.addEventListener("change", updateSalesOrderFormTotal);
  updateSalesOrderFormTotal();

  if (cancel) {
    cancel.addEventListener("click", () => {
      editingSalesOrderId = null;
      render();
    });
  }

  app.querySelectorAll("[data-edit-sales-order]").forEach((button) => {
    button.addEventListener("click", () => {
      editingSalesOrderId = button.dataset.editSalesOrder;
      render();
    });
  });

  app.querySelectorAll("[data-delete-sales-order]").forEach((button) => {
    button.addEventListener("click", () => {
      deleteSalesOrder(button.dataset.deleteSalesOrder);
    });
  });
}

function bindInvoiceEvents() {
  const search = app.querySelector("#invoice-search");

  search.addEventListener("input", (event) => {
    invoiceSearch = event.target.value;
    listPagination.invoices = 1;
    restoreInvoiceSearchFocus = true;
    render();
  });

  if (restoreInvoiceSearchFocus) {
    search.focus();
    search.setSelectionRange(search.value.length, search.value.length);
    restoreInvoiceSearchFocus = false;
  }

  app.querySelectorAll("[data-record-payment]").forEach((button) => {
    button.addEventListener("click", () => {
      recordingPaymentInvoiceId = button.dataset.recordPayment;
      render();
    });
  });

  app.querySelectorAll("[data-cancel-payment]").forEach((button) => {
    button.addEventListener("click", () => {
      recordingPaymentInvoiceId = null;
      render();
    });
  });

  app.querySelectorAll("[data-payment-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      recordInvoicePayment(form.dataset.paymentForm, new FormData(form));
    });
  });
}

function bindPurchaseOrderEvents() {
  const form = app.querySelector("#purchase-order-form");
  const search = app.querySelector("#purchase-order-search");
  const cancel = app.querySelector("#cancel-purchase-order-edit");
  const addLine = app.querySelector("#add-purchase-line");
  const lines = app.querySelector("#purchase-lines");

  search.addEventListener("input", (event) => {
    purchaseOrderSearch = event.target.value;
    listPagination.purchaseOrders = 1;
    restorePurchaseOrderSearchFocus = true;
    render();
  });

  if (restorePurchaseOrderSearchFocus) {
    search.focus();
    search.setSelectionRange(search.value.length, search.value.length);
    restorePurchaseOrderSearchFocus = false;
  }

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    upsertPurchaseOrder(new FormData(form));
  });

  addLine.addEventListener("click", () => {
    lines.insertAdjacentHTML("beforeend", renderPurchaseOrderLine({ productId: products[0]?.id || "", quantity: 1 }));
    updatePurchaseOrderUnits();
  });

  lines.addEventListener("click", (event) => {
    if (!event.target.classList.contains("remove-purchase-line")) {
      return;
    }

    const line = event.target.closest(".order-line");
    if (lines.querySelectorAll(".order-line").length > 1) {
      line.remove();
      updatePurchaseOrderUnits();
    }
  });

  lines.addEventListener("input", updatePurchaseOrderUnits);
  lines.addEventListener("change", updatePurchaseOrderUnits);
  updatePurchaseOrderUnits();

  if (cancel) {
    cancel.addEventListener("click", () => {
      editingPurchaseOrderId = null;
      render();
    });
  }

  app.querySelectorAll("[data-edit-purchase-order]").forEach((button) => {
    button.addEventListener("click", () => {
      editingPurchaseOrderId = button.dataset.editPurchaseOrder;
      render();
    });
  });

  app.querySelectorAll("[data-delete-purchase-order]").forEach((button) => {
    button.addEventListener("click", () => {
      deletePurchaseOrder(button.dataset.deletePurchaseOrder);
    });
  });
}

function bindReportEvents() {
  const xlsxButton = app.querySelector("#export-monthly-sales-xlsx");
  const filters = app.querySelector("#monthly-sales-filters");
  const clearFilters = app.querySelector("#clear-monthly-sales-filters");

  if (xlsxButton) {
    xlsxButton.addEventListener("click", exportMonthlySalesXlsx);
  }

  if (filters) {
    filters.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    filters.addEventListener("change", (event) => {
      if (event.target.name === "startDate") {
        reportStartDate = event.target.value;
      }

      if (event.target.name === "endDate") {
        reportEndDate = event.target.value;
      }

      render();
    });
  }

  if (clearFilters) {
    clearFilters.addEventListener("click", () => {
      reportStartDate = "";
      reportEndDate = "";
      render();
    });
  }
}

// CRUD operations and business workflows

function upsertCustomer(formData) {
  const customer = {
    id: editingCustomerId || nextCustomerId(),
    name: formData.get("name").trim(),
    contact: formData.get("contact").trim(),
    email: formData.get("email").trim(),
    phone: formData.get("phone").trim(),
    address: formData.get("address").trim(),
    balance: Number(formData.get("balance") || 0),
    status: formData.get("status"),
    lastOrder: formData.get("lastOrder").trim(),
    notes: formData.get("notes").trim(),
  };

  if (editingCustomerId) {
    customers = customers.map((item) => item.id === editingCustomerId ? customer : item);
  } else {
    customers = [customer, ...customers];
  }

  editingCustomerId = null;
  saveCustomers();
  render();
}

function upsertVendor(formData) {
  const vendor = {
    id: editingVendorId || nextVendorId(),
    name: formData.get("name").trim(),
    contact: formData.get("contact").trim(),
    email: formData.get("email").trim(),
    phone: formData.get("phone").trim(),
    address: formData.get("address").trim(),
    terms: formData.get("terms").trim(),
    status: formData.get("status"),
    notes: formData.get("notes").trim(),
    deletedAt: null,
  };

  if (editingVendorId) {
    vendors = vendors.map((item) => item.id === editingVendorId ? { ...vendor, deletedAt: item.deletedAt || null } : item);
  } else {
    vendors = [vendor, ...vendors];
  }

  editingVendorId = null;
  saveVendors();
  render();
}

function upsertProduct(formData) {
  const sku = formData.get("sku").trim();
  const price = Number(formData.get("price") || 0);
  const stock = Number(formData.get("stock") || 0);
  const lowStockThreshold = Number(formData.get("lowStockThreshold") || 0);

  if (price < 0) {
    window.alert("Product price cannot be negative.");
    return;
  }

  if (stock < 0) {
    window.alert("Product stock quantity cannot be negative.");
    return;
  }

  if (lowStockThreshold < 0) {
    window.alert("Low-stock threshold cannot be negative.");
    return;
  }

  const product = {
    id: editingProductId || sku || nextProductId(),
    name: formData.get("name").trim(),
    sku,
    price,
    stock,
    lowStockThreshold,
  };

  if (editingProductId) {
    products = products.map((item) => item.id === editingProductId ? product : item);
  } else {
    products = [product, ...products];
  }

  editingProductId = null;
  saveProducts();
  render();
}

function upsertSalesOrder(formData) {
  const existingOrder = salesOrders.find((item) => item.id === editingSalesOrderId);
  const productIds = formData.getAll("productId");
  const quantities = formData.getAll("quantity");
  const lines = productIds
    .map((productId, index) => ({
      productId,
      quantity: Number(quantities[index] || 0),
    }))
    .filter((line) => line.productId && line.quantity > 0);

  if (!lines.length) {
    window.alert("Add at least one product line.");
    return;
  }

  const salesOrder = {
    id: editingSalesOrderId || nextSalesOrderId(),
    customerId: formData.get("customerId"),
    status: formData.get("status"),
    inventoryApplied: existingOrder?.inventoryApplied || false,
    createdBy: existingOrder?.createdBy || business.user,
    lines,
  };
  const isNewConfirmation = salesOrder.status === "Confirmed" && existingOrder?.status !== "Confirmed";

  const previousInventoryLines = existingOrder?.inventoryApplied ? existingOrder.lines : [];
  const nextInventoryLines = salesOrder.status === "Confirmed" ? salesOrder.lines : [];
  // Inventory changes are computed as a delta so editing a confirmed order only applies the difference.
  const inventoryDelta = getInventoryDelta(previousInventoryLines, nextInventoryLines);

  if (salesOrder.status === "Confirmed") {
    // A sales order cannot be confirmed unless all incremental stock requirements are available.
    const availabilityError = getInventoryAvailabilityError(inventoryDelta);
    if (availabilityError) {
      window.alert(availabilityError);
      return;
    }
  }

  applyInventoryDelta(inventoryDelta);
  salesOrder.inventoryApplied = salesOrder.status === "Confirmed";
  saveProducts();

  if (salesOrder.status === "Confirmed") {
    // Confirmation is the point where the ERP creates the customer-facing invoice.
    ensureInvoiceForSalesOrder(salesOrder, { logEvent: isNewConfirmation });
  }

  if (isNewConfirmation) {
    addAuditLog({
      type: "Sales Order Confirmed",
      entityId: salesOrder.id,
      message: `${salesOrder.id} was confirmed for ${getCustomerName(salesOrder.customerId)} with a total of ${formatMoney(getSalesOrderTotal(salesOrder))}.`,
    });
  }

  if (editingSalesOrderId) {
    salesOrders = salesOrders.map((item) => item.id === editingSalesOrderId ? salesOrder : item);
  } else {
    salesOrders = [salesOrder, ...salesOrders];
  }

  editingSalesOrderId = null;
  saveSalesOrders();
  render();
}

function upsertPurchaseOrder(formData) {
  const existingOrder = purchaseOrders.find((item) => item.id === editingPurchaseOrderId);
  const productIds = formData.getAll("productId");
  const quantities = formData.getAll("quantity");
  const lines = productIds
    .map((productId, index) => ({
      productId,
      quantity: Number(quantities[index] || 0),
    }))
    .filter((line) => line.productId && line.quantity > 0);

  if (!lines.length) {
    window.alert("Add at least one product line.");
    return;
  }

  const purchaseOrder = {
    id: editingPurchaseOrderId || nextPurchaseOrderId(),
    vendorId: formData.get("vendorId"),
    status: formData.get("status"),
    inventoryApplied: existingOrder?.inventoryApplied || false,
    lines,
  };

  const previousInventoryLines = existingOrder?.inventoryApplied ? existingOrder.lines : [];
  const nextInventoryLines = purchaseOrder.status === "Received" ? purchaseOrder.lines : [];
  const inventoryDelta = getInventoryDelta(previousInventoryLines, nextInventoryLines);

  // Receiving stock is the inverse of sales fulfillment: it increases product stock.
  applyInventoryDelta(invertInventoryDelta(inventoryDelta));
  purchaseOrder.inventoryApplied = purchaseOrder.status === "Received";
  saveProducts();

  if (editingPurchaseOrderId) {
    purchaseOrders = purchaseOrders.map((item) => item.id === editingPurchaseOrderId ? purchaseOrder : item);
  } else {
    purchaseOrders = [purchaseOrder, ...purchaseOrders];
  }

  editingPurchaseOrderId = null;
  savePurchaseOrders();
  render();
}

function ensureInvoiceForSalesOrder(salesOrder, options = {}) {
  const existingInvoice = invoices.find((invoice) => invoice.salesOrderId === salesOrder.id);
  if (existingInvoice) {
    return;
  }

  const issueDate = new Date().toISOString().slice(0, 10);
  const invoice = {
    id: nextInvoiceId(),
    salesOrderId: salesOrder.id,
    customerId: salesOrder.customerId,
    issueDate,
    dueDate: getInvoiceDueDate(issueDate),
    paymentStatus: "Unpaid",
    payments: [],
    amount: getSalesOrderTotal(salesOrder),
  };
  // Each confirmed sales order can create at most one invoice.
  invoices = [
    invoice,
    ...invoices,
  ];
  saveInvoices();

  if (options.logEvent) {
    addAuditLog({
      type: "Invoice Generated",
      entityId: invoice.id,
      message: `${invoice.id} was generated for ${salesOrder.id} with a due date of ${formatDate(invoice.dueDate)}.`,
    });
  }
}

function ensureInvoicesForConfirmedSalesOrders() {
  const beforeCount = invoices.length;
  salesOrders
    .filter((salesOrder) => salesOrder.status === "Confirmed")
    .forEach((salesOrder) => ensureInvoiceForSalesOrder(salesOrder));

  if (invoices.length !== beforeCount) {
    saveInvoices();
  }
}

function ensureInvoiceDueDates() {
  let changed = false;
  invoices = invoices.map((invoice) => {
    const dueDate = getInvoiceDueDate(invoice.issueDate);
    if (invoice.dueDate === dueDate) {
      return invoice;
    }

    changed = true;
    return {
      ...invoice,
      dueDate,
    };
  });

  if (changed) {
    saveInvoices();
  }
}

function getInvoiceDueDate(issueDate) {
  const date = new Date(`${issueDate}T00:00:00`);
  date.setDate(date.getDate() + 15);
  return date.toISOString().slice(0, 10);
}

function ensureInvoicePaymentStatuses() {
  let changed = false;

  invoices = invoices.map((invoice) => {
    const payments = Array.isArray(invoice.payments) ? invoice.payments : [];
    const paymentStatus = getInvoicePaymentStatus({ ...invoice, payments });
    if (invoice.paymentStatus === paymentStatus && invoice.payments === payments) {
      return invoice;
    }

    changed = true;
    return {
      ...invoice,
      payments,
      paymentStatus,
    };
  });

  if (changed) {
    saveInvoices();
  }
}

function recordInvoicePayment(invoiceId, formData) {
  const invoice = invoices.find((item) => item.id === invoiceId);
  if (!invoice) {
    return;
  }

  const amount = Number(formData.get("amount"));
  const balance = getInvoiceBalance(invoice);
  // Payments are append-only in this prototype; invoice status is derived from the total paid.
  if (!Number.isFinite(amount) || amount <= 0) {
    alert("Enter a payment amount greater than zero.");
    return;
  }

  if (amount > balance) {
    alert(`Payment cannot exceed the remaining balance of ${formatMoney(balance)}.`);
    return;
  }

  const payment = {
    id: nextPaymentId(invoice),
    date: String(formData.get("date")),
    method: getPaymentMethods().includes(formData.get("method")) ? String(formData.get("method")) : "Cash",
    amount,
  };

  invoices = invoices.map((item) => {
    if (item.id !== invoiceId) {
      return item;
    }

    const payments = [...(item.payments || []), payment];
    return {
      ...item,
      payments,
      paymentStatus: getInvoicePaymentStatus({ ...item, payments }),
    };
  });

  recordingPaymentInvoiceId = null;
  saveInvoices();
  addAuditLog({
    type: "Payment Recorded",
    entityId: invoiceId,
    message: `${formatMoney(amount)} payment recorded on ${invoiceId} by ${payment.method}.`,
  });
  render();
}

function updateSalesOrderFormTotal() {
  const total = app.querySelector("#sales-order-total");
  const lines = getSalesOrderFormLines();
  if (total) {
    total.textContent = formatMoney(getSalesOrderTotal({ lines }));
  }
}

function updatePurchaseOrderUnits() {
  const total = app.querySelector("#purchase-order-units");
  const lines = getPurchaseOrderFormLines();
  if (total) {
    total.textContent = getPurchaseOrderUnits({ lines }).toLocaleString();
  }
}

function getInventoryAvailabilityError(inventoryDelta) {
  const shortage = Object.entries(inventoryDelta).find(([productId, quantity]) => {
    const product = getProduct(productId);
    return quantity > 0 && (!product || Number(product.stock || 0) < quantity);
  });

  if (!shortage) {
    return "";
  }

  const [productId, quantity] = shortage;
  const product = getProduct(productId);
  if (!product) {
    return "One or more selected products no longer exist.";
  }

  return `${product.name} only has ${product.stock} in stock, but this order needs ${quantity}.`;
}

function applyInventoryDelta(inventoryDelta) {
  // Positive deltas reduce stock for sales; negative deltas restore or receive stock.
  products = products.map((product) => {
    const quantity = inventoryDelta[product.id] || 0;
    return quantity ? { ...product, stock: Number(product.stock || 0) - quantity } : product;
  });
}

function getInventoryDelta(previousLines, nextLines) {
  // Compare previous and next line quantities by product so edits do not double-apply stock.
  const previousQuantities = getQuantitiesByProduct(previousLines);
  const nextQuantities = getQuantitiesByProduct(nextLines);
  const productIds = new Set([...Object.keys(previousQuantities), ...Object.keys(nextQuantities)]);

  return [...productIds].reduce((delta, productId) => {
    const quantity = (nextQuantities[productId] || 0) - (previousQuantities[productId] || 0);
    if (quantity) {
      delta[productId] = quantity;
    }
    return delta;
  }, {});
}

function invertInventoryDelta(inventoryDelta) {
  return Object.entries(inventoryDelta).reduce((inverted, [productId, quantity]) => {
    inverted[productId] = -quantity;
    return inverted;
  }, {});
}

function addAuditLog({ type, entityId, message }) {
  auditLog = [
    {
      id: nextAuditLogId(),
      type,
      entityId,
      message,
      actor: business.user,
      role: currentRole,
      createdAt: new Date().toISOString(),
    },
    ...auditLog,
  ];
  saveAuditLog();
}

function getQuantitiesByProduct(lines) {
  return lines.reduce((totals, line) => {
    totals[line.productId] = (totals[line.productId] || 0) + Number(line.quantity || 0);
    return totals;
  }, {});
}

function getSalesOrderFormLines() {
  return [...app.querySelectorAll(".order-line")].map((line) => {
    return {
      productId: line.querySelector('[name="productId"]').value,
      quantity: Number(line.querySelector('[name="quantity"]').value || 0),
    };
  });
}

function getPurchaseOrderFormLines() {
  return [...app.querySelectorAll("#purchase-lines .order-line")].map((line) => {
    return {
      productId: line.querySelector('[name="productId"]').value,
      quantity: Number(line.querySelector('[name="quantity"]').value || 0),
    };
  });
}

function deleteProduct(productId) {
  if (!canDeleteMasterData()) {
    alert("Only Admin and Manager users can delete products.");
    return;
  }

  const product = products.find((item) => item.id === productId);
  if (!product || !window.confirm(`Delete ${product.name}?`)) {
    return;
  }

  products = products.filter((item) => item.id !== productId);
  if (editingProductId === productId) {
    editingProductId = null;
  }
  saveProducts();
  render();
}

function deleteCustomer(customerId) {
  if (!canDeleteMasterData()) {
    alert("Only Admin and Manager users can delete customers.");
    return;
  }

  const customer = customers.find((item) => item.id === customerId);
  if (!customer || !window.confirm(`Delete ${customer.name}?`)) {
    return;
  }

  customers = customers.filter((item) => item.id !== customerId);
  if (editingCustomerId === customerId) {
    editingCustomerId = null;
  }
  saveCustomers();
  render();
}

function deleteVendor(vendorId) {
  const vendor = vendors.find((item) => item.id === vendorId);
  if (!vendor || !window.confirm(`Move ${vendor.name} to the recycle bin?`)) {
    return;
  }

  vendors = vendors.map((item) => item.id === vendorId ? { ...item, deletedAt: new Date().toISOString() } : item);
  if (editingVendorId === vendorId) {
    editingVendorId = null;
  }
  saveVendors();
  render();
}

function restoreVendor(vendorId) {
  const vendor = vendors.find((item) => item.id === vendorId);
  if (!vendor) {
    return;
  }

  vendors = vendors.map((item) => item.id === vendorId ? { ...item, deletedAt: null } : item);
  saveVendors();
  render();
}

function deleteSalesOrder(salesOrderId) {
  const salesOrder = salesOrders.find((item) => item.id === salesOrderId);
  if (!salesOrder || !window.confirm(`Delete ${salesOrder.id}?`)) {
    return;
  }

  if (salesOrder.inventoryApplied) {
    applyInventoryDelta(invertInventoryDelta(getInventoryDelta([], salesOrder.lines)));
    saveProducts();
  }

  salesOrders = salesOrders.filter((item) => item.id !== salesOrderId);
  if (editingSalesOrderId === salesOrderId) {
    editingSalesOrderId = null;
  }
  saveSalesOrders();
  render();
}

function deletePurchaseOrder(purchaseOrderId) {
  const purchaseOrder = purchaseOrders.find((item) => item.id === purchaseOrderId);
  if (!purchaseOrder || !window.confirm(`Delete ${purchaseOrder.id}?`)) {
    return;
  }

  if (purchaseOrder.inventoryApplied) {
    applyInventoryDelta(getInventoryDelta([], purchaseOrder.lines));
    saveProducts();
  }

  purchaseOrders = purchaseOrders.filter((item) => item.id !== purchaseOrderId);
  if (editingPurchaseOrderId === purchaseOrderId) {
    editingPurchaseOrderId = null;
  }
  savePurchaseOrders();
  render();
}

function getVisibleCustomers() {
  const term = customerSearch.trim().toLowerCase();
  if (!term) {
    return customers;
  }

  return customers.filter((customer) => {
    return [customer.name, customer.contact, customer.email, customer.phone, customer.status]
      .some((value) => String(value).toLowerCase().includes(term));
  });
}

function getVisibleVendors() {
  const term = vendorSearch.trim().toLowerCase();
  if (!term) {
    return getActiveVendors();
  }

  return getActiveVendors().filter((vendor) => {
    return [vendor.name, vendor.contact, vendor.email, vendor.phone, vendor.status, vendor.terms]
      .some((value) => String(value).toLowerCase().includes(term));
  });
}

function getActiveVendors() {
  return vendors.filter((vendor) => !vendor.deletedAt);
}

function getDeletedVendors() {
  return vendors
    .filter((vendor) => vendor.deletedAt)
    .sort((first, second) => String(second.deletedAt).localeCompare(String(first.deletedAt)));
}

function getSelectableVendorsForPurchaseOrder(selectedVendorId) {
  const activeVendors = getActiveVendors();
  const selectedVendor = vendors.find((vendor) => vendor.id === selectedVendorId);
  if (!selectedVendor || activeVendors.some((vendor) => vendor.id === selectedVendor.id)) {
    return activeVendors;
  }

  return [...activeVendors, selectedVendor];
}

function getVisibleProducts() {
  const term = productSearch.trim().toLowerCase();
  if (!term) {
    return products;
  }

  return products.filter((product) => {
    return [product.name, product.sku]
      .some((value) => String(value).toLowerCase().includes(term));
  });
}

function getVisibleSalesOrders() {
  const term = salesOrderSearch.trim().toLowerCase();
  if (!term) {
    return salesOrders;
  }

  return salesOrders.filter((order) => {
    return [order.id, getCustomerName(order.customerId)]
      .some((value) => String(value).toLowerCase().includes(term));
  });
}

function getVisibleInvoices() {
  const term = invoiceSearch.trim().toLowerCase();
  if (!term) {
    return invoices;
  }

  return invoices.filter((invoice) => {
    return [invoice.id, invoice.salesOrderId, getCustomerName(invoice.customerId), invoice.paymentStatus]
      .some((value) => String(value).toLowerCase().includes(term));
  });
}

function getVisiblePurchaseOrders() {
  const term = purchaseOrderSearch.trim().toLowerCase();
  if (!term) {
    return purchaseOrders;
  }

  return purchaseOrders.filter((order) => {
    return [order.id, getVendorName(order.vendorId, order.supplier)]
      .some((value) => String(value).toLowerCase().includes(term));
  });
}

function getPaginatedRows(listKey, rows) {
  // Pagination is applied after filtering, so searches page through only matching rows.
  const pageCount = getPageCount(rows.length);
  const page = clampPage(listPagination[listKey] || 1, pageCount);
  if (page !== listPagination[listKey]) {
    listPagination[listKey] = page;
  }

  const start = (page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

function renderPagination(listKey, totalRows) {
  const pageCount = getPageCount(totalRows);
  const page = clampPage(listPagination[listKey] || 1, pageCount);
  const firstRow = (page - 1) * pageSize + 1;
  const lastRow = Math.min(page * pageSize, totalRows);

  return `
    <div class="pagination" data-pagination="${listKey}">
      <span>Showing ${firstRow.toLocaleString()}-${lastRow.toLocaleString()} of ${totalRows.toLocaleString()}</span>
      <div class="pagination-actions">
        <button class="secondary-action small" data-page-list="${listKey}" data-page-direction="previous" type="button" ${page <= 1 ? "disabled" : ""}>Previous</button>
        <strong>Page ${page.toLocaleString()} of ${pageCount.toLocaleString()}</strong>
        <button class="secondary-action small" data-page-list="${listKey}" data-page-direction="next" type="button" ${page >= pageCount ? "disabled" : ""}>Next</button>
      </div>
    </div>
  `;
}

function getPageCount(totalRows) {
  return Math.max(Math.ceil(totalRows / pageSize), 1);
}

function clampPage(page, pageCount) {
  return Math.min(Math.max(Number(page) || 1, 1), pageCount);
}

function getLowStockProducts() {
  return products
    .filter((product) => Number(product.stock || 0) < Number(product.lowStockThreshold || 0))
    .sort((first, second) => Number(first.stock || 0) - Number(second.stock || 0));
}

function getMonthlySalesReport() {
  // Monthly sales are grouped by invoice issue month because invoices are created at confirmation.
  const rowsByMonth = salesOrders
    .filter((order) => order.status === "Confirmed")
    .filter((order) => canViewReportForOrder(order))
    .filter((order) => isSalesOrderInReportDateRange(order))
    .reduce((totals, order) => {
      const monthKey = getSalesOrderMonthKey(order);
      if (!monthKey) {
        return totals;
      }

      const existing = totals[monthKey] || {
        monthKey,
        monthLabel: formatMonthLabel(monthKey),
        orderCount: 0,
        totalSales: 0,
      };

      existing.orderCount += 1;
      existing.totalSales += getSalesOrderTotal(order);
      totals[monthKey] = existing;
      return totals;
    }, {});

  return Object.values(rowsByMonth).sort((first, second) => second.monthKey.localeCompare(first.monthKey));
}

function getSalesOrderMonthKey(order) {
  const invoice = invoices.find((item) => item.salesOrderId === order.id);
  return invoice?.issueDate ? invoice.issueDate.slice(0, 7) : "";
}

function isSalesOrderInReportDateRange(order) {
  const invoice = invoices.find((item) => item.salesOrderId === order.id);
  if (!invoice?.issueDate || isInvalidReportDateRange()) {
    return false;
  }

  if (reportStartDate && invoice.issueDate < reportStartDate) {
    return false;
  }

  if (reportEndDate && invoice.issueDate > reportEndDate) {
    return false;
  }

  return true;
}

function isReportDateFiltered() {
  return Boolean(reportStartDate || reportEndDate);
}

function isInvalidReportDateRange() {
  return Boolean(reportStartDate && reportEndDate && reportStartDate > reportEndDate);
}

function canViewReportForOrder(order) {
  // Staff report access is scoped to records they created; Manager and Admin roles see all.
  return canViewAllReports() || order.createdBy === business.user;
}

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function exportMonthlySalesXlsx() {
  const rows = getMonthlySalesReport();
  if (!rows.length) {
    return;
  }

  const workbook = buildMonthlySalesWorkbook(rows);
  const blob = new Blob([workbook], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "monthly-sales-report.xlsx";
  link.click();
  URL.revokeObjectURL(url);
}

function buildMonthlySalesWorkbook(rows) {
  const worksheetRows = [
    ["Month", "Confirmed Orders", "Total Sales"],
    ...rows.map((row) => [row.monthLabel, row.orderCount, Number(row.totalSales.toFixed(2))]),
  ];
  const worksheet = buildWorksheetXml(worksheetRows);

  return buildZipArchive([
    {
      name: "[Content_Types].xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`,
    },
    {
      name: "_rels/.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,
    },
    {
      name: "xl/workbook.xml",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Monthly Sales" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`,
    },
    {
      name: "xl/_rels/workbook.xml.rels",
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`,
    },
    {
      name: "xl/worksheets/sheet1.xml",
      content: worksheet,
    },
  ]);
}

function buildWorksheetXml(rows) {
  const sheetData = rows.map((row, rowIndex) => {
    const rowNumber = rowIndex + 1;
    const cells = row.map((value, columnIndex) => buildWorksheetCell(value, columnIndex, rowNumber)).join("");
    return `<row r="${rowNumber}">${cells}</row>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <cols>
    <col min="1" max="1" width="20" customWidth="1"/>
    <col min="2" max="2" width="18" customWidth="1"/>
    <col min="3" max="3" width="14" customWidth="1"/>
  </cols>
  <sheetData>${sheetData}</sheetData>
</worksheet>`;
}

function buildWorksheetCell(value, columnIndex, rowNumber) {
  const reference = `${getExcelColumnName(columnIndex)}${rowNumber}`;
  if (typeof value === "number") {
    return `<c r="${reference}"><v>${value}</v></c>`;
  }

  return `<c r="${reference}" t="inlineStr"><is><t>${escapeXml(value)}</t></is></c>`;
}

function getExcelColumnName(index) {
  let column = "";
  let current = index + 1;

  while (current > 0) {
    const remainder = (current - 1) % 26;
    column = String.fromCharCode(65 + remainder) + column;
    current = Math.floor((current - 1) / 26);
  }

  return column;
}

function buildZipArchive(files) {
  // XLSX files are ZIP archives; using stored entries keeps export dependency-free.
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  files.forEach((file) => {
    const nameBytes = encodeText(file.name);
    const contentBytes = encodeText(file.content);
    const checksum = crc32(contentBytes);
    const localHeader = buildZipLocalHeader(nameBytes, checksum, contentBytes.length);
    const centralHeader = buildZipCentralHeader(nameBytes, checksum, contentBytes.length, offset);

    localParts.push(localHeader, nameBytes, contentBytes);
    centralParts.push(centralHeader, nameBytes);
    offset += localHeader.length + nameBytes.length + contentBytes.length;
  });

  const centralSize = centralParts.reduce((total, part) => total + part.length, 0);
  const endRecord = buildZipEndRecord(files.length, centralSize, offset);
  return concatBytes([...localParts, ...centralParts, endRecord]);
}

function buildZipLocalHeader(nameBytes, checksum, size) {
  const header = new Uint8Array(30);
  writeUint32(header, 0, 0x04034b50);
  writeUint16(header, 4, 20);
  writeUint16(header, 6, 0);
  writeUint16(header, 8, 0);
  writeUint16(header, 10, 0);
  writeUint16(header, 12, 0);
  writeUint32(header, 14, checksum);
  writeUint32(header, 18, size);
  writeUint32(header, 22, size);
  writeUint16(header, 26, nameBytes.length);
  writeUint16(header, 28, 0);
  return header;
}

function buildZipCentralHeader(nameBytes, checksum, size, offset) {
  const header = new Uint8Array(46);
  writeUint32(header, 0, 0x02014b50);
  writeUint16(header, 4, 20);
  writeUint16(header, 6, 20);
  writeUint16(header, 8, 0);
  writeUint16(header, 10, 0);
  writeUint16(header, 12, 0);
  writeUint16(header, 14, 0);
  writeUint32(header, 16, checksum);
  writeUint32(header, 20, size);
  writeUint32(header, 24, size);
  writeUint16(header, 28, nameBytes.length);
  writeUint16(header, 30, 0);
  writeUint16(header, 32, 0);
  writeUint16(header, 34, 0);
  writeUint16(header, 36, 0);
  writeUint32(header, 38, 0);
  writeUint32(header, 42, offset);
  return header;
}

function buildZipEndRecord(fileCount, centralSize, centralOffset) {
  const record = new Uint8Array(22);
  writeUint32(record, 0, 0x06054b50);
  writeUint16(record, 4, 0);
  writeUint16(record, 6, 0);
  writeUint16(record, 8, fileCount);
  writeUint16(record, 10, fileCount);
  writeUint32(record, 12, centralSize);
  writeUint32(record, 16, centralOffset);
  writeUint16(record, 20, 0);
  return record;
}

function crc32(bytes) {
  let checksum = 0xffffffff;

  bytes.forEach((byte) => {
    checksum = (checksum >>> 8) ^ crc32Table[(checksum ^ byte) & 0xff];
  });

  return (checksum ^ 0xffffffff) >>> 0;
}

const crc32Table = Array.from({ length: 256 }, (_, index) => {
  let checksum = index;

  for (let bit = 0; bit < 8; bit += 1) {
    checksum = checksum & 1 ? 0xedb88320 ^ (checksum >>> 1) : checksum >>> 1;
  }

  return checksum >>> 0;
});

function encodeText(value) {
  return new TextEncoder().encode(value);
}

function concatBytes(parts) {
  const totalLength = parts.reduce((total, part) => total + part.length, 0);
  const output = new Uint8Array(totalLength);
  let offset = 0;

  parts.forEach((part) => {
    output.set(part, offset);
    offset += part.length;
  });

  return output;
}

function writeUint16(bytes, offset, value) {
  bytes[offset] = value & 0xff;
  bytes[offset + 1] = (value >>> 8) & 0xff;
}

function writeUint32(bytes, offset, value) {
  bytes[offset] = value & 0xff;
  bytes[offset + 1] = (value >>> 8) & 0xff;
  bytes[offset + 2] = (value >>> 16) & 0xff;
  bytes[offset + 3] = (value >>> 24) & 0xff;
}

function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function nextCustomerId() {
  const nextNumber = customers.reduce((highest, customer) => {
    const value = Number(String(customer.id).replace("CUS-", ""));
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 1000) + 1;

  return `CUS-${nextNumber}`;
}

function nextVendorId() {
  const nextNumber = vendors.reduce((highest, vendor) => {
    const value = Number(String(vendor.id).replace("VEN-", ""));
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 1000) + 1;

  return `VEN-${nextNumber}`;
}

function nextProductId() {
  const nextNumber = products.reduce((highest, product) => {
    const value = Number(String(product.id).replace("PRD-", ""));
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 1000) + 1;

  return `PRD-${nextNumber}`;
}

function nextSalesOrderId() {
  const nextNumber = salesOrders.reduce((highest, order) => {
    const value = Number(String(order.id).replace("SO-", ""));
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 1000) + 1;

  return `SO-${nextNumber}`;
}

function nextInvoiceId() {
  const nextNumber = invoices.reduce((highest, invoice) => {
    const value = Number(String(invoice.id).replace("INV-", ""));
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 1000) + 1;

  return `INV-${nextNumber}`;
}

function nextPaymentId(invoice) {
  const nextNumber = (invoice.payments || []).reduce((highest, payment) => {
    const value = Number(String(payment.id).replace("PAY-", ""));
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 0) + 1;

  return `PAY-${String(nextNumber).padStart(3, "0")}`;
}

function nextAuditLogId() {
  const nextNumber = auditLog.reduce((highest, entry) => {
    const value = Number(String(entry.id).replace("AUD-", ""));
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 0) + 1;

  return `AUD-${String(nextNumber).padStart(4, "0")}`;
}

function nextPurchaseOrderId() {
  const nextNumber = purchaseOrders.reduce((highest, order) => {
    const value = Number(String(order.id).replace("PO-", ""));
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 1000) + 1;

  return `PO-${nextNumber}`;
}

function renderTable(columns, rows) {
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>${columns.map((column) => `<th>${column}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderStockItem(item) {
  const percentage = Math.min(Math.round((item.stock / item.reorder) * 100), 160);
  return `
    <div class="stock-item">
      <div>
        <strong>${item.item}</strong>
        <span>${item.sku} - ${item.stock} on hand</span>
      </div>
      <div class="stock-meter" aria-label="${item.item} stock level">
        <span style="width: ${percentage}%"></span>
      </div>
      <small class="${item.status === "Healthy" ? "good" : item.status === "Watch" ? "warn" : "danger"}">${item.status}</small>
    </div>
  `;
}

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleString("en-US", {
    month: "2-digit",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function getCustomerName(customerId) {
  return customers.find((customer) => customer.id === customerId)?.name || "Unknown Customer";
}

function getVendorName(vendorId, fallback = "Unknown Vendor") {
  return vendors.find((vendor) => vendor.id === vendorId)?.name || fallback || "Unknown Vendor";
}

function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

function getSalesOrderTotal(order) {
  return order.lines.reduce((total, line) => {
    const product = getProduct(line.productId);
    return total + (product ? product.price * line.quantity : 0);
  }, 0);
}

function getPurchaseOrderUnits(order) {
  return order.lines.reduce((total, line) => total + Number(line.quantity || 0), 0);
}

function getInvoicePaidAmount(invoice) {
  return (invoice.payments || []).reduce((total, payment) => total + Number(payment.amount || 0), 0);
}

function getInvoiceBalance(invoice) {
  return Math.max(Number(invoice.amount || 0) - getInvoicePaidAmount(invoice), 0);
}

function getInvoicePaymentStatus(invoice) {
  const paidAmount = getInvoicePaidAmount(invoice);
  if (paidAmount <= 0) {
    return "Unpaid";
  }

  if (paidAmount >= Number(invoice.amount || 0)) {
    return "Paid";
  }

  return "Partially Paid";
}

function getPaymentMethods() {
  return ["Cash", "Bank Transfer"];
}

function getUserRoles() {
  return ["Admin", "Manager", "Staff"];
}

function canDeleteMasterData() {
  // Managers can maintain master data, but user account management remains Admin-only.
  return ["Admin", "Manager"].includes(currentRole);
}

function canManageUserAccounts() {
  return currentRole === "Admin";
}

function canViewAllReports() {
  return ["Admin", "Manager"].includes(currentRole);
}

function getStatusClass(status) {
  if (status === "Current") {
    return "good-bg";
  }
  if (status === "Payment due") {
    return "warn-bg";
  }
  if (status === "On hold") {
    return "danger-bg";
  }
  return "neutral-bg";
}

function getVendorStatusClass(status) {
  if (status === "Active") {
    return "good-bg";
  }
  if (status === "On hold") {
    return "danger-bg";
  }
  return "neutral-bg";
}

function getPaymentStatusClass(status) {
  if (status === "Paid") {
    return "good-bg";
  }

  if (status === "Partially Paid") {
    return "warn-bg";
  }

  return "neutral-bg";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

render();
