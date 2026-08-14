"use client";

import { useState, useEffect, useRef } from "react";

interface Proposal {
  _id?: string;
  id: string;
  name: string;
  email: string;
  phone?: string;
  university: string;
  category: string;
  title: string;
  timeline: string;
  requirements: string;
  budget: number;
  timestamp: string;
  status: string;
}

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "a7b8c9d",
    name: "Tariqul Islam",
    email: "tariq.buet@gmail.com",
    phone: "01712345678",
    university: "BUET",
    category: "ai-ml",
    title: "AI-Driven Satellite Crop Disease Diagnostic Engine",
    timeline: "3-weeks",
    requirements: "Machine learning pipeline using ResNet50 for leaf disease detection with PyTorch backend and Next.js web portal.",
    budget: 15000,
    timestamp: "2026-08-14T10:00:00.000Z",
    status: "In Consultation",
  },
  {
    id: "f4e5d6c",
    name: "Nusrat Jahan",
    email: "nusrat.brac@gmail.com",
    phone: "01819203040",
    university: "BRAC University",
    category: "web",
    title: "E-Healthcare Electronic Health Record Platform",
    timeline: "2-weeks",
    requirements: "Secure EHR portal with role-based access control (Doctor, Patient, Lab Tech) and automated prescription generator.",
    budget: 20000,
    timestamp: "2026-08-13T14:30:00.000Z",
    status: "Pending Review",
  },
  {
    id: "k2j1i0h",
    name: "Samiul Hasan",
    email: "samiul.sust@gmail.com",
    phone: "01911223344",
    university: "SUST",
    category: "iot",
    title: "Smart Microgrid Solar Power Monitoring IoT Node",
    timeline: "1-month",
    requirements: "Hardware integration with ESP32, INA219 current sensor, and MQTT broker feeding live dashboard graphics.",
    budget: 15000,
    timestamp: "2026-08-11T09:15:00.000Z",
    status: "Accepted",
  },
  {
    id: "y9x8w7v",
    name: "Fariha Anjum",
    email: "fariha.nsu@gmail.com",
    phone: "01655443322",
    university: "North South University",
    category: "web",
    title: "Multi-Vendor Campus Academic Marketplace",
    timeline: "2-weeks",
    requirements: "E-commerce platform for university students to exchange project books and hardware components.",
    budget: 10000,
    timestamp: "2026-08-07T16:45:00.000Z",
    status: "Archived",
  }
];

