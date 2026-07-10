/* ==========================================================================
   Nexus ERP - Users Management View (ES Module)
   ========================================================================== */

export class UsersView {
    constructor(app) {
        this.app = app;
        this.searchQuery = '';
    }

    init() {
        const isAdmin = this.app.state.currentUser.role === 'admin';

        if (!isAdmin) {
            this.renderAccessDenied();
            return;
        }

        this.renderLayout();
        this.renderUsersTable();
        this.setupEventListeners();
    }

    renderAccessDenied() {
        const html = `
            <div class="card" style="padding: 60px 20px; text-align: center; max-width: 600px; margin: 40px auto;">
                <div style="background: rgba(239, 68, 68, 0.1); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                    <i data-lucide="shield-alert" style="width: 40px; height: 40px; color: var(--accent-danger);"></i>
                </div>
                <h2 style="font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 12px; font-family: var(--font-headers);">Access Denied</h2>
                <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 24px;">
                    You do not have the required permissions to manage system user accounts. User administration is restricted to System Administrators only.
                </p>
                <button class="btn btn-primary" onclick="window.location.hash = '#dashboard'">
                    Return to Dashboard
                </button>
            </div>
        `;
        this.app.render(html);
        if (window.lucide) lucide.createIcons();
    }

    renderLayout() {
        const html = `
            <div class="view-header">
                <div>
                    <h1>User Accounts</h1>
                    <p class="subtitle">Provision, configure roles, and audit system operators</p>
                </div>
                <div>
                    <button class="btn btn-primary" id="add-user-btn">
                        <i data-lucide="user-plus"></i>
                        Register User Account
                    </button>
                </div>
            </div>
            
            <!-- Action / Filter Bar -->
            <div class="card" style="padding: 16px;">
                <div class="action-bar">
                    <div class="search-input-wrapper">
                        <i data-lucide="search"></i>
                        <input type="text" id="users-search" placeholder="Search by Name or Email..." value="${this.searchQuery}">
                    </div>
                </div>
            </div>

            <!-- Main Table Card -->
            <div class="card" style="padding: 0; overflow: hidden;">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Operator Name</th>
                                <th>Email Address</th>
                                <th>Assigned Role</th>
                                <th>Status</th>
                                <th class="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="users-table-body">
                            <!-- Rows populated dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        this.app.render(html);
    }

    renderUsersTable() {
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;

        let filtered = this.app.state.users || [];

        // Apply Search Filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase().trim();
            filtered = filtered.filter(u => 
                u.name.toLowerCase().includes(query) || 
                u.email.toLowerCase().includes(query)
            );
        }

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5">
                        <div class="empty-state" style="padding: 40px 0;">
                            <i data-lucide="shield-check" style="width: 40px; height: 40px; stroke-width: 1.5; color: var(--text-muted);"></i>
                            <h3>No operators registered</h3>
                            <p>Try resetting searches or create a new user profile.</p>
                        </div>
                    </td>
                </tr>
            `;
            if (window.lucide) lucide.createIcons();
            return;
        }

        tbody.innerHTML = filtered.map(u => {
            const initials = u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            
            let roleBadge = 'badge-success'; // Admin
            if (u.role === 'manager') roleBadge = 'badge-warning';
            if (u.role === 'staff') roleBadge = 'badge-info';

            // Don't let users delete their own account currently logged in
            const isSelf = u.email === 'john@nexuserp.com'; // Admin mock self

            return `
                <tr>
                    <td>
                        <div class="table-avatar-cell">
                            <div class="table-avatar" style="background: rgba(147, 51, 234, 0.15); color: #a855f7; border-color: rgba(147, 51, 234, 0.25);">${initials}</div>
                            <div>
                                <div style="font-weight: 600; color: var(--text-primary);">${u.name} ${isSelf ? '<span style="font-size: 10px; color: var(--text-muted); font-style: italic;">(You)</span>' : ''}</div>
                                <div style="font-size: 11px; color: var(--text-muted);">System Operator</div>
                            </div>
                        </div>
                    </td>
                    <td>${u.email}</td>
                    <td>
                        <span class="badge-pill ${roleBadge}">
                            ${u.role.toUpperCase()}
                        </span>
                    </td>
                    <td>
                        <span class="badge-pill badge-success">
                            ${u.status.toUpperCase()}
                        </span>
                    </td>
                    <td class="text-right">
                        <div class="flex gap-2 justify-end" style="justify-content: flex-end;">
                            <button class="btn-icon-sm edit" title="Edit User" data-id="${u.id}">
                                <i data-lucide="edit-3"></i>
                            </button>
                            ${!isSelf ? `
                                <button class="btn-icon-sm delete" title="Delete User" data-id="${u.id}">
                                    <i data-lucide="trash-2"></i>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();
    }

    setupEventListeners() {
        const addBtn = document.getElementById('add-user-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openUserModal());
        }

        const searchInput = document.getElementById('users-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.renderUsersTable();
            });
        }

