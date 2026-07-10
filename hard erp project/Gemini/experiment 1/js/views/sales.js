/* ==========================================================================
   Nexus ERP - Sales Orders & Invoices View Module (ES Module)
   ==========================================================================
   
   BILLING & INVOICING CORE LOGIC:
   
   1. Automatic Invoice Generation:
      - Whenever a sales order is confirmed, the system deducts quantities from
        inventory stock and immediately compiles a corresponding commercial invoice.
        
   2. Due Date Calculation:
      - Invoices are automatically configured with a strict Net-15 days terms payment period.
      - Due Date = Invoice Creation Date + 15 Days.
      
   3. Invoice Payment Statuses:
      - UNPAID: Initial state of invoice after generation (unless paid instantly).
      - PARTIALLY PAID: Invoice has one or more partial payments recorded, but the sum
                        of payments is less than the total gross billing amount.
      - PAID: Cumulative amount paid is equal to or greater than the total invoice cost.
      
   4. Acceptable Payment Methods:
      - Supported: Cash, Bank Transfer.
      - Credit Cards are not accepted.
   ========================================================================== */

export class SalesView {
    constructor(app) {
        this.app = app;
        this.searchQuery = '';
        this.statusFilter = 'all';
        this.currentCart = []; // Temporary cart buffer when creating a sales order
        this.currentPage = 1;
        this.itemsPerPage = 5;
    }

    init() {
        this.renderLayout();
        this.renderStats();
        this.renderSalesTable();
        this.setupEventListeners();
    }

    renderLayout() {
        const html = `
            <div class="page-header">
                <div class="page-title">
                    <h1>Sales Orders</h1>
                    <p>Create sales orders, track client invoices, and view billing details</p>
                </div>
                <button class="btn btn-primary" id="add-sale-btn">
                    <i data-lucide="plus"></i> Create Sales Order
                </button>
            </div>
            
            <!-- Statistics Section -->
            <div class="stats-grid" id="sales-stats">
                <!-- Stats populated dynamically -->
            </div>

            <!-- Action / Filter Bar -->
            <div class="card" style="padding: 16px;">
                <div class="action-bar">
                    <div class="search-input-wrapper">
                        <i data-lucide="search"></i>
                        <input type="text" id="sales-search" placeholder="Search by Invoice # or Customer..." value="${this.searchQuery}">
                    </div>
                    
                    <div class="filter-actions">
                        <select class="select-custom" id="sales-status-filter">
                            <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>All Orders</option>
                            <option value="unpaid" ${this.statusFilter === 'unpaid' ? 'selected' : ''}>Unpaid</option>
                            <option value="partially_paid" ${this.statusFilter === 'partially_paid' ? 'selected' : ''}>Partially Paid</option>
                            <option value="paid" ${this.statusFilter === 'paid' ? 'selected' : ''}>Paid</option>
                            <option value="cancelled" ${this.statusFilter === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Main Table Card -->
            <div class="card" style="padding: 0; overflow: hidden;">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Invoice Number</th>
                                <th>Customer</th>
                                <th>Order Date</th>
                                <th class="text-right">Items Count</th>
                                <th class="text-right">Total Amount</th>
                                <th>Status</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="sales-table-body">
                            <!-- Rows populated dynamically -->
                        </tbody>
                    </table>
                </div>
                <div id="sales-pagination"></div>
            </div>
        `;
        this.app.render(html);
    }

    renderStats() {
        const sales = this.app.state.sales;
        const totalOrders = sales.length;
        const totalRevenue = sales.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.total, 0);
        const pendingCount = sales.filter(s => s.status === 'unpaid' || s.status === 'partially_paid' || s.status === 'pending').length;
        const paidCount = sales.filter(s => s.status === 'paid').length;

        const statsHtml = `
            <div class="stat-card">
                <div class="stat-info">
                    <span>Total Revenue (Paid)</span>
                    <h3>$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    <div class="stat-trend up">
                        <i data-lucide="trending-up" style="width: 10px; height: 10px;"></i>
                        <span>Cleared funds</span>
                    </div>
                </div>
                <div class="stat-icon success">
                    <i data-lucide="dollar-sign"></i>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-info">
                    <span>Sales Volume</span>
                    <h3>${totalOrders}</h3>
                    <div class="stat-trend up">
                        <i data-lucide="shopping-cart" style="width: 10px; height: 10px;"></i>
                        <span>Orders Issued</span>
                    </div>
                </div>
                <div class="stat-icon primary">
                    <i data-lucide="shopping-bag"></i>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-info">
                    <span>Paid Invoices</span>
                    <h3>${paidCount}</h3>
                    <div class="stat-trend up">
                        <i data-lucide="check-circle" style="width: 10px; height: 10px;"></i>
                        <span>Settled orders</span>
                    </div>
                </div>
                <div class="stat-icon info">
                    <i data-lucide="file-check"></i>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-info">
                    <span>Pending Invoices</span>
                    <h3>${pendingCount}</h3>
                    <div class="stat-trend ${pendingCount > 0 ? 'warning' : 'up'}" style="color: ${pendingCount > 0 ? 'var(--accent-warning)' : 'var(--accent-success)'}; background: ${pendingCount > 0 ? 'var(--accent-warning-bg)' : 'var(--accent-success-bg)'};">
                        <i data-lucide="clock" style="width: 10px; height: 10px;"></i>
                        <span>${pendingCount > 0 ? 'Awaiting payment' : 'No backlog'}</span>
                    </div>
                </div>
                <div class="stat-icon ${pendingCount > 0 ? 'warning' : 'info'}">
                    <i data-lucide="clock"></i>
                </div>
            </div>
        `;
        
