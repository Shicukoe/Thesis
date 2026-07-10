/* ==========================================================================
   Nexus ERP - Central Application Orchestrator (ES Module)
   ==========================================================================
   
   BUSINESS LOGIC & POLICIES SUMMARY:
   
   1. Role-Based Access Control (RBAC):
      - ADMIN: Full system access. The only role authorized to manage operator accounts
               via '#users' view, revoke access, and configure permissions.
      - MANAGER: Operational management role. Allowed to delete customer profiles 
                 and product catalog SKUs, but blocked from user account administration.
      - STAFF: Operational viewing and logging. Blocked from deleting customers/products
               and managing operator accounts.
               
   2. Inventory Stock & Reorder Thresholds:
      - Each product catalog listing supports a customizable 'minStock' limit.
      - The Executive Dashboard dynamically tracks low-stock alerts if a product's
        current stock drops below or meets its configured reorder limit (stock <= minStock).
        
   3. Invoice Billing Lifecycle:
      - Automatical creation of invoice bills on Sales Order confirmation.
      - Due date is strictly set to Net-15 days (15 days after invoice generation).
      - Accepted payment methods: Cash, Bank Transfer (Credit Cards excluded).
      - Payment status lifecycle: Unpaid, Partially Paid, and Paid.
   ========================================================================== */

// Import views
import { CustomerView } from './js/views/customers.js';
import { InventoryView } from './js/views/inventory.js';
import { SalesView } from './js/views/sales.js';
import { PurchaseView } from './js/views/purchases.js';
import { VendorView } from './js/views/vendors.js';
import { UsersView } from './js/views/users.js';
import { ReportsView } from './js/views/reports.js';

class App {
    constructor() {
        this.state = {
            customers: [],
            inventory: [],
            sales: [],
            purchaseOrders: [],
            vendors: [],
            users: [],
            auditLogs: [],
            currentUser: { name: 'John Storeowner', role: 'admin' },
            currentTheme: 'dark'
        };
        
        this.views = {};
        this.currentView = null;
        
        // Initialize the app
        this.init();
    }

    async init() {
        this.loadData();
        this.initTheme();
        this.setupGlobalEvents();
        this.registerViews();
        
        // Handle routing
        window.addEventListener('hashchange', () => this.handleRouting());
        
        // Initial route trigger
        if (!window.location.hash) {
            window.location.hash = '#dashboard';
        } else {
            this.handleRouting();
        }
        
        // Update topbar date
        this.updateDate();
        setInterval(() => this.updateDate(), 60000); // Update every minute
        
        console.log('Nexus ERP initialized successfully.');
    }

    // --- Data Persistence ---
    loadData() {
        const storedCustomers = localStorage.getItem('nexus_customers');
        const storedInventory = localStorage.getItem('nexus_inventory');
        const storedSales = localStorage.getItem('nexus_sales');
        const storedPurchaseOrders = localStorage.getItem('nexus_purchaseOrders');
        const storedVendors = localStorage.getItem('nexus_vendors');
        const storedUsers = localStorage.getItem('nexus_users');
        const storedCurrentUser = localStorage.getItem('nexus_currentUser');
        
        if (storedCustomers) this.state.customers = JSON.parse(storedCustomers);
        else this.state.customers = this.getMockCustomers();
        
        if (storedInventory) this.state.inventory = JSON.parse(storedInventory);
        else this.state.inventory = this.getMockInventory();
        
        if (storedSales) this.state.sales = JSON.parse(storedSales);
        else this.state.sales = this.getMockSales();

        if (storedPurchaseOrders) this.state.purchaseOrders = JSON.parse(storedPurchaseOrders);
        else this.state.purchaseOrders = this.getMockPurchaseOrders();

        if (storedVendors) this.state.vendors = JSON.parse(storedVendors);
        else this.state.vendors = this.getMockVendors();

        if (storedUsers) this.state.users = JSON.parse(storedUsers);
        else this.state.users = [
            { id: 'usr-1', name: 'John Storeowner', email: 'john@nexuserp.com', role: 'admin', status: 'active' },
            { id: 'usr-2', name: 'Bob Supervisor', email: 'bob@nexuserp.com', role: 'manager', status: 'active' },
            { id: 'usr-3', name: 'Jane Clerk', email: 'jane@nexuserp.com', role: 'staff', status: 'active' }
        ];

        if (storedCurrentUser) this.state.currentUser = JSON.parse(storedCurrentUser);
        else this.state.currentUser = { name: 'John Storeowner', role: 'admin' };

        const storedAuditLogs = localStorage.getItem('nexus_auditLogs');
        if (storedAuditLogs) this.state.auditLogs = JSON.parse(storedAuditLogs);
        else this.state.auditLogs = [];
        
        // Save initial state if it was empty
        if (!storedCustomers || !storedInventory || !storedSales || !storedPurchaseOrders || !storedVendors || !storedUsers || !storedCurrentUser) {
            this.saveAllData();
        }
    }

