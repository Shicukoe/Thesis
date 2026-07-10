/* ==========================================================================
   Nexus ERP - Inventory Catalog View Module (ES Module)
   ========================================================================== */

export class InventoryView {
    constructor(app) {
        this.app = app;
        this.searchQuery = '';
        this.stockFilter = 'all';
        this.currentPage = 1;
        this.itemsPerPage = 5;
    }

    init() {
        this.renderLayout();
        this.renderStats();
        this.renderInventoryTable();
        this.setupEventListeners();
    }

    renderLayout() {
        const html = `
            <div class="page-header">
                <div class="page-title">
                    <h1>Inventory Catalog</h1>
                    <p>Track stock levels, configure SKU pricing, and manage your product listings</p>
                </div>
                <button class="btn btn-primary" id="add-product-btn">
                    <i data-lucide="plus"></i> Add Product
                </button>
            </div>
            
            <!-- Statistics Section -->
            <div class="stats-grid" id="inventory-stats">
                <!-- Stats populated dynamically -->
            </div>

            <!-- Action / Filter Bar -->
            <div class="card" style="padding: 16px;">
                <div class="action-bar">
                    <div class="search-input-wrapper">
                        <i data-lucide="search"></i>
                        <input type="text" id="inventory-search" placeholder="Search by name, SKU..." value="${this.searchQuery}">
                    </div>
                    
                    <div class="filter-actions">
                        <select class="select-custom" id="inventory-stock-filter">
                            <option value="all" ${this.stockFilter === 'all' ? 'selected' : ''}>All Stock Levels</option>
                            <option value="low" ${this.stockFilter === 'low' ? 'selected' : ''}>Low Stock Alerts</option>
                            <option value="out" ${this.stockFilter === 'out' ? 'selected' : ''}>Out of Stock</option>
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
                                <th>Product Details</th>
                                <th>SKU</th>
                                <th>Category</th>
                                <th class="text-right">Price</th>
                                <th class="text-right">Stock Level</th>
                                <th>Status</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="inventory-table-body">
                            <!-- Rows populated dynamically -->
                        </tbody>
                    </table>
                </div>
                <div id="inventory-pagination"></div>
            </div>
        `;
        this.app.render(html);
    }

    renderStats() {
        const inventory = this.app.state.inventory;
        const totalProducts = inventory.length;
        const totalValue = inventory.reduce((sum, item) => sum + (item.price * item.stock), 0);
        const lowStockCount = inventory.filter(item => item.stock > 0 && item.stock <= item.minStock).length;
        const outOfStockCount = inventory.filter(item => item.stock === 0).length;

        const statsHtml = `
            <div class="stat-card">
                <div class="stat-info">
                    <span>Catalog Items</span>
                    <h3>${totalProducts}</h3>
                    <div class="stat-trend up">
                        <i data-lucide="box" style="width: 10px; height: 10px;"></i>
                        <span>Unique SKUs</span>
                    </div>
                </div>
                <div class="stat-icon primary">
                    <i data-lucide="package"></i>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-info">
                    <span>Valuation (Asset)</span>
                    <h3>$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    <div class="stat-trend up">
                        <i data-lucide="dollar-sign" style="width: 10px; height: 10px;"></i>
                        <span>Inventory Worth</span>
                    </div>
                </div>
                <div class="stat-icon success">
                    <i data-lucide="line-chart"></i>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-info">
                    <span>Low Stock Alerts</span>
                    <h3>${lowStockCount}</h3>
                    <div class="stat-trend ${lowStockCount > 0 ? 'down' : 'up'}">
                        <i data-lucide="alert-triangle" style="width: 10px; height: 10px;"></i>
                        <span>Reorder needed</span>
                    </div>
                </div>
                <div class="stat-icon warning">
                    <i data-lucide="alert-triangle"></i>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-info">
                    <span>Out of Stock</span>
                    <h3>${outOfStockCount}</h3>
                    <div class="stat-trend ${outOfStockCount > 0 ? 'down' : 'up'}">
                        <i data-lucide="alert-circle" style="width: 10px; height: 10px;"></i>
                        <span>Unavailable</span>
                    </div>
                </div>
                <div class="stat-icon ${outOfStockCount > 0 ? 'danger' : 'info'}">
                    <i data-lucide="alert-circle"></i>
                </div>
            </div>
        `;
        
        const statsContainer = document.getElementById('inventory-stats');
        if (statsContainer) {
            statsContainer.innerHTML = statsHtml;
        }
    }

