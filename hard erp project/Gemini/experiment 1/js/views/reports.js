/* ==========================================================================
   Nexus ERP - Reports Management View (ES Module)
   ========================================================================== */

export class ReportsView {
    constructor(app) {
        this.app = app;
        this.startDate = '';
        this.endDate = '';
    }

    init() {
        this.renderLayout();
        this.renderReportData();
        this.setupEventListeners();
    }

    renderLayout() {
        const html = `
            <div class="view-header" style="margin-bottom: 20px;">
                <div>
                    <h1>Monthly Sales Analytics</h1>
                    <p class="subtitle">Performance reporting, revenue trends, and key order metrics</p>
                </div>
                <div>
                    <button class="btn btn-secondary" id="export-excel-btn">
                        <i data-lucide="file-spreadsheet"></i>
                        Export Excel
                    </button>
                </div>
            </div>

            <!-- Date Range Filter Card -->
            <div class="card" style="padding: 16px; margin-bottom: 24px;">
                <div style="display: flex; gap: 16px; align-items: flex-end; flex-wrap: wrap;">
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <label for="report-start-date" style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Start Date</label>
                        <input type="date" id="report-start-date" value="${this.startDate}" class="select-custom" style="padding: 6px 12px; height: 38px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md); background: rgba(0,0,0,0.2); color: #fff;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <label for="report-end-date" style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">End Date</label>
                        <input type="date" id="report-end-date" value="${this.endDate}" class="select-custom" style="padding: 6px 12px; height: 38px; border: 1px solid var(--border-color); border-radius: var(--border-radius-md); background: rgba(0,0,0,0.2); color: #fff;">
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-primary" id="apply-date-filter-btn" style="height: 38px; font-size: 12px; padding: 0 16px;">
                            Apply Filter
                        </button>
                        <button class="btn btn-secondary" id="reset-date-filter-btn" style="height: 38px; font-size: 12px; padding: 0 16px;">
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            <!-- Key Reporting Metrics Cards -->
            <div class="stats-grid" id="reports-metrics-grid">
                <!-- Metrics cards populated dynamically -->
            </div>

            <!-- Sales Detailed Breakdown Table -->
            <div class="card" style="padding: 0; overflow: hidden; margin-top: 24px;">
                <div class="card-header" style="padding: 20px 24px; border-bottom: 1px solid var(--border-color);">
                    <h2 style="font-size: 15px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px;">
                        <i data-lucide="table" style="color: var(--primary-color); width: 18px; height: 18px;"></i>
                        Monthly Sales Breakdown Ledger
                    </h2>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Reporting Month</th>
                                <th class="text-right">Orders Volume</th>
                                <th class="text-right">Net Subtotal</th>
                                <th class="text-right">Sales Tax Collected</th>
                                <th class="text-right" style="padding-right: 24px;">Total Gross Revenue</th>
                            </tr>
                        </thead>
                        <tbody id="monthly-ledger-tbody">
                            <!-- Data rows populated dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        this.app.render(html);
    }

    renderReportData() {
        const sales = this.app.state.sales || [];
        
        // RBAC Access Control: Staff members can only view report metrics for sales they registered themselves
        let userSales = sales;
        const currentUser = this.app.state.currentUser;
        if (currentUser.role === 'staff') {
            userSales = sales.filter(s => s.createdBy === currentUser.name);
        }

        let activeSales = userSales.filter(s => s.status !== 'cancelled');

        // Apply Custom Date Range Filter
        if (this.startDate) {
            const start = new Date(this.startDate);
            start.setHours(0, 0, 0, 0);
            activeSales = activeSales.filter(s => new Date(s.date) >= start);
        }
        if (this.endDate) {
            const end = new Date(this.endDate);
            end.setHours(23, 59, 59, 999);
            activeSales = activeSales.filter(s => new Date(s.date) <= end);
        }

        // Group sales by Month (YYYY-MM)
        const groups = {};
        activeSales.forEach(s => {
            const dateObj = new Date(s.date);
            const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
            if (!groups[key]) {
                groups[key] = {
                    key,
                    monthLabel: dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                    ordersCount: 0,
                    subtotal: 0,
                    tax: 0,
                    total: 0
                };
            }
            groups[key].ordersCount += 1;
            groups[key].subtotal += s.subtotal || 0;
            groups[key].tax += s.tax || 0;
            groups[key].total += s.total || 0;
        });

        // Convert to sorted array (reverse chronological)
        const monthlyReport = Object.values(groups).sort((a, b) => b.key.localeCompare(a.key));
        this.monthlyReport = monthlyReport; // Store to let CSV download access data

        // Aggregate key global metrics
        const totalGrossRevenue = activeSales.reduce((sum, s) => sum + s.total, 0);
        const averageOrderValue = activeSales.length > 0 ? (totalGrossRevenue / activeSales.length) : 0;
        
        let peakMonthLabel = 'N/A';
        let peakMonthTotal = 0;
        monthlyReport.forEach(g => {
            if (g.total > peakMonthTotal) {
                peakMonthTotal = g.total;
                peakMonthLabel = g.monthLabel;
            }
        });

        // Render Metrics Grid Cards
        const gridContainer = document.getElementById('reports-metrics-grid');
        if (gridContainer) {
            gridContainer.innerHTML = `
                <div class="stat-card">
                    <div class="stat-info">
                        <span>Cumulative Gross Sales</span>
                        <h3>$${totalGrossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                        <div class="stat-trend up">
                            <i data-lucide="trending-up" style="width: 10px; height: 10px;"></i>
                            <span>All-time settled volume</span>
                        </div>
                    </div>
                    <div class="stat-icon success">
                        <i data-lucide="coins"></i>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-info">
                        <span>Average Order Value (AOV)</span>
                        <h3>$${averageOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                        <div class="stat-trend up">
                            <i data-lucide="shopping-cart" style="width: 10px; height: 10px;"></i>
                            <span>Per transaction average</span>
                        </div>
                    </div>
                    <div class="stat-icon info">
                        <i data-lucide="shopping-bag"></i>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-info">
                        <span>Peak Billing Month</span>
                        <h3>${peakMonthLabel}</h3>
                        <div class="stat-trend up" style="color: var(--accent-warning); background: var(--accent-warning-bg);">
                            <i data-lucide="award" style="width: 10px; height: 10px;"></i>
                            <span>Max: $${peakMonthTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                    <div class="stat-icon warning">
                        <i data-lucide="star"></i>
                    </div>
                </div>
            `;
        }

        const ledgerTbody = document.getElementById('monthly-ledger-tbody');

        if (monthlyReport.length === 0) {
            if (ledgerTbody) {
                ledgerTbody.innerHTML = `
                    <tr>
                        <td colspan="5">
                            <div class="empty-state" style="padding: 24px 0;">
                                <i data-lucide="table" style="width: 32px; height: 32px; color: var(--text-muted); opacity: 0.5;"></i>
                                <h3>No report records found</h3>
                                <p>Generate sales invoices to begin building monthly ledger tables.</p>
                            </div>
                        </td>
                    </tr>
                `;
            }
            if (window.lucide) lucide.createIcons();
            return;
        }

        // Generate detailed ledger rows
        if (ledgerTbody) {
            ledgerTbody.innerHTML = monthlyReport.map(g => {
                return `
                    <tr>
                        <td style="font-weight: 600; color: #fff;">${g.monthLabel}</td>
                        <td class="text-right" style="font-weight: 500; color: var(--text-secondary);">${g.ordersCount} orders</td>
                        <td class="text-right">$${g.subtotal.toFixed(2)}</td>
                        <td class="text-right" style="color: var(--text-secondary);">$${g.tax.toFixed(2)}</td>
                        <td class="text-right" style="font-weight: 700; color: var(--primary-color); padding-right: 24px;">$${g.total.toFixed(2)}</td>
                    </tr>
                `;
            }).join('');
        }

        if (window.lucide) lucide.createIcons();
    }

    setupEventListeners() {
        const excelBtn = document.getElementById('export-excel-btn');
        if (excelBtn) {
            excelBtn.addEventListener('click', () => this.exportToExcel());
        }

        const applyBtn = document.getElementById('apply-date-filter-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                const startVal = document.getElementById('report-start-date').value;
                const endVal = document.getElementById('report-end-date').value;

                if (startVal && endVal && new Date(startVal) > new Date(endVal)) {
                    this.app.showToast('Validation Error: Start Date must be prior or equal to End Date.', 'error');
                    return;
                }

                this.startDate = startVal;
                this.endDate = endVal;
                this.renderReportData();
                this.app.showToast('Custom date filter applied to sales report.', 'success');
            });
        }

        const resetBtn = document.getElementById('reset-date-filter-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.startDate = '';
                this.endDate = '';
                
                const startEl = document.getElementById('report-start-date');
                const endEl = document.getElementById('report-end-date');
                if (startEl) startEl.value = '';
                if (endEl) endEl.value = '';

                this.renderReportData();
                this.app.showToast('Date filters reset.', 'info');
            });
        }
    }

    exportToExcel() {
        const report = this.monthlyReport || [];
        if (report.length === 0) {
            this.app.showToast('No reporting ledger entries found to export.', 'warning');
            return;
        }

        if (!window.XLSX) {
            this.app.showToast('Excel exporter library not loaded.', 'error');
            return;
        }

        // Format data for Excel columns
        const excelData = report.map(g => ({
            "Reporting Month": g.monthLabel,
            "Orders Volume": g.ordersCount,
            "Net Subtotal ($)": g.subtotal,
            "Sales Tax ($)": g.tax,
            "Gross Revenue ($)": g.total
        }));

        try {
            const worksheet = XLSX.utils.json_to_sheet(excelData);
            
            // Adjust column widths automatically
            const maxLen = excelData.reduce((acc, row) => {
                Object.keys(row).forEach((key, i) => {
                    const valLen = String(row[key] || '').length;
                    acc[i] = Math.max(acc[i] || 0, valLen, key.length);
                });
                return acc;
            }, []);
            worksheet['!cols'] = maxLen.map(len => ({ wch: len + 3 }));

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Analytics");
            
            XLSX.writeFile(workbook, `monthly_sales_report_${new Date().getFullYear()}.xlsx`);
            this.app.showToast('Monthly sales ledger exported as Excel workbook.', 'success');
        } catch (e) {
            console.error('Excel Export Error:', e);
            this.app.showToast('Failed to export Excel file.', 'error');
        }
    }
}
