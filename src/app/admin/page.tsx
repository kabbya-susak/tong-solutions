"use client";

import { useState, useEffect, useRef } from "react";

interface Proposal {
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
    name: "Alex Rivera",
    email: "arivera@mit.edu",
    phone: "01712345678",
    university: "Massachusetts Institute of Technology",
    category: "ai-ml",
    title: "AI-Driven Crop Yield Prediction System",
    timeline: "3-months",
    requirements: "We need a machine learning pipeline that uses satellite imagery and local soil temperature sensors to predict wheat crop yields. Preferred tech stack: Python, TensorFlow, and a React-based analytics dashboard.",
    budget: 15000,
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
    status: "In Consultation",
  },
  {
    id: "f4e5d6c",
    name: "Sarah Chen",
    email: "schen@stanford.edu",
    phone: "01819203040",
    university: "Stanford University",
    category: "web",
    title: "High-Performance Cloud Healthcare Portal",
    timeline: "3-months",
    requirements: "A secure, HIPAA-compliant patient management system with real-time analytics. The interface allows doctors to request access and manage diagnostic records with high performance.",
    budget: 20000,
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
    status: "Pending Review",
  },
  {
    id: "k2j1i0h",
    name: "Marcus Aurelius",
    email: "marcus@nus.edu.sg",
    phone: "01911223344",
    university: "National University of Singapore",
    category: "iot",
    title: "Smart Indoor Air Quality Controller",
    timeline: "2-months",
    requirements: "Hardware integration with ESP32, MQ-135 sensor, and DHT22. It should publish air quality data to a server over MQTT. We also need a real-time web portal to monitor levels and toggle an air purifier relay.",
    budget: 15000,
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
    status: "Accepted",
  },
  {
    id: "y9x8w7v",
    name: "Chloe Dupont",
    email: "c.dupont@sorbonne.fr",
    phone: "01655443322",
    university: "Sorbonne University",
    category: "web",
    title: "Microservices-Based Multi-Vendor Marketplace",
    timeline: "1-month",
    requirements: "A prototype of an e-commerce platform where multiple sellers can manage products. Needs key checkout capabilities, Stripe mock payments, and dynamic seller statistics.",
    budget: 10000,
    timestamp: new Date(Date.now() - 7 * 86400000).toISOString(), // 1 week ago
    status: "Archived",
  }
];

