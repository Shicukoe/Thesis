const business = {
  name: "Northstar Supply Co.",
  period: "July 2026",
  user: "Mina Tran",
  role: "Admin",
};

const metrics = [
  { label: "Revenue", value: "$128,400", trend: "+12.8%", tone: "good" },
  { label: "Open Orders", value: "42", trend: "8 due today", tone: "warn" },
  { label: "Inventory Value", value: "$86,920", trend: "1.4x turnover", tone: "neutral" },
  { label: "Cash Balance", value: "$54,230", trend: "+$9,800", tone: "good" },
];

const modules = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "grid",
    title: "Operations Dashboard",
    summary: "Daily control center for sales, stock, purchasing, and cash flow.",
  },
  {
    id: "customers",
    label: "Customers",
    icon: "users",
    title: "Customers",
    summary: "Keep customer profiles, balances, and recent activity organized.",
  },
  {
    id: "vendors",
    label: "Vendors",
    icon: "vendor",
    title: "Vendors",
    summary: "Manage supplier profiles, contacts, payment terms, and status.",
  },
  {
    id: "products",
    label: "Products",
    icon: "tag",
    title: "Products",
    summary: "Manage product catalog records, SKUs, prices, stock quantities, and low-stock thresholds.",
  },
  {
    id: "sales-orders",
    label: "Sales Orders",
    icon: "receipt",
    title: "Sales Orders",
    summary: "Create customer orders with product line items and quantities.",
  },
  {
    id: "invoices",
    label: "Invoices",
    icon: "invoice",
    title: "Invoices",
    summary: "Review invoices generated from confirmed sales orders.",
  },
  {
    id: "purchase-orders",
    label: "Purchase Orders",
    icon: "truck",
    title: "Purchase Orders",
    summary: "Restock inventory by receiving product quantities from suppliers.",
  },
  {
    id: "reports",
    label: "Reports",
    icon: "wallet",
    title: "Reports",
    summary: "Review monthly sales totals and operating performance.",
  },
];

const orders = [
  { id: "SO-1048", customer: "Urban Pantry", status: "Ready to ship", amount: "$8,420", owner: "Lina", due: "Jul 2" },
  { id: "SO-1047", customer: "Metro Cafe Group", status: "Awaiting payment", amount: "$12,100", owner: "Bao", due: "Jul 3" },
  { id: "SO-1046", customer: "River Market", status: "Picking", amount: "$3,860", owner: "An", due: "Jul 3" },
  { id: "SO-1045", customer: "Daily Basket", status: "Invoiced", amount: "$6,740", owner: "Lina", due: "Jul 5" },
];

const inventory = [
  { sku: "PRD-110", item: "Cold Brew Concentrate", stock: 184, reorder: 120, status: "Healthy" },
  { sku: "PRD-224", item: "Compostable Cups 12oz", stock: 52, reorder: 80, status: "Reorder" },
  { sku: "PRD-318", item: "House Espresso Beans", stock: 96, reorder: 90, status: "Watch" },
  { sku: "PRD-402", item: "Vanilla Syrup", stock: 34, reorder: 40, status: "Reorder" },
];

const products = [
  { id: "PRD-110", name: "Cold Brew Concentrate", sku: "PRD-110", price: 24.5, stock: 184, lowStockThreshold: 60 },
  { id: "PRD-224", name: "Compostable Cups 12oz", sku: "PRD-224", price: 8.75, stock: 52, lowStockThreshold: 80 },
  { id: "PRD-318", name: "House Espresso Beans", sku: "PRD-318", price: 18.25, stock: 102, lowStockThreshold: 90 },
  { id: "PRD-402", name: "Vanilla Syrup", sku: "PRD-402", price: 11.4, stock: 34, lowStockThreshold: 40 },
];

const activities = [
  "Invoice INV-2031 was paid by Urban Pantry.",
  "Purchase order PO-778 was sent to GreenPack.",
  "Stock adjustment posted for House Espresso Beans.",
  "Metro Cafe Group approved quote QT-1512.",
];

const customers = [
  {
    id: "CUS-1001",
    name: "Urban Pantry",
    contact: "Mai Le",
    email: "mai@urbanpantry.example",
    phone: "+84 90 118 4200",
    address: "18 Pasteur Street, District 1, Ho Chi Minh City",
    balance: 0,
    status: "Current",
    lastOrder: "Jul 2",
    notes: "Prefers consolidated weekly deliveries.",
  },
  {
    id: "CUS-1002",
    name: "Metro Cafe Group",
    contact: "Dat Nguyen",
    email: "dat@metrocafe.example",
    phone: "+84 91 212 6100",
    address: "42 Nguyen Hue Boulevard, District 1, Ho Chi Minh City",
    balance: 12100,
    status: "Payment due",
    lastOrder: "Jul 1",
    notes: "Requires purchase order number on each invoice.",
  },
  {
    id: "CUS-1003",
    name: "River Market",
    contact: "Hoa Pham",
    email: "hoa@rivermarket.example",
    phone: "+84 93 344 7800",
    address: "5 Tran Nao Street, Thu Duc City",
    balance: 3860,
    status: "Current",
    lastOrder: "Jun 30",
    notes: "Morning delivery window.",
  },
  {
    id: "CUS-1004",
    name: "Daily Basket",
    contact: "Quyen Ho",
    email: "quyen@dailybasket.example",
    phone: "+84 98 455 0120",
    address: "77 Cach Mang Thang Tam, District 3, Ho Chi Minh City",
    balance: 6740,
    status: "Current",
    lastOrder: "Jun 28",
    notes: "Seasonal volume increases before holidays.",
  },
];