        const statsContainer = document.getElementById('sales-stats');
        if (statsContainer) {
            statsContainer.innerHTML = statsHtml;
        }
    }

    renderSalesTable() {
        const tbody = document.getElementById('sales-table-body');
        if (!tbody) return;

        let filtered = this.app.state.sales;

        // Apply Search Filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase().trim();
            filtered = filtered.filter(s => 
                s.invoiceNumber.toLowerCase().includes(query) || 
                s.customerName.toLowerCase().includes(query)
            );
        }

        // Apply Status Filter
        if (this.statusFilter !== 'all') {
            filtered = filtered.filter(s => s.status === this.statusFilter);
        }

        // Sort by date desc
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        <div class="empty-state" style="padding: 40px 0;">
                            <i data-lucide="receipt" style="width: 40px; height: 40px; stroke-width: 1.5; color: var(--text-muted);"></i>
                            <h3>No sales orders found</h3>
                            <p>Try resetting filters or record a new sales invoice.</p>
                        </div>
                    </td>
                </tr>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }

        // Pagination Calculations
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage) || 1;
        if (this.currentPage > totalPages) this.currentPage = totalPages;
        if (this.currentPage < 1) this.currentPage = 1;
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const paginated = filtered.slice(startIndex, startIndex + this.itemsPerPage);

        tbody.innerHTML = paginated.map(s => {
            const dateStr = new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const itemsCount = s.items.reduce((sum, item) => sum + item.quantity, 0);
            
            let statusBadge = 'badge-success'; // Paid
            let statusText = 'Paid';
            if (s.status === 'unpaid') {
                statusBadge = 'badge-danger';
                statusText = 'Unpaid';
            } else if (s.status === 'partially_paid') {
                statusBadge = 'badge-warning';
                statusText = 'Partially Paid';
            } else if (s.status === 'pending') {
                statusBadge = 'badge-danger';
                statusText = 'Unpaid';
            } else if (s.status === 'cancelled') {
                statusBadge = 'badge-secondary';
                statusText = 'Cancelled';
            }

            const isAdmin = this.app.state.currentUser.role === 'admin';

            return `
                <tr>
                    <td style="font-weight: 600; color: var(--text-primary);">${s.invoiceNumber}</td>
                    <td>${s.customerName}</td>
                    <td>${dateStr}</td>
                    <td class="text-right" style="font-weight: 500; color: var(--text-secondary);">${itemsCount}</td>
                    <td class="text-right" style="font-weight: 600; color: var(--text-primary);">$${s.total.toFixed(2)}</td>
                    <td>
                        <span class="badge-pill ${statusBadge}">
                            ${statusText}
                        </span>
                    </td>
                    <td class="text-right">
                        <div class="flex gap-2 justify-end" style="justify-content: flex-end;">
                            <button class="btn-icon-sm view" title="View Invoice" data-id="${s.id}">
                                <i data-lucide="eye"></i>
                            </button>
                            ${isAdmin ? `
                                <button class="btn-icon-sm edit" title="Cancel/Change Status" data-id="${s.id}">
                                    <i data-lucide="sliders"></i>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Render Pagination Controls
        const pagEl = document.getElementById('sales-pagination');
        if (pagEl) {
            if (filtered.length <= this.itemsPerPage) {
                pagEl.innerHTML = '';
            } else {
                pagEl.innerHTML = `
                    <div class="pagination-bar" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; border-top: 1px solid var(--border-color); background: rgba(0,0,0,0.015);">
                        <div style="font-size: 13px; color: var(--text-muted);">
                            Showing <span style="font-weight: 600; color: var(--text-primary);">${startIndex + 1}</span> to 
                            <span style="font-weight: 600; color: var(--text-primary);">${Math.min(startIndex + this.itemsPerPage, totalItems)}</span> of 
                            <span style="font-weight: 600; color: var(--text-primary);">${totalItems}</span> entries
                        </div>
                        <div style="display: flex; gap: 6px;">
                            <button class="btn btn-secondary pagination-btn prev" ${this.currentPage === 1 ? 'disabled' : ''} style="padding: 5px 10px; font-size: 11px; height: auto;">
                                Previous
                            </button>
                            ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => `
                                <button class="btn ${this.currentPage === page ? 'btn-primary' : 'btn-secondary'} pagination-btn page-num" data-page="${page}" style="padding: 5px 10px; font-size: 11px; height: auto; min-width: 28px;">
                                    ${page}
                                </button>
                            `).join('')}
                            <button class="btn btn-secondary pagination-btn next" ${this.currentPage === totalPages ? 'disabled' : ''} style="padding: 5px 10px; font-size: 11px; height: auto;">
                                Next
                            </button>
                        </div>
                    </div>
                `;
            }
        }

        if (window.lucide) lucide.createIcons();
    }

    setupEventListeners() {
        // Create order button
        const addBtn = document.getElementById('add-sale-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openCreateOrderModal());
        }

        // Live Search
        const searchInput = document.getElementById('sales-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.currentPage = 1;
                this.renderSalesTable();
            });
        }

        // Status Filter
        const filterSelect = document.getElementById('sales-status-filter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.statusFilter = e.target.value;
                this.currentPage = 1;
                this.renderSalesTable();
            });
        }

        // Action Buttons delegation (view/edit)
        const tbody = document.getElementById('sales-table-body');
        if (tbody) {
            tbody.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;

                const saleId = btn.getAttribute('data-id');
                if (!saleId) return;

                if (btn.classList.contains('view')) {
                    this.viewInvoiceDetails(saleId);
                } else if (btn.classList.contains('edit')) {
                    if (this.app.state.currentUser.role !== 'admin') {
                        this.app.showToast('Access Denied: Staff accounts cannot change order status directly.', 'error');
                        return;
                    }
                    this.openStatusSettingsModal(saleId);
                }
            });
        }

        // Pagination clicks
        const pagContainer = document.getElementById('sales-pagination');
        if (pagContainer) {
            pagContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.pagination-btn');
                if (!btn) return;

                if (btn.classList.contains('prev') && this.currentPage > 1) {
                    this.currentPage--;
                    this.renderSalesTable();
                } else if (btn.classList.contains('next') && this.currentPage < Math.ceil(this.app.state.sales.length / this.itemsPerPage)) {
                    this.currentPage++;
                    this.renderSalesTable();
                } else if (btn.classList.contains('page-num')) {
                    this.currentPage = parseInt(btn.getAttribute('data-page'));
                    this.renderSalesTable();
                }
            });
        }
    }

    // --- Modal Create Sales Order ---
    openCreateOrderModal() {
        this.currentCart = []; // Clear temporary cart
        const customers = this.app.state.customers.filter(c => c.status === 'active');
        const products = this.app.state.inventory;

        if (customers.length === 0) {
            this.app.showToast('Please register an active customer before recording sales.', 'warning');
            return;
        }

        if (products.length === 0) {
            this.app.showToast('Please register catalog products before recording sales.', 'warning');
            return;
        }

        const invoiceNumber = `INV-${1000 + this.app.state.sales.length + 1}`;

        const contentHtml = `
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <!-- Customer Selection -->
                <div class="form-group">
                    <label for="order-customer">Select Customer *</label>
                    <select id="order-customer">
                        ${customers.map(c => `<option value="${c.id}">${c.name} (${c.company || 'Retail'})</option>`).join('')}
                    </select>
                </div>

                <div class="divider" style="width: 100%; height: 1px; margin: 4px 0;"></div>

                <!-- Product Add Sub-form -->
                <div style="background: rgba(255, 255, 255, 0.02); border: 1px dashed var(--border-color); border-radius: var(--border-radius-md); padding: 16px;">
                    <h3 style="font-size: 13.5px; font-weight: 700; margin-bottom: 12px; color: var(--text-secondary); text-transform: uppercase;">
                        Add Product Item
                    </h3>
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; align-items: flex-end;">
                        <div class="form-group" style="margin-bottom: 0;">
                            <label for="order-product">Select SKU</label>
                            <select id="order-product">
                                ${products.map(p => `<option value="${p.id}" data-price="${p.price}" data-stock="${p.stock}">
                                    ${p.name} - $${p.price.toFixed(2)} (${p.stock} left)
                                </option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label for="order-qty">Qty</label>
                            <input type="number" id="order-qty" value="1" min="1" step="1">
                        </div>
                        <button class="btn btn-secondary" id="add-to-cart-btn" style="height: 44px; margin-bottom: 0;">
                            Add Item
                        </button>
                    </div>
                </div>

                <!-- Cart Items Table -->
                <div>
                    <h3 style="font-size: 13.5px; font-weight: 700; margin-bottom: 8px; color: var(--text-secondary); text-transform: uppercase;">
                        Order Items Table
                    </h3>
                    <div class="table-container" style="border: 1px solid var(--border-color); border-radius: var(--border-radius-md); background: rgba(0,0,0,0.15); max-height: 180px; overflow-y: auto;">
                        <table style="width: 100%;">
                            <thead>
                                <tr>
                                    <th style="padding: 8px 12px; font-size: 11px;">Product</th>
                                    <th style="padding: 8px 12px; font-size: 11px; text-align: right;">Price</th>
                                    <th style="padding: 8px 12px; font-size: 11px; text-align: right;">Qty</th>
                                    <th style="padding: 8px 12px; font-size: 11px; text-align: right;">Total</th>
                                    <th style="padding: 8px 12px; font-size: 11px; text-align: right;"></th>
                                </tr>
                            </thead>
                            <tbody id="cart-table-body">
                                <tr>
                                    <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">
                                        Add items to list above
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Totals Breakdown -->
                <div style="background: rgba(255,255,255,0.01); border-top: 1px solid var(--border-color); padding: 12px 0; display: flex; flex-direction: column; gap: 8px; align-items: flex-end; font-size: 13.5px;">
                    <div style="display: flex; gap: 40px; justify-content: space-between; width: 220px; color: var(--text-secondary);">
                        <span>Subtotal:</span>
                        <strong id="cart-subtotal">$0.00</strong>
                    </div>
                    <div style="display: flex; gap: 40px; justify-content: space-between; width: 220px; color: var(--text-secondary);">
                        <span>Tax (8%):</span>
                        <strong id="cart-tax">$0.00</strong>
                    </div>
                    <div style="display: flex; gap: 40px; justify-content: space-between; width: 220px; color: var(--text-primary); font-size: 16px; border-top: 1px dashed var(--border-color); padding-top: 8px;">
                        <span>Order Total:</span>
                        <strong id="cart-total">$0.00</strong>
                    </div>
                </div>

                <!-- Payment Status -->
                <div class="form-group">
                    <label for="order-status">Initial Payment Status</label>
                    <select id="order-status">
                        <option value="unpaid">Unpaid</option>
                        <option value="partially_paid">Partially Paid</option>
                        <option value="paid">Paid</option>
                    </select>
                </div>
            </div>
        `;

        this.app.openModal('Draft New Sales Order', contentHtml, () => {
            // Save logic
            if (this.currentCart.length === 0) {
                this.app.showToast('Order must contain at least one product item.', 'warning');
                return;
            }

            const customerId = document.getElementById('order-customer').value;
            const selectedCust = this.app.state.customers.find(c => c.id === customerId);
            const initialStatus = document.getElementById('order-status').value;

            // Compute math
            const subtotal = this.currentCart.reduce((sum, item) => sum + item.total, 0);
            const tax = subtotal * 0.08;
            const total = subtotal + tax;

            // Deduct stock levels and save changes
            let stockCheckOk = true;
            let stockAlerts = [];

            this.currentCart.forEach(cartItem => {
                const catalogItem = this.app.state.inventory.find(p => p.id === cartItem.productId);
                if (!catalogItem) {
                    stockCheckOk = false;
                    stockAlerts.push(`Product "${cartItem.name}" no longer exists in catalog`);
                } else if (catalogItem.stock < cartItem.quantity) {
                    stockCheckOk = false;
                    stockAlerts.push(`Insufficient stock for "${catalogItem.name}" (Requested: ${cartItem.quantity}, Available: ${catalogItem.stock})`);
                }
            });

            if (!stockCheckOk) {
                this.app.showToast(stockAlerts.join('. '), 'error');
                return;
            }

            // Perform deductions
            this.currentCart.forEach(cartItem => {
                const catalogItem = this.app.state.inventory.find(p => p.id === cartItem.productId);
                if (catalogItem) {
                    catalogItem.stock -= cartItem.quantity;
                }
            });
            this.app.saveState('inventory');

            // Save new sales order
            const newOrder = {
                id: `sale-${Date.now()}`,
                invoiceNumber,
                customerId,
                customerName: selectedCust.name,
                date: new Date().toISOString(),
                items: this.currentCart.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                subtotal,
                tax,
                total,
                status: initialStatus,
                createdBy: this.app.state.currentUser.name
            };

            this.app.state.sales.push(newOrder);
            this.app.saveState('sales');
            this.app.logEvent('sales_order_confirmed', `Confirmed Sales Order ${invoiceNumber} for client ${selectedCust.name} (Total: $${total.toFixed(2)})`);
            this.app.logEvent('invoice_generated', `Generated commercial invoice billing sheet for ${invoiceNumber}`);
            this.app.showToast(`Order ${invoiceNumber} created successfully.`, 'success');
            
            this.app.closeModal();
            this.renderStats();
            this.renderSalesTable();

            // Automatically generate/open invoice details modal immediately on confirmation
            setTimeout(() => {
                this.viewInvoiceDetails(newOrder.id);
            }, 300);
        }, {
            saveLabel: 'Generate Order Invoice',
            subtitle: `Assigned: ${invoiceNumber}`
        });

        // Add sub-form click handler
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const selectElement = document.getElementById('order-product');
                const selectedOption = selectElement.options[selectElement.selectedIndex];
                
                const productId = selectElement.value;
                const name = selectedOption.text.split(' - ')[0];
                const price = parseFloat(selectedOption.getAttribute('data-price'));
                const catalogItem = this.app.state.inventory.find(item => item.id === productId);
                
                const stock = catalogItem ? catalogItem.stock : 0;

                const qty = parseInt(document.getElementById('order-qty').value, 10);

                if (isNaN(qty) || qty <= 0) {
                    this.app.showToast('Please specify a positive item quantity.', 'warning');
                    return;
                }

                // Check stock against what is already added to cart + requested qty
                const existingInCart = this.currentCart.find(item => item.productId === productId);
                const totalRequested = (existingInCart ? existingInCart.quantity : 0) + qty;

                if (totalRequested > stock) {
                    this.app.showToast(`Cannot add items. Quantity exceeds available stock (${stock} left in catalog).`, 'warning');
                    return;
                }

                if (existingInCart) {
                    existingInCart.quantity += qty;
                    existingInCart.total = existingInCart.quantity * existingInCart.price;
                } else {
                    this.currentCart.push({
                        productId,
                        name,
                        price,
                        quantity: qty,
                        total: qty * price
                    });
                }

                this.renderCartTable();
                this.app.showToast(`Added "${name}" (x${qty}) to draft.`, 'success');
            });
        }
    }

    renderCartTable() {
        const tbody = document.getElementById('cart-table-body');
        if (!tbody) return;

        if (this.currentCart.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">
                        Add items to list above
                    </td>
                </tr>
            `;
            this.updateCartTotals(0);
            return;
        }

        tbody.innerHTML = this.currentCart.map((item, index) => {
            return `
                <tr>
                    <td style="padding: 10px 12px; font-size: 13px; color: var(--text-primary); font-weight: 500;">${item.name}</td>
                    <td style="padding: 10px 12px; font-size: 13px; text-align: right;">$${item.price.toFixed(2)}</td>
                    <td style="padding: 10px 12px; font-size: 13px; text-align: right;">${item.quantity}</td>
                    <td style="padding: 10px 12px; font-size: 13px; text-align: right; font-weight: 600; color: var(--text-primary);">$${item.total.toFixed(2)}</td>
                    <td style="padding: 10px 12px; text-align: right;">
                        <button class="btn-icon-sm delete" style="width: 24px; height: 24px; border-radius: 4px;" data-cart-index="${index}" title="Remove Item">
                            <i data-lucide="minus-circle" style="width: 12px; height: 12px;"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();

        // Attach cart remove handlers
        tbody.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                const idx = parseInt(target.getAttribute('data-cart-index'), 10);
                const removedItem = this.currentCart[idx];
                this.currentCart.splice(idx, 1);
                this.renderCartTable();
                this.app.showToast(`Removed "${removedItem.name}" from draft list.`, 'info');
            });
        });

        // Update calculations
        const subtotal = this.currentCart.reduce((sum, item) => sum + item.total, 0);
        this.updateCartTotals(subtotal);
    }

    updateCartTotals(subtotal) {
        const tax = subtotal * 0.08;
        const total = subtotal + tax;

        document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    }

    // --- Modal Status Modification (Paid/Cancelled/etc) ---
    openStatusSettingsModal(saleId) {
        const order = this.app.state.sales.find(s => s.id === saleId);
        if (!order) return;

        const contentHtml = `
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <p style="font-size: 14px; color: var(--text-secondary);">
                    Manage invoice billing for order <strong>${order.invoiceNumber}</strong> issued to <strong>${order.customerName}</strong>.
                </p>
                <div class="form-group">
                    <label for="modal-order-status">Update Payment Status</label>
                    <select id="modal-order-status">
                        <option value="unpaid" ${order.status === 'unpaid' ? 'selected' : ''}>Unpaid</option>
                        <option value="partially_paid" ${order.status === 'partially_paid' ? 'selected' : ''}>Partially Paid</option>
                        <option value="paid" ${order.status === 'paid' ? 'selected' : ''}>Paid</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled (Voids inventory effects)</option>
                    </select>
                </div>
                <div style="font-size: 12px; color: var(--text-muted); line-height: 1.5;">
                    <i data-lucide="info" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i>
                    Cancelling an invoice will void the invoice records and refund product quantities back to the stock catalog inventory records automatically.
                </div>
            </div>
        `;

        this.app.openModal('Update Billing Status', contentHtml, () => {
            const nextStatus = document.getElementById('modal-order-status').value;
            
            if (nextStatus === order.status) {
                this.app.closeModal();
                return;
            }

            // Handle inventory replenishment if cancelling
            if (nextStatus === 'cancelled') {
                order.items.forEach(orderItem => {
                    const catalogItem = this.app.state.inventory.find(p => p.id === orderItem.productId);
                    if (catalogItem) {
                        catalogItem.stock += orderItem.quantity;
                    }
                });
                this.app.saveState('inventory');
            } 
            // Re-deduct if reactivating a cancelled order
            else if (order.status === 'cancelled' && nextStatus !== 'cancelled') {
                let stockCheckOk = true;
                let stockAlerts = [];
                
                order.items.forEach(orderItem => {
                    const catalogItem = this.app.state.inventory.find(p => p.id === orderItem.productId);
                    if (catalogItem && catalogItem.stock < orderItem.quantity) {
                        stockCheckOk = false;
                        stockAlerts.push(`SKU "${catalogItem.sku}" stock is insufficient to reactivate (${catalogItem.stock} available, needs ${orderItem.quantity})`);
                    }
                });

                if (!stockCheckOk) {
                    this.app.showToast(`Cannot reactivate: ${stockAlerts.join('. ')}`, 'error');
                    return;
                }

                order.items.forEach(orderItem => {
                    const catalogItem = this.app.state.inventory.find(p => p.id === orderItem.productId);
                    if (catalogItem) {
                        catalogItem.stock -= orderItem.quantity;
                    }
                });
                this.app.saveState('inventory');
            }

            order.status = nextStatus;
            this.app.saveState('sales');
            this.app.showToast(`Order status updated to "${nextStatus.toUpperCase()}"`, 'success');
            
            this.app.closeModal();
            this.renderStats();
            this.renderSalesTable();
        }, {
            saveLabel: 'Update Status',
            subtitle: `Ref: ${order.invoiceNumber}`
        });
    }

    // --- Modal Display Invoice details ---
    viewInvoiceDetails(saleId) {
        const sale = this.app.state.sales.find(s => s.id === saleId);
        if (!sale) return;

        // Fetch customer profile
        const customer = this.app.state.customers.find(c => c.id === sale.customerId);
        const customerCompany = customer ? customer.company : 'Private Client';
        const customerAddress = customer && customer.address 
            ? customer.address.replace(/\n/g, '<br>') 
            : '<span style="color: var(--text-muted); font-style: italic;">No mailing address registered</span>';
        const customerPhone = customer ? customer.phone : 'Not provided';
        const customerEmail = customer ? customer.email : 'Not provided';

        const issueDateObj = new Date(sale.date);
        const saleDate = issueDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        const dueDateObj = new Date(issueDateObj.getTime() + (15 * 24 * 60 * 60 * 1000));
        const dueDate = dueDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        let statusBadgeClass = 'badge-success'; // Paid
        let statusText = 'Paid';
        if (sale.status === 'unpaid' || sale.status === 'pending') {
            statusBadgeClass = 'badge-danger';
            statusText = 'Unpaid';
        } else if (sale.status === 'partially_paid') {
            statusBadgeClass = 'badge-warning';
            statusText = 'Partially Paid';
        } else if (sale.status === 'cancelled') {
            statusBadgeClass = 'badge-secondary';
            statusText = 'Cancelled';
        }

        const contentHtml = `
            <div style="background: rgba(255, 255, 255, 0.015); border: 1px solid var(--border-color); border-radius: var(--border-radius-lg); padding: 32px; font-family: var(--font-primary); color: var(--text-primary);">
                <!-- Invoice Header -->
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 24px; margin-bottom: 24px; align-items: flex-start;">
                    <div>
                        <h3 style="font-size: 24px; font-family: var(--font-headers); font-weight: 700; color: #fff;">NEXUS ERP</h3>
                        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); font-weight: 600;">Commercial Invoice Statement</span>
                    </div>
                    <div style="text-align: right;">
                        <h4 style="font-size: 18px; color: var(--primary-color);">${sale.invoiceNumber}</h4>
                        <span class="badge-pill ${statusBadgeClass}" style="margin-top: 8px;">
                            ${statusText.toUpperCase()}
                        </span>
                    </div>
                </div>

                <!-- Billing Meta Info -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; font-size: 13.5px; line-height: 1.5;">
                    <div>
                        <span style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 8px;">Billed To:</span>
                        <strong style="color: #fff; font-size: 15px;">${sale.customerName}</strong><br>
                        <span style="color: var(--text-secondary);">${customerCompany}</span><br>
                        <span style="color: var(--text-secondary); margin-top: 4px; display: inline-block;">${customerAddress}</span><br>
                        <span style="color: var(--text-muted); font-size: 12px; margin-top: 4px; display: inline-block;">Phone: ${customerPhone} | Email: ${customerEmail}</span>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 8px;">Billing Details:</span>
                        <span style="color: var(--text-secondary)">Date Issued:</span> <strong style="color: #fff">${saleDate}</strong><br>
                        <span style="color: var(--text-secondary)">Due Date:</span> <strong style="color: #fff">${dueDate}</strong><br>
                        <span style="color: var(--text-secondary)">Payment Terms:</span> <strong style="color: #fff">${sale.status === 'paid' ? 'Paid (Immediate Cash)' : 'Net 15 Days'}</strong><br>
                        <span style="color: var(--text-secondary)">Currency:</span> <strong style="color: #fff">USD ($)</strong>
                    </div>
                </div>

                <!-- Product Table -->
                <div style="border: 1px solid var(--border-color); border-radius: var(--border-radius-md); overflow: hidden; margin-bottom: 24px;">
                    <table style="width: 100%;">
                        <thead>
                            <tr style="background: rgba(255,255,255,0.02)">
                                <th style="padding: 10px 14px; font-size: 11px; color: var(--text-muted);">Line Product Description</th>
                                <th style="padding: 10px 14px; font-size: 11px; color: var(--text-muted); text-align: right;">Unit Price</th>
                                <th style="padding: 10px 14px; font-size: 11px; color: var(--text-muted); text-align: right;">Qty</th>
                                <th style="padding: 10px 14px; font-size: 11px; color: var(--text-muted); text-align: right;">Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sale.items.map(item => {
                                return `
                                    <tr>
                                        <td style="padding: 12px 14px; font-size: 13.5px; font-weight: 500; color: #fff;">${item.name}</td>
                                        <td style="padding: 12px 14px; font-size: 13.5px; text-align: right;">$${item.price.toFixed(2)}</td>
                                        <td style="padding: 12px 14px; font-size: 13.5px; text-align: right; color: var(--text-secondary);">${item.quantity}</td>
                                        <td style="padding: 12px 14px; font-size: 13.5px; text-align: right; font-weight: 600; color: #fff;">$${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Summary Breakdown -->
                <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-end; font-size: 13.5px; border-top: 1px solid var(--border-color); padding-top: 16px;">
                    <div style="display: flex; justify-content: space-between; width: 260px; color: var(--text-secondary)">
                        <span>Item Subtotal:</span>
                        <span>$${sale.subtotal.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 260px; color: var(--text-secondary)">
                        <span>Sales Tax (8%):</span>
                        <span>$${sale.tax.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 260px; color: var(--text-secondary); border-top: 1px dashed var(--border-color); padding-top: 8px; margin-top: 4px;">
                        <span>Invoice Grand Total:</span>
                        <span style="font-weight: 600; color: #fff;">$${sale.total.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 260px; color: var(--accent-success)">
                        <span>Total Paid to Date:</span>
                        <span style="font-weight: 600;">$${((sale.payments || []).reduce((sum, p) => sum + p.amount, 0)).toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 260px; color: ${ (sale.total - ((sale.payments || []).reduce((sum, p) => sum + p.amount, 0))) > 0.005 ? 'var(--accent-danger)' : 'var(--text-secondary)' }; font-size: 16px; font-weight: 700; border-top: 1px solid var(--border-color); padding-top: 8px;">
                        <span>Balance Due:</span>
                        <span>$${Math.max(sale.total - ((sale.payments || []).reduce((sum, p) => sum + p.amount, 0)), 0).toFixed(2)}</span>
                    </div>
                    ${(sale.total - ((sale.payments || []).reduce((sum, p) => sum + p.amount, 0)) > 0.005) && sale.status !== 'cancelled' ? `
                        <button class="btn btn-primary" id="open-record-payment-btn" style="margin-top: 16px;">
                            <i data-lucide="plus-circle" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 6px;"></i>
                            Record Client Payment
                        </button>
                    ` : ''}
                </div>

                <!-- Payments Ledger -->
                ${(sale.payments || []).length > 0 ? `
                    <div style="margin-top: 24px; border-top: 1px solid var(--border-color); padding-top: 20px;">
                        <h4 style="font-size: 13.5px; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-bottom: 12px; letter-spacing: 0.5px;">
                            Payment Transaction Ledger
                        </h4>
                        <div class="table-container" style="border: 1px solid var(--border-color); border-radius: var(--border-radius-md); background: rgba(0,0,0,0.15);">
                            <table style="width: 100%; font-size: 12px;">
                                <thead>
                                    <tr style="background: rgba(255,255,255,0.01)">
                                        <th style="padding: 6px 12px;">Date</th>
                                        <th style="padding: 6px 12px;">Payment Method</th>
                                        <th style="padding: 6px 12px;">Notes / Reference</th>
                                        <th style="padding: 6px 12px; text-align: right;">Amount Paid</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${(sale.payments || []).map(p => {
                                        const pDate = new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                        return `
                                            <tr>
                                                <td style="padding: 8px 12px; color: var(--text-secondary);">${pDate}</td>
                                                <td style="padding: 8px 12px; color: var(--text-primary); font-weight: 500;">${p.method}</td>
                                                <td style="padding: 8px 12px; color: var(--text-muted);">${p.notes || '—'}</td>
                                                <td style="padding: 8px 12px; text-align: right; color: var(--accent-success); font-weight: 600;">$${p.amount.toFixed(2)}</td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ` : `
                    <div style="margin-top: 24px; border-top: 1px solid var(--border-color); padding-top: 20px;">
                        <p style="font-size: 12.5px; color: var(--text-muted); text-align: center; font-style: italic; background: rgba(255,255,255,0.01); padding: 12px; border-radius: var(--border-radius-md);">
                            No payment transactions recorded for this invoice yet.
                        </p>
                    </div>
                `}
            </div>
        `;

        this.app.openModal('Client Commercial Invoice', contentHtml, null, {
            subtitle: `ID Reference: ${sale.id}`
        });

        // Register button listener
        const payBtn = document.getElementById('open-record-payment-btn');
        if (payBtn) {
            payBtn.addEventListener('click', () => {
                this.app.closeModal(); // Close the invoice modal
                setTimeout(() => {
                    this.openRecordPaymentModal(saleId);
                }, 300);
            });
        }
    }

    openRecordPaymentModal(saleId) {
        const sale = this.app.state.sales.find(s => s.id === saleId);
        if (!sale) return;

        const payments = sale.payments || [];
        const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
        const balanceDue = Math.max(sale.total - totalPaid, 0);

        const contentHtml = `
            <form id="record-payment-form" onsubmit="event.preventDefault();">
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="font-size: 14.5px; color: var(--text-secondary); line-height: 1.5;">
                        Recording payment transaction for invoice <strong>${sale.invoiceNumber}</strong>.<br>
                        Remaining Balance Due: <strong style="color: var(--accent-danger)">$${balanceDue.toFixed(2)}</strong>
                    </div>

                    <div class="form-group">
                        <label for="pay-amount">Payment Amount ($) *</label>
                        <input type="number" id="pay-amount" value="${balanceDue.toFixed(2)}" min="0.01" max="${balanceDue.toFixed(2)}" step="0.01" required>
                        <small style="color: var(--text-muted); margin-top: 4px; display: block;">Maximum amount is remaining balance due ($${balanceDue.toFixed(2)}).</small>
                    </div>

                    <div class="form-group">
                        <label for="pay-method">Payment Method *</label>
                        <select id="pay-method">
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="pay-date">Payment Date *</label>
                        <input type="date" id="pay-date" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>

                    <div class="form-group">
                        <label for="pay-notes">Notes / Reference / ID</label>
                        <input type="text" id="pay-notes" placeholder="e.g. Check #9042, Transaction receipt #8812">
                    </div>
                </div>
            </form>
        `;

        this.app.openModal('Record Client Payment', contentHtml, () => {
            const amount = parseFloat(document.getElementById('pay-amount').value);
            const method = document.getElementById('pay-method').value;
            const date = document.getElementById('pay-date').value;
            const notes = document.getElementById('pay-notes').value.trim();

            if (isNaN(amount) || amount <= 0 || amount > balanceDue + 0.005) {
                this.app.showToast('Please enter a valid payment amount not exceeding the balance due.', 'warning');
                return;
            }

            // Record payment
            if (!sale.payments) sale.payments = [];
            sale.payments.push({
                id: `pay-${Date.now()}`,
                date: new Date(date).toISOString(),
                amount,
                method,
                notes
            });

            // Re-calculate status
            const newTotalPaid = sale.payments.reduce((sum, p) => sum + p.amount, 0);
            if (newTotalPaid >= sale.total - 0.005) {
                sale.status = 'paid';
            } else if (newTotalPaid > 0) {
                sale.status = 'partially_paid';
            } else {
                sale.status = 'unpaid';
            }

            this.app.saveState('sales');
            this.app.logEvent('payment_recorded', `Recorded payment of $${amount.toFixed(2)} on Invoice ${sale.invoiceNumber} via ${method}`);
            this.app.showToast(`Payment of $${amount.toFixed(2)} recorded successfully.`, 'success');

            this.app.closeModal();
            this.renderStats();
            this.renderSalesTable();

            // Re-open invoice details modal to show updated status and ledger
            setTimeout(() => {
                this.viewInvoiceDetails(saleId);
            }, 300);
        }, {
            saveLabel: 'Record Payment Transaction',
            subtitle: `Ref Invoice: ${sale.invoiceNumber}`
        });
    }
}