export default function AdminDashboard() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = () => {
    try {
      const stored = localStorage.getItem("tong_solutions_proposals");
      if (stored) {
        setProposals(JSON.parse(stored));
      } else {
        setProposals([]);
      }
    } catch (err) {
      console.error("Failed to load proposals:", err);
    }
  };

  // Seed mock data for easy review
  const seedMockData = () => {
    try {
      localStorage.setItem("tong_solutions_proposals", JSON.stringify(MOCK_PROPOSALS));
      setProposals(MOCK_PROPOSALS);
    } catch (err) {
      console.error("Failed to seed mock data:", err);
    }
  };

  // Clear all data
  const clearAllData = () => {
    if (window.confirm("Are you sure you want to delete ALL proposals from localStorage? This cannot be undone.")) {
      try {
        localStorage.removeItem("tong_solutions_proposals");
        setProposals([]);
      } catch (err) {
        console.error("Failed to clear data:", err);
      }
    }
  };

  // Update status of proposal
  const updateProposalStatus = (id: string, newStatus: string) => {
    const updated = proposals.map((p) => {
      if (p.id === id) {
        const u = { ...p, status: newStatus };
        if (selectedProposal && selectedProposal.id === id) {
          setSelectedProposal(u);
        }
        return u;
      }
      return p;
    });
    setProposals(updated);
    localStorage.setItem("tong_solutions_proposals", JSON.stringify(updated));
  };

  // Delete specific proposal
  const deleteProposal = (id: string) => {
    if (window.confirm("Are you sure you want to delete this proposal?")) {
      const updated = proposals.filter((p) => p.id !== id);
      setProposals(updated);
      localStorage.setItem("tong_solutions_proposals", JSON.stringify(updated));
      if (selectedProposal && selectedProposal.id === id) {
        closeModal();
      }
    }
  };

  // Open modal
  const openModal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    dialogRef.current?.showModal();
  };

  // Close modal
  const closeModal = () => {
    dialogRef.current?.close();
    setSelectedProposal(null);
  };

  // Export to CSV
  const exportToCSV = () => {
    if (proposals.length === 0) return;
    
    const headers = ["ID", "Date Submitted", "Name", "Email", "Contact (BD)", "University", "Category", "Title", "Timeline", "Budget (BDT / ৳)", "Status"];
    const rows = proposals.map((p) => [
      p.id,
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
    link.setAttribute("download", `tong_solutions_proposals_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Search Logic
  const filteredProposals = proposals.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.phone && p.phone.includes(searchQuery)) ||
      p.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate metrics
  const totalSubmissions = proposals.length;
  const avgBudget = proposals.length > 0 
    ? Math.round(proposals.reduce((sum, p) => sum + p.budget, 0) / proposals.length) 
    : 0;
  
  const categoryCounts = proposals.reduce((acc: Record<string, number>, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "web": return "Web App";
      case "mobile": return "Mobile App";
      case "ai-ml": return "AI / Machine Learning";
      case "iot": return "IoT / Embedded";
      default: return "Other";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Review": return "hsl(200, 100%, 55%)"; // Sky Cyan
      case "In Consultation": return "hsl(222, 75%, 45%)"; // Vibrant Blue
      case "Accepted": return "hsl(140, 70%, 45%)"; // Emerald Green
      case "Archived": return "hsl(215, 20%, 55%)"; // Gray/Muted
      default: return "inherit";
    }
  };

  return (
    <div className="admin-page-container">
      <header className="main-header">
        <div className="container">
          <a href="/" className="logo" aria-label="Tong Solutions Home">
            <img src="/logo-full.png" alt="Tong Solutions" className="logo-image" style={{ filter: "drop-shadow(0 0 10px rgba(0,240,255,0.4))" }} />
          </a>
          <nav>
            <a href="/" className="cta-button secondary" style={{ fontSize: "0.9rem", padding: "0.5rem 1rem", border: "1px solid var(--accent-cyan)", color: "var(--accent-cyan)" }}>
              ← Return Home
            </a>
          </nav>
        </div>
      </header>

      {/* TONG SOLUTIONS TELEMETRY BAR */}
      <div style={{ background: "rgba(8, 10, 15, 0.95)", borderBottom: "1px solid rgba(0, 240, 255, 0.25)", padding: "0.35rem 1rem", fontSize: "0.75rem", fontFamily: "var(--font-headings)", letterSpacing: "0.1em", color: "var(--accent-cyan)", textAlign: "center", textTransform: "uppercase" }}>
        <span>⚙️ TONG SOLUTIONS CONTROL CENTER • ADMIN ACCESS GRANTED</span>
      </div>

      <main className="container" style={{ paddingBlock: "var(--space-lg)" }}>
        {/* Page title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span className="tong-badge tong-badge-cyan" style={{ marginBottom: "0.5rem" }}>
              <span>🔐 TONG SECURED DASHBOARD</span>
            </span>
            <h1 className="tong-text-gradient" style={{ fontSize: "2.2rem" }}>Submissions Dashboard</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Review and manage incoming project ideas from engineering students.</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {totalSubmissions === 0 && (
              <button onClick={seedMockData} className="cta-button primary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", background: "linear-gradient(135deg, #DC2626, #F59E0B)" }}>
                🌱 Seed Mock Data
              </button>
            )}
            {totalSubmissions > 0 && (
              <>
                <button onClick={exportToCSV} className="cta-button secondary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", border: "1px solid var(--accent-cyan)", color: "var(--accent-cyan)" }}>
                  📥 Export CSV
                </button>
                <button onClick={clearAllData} className="cta-button secondary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", border: "1px solid #DC2626", color: "#EF4444" }}>
                  🗑️ Clear All
                </button>
              </>
            )}
          </div>
        </div>

        {/* METRICS CARDS */}
        <section className="admin-stats-grid" style={{ marginBottom: "var(--space-lg)" }}>
          <div className="hud-card stat-card">
            <div className="hud-corner hud-corner-tl" />
            <div className="hud-corner hud-corner-tr" />
            <div className="hud-corner hud-corner-bl" />
            <div className="hud-corner hud-corner-br" />
            <div className="stat-num" style={{ color: "var(--accent-cyan)" }}>{totalSubmissions}</div>
            <div className="stat-label">Total Submissions</div>
          </div>
          <div className="hud-card stat-card">
            <div className="hud-corner hud-corner-tl" />
            <div className="hud-corner hud-corner-tr" />
            <div className="hud-corner hud-corner-bl" />
            <div className="hud-corner hud-corner-br" />
            <div className="stat-num" style={{ color: "var(--accent-gold-light)" }}>৳{avgBudget.toLocaleString()}</div>
            <div className="stat-label">Average Project Budget</div>
          </div>
          <div className="hud-card stat-card">
            <div className="hud-corner hud-corner-tl" />
            <div className="hud-corner hud-corner-tr" />
            <div className="hud-corner hud-corner-bl" />
            <div className="hud-corner hud-corner-br" />
            <div className="stat-num" style={{ color: "var(--accent-primary)", fontSize: "1.75rem", lineHeight: "1.4", height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {Object.keys(categoryCounts).length > 0 
                ? getCategoryLabel(Object.entries(categoryCounts).sort((a,b) => b[1] - a[1])[0][0])
                : "None"
              }
            </div>
            <div className="stat-label">Top Category</div>
          </div>
        </section>

        {/* CONTROLS (SEARCH & FILTERS) */}
        <section className="glass-panel" style={{ padding: "var(--space-md)", marginBottom: "var(--space-md)" }}>
          <div style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap", alignItems: "center" }}>
            {/* Search Input */}
            <div style={{ flex: "1 1 250px" }}>
              <input
                type="text"
                placeholder="Search by student name, university, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ background: "rgba(0,0,0,0.2)" }}
              />
            </div>
            
            {/* Category Filter */}
            <div style={{ width: "180px", minWidth: "150px" }}>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="form-control"
                style={{ background: "rgba(0,0,0,0.2)" }}
              >
                <option value="all">All Domains</option>
                <option value="web">Web Apps</option>
                <option value="mobile">Mobile Apps</option>
                <option value="ai-ml">AI &amp; ML</option>
                <option value="iot">IoT &amp; Embedded</option>
              </select>
            </div>

            {/* Status Filter */}
            <div style={{ width: "180px", minWidth: "150px" }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-control"
                style={{ background: "rgba(0,0,0,0.2)" }}
              >
                <option value="all">All Statuses</option>
                <option value="Pending Review">Pending Review</option>
                <option value="In Consultation">In Consultation</option>
                <option value="Accepted">Accepted</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>
        </section>

        {/* PROPOSALS TABLE */}
        <section className="glass-panel" style={{ overflowX: "auto" }}>
          {filteredProposals.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "1.2rem", marginBottom: "var(--space-sm)" }}>No submissions found</p>
              <p style={{ fontSize: "0.9rem" }}>Try adjusting your search query or filter settings.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student Name</th>
                  <th>University</th>
                  <th>Project Title</th>
                  <th>Budget (৳)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProposals.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontSize: "0.85rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {new Date(p.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </td>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>{p.university}</td>
                    <td className="table-truncate-cell" title={p.title}>{p.title}</td>
                    <td style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>৳{p.budget.toLocaleString()}</td>
                    <td>
                      <span 
                        className="admin-badge" 
                        style={{ 
                          borderColor: getStatusColor(p.status), 
                          color: getStatusColor(p.status),
                          background: `${getStatusColor(p.status)}12`
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button 
                          onClick={() => openModal(p)} 
                          className="cta-button primary" 
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem", borderRadius: "4px" }}
                        >
                          Details
                        </button>
                        <button 
                          onClick={() => deleteProposal(p.id)} 
                          className="cta-button secondary" 
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem", borderRadius: "4px", border: "1px solid #ff6b6b", color: "#ff6b6b" }}
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
        aria-labelledby="dialog-title"
        style={{ maxWidth: "600px" }}
      >
        {selectedProposal && (
          <>
            <div className="form-header">
              <h2 id="dialog-title">Submission Details</h2>
              <button
                type="button"
                className="close-dialog-btn"
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            
            <div className="form-body" style={{ padding: "var(--space-md)" }}>
              {/* Top details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
                <div>
                  <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)" }}>Student</span>
                  <strong style={{ fontSize: "1.1rem" }}>{selectedProposal.name}</strong>
                  <span style={{ display: "block", fontSize: "0.9rem", color: "var(--text-muted)" }}>{selectedProposal.email}</span>
                  {selectedProposal.phone && (
                    <span style={{ display: "block", fontSize: "0.85rem", color: "var(--accent-cyan)", marginTop: "0.2rem" }}>
                      📞 {selectedProposal.phone}
                    </span>
                  )}
                </div>
                <div>
                  <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)" }}>University</span>
                  <strong style={{ fontSize: "1.1rem" }}>{selectedProposal.university}</strong>
                </div>
              </div>

              <hr style={{ border: "0", borderTop: "1px solid var(--glass-border)", marginBlock: "var(--space-sm)" }} />

              {/* Project title */}
              <div style={{ marginBottom: "var(--space-md)", marginTop: "var(--space-sm)" }}>
                <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)" }}>Project Title</span>
                <strong style={{ fontSize: "1.2rem", color: "var(--text-main)" }}>{selectedProposal.title}</strong>
              </div>

              {/* Category, timeline, budget */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
                <div>
                  <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)" }}>Domain</span>
                  <span className="admin-badge" style={{ marginTop: "0.25rem", color: "var(--text-main)", borderColor: "var(--glass-border)" }}>
                    {getCategoryLabel(selectedProposal.category)}
                  </span>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)" }}>Timeline</span>
                  <span className="admin-badge" style={{ marginTop: "0.25rem", color: "var(--text-main)", borderColor: "var(--glass-border)" }}>
                    {selectedProposal.timeline.replace("-", " ")}
                  </span>
                </div>
                <div>
                  <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)" }}>Estimated Budget</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent-cyan)", display: "block", marginTop: "0.25rem" }}>
                    ৳{selectedProposal.budget.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Requirements */}
              <div style={{ marginBottom: "var(--space-md)" }}>
                <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>Requirements Description</span>
                <div style={{ background: "rgba(0,0,0,0.3)", padding: "var(--space-sm)", borderRadius: "8px", fontSize: "0.95rem", color: "var(--text-main)", whiteSpace: "pre-wrap", border: "1px solid var(--glass-border)", maxHeight: "150px", overflowY: "auto" }}>
                  {selectedProposal.requirements}
                </div>
              </div>

              {/* Date */}
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "var(--space-md)" }}>
                Submitted on: {new Date(selectedProposal.timestamp).toLocaleString()}
              </div>

              <hr style={{ border: "0", borderTop: "1px solid var(--glass-border)", marginBlock: "var(--space-sm)" }} />

              {/* Status Update Actions */}
              <div style={{ marginTop: "var(--space-sm)" }}>
                <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Change Status</span>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {["Pending Review", "In Consultation", "Accepted", "Archived"].map((st) => (
                    <button
                      key={st}
                      onClick={() => updateProposalStatus(selectedProposal.id, st)}
                      className={`cta-button ${selectedProposal.status === st ? "primary" : "secondary"}`}
                      style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", borderRadius: "6px" }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-footer" style={{ padding: "var(--space-sm) var(--space-md)", justifyContent: "space-between" }}>
              <button
                type="button"
                className="cta-button secondary"
                onClick={() => deleteProposal(selectedProposal.id)}
                style={{ border: "1px solid #ff6b6b", color: "#ff6b6b" }}
              >
                Delete Proposal
              </button>
              <button
                type="button"
                className="cta-button secondary"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