    saveAllData() {
        localStorage.setItem('nexus_customers', JSON.stringify(this.state.customers));
        localStorage.setItem('nexus_inventory', JSON.stringify(this.state.inventory));
        localStorage.setItem('nexus_sales', JSON.stringify(this.state.sales));
        localStorage.setItem('nexus_purchaseOrders', JSON.stringify(this.state.purchaseOrders));
        localStorage.setItem('nexus_vendors', JSON.stringify(this.state.vendors));
        localStorage.setItem('nexus_users', JSON.stringify(this.state.users));
        localStorage.setItem('nexus_currentUser', JSON.stringify(this.state.currentUser));
        localStorage.setItem('nexus_auditLogs', JSON.stringify(this.state.auditLogs));
    }

    saveState(key) {
        if (key in this.state) {
            localStorage.setItem(`nexus_${key}`, JSON.stringify(this.state[key]));
        }
    }

    // --- Mock Data Provision ---
    getMockCustomers() {
        return [
            {
                id: 'cust-1',
                name: 'Jane Cooper',
                company: 'Acme Corporation',
                email: 'jane.c@acme.com',
                phone: '(555) 012-3456',
                status: 'active',
                createdAt: '2026-01-15T08:30:00Z',
                address: '123 Business Rd, Suite 100, Metropolis, NY 10001'
            },
            {
                id: 'cust-2',
                name: 'Cody Fisher',
                company: 'Fisher Retail Partners',
                email: 'cody.fisher@fisherretail.com',
                phone: '(555) 014-3889',
                status: 'active',
                createdAt: '2026-02-10T11:15:00Z',
                address: '456 Market St, San Francisco, CA 94103'
            },
            {
                id: 'cust-3',
                name: 'Esther Howard',
                company: 'Tech Solutions Inc',
                email: 'esther.h@techsol.io',
                phone: '(555) 019-2834',
                status: 'inactive',
                createdAt: '2026-03-01T14:45:00Z',
                address: '789 Innovation Way, Austin, TX 78701'
            },
            {
                id: 'cust-4',
                name: 'Jenny Wilson',
                company: 'Individual',
                email: 'jenny.wilson@gmail.com',
                phone: '(555) 017-9821',
                status: 'active',
                createdAt: '2026-04-18T09:20:00Z',
                address: '321 Elm St, Apt 4B, Seattle, WA 98101'
            },
            {
                id: 'cust-5',
                name: 'Kristin Watson',
                company: 'Watson & Sons Logistics',
                email: 'kristin@watsonlogistics.com',
                phone: '(555) 011-8932',
                status: 'active',
                createdAt: '2026-05-22T16:10:00Z',
                address: '555 Cargo Way, Chicago, IL 60607'
            }
        ];
    }

    getMockInventory() {
        return [
            { id: 'prod-1', name: 'Premium Mechanical Keyboard', sku: 'KBD-MECH-01', category: 'Electronics', price: 129.99, stock: 45, minStock: 10 },
            { id: 'prod-2', name: 'Ergonomic Wireless Mouse', sku: 'MSE-ERGO-02', category: 'Electronics', price: 79.99, stock: 8, minStock: 15 },
            { id: 'prod-3', name: 'USB-C Multiport Docking Station', sku: 'HUB-USBC-03', category: 'Accessories', price: 59.99, stock: 24, minStock: 8 },
            { id: 'prod-4', name: '27" 4K IPS Creator Monitor', sku: 'MON-4K-27', category: 'Electronics', price: 349.99, stock: 12, minStock: 5 },
            { id: 'prod-5', name: 'Noise-Cancelling Office Headset', sku: 'AUD-NC-05', category: 'Accessories', price: 89.99, stock: 3, minStock: 10 }
        ];
    }

