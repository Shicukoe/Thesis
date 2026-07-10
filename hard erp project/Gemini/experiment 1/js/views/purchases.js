/* ==========================================================================
   Nexus ERP - Purchase Orders View Module (ES Module)
   ========================================================================== */

export class PurchaseView {
    constructor(app) {
        this.app = app;
        this.searchQuery = '';
        this.statusFilter = 'all';
        this.currentCart = []; // Temporary purchase cart buffer
        this.currentPage = 1;
        this.itemsPerPage = 5;
    }

    init() {
        this.renderLayout();
        this.renderStats();
        this.renderPurchasesTable();
        this.setupEventListeners();
    }

    renderLayout() {
        const html = `
            <div class="page-header">
                <div class="page-title">
                    <h1>Purchase Orders</h1>
                    <p>Replenish stock catalog, manage supplier acquisitions, and track pending deliveries</p>
                </div>
                <button class="btn btn-primary" id="add-purchase-btn">
                    <i data-lucide="plus"></i> Create Purchase Order
                </button>
            </div>
            
            <!-- Statistics Section -->
            <div class="stats-grid" id="purchases-stats">
                <!-- Stats populated dynamically -->
            </div>

            <!-- Action / Filter Bar -->
            <div class="card" style="padding: 16px;">
                <div class="action-bar">
                    <div class="search-input-wrapper">
                        <i data-lucide="search"></i>
                        <input type="text" id="purchases-search" placeholder="Search by PO # or Supplier..." value="${this.searchQuery}">
                    </div>
                    
                    <div class="filter-actions">
                        <select class="select-custom" id="purchases-status-filter">
                            <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>All Purchase Orders</option>
                            <option value="received" ${this.statusFilter === 'received' ? 'selected' : ''}>Received (Restocked)</option>
                            <option value="ordered" ${this.statusFilter === 'ordered' ? 'selected' : ''}>Ordered (Pending Arrival)</option>
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
                                <th>PO Number</th>
                                <th>Supplier</th>
                                <th>Order Date</th>
                                <th class="text-right">Items Count</th>
                                <th class="text-right">Total Cost</th>
                                <th>Status</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="purchases-table-body">
                            <!-- Rows populated dynamically -->
                        </tbody>
                    </table>
                </div>
                <div id="purchases-pagination"></div>
            </div>
        `;
        this.app.render(html);
    }

    renderStats() {
        const purchases = this.app.state.purchaseOrders || [];
        const totalPOs = purchases.length;
        const totalSpent = purchases.filter(p => p.status === 'received').reduce((sum, p) => sum + p.total, 0);
        const pendingArrivals = purchases.filter(p => p.status === 'ordered').length;
        const receivedCount = purchases.filter(p => p.status === 'received').length;

        const statsHtml = `
            <div class="stat-card">
                <div class="stat-info">
                    <span>Total Acquisition Spend</span>
                    <h3>$${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    <div class="stat-trend up">
                        <i data-lucide="arrow-down" style="width: 10px; height: 10px;"></i>
                        <span>Capital outgoing</span>
                    </div>
                </div>
                <div class="stat-icon warning">
                    <i data-lucide="dollar-sign"></i>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-info">
                    <span>POs Processed</span>
                    <h3>${totalPOs}</h3>
                    <div class="stat-trend up">
                        <i data-lucide="file-text" style="width: 10px; height: 10px;"></i>
                        <span>Supplier slips</span>
                    </div>
                </div>
                <div class="stat-icon primary">
                    <i data-lucide="clipboard-list"></i>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-info">
                    <span>Fully Received</span>
                    <h3>${receivedCount}</h3>
                    <div class="stat-trend up">
                        <i data-lucide="check" style="width: 10px; height: 10px;"></i>
                        <span>Stock replenished</span>
                    </div>
                </div>
                <div class="stat-icon success">
                    <i data-lucide="package-check"></i>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-info">
                    <span>Awaiting Deliveries</span>
                    <h3>${pendingArrivals}</h3>
                    <div class="stat-trend ${pendingArrivals > 0 ? 'warning' : 'up'}" style="color: ${pendingArrivals > 0 ? 'var(--accent-info)' : 'var(--accent-success)'}; background: ${pendingArrivals > 0 ? 'var(--accent-info-bg)' : 'var(--accent-success-bg)'};">
                        <i data-lucide="truck" style="width: 10px; height: 10px;"></i>
                        <span>${pendingArrivals > 0 ? 'In transit' : 'All clear'}</span>
                    </div>
                </div>
                <div class="stat-icon info">
                    <i data-lucide="truck"></i>
                </div>
            </div>
        `;
        
        const statsContainer = document.getElementById('purchases-stats');
        if (statsContainer) {
            statsContainer.innerHTML = statsHtml;
        }
    }

