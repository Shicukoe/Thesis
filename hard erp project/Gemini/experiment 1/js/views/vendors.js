/* ==========================================================================
   Nexus ERP - Vendor Directory View Module (ES Module)
   ========================================================================== */

export class VendorView {
    constructor(app) {
        this.app = app;
        this.searchQuery = '';
        this.statusFilter = 'all';
        this.currentPage = 1;
        this.itemsPerPage = 5;
    }

    init() {
        this.renderLayout();
        this.renderStats();
        this.renderVendorTable();
        this.setupEventListeners();
    }

    renderLayout() {
        const html = `
            <div class="page-header">
                <div class="page-title">
                    <h1>Vendor & Supplier Directory</h1>
                    <p>Manage raw materials suppliers, logistics agents, and manufacturer contacts</p>
                </div>
                <button class="btn btn-primary" id="add-vendor-btn">
                    <i data-lucide="plus"></i> Register Vendor
                </button>
            </div>
            
            <!-- Statistics Section -->
            <div class="stats-grid" id="vendor-stats">
                <!-- Stats populated dynamically -->
            </div>

            <!-- Action / Filter Bar -->
            <div class="card" style="padding: 16px;">
                <div class="action-bar">
                    <div class="search-input-wrapper">
                        <i data-lucide="search"></i>
                        <input type="text" id="vendor-search" placeholder="Search by company, contact, or email..." value="${this.searchQuery}">
                    </div>
                    
                    <div class="filter-actions">
                        <select class="select-custom" id="vendor-status-filter">
                            <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>All Statuses</option>
                            <option value="active" ${this.statusFilter === 'active' ? 'selected' : ''}>Active</option>
                            <option value="inactive" ${this.statusFilter === 'inactive' ? 'selected' : ''}>Inactive</option>
                            <option value="deleted" ${this.statusFilter === 'deleted' ? 'selected' : ''}>Recycle Bin</option>
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
                                <th>Supplier / Business</th>
                                <th>Contact Representative</th>
                                <th>Email</th>
                                <th>Primary Category</th>
                                <th>Status</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="vendor-table-body">
                            <!-- Rows populated dynamically -->
                        </tbody>
                    </table>
                </div>
                <div id="vendor-pagination"></div>
            </div>
        `;
        this.app.render(html);
    }

    renderStats() {
        const vendors = (this.app.state.vendors || []).filter(v => !v.isDeleted);
        const total = vendors.length;
        const active = vendors.filter(v => v.status === 'active').length;
        const inactive = Math.max(total - active, 0);
        
        // Count PO volume spent on active vendors
        const poSpent = (this.app.state.purchaseOrders || [])
            .filter(po => po.status === 'received')
            .reduce((sum, po) => sum + po.total, 0);

        const statsHtml = `
            <div class="stat-card">
                <div class="stat-info">
                    <span>Registered Vendors</span>
                    <h3>${total}</h3>
                    <div class="stat-trend up">
                        <i data-lucide="truck" style="width: 10px; height: 10px;"></i>
                        <span>Active suppliers</span>
                    </div>
                </div>
                <div class="stat-icon primary">
                    <i data-lucide="truck"></i>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-info">
                    <span>Active Accounts</span>
                    <h3>${active}</h3>
                    <div class="stat-trend up">
                        <i data-lucide="check" style="width: 10px; height: 10px;"></i>
                        <span>Approved suppliers</span>
                    </div>
                </div>
                <div class="stat-icon success">
                    <i data-lucide="user-check"></i>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-info">
                    <span>Inactive Accounts</span>
                    <h3>${inactive}</h3>
                    <div class="stat-trend ${inactive > 0 ? 'down' : 'up'}">
                        <i data-lucide="user-x" style="width: 10px; height: 10px;"></i>
                        <span>Suspended / Prospects</span>
                    </div>
                </div>
                <div class="stat-icon warning">
                    <i data-lucide="user-minus"></i>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-info">
                    <span>Acquisition Outgoings</span>
                    <h3>$${poSpent.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h3>
                    <div class="stat-trend up">
                        <i data-lucide="arrow-down" style="width: 10px; height: 10px;"></i>
                        <span>Inventory expenditure</span>
                    </div>
                </div>
                <div class="stat-icon info">
                    <i data-lucide="shopping-bag"></i>
                </div>
            </div>
        `;
        
        const statsContainer = document.getElementById('vendor-stats');
        if (statsContainer) {
            statsContainer.innerHTML = statsHtml;
        }
    }