        const tbody = document.getElementById('users-table-body');
        if (tbody) {
            tbody.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;

                const userId = btn.getAttribute('data-id');
                if (!userId) return;

                if (btn.classList.contains('edit')) {
                    this.openUserModal(userId);
                } else if (btn.classList.contains('delete')) {
                    this.confirmDeleteUser(userId);
                }
            });
        }
    }

    openUserModal(userId = null) {
        const isEdit = !!userId;
        let userData = { name: '', email: '', role: 'staff', status: 'active' };

        if (isEdit) {
            const found = this.app.state.users.find(u => u.id === userId);
            if (found) userData = { ...found };
            else {
                this.app.showToast('User not found', 'error');
                return;
            }
        }

        const modalTitle = isEdit ? 'Edit Operator Account' : 'Register Operator Account';
        const contentHtml = `
            <form id="user-form" onsubmit="event.preventDefault();">
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div class="form-group">
                        <label for="modal-user-name">Full Name *</label>
                        <input type="text" id="modal-user-name" value="${userData.name}" required placeholder="e.g. Alice Watson">
                    </div>
                    
                    <div class="form-group">
                        <label for="modal-user-email">Email Address *</label>
                        <input type="email" id="modal-user-email" value="${userData.email}" required placeholder="e.g. alice@nexuserp.com">
                    </div>

                    <div class="form-group">
                        <label for="modal-user-role">System Authorization Role *</label>
                        <select id="modal-user-role">
                            <option value="admin" ${userData.role === 'admin' ? 'selected' : ''}>Admin (Full Access & User Management)</option>
                            <option value="manager" ${userData.role === 'manager' ? 'selected' : ''}>Manager (Deletions Allowed, No User Management)</option>
                            <option value="staff" ${userData.role === 'staff' ? 'selected' : ''}>Staff (Operational Access Only)</option>
                        </select>
                    </div>
                </div>
            </form>
        `;

        this.app.openModal(modalTitle, contentHtml, () => {
            const name = document.getElementById('modal-user-name').value.trim();
            const email = document.getElementById('modal-user-email').value.trim();
            const role = document.getElementById('modal-user-role').value;

            if (!name || !email) {
                this.app.showToast('Please fill in all fields.', 'warning');
                return;
            }

            if (isEdit) {
                const idx = this.app.state.users.findIndex(u => u.id === userId);
                if (idx !== -1) {
                    this.app.state.users[idx] = { ...this.app.state.users[idx], name, email, role };
                    this.app.saveState('users');
                    this.app.showToast(`User account "${name}" updated.`, 'success');
                }
            } else {
                this.app.state.users.push({
                    id: `usr-${Date.now()}`,
                    name,
                    email,
                    role,
                    status: 'active'
                });
                this.app.saveState('users');
                this.app.showToast(`User account "${name}" created.`, 'success');
            }

            this.app.closeModal();
            this.renderUsersTable();
        }, {
            saveLabel: isEdit ? 'Apply Changes' : 'Register Operator',
            subtitle: isEdit ? `Configuring login profile for ${userData.name}` : 'Define system permissions access level'
        });
    }

    confirmDeleteUser(userId) {
        const found = this.app.state.users.find(u => u.id === userId);
        if (!found) return;

        const contentHtml = `
            <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.5;">
                <p>Are you sure you want to permanently revoke system access for <strong>${found.name}</strong>?</p>
                <p style="margin-top: 10px; color: var(--accent-danger); font-size: 13px;">
                    <i data-lucide="alert-triangle" style="width: 14px; height: 14px; display: inline; vertical-align: middle; margin-right: 4px;"></i>
                    This action deletes their operator record. They will no longer be listed in logs.
                </p>
            </div>
        `;

        this.app.openModal('Revoke Operator Access', contentHtml, () => {
            this.app.state.users = this.app.state.users.filter(u => u.id !== userId);
            this.app.saveState('users');
            this.app.showToast(`Operator "${found.name}" deleted.`, 'success');
            this.app.closeModal();
            this.renderUsersTable();
        }, {
            saveLabel: 'Revoke Access',
            isDelete: true,
            subtitle: 'This process cannot be undone'
        });
    }
}
