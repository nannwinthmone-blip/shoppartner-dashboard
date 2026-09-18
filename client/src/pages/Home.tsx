import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  CreditCard,
  Download,
  Edit3,
  Eye,
  FileText,
  Filter,
  HelpCircle,
  Inbox,
  Menu,
  MoreHorizontal,
  PackageCheck,
  Plus,
  Search,
  Settings2,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  TrendingUp,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";

type SectionId =
  | "dashboard"
  | "products"
  | "orders"
  | "customers"
  | "sales"
  | "payouts"
  | "promotions"
  | "analytics"
  | "settings";

type ToastMessage = { title: string; detail?: string } | null;

type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Low stock" | "Draft";
  emoji: string;
};

type Order = {
  id: string;
  customer: string;
  initials: string;
  product: string;
  date: string;
  amount: number;
  status: "Completed" | "Pending" | "Refunded";
};

const navItems: { id: SectionId; label: string; emoji: string; helper: string }[] = [
  { id: "dashboard", label: "Dashboard", emoji: "🏠", helper: "Overview" },
  { id: "products", label: "Products", emoji: "🛍️", helper: "Catalog" },
  { id: "orders", label: "Orders", emoji: "🧾", helper: "Fulfillment" },
  { id: "customers", label: "Customers", emoji: "👥", helper: "Relationships" },
  { id: "sales", label: "Sales & Commissions", emoji: "💰", helper: "Performance" },
  { id: "payouts", label: "Payments / Payouts", emoji: "💳", helper: "Money movement" },
  { id: "promotions", label: "Promotions", emoji: "📣", helper: "Campaigns" },
  { id: "analytics", label: "Analytics", emoji: "📊", helper: "Insights" },
  { id: "settings", label: "Settings", emoji: "⚙️", helper: "Workspace" },
];

const metricCards = [
  { label: "Total Sales", value: "$1,240.00", trend: "+12.4%", tone: "blue", icon: "↗", note: "vs. last month" },
  { label: "Completed Orders", value: "38", trend: "+8.1%", tone: "mint", icon: "✓", note: "this month" },
  { label: "Pending Orders", value: "7", trend: "2 urgent", tone: "peach", icon: "◷", note: "need attention" },
  { label: "Refunds", value: "$85.00", trend: "−3.2%", tone: "lilac", icon: "↙", note: "this month" },
  { label: "Agent Commissions", value: "$124.00", trend: "+9.6%", tone: "sun", icon: "%", note: "earned on sales" },
  { label: "Merchant Revenue", value: "$1,116.00", trend: "+11.7%", tone: "sky", icon: "✦", note: "after commissions" },
  { label: "Available Payout", value: "$1,050.00", trend: "Ready", tone: "navy", icon: "→", note: "eligible balance" },
];

const initialProducts: Product[] = [
  { id: 1, name: "Cloud knit cardigan", sku: "KN-2048", category: "Apparel", price: 84, stock: 24, status: "Active", emoji: "🧶" },
  { id: 2, name: "Lemon drop candle", sku: "HM-3920", category: "Home", price: 32, stock: 8, status: "Low stock", emoji: "🕯️" },
  { id: 3, name: "Citrus studio mug", sku: "HM-1884", category: "Home", price: 28, stock: 56, status: "Active", emoji: "☕" },
  { id: 4, name: "Sunday market tote", sku: "AC-4112", category: "Accessories", price: 42, stock: 0, status: "Draft", emoji: "👜" },
  { id: 5, name: "Soft launch journal", sku: "ST-1207", category: "Stationery", price: 18, stock: 42, status: "Active", emoji: "📓" },
];

const initialOrders: Order[] = [
  { id: "SP-1048", customer: "Maya Chen", initials: "MC", product: "Cloud knit cardigan", date: "Sep 18, 2026", amount: 84, status: "Completed" },
  { id: "SP-1047", customer: "Noah Williams", initials: "NW", product: "Citrus studio mug × 2", date: "Sep 18, 2026", amount: 56, status: "Pending" },
  { id: "SP-1046", customer: "Ava Patel", initials: "AP", product: "Lemon drop candle", date: "Sep 17, 2026", amount: 32, status: "Completed" },
  { id: "SP-1045", customer: "Leo Martin", initials: "LM", product: "Sunday market tote", date: "Sep 17, 2026", amount: 42, status: "Refunded" },
  { id: "SP-1044", customer: "Olivia Smith", initials: "OS", product: "Soft launch journal × 3", date: "Sep 16, 2026", amount: 54, status: "Completed" },
];

const money = (value: number) => `$${value.toFixed(2)}`;