    renderVendorTable() {
        const tbody = document.getElementById('vendor-table-body');
        if (!tbody) return;

        let filtered = this.app.state.vendors || [];

        // Apply Search
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase().trim();
            filtered = filtered.filter(v => 
                v.name.toLowerCase().includes(query) || 
                v.contactName.toLowerCase().includes(query) || 
                v.email.toLowerCase().includes(query) ||
                (v.category && v.category.toLowerCase().includes(query))
            );
        }

        // Apply Status & Deletion Filters
        if (this.statusFilter === 'deleted') {
            filtered = filtered.filter(v => v.isDeleted);
        } else {
            filtered = filtered.filter(v => !v.isDeleted);
            if (this.statusFilter !== 'all') {
                filtered = filtered.filter(v => v.status === this.statusFilter);
            }
        }

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="empty-state" style="padding: 40px 0;">
                            <i data-lucide="truck" style="width: 40px; height: 40px; stroke-width: 1.5; color: var(--text-muted);"></i>
                            <h3>No vendors found</h3>
                            <p>Try resetting filters or registering a new vendor profile.</p>
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

        tbody.innerHTML = paginated.map(v => {
            const initials = v.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const isRecycleBin = this.statusFilter === 'deleted';
            const actionButtons = isRecycleBin ? `
                <button class="btn-icon-sm restore" title="Restore Vendor" data-id="${v.id}" style="color: var(--accent-success); background: rgba(16, 185, 129, 0.15);">
                    <i data-lucide="rotate-ccw"></i>
                </button>
            ` : `
                <button class="btn-icon-sm view" title="View Vendor Purchases" data-id="${v.id}">
                    <i data-lucide="eye"></i>
                </button>
                <button class="btn-icon-sm edit" title="Edit Vendor Profile" data-id="${v.id}">
                    <i data-lucide="edit-3"></i>
                </button>
                ${isAdmin ? `
                    <button class="btn-icon-sm delete" title="Delete Profile" data-id="${v.id}">
                        <i data-lucide="trash-2"></i>
                    </button>
                ` : ''}
            `;

            return `
                <tr>
                    <td>
                        <div class="table-avatar-cell">
                            <div class="table-avatar" style="background: rgba(245, 158, 11, 0.15); color: var(--accent-warning); border-color: rgba(245, 158, 11, 0.25);">${initials}</div>
                            <div>
                                <div style="font-weight: 600; color: var(--text-primary);">${v.name}</div>
                                <div style="font-size: 12px; color: var(--text-muted);">${v.phone || 'No phone registered'}</div>
                            </div>
                        </div>
                    </td>
                    <td>${v.contactName}</td>
                    <td>${v.email}</td>
                    <td>
                        <code style="font-family: monospace; padding: 2px 6px; background: rgba(255,255,255,0.05); border-radius: 4px; font-size: 12px; color: var(--text-secondary);">${v.category || 'General'}</code>
                    </td>
                    <td>
                        <span class="badge-pill ${v.status === 'active' ? 'badge-success' : 'badge-danger'}">
                            ${v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                        </span>
                    </td>
                    <td class="text-right">
                        <div class="flex gap-2 justify-end" style="justify-content: flex-end;">
                            ${actionButtons}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Render Pagination Controls
        const pagEl = document.getElementById('vendor-pagination');
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
        const addBtn = document.getElementById('add-vendor-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openVendorModal());
        }

        // Live Search
        const searchInput = document.getElementById('vendor-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.currentPage = 1;
                this.renderVendorTable();
            });
        }

        // Status Filter
        const filterSelect = document.getElementById('vendor-status-filter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.statusFilter = e.target.value;
                this.currentPage = 1;
                this.renderVendorTable();
            });
        }

        // Row action buttons delegation
        const tbody = document.getElementById('vendor-table-body');
        if (tbody) {
            tbody.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;

                const vendorId = btn.getAttribute('data-id');
                if (!vendorId) return;

                if (btn.classList.contains('view')) {
                    this.viewVendorDetails(vendorId);
                } else if (btn.classList.contains('edit')) {
                    this.openVendorModal(vendorId);
                } else if (btn.classList.contains('delete')) {
                    if (this.app.state.currentUser.role !== 'admin') {
                        this.app.showToast('Access Denied: Staff accounts cannot delete records.', 'error');
                        return;
                    }
                    this.confirmDeleteVendor(vendorId);
                } else if (btn.classList.contains('restore')) {
                    const vendor = this.app.state.vendors.find(v => v.id === vendorId);
                    if (vendor) {
                        vendor.isDeleted = false;
                        this.app.saveState('vendors');
                        this.app.showToast(`Supplier "${vendor.name}" profile restored.`, 'success');
                        this.renderStats();
                        this.renderVendorTable();
                    }
                }
            });
        }

        // Pagination clicks
        const pagContainer = document.getElementById('vendor-pagination');
        if (pagContainer) {
            pagContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.pagination-btn');
                if (!btn) return;

                if (btn.classList.contains('prev') && this.currentPage > 1) {
                    this.currentPage--;
                    this.renderVendorTable();
                } else if (btn.classList.contains('next') && this.currentPage < Math.ceil(this.app.state.vendors.length / this.itemsPerPage)) {
                    this.currentPage++;
                    this.renderVendorTable();
                } else if (btn.classList.contains('page-num')) {
                    this.currentPage = parseInt(btn.getAttribute('data-page'));
                    this.renderVendorTable();
                }
            });
        }
    }

    // --- Modal Add / Edit Vendor ---
    openVendorModal(vendorId = null) {
        const isEdit = !!vendorId;
        let vendorData = { name: '', contactName: '', email: '', phone: '', address: '', category: 'General', status: 'active' };
        
        if (isEdit) {
            const found = this.app.state.vendors.find(v => v.id === vendorId);
            if (found) vendorData = { ...found };
            else {
                this.app.showToast('Vendor profile not found', 'error');
                return;
            }
        }

        const modalTitle = isEdit ? 'Update Supplier Profile' : 'Enroll New Vendor Supplier';
        const modalSubtitle = isEdit 
            ? `Updating data for ${vendorData.name}` 
            : 'Register catalog manufacturers, material providers, or logistics carriers';

        const contentHtml = `
            <form id="vendor-form" onsubmit="event.preventDefault();">
                <div class="form-grid">
                    <div class="form-group full-width">
                        <label for="modal-vend-name">Supplier / Company Name *</label>
                        <input type="text" id="modal-vend-name" value="${vendorData.name}" required placeholder="e.g. Apex Silicon Distributors Ltd">
                    </div>
                    
                    <div class="form-group">
                        <label for="modal-vend-contact">Contact Person *</label>
                        <input type="text" id="modal-vend-contact" value="${vendorData.contactName}" required placeholder="e.g. Robert Smith">
                    </div>

                    <div class="form-group">
                        <label for="modal-vend-status">Acquisitions Status</label>
                        <select id="modal-vend-status">
                            <option value="active" ${vendorData.status === 'active' ? 'selected' : ''}>Active Supplier</option>
                            <option value="inactive" ${vendorData.status === 'inactive' ? 'selected' : ''}>Suspended / Inactive</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="modal-vend-email">Email Address *</label>
                        <input type="email" id="modal-vend-email" value="${vendorData.email}" required placeholder="orders@apexdistributors.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="modal-vend-category">Supply Category</label>
                        <input type="text" id="modal-vend-category" value="${vendorData.category}" placeholder="e.g. Electronics, Logistics, Hardware">
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="modal-vend-phone">Telephone Number</label>
                        <input type="text" id="modal-vend-phone" value="${vendorData.phone}" placeholder="(555) 000-0000">
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="modal-vend-address">Warehouse / Office Address</label>
                        <textarea id="modal-vend-address" rows="3" placeholder="Street Address, City, State, ZIP">${vendorData.address || ''}</textarea>
                    </div>
                </div>
            </form>
        `;

        this.app.openModal(modalTitle, contentHtml, () => {
            const name = document.getElementById('modal-vend-name').value.trim();
            const contactName = document.getElementById('modal-vend-contact').value.trim();
            const status = document.getElementById('modal-vend-status').value;
            const email = document.getElementById('modal-vend-email').value.trim();
            const category = document.getElementById('modal-vend-category').value.trim() || 'General';
            const phone = document.getElementById('modal-vend-phone').value.trim();
            const address = document.getElementById('modal-vend-address').value.trim();

            if (!name || !contactName || !email) {
                this.app.showToast('Please fill out all required fields.', 'warning');
                return;
            }

            if (isEdit) {
                const index = this.app.state.vendors.findIndex(v => v.id === vendorId);
                if (index !== -1) {
                    this.app.state.vendors[index] = {
                        ...this.app.state.vendors[index],
                        name, contactName, status, email, category, phone, address
                    };
                    this.app.saveState('vendors');
                    this.app.showToast(`Vendor "${name}" profile updated.`, 'success');
                }
            } else {
                const newVendor = {
                    id: `vend-${Date.now()}`,
                    name, contactName, status, email, category, phone, address,
                    createdAt: new Date().toISOString()
                };
                this.app.state.vendors.push(newVendor);
                this.app.saveState('vendors');
                this.app.showToast(`Vendor "${name}" registered successfully.`, 'success');
            }

            this.app.closeModal();
            this.renderStats();
            this.renderVendorTable();
        }, {
            saveLabel: isEdit ? 'Apply Updates' : 'Register Supplier',
            subtitle: modalSubtitle
        });
    }

    // --- Delete Confirmation ---
     confirmDeleteVendor(vendorId) {
        const found = this.app.state.vendors.find(v => v.id === vendorId);
        if (!found) return;

        const contentHtml = `
            <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.5;">
                <p>Are you sure you want to delete <strong>${found.name}</strong> from the supplier directory?</p>
                <p style="margin-top: 10px; color: var(--accent-warning); font-size: 13px;">
                    <i data-lucide="info" style="width: 14px; height: 14px; display: inline; vertical-align: middle; margin-right: 4px;"></i>
                    This supplier profile will be moved to the <strong>Recycle Bin</strong> and can be restored later.
                </p>
            </div>
        `;

        this.app.openModal('Delete Vendor Supplier', contentHtml, () => {
            found.isDeleted = true;
            this.app.saveState('vendors');
            this.app.showToast(`Supplier "${found.name}" moved to Recycle Bin.`, 'info');
            this.app.closeModal();
            this.renderStats();
            this.renderVendorTable();
        }, {
            saveLabel: 'Move to Recycle Bin',
            isDelete: true,
            subtitle: 'Temporary removal validation'
        });
    }

    // --- Detail Page (Acquisitions History) ---
    viewVendorDetails(vendorId) {
        const vendor = this.app.state.vendors.find(v => v.id === vendorId);
        if (!vendor) return;

        // Fetch purchase orders linked to this vendor
        const pos = (this.app.state.purchaseOrders || []).filter(p => p.supplierName.toLowerCase() === vendor.name.toLowerCase());
        const totalSpent = pos.filter(p => p.status === 'received').reduce((sum, p) => sum + p.total, 0);

        const initials = vendor.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const addressHtml = vendor.address 
            ? vendor.address.replace(/\n/g, '<br>') 
            : '<span style="color: var(--text-muted); font-style: italic;">No mailing address registered</span>';

        let purchasesListHtml = `
            <div class="empty-state" style="padding: 24px 0;">
                <i data-lucide="clipboard-list" style="width: 32px; height: 32px; color: var(--text-muted); opacity: 0.5;"></i>
                <h3>No Purchase History</h3>
                <p>No stock acquisitions have been recorded from this supplier yet.</p>
            </div>
        `;

        if (pos.length > 0) {
            purchasesListHtml = `
                <div class="table-container">
                    <table style="width: 100%;">
                        <thead>
                            <tr>
                                <th>PO Number</th>
                                <th>Date</th>
                                <th>Item Count</th>
                                <th>Total Cost</th>
                                <th>Delivery</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pos.map(po => {
                                const poDate = new Date(po.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                const itemsCount = po.items.reduce((sum, item) => sum + item.quantity, 0);
                                let deliveryBadge = 'badge-success';
                                if (po.status === 'ordered') deliveryBadge = 'badge-info';
                                if (po.status === 'cancelled') deliveryBadge = 'badge-danger';
                                
                                return `
                                    <tr>
                                        <td style="font-weight: 600; color: var(--text-primary);">${po.poNumber}</td>
                                        <td>${poDate}</td>
                                        <td>${itemsCount} items</td>
                                        <td style="font-weight: 600; color: var(--text-primary);">$${po.total.toFixed(2)}</td>
                                        <td>
                                            <span class="badge-pill ${deliveryBadge}">
                                                ${po.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }

        const detailsHtml = `
            <div class="detail-layout">
                <!-- Profile Card -->
                <div class="detail-sidebar">
                    <div class="detail-avatar" style="background: var(--accent-warning); box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);">${initials}</div>
                    <h3>${vendor.name}</h3>
                    <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 12px;">Category: ${vendor.category || 'General'}</p>
                    
                    <span class="badge-pill ${vendor.status === 'active' ? 'badge-success' : 'badge-danger'}" style="margin-bottom: 24px;">
                        ${vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)} Supplier
                    </span>
                    
                    <div class="info-list">
                        <div class="info-item">
                            <label>Primary Representative</label>
                            <p>${vendor.contactName}</p>
                        </div>
                        <div class="info-item">
                            <label>Email Address</label>
                            <p>${vendor.email}</p>
                        </div>
                        <div class="info-item">
                            <label>Telephone</label>
                            <p>${vendor.phone || '<span style="color: var(--text-muted)">Not provided</span>'}</p>
                        </div>
                    </div>
                </div>

                <!-- Right tabs -->
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <!-- Warehouse Address -->
                    <div class="card">
                        <div class="card-header">
                            <h2 style="font-size: 15px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">
                                <i data-lucide="map-pin" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 6px;"></i>
                                Warehouse & Office Location
                            </h2>
                        </div>
                        <p style="font-size: 14px; line-height: 1.6; color: var(--text-secondary);">${addressHtml}</p>
                    </div>

                    <!-- Acquisition Statistics -->
                    <div class="stats-grid" style="grid-template-columns: 1fr 1fr;">
                        <div class="stat-card" style="padding: 16px 20px;">
                            <div class="stat-info">
                                <span style="font-size: 10px;">Acquisitions Placed</span>
                                <h3 style="font-size: 20px; margin-top: 4px;">${pos.length}</h3>
                            </div>
                            <div class="stat-icon info" style="width: 38px; height: 38px;">
                                <i data-lucide="clipboard-list" style="width: 18px; height: 18px;"></i>
                            </div>
                        </div>
                        <div class="stat-card" style="padding: 16px 20px;">
                            <div class="stat-info">
                                <span style="font-size: 10px;">Restock Expenses</span>
                                <h3 style="font-size: 20px; margin-top: 4px;">$${totalSpent.toFixed(2)}</h3>
                            </div>
                            <div class="stat-icon success" style="width: 38px; height: 38px;">
                                <i data-lucide="dollar-sign" style="width: 18px; height: 18px;"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Purchase Orders History -->
                    <div class="card" style="padding: 20px;">
                        <div class="card-header">
                            <h2 style="font-size: 15px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">
                                <i data-lucide="history" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 6px;"></i>
                                Purchase Acquisition History
                            </h2>
                        </div>
                        ${purchasesListHtml}
                    </div>
                </div>
            </div>
        `;

        this.app.openModal('Supplier Record Profile', detailsHtml, null, {
            subtitle: `ID Reference: ${vendor.id}`
        });
    }
}