    renderInventoryTable() {
        const tbody = document.getElementById('inventory-table-body');
        if (!tbody) return;

        let filtered = this.app.state.inventory;

        // Apply Search Filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase().trim();
            filtered = filtered.filter(item => 
                item.name.toLowerCase().includes(query) || 
                item.sku.toLowerCase().includes(query)
            );
        }

        // Apply Stock Status Filter
        if (this.stockFilter === 'low') {
            filtered = filtered.filter(item => item.stock > 0 && item.stock <= item.minStock);
        } else if (this.stockFilter === 'out') {
            filtered = filtered.filter(item => item.stock === 0);
        }

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        <div class="empty-state" style="padding: 40px 0;">
                            <i data-lucide="package" style="width: 40px; height: 40px; stroke-width: 1.5; color: var(--text-muted);"></i>
                            <h3>No products found</h3>
                            <p>Try resetting filters or registering a new product.</p>
                        </div>
                    </td>
                </tr>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }

        const role = this.app.state.currentUser.role;
        const canDelete = role === 'admin' || role === 'manager';

        // Pagination Calculations
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage) || 1;
        if (this.currentPage > totalPages) this.currentPage = totalPages;
        if (this.currentPage < 1) this.currentPage = 1;
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const paginated = filtered.slice(startIndex, startIndex + this.itemsPerPage);

        tbody.innerHTML = paginated.map(item => {
            let statusBadge = 'badge-success';
            let statusText = 'In Stock';
            
            if (item.stock === 0) {
                statusBadge = 'badge-danger';
                statusText = 'Out of Stock';
            } else if (item.stock <= item.minStock) {
                statusBadge = 'badge-warning';
                statusText = 'Low Stock';
            }

            // Visual stock level bar (percentage of reorder level, maxing out for display)
            const maxDisplayStock = Math.max(item.stock, item.minStock * 2, 20);
            const percentage = Math.min((item.stock / maxDisplayStock) * 100, 100);
            const barColor = item.stock === 0 ? 'var(--accent-danger)' : (item.stock <= item.minStock ? 'var(--accent-warning)' : 'var(--accent-success)');

            return `
                <tr>
                    <td>
                        <div style="font-weight: 600; color: var(--text-primary);">${item.name}</div>
                    </td>
                    <td>
                        <code style="font-family: monospace; padding: 2px 6px; background: rgba(255,255,255,0.05); border-radius: 4px; font-size: 12px; color: var(--text-secondary);">${item.sku}</code>
                    </td>
                    <td>${item.category || 'General'}</td>
                    <td class="text-right" style="font-weight: 600; color: var(--text-primary);">$${item.price.toFixed(2)}</td>
                    <td class="text-right">
                        <div style="display: inline-block; text-align: right; width: 100%;">
                            <span style="font-weight: 600; color: var(--text-primary);">${item.stock}</span>
                            <div style="width: 80px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin-top: 4px; display: inline-block; position: relative; vertical-align: middle; margin-left: 8px;">
                                <div style="position: absolute; left: 0; top: 0; height: 100%; width: ${percentage}%; background: ${barColor}; border-radius: 2px;"></div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="badge-pill ${statusBadge}">${statusText}</span>
                    </td>
                    <td class="text-right">
                        <div class="flex gap-2 justify-end" style="justify-content: flex-end;">
                            <button class="btn-icon-sm edit" title="Edit Catalog Info" data-id="${item.id}">
                                <i data-lucide="edit-3"></i>
                            </button>
                            ${canDelete ? `
                                <button class="btn-icon-sm delete" title="Remove Product" data-id="${item.id}">
                                    <i data-lucide="trash-2"></i>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Render Pagination Controls
        const pagEl = document.getElementById('inventory-pagination');
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
        // Add button
        const addBtn = document.getElementById('add-product-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openProductModal());
        }

        // Live Search
        const searchInput = document.getElementById('inventory-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.currentPage = 1;
                this.renderInventoryTable();
            });
        }

        // Stock Status Filter
        const filterSelect = document.getElementById('inventory-stock-filter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.stockFilter = e.target.value;
                this.currentPage = 1;
                this.renderInventoryTable();
            });
        }

        // Action Buttons delegation (edit/delete)
        const tbody = document.getElementById('inventory-table-body');
        if (tbody) {
            tbody.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;

                const productId = btn.getAttribute('data-id');
                if (!productId) return;

                if (btn.classList.contains('edit')) {
                    this.openProductModal(productId);
                } else if (btn.classList.contains('delete')) {
                    const role = this.app.state.currentUser.role;
                    if (role !== 'admin' && role !== 'manager') {
                        this.app.showToast('Access Denied: Admin or Manager authorization required to delete records.', 'error');
                        return;
                    }
                    this.confirmDeleteProduct(productId);
                }
            });
        }

        // Pagination clicks
        const pagContainer = document.getElementById('inventory-pagination');
        if (pagContainer) {
            pagContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.pagination-btn');
                if (!btn) return;

                if (btn.classList.contains('prev') && this.currentPage > 1) {
                    this.currentPage--;
                    this.renderInventoryTable();
                } else if (btn.classList.contains('next') && this.currentPage < Math.ceil(this.app.state.inventory.length / this.itemsPerPage)) {
                    this.currentPage++;
                    this.renderInventoryTable();
                } else if (btn.classList.contains('page-num')) {
                    this.currentPage = parseInt(btn.getAttribute('data-page'));
                    this.renderInventoryTable();
                }
            });
        }
    }

    // --- Modal Add / Edit Product ---
    openProductModal(productId = null) {
        const isEdit = !!productId;
        let productData = { name: '', sku: '', category: 'General', price: 0, stock: 0, minStock: 5 };

        if (isEdit) {
            const found = this.app.state.inventory.find(item => item.id === productId);
            if (found) productData = { ...found };
            else {
                this.app.showToast('Product not found in database', 'error');
                return;
            }
        }

        const modalTitle = isEdit ? 'Update Product Catalog' : 'Register New Product SKU';
        const modalSubtitle = isEdit 
            ? `Updating data for SKU: ${productData.sku}` 
            : 'Register prices, barcode/SKU strings, and initial stock quantities';

        const contentHtml = `
            <form id="product-form" onsubmit="event.preventDefault();">
                <div class="form-grid">
                    <div class="form-group full-width">
                        <label for="modal-prod-name">Product Name *</label>
                        <input type="text" id="modal-prod-name" value="${productData.name}" required placeholder="e.g. Ergonomic Office Chair">
                    </div>
                    
                    <div class="form-group">
                        <label for="modal-prod-sku">Stock Keeping Unit (SKU) *</label>
                        <input type="text" id="modal-prod-sku" value="${productData.sku}" required placeholder="e.g. CHR-ERGO-09" ${isEdit ? 'disabled' : ''}>
                    </div>

                    <div class="form-group">
                        <label for="modal-prod-category">Product Category</label>
                        <input type="text" id="modal-prod-category" value="${productData.category}" placeholder="e.g. Furniture, Electronics">
                    </div>
                    
                    <div class="form-group">
                        <label for="modal-prod-price">Selling Price ($) *</label>
                        <input type="number" id="modal-prod-price" value="${productData.price}" min="0" step="0.01" required placeholder="0.00" ${isEdit && this.app.state.currentUser.role !== 'admin' ? 'disabled' : ''}>
                        ${isEdit && this.app.state.currentUser.role !== 'admin' ? '<small style="color: var(--accent-danger); margin-top: 4px; display: block;">🔒 Prices can only be edited by Admins</small>' : ''}
                    </div>
                    
                    <div class="form-group">
                        <label for="modal-prod-stock">Initial Stock Quantity *</label>
                        <input type="number" id="modal-prod-stock" value="${productData.stock}" min="0" step="1" required placeholder="0">
                    </div>

                    <div class="form-group full-width">
                        <label for="modal-prod-min">Reorder Threshold Alert (Min Stock) *</label>
                        <input type="number" id="modal-prod-min" value="${productData.minStock}" min="0" step="1" required placeholder="5">
                        <small style="color: var(--text-muted); margin-top: 4px; display: block;">Triggers a low-stock visual warning when inventory falls below this limit.</small>
                    </div>
                </div>
            </form>
        `;

        this.app.openModal(modalTitle, contentHtml, () => {
            // Retrieve values
            const name = document.getElementById('modal-prod-name').value.trim();
            const sku = document.getElementById('modal-prod-sku').value.trim().toUpperCase();
            const category = document.getElementById('modal-prod-category').value.trim() || 'General';
            const price = parseFloat(document.getElementById('modal-prod-price').value);
            const stock = parseInt(document.getElementById('modal-prod-stock').value, 10);
            const minStock = parseInt(document.getElementById('modal-prod-min').value, 10);

            // Simple validation
            if (!name || !sku || isNaN(price) || isNaN(stock) || isNaN(minStock)) {
                this.app.showToast('Please fill out all required fields with numeric amounts.', 'warning');
                return;
            }

            if (price < 0) {
                this.app.showToast('Validation Error: Product selling price cannot be negative.', 'error');
                return;
            }
            if (stock < 0) {
                this.app.showToast('Validation Error: Stock quantity cannot be negative.', 'error');
                return;
            }
            if (minStock < 0) {
                this.app.showToast('Validation Error: Reorder threshold alert limit cannot be negative.', 'error');
                return;
            }

            // Duplicate SKU check for new products
            if (!isEdit) {
                const skuExists = this.app.state.inventory.some(item => item.sku === sku);
                if (skuExists) {
                    this.app.showToast(`Product with SKU "${sku}" already exists.`, 'error');
                    return;
                }
            }

            if (isEdit) {
                // Update product in state
                const index = this.app.state.inventory.findIndex(item => item.id === productId);
                if (index !== -1) {
                    this.app.state.inventory[index] = {
                        ...this.app.state.inventory[index],
                        name, category, price, stock, minStock
                    };
                    this.app.saveState('inventory');
                    this.app.showToast(`Product "${name}" updated.`, 'success');
                }
            } else {
                // Add new product
                const newProduct = {
                    id: `prod-${Date.now()}`,
                    name, sku, category, price, stock, minStock
                };
                this.app.state.inventory.push(newProduct);
                this.app.saveState('inventory');
                this.app.showToast(`Product "${name}" registered.`, 'success');
            }

            this.app.closeModal();
            this.renderStats();
            this.renderInventoryTable();
        }, {
            saveLabel: isEdit ? 'Apply Changes' : 'Register Product',
            subtitle: modalSubtitle
        });
    }

    // --- Delete Confirmation Dialog ---
    confirmDeleteProduct(productId) {
        const role = this.app.state.currentUser.role;
        if (role !== 'admin' && role !== 'manager') {
            this.app.showToast('Access Denied: Admin or Manager authorization required to delete records.', 'error');
            return;
        }
        const found = this.app.state.inventory.find(item => item.id === productId);
        if (!found) return;

        const contentHtml = `
            <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.5;">
                <p>Are you sure you want to permanently delete <strong>${found.name}</strong> (SKU: <code>${found.sku}</code>)?</p>
                <p style="margin-top: 10px; color: var(--accent-danger); font-size: 13px;">
                    <i data-lucide="alert-triangle" style="width: 14px; height: 14px; display: inline; vertical-align: middle; margin-right: 4px;"></i>
                    This action will purge the catalog record. Historical transaction lines referencing this product will retain pricing metrics but won't point to an active catalog SKU.
                </p>
            </div>
        `;

        this.app.openModal('Delete Product SKU', contentHtml, () => {
            this.app.state.inventory = this.app.state.inventory.filter(item => item.id !== productId);
            this.app.saveState('inventory');
            this.app.showToast(`Product "${found.name}" removed from database.`, 'success');
            this.app.closeModal();
            this.renderStats();
            this.renderInventoryTable();
        }, {
            saveLabel: 'Confirm Delete',
            isDelete: true,
            subtitle: 'This process cannot be undone'
        });
    }
}