function TinyBarChart() {
  const bars = [39, 56, 46, 70, 62, 84, 74, 95, 78, 88, 68, 99];
  return (
    <div className="chart-wrap" aria-label="Sales overview bar chart showing growth from April through September">
      <div className="chart-grid-lines" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="bar-row">
        {bars.map((height, index) => (
          <div className="bar-column" key={index}>
            <span className={`bar-value ${index === 11 ? "current" : ""}`} style={{ height: `${height}%` }} />
            {index % 2 === 0 && <small>{["Apr 01", "Apr 15", "May 01", "May 15", "Jun 01", "Jun 15"][index / 2]}</small>}
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutChart() {
  return (
    <div className="donut-layout">
      <div className="donut" role="img" aria-label="Sales breakdown: direct 54 percent, affiliate 31 percent, social 15 percent">
        <div className="donut-center"><strong>100%</strong><span>Sales mix</span></div>
      </div>
      <div className="legend-list">
        <div><span className="legend-dot dot-blue" />Direct sales <strong>54%</strong></div>
        <div><span className="legend-dot dot-purple" />Affiliate partner <strong>31%</strong></div>
        <div><span className="legend-dot dot-yellow" />Social commerce <strong>15%</strong></div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const kind = status.toLowerCase().replace(" ", "-");
  return <span className={`status-pill status-${kind}`}><span />{status}</span>;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionId>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [query, setQuery] = useState("");
  const [orderFilter, setOrderFilter] = useState("All orders");
  const [products, setProducts] = useState(initialProducts);
  const [orders] = useState(initialOrders);
  const [modal, setModal] = useState<"product" | "order" | "payout" | "promotion" | "support" | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<ToastMessage>(null);

  const showToast = (title: string, detail?: string) => {
    setToast({ title, detail });
    window.setTimeout(() => setToast(null), 3200);
  };

  const currentNav = navItems.find((item) => item.id === activeSection) ?? navItems[0];
  const filteredProducts = useMemo(() => products.filter((product) => `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(query.toLowerCase())), [products, query]);
  const filteredOrders = useMemo(() => orders.filter((order) => {
    const matchesQuery = `${order.id} ${order.customer} ${order.product}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = orderFilter === "All orders" || order.status === orderFilter;
    return matchesQuery && matchesFilter;
  }), [orders, query, orderFilter]);

  const selectSection = (section: SectionId) => {
    setActiveSection(section);
    setMobileOpen(false);
    setQuery("");
  };

  const handleDeleteProduct = (id: number) => {
    setProducts((current) => current.filter((product) => product.id !== id));
    showToast("Product removed", "The demo catalog was updated locally.");
  };

  const handleSaveProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const product = {
      id: editingProduct?.id ?? Date.now(),
      name: String(form.get("name") || "Untitled product"),
      sku: String(form.get("sku") || "NEW-0000"),
      category: String(form.get("category") || "General"),
      price: Number(form.get("price") || 0),
      stock: Number(form.get("stock") || 0),
      status: Number(form.get("stock") || 0) < 10 ? "Low stock" as const : "Active" as const,
      emoji: editingProduct?.emoji ?? "✨",
    };
    setProducts((current) => editingProduct ? current.map((item) => item.id === editingProduct.id ? product : item) : [product, ...current]);
    setModal(null);
    setEditingProduct(null);
    showToast(editingProduct ? "Product updated" : "Product added", "Changes are saved in this demo session.");
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><span>✦</span></div>
          <div><strong>ShopPartner</strong><small>Merchant workspace</small></div>
          <button className="icon-button sidebar-close" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={17} /></button>
        </div>
        <div className="workspace-select"><div className="workspace-avatar">SF</div><div><small>Workspace</small><strong>Sunny &amp; Found</strong></div><ChevronDown size={15} /></div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          {navItems.slice(0, 4).map((item) => <button key={item.id} className={`nav-item ${activeSection === item.id ? "active" : ""}`} onClick={() => selectSection(item.id)}><span className="nav-emoji">{item.emoji}</span><span>{item.label}</span>{item.id === "orders" && <b>7</b>}</button>)}
          <p className="nav-label nav-label-spaced">Manage</p>
          {navItems.slice(4).map((item) => <button key={item.id} className={`nav-item ${activeSection === item.id ? "active" : ""}`} onClick={() => selectSection(item.id)}><span className="nav-emoji">{item.emoji}</span><span>{item.label}</span></button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help"><div className="help-orb">?</div><div><strong>Need a hand?</strong><span>Visit the help center</span></div><ChevronRight size={16} /></div>
          <div className="sidebar-user"><div className="avatar avatar-coral">JM</div><div><strong>Jordan Miller</strong><span>Owner account</span></div><MoreHorizontal size={17} /></div>
        </div>
      </aside>

      {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumb"><span>{currentNav.helper}</span><ChevronRight size={14} /><strong>{currentNav.label}</strong></div>
          <div className="topbar-actions">
            <div className="search-box"><Search size={17} /><input aria-label="Search dashboard" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search anything" /><kbd>⌘ K</kbd></div>
            <div className="notification-wrap"><button className="notification-button" aria-label="View notifications" onClick={() => setNotificationsOpen((open) => !open)}><Bell size={19} />{!notificationsRead && <span className="notification-dot" />}</button>{notificationsOpen && <div className="notification-popover"><div className="popover-header"><div><strong>Notifications</strong><span>3 updates for you</span></div><button onClick={() => { setNotificationsRead(true); showToast("All caught up", "Notifications marked as read."); }}>Mark read</button></div><div className="popover-notification"><span className="notification-icon blue">💰</span><div><strong>Commission posted</strong><span>$12.40 from order SP-1048</span><small>12 min ago</small></div></div><div className="popover-notification"><span className="notification-icon peach">📦</span><div><strong>Low stock alert</strong><span>Lemon drop candle has 8 left</span><small>1 hr ago</small></div></div><div className="popover-notification"><span className="notification-icon mint">✨</span><div><strong>Promotion is live</strong><span>Fall Finds is reaching shoppers</span><small>Yesterday</small></div></div></div>}</div>
            <div className="topbar-avatar avatar avatar-coral">JM</div>
          </div>
        </header>

        <div className="page-content">
          {activeSection === "dashboard" && <Dashboard onAction={(action) => setModal(action)} selectSection={selectSection} />}
          {activeSection === "products" && <ProductsPage products={filteredProducts} query={query} onAdd={() => { setEditingProduct(null); setModal("product"); }} onEdit={(product) => { setEditingProduct(product); setModal("product"); }} onDelete={handleDeleteProduct} showToast={showToast} />}
          {activeSection === "orders" && <OrdersPage orders={filteredOrders} filter={orderFilter} setFilter={setOrderFilter} onCreate={() => setModal("order")} onView={(order) => showToast(`Opening ${order.id}`, "Order detail is available in this demo workspace.")} />}
          {activeSection === "customers" && <CustomersPage showToast={showToast} />}
          {activeSection === "sales" && <SalesPage onExport={() => showToast("Export ready", "Your commission report is prepared as a demo download.")} />}
          {activeSection === "payouts" && <PayoutsPage onWithdraw={() => setModal("payout")} showToast={showToast} />}
          {activeSection === "promotions" && <PromotionsPage onCreate={() => setModal("promotion")} showToast={showToast} />}
          {activeSection === "analytics" && <AnalyticsPage />}
          {activeSection === "settings" && <SettingsPage showToast={showToast} />}
        </div>
      </main>

      {modal && <Modal type={modal} editingProduct={editingProduct} onClose={() => { setModal(null); setEditingProduct(null); }} onSaveProduct={handleSaveProduct} showToast={showToast} />}
      {toast && <div className="toast"><div className="toast-check"><Check size={16} /></div><div><strong>{toast.title}</strong>{toast.detail && <span>{toast.detail}</span>}</div><button onClick={() => setToast(null)} aria-label="Dismiss message"><X size={16} /></button></div>}
    </div>
  );
}

function Dashboard({ onAction, selectSection }: { onAction: (action: "product" | "order" | "payout" | "promotion" | "support") => void; selectSection: (section: SectionId) => void }) {
  return <>
    <section className="page-heading reveal"><div><div className="eyebrow"><span className="eyebrow-spark">✦</span> Tuesday, September 18, 2026</div><h1>Good morning, Jordan <span>👋</span></h1><p>Here’s the pulse of your store and partner network.</p></div><div className="heading-actions"><button className="secondary-button"><CalendarDays size={16} /> Sep 01 — Sep 18 <ChevronDown size={14} /></button><button className="primary-button" onClick={() => onAction("product")}><Plus size={17} /> Add product</button></div></section>
    <section className="metric-grid reveal delay-1">{metricCards.map((card) => <div className={`metric-card tone-${card.tone}`} key={card.label}><div className="metric-top"><span>{card.label}</span><span className="metric-icon">{card.icon}</span></div><strong>{card.value}</strong><div className="metric-bottom"><span className="metric-trend">{card.trend}</span><span>{card.note}</span></div></div>)}</section>
    <section className="dashboard-grid reveal delay-2"><div className="panel chart-panel"><div className="panel-heading"><div><span className="section-kicker">PERFORMANCE</span><h2>Sales overview</h2></div><div className="panel-heading-actions"><button className="chart-select">Last 6 months <ChevronDown size={13} /></button><button className="icon-button subtle"><MoreHorizontal size={18} /></button></div></div><div className="chart-summary"><strong>$1,240.00</strong><span className="green-text">↗ 12.4%</span><small>vs. $1,102.00 last period</small></div><TinyBarChart /></div><div className="panel breakdown-panel"><div className="panel-heading"><div><span className="section-kicker">CHANNEL MIX</span><h2>Sales breakdown</h2></div><button className="icon-button subtle"><MoreHorizontal size={18} /></button></div><DonutChart /><div className="breakdown-foot"><span><TrendingUp size={15} /> Best channel</span><strong>Direct sales</strong></div></div></section>
    <section className="quick-actions-row reveal delay-3"><div><span className="section-kicker">SHORTCUTS</span><h2>Quick actions</h2></div><div className="quick-actions"><button onClick={() => onAction("product")}><span className="action-icon action-blue">🛍️</span><span><strong>Add product</strong><small>Build your catalog</small></span><ChevronRight size={16} /></button><button onClick={() => onAction("order")}><span className="action-icon action-mint">🧾</span><span><strong>Create order</strong><small>Log an offline sale</small></span><ChevronRight size={16} /></button><button onClick={() => onAction("payout")}><span className="action-icon action-purple">💳</span><span><strong>Withdraw funds</strong><small>Move your balance</small></span><ChevronRight size={16} /></button><button onClick={() => onAction("promotion")}><span className="action-icon action-peach">📣</span><span><strong>Create promotion</strong><small>Reach more shoppers</small></span><ChevronRight size={16} /></button></div></section>
    <section className="lower-grid reveal delay-3"><div className="panel table-panel"><div className="panel-heading"><div><span className="section-kicker">LIVE ACTIVITY</span><h2>Recent orders</h2></div><button className="text-button" onClick={() => selectSection("orders")}>View all <ArrowUpRight size={15} /></button></div><div className="table-scroll"><table><thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead><tbody>{initialOrders.slice(0, 4).map((order) => <tr key={order.id}><td><strong className="order-id">{order.id}</strong></td><td><span className="customer-cell"><span className="avatar avatar-small avatar-sky">{order.initials}</span>{order.customer}</span></td><td>{order.product}</td><td className="muted-cell">{order.date}</td><td><strong>{money(order.amount)}</strong></td><td><StatusPill status={order.status} /></td></tr>)}</tbody></table></div></div><div className="panel top-products-panel"><div className="panel-heading"><div><span className="section-kicker">CATALOG WINS</span><h2>Top products</h2></div><button className="icon-button subtle"><MoreHorizontal size={18} /></button></div><div className="product-rank-list"><div className="rank-item"><span className="rank-number">01</span><span className="rank-emoji blue-surface">🧶</span><div><strong>Cloud knit cardigan</strong><span>18 sold this month</span></div><b>$1,512</b></div><div className="rank-item"><span className="rank-number">02</span><span className="rank-emoji peach-surface">🕯️</span><div><strong>Lemon drop candle</strong><span>14 sold this month</span></div><b>$448</b></div><div className="rank-item"><span className="rank-number">03</span><span className="rank-emoji mint-surface">☕</span><div><strong>Citrus studio mug</strong><span>11 sold this month</span></div><b>$308</b></div></div><button className="list-footer" onClick={() => selectSection("products")}>Manage catalog <ArrowUpRight size={15} /></button></div></section>
    <section className="utility-grid"><div className="panel commission-panel"><div className="panel-heading"><div><span className="section-kicker">PARTNER ECONOMICS</span><h2>Commission settings</h2></div><button className="icon-button subtle"><Settings2 size={17} /></button></div><div className="commission-table"><div><span>Direct sale</span><strong>10%</strong></div><div><span>Affiliate partner</span><strong>15%</strong></div><div><span>New customer bonus</span><strong>+2%</strong></div></div><p className="panel-note"><span className="note-dot" />Commissions are paid only on completed customer sales.</p></div><div className="panel notifications-panel"><div className="panel-heading"><div><span className="section-kicker">STAY IN THE LOOP</span><h2>Recent notifications</h2></div><button className="text-button">See all <ArrowUpRight size={15} /></button></div><div className="mini-notification-list"><div><span className="notification-icon blue">💰</span><p><strong>Commission posted</strong><span>+$12.40 from SP-1048</span></p><small>12m</small></div><div><span className="notification-icon peach">📦</span><p><strong>Inventory is getting low</strong><span>Lemon drop candle · 8 left</span></p><small>1h</small></div><div><span className="notification-icon mint">✨</span><p><strong>Promotion is live</strong><span>Fall Finds is reaching shoppers</span></p><small>1d</small></div></div></div></section>
    <section className="bottom-banner-grid"><div className="help-banner"><div className="help-banner-art">✦</div><div><span className="section-kicker">SHOPPARTNER SUPPORT</span><h2>Make your next sale your best one.</h2><p>Get practical playbooks for product pages, partner commissions, and repeat customers.</p><button className="light-button" onClick={() => onAction("support")}>Open help center <ArrowUpRight size={15} /></button></div><div className="banner-doodle">↗</div></div><div className="promotion-banner"><div><span className="banner-tag">SEASONAL SPOTLIGHT</span><h2>Fall Finds</h2><p>Curate warm, giftable products for the season.</p><button className="dark-button" onClick={() => onAction("promotion")}>View promotion <ArrowUpRight size={15} /></button></div><div className="promotion-orbit"><span>🍂</span><span>🕯️</span><span>🧶</span></div></div></section>
    <p className="demo-disclaimer">Demo workspace · All figures and activity shown are illustrative sample data. No real payment processing or financial claims.</p>
  </>;
}

function ProductsPage({ products, query, onAdd, onEdit, onDelete, showToast }: { products: Product[]; query: string; onAdd: () => void; onEdit: (product: Product) => void; onDelete: (id: number) => void; showToast: (title: string, detail?: string) => void }) {
  return <section className="section-page"><section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-spark">🛍️</span> Catalog workspace</div><h1>Products</h1><p>Keep your catalog fresh, clear, and ready to convert.</p></div><div className="heading-actions"><button className="secondary-button" onClick={() => showToast("Import started", "CSV import is mocked for this demo.")}><ArrowDownToLine size={16} /> Import</button><button className="primary-button" onClick={onAdd}><Plus size={17} /> Add product</button></div></section><div className="stat-strip"><div><span>Live products</span><strong>{products.filter((p) => p.status === "Active").length}</strong></div><div><span>Low stock</span><strong className="orange-text">{products.filter((p) => p.status === "Low stock").length}</strong></div><div><span>Catalog value</span><strong>{money(products.reduce((sum, product) => sum + product.price * product.stock, 0))}</strong></div><div><span>Avg. price</span><strong>{money(products.length ? products.reduce((sum, product) => sum + product.price, 0) / products.length : 0)}</strong></div></div><div className="panel full-panel"><div className="panel-heading"><div><span className="section-kicker">YOUR CATALOG</span><h2>{query ? `Results for “${query}”` : "All products"}</h2></div><div className="panel-heading-actions"><button className="secondary-button small"><Filter size={15} /> Filters</button><button className="icon-button subtle"><MoreHorizontal size={18} /></button></div></div><div className="table-scroll"><table><thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Inventory</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><span className="product-cell"><span className="product-emoji">{product.emoji}</span><strong>{product.name}</strong></span></td><td className="muted-cell">{product.sku}</td><td>{product.category}</td><td><strong>{money(product.price)}</strong></td><td>{product.stock === 0 ? <span className="orange-text">Out of stock</span> : `${product.stock} units`}</td><td><StatusPill status={product.status} /></td><td><span className="row-actions"><button aria-label={`Edit ${product.name}`} onClick={() => onEdit(product)}><Edit3 size={15} /></button><button aria-label={`Delete ${product.name}`} onClick={() => onDelete(product.id)}><Trash2 size={15} /></button></span></td></tr>)}</tbody></table>{products.length === 0 && <div className="empty-state"><span>🔎</span><strong>No products found</strong><p>Try a different search or add your first product.</p></div>}</div></div><p className="demo-disclaimer">Demo catalog · Product changes persist only in this browser session.</p></section>;
}

function OrdersPage({ orders, filter, setFilter, onCreate, onView }: { orders: Order[]; filter: string; setFilter: (filter: string) => void; onCreate: () => void; onView: (order: Order) => void }) {
  return <section className="section-page"><section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-spark">🧾</span> Fulfillment workspace</div><h1>Orders</h1><p>Stay ahead of every customer promise.</p></div><button className="primary-button" onClick={onCreate}><Plus size={17} /> Create order</button></section><div className="stat-strip"><div><span>Total orders</span><strong>45</strong></div><div><span>Completed</span><strong className="green-text">38</strong></div><div><span>Pending</span><strong className="orange-text">7</strong></div><div><span>Refund rate</span><strong>2.1%</strong></div></div><div className="panel full-panel"><div className="panel-heading"><div><span className="section-kicker">ORDER QUEUE</span><h2>Recent orders</h2></div><div className="filter-tabs">{["All orders", "Completed", "Pending", "Refunded"].map((tab) => <button className={filter === tab ? "selected" : ""} key={tab} onClick={() => setFilter(tab)}>{tab}</button>)}</div></div><div className="table-scroll"><table><thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Date</th><th>Amount</th><th>Status</th><th /></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong className="order-id">{order.id}</strong></td><td><span className="customer-cell"><span className="avatar avatar-small avatar-sky">{order.initials}</span>{order.customer}</span></td><td>{order.product}</td><td className="muted-cell">{order.date}</td><td><strong>{money(order.amount)}</strong></td><td><StatusPill status={order.status} /></td><td><button className="view-button" onClick={() => onView(order)}><Eye size={14} /> View</button></td></tr>)}</tbody></table>{orders.length === 0 && <div className="empty-state"><span>🧾</span><strong>No orders match</strong><p>Try another filter or search term.</p></div>}</div></div><p className="demo-disclaimer">Demo order queue · Customer names and transactions are illustrative only.</p></section>;
}

function CustomersPage({ showToast }: { showToast: (title: string, detail?: string) => void }) {
  const customers = [{ initials: "MC", name: "Maya Chen", email: "maya.chen@example.com", orders: 8, value: "$432", segment: "Repeat" }, { initials: "NW", name: "Noah Williams", email: "noah.w@example.com", orders: 4, value: "$188", segment: "New" }, { initials: "AP", name: "Ava Patel", email: "ava.patel@example.com", orders: 6, value: "$264", segment: "Repeat" }, { initials: "LM", name: "Leo Martin", email: "leo.m@example.com", orders: 2, value: "$84", segment: "At risk" }];
  return <section className="section-page"><section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-spark">👥</span> Relationship workspace</div><h1>Customers</h1><p>Understand the people behind every completed sale.</p></div><button className="secondary-button" onClick={() => showToast("Customer export ready", "A demo CSV is ready to download.")}><Download size={16} /> Export CSV</button></section><div className="stat-strip"><div><span>Total customers</span><strong>284</strong></div><div><span>New this month</span><strong className="green-text">+32</strong></div><div><span>Repeat purchase rate</span><strong>41.8%</strong></div><div><span>Avg. customer value</span><strong>$64.90</strong></div></div><div className="panel full-panel"><div className="panel-heading"><div><span className="section-kicker">CUSTOMER DIRECTORY</span><h2>All customers</h2></div><button className="secondary-button small"><Filter size={15} /> Segment</button></div><div className="table-scroll"><table><thead><tr><th>Customer</th><th>Orders</th><th>Lifetime value</th><th>Last order</th><th>Segment</th><th /></tr></thead><tbody>{customers.map((customer) => <tr key={customer.email}><td><span className="customer-cell"><span className="avatar avatar-small avatar-purple">{customer.initials}</span><span><strong>{customer.name}</strong><small className="table-subtext">{customer.email}</small></span></span></td><td>{customer.orders}</td><td><strong>{customer.value}</strong></td><td className="muted-cell">Sep 18, 2026</td><td><StatusPill status={customer.segment} /></td><td><button className="view-button" onClick={() => showToast(`Opening ${customer.name}`, "Customer detail is available in this demo workspace.")}><Eye size={14} /> View</button></td></tr>)}</tbody></table></div></div></section>;
}

function SalesPage({ onExport }: { onExport: () => void }) { return <section className="section-page"><section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-spark">💰</span> Performance workspace</div><h1>Sales &amp; Commissions</h1><p>See what’s working across your store and partner network.</p></div><button className="secondary-button" onClick={onExport}><Download size={16} /> Export report</button></section><div className="metric-grid compact-grid"><div className="metric-card tone-blue"><div className="metric-top"><span>Gross sales</span><span className="metric-icon">↗</span></div><strong>$1,240.00</strong><div className="metric-bottom"><span className="metric-trend">+12.4%</span><span>vs. last period</span></div></div><div className="metric-card tone-sun"><div className="metric-top"><span>Commissions paid</span><span className="metric-icon">%</span></div><strong>$124.00</strong><div className="metric-bottom"><span className="metric-trend">+9.6%</span><span>on completed sales</span></div></div><div className="metric-card tone-mint"><div className="metric-top"><span>Avg. order value</span><span className="metric-icon">✦</span></div><strong>$32.63</strong><div className="metric-bottom"><span className="metric-trend">+4.2%</span><span>this period</span></div></div></div><div className="dashboard-grid"><div className="panel chart-panel"><div className="panel-heading"><div><span className="section-kicker">PAYOUT BASIS</span><h2>Completed sales only</h2></div></div><div className="sales-rule"><span className="rule-icon">✓</span><div><strong>Commissions are tied to real customer orders.</strong><p>Partner earnings are calculated after a sale is completed, never from sign-ups or investment activity.</p></div></div><div className="commission-table expanded"><div><span>Direct sale commission</span><strong>10%</strong></div><div><span>Affiliate partner commission</span><strong>15%</strong></div><div><span>New customer bonus</span><strong>+2%</strong></div><div><span>Refund adjustment window</span><strong>30 days</strong></div></div></div><div className="panel breakdown-panel"><div className="panel-heading"><div><span className="section-kicker">THIS PERIOD</span><h2>Commission summary</h2></div></div><div className="summary-list"><div><span>Eligible sales</span><strong>$1,240.00</strong></div><div><span>Partner share</span><strong className="purple-text">−$124.00</strong></div><div className="summary-total"><span>Merchant revenue</span><strong>$1,116.00</strong></div></div><div className="panel-note"><span className="note-dot" />Mock figures for product demonstration.</div></div></div></section>; }

function PayoutsPage({ onWithdraw, showToast }: { onWithdraw: () => void; showToast: (title: string, detail?: string) => void }) { return <section className="section-page"><section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-spark">💳</span> Money movement workspace</div><h1>Payments &amp; Payouts</h1><p>Review your available balance and payout history.</p></div><button className="primary-button" onClick={onWithdraw}><ArrowDownToLine size={16} /> Withdraw funds</button></section><div className="payout-hero"><div><span className="section-kicker">AVAILABLE TO PAY OUT</span><strong>$1,050.00</strong><p>Next estimated payout · Sep 25, 2026</p></div><div className="payout-orb">💳</div></div><div className="stat-strip"><div><span>Pending balance</span><strong>$66.00</strong></div><div><span>Last payout</span><strong>$820.00</strong></div><div><span>Processing time</span><strong>2–3 days</strong></div><div><span>Payout method</span><strong>•••• 1842</strong></div></div><div className="panel full-panel"><div className="panel-heading"><div><span className="section-kicker">PAYOUT HISTORY</span><h2>Recent payouts</h2></div><button className="secondary-button small" onClick={() => showToast("Payout settings", "Bank account controls are mocked in this demo.")}><Settings2 size={15} /> Settings</button></div><div className="payout-list"><div><span className="payout-icon mint"><CheckCircle2 size={17} /></span><div><strong>$820.00 payout</strong><span>Sep 11, 2026 · •••• 1842</span></div><StatusPill status="Completed" /></div><div><span className="payout-icon blue"><Clock3 size={17} /></span><div><strong>$640.00 payout</strong><span>Aug 26, 2026 · •••• 1842</span></div><StatusPill status="Completed" /></div><div><span className="payout-icon purple"><CheckCircle2 size={17} /></span><div><strong>$495.00 payout</strong><span>Aug 11, 2026 · •••• 1842</span></div><StatusPill status="Completed" /></div></div></div><p className="demo-disclaimer">Demo payouts · No real financial accounts are connected.</p></section>; }

function PromotionsPage({ onCreate, showToast }: { onCreate: () => void; showToast: (title: string, detail?: string) => void }) { return <section className="section-page"><section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-spark">📣</span> Campaign workspace</div><h1>Promotions</h1><p>Give shoppers a reason to come back and partners a story to share.</p></div><button className="primary-button" onClick={onCreate}><Plus size={17} /> Create promotion</button></section><div className="promotion-feature"><div><span className="banner-tag">LIVE CAMPAIGN</span><h2>Fall Finds <span>🍂</span></h2><p>A warm, giftable edit for the season. Shared with your partner network and storefront visitors.</p><div className="campaign-meta"><span><strong>12</strong> products</span><span><strong>10%</strong> partner rate</span><span><strong>Sep 01–Oct 15</strong> run time</span></div><button className="dark-button" onClick={() => showToast("Promotion preview", "The campaign preview is ready in this demo.")}>Preview campaign <ArrowUpRight size={15} /></button></div><div className="campaign-collage"><span>🧶</span><span>🕯️</span><span>🍂</span><span>👜</span></div></div><div className="panel full-panel"><div className="panel-heading"><div><span className="section-kicker">YOUR CAMPAIGNS</span><h2>Promotion library</h2></div><button className="secondary-button small"><Filter size={15} /> Filter</button></div><div className="campaign-list"><div><span className="campaign-icon peach">🍂</span><div><strong>Fall Finds</strong><span>12 products · Sep 01–Oct 15</span></div><StatusPill status="Active" /><button className="view-button" onClick={() => showToast("Campaign edited", "Promotion editing is mocked in this demo.")}><Edit3 size={14} /> Edit</button></div><div><span className="campaign-icon blue">✨</span><div><strong>New customer welcome</strong><span>8 products · Always on</span></div><StatusPill status="Active" /><button className="view-button" onClick={() => showToast("Campaign paused", "Campaign controls are mocked in this demo.")}><Clock3 size={14} /> Pause</button></div><div><span className="campaign-icon mint">🎁</span><div><strong>Summer studio sale</strong><span>18 products · Jun 01–Aug 31</span></div><StatusPill status="Completed" /><button className="view-button"><Eye size={14} /> View</button></div></div></div></section>; }

function AnalyticsPage() { return <section className="section-page"><section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-spark">📊</span> Insight workspace</div><h1>Analytics</h1><p>Turn everyday activity into confident next steps.</p></div><button className="secondary-button"><CalendarDays size={16} /> Last 30 days <ChevronDown size={14} /></button></section><div className="metric-grid compact-grid"><div className="metric-card tone-blue"><div className="metric-top"><span>Store conversion</span><span className="metric-icon">↗</span></div><strong>4.8%</strong><div className="metric-bottom"><span className="metric-trend">+0.8%</span><span>vs. last period</span></div></div><div className="metric-card tone-mint"><div className="metric-top"><span>Partner clicks</span><span className="metric-icon">⌁</span></div><strong>2,846</strong><div className="metric-bottom"><span className="metric-trend">+18.2%</span><span>this month</span></div></div><div className="metric-card tone-purple"><div className="metric-top"><span>Repeat customers</span><span className="metric-icon">↺</span></div><strong>41.8%</strong><div className="metric-bottom"><span className="metric-trend">+5.4%</span><span>of all buyers</span></div></div></div><section className="dashboard-grid"><div className="panel chart-panel"><div className="panel-heading"><div><span className="section-kicker">TRAFFIC TO SALES</span><h2>Conversion overview</h2></div></div><TinyBarChart /></div><div className="panel breakdown-panel"><div className="panel-heading"><div><span className="section-kicker">PARTNER IMPACT</span><h2>Channel breakdown</h2></div></div><DonutChart /></div></section><div className="insight-callout"><span className="insight-icon">💡</span><div><strong>Your strongest lever is repeat purchase.</strong><p>Customers who have purchased once are converting 2.4× more often. Consider a post-purchase promotion for your top 3 products.</p></div><button className="text-button">Create action <ArrowUpRight size={15} /></button></div></section>; }

function SettingsPage({ showToast }: { showToast: (title: string, detail?: string) => void }) { const settings = [{ icon: "🏪", title: "Store profile", detail: "Sunny & Found · storefront details" }, { icon: "💰", title: "Commission rules", detail: "3 active rules · completed sales only" }, { icon: "🔔", title: "Notifications", detail: "Email and in-app alerts" }, { icon: "👥", title: "Team & permissions", detail: "2 members · owner access" }]; return <section className="section-page"><section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-spark">⚙️</span> Workspace controls</div><h1>Settings</h1><p>Make ShopPartner work the way your team works.</p></div><button className="primary-button" onClick={() => showToast("Settings saved", "Your demo preferences are up to date.")}><Check size={17} /> Save changes</button></section><div className="settings-layout"><div className="settings-nav"><p className="nav-label">Workspace settings</p>{["Store profile", "Commission rules", "Notifications", "Team & permissions", "Payout preferences"].map((item, index) => <button className={`settings-nav-item ${index === 0 ? "active" : ""}`} key={item}><span>{["🏪", "💰", "🔔", "👥", "💳"][index]}</span>{item}<ChevronRight size={15} /></button>)}</div><div className="panel settings-panel"><div className="panel-heading"><div><span className="section-kicker">STORE PROFILE</span><h2>How your workspace appears</h2></div></div><label>Store name<input defaultValue="Sunny & Found" /></label><label>Store description<textarea defaultValue="Small-batch objects for bright, ordinary days." rows={3} /></label><label>Store URL<div className="input-prefix"><span>shoppartner.co/</span><input defaultValue="sunny-and-found" /></div></label><div className="settings-card-list">{settings.slice(1).map((item) => <button key={item.title} onClick={() => showToast(item.title, "This settings section is ready for your next configuration step.")}><span className="settings-card-icon">{item.icon}</span><span><strong>{item.title}</strong><small>{item.detail}</small></span><ChevronRight size={17} /></button>)}</div></div></div><p className="demo-disclaimer">Demo settings · Changes are illustrative and are not connected to an account.</p></section>; }

function Modal({ type, editingProduct, onClose, onSaveProduct, showToast }: { type: "product" | "order" | "payout" | "promotion" | "support"; editingProduct: Product | null; onClose: () => void; onSaveProduct: (event: React.FormEvent<HTMLFormElement>) => void; showToast: (title: string, detail?: string) => void }) {
  const titles = { product: editingProduct ? "Edit product" : "Add a product", order: "Create an order", payout: "Withdraw funds", promotion: "Create a promotion", support: "Help center" };
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><div><span className="modal-kicker">DEMO WORKFLOW</span><h2 id="modal-title">{titles[type]}</h2></div><button className="icon-button subtle" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></div>{type === "product" && <form onSubmit={onSaveProduct}><div className="form-grid"><label>Product name<input name="name" required defaultValue={editingProduct?.name ?? ""} placeholder="e.g. Studio linen shirt" /></label><label>SKU<input name="sku" defaultValue={editingProduct?.sku ?? "NEW-0000"} /></label><label>Category<select name="category" defaultValue={editingProduct?.category ?? "Apparel"}><option>Apparel</option><option>Home</option><option>Accessories</option><option>Stationery</option></select></label><label>Price<input name="price" type="number" min="0" step="0.01" defaultValue={editingProduct?.price ?? 24} /></label><label>Inventory<input name="stock" type="number" min="0" defaultValue={editingProduct?.stock ?? 10} /></label></div><p className="form-note"><Sparkles size={15} /> Product updates are stored in this demo session only.</p><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button"><Check size={16} /> {editingProduct ? "Save changes" : "Add product"}</button></div></form>}{type === "order" && <form onSubmit={(event) => { event.preventDefault(); onClose(); showToast("Order created", "SP-1049 was added to the demo order queue."); }}><div className="form-grid"><label>Customer name<input required placeholder="e.g. Taylor Morgan" /></label><label>Customer email<input type="email" placeholder="taylor@example.com" /></label><label className="span-two">Product<select defaultValue="Cloud knit cardigan"><option>Cloud knit cardigan · $84</option><option>Lemon drop candle · $32</option><option>Citrus studio mug · $28</option></select></label><label>Quantity<input type="number" min="1" defaultValue="1" /></label><label>Payment status<select defaultValue="Completed"><option>Completed</option><option>Pending</option></select></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button"><Plus size={16} /> Create order</button></div></form>}{type === "payout" && <div><div className="modal-balance"><span>Available payout</span><strong>$1,050.00</strong><small>Demo balance · no real funds will move</small></div><label>Amount to withdraw<input type="number" defaultValue="1050" max="1050" /></label><div className="payout-method-row"><span className="payout-icon blue"><CreditCard size={17} /></span><div><strong>Bank account ending in 1842</strong><span>Estimated arrival in 2–3 business days</span></div><CheckCircle2 size={17} className="green-text" /></div><div className="modal-actions"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={() => { onClose(); showToast("Payout requested", "This demo request does not move real money."); }}><ArrowDownToLine size={16} /> Request payout</button></div></div>}{type === "promotion" && <form onSubmit={(event) => { event.preventDefault(); onClose(); showToast("Promotion created", "Your demo campaign is ready to preview."); }}><div className="form-grid"><label>Promotion name<input required defaultValue="Weekend edit" /></label><label>Partner commission<input type="number" defaultValue="10" min="0" max="50" /> </label><label className="span-two">Description<textarea defaultValue="A focused edit for shoppers who love small-batch pieces." rows={3} /></label><label>Starts<input type="date" defaultValue="2026-09-20" /></label><label>Ends<input type="date" defaultValue="2026-10-15" /></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button"><Sparkles size={16} /> Create promotion</button></div></form>}{type === "support" && <div><div className="support-modal-intro"><span className="help-orb large">?</span><div><strong>What would you like to work on?</strong><p>Browse practical guides for your store, partner network, and customer experience.</p></div></div><div className="support-links"><button onClick={() => { onClose(); showToast("Guide opened", "Product page playbook is ready in this demo."); }}><span>🛍️</span><div><strong>Improve a product page</strong><small>Clarity, trust, and conversion tips</small></div><ChevronRight size={16} /></button><button onClick={() => { onClose(); showToast("Guide opened", "Commission playbook is ready in this demo."); }}><span>💰</span><div><strong>Understand commissions</strong><small>How completed sales drive payouts</small></div><ChevronRight size={16} /></button><button onClick={() => { onClose(); showToast("Guide opened", "Promotion playbook is ready in this demo."); }}><span>📣</span><div><strong>Plan a promotion</strong><small>Build a seasonal campaign</small></div><ChevronRight size={16} /></button></div></div>}</div></div>;
}
