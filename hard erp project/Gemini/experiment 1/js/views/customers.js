/* ==========================================================================
   Nexus ERP - Customer Management View Module (ES Module)
   ========================================================================== */

export class CustomerView {
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
        this.renderCustomerTable();
        this.setupEventListeners();
    }

    renderLayout() {
        const html = `
            <div class="page-header">
                <div class="page-title">
                    <h1>Customer Directory</h1>
                    <p>Manage customer profiles, contact directories, and transaction histories</p>
                </div>
                <button class="btn btn-primary" id="add-customer-btn">
                    <i data-lucide="plus"></i> Add Customer
                </button>
            </div>
            
            <!-- Statistics Section -->
            <div class="stats-grid" id="customer-stats">
                <!-- Stats populated dynamically -->
            </div>

            <!-- Action / Filter Bar -->
            <div class="card" style="padding: 16px;">
                <div class="action-bar">
                    <div class="search-input-wrapper">
                        <i data-lucide="search"></i>
                        <input type="text" id="customer-search" placeholder="Search by name, company, or email..." value="${this.searchQuery}">
                    </div>
                    
                    <div class="filter-actions">
                        <select class="select-custom" id="customer-status-filter">
                            <option value="all" ${this.statusFilter === 'all' ? 'selected' : ''}>All Statuses</option>
                            <option value="active" ${this.statusFilter === 'active' ? 'selected' : ''}>Active</option>
                            <option value="inactive" ${this.statusFilter === 'inactive' ? 'selected' : ''}>Inactive</option>
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
                                <th>Customer Details</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Status</th>
                                <th>Registered</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="customer-table-body">
                            <!-- Rows populated dynamically -->
                        </tbody>
                    </table>
                </div>
                <div id="customer-pagination"></div>
            </div>
        `;
        this.app.render(html);
    }

    renderStats() {
        const customers = this.app.state.customers;
        const total = customers.length;
        const active = customers.filter(c => c.status === 'active').length;
        const inactive = total - active;
        
        // Count customers registered in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newCustomers = customers.filter(c => new Date(c.createdAt) >= thirtyDaysAgo).length;

        const statsHtml = `
            <div class="stat-card">
                <div class="stat-info">
                    <span>Total Directory</span>
                    <h3>${total}</h3>
                    <div class="stat-trend up">
                        <i data-lucide="users" style="width: 10px; height: 10px;"></i>
                        <span>Contacts</span>
                    </div>
                </div>
                <div class="stat-icon primary">
                    <i data-lucide="users"></i>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-info">
                    <span>Active Status</span>
                    <h3>${active}</h3>
                    <div class="stat-trend up">
                        <i data-lucide="smile" style="width: 10px; height: 10px;"></i>
                        <span>${((active / (total || 1)) * 100).toFixed(0)}% engagement</span>
                    </div>
                </div>
                <div class="stat-icon success">
                    <i data-lucide="user-check"></i>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-info">
                    <span>Inactive Status</span>
                    <h3>${inactive}</h3>
                    <div class="stat-trend down">
                        <i data-lucide="user-minus" style="width: 10px; height: 10px;"></i>
                        <span>No activity</span>
                    </div>
                </div>
                <div class="stat-icon warning">
                    <i data-lucide="user-minus"></i>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-info">
                    <span>Acquisition (30d)</span>
                    <h3>+${newCustomers}</h3>
                    <div class="stat-trend up">
                        <i data-lucide="trending-up" style="width: 10px; height: 10px;"></i>
                        <span>New Signups</span>
                    </div>
                </div>
                <div class="stat-icon info">
                    <i data-lucide="user-plus"></i>
                </div>
            </div>
        `;
        
        const statsContainer = document.getElementById('customer-stats');
        if (statsContainer) {
            statsContainer.innerHTML = statsHtml;
        }
    }

    renderCustomerTable() {
        const tbody = document.getElementById('customer-table-body');
        if (!tbody) return;

        let filtered = this.app.state.customers;

        // Apply Search Filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase().trim();
            filtered = filtered.filter(c => 
                c.name.toLowerCase().includes(query) || 
                (c.company && c.company.toLowerCase().includes(query)) || 
                c.email.toLowerCase().includes(query)
            );
        }

        // Apply Status Filter
        if (this.statusFilter !== 'all') {
            filtered = filtered.filter(c => c.status === this.statusFilter);
        }

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="empty-state" style="padding: 40px 0;">
                            <i data-lucide="users" style="width: 40px; height: 40px; stroke-width: 1.5; color: var(--text-muted);"></i>
                            <h3>No customers found</h3>
                            <p>Try resetting filters or adding a new customer profile.</p>
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

        tbody.innerHTML = paginated.map(c => {
            const initials = c.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const dateStr = new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            return `
                <tr>
                    <td>
                        <div class="table-avatar-cell">
                            <div class="table-avatar">${initials}</div>
                            <div>
                                <div style="font-weight: 600; color: var(--text-primary);">${c.name}</div>
                                <div style="font-size: 12px; color: var(--text-muted);">${c.company || 'Individual'}</div>
                            </div>
                        </div>
                    </td>
                    <td>${c.email}</td>
                    <td>${c.phone || '<span style="color: var(--text-muted)">N/A</span>'}</td>
                    <td>
                        <span class="badge-pill ${c.status === 'active' ? 'badge-success' : 'badge-danger'}">
                            ${c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                        </span>
                    </td>
                    <td>${dateStr}</td>
                    <td class="text-right">
                        <div class="flex gap-2 justify-end" style="justify-content: flex-end;">
                            <button class="btn-icon-sm view" title="View Details" data-id="${c.id}">
                                <i data-lucide="eye"></i>
                            </button>
                            <button class="btn-icon-sm edit" title="Edit Contact" data-id="${c.id}">
                                <i data-lucide="edit-3"></i>
                            </button>
                            ${canDelete ? `
                                <button class="btn-icon-sm delete" title="Delete Profile" data-id="${c.id}">
                                    <i data-lucide="trash-2"></i>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Render Pagination Controls
        const pagEl = document.getElementById('customer-pagination');
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
        const addBtn = document.getElementById('add-customer-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openCustomerModal());
        }

        // Live Search
        const searchInput = document.getElementById('customer-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.currentPage = 1;
                this.renderCustomerTable();
            });
        }

        // Status Filter
        const filterSelect = document.getElementById('customer-status-filter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.statusFilter = e.target.value;
                this.currentPage = 1;
                this.renderCustomerTable();
            });
        }

        // Action Buttons delegation (view/edit/delete)
        const tbody = document.getElementById('customer-table-body');
        if (tbody) {
            tbody.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;

                const customerId = btn.getAttribute('data-id');
                if (!customerId) return;

                if (btn.classList.contains('view')) {
                    this.viewCustomerDetails(customerId);
                } else if (btn.classList.contains('edit')) {
                    this.openCustomerModal(customerId);
                } else if (btn.classList.contains('delete')) {
                    const role = this.app.state.currentUser.role;
                    if (role !== 'admin' && role !== 'manager') {
                        this.app.showToast('Access Denied: Admin or Manager authorization required to delete records.', 'error');
                        return;
                    }
                    this.confirmDeleteCustomer(customerId);
                }
            });
        }

        // Pagination clicks
        const pagContainer = document.getElementById('customer-pagination');
        if (pagContainer) {
            pagContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.pagination-btn');
                if (!btn) return;

                if (btn.classList.contains('prev') && this.currentPage > 1) {
                    this.currentPage--;
                    this.renderCustomerTable();
                } else if (btn.classList.contains('next') && this.currentPage < Math.ceil(this.app.state.customers.length / this.itemsPerPage)) {
                    this.currentPage++;
                    this.renderCustomerTable();
                } else if (btn.classList.contains('page-num')) {
                    this.currentPage = parseInt(btn.getAttribute('data-page'));
                    this.renderCustomerTable();
                }
            });
        }
    }

    // --- Modal Add / Edit Controller ---
    openCustomerModal(customerId = null) {
        const isEdit = !!customerId;
        let customerData = { name: '', company: '', email: '', phone: '', address: '', status: 'active' };
        
        if (isEdit) {
            const found = this.app.state.customers.find(c => c.id === customerId);
            if (found) customerData = { ...found };
            else {
                this.app.showToast('Customer data not found', 'error');
                return;
            }
        }

        const modalTitle = isEdit ? 'Modify Customer Profile' : 'Register New Customer';
        const modalSubtitle = isEdit 
            ? `Updating data for ${customerData.name}` 
            : 'Enter contact details and account status to enroll a new partner';

        const contentHtml = `
            <form id="customer-form" onsubmit="event.preventDefault();">
                <div class="form-grid">
                    <div class="form-group full-width">
                        <label for="modal-cust-name">Full Name *</label>
                        <input type="text" id="modal-cust-name" value="${customerData.name}" required placeholder="e.g. John Doe">
                    </div>
                    
                    <div class="form-group">
                        <label for="modal-cust-company">Company / Business</label>
                        <input type="text" id="modal-cust-company" value="${customerData.company}" placeholder="Leave empty for retail/private">
                    </div>

                    <div class="form-group">
                        <label for="modal-cust-status">Engagement Status</label>
                        <select id="modal-cust-status">
                            <option value="active" ${customerData.status === 'active' ? 'selected' : ''}>Active Partner</option>
                            <option value="inactive" ${customerData.status === 'inactive' ? 'selected' : ''}>Inactive/Prospect</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="modal-cust-email">Email Address *</label>
                        <input type="email" id="modal-cust-email" value="${customerData.email}" required placeholder="john@example.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="modal-cust-phone">Phone Number</label>
                        <input type="text" id="modal-cust-phone" value="${customerData.phone}" placeholder="(555) 000-0000">
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="modal-cust-address">Billing/Shipping Address</label>
                        <textarea id="modal-cust-address" rows="3" placeholder="Street, Suite/Apt, City, State, ZIP">${customerData.address || ''}</textarea>
                    </div>
                </div>
            </form>
        `;

        this.app.openModal(modalTitle, contentHtml, () => {
            // Retrieve values
            const name = document.getElementById('modal-cust-name').value.trim();
            const company = document.getElementById('modal-cust-company').value.trim();
            const status = document.getElementById('modal-cust-status').value;
            const email = document.getElementById('modal-cust-email').value.trim();
            const phone = document.getElementById('modal-cust-phone').value.trim();
            const address = document.getElementById('modal-cust-address').value.trim();

            // Simple validation
            if (!name || !email) {
                this.app.showToast('Please fill out all required fields.', 'warning');
                return;
            }

            if (isEdit) {
                // Update customer in state
                const index = this.app.state.customers.findIndex(c => c.id === customerId);
                if (index !== -1) {
                    this.app.state.customers[index] = {
                        ...this.app.state.customers[index],
                        name, company, status, email, phone, address
                    };
                    this.app.saveState('customers');
                    this.app.showToast(`Updated customer "${name}" successfully.`, 'success');
                }
            } else {
                // Add new customer
                const newCustomer = {
                    id: `cust-${Date.now()}`,
                    name, company, status, email, phone, address,
                    createdAt: new Date().toISOString()
                };
                this.app.state.customers.push(newCustomer);
                this.app.saveState('customers');
                this.app.showToast(`Created customer "${name}" successfully.`, 'success');
            }

            this.app.closeModal();
            this.renderStats();
            this.renderCustomerTable();
        }, {
            saveLabel: isEdit ? 'Apply Changes' : 'Register Customer',
            subtitle: modalSubtitle
        });
    }

    // --- Delete Confirmation Dialog ---
    confirmDeleteCustomer(customerId) {
        const role = this.app.state.currentUser.role;
        if (role !== 'admin' && role !== 'manager') {
            this.app.showToast('Access Denied: Admin or Manager authorization required to delete records.', 'error');
            return;
        }
        const found = this.app.state.customers.find(c => c.id === customerId);
        if (!found) return;

        const contentHtml = `
            <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.5;">
                <p>Are you sure you want to permanently delete the customer profile for <strong>${found.name}</strong>?</p>
                <p style="margin-top: 10px; color: var(--accent-danger); font-size: 13px;">
                    <i data-lucide="alert-triangle" style="width: 14px; height: 14px; display: inline; vertical-align: middle; margin-right: 4px;"></i>
                    This action will remove their record and contact details. Their past invoice histories will remain recorded in analytics but won't link to an active account.
                </p>
            </div>
        `;

        this.app.openModal('Delete Customer Profile', contentHtml, () => {
            this.app.state.customers = this.app.state.customers.filter(c => c.id !== customerId);
            this.app.saveState('customers');
            this.app.showToast(`Customer "${found.name}" deleted.`, 'success');
            this.app.closeModal();
            this.renderStats();
            this.renderCustomerTable();
        }, {
            saveLabel: 'Confirm Delete',
            isDelete: true,
            subtitle: 'This process cannot be undone'
        });
    }

    // --- View Customer Profile & Invoice history ---
    viewCustomerDetails(customerId) {
        const customer = this.app.state.customers.find(c => c.id === customerId);
        if (!customer) {
            this.app.showToast('Profile not found', 'error');
            return;
        }

        // Filter invoices linked to this customer
        const customerSales = this.app.state.sales.filter(s => s.customerId === customerId);
        const totalPurchased = customerSales.reduce((sum, s) => sum + s.total, 0);

        const initials = customer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const dateStr = new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

        const billingAddress = customer.address 
            ? customer.address.replace(/\n/g, '<br>') 
            : '<span style="color: var(--text-muted); font-style: italic;">No address provided</span>';

        // Render Invoice History
        let salesListHtml = `
            <div class="empty-state" style="padding: 24px 0;">
                <i data-lucide="receipt" style="width: 32px; height: 32px; color: var(--text-muted); opacity: 0.5;"></i>
                <h3>No Purchase History</h3>
                <p>This customer hasn't made any purchases yet.</p>
            </div>
        `;

        if (customerSales.length > 0) {
            salesListHtml = `
                <div class="table-container">
                    <table style="width: 100%;">
                        <thead>
                            <tr>
                                <th>Invoice</th>
                                <th>Date</th>
                                <th>Subtotal</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${customerSales.map(sale => {
                                const saleDate = new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                return `
                                    <tr>
                                        <td style="font-weight: 600; color: var(--text-primary);">${sale.invoiceNumber}</td>
                                        <td>${saleDate}</td>
                                        <td>$${sale.subtotal.toFixed(2)}</td>
                                        <td style="font-weight: 600; color: var(--text-primary);">$${sale.total.toFixed(2)}</td>
                                        <td>
                                            <span class="badge-pill ${sale.status === 'paid' ? 'badge-success' : 'badge-warning'}">
                                                ${sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
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
                <!-- Sidebar Summary -->
                <div class="detail-sidebar">
                    <div class="detail-avatar">${initials}</div>
                    <h3>${customer.name}</h3>
                    <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 12px;">${customer.company || 'Retail Client'}</p>
                    
                    <span class="badge-pill ${customer.status === 'active' ? 'badge-success' : 'badge-danger'}" style="margin-bottom: 24px;">
                        ${customer.status.charAt(0).toUpperCase() + customer.status.slice(1)} Status
                    </span>
                    
                    <div class="info-list">
                        <div class="info-item">
                            <label>Email Address</label>
                            <p>${customer.email}</p>
                        </div>
                        <div class="info-item">
                            <label>Phone Number</label>
                            <p>${customer.phone || '<span style="color: var(--text-muted)">Not provided</span>'}</p>
                        </div>
                        <div class="info-item">
                            <label>Registered On</label>
                            <p>${dateStr}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Main History / Address Tabs -->
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <!-- Billing Information -->
                    <div class="card">
                        <div class="card-header">
                            <h2 style="font-size: 15px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">
                                <i data-lucide="map-pin" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 6px;"></i>
                                Billing & Shipping Location
                            </h2>
                        </div>
                        <p style="font-size: 14px; line-height: 1.6; color: var(--text-secondary);">${billingAddress}</p>
                    </div>

                    <!-- Financial Summary -->
                    <div class="stats-grid" style="grid-template-columns: 1fr 1fr;">
                        <div class="stat-card" style="padding: 16px 20px;">
                            <div class="stat-info">
                                <span style="font-size: 10px;">Invoices Issued</span>
                                <h3 style="font-size: 20px; margin-top: 4px;">${customerSales.length}</h3>
                            </div>
                            <div class="stat-icon info" style="width: 38px; height: 38px;">
                                <i data-lucide="file-text" style="width: 18px; height: 18px;"></i>
                            </div>
                        </div>
                        <div class="stat-card" style="padding: 16px 20px;">
                            <div class="stat-info">
                                <span style="font-size: 10px;">Total Revenue</span>
                                <h3 style="font-size: 20px; margin-top: 4px;">$${totalPurchased.toFixed(2)}</h3>
                            </div>
                            <div class="stat-icon success" style="width: 38px; height: 38px;">
                                <i data-lucide="dollar-sign" style="width: 18px; height: 18px;"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Order History -->
                    <div class="card" style="padding: 20px;">
                        <div class="card-header">
                            <h2 style="font-size: 15px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">
                                <i data-lucide="history" style="width: 14px; height: 14px; vertical-align: middle; margin-right: 6px;"></i>
                                Invoice purchase records
                            </h2>
                        </div>
                        ${salesListHtml}
                    </div>
                </div>
            </div>
        `;

        this.app.openModal('Client Record Profile', detailsHtml, null, {
            subtitle: `ID Reference: ${customer.id}`
        });
    }
}