const vendors = [
  {
    id: "VEN-1001",
    name: "GreenPack",
    contact: "Thao Bui",
    email: "thao@greenpack.example",
    phone: "+84 90 600 7780",
    address: "12 Tan Thuan Road, District 7, Ho Chi Minh City",
    terms: "Net 15",
    status: "Active",
    notes: "Primary packaging supplier.",
  },
  {
    id: "VEN-1002",
    name: "Saigon Roasters",
    contact: "Minh Dang",
    email: "minh@saigonroasters.example",
    phone: "+84 91 700 4420",
    address: "22 Phan Van Tri, Binh Thanh District, Ho Chi Minh City",
    terms: "Net 30",
    status: "Active",
    notes: "Coffee and beverage ingredient supplier.",
  },
  {
    id: "VEN-1003",
    name: "Fresh Logistics",
    contact: "Lan Truong",
    email: "lan@freshlogistics.example",
    phone: "+84 93 210 5600",
    address: "8 Song Hanh, Thu Duc City",
    terms: "Due on receipt",
    status: "Active",
    notes: "Handles chilled deliveries.",
  },
];

const salesOrders = [
  {
    id: "SO-1001",
    customerId: "CUS-1001",
    status: "Draft",
    inventoryApplied: false,
    createdBy: "Mina Tran",
    lines: [
      { productId: "PRD-110", quantity: 12 },
      { productId: "PRD-224", quantity: 20 },
    ],
  },
  {
    id: "SO-1002",
    customerId: "CUS-1002",
    status: "Confirmed",
    inventoryApplied: true,
    createdBy: "Mina Tran",
    lines: [
      { productId: "PRD-318", quantity: 18 },
    ],
  },
];

const invoices = [
  {
    id: "INV-1001",
    salesOrderId: "SO-1002",
    customerId: "CUS-1002",
    issueDate: "2026-07-02",
    dueDate: "2026-07-17",
    paymentStatus: "Unpaid",
    payments: [],
    amount: 328.5,
  },
];

const purchaseOrders = [
  {
    id: "PO-1001",
    vendorId: "VEN-1001",
    supplier: "GreenPack",
    status: "Draft",
    inventoryApplied: false,
    lines: [
      { productId: "PRD-224", quantity: 50 },
    ],
  },
  {
    id: "PO-1002",
    vendorId: "VEN-1002",
    supplier: "Saigon Roasters",
    status: "Received",
    inventoryApplied: true,
    lines: [
      { productId: "PRD-318", quantity: 24 },
    ],
  },
];

const moduleData = {
  sales: {
    columns: ["Order", "Customer", "Status", "Amount", "Owner", "Due"],
    rows: orders.map((order) => [order.id, order.customer, order.status, order.amount, order.owner, order.due]),
  },
  inventory: {
    columns: ["SKU", "Item", "Stock", "Reorder Point", "Status"],
    rows: inventory.map((item) => [item.sku, item.item, item.stock, item.reorder, item.status]),
  },
  products: {
    columns: ["SKU", "Product", "Price", "Current Stock", "Low-Stock Threshold"],
    rows: products.map((product) => [product.sku, product.name, `$${product.price.toFixed(2)}`, product.stock, product.lowStockThreshold]),
  },
  purchasing: {
    columns: ["PO", "Vendor", "Status", "Expected", "Total"],
    rows: [
      ["PO-778", "GreenPack", "Sent", "Jul 6", "$4,820"],
      ["PO-777", "Saigon Roasters", "Confirmed", "Jul 8", "$9,600"],
      ["PO-776", "Fresh Logistics", "Draft", "Jul 10", "$2,150"],
    ],
  },
  finance: {
    columns: ["Document", "Account", "Status", "Due", "Amount"],
    rows: [
      ["INV-2032", "Metro Cafe Group", "Unpaid", "Jul 5", "$12,100"],
      ["BILL-441", "Saigon Roasters", "Scheduled", "Jul 9", "$9,600"],
      ["EXP-088", "Facility Utilities", "Approved", "Jul 12", "$1,180"],
    ],
  },
  customers: {
    columns: ["Customer", "Contact", "Balance", "Last Order", "Status"],
    rows: customers.map((customer) => [customer.name, customer.contact, `$${customer.balance.toLocaleString()}`, customer.lastOrder, customer.status]),
  },
  vendors: {
    columns: ["Vendor", "Contact", "Terms", "Status"],
    rows: vendors.map((vendor) => [vendor.name, vendor.contact, vendor.terms, vendor.status]),
  },
  team: {
    columns: ["Name", "Role", "Focus", "Open Tasks", "Status"],
    rows: [
      ["Mina Tran", "Operations Lead", "Daily close", 6, "Online"],
      ["Lina Vo", "Sales Coordinator", "Shipments", 9, "Online"],
      ["Bao Lam", "Finance", "Receivables", 4, "In meeting"],
    ],
  },
};

window.ERP_DATA = {
  activities,
  business,
  customers,
  inventory,
  invoices,
  metrics,
  moduleData,
  modules,
  orders,
  products,
  purchaseOrders,
  salesOrders,
  vendors,
};