    getMockSales() {
        return [
            {
                id: 'sale-1',
                invoiceNumber: 'INV-1001',
                customerId: 'cust-1',
                customerName: 'Jane Cooper',
                date: '2026-06-15T10:30:00Z',
                items: [
                    { productId: 'prod-1', name: 'Premium Mechanical Keyboard', quantity: 2, price: 129.99 },
                    { productId: 'prod-3', name: 'USB-C Multiport Docking Station', quantity: 1, price: 59.99 }
                ],
                subtotal: 319.97,
                tax: 25.60,
                total: 345.57,
                status: 'paid',
                payments: [
                    { id: 'pay-1', date: '2026-06-15T11:00:00Z', amount: 345.57, method: 'Bank Transfer', notes: 'Full Settlement' }
                ]
            },
            {
                id: 'sale-2',
                invoiceNumber: 'INV-1002',
                customerId: 'cust-2',
                customerName: 'Cody Fisher',
                date: '2026-06-18T14:20:00Z',
                items: [
                    { productId: 'prod-4', name: '27" 4K IPS Creator Monitor', quantity: 1, price: 349.99 }
                ],
                subtotal: 349.99,
                tax: 28.00,
                total: 377.99,
                status: 'paid',
                payments: [
                    { id: 'pay-2', date: '2026-06-18T15:00:00Z', amount: 377.99, method: 'Bank Transfer', notes: 'Paid in full' }
                ]
            },
            {
                id: 'sale-3',
                invoiceNumber: 'INV-1003',
                customerId: 'cust-4',
                customerName: 'Jenny Wilson',
                date: '2026-06-25T09:15:00Z',
                items: [
                    { productId: 'prod-2', name: 'Ergonomic Wireless Mouse', quantity: 1, price: 79.99 },
                    { productId: 'prod-5', name: 'Noise-Cancelling Office Headset', quantity: 1, price: 89.99 }
                ],
                subtotal: 169.98,
                tax: 13.60,
                total: 183.58,
                status: 'unpaid',
                payments: []
            }
        ];
    }

    getMockPurchaseOrders() {
        return [
            {
                id: 'po-1',
                poNumber: 'PO-1001',
                supplierName: 'Global Keyboard Corp',
                date: '2026-06-10T09:00:00Z',
                items: [
                    { productId: 'prod-1', name: 'Premium Mechanical Keyboard', quantity: 15, costPrice: 84.50 }
                ],
                total: 1267.50,
                status: 'received'
            },
            {
                id: 'po-2',
                poNumber: 'PO-1002',
                supplierName: 'Apex Logistics & Tech',
                date: '2026-06-28T11:30:00Z',
                items: [
                    { productId: 'prod-2', name: 'Ergonomic Wireless Mouse', quantity: 20, costPrice: 52.00 },
                    { productId: 'prod-5', name: 'Noise-Cancelling Office Headset', quantity: 10, costPrice: 58.50 }
                ],
                total: 1625.00,
                status: 'ordered'
            }
        ];
    }

    getMockVendors() {
        return [
            {
                id: 'vend-1',
                name: 'Global Keyboard Corp',
                contactName: 'Alice Chen',
                email: 'alice@globalkeyboards.com',
                phone: '(555) 019-8833',
                category: 'Electronics',
                address: '100 Silicon Blvd, Suite A, San Jose, CA 95112',
                status: 'active',
                createdAt: '2026-01-10T10:00:00Z'
            },
            {
                id: 'vend-2',
                name: 'Apex Logistics & Tech',
                contactName: 'Robert Miller',
                email: 'robert@apexlogistics.com',
                phone: '(555) 014-9988',
                category: 'Logistics',
                address: '404 Supply Chain Way, Chicago, IL 60609',
                status: 'active',
                createdAt: '2026-02-14T09:15:00Z'
            },
            {
                id: 'vend-3',
                name: 'Chipset Silicon Ltd',
                contactName: 'Takashi Sato',
                email: 'sato@chipsetsilicon.jp',
                phone: '+81 3-5555-1234',
                category: 'Electronics',
                address: '1-2-3 Chiyoda, Chiyoda-ku, Tokyo 100-0001',
                status: 'inactive',
                createdAt: '2026-03-20T14:45:00Z'
            }
        ];
    }