export default function AdminDashboard() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Dashboard states
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<"connected" | "syncing" | "error">("syncing");
  
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Check saved authentication session on mount
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("tong_admin_session");
    if (savedAuth === "tong_admin_session_valid") {
      setIsAuthenticated(true);
      loadProposals();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsAuthenticating(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("tong_admin_session", "tong_admin_session_valid");
        setIsAuthenticated(true);
        loadProposals();
      } else {
        setLoginError(data.error || "Invalid login credentials.");
      }
    } catch (err) {
      setLoginError("Failed to connect to authentication server.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem("tong_admin_session");
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  // Fetch proposals from MongoDB & local fallback
  const loadProposals = async () => {
    setIsLoading(true);
    setDbStatus("syncing");
    try {
      const res = await fetch("/api/project-ideas");
      const data = await res.json();
      
      let mongoList: Proposal[] = [];
      if (data.success && Array.isArray(data.ideas)) {
        mongoList = data.ideas.map((item: any) => ({
          _id: item._id,
          id: item._id || item.id || Math.random().toString(36).substring(2, 9),
          name: item.name,
          email: item.email,
          phone: item.phone,
          university: item.university,
          category: item.category,
          title: item.title,
          timeline: item.timeline,
          requirements: item.requirements,
          budget: item.budget || 15000,
          timestamp: item.submittedAt || item.timestamp || new Date().toISOString(),
          status: item.status || "Pending Review",
        }));
        setDbStatus("connected");
      } else {
        setDbStatus("error");
      }

      let localList: Proposal[] = [];
      try {
        const stored = localStorage.getItem("tong_solutions_proposals");
        if (stored) {
          localList = JSON.parse(stored);
        }
      } catch (e) {
        console.error("Local storage read error:", e);
      }

      const combinedMap = new Map<string, Proposal>();
      mongoList.forEach((p) => combinedMap.set(p.id, p));
      localList.forEach((p) => {
        if (!combinedMap.has(p.id)) combinedMap.set(p.id, p);
      });

      setProposals(Array.from(combinedMap.values()));
    } catch (err) {
      console.error("Failed to load proposals from MongoDB:", err);
      setDbStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Seed sample data to MongoDB
  const seedMockData = async () => {
    try {
      setIsLoading(true);
      for (const mockItem of MOCK_PROPOSALS) {
        await fetch("/api/project-ideas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mockItem),
        });
      }
      await loadProposals();
    } catch (err) {
      console.error("Failed to seed mock data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update status in MongoDB
  const updateProposalStatus = async (id: string, newStatus: string) => {
    try {
      const updated = proposals.map((p) => {
        if (p.id === id || p._id === id) {
          const u = { ...p, status: newStatus };
          if (selectedProposal && (selectedProposal.id === id || selectedProposal._id === id)) {
            setSelectedProposal(u);
          }
          return u;
        }
        return p;
      });
      setProposals(updated);
      localStorage.setItem("tong_solutions_proposals", JSON.stringify(updated));

      await fetch("/api/project-ideas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update status in MongoDB:", err);
    }
  };

  // Delete specific proposal in MongoDB
  const deleteProposal = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this client submission? This will remove it from MongoDB.")) {
      try {
        const updated = proposals.filter((p) => p.id !== id && p._id !== id);
        setProposals(updated);
        localStorage.setItem("tong_solutions_proposals", JSON.stringify(updated));
        
        if (selectedProposal && (selectedProposal.id === id || selectedProposal._id === id)) {
          closeModal();
        }

        await fetch(`/api/project-ideas?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Failed to delete proposal in MongoDB:", err);
      }
    }
  };

  const openModal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
    setSelectedProposal(null);
  };

  // Export CSV logic
  const exportToCSV = () => {
    if (proposals.length === 0) return;
    
    const headers = ["MongoDB ID", "Date Submitted", "Name", "Email", "Contact (BD Phone)", "University", "Category", "Title", "Timeline", "Budget (BDT / ৳)", "Status"];
    const rows = proposals.map((p) => [
      p._id || p.id,
      new Date(p.timestamp).toLocaleDateString(),
      p.name,
      p.email,
      p.phone || "N/A",
      p.university,
      p.category,
      p.title,
      p.timeline,
      `৳${p.budget.toLocaleString()}`,
      p.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tong_solutions_client_submissions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Search & Filter
  const filteredProposals = proposals.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.phone && p.phone.includes(searchQuery)) ||
      p.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === "all" || p.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // KPI Calculations
  const totalSubmissions = proposals.length;
  const totalPipelineRevenue = proposals.reduce((sum, p) => sum + (p.budget || 0), 0);
  const pendingCount = proposals.filter((p) => p.status === "Pending Review").length;
  const avgBudget = proposals.length > 0 ? Math.round(totalPipelineRevenue / proposals.length) : 0;

  const getCategoryLabel = (cat: string) => {
    if (!cat) return "General Software";
    const lower = cat.toLowerCase();
    if (lower.includes("web")) return "Web Application";
    if (lower.includes("ai") || lower.includes("machine")) return "AI & Machine Learning";
    if (lower.includes("iot") || lower.includes("embed")) return "IoT & Embedded";
    if (lower.includes("mobile") || lower.includes("app")) return "Mobile App";
    if (lower.includes("block") || lower.includes("chain")) return "Blockchain & Web3";
    return cat;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Review": return "hsl(200, 100%, 55%)";
      case "In Consultation": return "hsl(40, 100%, 50%)";
      case "Accepted": return "hsl(140, 70%, 45%)";
      case "Completed": return "hsl(280, 80%, 65%)";
      case "Archived": return "hsl(215, 20%, 55%)";
      default: return "inherit";
    }
  };

  // RENDER SECURITY LOGIN LOCKSCREEN IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div suppressHydrationWarning style={{ minHeight: "100vh", background: "var(--bg-main)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
        <div className="hud-card" style={{ maxWidth: "440px", width: "100%", padding: "2rem", background: "rgba(8, 12, 22, 0.95)", border: "1px solid var(--accent-cyan)", borderRadius: "16px", boxShadow: "0 0 35px rgba(0, 240, 255, 0.25)", position: "relative" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div style={{ marginBottom: "0.75rem" }}>
              <img src="/logo-full.png" alt="Tong Solutions" style={{ height: "42px", filter: "drop-shadow(0 0 12px rgba(0,240,255,0.5))" }} />
            </div>
            <span className="tong-badge tong-badge-cyan" style={{ fontSize: "0.75rem", marginBottom: "0.5rem" }}>
              <span>🔐 ADMIN SECURITY LOCKSCREEN</span>
            </span>
            <h2 style={{ fontSize: "1.4rem", color: "#FFF", marginTop: "0.25rem" }}>Admin Portal Authentication</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Please enter administrator credentials to access client submissions telemetry.</p>
          </div>

          {/* Error Notice */}
          {loginError && (
            <div style={{ background: "rgba(220, 38, 38, 0.15)", border: "1px solid #DC2626", color: "#EF4444", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.85rem", marginBottom: "1.25rem", textAlign: "center" }}>
              ⚠️ {loginError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Administrator Username
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter admin username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(0,0,0,0.5)", border: "1px solid var(--glass-border)", borderRadius: "8px", color: "#FFF" }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem 2.75rem 0.75rem 1rem", background: "rgba(0,0,0,0.5)", border: "1px solid var(--glass-border)", borderRadius: "8px", color: "#FFF" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.9rem" }}
                >
                  {showPassword ? "👁️" : "🔒"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="cta-button primary"
              style={{ width: "100%", padding: "0.85rem", fontSize: "1rem", fontWeight: 700, borderRadius: "8px", background: "linear-gradient(135deg, #00F0FF, #0072FF)", boxShadow: "0 0 20px rgba(0,240,255,0.4)" }}
            >
              {isAuthenticating ? "Authenticating..." : "🔓 Unlock Admin Panel"}
            </button>
          </form>

          {/* Credentials Helper Badge */}
          <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px dashed var(--glass-border)", textAlign: "center", fontSize: "0.78rem", color: "var(--accent-gold-light)" }}>
            ℹ️ <strong>Default Credentials:</strong><br />
            Username: <code style={{ color: "#00F0FF" }}>admin</code> | Password: <code style={{ color: "#00F0FF" }}>tong2026password</code>
          </div>
        </div>
      </div>
    );
  }

  // RENDER ADMIN DASHBOARD WHEN AUTHENTICATED
  return (
    <div suppressHydrationWarning className="admin-page-container" style={{ minHeight: "100vh", background: "var(--bg-main)" }}>
      {/* Header Bar */}
      <header className="main-header" style={{ borderBottom: "1px solid var(--glass-border)", background: "rgba(5,7,12,0.9)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBlock: "1rem" }}>
          <a href="/" className="logo" aria-label="Tong Solutions Home" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
            <img src="/logo-full.png" alt="Tong Solutions" className="logo-image" style={{ height: "36px", filter: "drop-shadow(0 0 10px rgba(0,240,255,0.4))" }} />
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.8rem", padding: "0.3rem 0.75rem", borderRadius: "20px", background: dbStatus === "connected" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", border: `1px solid ${dbStatus === "connected" ? "#10B981" : "#F59E0B"}`, color: dbStatus === "connected" ? "#10B981" : "#F59E0B", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: dbStatus === "connected" ? "#10B981" : "#F59E0B", display: "inline-block", boxShadow: `0 0 8px ${dbStatus === "connected" ? "#10B981" : "#F59E0B"}` }}></span>
              {dbStatus === "connected" ? "MongoDB Atlas Connected" : "Syncing DB..."}
            </span>
            <a href="/" className="cta-button secondary" style={{ fontSize: "0.85rem", padding: "0.4rem 0.9rem", border: "1px solid var(--glass-border)", color: "var(--text-muted)", textDecoration: "none" }}>
              ← Site Home
            </a>
            <button
              onClick={handleLogout}
              className="cta-button secondary"
              style={{ fontSize: "0.85rem", padding: "0.4rem 0.9rem", border: "1px solid #DC2626", color: "#EF4444" }}
            >
              🔒 Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Control Banner */}
      <div style={{ background: "rgba(8, 10, 15, 0.95)", borderBottom: "1px solid rgba(0, 240, 255, 0.2)", padding: "0.4rem 1rem", fontSize: "0.75rem", fontFamily: "var(--font-headings)", letterSpacing: "0.12em", color: "var(--accent-cyan)", textAlign: "center", textTransform: "uppercase" }}>
        ⚙️ TONG SOLUTIONS ADMIN PANEL • LIVE CLIENT SUBMISSIONS TELEMETRY
      </div>

      <main className="container" style={{ paddingBlock: "var(--space-lg)" }}>
        {/* Title & Top Action Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span className="tong-badge tong-badge-cyan" style={{ marginBottom: "0.5rem" }}>
              <span>🔐 ADMIN MANAGEMENT PORTAL</span>
            </span>
            <h1 className="tong-text-gradient" style={{ fontSize: "2.2rem" }}>Client Project Submissions</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Manage and review incoming project proposals from engineering students across Bangladesh.</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button onClick={loadProposals} disabled={isLoading} className="cta-button secondary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", border: "1px solid var(--accent-cyan)", color: "var(--accent-cyan)" }}>
              🔄 {isLoading ? "Syncing..." : "Refresh Submissions"}
            </button>
            {totalSubmissions === 0 && (
              <button onClick={seedMockData} className="cta-button primary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", background: "linear-gradient(135deg, #DC2626, #F59E0B)" }}>
                🌱 Add Sample Submissions
              </button>
            )}
            {totalSubmissions > 0 && (
              <button onClick={exportToCSV} className="cta-button secondary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", border: "1px solid var(--accent-gold-light)", color: "var(--accent-gold-light)" }}>
                📥 Export Submissions CSV
              </button>
            )}
          </div>
        </div>

        {/* Analytics KPIs Grid */}
        <section className="admin-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "var(--space-lg)" }}>
          <div className="hud-card stat-card" style={{ padding: "1.25rem", background: "rgba(15,23,42,0.6)", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
            <div className="stat-num" style={{ color: "var(--accent-cyan)", fontSize: "2.2rem", fontWeight: 700 }}>{totalSubmissions}</div>
            <div className="stat-label" style={{ color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Submissions</div>
          </div>
          <div className="hud-card stat-card" style={{ padding: "1.25rem", background: "rgba(15,23,42,0.6)", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
            <div className="stat-num" style={{ color: "var(--accent-gold-light)", fontSize: "2.2rem", fontWeight: 700 }}>৳{totalPipelineRevenue.toLocaleString()}</div>
            <div className="stat-label" style={{ color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Pipeline Budget</div>
          </div>
          <div className="hud-card stat-card" style={{ padding: "1.25rem", background: "rgba(15,23,42,0.6)", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
            <div className="stat-num" style={{ color: "hsl(200, 100%, 55%)", fontSize: "2.2rem", fontWeight: 700 }}>{pendingCount}</div>
            <div className="stat-label" style={{ color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pending Review</div>
          </div>
          <div className="hud-card stat-card" style={{ padding: "1.25rem", background: "rgba(15,23,42,0.6)", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
            <div className="stat-num" style={{ color: "var(--accent-primary)", fontSize: "2.2rem", fontWeight: 700 }}>৳{avgBudget.toLocaleString()}</div>
            <div className="stat-label" style={{ color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Average Project Budget</div>
          </div>
        </section>

        {/* Search & Filter Controls */}
        <section className="glass-panel" style={{ padding: "1.25rem", marginBottom: "var(--space-md)", background: "rgba(15,23,42,0.4)", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            {/* Search */}
            <div style={{ flex: "1 1 280px" }}>
              <input
                type="text"
                placeholder="Search by student name, email, phone, university, or project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ width: "100%", padding: "0.6rem 1rem", background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", borderRadius: "8px", color: "var(--text-main)", fontSize: "0.9rem" }}
              />
            </div>
            
            {/* Category Filter */}
            <div style={{ width: "180px" }}>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="form-control"
                style={{ width: "100%", padding: "0.6rem 1rem", background: "rgba(8,10,15,0.9)", border: "1px solid var(--glass-border)", borderRadius: "8px", color: "var(--text-main)", fontSize: "0.9rem" }}
              >
                <option value="all">All Domains</option>
                <option value="web">Web Apps</option>
                <option value="mobile">Mobile Apps</option>
                <option value="ai">AI &amp; ML</option>
                <option value="iot">IoT &amp; Embedded</option>
                <option value="block">Blockchain</option>
              </select>
            </div>

            {/* Status Filter */}
            <div style={{ width: "180px" }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-control"
                style={{ width: "100%", padding: "0.6rem 1rem", background: "rgba(8,10,15,0.9)", border: "1px solid var(--glass-border)", borderRadius: "8px", color: "var(--text-main)", fontSize: "0.9rem" }}
              >
                <option value="all">All Statuses</option>
                <option value="Pending Review">Pending Review</option>
                <option value="In Consultation">In Consultation</option>
                <option value="Accepted">Accepted</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>
        </section>

        {/* Submissions Table */}
        <section className="glass-panel" style={{ overflowX: "auto", background: "rgba(15,23,42,0.4)", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--accent-cyan)" }}>
              <p style={{ fontSize: "1.1rem" }}>⚡ Loading client submissions from MongoDB Atlas...</p>
            </div>
          ) : filteredProposals.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>No client submissions found</p>
              <p style={{ fontSize: "0.9rem" }}>Try adjusting your search criteria or submit a proposal on the homepage.</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.4)", borderBottom: "1px solid var(--glass-border)", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  <th style={{ padding: "1rem" }}>Date</th>
                  <th style={{ padding: "1rem" }}>Student Details</th>
                  <th style={{ padding: "1rem" }}>University</th>
                  <th style={{ padding: "1rem" }}>Project Title</th>
                  <th style={{ padding: "1rem" }}>Budget</th>
                  <th style={{ padding: "1rem" }}>Status</th>
                  <th style={{ padding: "1rem" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProposals.map((p) => (
                  <tr key={p._id || p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }}>
                    <td style={{ padding: "1rem", fontSize: "0.85rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {new Date(p.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <strong style={{ display: "block", color: "#FFF" }}>{p.name}</strong>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{p.email}</span>
                      {p.phone && (
                        <span style={{ display: "block", fontSize: "0.8rem", color: "var(--accent-cyan)" }}>
                          📞 {p.phone}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>{p.university}</td>
                    <td style={{ padding: "1rem", maxWidth: "250px" }}>
                      <span style={{ display: "block", fontWeight: 600, color: "var(--text-main)" }} title={p.title}>{p.title}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", background: "rgba(0,240,255,0.1)", padding: "0.1rem 0.4rem", borderRadius: "4px", display: "inline-block", marginTop: "0.2rem" }}>
                        {getCategoryLabel(p.category)}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", color: "var(--accent-gold-light)", fontWeight: 700, fontSize: "1rem" }}>
                      ৳{p.budget ? p.budget.toLocaleString() : "15,000"}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <select
                        value={p.status}
                        onChange={(e) => updateProposalStatus(p._id || p.id, e.target.value)}
                        style={{
                          background: `${getStatusColor(p.status)}18`,
                          border: `1px solid ${getStatusColor(p.status)}`,
                          color: getStatusColor(p.status),
                          padding: "0.3rem 0.6rem",
                          borderRadius: "20px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        <option value="Pending Review" style={{ background: "#080A0F", color: "#FFF" }}>Pending Review</option>
                        <option value="In Consultation" style={{ background: "#080A0F", color: "#FFF" }}>In Consultation</option>
                        <option value="Accepted" style={{ background: "#080A0F", color: "#FFF" }}>Accepted</option>
                        <option value="Completed" style={{ background: "#080A0F", color: "#FFF" }}>Completed</option>
                        <option value="Archived" style={{ background: "#080A0F", color: "#FFF" }}>Archived</option>
                      </select>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button 
                          onClick={() => openModal(p)} 
                          className="cta-button primary" 
                          style={{ padding: "0.35rem 0.7rem", fontSize: "0.8rem", borderRadius: "6px" }}
                        >
                          Details
                        </button>
                        <button 
                          onClick={() => deleteProposal(p._id || p.id)} 
                          className="cta-button secondary" 
                          style={{ padding: "0.35rem 0.7rem", fontSize: "0.8rem", borderRadius: "6px", border: "1px solid #EF4444", color: "#EF4444" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>

      {/* DETAIL MODAL DIALOG */}
      <dialog
        ref={dialogRef}
        id="idea-dialog"
        style={{ maxWidth: "620px", width: "90%", background: "#080A0F", border: "1px solid var(--glass-border)", borderRadius: "12px", color: "var(--text-main)", padding: "1.5rem" }}
      >
        {selectedProposal && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.3rem", color: "var(--accent-cyan)", margin: 0 }}>Client Submission Details</h2>
              <button
                type="button"
                onClick={closeModal}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.5rem", cursor: "pointer" }}
              >
                ×
              </button>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "0.85rem", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
                <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)" }}>STUDENT CONTACT</span>
                <strong style={{ fontSize: "1.1rem", display: "block", marginTop: "0.2rem" }}>{selectedProposal.name}</strong>
                <a href={`mailto:${selectedProposal.email}`} style={{ color: "var(--accent-cyan)", fontSize: "0.85rem", display: "block", textDecoration: "none", marginTop: "0.2rem" }}>✉️ {selectedProposal.email}</a>
                {selectedProposal.phone && (
                  <a href={`tel:${selectedProposal.phone}`} style={{ color: "#10B981", fontSize: "0.85rem", display: "block", textDecoration: "none", marginTop: "0.2rem" }}>📞 {selectedProposal.phone}</a>
                )}
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "0.85rem", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
                <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)" }}>INSTITUTION</span>
                <strong style={{ fontSize: "1.1rem", display: "block", marginTop: "0.2rem" }}>{selectedProposal.university}</strong>
                <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Submitted: {new Date(selectedProposal.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)" }}>PROJECT TITLE</span>
              <h3 style={{ fontSize: "1.15rem", color: "#FFF", marginTop: "0.2rem", lineHeight: 1.4 }}>{selectedProposal.title}</h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.6rem", borderRadius: "6px", border: "1px solid var(--glass-border)" }}>
                <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)" }}>Domain</span>
                <strong style={{ fontSize: "0.85rem", color: "var(--accent-cyan)" }}>{getCategoryLabel(selectedProposal.category)}</strong>
              </div>
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.6rem", borderRadius: "6px", border: "1px solid var(--glass-border)" }}>
                <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)" }}>Timeline</span>
                <strong style={{ fontSize: "0.85rem" }}>{selectedProposal.timeline}</strong>
              </div>
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "0.6rem", borderRadius: "6px", border: "1px solid var(--glass-border)" }}>
                <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)" }}>Budget</span>
                <strong style={{ fontSize: "0.95rem", color: "var(--accent-gold-light)" }}>৳{selectedProposal.budget ? selectedProposal.budget.toLocaleString() : "15,000"}</strong>
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>PROJECT REQUIREMENTS & SCOPE</span>
              <div style={{ background: "rgba(0,0,0,0.5)", padding: "0.85rem", borderRadius: "8px", fontSize: "0.9rem", color: "var(--text-main)", lineHeight: 1.6, whiteSpace: "pre-wrap", border: "1px solid var(--glass-border)", maxHeight: "160px", overflowY: "auto" }}>
                {selectedProposal.requirements}
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem", paddingTop: "0.75rem", borderTop: "1px solid var(--glass-border)" }}>
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>UPDATE STATUS</span>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {["Pending Review", "In Consultation", "Accepted", "Completed", "Archived"].map((st) => (
                  <button
                    key={st}
                    onClick={() => updateProposalStatus(selectedProposal._id || selectedProposal.id, st)}
                    style={{
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.8rem",
                      borderRadius: "6px",
                      border: `1px solid ${selectedProposal.status === st ? getStatusColor(st) : "var(--glass-border)"}`,
                      background: selectedProposal.status === st ? `${getStatusColor(st)}25` : "rgba(255,255,255,0.03)",
                      color: selectedProposal.status === st ? getStatusColor(st) : "var(--text-muted)",
                      cursor: "pointer"
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: "1px solid var(--glass-border)" }}>
              <button
                type="button"
                className="cta-button secondary"
                onClick={() => deleteProposal(selectedProposal._id || selectedProposal.id)}
                style={{ border: "1px solid #EF4444", color: "#EF4444", fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}
              >
                Delete Proposal
              </button>
              <button
                type="button"
                className="cta-button secondary"
                onClick={closeModal}
                style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