    renderPurchasesTable() {
        const tbody = document.getElementById('purchases-table-body');
        if (!tbody) return;

        let filtered = this.app.state.purchaseOrders || [];

        // Apply Search Filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase().trim();
            filtered = filtered.filter(p => 
                p.poNumber.toLowerCase().includes(query) || 
                p.supplierName.toLowerCase().includes(query)
            );
        }

        // Apply Status Filter
        if (this.statusFilter !== 'all') {
            filtered = filtered.filter(p => p.status === this.statusFilter);
        }

        // Sort desc date
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        <div class="empty-state" style="padding: 40px 0;">
                            <i data-lucide="clipboard-list" style="width: 40px; height: 40px; stroke-width: 1.5; color: var(--text-muted);"></i>
                            <h3>No purchase orders found</h3>
                            <p>Create a purchase order to replenish items in your catalog.</p>
                        </div>
                    </td>
                </tr>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }

        const isAdmin = this.app.state.currentUser.role === 'admin';

        // Pagination Calculations
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage) || 1;
        if (this.currentPage > totalPages) this.currentPage = totalPages;
        if (this.currentPage < 1) this.currentPage = 1;
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const paginated = filtered.slice(startIndex, startIndex + this.itemsPerPage);

        tbody.innerHTML = paginated.map(p => {
            const dateStr = new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const itemsCount = p.items.reduce((sum, item) => sum + item.quantity, 0);
            
            let statusBadge = 'badge-success';
            if (p.status === 'ordered') statusBadge = 'badge-info';
            if (p.status === 'cancelled') statusBadge = 'badge-danger';

            return `
                <tr>
                    <td style="font-weight: 600; color: var(--text-primary);">${p.poNumber}</td>
                    <td>${p.supplierName}</td>
                    <td>${dateStr}</td>
                    <td class="text-right" style="font-weight: 500; color: var(--text-secondary);">${itemsCount}</td>
                    <td class="text-right" style="font-weight: 600; color: var(--text-primary);">$${p.total.toFixed(2)}</td>
                    <td>
                        <span class="badge-pill ${statusBadge}">
                            ${p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                    </td>
                    <td class="text-right">
                        <div class="flex gap-2 justify-end" style="justify-content: flex-end;">
                            <button class="btn-icon-sm view" title="View PO Details" data-id="${p.id}">
                                <i data-lucide="eye"></i>
                            </button>
                            ${isAdmin ? `
                                <button class="btn-icon-sm edit" title="Update Delivery Status" data-id="${p.id}">
                                    <i data-lucide="truck"></i>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Render Pagination Controls
        const pagEl = document.getElementById('purchases-pagination');
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
        // Create PO button
        const addBtn = document.getElementById('add-purchase-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openCreatePOModal());
        }

        // Live Search
        const searchInput = document.getElementById('purchases-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.currentPage = 1;
                this.renderPurchasesTable();
            });
        }

        // Status Filter
        const filterSelect = document.getElementById('purchases-status-filter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.statusFilter = e.target.value;
                this.currentPage = 1;
                this.renderPurchasesTable();
            });
        }

        // Action buttons (view/edit)
        const tbody = document.getElementById('purchases-table-body');
        if (tbody) {
            tbody.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;

                const poId = btn.getAttribute('data-id');
                if (!poId) return;

                if (btn.classList.contains('view')) {
                    this.viewPODetails(poId);
                } else if (btn.classList.contains('edit')) {
                    if (this.app.state.currentUser.role !== 'admin') {
                        this.app.showToast('Access Denied: Staff accounts cannot change delivery status directly.', 'error');
                        return;
                    }
                    this.openPOStatusModal(poId);
                }
            });
        }

        // Pagination clicks
        const pagContainer = document.getElementById('purchases-pagination');
        if (pagContainer) {
            pagContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.pagination-btn');
                if (!btn) return;

                if (btn.classList.contains('prev') && this.currentPage > 1) {
                    this.currentPage--;
                    this.renderPurchasesTable();
                } else if (btn.classList.contains('next') && this.currentPage < Math.ceil((this.app.state.purchaseOrders || []).length / this.itemsPerPage)) {
                    this.currentPage++;
                    this.renderPurchasesTable();
                } else if (btn.classList.contains('page-num')) {
                    this.currentPage = parseInt(btn.getAttribute('data-page'));
                    this.renderPurchasesTable();
                }
            });
        }
    }

    // --- Modal Create Purchase Order ---
    openCreatePOModal() {
        this.currentCart = []; // Clear cart buffer
        const products = this.app.state.inventory;
        const activeVendors = this.app.state.vendors.filter(v => v.status === 'active');

        if (activeVendors.length === 0) {
            this.app.showToast('Please register an active Vendor Supplier before creating purchase orders.', 'warning');
            return;
        }

        if (products.length === 0) {
            this.app.showToast('Please register catalog products before creating purchase orders.', 'warning');
            return;
        }

        const poNumber = `PO-${1000 + (this.app.state.purchaseOrders ? this.app.state.purchaseOrders.length : 0) + 1}`;

        const contentHtml = `
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <!-- Supplier Selection -->
                <div class="form-group">
                    <label for="po-supplier">Select Supplier *</label>
                    <select id="po-supplier">
                        ${activeVendors.map(v => `<option value="${v.name}">${v.name} (${v.category || 'General'})</option>`).join('')}
                    </select>
                </div>

                <div class="divider" style="width: 100%; height: 1px; margin: 4px 0;"></div>

                <!-- Product Add Sub-form -->
                <div style="background: rgba(255, 255, 255, 0.02); border: 1px dashed var(--border-color); border-radius: var(--border-radius-md); padding: 16px;">
                    <h3 style="font-size: 13.5px; font-weight: 700; margin-bottom: 12px; color: var(--text-secondary); text-transform: uppercase;">
                        Acquire Catalog Item
                    </h3>
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; align-items: flex-end;">
                        <div class="form-group" style="margin-bottom: 0;">
                            <label for="po-product">Select SKU</label>
                            <select id="po-product">
                                ${products.map(p => `<option value="${p.id}" data-price="${p.price}">
                                    ${p.name} - SKU: ${p.sku} ($${p.price.toFixed(2)})
                                </option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label for="po-unit-cost">Unit Cost ($)</label>
                            <input type="number" id="po-unit-cost" min="0.01" step="0.01" value="1.00">
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label for="po-qty">Quantity</label>
                            <input type="number" id="po-qty" value="10" min="1" step="1">
                        </div>
                    </div>
                    <button class="btn btn-secondary" id="add-to-po-cart-btn" style="height: 40px; width: 100%; margin-top: 14px;">
                        Add Item to List
                    </button>
                </div>

                <!-- PO Cart List -->
                <div>
                    <h3 style="font-size: 13.5px; font-weight: 700; margin-bottom: 8px; color: var(--text-secondary); text-transform: uppercase;">
                        Purchase Items List
                    </h3>
                    <div class="table-container" style="border: 1px solid var(--border-color); border-radius: var(--border-radius-md); background: rgba(0,0,0,0.15); max-height: 160px; overflow-y: auto;">
                        <table style="width: 100%;">
                            <thead>
                                <tr>
                                    <th style="padding: 8px 12px; font-size: 11px;">Product</th>
                                    <th style="padding: 8px 12px; font-size: 11px; text-align: right;">Unit Cost</th>
                                    <th style="padding: 8px 12px; font-size: 11px; text-align: right;">Qty</th>
                                    <th style="padding: 8px 12px; font-size: 11px; text-align: right;">Total</th>
                                    <th style="padding: 8px 12px; font-size: 11px; text-align: right;"></th>
                                </tr>
                            </thead>
                            <tbody id="po-cart-table-body">
                                <tr>
                                    <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">
                                        Add items to purchase order above
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Financial Summary -->
                <div style="background: rgba(255,255,255,0.01); border-top: 1px solid var(--border-color); padding: 12px 0; display: flex; flex-direction: column; gap: 8px; align-items: flex-end; font-size: 13.5px;">
                    <div style="display: flex; gap: 40px; justify-content: space-between; width: 220px; color: var(--text-secondary);">
                        <span>Acquisition Total:</span>
                        <strong id="po-total">$0.00</strong>
                    </div>
                </div>

                <!-- Initial Delivery Status -->
                <div class="form-group">
                    <label for="po-status">Acquisition Status</label>
                    <select id="po-status">
                        <option value="ordered">Ordered (Pending shipping delivery)</option>
                        <option value="received">Received (Apply stock to catalog immediately)</option>
                    </select>
                </div>
            </div>
        `;

        this.app.openModal('Generate Purchase Order', contentHtml, () => {
            const supplierName = document.getElementById('po-supplier').value.trim();
            const initialStatus = document.getElementById('po-status').value;

            if (!supplierName) {
                this.app.showToast('Please enter a Supplier name.', 'warning');
                return;
            }

            if (this.currentCart.length === 0) {
                this.app.showToast('Purchase Order must contain at least one item.', 'warning');
                return;
            }

            const total = this.currentCart.reduce((sum, item) => sum + item.total, 0);

            // Restocking effect if received
            if (initialStatus === 'received') {
                this.currentCart.forEach(item => {
                    const catalogItem = this.app.state.inventory.find(p => p.id === item.productId);
                    if (catalogItem) {
                        catalogItem.stock += item.quantity;
                    }
                });
                this.app.saveState('inventory');
                this.app.showToast('Purchase Order received. Inventory catalog stock levels replenished.', 'success');
            } else {
                this.app.showToast(`Purchase Order ${poNumber} issued in PENDING status.`, 'info');
            }

            const newPO = {
                id: `po-${Date.now()}`,
                poNumber,
                supplierName,
                date: new Date().toISOString(),
                items: this.currentCart.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                    costPrice: item.costPrice
                })),
                total,
                status: initialStatus
            };

            if (!this.app.state.purchaseOrders) this.app.state.purchaseOrders = [];
            this.app.state.purchaseOrders.push(newPO);
            this.app.saveState('purchaseOrders');

            this.app.closeModal();
            this.renderStats();
            this.renderPurchasesTable();
        }, {
            saveLabel: 'Authorize Purchase Order',
            subtitle: `Ref Code: ${poNumber}`
        });

        // Set default cost price when product changes
        const prodSelect = document.getElementById('po-product');
        const costInput = document.getElementById('po-unit-cost');
        if (prodSelect && costInput) {
            const updateCostPrice = () => {
                const selectedOption = prodSelect.options[prodSelect.selectedIndex];
                const retailPrice = parseFloat(selectedOption.getAttribute('data-price'));
                // Default purchase cost is typically 65% of retail price
                costInput.value = (retailPrice * 0.65).toFixed(2);
            };
            updateCostPrice();
            prodSelect.addEventListener('change', updateCostPrice);
        }

        // Add item button click
        const addToCartBtn = document.getElementById('add-to-po-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const selectElement = document.getElementById('po-product');
                const selectedOption = selectElement.options[selectElement.selectedIndex];
                
                const productId = selectElement.value;
                const name = selectedOption.text.split(' - SKU: ')[0];
                const qty = parseInt(document.getElementById('po-qty').value, 10);
                const cost = parseFloat(document.getElementById('po-unit-cost').value);

                if (isNaN(qty) || qty <= 0 || isNaN(cost) || cost <= 0) {
                    this.app.showToast('Please input positive quantities and price costs.', 'warning');
                    return;
                }

                const existingItem = this.currentCart.find(item => item.productId === productId);
                if (existingItem) {
                    existingItem.quantity += qty;
                    existingItem.total = existingItem.quantity * existingItem.costPrice;
                } else {
                    this.currentCart.push({
                        productId,
                        name,
                        costPrice: cost,
                        quantity: qty,
                        total: qty * cost
                    });
                }

                this.renderPOCartTable();
            });
        }
    }

    renderPOCartTable() {
        const tbody = document.getElementById('po-cart-table-body');
        if (!tbody) return;

        if (this.currentCart.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">
                        Add items to purchase order above
                    </td>
                </tr>
            `;
            document.getElementById('po-total').textContent = '$0.00';
            return;
        }

        tbody.innerHTML = this.currentCart.map((item, index) => {
            return `
                <tr>
                    <td style="padding: 8px 12px; font-size: 13px; color: var(--text-primary); font-weight: 500;">${item.name}</td>
                    <td style="padding: 8px 12px; font-size: 13px; text-align: right;">$${item.costPrice.toFixed(2)}</td>
                    <td style="padding: 8px 12px; font-size: 13px; text-align: right;">${item.quantity}</td>
                    <td style="padding: 8px 12px; font-size: 13px; text-align: right; font-weight: 600; color: var(--text-primary);">$${item.total.toFixed(2)}</td>
                    <td style="padding: 8px 12px; text-align: right;">
                        <button class="btn-icon-sm delete" style="width: 24px; height: 24px; border-radius: 4px;" data-cart-index="${index}">
                            <i data-lucide="minus-circle" style="width: 12px; height: 12px;"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();

        // Attach cart remove
        tbody.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                const idx = parseInt(target.getAttribute('data-cart-index'), 10);
                this.currentCart.splice(idx, 1);
                this.renderPOCartTable();
            });
        });

        // Sum math
        const total = this.currentCart.reduce((sum, item) => sum + item.total, 0);
        document.getElementById('po-total').textContent = `$${total.toFixed(2)}`;
    }

    // --- Modal Update PO Status (Trigger Restock) ---
    openPOStatusModal(poId) {
        const po = this.app.state.purchaseOrders.find(p => p.id === poId);
        if (!po) return;

        const isFullyReceived = po.status === 'received';

        const contentHtml = `
            <div style="display: flex; flex-direction: column; gap: 16px; font-family: var(--font-primary);">
                <p style="font-size: 14px; color: var(--text-secondary);">
                    Manage acquisition status for purchase order <strong>${po.poNumber}</strong> from <strong>${po.supplierName}</strong>.
                </p>
                
                <div class="form-group">
                    <label for="modal-po-status">Deliveries Status</label>
                    <select id="modal-po-status" ${isFullyReceived ? 'disabled' : ''}>
                        <option value="ordered" ${po.status === 'ordered' ? 'selected' : ''}>Ordered (Awaiting supplier fulfillment)</option>
                        <option value="received" ${po.status === 'received' ? 'selected' : ''}>Received (Mark goods arrived & restock catalog)</option>
                        <option value="cancelled" ${po.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </div>

                ${isFullyReceived ? `
                    <div style="font-size: 12.5px; color: var(--accent-success); background: var(--accent-success-bg); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: var(--border-radius-md); padding: 12px; line-height: 1.5;">
                        <i data-lucide="check-circle" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i>
                        <strong>PO is fully RECEIVED & SETTLED:</strong> Stock quantities were already credited into the inventory catalog. This record is locked.
                    </div>
                ` : `
                    <div style="font-size: 12px; color: var(--text-muted); line-height: 1.5;">
                        <i data-lucide="info" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i>
                        Transitioning this status to <strong>Received</strong> will immediately credit all quantities (Total: ${po.items.reduce((sum, item) => sum + item.quantity, 0)} units) to their catalog inventory stock counts.
                    </div>
                `}
            </div>
        `;

        this.app.openModal('Update Acquisition Status', contentHtml, isFullyReceived ? null : () => {
            const nextStatus = document.getElementById('modal-po-status').value;

            if (nextStatus === po.status) {
                this.app.closeModal();
                return;
            }

            // Crediting stock to inventory
            if (nextStatus === 'received') {
                po.items.forEach(poItem => {
                    const catalogItem = this.app.state.inventory.find(p => p.id === poItem.productId);
                    if (catalogItem) {
                        catalogItem.stock += poItem.quantity;
                    }
                });
                this.app.saveState('inventory');
                this.app.showToast(`Goods received. Inventory stocks replenished successfully.`, 'success');
            }

            po.status = nextStatus;
            this.app.saveState('purchaseOrders');
            this.app.showToast(`PO ${po.poNumber} status updated to ${nextStatus.toUpperCase()}`, 'success');

            this.app.closeModal();
            this.renderStats();
            this.renderPurchasesTable();
        }, {
            saveLabel: 'Update PO Status',
            subtitle: `Invoice Ref: ${po.poNumber}`
        });
    }

    // --- Modal View PO Invoice details ---
    viewPODetails(poId) {
        const po = this.app.state.purchaseOrders.find(p => p.id === poId);
        if (!po) return;

        const orderDate = new Date(po.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

        let statusClass = 'badge-success';
        if (po.status === 'ordered') statusClass = 'badge-info';
        if (po.status === 'cancelled') statusClass = 'badge-danger';

        const contentHtml = `
            <div style="background: rgba(255, 255, 255, 0.015); border: 1px solid var(--border-color); border-radius: var(--border-radius-lg); padding: 32px; font-family: var(--font-primary); color: var(--text-primary);">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 24px; margin-bottom: 24px; align-items: flex-start;">
                    <div>
                        <h3 style="font-size: 24px; font-family: var(--font-headers); font-weight: 700; color: #fff;">NEXUS ERP</h3>
                        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted);">Stock Acquisition Statement</span>
                    </div>
                    <div style="text-align: right;">
                        <h4 style="font-size: 18px; color: var(--accent-warning);">${po.poNumber}</h4>
                        <span class="badge-pill ${statusClass}" style="margin-top: 8px;">
                            ${po.status.toUpperCase()}
                        </span>
                    </div>
                </div>

                <!-- Billed Info -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; font-size: 13.5px; line-height: 1.5;">
                    <div>
                        <span style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 8px;">Acquired From:</span>
                        <strong style="color: #fff; font-size: 15px;">${po.supplierName}</strong><br>
                        <span style="color: var(--text-secondary)">Official Supplier Distributor</span>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 8px;">PO Metadata:</span>
                        <span style="color: var(--text-secondary)">Date Created:</span> <strong style="color: #fff">${orderDate}</strong><br>
                        <span style="color: var(--text-secondary)">Currency:</span> <strong style="color: #fff">USD ($)</strong>
                    </div>
                </div>

                <!-- Product Table -->
                <div style="border: 1px solid var(--border-color); border-radius: var(--border-radius-md); overflow: hidden; margin-bottom: 24px;">
                    <table style="width: 100%;">
                        <thead>
                            <tr style="background: rgba(255,255,255,0.02)">
                                <th style="padding: 10px 14px; font-size: 11px; color: var(--text-muted);">Acquisition Item Details</th>
                                <th style="padding: 10px 14px; font-size: 11px; color: var(--text-muted); text-align: right;">Unit Cost</th>
                                <th style="padding: 10px 14px; font-size: 11px; color: var(--text-muted); text-align: right;">Qty</th>
                                <th style="padding: 10px 14px; font-size: 11px; color: var(--text-muted); text-align: right;">Total Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${po.items.map(item => {
                                return `
                                    <tr>
                                        <td style="padding: 12px 14px; font-size: 13.5px; font-weight: 500; color: #fff;">${item.name}</td>
                                        <td style="padding: 12px 14px; font-size: 13.5px; text-align: right;">$${item.costPrice.toFixed(2)}</td>
                                        <td style="padding: 12px 14px; font-size: 13.5px; text-align: right; color: var(--text-secondary);">${item.quantity}</td>
                                        <td style="padding: 12px 14px; font-size: 13.5px; text-align: right; font-weight: 600; color: #fff;">$${(item.costPrice * item.quantity).toFixed(2)}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Summary Breakdown -->
                <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-end; font-size: 13.5px; border-top: 1px solid var(--border-color); padding-top: 16px;">
                    <div style="display: flex; justify-content: space-between; width: 240px; color: #fff; font-size: 16px; font-weight: 700;">
                        <span>PO Outgoing Cost:</span>
                        <span style="color: var(--accent-warning)">$${po.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;

        this.app.openModal('Acquisition Order Details', contentHtml, null, {
            subtitle: `ID Reference: ${po.id}`
        });
    }
}