    // --- Routing System ---
    registerViews() {
        // Instantiate modules
        this.views.customers = new CustomerView(this);
        
        // Add stubs for modules yet to be built to ensure navigation works gracefully
        this.views.dashboard = {
            init: () => {
                const totalCusts = this.state.customers.length;
                const totalProds = this.state.inventory.length;
                
                // Calculate revenue metrics
                const activeSales = this.state.sales.filter(s => s.status !== 'cancelled');
                const totalRevenue = activeSales.reduce((sum, s) => sum + s.total, 0);
                const outstandingCount = this.state.sales.filter(s => s.status !== 'paid' && s.status !== 'cancelled').length;

                // Calculate low stock products (drops below custom minStock threshold)
                const lowStockItems = this.state.inventory.filter(item => item.stock <= item.minStock);
                
                let lowStockHtml = '';
                if (lowStockItems.length > 0) {
                    lowStockHtml = `
                        <div class="card" style="border-color: rgba(239, 68, 68, 0.25);">
                            <div class="card-header" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 16px;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <i data-lucide="alert-triangle" style="color: var(--accent-danger); width: 18px; height: 18px;"></i>
                                    <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; color: var(--accent-danger); letter-spacing: 0.5px;">
                                        Low Stock Alerts
                                    </h2>
                                </div>
                                <span class="badge-pill badge-danger">${lowStockItems.length} Alert</span>
                            </div>
                            <div class="table-container" style="border: 1px solid var(--border-color); border-radius: var(--border-radius-md); overflow: hidden;">
                                <table style="width: 100%;">
                                    <thead>
                                        <tr style="background: rgba(255,255,255,0.015);">
                                            <th>SKU</th>
                                            <th>Product Name</th>
                                            <th class="text-right" style="padding-right: 20px;">Current Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${lowStockItems.slice(0, 3).map(item => {
                                            const badgeClass = item.stock === 0 ? 'badge-danger' : 'badge-warning';
                                            const labelText = item.stock === 0 ? 'Out of Stock' : 'Low Stock';
                                            return `
                                                <tr style="cursor: pointer;" onclick="window.location.hash = '#inventory'">
                                                    <td><code style="font-family: monospace; padding: 2px 6px; background: rgba(255,255,255,0.05); border-radius: 4px; font-size: 11px; color: var(--text-secondary);">${item.sku}</code></td>
                                                    <td style="font-weight: 600; color: var(--text-primary); font-size: 13px;">${item.name}</td>
                                                    <td class="text-right" style="padding-right: 20px;">
                                                        <span class="badge-pill ${badgeClass}" style="font-weight: 700; font-size: 11px; padding: 2px 8px;">
                                                            ${item.stock} (${labelText})
                                                        </span>
                                                    </td>
                                                </tr>
                                            `;
                                        }).join('')}
                                        ${lowStockItems.length > 3 ? `
                                            <tr>
                                                <td colspan="3" style="text-align: center; font-size: 12px; color: var(--text-muted); cursor: pointer;" onclick="window.location.hash = '#inventory'">
                                                    + ${lowStockItems.length - 3} more catalog alert(s). Click to review list.
                                                </td>
                                            </tr>
                                        ` : ''}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    `;
                } else {
                    lowStockHtml = `
                        <div class="card" style="border-color: rgba(16, 185, 129, 0.25);">
                            <div style="display: flex; align-items: center; gap: 12px; padding: 8px 4px;">
                                <div style="background: rgba(16, 185, 129, 0.1); width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <i data-lucide="check-circle" style="color: var(--accent-success); width: 20px; height: 20px;"></i>
                                </div>
                                <div>
                                    <h4 style="font-size: 13.5px; font-weight: 700; color: #fff; margin-bottom: 2px;">Stock Levels Optimal</h4>
                                    <p style="color: var(--text-muted); font-size: 12px; line-height: 1.4;">All products are currently holding stock levels above configured reorder limits.</p>
                                </div>
                            </div>
                        </div>
                    `;
                }

                // Recent invoices
                const recentSales = [...this.state.sales].reverse().slice(0, 5);
                let recentSalesHtml = `
                    <div class="empty-state" style="padding: 32px 0;">
                        <i data-lucide="receipt" style="width: 32px; height: 32px; color: var(--text-muted); opacity: 0.5;"></i>
                        <h3>No Sales Transactions</h3>
                        <p>Generate sales invoices to populate transaction logs.</p>
                    </div>
                `;

                if (recentSales.length > 0) {
                    recentSalesHtml = `
                        <div class="table-container" style="border: 1px solid var(--border-color); border-radius: var(--border-radius-md); overflow: hidden;">
                            <table style="width: 100%;">
                                <thead>
                                    <tr style="background: rgba(255,255,255,0.015);">
                                        <th>Invoice</th>
                                        <th>Date</th>
                                        <th>Customer</th>
                                        <th class="text-right">Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${recentSales.map(sale => {
                                        const cust = this.state.customers.find(c => c.id === sale.customerId);
                                        const custName = cust ? cust.name : (sale.customerName || 'Retail Client');
                                        const saleDate = new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                        
                                        let badgeClass = 'badge-warning';
                                        if (sale.status === 'paid') badgeClass = 'badge-success';
                                        else if (sale.status === 'partially_paid') badgeClass = 'badge-info';

                                        return `
                                            <tr style="cursor: pointer;" onclick="window.location.hash = '#sales'">
                                                <td style="font-weight: 600; color: var(--text-primary); font-size: 13px;">${sale.invoiceNumber}</td>
                                                <td style="font-size: 13px;">${saleDate}</td>
                                                <td style="font-size: 13px; font-weight: 500; color: var(--text-secondary);">${custName}</td>
                                                <td class="text-right" style="font-weight: 600; color: var(--text-primary); font-size: 13px;">$${sale.total.toFixed(2)}</td>
                                                <td>
                                                    <span class="badge-pill ${badgeClass}" style="font-size: 10px; padding: 2px 8px;">
                                                        ${sale.status.charAt(0).toUpperCase() + sale.status.slice(1).replace('_', ' ')}
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

                // Greeting based on time of day
                const hours = new Date().getHours();
                let greeting = 'Good evening';
                if (hours < 12) greeting = 'Good morning';
                else if (hours < 18) greeting = 'Good afternoon';

                this.render(`
                    <div class="view-header" style="margin-bottom: 24px;">
                        <div>
                            <h1>Dashboard Overview</h1>
                            <p class="subtitle">${greeting}, <strong>${this.state.currentUser.name}</strong>. Here is your enterprise performance report.</p>
                        </div>
                    </div>
                    
                    <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 24px;">
                        <!-- Gross revenue -->
                        <div class="stat-card" style="cursor: pointer;" onclick="window.location.hash = '#reports'">
                            <div class="stat-info">
                                <span>Gross Sales Revenue</span>
                                <h3>$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                                <div class="stat-trend up">
                                    <i data-lucide="trending-up" style="width: 10px; height: 10px;"></i>
                                    <span>All-time settled volume</span>
                                </div>
                            </div>
                            <div class="stat-icon success">
                                <i data-lucide="dollar-sign"></i>
                            </div>
                        </div>

                        <!-- Pending Orders -->
                        <div class="stat-card" style="cursor: pointer;" onclick="window.location.hash = '#sales'">
                            <div class="stat-info">
                                <span>Outstanding Invoices</span>
                                <h3>${outstandingCount}</h3>
                                <div class="stat-trend warning" style="color: var(--accent-warning); background: var(--accent-warning-bg);">
                                    <i data-lucide="clock" style="width: 10px; height: 10px;"></i>
                                    <span>Awaiting payment reconciliation</span>
                                </div>
                            </div>
                            <div class="stat-icon warning">
                                <i data-lucide="file-warning"></i>
                            </div>
                        </div>

                        <!-- Product Count -->
                        <div class="stat-card" style="cursor: pointer;" onclick="window.location.hash = '#inventory'">
                            <div class="stat-info">
                                <span>Catalog Catalogues</span>
                                <h3>${totalProds}</h3>
                                <div class="stat-trend up">
                                    <i data-lucide="package" style="width: 10px; height: 10px;"></i>
                                    <span>Registered SKUs</span>
                                </div>
                            </div>
                            <div class="stat-icon primary">
                                <i data-lucide="package"></i>
                            </div>
                        </div>

                        <!-- Customer Count -->
                        <div class="stat-card" style="cursor: pointer;" onclick="window.location.hash = '#customers'">
                            <div class="stat-info">
                                <span>Total Customers</span>
                                <h3>${totalCusts}</h3>
                                <div class="stat-trend up">
                                    <i data-lucide="users" style="width: 10px; height: 10px;"></i>
                                    <span>Active directory</span>
                                </div>
                            </div>
                            <div class="stat-icon info">
                                <i data-lucide="users"></i>
                            </div>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1.6fr 1fr; gap: 24px; align-items: start;">
                        <!-- Left Layout (Alerts and Transactions) -->
                        <div style="display: flex; flex-direction: column; gap: 24px;">
                            <!-- Low Stock Alerts Panel -->
                            ${lowStockHtml}

                            <!-- Recent Sales Transactions Card -->
                            <div class="card" style="padding: 24px;">
                                <div class="card-header" style="margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                                    <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px;">
                                        <i data-lucide="receipt" style="color: var(--primary-color); width: 18px; height: 18px;"></i>
                                        Recent Invoiced Transactions
                                    </h2>
                                    <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 11px; height: auto;" onclick="window.location.hash = '#sales'">
                                        View All
                                    </button>
                                </div>
                                ${recentSalesHtml}
                            </div>
                        </div>

                        <!-- Right Layout (Quick Actions and Summary) -->
                        <div style="display: flex; flex-direction: column; gap: 24px;">
                            <!-- Quick Operations Tiles -->
                            <div class="card" style="padding: 24px;">
                                <div class="card-header" style="margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                                    <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px;">
                                        <i data-lucide="zap" style="color: var(--primary-color); width: 18px; height: 18px;"></i>
                                        Quick Operations
                                    </h2>
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                    <button class="btn btn-secondary" style="display: flex; flex-direction: column; gap: 8px; align-items: center; justify-content: center; height: 80px; font-size: 12px; font-weight: 600; text-align: center; border: 1px solid var(--border-color); background: rgba(255,255,255,0.01);" onclick="window.location.hash = '#sales'">
                                        <i data-lucide="file-plus" style="width: 20px; height: 20px; color: var(--primary-color);"></i>
                                        New Order
                                    </button>
                                    <button class="btn btn-secondary" style="display: flex; flex-direction: column; gap: 8px; align-items: center; justify-content: center; height: 80px; font-size: 12px; font-weight: 600; text-align: center; border: 1px solid var(--border-color); background: rgba(255,255,255,0.01);" onclick="window.location.hash = '#inventory'">
                                        <i data-lucide="package-plus" style="width: 20px; height: 20px; color: var(--accent-success);"></i>
                                        Add SKU
                                    </button>
                                    <button class="btn btn-secondary" style="display: flex; flex-direction: column; gap: 8px; align-items: center; justify-content: center; height: 80px; font-size: 12px; font-weight: 600; text-align: center; border: 1px solid var(--border-color); background: rgba(255,255,255,0.01);" onclick="window.location.hash = '#customers'">
                                        <i data-lucide="user-plus" style="width: 20px; height: 20px; color: var(--accent-info);"></i>
                                        Add Client
                                    </button>
                                    <button class="btn btn-secondary" style="display: flex; flex-direction: column; gap: 8px; align-items: center; justify-content: center; height: 80px; font-size: 12px; font-weight: 600; text-align: center; border: 1px solid var(--border-color); background: rgba(255,255,255,0.01);" onclick="window.location.hash = '#reports'">
                                        <i data-lucide="line-chart" style="width: 20px; height: 20px; color: var(--accent-warning);"></i>
                                        View Reports
                                    </button>
                                </div>
                            </div>

                            <!-- System Status Info -->
                            <div class="card" style="padding: 20px;">
                                <div style="display: flex; flex-direction: column; gap: 12px; font-size: 12px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                                        <span style="color: var(--text-muted); font-weight: 500;">Operator Profile</span>
                                        <span style="font-weight: 600; color: #fff;">${this.state.currentUser.name}</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                                        <span style="color: var(--text-muted); font-weight: 500;">System Access Role</span>
                                        <span class="badge-pill badge-info" style="font-size: 9px; padding: 2px 8px; font-weight: 700;">
                                            ${this.state.currentUser.role.toUpperCase()}
                                        </span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="color: var(--text-muted); font-weight: 500;">System Status</span>
                                        <span style="display: flex; align-items: center; gap: 4px; color: var(--accent-success); font-weight: 600;">
                                            <span style="width: 6px; height: 6px; background: var(--accent-success); border-radius: 50%; display: inline-block;"></span>
                                            Operational
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- System Audit Logs Card -->
                        <div class="card" style="padding: 24px; margin-top: 24px;">
                            <div class="card-header" style="margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                                <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px;">
                                    <i data-lucide="shield-check" style="color: var(--primary-color); width: 18px; height: 18px;"></i>
                                    Important Business Event Audit Logs
                                </h2>
                                <span style="font-size: 11px; color: var(--text-muted);">Last 20 updates</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 10px; max-height: 250px; overflow-y: auto;">
                                ${(this.state.auditLogs || []).length === 0 ? `
                                    <p style="font-size: 12.5px; color: var(--text-muted); text-align: center; font-style: italic; padding: 24px 12px; background: rgba(255,255,255,0.01); border-radius: var(--border-radius-sm); border: 1px dashed var(--border-color);">No logged events yet.</p>
                                ` : (this.state.auditLogs || []).map(log => {
                                    const logTime = new Date(log.timestamp).toLocaleString();
                                    let actionBadge = 'badge-info';
                                    if (log.action === 'sales_order_confirmed') actionBadge = 'badge-success';
                                    if (log.action === 'invoice_generated') actionBadge = 'badge-primary';
                                    if (log.action === 'payment_recorded') actionBadge = 'badge-warning';
                                    return `
                                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-radius: var(--border-radius-sm); background: rgba(255,255,255,0.01); border: 1px solid var(--border-color); font-size: 12.5px; gap: 16px;">
                                            <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                                                <span class="badge-pill ${actionBadge}" style="font-size: 9px; text-transform: uppercase; font-weight: 700; min-width: 140px; text-align: center; letter-spacing: 0.3px;">
                                                    ${log.action.replace(/_/g, ' ')}
                                                </span>
                                                <span style="color: #fff; font-weight: 500;">${log.details}</span>
                                            </div>
                                            <div style="display: flex; align-items: center; gap: 12px; color: var(--text-muted); font-size: 11px; white-space: nowrap;">
                                                <span>Logged by: <strong>${log.user}</strong></span>
                                                <span>&bull;</span>
                                                <span>${logTime}</span>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                `);
            }
        };

        this.views.inventory = new InventoryView(this);

        this.views.sales = new SalesView(this);
        this.views.purchases = new PurchaseView(this);
        this.views.vendors = new VendorView(this);
        this.views.users = new UsersView(this);
        this.views.reports = new ReportsView(this);
    }

    logEvent(action, details) {
        if (!this.state.auditLogs) {
            this.state.auditLogs = [];
        }
        const newLog = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action,
            details,
            user: this.state.currentUser.name
        };
        this.state.auditLogs.unshift(newLog);
        
        // Limit to latest 20 logs to save localstorage space
        if (this.state.auditLogs.length > 20) {
            this.state.auditLogs = this.state.auditLogs.slice(0, 20);
        }
        this.saveState('auditLogs');
    }

    handleRouting() {
        const hash = window.location.hash || '#dashboard';
        const viewName = hash.substring(1);
        
        // Show/hide users nav link based on admin role
        const usersNavLink = document.getElementById('nav-users');
        if (usersNavLink) {
            if (this.state.currentUser.role === 'admin') {
                usersNavLink.style.display = 'flex';
            } else {
                usersNavLink.style.display = 'none';
            }
        }

        // Clean active classes
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Activate current link
        const activeLink = document.getElementById(`nav-${viewName}`);
        if (activeLink) activeLink.classList.add('active');
        
        // Initialize view
        if (this.views[viewName]) {
            this.currentView = this.views[viewName];
            this.currentView.init();
            lucide.createIcons();
        } else {
            console.error(`View ${viewName} not found. Routing to dashboard.`);
            window.location.hash = '#dashboard';
        }
    }

    render(htmlContent) {
        const container = document.getElementById('main-content');
        if (container) {
            container.innerHTML = htmlContent;
        }
    }

    // --- Theme Toggler ---
    initTheme() {
        const savedTheme = localStorage.getItem('nexus_theme') || 'dark';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        this.state.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('nexus_theme', theme);
        
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            if (theme === 'light') {
                themeIcon.setAttribute('data-lucide', 'moon');
            } else {
                themeIcon.setAttribute('data-lucide', 'sun');
            }
            if (window.lucide) lucide.createIcons();
        }
    }

    // --- Global Helpers & Events ---
    setupGlobalEvents() {
        // Theme toggle button click
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const nextTheme = this.state.currentTheme === 'dark' ? 'light' : 'dark';
                this.setTheme(nextTheme);
                this.showToast(`Switched to ${nextTheme} mode`, 'info');
            });
        }

        // Role select change event
        const roleSelect = document.getElementById('user-role-select');
        if (roleSelect) {
            roleSelect.value = this.state.currentUser.role;
            roleSelect.addEventListener('change', (e) => {
                const newRole = e.target.value;
                this.state.currentUser.role = newRole;
                
                // Dynamically update name and avatar displays for local testing
                const avatarEl = document.querySelector('.user-profile .avatar');
                const nameEl = document.querySelector('.user-profile .user-info h4');
                
                if (newRole === 'staff') {
                    this.state.currentUser.name = 'Sarah Staff';
                    if (avatarEl) avatarEl.textContent = 'SS';
                    if (nameEl) nameEl.textContent = 'Sarah Staff';
                } else if (newRole === 'manager') {
                    this.state.currentUser.name = 'Mike Manager';
                    if (avatarEl) avatarEl.textContent = 'MM';
                    if (nameEl) nameEl.textContent = 'Mike Manager';
                } else {
                    this.state.currentUser.name = 'John Storeowner';
                    if (avatarEl) avatarEl.textContent = 'JS';
                    if (nameEl) nameEl.textContent = 'John Storeowner';
                }
                
                this.saveState('currentUser');
                this.showToast(`Active profile role switched to ${newRole.toUpperCase()}`, 'success');
                
                // Trigger re-render of active view to apply RBAC changes immediately
                this.handleRouting();
            });
        }

        // Global Quick Search Event Listeners
        const globalSearch = document.getElementById('global-search');
        const resultsPopover = document.getElementById('global-search-results');
        
        if (globalSearch && resultsPopover) {
            // Close results on outer document clicks
            document.addEventListener('click', (e) => {
                if (!globalSearch.contains(e.target) && !resultsPopover.contains(e.target)) {
                    resultsPopover.style.display = 'none';
                }
            });

            // Live filter results popup
            globalSearch.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                
                if (!query) {
                    resultsPopover.style.display = 'none';
                    return;
                }

                // Match Customers
                const matchedCustomers = this.state.customers.filter(c => 
                    c.name.toLowerCase().includes(query) || 
                    (c.company && c.company.toLowerCase().includes(query))
                ).slice(0, 3);

                // Match Products
                const matchedProducts = this.state.inventory.filter(item => 
                    item.name.toLowerCase().includes(query) || 
                    item.sku.toLowerCase().includes(query)
                ).slice(0, 3);

                if (matchedCustomers.length === 0 && matchedProducts.length === 0) {
                    resultsPopover.innerHTML = `
                        <div style="padding: 12px; text-align: center; color: var(--text-muted); font-size: 13px;">
                            No matches found for "${e.target.value}"
                        </div>
                    `;
                } else {
                    let html = '';
                    
                    if (matchedCustomers.length > 0) {
                        html += `
                            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px; padding: 4px 8px; border-bottom: 1px solid var(--border-color); margin-bottom: 6px;">
                                Customers
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px;">
                                ${matchedCustomers.map(c => `
                                    <div style="padding: 8px; border-radius: 4px; cursor: pointer; background: rgba(255,255,255,0.01); transition: background 0.15s;" 
                                         onmouseover="this.style.background='rgba(99, 102, 241, 0.1)'" 
                                         onmouseout="this.style.background='rgba(255,255,255,0.01)'"
                                         onclick="window.location.hash = '#customers'; document.getElementById('global-search').value = ''; document.getElementById('global-search-results').style.display='none';">
                                        <div style="font-weight: 600; color: #fff; font-size: 12.5px;">${c.name}</div>
                                        <div style="font-size: 11px; color: var(--text-muted);">${c.company || 'Retail Client'}</div>
                                    </div>
                                `).join('')}
                            </div>
                        `;
                    }

                    if (matchedProducts.length > 0) {
                        html += `
                            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px; padding: 4px 8px; border-bottom: 1px solid var(--border-color); margin-bottom: 6px;">
                                Products Catalog
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 4px;">
                                ${matchedProducts.map(p => `
                                    <div style="padding: 8px; border-radius: 4px; cursor: pointer; background: rgba(255,255,255,0.01); transition: background 0.15s;" 
                                         onmouseover="this.style.background='rgba(99, 102, 241, 0.1)'" 
                                         onmouseout="this.style.background='rgba(255,255,255,0.01)'"
                                         onclick="window.location.hash = '#inventory'; document.getElementById('global-search').value = ''; document.getElementById('global-search-results').style.display='none';">
                                        <div style="font-weight: 600; color: #fff; font-size: 12.5px;">${p.name}</div>
                                        <div style="font-size: 11px; color: var(--text-muted);">${p.sku} &bull; $${p.price.toFixed(2)} &bull; ${p.stock} in stock</div>
                                    </div>
                                `).join('')}
                            </div>
                        `;
                    }

                    resultsPopover.innerHTML = html;
                }

                resultsPopover.style.display = 'flex';
            });
        }
    }

    updateDate() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateElement.textContent = new Date().toLocaleDateString('en-US', options);
        }
    }

    // --- Toast Alert Manager ---
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let iconName = 'info';
        if (type === 'success') iconName = 'check-circle';
        if (type === 'error') iconName = 'alert-octagon';
        if (type === 'warning') iconName = 'alert-triangle';
        
        toast.innerHTML = `
            <i data-lucide="${iconName}" class="toast-icon"></i>
            <div class="toast-message">${message}</div>
            <button class="toast-close"><i data-lucide="x" style="width: 14px; height: 14px;"></i></button>
        `;
        
        container.appendChild(toast);
        if (window.lucide) lucide.createIcons();
        
        // Remove toast on close click
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        });
        
        // Auto remove
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }

    // --- Modal overlay manager ---
    openModal(title, contentHtml, onSave = null, options = {}) {
        const modalContainer = document.getElementById('modal-container');
        if (!modalContainer) return;
        
        const saveButtonLabel = options.saveLabel || 'Save';
        const isDeleteAction = options.isDelete || false;
        const saveBtnClass = isDeleteAction ? 'btn-danger' : 'btn-primary';
        
        modalContainer.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" id="modal-close-btn"><i data-lucide="x"></i></button>
                <div class="modal-title">
                    <h2>${title}</h2>
                    ${options.subtitle ? `<p>${options.subtitle}</p>` : ''}
                </div>
                <div class="modal-body-content">
                    ${contentHtml}
                </div>
                ${onSave ? `
                    <div class="form-actions" style="margin-top: 24px;">
                        <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
                        <button class="btn ${saveBtnClass}" id="modal-save-btn">${saveButtonLabel}</button>
                    </div>
                ` : ''}
            </div>
        `;
        
        modalContainer.classList.add('active');
        if (window.lucide) lucide.createIcons();
        
        // Attach close behaviors
        const closeBtn = document.getElementById('modal-close-btn');
        const cancelBtn = document.getElementById('modal-cancel-btn');
        const saveBtn = document.getElementById('modal-save-btn');
        
        const closeHandler = () => this.closeModal();
        
        closeBtn.addEventListener('click', closeHandler);
        if (cancelBtn) cancelBtn.addEventListener('click', closeHandler);
        
        // Backdrop click close (if not a critical form or unless clicked inside modal-content)
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                closeHandler();
            }
        });
        
        if (saveBtn && onSave) {
            saveBtn.addEventListener('click', () => {
                onSave();
            });
        }
    }

    closeModal() {
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.classList.remove('active');
            setTimeout(() => {
                modalContainer.innerHTML = '';
            }, 300);
        }
    }
}

// Bootstrap the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.nexusApp = new App();
});
