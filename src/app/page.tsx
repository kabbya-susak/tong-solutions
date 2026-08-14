"use client";

import { useState, useRef, useEffect } from "react";

const PROTOTYPES = [
  {
    id: "medai",
    title: "MedScan AI — Radiographic Chest X-Ray Diagnostic Portal",
    category: "ai-ml",
    categoryLabel: "AI & Machine Learning",
    badge: "HEALTHCARE AI",
    badgeColor: "var(--accent-cyan)",
    image: "/prototypes/medai.png",
    description: "Deep learning ResNet50 model with Grad-CAM heatmap visualization for automated thoracic anomaly detection. Complete with FastAPI backend & Next.js client dashboard.",
    techStack: ["PyTorch", "Next.js 15", "FastAPI", "TailwindCSS", "Grad-CAM"],
    deliverables: ["Full Source Code", "45-Page IEEE Book", "Viva Defense Deck", "Dataset Scripts"],
    metrics: { "Model Accuracy": "96.4%", "Inference Speed": "140ms", "Dataset": "NIH ChestX-ray14" },
    codeSnippet: [
      "// PyTorch ResNet50 Classifier Pipeline",
      "// Dependencies: torch, torchvision.models, torch.nn",
      "",
      "class MedScanResNet(nn.Module):",
      "    def __init__(self, num_classes=14):",
      "        super(MedScanResNet, self).__init__()",
      "        self.backbone = models.resnet50(pretrained=True)",
      "        in_features = self.backbone.fc.in_features",
      "        self.backbone.fc = nn.Sequential(",
      "            nn.Linear(in_features, 512),",
      "            nn.ReLU(),",
      "            nn.Dropout(0.3),",
      "            nn.Linear(512, num_classes),",
      "            nn.Sigmoid()",
      "        )",
      "",
      "    def forward(self, x):",
      "        return self.backbone(x)"
    ].join("\n"),
    architecture: "Multi-stage pipeline: Frontend Next.js client submits DICOM/PNG scans to FastAPI. ResNet50 processes 224x224 tensors and computes Grad-CAM activations overlay on thoracic regions with >96% accuracy."
  },
  {
    id: "iot-agri",
    title: "AgroIntelligent — Telemetry & Automated Irrigation System",
    category: "iot",
    categoryLabel: "IoT & Embedded Systems",
    badge: "SMART AGRI IOT",
    badgeColor: "#10B981",
    image: "/prototypes/iot-agri.png",
    description: "Multi-node ESP32 soil moisture & climate monitoring with automatic solenoid valve triggering, real-time MQTT telemetry dashboard, and weather prediction API integration.",
    techStack: ["ESP32 / Arduino", "MQTT", "Node.js", "React / Next.js", "Chart.js"],
    deliverables: ["Firmware (.ino)", "Circuit Schematic", "Web Dashboard Code", "IEEE Report"],
    metrics: { "Active Sensor Nodes": "8 Nodes", "System Uptime": "99.9%", "Protocol": "MQTT / WebSockets" },
    codeSnippet: [
      "// ESP32 Telemetry & Relay Irrigation Loop",
      "// Header Includes: WiFi.h, PubSubClient.h",
      "",
      "const char* mqtt_server = \"broker.hivemq.com\";",
      "WiFiClient espClient;",
      "PubSubClient client(espClient);",
      "",
      "void setup() {",
      "  pinMode(SOIL_PIN, INPUT);",
      "  pinMode(RELAY_VALVE, OUTPUT);",
      "  WiFi.begin(SSID, PASSWORD);",
      "  client.setServer(mqtt_server, 1883);",
      "}",
      "",
      "void loop() {",
      "  int moisture = analogRead(SOIL_PIN);",
      "  float pct = map(moisture, 4095, 0, 0, 100);",
      "  if (pct < 35.0) digitalWrite(RELAY_VALVE, HIGH);",
      "  char payload[32];",
      "  snprintf(payload, sizeof(payload), \"{\\\"moisture\\\": %.1f}\", pct);",
      "  client.publish(\"agro/telemetry/zone1\", payload);",
      "  delay(2000);",
      "}"
    ].join("\n"),
    architecture: "ESP32 nodes measure soil moisture and humidity, broadcasting JSON telemetry over MQTT to a Node.js broker. Next.js dashboard visualizes real-time gauge metrics and sends manual override signals to relay valves."
  },
  {
    id: "fintech-ai",
    title: "Synetic Fraud AI — Financial Anomaly & Threat Detection",
    category: "web",
    categoryLabel: "Web Applications",
    badge: "FINTECH & CYBER",
    badgeColor: "var(--accent-primary)",
    image: "/prototypes/fintech-ai.png",
    description: "Real-time transaction fraud scoring platform built with Isolation Forest & XGBoost machine learning pipelines and interactive threat geolocation maps.",
    techStack: ["Python Scikit-Learn", "FastAPI", "React", "PostgreSQL", "Recharts"],
    deliverables: ["Full Web App Code", "ML Model Files", "Architecture Diagram", "Slide Deck"],
    metrics: { "F1-Score": "0.94", "Throughput": "5,000 TPS", "Risk Layers": "4 Security Checks" },
    codeSnippet: [
      "# Scikit-Learn Isolation Forest Threat Evaluator",
      "# Model: IsolationForest(n_estimators=100, contamination=0.02)",
      "",
      "def detect_fraud_anomaly(transaction_features):",
      "    clf = IsolationForest(n_estimators=100, contamination=0.02, random_state=42)",
      "    clf.fit(X_train_historical)",
      "    anomaly_score = clf.decision_function(transaction_features)",
      "    is_fraud = clf.predict(transaction_features) == -1",
      "    return {",
      "        \"is_flagged\": bool(is_fraud[0]),",
      "        \"anomaly_score\": float(anomaly_score[0])",
      "    }"
    ].join("\n"),
    architecture: "FastAPI ingests streaming banking transactions. XGBoost & Isolation Forest evaluate velocity and geolocation deviations in real-time, pushing flagged transactions to PostgreSQL and WebSocket dashboard."
  },
  {
    id: "lms-edu",
    title: "U.Alma Academic Portal — AI Thesis Reviewer & Plagiarism Shield",
    category: "web",
    categoryLabel: "Web Applications",
    badge: "EDTECH PLATFORM",
    badgeColor: "var(--accent-gold-light)",
    image: "/prototypes/lms-edu.png",
    description: "University LMS with automated assignment submission, AST-based source code similarity analysis, PDF thesis structure reviewer, and Dean's list badge tracking.",
    techStack: ["Next.js 15", "TypeScript", "Node.js", "Prisma ORM", "Docker"],
    deliverables: ["Complete Monorepo", "Docker Compose Setup", "40+ Page Book", "Viva Q&A Prep"],
    metrics: { "Modules": "LMS + Plagiarism", "Similarity Engine": "AST Matching", "Access Control": "RBAC Roles" },
    codeSnippet: [
      "// AST Token Fingerprinting Engine",
      "// Utilities: @babel/parser, @babel/traverse",
      "",
      "function generateASTFingerprint(sourceCode: string): string[] {",
      "  const ast = parser.parse(sourceCode, { sourceType: \"module\", plugins: [\"typescript\"] });",
      "  const tokens: string[] = [];",
      "  traverse(ast, {",
      "    enter(path: any) {",
      "      tokens.push(path.node.type);",
      "    }",
      "  });",
      "  return tokens;",
      "}"
    ].join("\n"),
    architecture: "Full-stack Next.js App Router with Prisma ORM and PostgreSQL. Assignment submissions run through AST tokenization microservices to detect obfuscated plagiarism across student repositories."
  },
  {
    id: "blockchain-supply",
    title: "ChainGuard — Blockchain Transparent Supply Chain & Verifier",
    category: "web",
    categoryLabel: "Web Applications",
    badge: "BLOCKCHAIN & WEB3",
    badgeColor: "#8B5CF6",
    image: "/prototypes/blockchain-supply.png",
    description: "Ethereum smart contract NFC/QR verified supply chain provenance tracking system with tamper-evident audit logs and interactive provenance timeline dashboard.",
    techStack: ["Solidity", "Ethers.js", "Next.js 15", "Hardhat", "IPFS"],
    deliverables: ["Smart Contracts", "Web App Source Code", "IEEE Paper & Book", "Testnet Deploy Script"],
    metrics: { "Gas Efficiency": "Low (ERC-721A)", "Verification": "< 500ms", "Audit Score": "100% Security" },
    codeSnippet: [
      "// Solidity Supply Chain Item Lifecycle Smart Contract",
      "// Standards: ERC-721A, OpenZeppelin Ownable",
      "",
      "contract ChainGuardProvenance {",
      "    struct ItemState {",
      "        string ipfsHash;",
      "        address currentHolder;",
      "        uint256 timestamp;",
      "        bool isVerified;",
      "    }",
      "",
      "    mapping(uint256 => ItemState[]) public itemHistory;",
      "",
      "    function recordCheckpoint(uint256 tokenId, string memory hash) public {",
      "        itemHistory[tokenId].push(ItemState(hash, msg.sender, block.timestamp, true));",
      "    }",
      "}"
    ].join("\n"),
    architecture: "Next.js Web3 client interacts with deployed Solidity smart contracts on Polygon/Sepolia testnet via Ethers.js. IPFS decentralized storage preserves immutable product certificates and batch telemetry."
  },
  {
    id: "robotics-drone",
    title: "AeroVision — Autonomous Drone & Edge AI Target Tracking",
    category: "iot",
    categoryLabel: "IoT & Embedded Systems",
    badge: "ROBOTICS & EDGE AI",
    badgeColor: "#EF4444",
    image: "/prototypes/robotics-drone.png",
    description: "NVIDIA Jetson Nano edge AI companion computer with YOLOv8 real-time object tracking, MAVLink flight controller integration, and live thermal telemetry camera stream.",
    techStack: ["Python OpenCV", "YOLOv8 Edge", "NVIDIA Jetson", "ROS2 / MAVLink", "Flask HD Stream"],
    deliverables: ["Python Edge Code", "ROS2 Nodes Setup", "Hardware Assembly Guide", "45-Page Book"],
    metrics: { "FPS on Jetson": "38 FPS", "Latency": "45ms", "Target Recall": "97.8%" },
    codeSnippet: [
      "// Edge AI YOLOv8 MAVLink Target Lock Loop",
      "// Hardware: NVIDIA Jetson Nano + Pixhawk Flight Controller",
      "",
      "def drone_vision_tracking_loop():",
      "    model = YOLO(\"yolov8n_edge.engine\")",
      "    mav = mavutil.mavlink_connection(\"/dev/ttyTHS1\", baud=57600)",
      "    while True:",
      "        frame = cap.read()",
      "        results = model.predict(frame, conf=0.6)",
      "        for r in results:",
      "            dx, dy = calculate_target_offset(r.boxes)",
      "            mav.send_guided_velocity_cmd(dx, dy, 0.0)"
    ].join("\n"),
    architecture: "Onboard NVIDIA Jetson processes 1080p camera frames at 38 FPS with YOLOv8. Bounding box coordinates compute MAVLink velocity vectors sent over UART to Pixhawk flight controller for autonomous target tracking."
  }
];

// Interactive HTML5 Canvas Particle Laser Network
function ArcReactorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Particle pool with Iron Man color palette
    const particleCount = 55;
    const colors = ["#00F0FF", "#DC2626", "#F59E0B", "#38BDF8"];
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      radius: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p1.color;
        ctx.fill();

        // Mouse laser attraction
        const dxMouse = mouse.x - p1.x;
        const dyMouse = mouse.y - p1.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 160) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = p1.color;
          ctx.lineWidth = 1 - distMouse / 160;
          ctx.stroke();
        }

        // Particle connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.25 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.65,
      }}
    />
  );
}

// STARK Arc Reactor Core Interactive Widget
function ArcReactorWidget() {
  const [isOverclocked, setIsOverclocked] = useState(false);
  const [outputPower, setOutputPower] = useState(3.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setOutputPower((prev) => parseFloat((3.2 + Math.random() * 0.4).toFixed(2)));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="arc-reactor-container"
      onClick={() => setIsOverclocked(!isOverclocked)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBlock: "var(--space-md)",
        cursor: "pointer",
        userSelect: "none",
      }}
      title="Click to toggle Tong Core Turbo Mode!"
    >
      <div
        style={{
          position: "relative",
          width: "170px",
          height: "170px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Outer Rotating Segment Ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `3px dashed ${isOverclocked ? "#DC2626" : "#00F0FF"}`,
            boxShadow: isOverclocked
              ? "0 0 25px rgba(220,38,38,0.8)"
              : "0 0 25px rgba(0,240,255,0.6)",
            animation: `reactor-spin ${isOverclocked ? "4s" : "12s"} linear infinite`,
            transition: "all 0.5s ease",
          }}
        />

        {/* Inner Counter-Rotating Golden Ring */}
        <div
          style={{
            position: "absolute",
            inset: "15px",
            borderRadius: "50%",
            border: `2px solid ${isOverclocked ? "#F59E0B" : "rgba(0, 240, 255, 0.8)"}`,
            boxShadow: "0 0 15px rgba(245, 158, 11, 0.5)",
            animation: `reactor-spin-reverse ${isOverclocked ? "3s" : "8s"} linear infinite`,
            transition: "all 0.5s ease",
          }}
        />

        {/* Glowing Center Power Core */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: isOverclocked
              ? "radial-gradient(circle, #F59E0B 0%, #DC2626 70%, #000 100%)"
              : "radial-gradient(circle, #00F0FF 0%, #0284C7 70%, #080A0F 100%)",
            boxShadow: isOverclocked
              ? "0 0 35px #F59E0B, 0 0 60px #DC2626"
              : "0 0 35px #00F0FF, 0 0 60px rgba(0,240,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.5s ease",
            animation: "arc-pulse 2s ease-in-out infinite",
          }}
        >
          {/* Central Core Emblem */}
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "2px solid #FFF",
              background: "#080A0F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
            }}
          >
            ⚙️
          </div>
        </div>
      </div>

      {/* Dynamic Telemetry Status */}
      <div
        style={{
          marginTop: "0.85rem",
          padding: "0.35rem 1.1rem",
          background: "rgba(8, 10, 15, 0.85)",
          border: `1px solid ${isOverclocked ? "#DC2626" : "rgba(0, 240, 255, 0.3)"}`,
          borderRadius: "20px",
          boxShadow: isOverclocked
            ? "0 0 15px rgba(220, 38, 38, 0.4)"
            : "0 0 15px rgba(0, 240, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: isOverclocked ? "#F59E0B" : "var(--accent-cyan)",
            boxShadow: isOverclocked ? "0 0 8px #F59E0B" : "0 0 8px var(--accent-cyan)",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-headings)",
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: isOverclocked ? "#F59E0B" : "var(--accent-cyan)",
          }}
        >
          TONG CORE OUTPUT: {outputPower} GW {isOverclocked ? "• TURBO BOOST MAX" : "• HIGH STABILITY"}
        </span>
      </div>
    </div>
  );
}

// Interactive "Why Tong Solutions" Showcase Component
function WhyTongSolutionsSection({ onOpenModal }: { onOpenModal: () => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const [packageChecklist, setPackageChecklist] = useState({
    codeTested: true,
    reportDrafted: true,
    slidesReady: true,
  });

  const pillars = [
    {
      id: "working-code",
      title: "Working Project Prototype",
      icon: "⚡",
      color: "var(--accent-cyan)",
      badge: "PROTOTYPE CODE",
      headline: "Fully Working Software & System Architecture",
      description: "Complete working project source code built with clean architecture, ready-to-run setup scripts, and detailed installation guides for your machine.",
      metrics: [
        { label: "Source Code", val: "100% Working" },
        { label: "Tech Stack", val: "Next.js / Python / IoT" },
        { label: "Base Package", val: "৳10,000" },
      ],
    },
    {
      id: "project-book",
      title: "Project Book & IEEE Report",
      icon: "📘",
      color: "var(--accent-gold-light)",
      badge: "DOCUMENTATION",
      headline: "Publication-Grade Project Book & Diagrams",
      description: "Get a comprehensive 40+ page IEEE format report book complete with System Architecture schematics, ER Diagrams, UML Dataflows, and Literature Surveys.",
      metrics: [
        { label: "Report Book", val: "40+ Pages" },
        { label: "Format Standard", val: "IEEE / University" },
        { label: "Package Option", val: "৳15,000 Complete" },
      ],
    },
    {
      id: "presentation-slides",
      title: "Presentation Slide Deck",
      icon: "📊",
      color: "var(--accent-primary)",
      badge: "DEFENSE SLIDES",
      headline: "Professional Presentation Slide Decks",
      description: "Customized, high-impact presentation slide deck highlighting your project architecture, features, database models, and live demonstration workflow.",
      metrics: [
        { label: "Slide Deck", val: "Full Defense Deck" },
        { label: "Visual Quality", val: "HD Diagrams" },
        { label: "Full Bundle", val: "৳20,000 Bundle" },
      ],
    },
    {
      id: "direct-support",
      title: "Zero Plagiarism & Direct Support",
      icon: "🛡️",
      color: "#10B981",
      badge: "TURNITIN VERIFIED",
      headline: "100% Original Content & Developer Assistance",
      description: "Turnitin-verified original code implementation with direct access to developer assistance for environment setup and project modifications.",
      metrics: [
        { label: "Plagiarism", val: "0% Verified" },
        { label: "Developer Support", val: "Fast & Direct" },
        { label: "Revisions", val: "Included" },
      ],
    },
  ];

  const currentPillar = pillars[activeTab];
  const checkedCount = Object.values(packageChecklist).filter(Boolean).length;
  const packageReadiness = checkedCount === 3 ? 100 : checkedCount === 2 ? 67 : checkedCount === 1 ? 33 : 0;

  return (
    <section id="why-tong" className="categories-section scanline-bg" style={{ position: "relative" }}>
      <div className="container">
        <header className="section-header">
          <span className="tong-badge tong-badge-cyan" style={{ marginBottom: "var(--space-xs)" }}>
            <span>⚡ THE TONG ADVANTAGE</span>
          </span>
          <h2 className="section-title tong-text-gradient">
            Why Engineering Students Choose Tong Solutions
          </h2>
          <p className="section-subtitle">
            We deliver working project source code, publication-grade project books, and professional presentation slide decks.
          </p>
        </header>

        {/* Tab Navigation */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
            marginBottom: "var(--space-lg)",
          }}
        >
          {pillars.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className="hud-card"
              style={{
                padding: "1.1rem 1.25rem",
                textAlign: "left",
                background: activeTab === idx ? "rgba(13, 17, 23, 0.95)" : "rgba(13, 17, 23, 0.5)",
                border: activeTab === idx ? `1px solid ${p.color}` : "1px solid var(--glass-border)",
                boxShadow: activeTab === idx ? `0 0 20px ${p.color}40` : "none",
                cursor: "pointer",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>{p.icon}</span>
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: activeTab === idx ? p.color : "var(--text-main)" }}>
                  {p.title}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  Tap to inspect
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Interactive Showcase Container */}
        <div
          className="hud-card"
          style={{
            padding: "var(--space-lg)",
            border: `1px solid ${currentPillar.color}`,
            boxShadow: `0 0 30px ${currentPillar.color}25`,
            position: "relative",
            marginBottom: "var(--space-lg)",
          }}
        >
          <div className="hud-corner hud-corner-tl" style={{ borderColor: currentPillar.color }} />
          <div className="hud-corner hud-corner-tr" style={{ borderColor: currentPillar.color }} />
          <div className="hud-corner hud-corner-bl" style={{ borderColor: currentPillar.color }} />
          <div className="hud-corner hud-corner-br" style={{ borderColor: currentPillar.color }} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--space-lg)", alignItems: "center" }}>
            <div>
              <span className="tong-badge" style={{ background: `${currentPillar.color}20`, borderColor: currentPillar.color, color: currentPillar.color, marginBottom: "0.75rem" }}>
                <span>{currentPillar.badge}</span>
              </span>
              <h3 style={{ fontSize: "1.6rem", color: "var(--text-main)", marginBottom: "0.75rem" }}>
                {currentPillar.headline}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: "1.6", marginBottom: "var(--space-md)" }}>
                {currentPillar.description}
              </p>

              {/* Metrics Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "var(--space-md)" }}>
                {currentPillar.metrics.map((m, i) => (
                  <div key={i} style={{ background: "rgba(0,0,0,0.3)", padding: "0.75rem", borderRadius: "6px", border: "1px solid var(--glass-border)" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: currentPillar.color }}>{m.val}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{m.label}</div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="cta-button primary"
                onClick={onOpenModal}
                style={{ background: `linear-gradient(135deg, ${currentPillar.color}, var(--accent-primary))`, boxShadow: `0 0 15px ${currentPillar.color}60` }}
              >
                Get Started with Tong Solutions
              </button>
            </div>

            {/* Interactive Package Completion Checklist Card */}
            <div
              style={{
                background: "rgba(8, 10, 15, 0.9)",
                border: "1px solid var(--glass-border)",
                borderRadius: "12px",
                padding: "var(--space-md)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent-cyan)", letterSpacing: "0.08em" }}>
                  ⚙️ PACKAGE DELIVERABLES CALCULATOR
                </span>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: packageReadiness === 100 ? "#10B981" : "var(--accent-gold-light)" }}>
                  {packageReadiness}% {packageReadiness === 100 ? "(FULL BUNDLE)" : "CONFIGURED"}
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ height: "10px", background: "rgba(255,255,255,0.1)", borderRadius: "5px", overflow: "hidden", marginBottom: "1.5rem" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${packageReadiness}%`,
                    background: "linear-gradient(90deg, var(--accent-cyan), #10B981)",
                    boxShadow: "0 0 12px var(--accent-cyan)",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>

              {/* Interactive Checklist Toggles */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  { key: "codeTested", label: "Working Project Source Code (৳10,000)" },
                  { key: "reportDrafted", label: "40+ Page Project Book / Report (৳15,000 Package)" },
                  { key: "slidesReady", label: "Custom Presentation Slide Deck (৳20,000 Bundle)" },
                ].map((item) => (
                  <label
                    key={item.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.6rem 0.85rem",
                      background: "rgba(0,0,0,0.25)",
                      borderRadius: "6px",
                      cursor: "pointer",
                      border: "1px solid var(--glass-border)",
                      fontSize: "0.85rem",
                      color: "var(--text-main)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={packageChecklist[item.key as keyof typeof packageChecklist]}
                      onChange={(e) =>
                        setPackageChecklist((prev) => ({
                          ...prev,
                          [item.key]: e.target.checked,
                        }))
                      }
                      style={{ accentColor: "var(--accent-cyan)", width: "16px", height: "16px" }}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Interactive Project Prototypes & Web Templates Showcase Component
function PrototypesShowcaseSection({
  onOpenModal,
}: {
  onOpenModal: (packageName?: string, prototypeTitle?: string, categoryVal?: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeDemoItem, setActiveDemoItem] = useState<typeof PROTOTYPES[0] | null>(null);
  const [demoTab, setDemoTab] = useState<"overview" | "architecture" | "code">("overview");

  const demoDialogRef = useRef<HTMLDialogElement>(null);

  const filteredPrototypes = activeCategory === "all"
    ? PROTOTYPES
    : PROTOTYPES.filter((p) => p.category === activeCategory);

  const openDemoModal = (item: typeof PROTOTYPES[0]) => {
    setActiveDemoItem(item);
    setDemoTab("overview");
    demoDialogRef.current?.showModal();
  };

  const closeDemoModal = () => {
    demoDialogRef.current?.close();
  };

  return (
    <section id="prototypes" className="categories-section scanline-bg" style={{ position: "relative", borderTop: "1px solid var(--glass-border)" }}>
      <div className="container">
        <header className="section-header">
          <span className="tong-badge tong-badge-cyan" style={{ marginBottom: "var(--space-xs)" }}>
            <span>⚡ LIVE PROTOTYPES &amp; TEMPLATE VAULT</span>
          </span>
          <h2 className="section-title tong-text-gradient">
            Explore Project Prototypes &amp; Web Templates
          </h2>
          <p className="section-subtitle">
            Browse real-world software prototypes, system architecture blueprints, and IEEE report templates built for engineering students.
          </p>
        </header>

        {/* Category Filter Tabs */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "var(--space-lg)" }}>
          {[
            { id: "all", label: "All Prototypes" },
            { id: "web", label: "Web Applications" },
            { id: "ai-ml", label: "AI & Machine Learning" },
            { id: "iot", label: "IoT & Embedded Systems" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: "0.55rem 1.25rem",
                borderRadius: "20px",
                border: activeCategory === cat.id ? "1px solid var(--accent-cyan)" : "1px solid var(--glass-border)",
                background: activeCategory === cat.id ? "rgba(0, 240, 255, 0.15)" : "rgba(13, 17, 23, 0.6)",
                color: activeCategory === cat.id ? "var(--accent-cyan)" : "var(--text-main)",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: activeCategory === cat.id ? "0 0 15px rgba(0, 240, 255, 0.3)" : "none",
                transition: "all 0.3s ease",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Prototypes Grid */}
        <div className="prototypes-grid">
          {filteredPrototypes.map((item) => (
            <article key={item.id} className="hud-card prototype-card">
              <div className="hud-corner hud-corner-tl" style={{ borderColor: item.badgeColor }} />
              <div className="hud-corner hud-corner-tr" style={{ borderColor: item.badgeColor }} />
              <div className="hud-corner hud-corner-bl" style={{ borderColor: item.badgeColor }} />
              <div className="hud-corner hud-corner-br" style={{ borderColor: item.badgeColor }} />

              {/* Preview Image Container */}
              <div className="prototype-img-container">
                <img src={item.image} alt={item.title} className="prototype-img" />
                <span
                  className="tong-badge prototype-overlay-badge"
                  style={{ background: `${item.badgeColor}25`, borderColor: item.badgeColor, color: item.badgeColor }}
                >
                  <span>{item.badge}</span>
                </span>
              </div>

              {/* Card Body */}
              <div className="prototype-body">
                <h3 style={{ fontSize: "1.2rem", color: "var(--text-main)", marginBottom: "0.5rem", lineHeight: 1.3 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "0.75rem", lineHeight: 1.5 }}>
                  {item.description}
                </p>

                {/* Tech Stack Pills */}
                <div className="tech-tag-list">
                  {item.techStack.map((tech) => (
                    <span key={tech} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Deliverable Checklist */}
                <div style={{ marginTop: "0.5rem", marginBottom: "1rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  <div style={{ fontWeight: 700, color: "var(--accent-gold-light)", marginBottom: "0.3rem" }}>
                    🎁 Package Includes:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                    {item.deliverables.map((d) => (
                      <span key={d} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                        <span style={{ color: "#10B981" }}>✓</span> {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="prototype-actions">
                  <button
                    type="button"
                    className="cta-button secondary"
                    style={{ flex: 1, padding: "0.55rem 0.75rem", fontSize: "0.82rem" }}
                    onClick={() => openDemoModal(item)}
                  >
                    👁️ Live Preview
                  </button>
                  <button
                    type="button"
                    className="cta-button primary"
                    style={{ flex: 1, padding: "0.55rem 0.75rem", fontSize: "0.82rem", background: `linear-gradient(135deg, ${item.badgeColor}, var(--accent-primary))` }}
                    onClick={() => onOpenModal("Complete Solution", item.title, item.category)}
                  >
                    ⚡ Request Project
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Interactive Prototype Live Demo Modal */}
      <dialog ref={demoDialogRef} id="prototype-demo-dialog" aria-labelledby="demo-dialog-title">
        {activeDemoItem && (
          <div style={{ padding: "var(--space-md)" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.75rem" }}>
              <div>
                <span className="tong-badge" style={{ background: `${activeDemoItem.badgeColor}20`, borderColor: activeDemoItem.badgeColor, color: activeDemoItem.badgeColor, marginBottom: "0.4rem" }}>
                  <span>{activeDemoItem.badge}</span>
                </span>
                <h2 id="demo-dialog-title" style={{ fontSize: "1.4rem", color: "var(--text-main)", marginTop: "0.3rem" }}>
                  {activeDemoItem.title}
                </h2>
              </div>
              <button
                type="button"
                className="close-dialog-btn"
                onClick={closeDemoModal}
                style={{ fontSize: "1.5rem", cursor: "pointer", background: "none", border: "none", color: "var(--text-muted)" }}
              >
                ×
              </button>
            </div>

            {/* Modal Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", borderBottom: "1px solid var(--glass-border)", paddingBottom: "0.5rem" }}>
              {[
                { id: "overview", label: "📱 Screen Preview & Metrics" },
                { id: "architecture", label: "📐 System Architecture" },
                { id: "code", label: "💻 Code Snippet" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDemoTab(tab.id as typeof demoTab)}
                  style={{
                    padding: "0.4rem 0.9rem",
                    borderRadius: "6px",
                    border: "none",
                    background: demoTab === tab.id ? "rgba(0, 240, 255, 0.15)" : "transparent",
                    color: demoTab === tab.id ? "var(--accent-cyan)" : "var(--text-muted)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview & Metrics */}
            {demoTab === "overview" && (
              <div>
                <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid var(--glass-border)", marginBottom: "1rem" }}>
                  <img src={activeDemoItem.image} alt={activeDemoItem.title} style={{ width: "100%", maxHeight: "380px", objectFit: "cover" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "1rem" }}>
                  {Object.entries(activeDemoItem.metrics).map(([key, val]) => (
                    <div key={key} style={{ background: "rgba(0,0,0,0.4)", padding: "0.75rem", borderRadius: "6px", border: "1px solid var(--glass-border)" }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{key}</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700, color: activeDemoItem.badgeColor, marginTop: "0.2rem" }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Architecture */}
            {demoTab === "architecture" && (
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "1.25rem", borderRadius: "8px", border: "1px solid var(--glass-border)", marginBottom: "1rem" }}>
                <h4 style={{ color: "var(--accent-cyan)", marginBottom: "0.5rem" }}>System Dataflow &amp; Module Design</h4>
                <p style={{ color: "var(--text-main)", lineHeight: 1.6, fontSize: "0.95rem" }}>
                  {activeDemoItem.architecture}
                </p>
                <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--glass-border)", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  <strong>Included Blueprints:</strong> High-Resolution ERD Diagrams, Component Sequence Flowcharts, and Dataflow Diagrams (DFD Level 0-2).
                </div>
              </div>
            )}

            {/* Tab 3: Code Snippet */}
            {demoTab === "code" && (
              <div>
                <pre
                  style={{
                    background: "#080A0F",
                    border: "1px solid var(--glass-border)",
                    padding: "1rem",
                    borderRadius: "8px",
                    overflowX: "auto",
                    fontFamily: "monospace",
                    fontSize: "0.82rem",
                    color: "#00F0FF",
                    lineHeight: 1.5,
                    marginBottom: "1rem",
                  }}
                >
                  <code>{activeDemoItem.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Modal Footer CTA */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: "1px solid var(--glass-border)" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Need a similar custom project for your defense?
              </span>
              <button
                type="button"
                className="cta-button primary"
                onClick={() => {
                  closeDemoModal();
                  onOpenModal("Complete Solution", activeDemoItem.title, activeDemoItem.category);
                }}
                style={{ background: "linear-gradient(135deg, #DC2626, #F59E0B)" }}
              >
                Order This Prototype (৳15,000 Package)
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}

export default function Home() {
  // Testimonial slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesCount = 4;

  // Dialog & Form states
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    university: "",
    category: "",
    title: "",
    timeline: "",
    requirements: "",
    budget: 15000,
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({
    name: "",
    email: "",
    phone: "",
    university: "",
    category: "",
    title: "",
    timeline: "",
    requirements: "",
  });

  // Open modal
  const openModal = (packageName?: string, prototypeTitle?: string, categoryVal?: string) => {
    resetFormState();
    if (packageName || prototypeTitle) {
      setFormData((prev) => ({
        ...prev,
        title: prototypeTitle || prev.title,
        category: categoryVal || prev.category,
        requirements: packageName ? `Selected package: ${packageName}.\n\nRequirements outline:\n` : prev.requirements,
      }));
    }
    dialogRef.current?.showModal();
  };

  // Close modal
  const closeModal = () => {
    dialogRef.current?.close();
  };

  // Handle slide transition
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesCount) % slidesCount);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesCount);
  };

  // Input change handler
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    
    // Clear validation error and invalid class when active typing occurs
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Budget range slider handler
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, budget: parseInt(e.target.value) }));
  };

  // Reset form status
  const resetFormState = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      university: "",
      category: "",
      title: "",
      timeline: "",
      requirements: "",
      budget: 15000,
    });
    setErrors({
      name: "",
      email: "",
      phone: "",
      university: "",
      category: "",
      title: "",
      timeline: "",
      requirements: "",
    });
    setActiveStepIdx(0);
    setIsSubmitting(false);
    setIsSubmitted(false);
  };

  // Field validation logic
  const validateField = (fieldName: string, value: string): boolean => {
    let errorMsg = "";

    if (fieldName === "name") {
      if (!value || value.trim().length < 3) {
        errorMsg = "Please enter your full name (minimum 3 characters).";
      }
    } else if (fieldName === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value || !emailRegex.test(value)) {
        errorMsg = "Please enter a valid email address.";
      }
    } else if (fieldName === "phone") {
      const bdPhoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
      const cleanPhone = (value || "").replace(/[\s-]/g, "");
      if (!value || !bdPhoneRegex.test(cleanPhone)) {
        errorMsg = "Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01712345678).";
      }
    } else if (fieldName === "university") {
      if (!value || value.trim().length < 2) {
        errorMsg = "Please enter your university's name.";
      }
    } else if (fieldName === "category") {
      if (!value) {
        errorMsg = "Please select a project category.";
      }
    } else if (fieldName === "title") {
      if (!value || value.trim().length < 5) {
        errorMsg = "Please supply a descriptive project title (minimum 5 characters).";
      }
    } else if (fieldName === "timeline") {
      if (!value) {
        errorMsg = "Please select a target timeline.";
      }
    } else if (fieldName === "requirements") {
      if (!value || value.trim().length < 20) {
        errorMsg = "Please explain your requirements (minimum 20 characters).";
      }
    }

    setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
    return !errorMsg;
  };

  // Handle blur validation
  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  // Step validation
  const validateStep = (stepIdx: number): boolean => {
    if (stepIdx === 0) {
      const isNameValid = validateField("name", formData.name);
      const isEmailValid = validateField("email", formData.email);
      const isPhoneValid = validateField("phone", formData.phone);
      const isUniValid = validateField("university", formData.university);
      return isNameValid && isEmailValid && isPhoneValid && isUniValid;
    } else if (stepIdx === 1) {
      const isCatValid = validateField("category", formData.category);
      const isTitleValid = validateField("title", formData.title);
      const isTimelineValid = validateField("timeline", formData.timeline);
      return isCatValid && isTitleValid && isTimelineValid;
    } else if (stepIdx === 2) {
      return validateField("requirements", formData.requirements);
    }
    return true;
  };

  // Next step click
  const handleNextStep = () => {
    if (!validateStep(activeStepIdx)) {
      return;
    }

    if (activeStepIdx < 2) {
      setActiveStepIdx((prev) => prev + 1);
    } else {
      submitProposal();
    }
  };

  // Prev step click
  const handlePrevStep = () => {
    if (activeStepIdx > 0) {
      setActiveStepIdx((prev) => prev - 1);
    }
  };

  // Submit proposal to MongoDB database & localStorage fallback
  const submitProposal = async () => {
    setIsSubmitting(true);
    try {
      // POST to MongoDB Atlas via Next.js API Route
      const response = await fetch("/api/project-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!result.success) {
        console.warn("MongoDB API Notice:", result.error);
      }
    } catch (err) {
      console.error("Error posting to MongoDB:", err);
    }

    try {
      const newProposal = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        status: "Pending Review",
        ...formData
      };
      const existing = localStorage.getItem("tong_solutions_proposals");
      const list = existing ? JSON.parse(existing) : [];
      list.push(newProposal);
      localStorage.setItem("tong_solutions_proposals", JSON.stringify(list));
    } catch (err) {
      console.error("Error saving proposal to localStorage:", err);
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  // Escape key handler reset
  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;

    const handleCancel = () => {
      resetFormState();
    };

    dialogElement.addEventListener("cancel", handleCancel);
    return () => {
      dialogElement.removeEventListener("cancel", handleCancel);
    };
  }, []);

  // Spring Physics Scroll Reveal Observer
  useEffect(() => {
    const selector =
      ".category-card, .pricing-card, .timeline-item, .stat-card, .section-header, .testimonial-card, .faq-item";
    const elements = document.querySelectorAll(selector);

    elements.forEach((el, idx) => {
      el.classList.add("spring-reveal");
      const staggerClass = `spring-stagger-${(idx % 4) + 1}`;
      el.classList.add(staggerClass);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      {/* Background Interactive Particle Canvas */}
      <ArcReactorCanvas />

      {/* HEADER */}
      <header className="main-header">
        <div className="container">
          <a href="#" className="logo" aria-label="Tong Solutions Home">
            <img src="/logo-full.png" alt="Tong Solutions" className="logo-image" style={{ filter: "drop-shadow(0 0 10px rgba(0,240,255,0.4))" }} />
          </a>
          <nav aria-label="Main Navigation">
            <ul className="nav-menu">
              <li>
                <a href="#why-tong" className="nav-link" style={{ color: "var(--accent-cyan)", fontWeight: 700 }}>
                  Why Tong
                </a>
              </li>
              <li>
                <a href="#prototypes" className="nav-link" style={{ color: "var(--accent-gold-light)", fontWeight: 700 }}>
                  Prototypes
                </a>
              </li>
              <li>
                <a href="#features" className="nav-link">
                  Categories
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="nav-link">
                  Process
                </a>
              </li>
              <li>
                <a href="#pricing" className="nav-link">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="nav-link">
                  FAQ
                </a>
              </li>
              <li>
                <button
                  type="button"
                  className="cta-button primary"
                  id="open-dialog-nav"
                  onClick={() => openModal()}
                  style={{ background: "linear-gradient(135deg, #DC2626, #F59E0B)", boxShadow: "0 0 15px rgba(220,38,38,0.5)" }}
                >
                  Submit Idea
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* TONG SOLUTIONS HUD TELEMETRY BANNER */}
      <div style={{ background: "rgba(8, 10, 15, 0.95)", borderBottom: "1px solid rgba(0, 240, 255, 0.25)", padding: "0.35rem 1rem", fontSize: "0.75rem", fontFamily: "var(--font-headings)", letterSpacing: "0.1em", color: "var(--accent-cyan)", textAlign: "center", textTransform: "uppercase", display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap", zIndex: 10, position: "relative" }}>
        <span>⚡ TONG ENGINE: <strong style={{ color: "#10B981" }}>ONLINE</strong></span>
        <span>🛡️ TONG PROTOCOL v5.4</span>
        <span>⚙️ PROJECT CORE: <strong style={{ color: "var(--accent-gold-light)" }}>100% READY</strong></span>
      </div>

      <main style={{ position: "relative", zIndex: 1 }}>
        {/* HERO SECTION */}
        <section className="hero-section scanline-bg">
          <div className="container hero-content">
            <span className="tong-badge tong-badge-cyan" style={{ marginBottom: "var(--space-sm)" }}>
              <span>⚡ TONG SOLUTIONS TECH</span>
              <span>• CLASS OF 2026</span>
            </span>

            <h1 className="hero-title tong-text-gradient">
              Struggling with Your Final Year Project?
            </h1>

            {/* Interactive Arc Reactor Core Widget */}
            <ArcReactorWidget />

            <p className="hero-desc">
              Bring your project ideas and requirements. We develop
              high-fidelity software prototypes, write comprehensive project books,
              and design defense presentation slide decks.
            </p>

            <div className="hero-buttons">
              <button
                type="button"
                className="cta-button primary"
                id="hero-primary-cta"
                onClick={() => openModal()}
                style={{ background: "linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)", boxShadow: "0 4px 20px rgba(220, 38, 38, 0.5)" }}
              >
                Build Your Project
              </button>
              <a href="#how-it-works" className="cta-button secondary">
                Explore Process
              </a>
            </div>

            {/* Stats Section */}
            <div className="hero-stats">
              <div className="hud-card stat-card">
                <div className="hud-corner hud-corner-tl" />
                <div className="hud-corner hud-corner-tr" />
                <div className="hud-corner hud-corner-bl" />
                <div className="hud-corner hud-corner-br" />
                <div className="stat-num" id="stat-completed" style={{ color: "var(--accent-cyan)" }}>
                  1200+
                </div>
                <div className="stat-label">Projects Completed</div>
              </div>
              <div className="hud-card stat-card">
                <div className="hud-corner hud-corner-tl" />
                <div className="hud-corner hud-corner-tr" />
                <div className="hud-corner hud-corner-bl" />
                <div className="hud-corner hud-corner-br" />
                <div className="stat-num" id="stat-grade" style={{ color: "var(--accent-gold-light)" }}>
                  A+
                </div>
                <div className="stat-label">Average Student Grade</div>
              </div>
              <div className="hud-card stat-card">
                <div className="hud-corner hud-corner-tl" />
                <div className="hud-corner hud-corner-tr" />
                <div className="hud-corner hud-corner-bl" />
                <div className="hud-corner hud-corner-br" />
                <div className="stat-num" id="stat-universities" style={{ color: "var(--accent-primary)" }}>
                  45+
                </div>
                <div className="stat-label">Universities Approved</div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECT CATEGORIES */}
        <section id="features" className="categories-section">
          <div className="container">
            <header className="section-header">
              <h2 className="section-title text-gradient">
                Custom Project Categories
              </h2>
              <p className="section-subtitle">
                We design and implement custom architectures across diverse
                engineering domains.
              </p>
            </header>

            <div className="grid-categories">
              <article className="hud-card category-card">
                <div className="hud-corner hud-corner-tl" />
                <div className="hud-corner hud-corner-tr" />
                <div className="hud-corner hud-corner-bl" />
                <div className="hud-corner hud-corner-br" />
                <div className="category-icon" aria-hidden="true" style={{ color: "var(--accent-cyan)", background: "rgba(0,240,255,0.12)" }}>
                  🌐
                </div>
                <h3>Web Applications</h3>
                <p>
                  Modern full-stack platforms using React, Next.js, Node.js, and
                  secure SQL/NoSQL databases with interactive analytics
                  dashboards.
                </p>
              </article>

              <article className="hud-card category-card">
                <div className="hud-corner hud-corner-tl" />
                <div className="hud-corner hud-corner-tr" />
                <div className="hud-corner hud-corner-bl" />
                <div className="hud-corner hud-corner-br" />
                <div className="category-icon" aria-hidden="true" style={{ color: "var(--accent-gold-light)", background: "rgba(245,158,11,0.12)" }}>
                  📱
                </div>
                <h3>Mobile App Development</h3>
                <p>
                  Native or cross-platform apps (Flutter/React Native) featuring
                  real-time syncing, offline databases, and slick custom
                  animations.
                </p>
              </article>

              <article className="hud-card category-card">
                <div className="hud-corner hud-corner-tl" />
                <div className="hud-corner hud-corner-tr" />
                <div className="hud-corner hud-corner-bl" />
                <div className="hud-corner hud-corner-br" />
                <div className="category-icon" aria-hidden="true" style={{ color: "var(--accent-primary)", background: "rgba(220,38,38,0.15)" }}>
                  🧠
                </div>
                <h3>AI &amp; Machine Learning</h3>
                <p>
                  Predictive analytics, deep learning models, natural language
                  processors, or computer vision solutions with high accuracy
                  rates.
                </p>
              </article>

              <article className="hud-card category-card">
                <div className="hud-corner hud-corner-tl" />
                <div className="hud-corner hud-corner-tr" />
                <div className="hud-corner hud-corner-bl" />
                <div className="hud-corner hud-corner-br" />
                <div className="category-icon" aria-hidden="true" style={{ color: "var(--accent-cyan)", background: "rgba(0,240,255,0.12)" }}>
                  🔌
                </div>
                <h3>IoT &amp; Embedded Systems</h3>
                <p>
                  Hardware integrations using Arduino, Raspberry Pi, ESP32
                  modules communicating over MQTT or WebSockets with web
                  visualizers.
                </p>
              </article>

            </div>
          </div>
        </section>

        {/* WHY TONG SOLUTIONS SECTION */}
        <WhyTongSolutionsSection onOpenModal={() => openModal()} />

        {/* PROJECT PROTOTYPES & TEMPLATES SHOWCASE SECTION */}
        <PrototypesShowcaseSection onOpenModal={openModal} />

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="how-it-works-section">
          <div className="container">
            <header className="section-header">
              <h2 className="section-title text-gradient">Our Simple Process</h2>
              <p className="section-subtitle">
                How we transition your raw requirements into a fully working
                project ready for submission.
              </p>
            </header>

            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot" aria-hidden="true">
                  1
                </div>
                <div className="glass-panel timeline-card">
                  <h3>Submit Requirements</h3>
                  <p>
                    Fill out our interactive submission form with your basic
                    details, specific technical categories, budget expectations,
                    and any instructions from your supervisor.
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot" aria-hidden="true">
                  2
                </div>
                <div className="glass-panel timeline-card">
                  <h3>Interactive Consultation</h3>
                  <p>
                    We review your details and set up a call to define the
                    project scope, technical stack selection, database design,
                    and key feature definitions.
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot" aria-hidden="true">
                  3
                </div>
                <div className="glass-panel timeline-card">
                  <h3>Incremental Delivery</h3>
                  <p>
                    Track progress milestones as we write clean code, draft
                    comprehensive project report books (system diagrams, code
                    specs), and format defense presentation slide decks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="pricing-section">
          <div className="container">
            <header className="section-header">
              <h2 className="section-title text-gradient">Pricing &amp; Packages</h2>
              <p className="section-subtitle">
                Choose base prototype code (৳10,000) or upgraded packages that include full project book documentation and presentation slide decks.
              </p>
            </header>

            <div className="grid-pricing">
              {/* Basic */}
              <article className="hud-card pricing-card">
                <div className="hud-corner hud-corner-tl" />
                <div className="hud-corner hud-corner-tr" />
                <div className="hud-corner hud-corner-bl" />
                <div className="hud-corner hud-corner-br" />
                <div className="pricing-header">
                  <h3 className="pricing-title">Prototype Code</h3>
                  <div className="pricing-price" style={{ color: "var(--accent-cyan)" }}>
                    ৳10,000<span>/total</span>
                  </div>
                </div>
                <ul className="pricing-features">
                  <li>Complete working source code</li>
                  <li>Installation instruction guide</li>
                  <li>Basic system design diagram</li>
                  <li>1 round of code modifications</li>
                  <li>GitHub repository access</li>
                  <li style={{ color: "var(--accent-gold-light)", fontStyle: "italic" }}>Report &amp; Slides available as add-ons</li>
                  <li style={{ color: "#F59E0B", fontSize: "0.78rem", borderTop: "1px dashed rgba(255,255,255,0.12)", paddingTop: "0.5rem", marginTop: "0.4rem", lineHeight: 1.4 }}>
                    ⚠️ Additional charges apply for extra or custom requirement types
                  </li>
                </ul>
                <button
                  type="button"
                  className="cta-button secondary pricing-cta"
                  onClick={() => openModal("Prototype Code")}
                >
                  Get Started
                </button>
              </article>

              {/* Standard (Recommended) */}
              <article className="hud-card pricing-card premium" style={{ border: "1px solid var(--accent-gold-light)", boxShadow: "0 0 25px rgba(245,158,11,0.3)" }}>
                <div className="hud-corner hud-corner-tl" style={{ borderColor: "var(--accent-gold-light)" }} />
                <div className="hud-corner hud-corner-tr" style={{ borderColor: "var(--accent-gold-light)" }} />
                <div className="hud-corner hud-corner-bl" style={{ borderColor: "var(--accent-gold-light)" }} />
                <div className="hud-corner hud-corner-br" style={{ borderColor: "var(--accent-gold-light)" }} />
                <span className="popular-badge" style={{ background: "linear-gradient(135deg, #DC2626, #F59E0B)", color: "#FFF" }}>TONG PREFERRED</span>
                <div className="pricing-header">
                  <h3 className="pricing-title" style={{ color: "var(--accent-gold-light)" }}>Complete Solution</h3>
                  <div className="pricing-price" style={{ color: "var(--accent-gold-light)" }}>
                    ৳15,000<span>/total</span>
                  </div>
                </div>
                <ul className="pricing-features">
                  <li>Complete working source code</li>
                  <li><strong>Includes 40+ page Project Book</strong></li>
                  <li>High-fidelity system architecture</li>
                  <li>Interactive screen diagrams</li>
                  <li>3 rounds of modifications</li>
                  <li>Setup &amp; deployment support</li>
                  <li style={{ color: "#F59E0B", fontSize: "0.78rem", borderTop: "1px dashed rgba(245,158,11,0.3)", paddingTop: "0.5rem", marginTop: "0.4rem", lineHeight: 1.4 }}>
                    ⚠️ Additional charges apply for extra or custom requirement types
                  </li>
                </ul>
                <button
                  type="button"
                  className="cta-button primary pricing-cta"
                  onClick={() => openModal("Complete Solution")}
                  style={{ background: "linear-gradient(135deg, #DC2626, #F59E0B)", boxShadow: "0 0 15px rgba(220,38,38,0.5)" }}
                >
                  Get Started
                </button>
              </article>

              {/* Premium */}
              <article className="hud-card pricing-card">
                <div className="hud-corner hud-corner-tl" />
                <div className="hud-corner hud-corner-tr" />
                <div className="hud-corner hud-corner-bl" />
                <div className="hud-corner hud-corner-br" />
                <div className="pricing-header">
                  <h3 className="pricing-title">Full Bundle</h3>
                  <div className="pricing-price" style={{ color: "var(--accent-primary)" }}>
                    ৳20,000<span>/total</span>
                  </div>
                </div>
                <ul className="pricing-features">
                  <li>Everything in Complete Solution</li>
                  <li><strong>Includes Presentation Slide Deck</strong></li>
                  <li>High-fidelity system architecture &amp; ERDs</li>
                  <li>Detailed code walkthrough &amp; setup guide</li>
                  <li>Revisions till supervisor approval</li>
                  <li>Direct developer support</li>
                  <li style={{ color: "#F59E0B", fontSize: "0.78rem", borderTop: "1px dashed rgba(255,255,255,0.12)", paddingTop: "0.5rem", marginTop: "0.4rem", lineHeight: 1.4 }}>
                    ⚠️ Additional charges apply for extra or custom requirement types
                  </li>
                </ul>
                <button
                  type="button"
                  className="cta-button secondary pricing-cta"
                  onClick={() => openModal("Full Bundle")}
                >
                  Get Started
                </button>
              </article>
            </div>

            {/* Additional Charges Policy Banner */}
            <div style={{ marginTop: "1.75rem", background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "8px", padding: "0.85rem 1.25rem", color: "#F59E0B", fontSize: "0.85rem", textAlign: "center" }}>
              <span>⚠️</span> <strong>Pricing Policy Note:</strong> Base package pricing covers standard university project scopes. Additional charges will be added for extra features, complex integrations, or non-standard requirement types.
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="testimonials-section">
          <div className="container">
            <header className="section-header">
              <h2 className="section-title text-gradient">Success Stories</h2>
              <p className="section-subtitle">
                Hear what previous final-year engineering students have
                accomplished with us.
              </p>
            </header>

            <div className="slider-container">
              <div
                className="slider-track"
                id="testimonial-track"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {/* Slide 1 */}
                <div className="slide">
                  <div className="glass-panel testimonial-card">
                    <p className="testimonial-text">
                      "I was completely stuck with my computer vision final project defense. Tong Solutions delivered a flawless real-time object tracking system with complete IEEE documentation that secured an A+ grade!"
                    </p>
                    <div className="student-info">
                      <div className="student-name">Tanvir Ahmed</div>
                      <div className="student-details">
                        CSE Graduate | BUET
                      </div>
                    </div>
                  </div>
                </div>
                {/* Slide 2 */}
                <div className="slide">
                  <div className="glass-panel testimonial-card">
                    <p className="testimonial-text">
                      "The full bundle saved us! The source code was clean, well-structured, and the 40-page project book with ERDs and presentation slides made our final defense presentation effortless."
                    </p>
                    <div className="student-info">
                      <div className="student-name">Nusrat Jahan</div>
                      <div className="student-details">
                        Software Engineering | BRAC University
                      </div>
                    </div>
                  </div>
                </div>
                {/* Slide 3 */}
                <div className="slide">
                  <div className="glass-panel testimonial-card">
                    <p className="testimonial-text">
                      "Our smart IoT environmental monitoring prototype was selected as one of the top capstone projects in our department. Their hardware setup guides and code walkthroughs were top-notch!"
                    </p>
                    <div className="student-info">
                      <div className="student-name">Abrar Hossain</div>
                      <div className="student-details">
                        EEE &amp; IoT Graduate | SUST
                      </div>
                    </div>
                  </div>
                </div>
                {/* Slide 4 */}
                <div className="slide">
                  <div className="glass-panel testimonial-card">
                    <p className="testimonial-text">
                      "Tong Solutions helped turn our complex AI web app idea into a working product within just 10 days. The developer support during our supervisor review was exceptional!"
                    </p>
                    <div className="student-info">
                      <div className="student-name">Samiul Islam</div>
                      <div className="student-details">
                        CSE Graduate | NSU
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="slider-controls">
                <button
                  type="button"
                  className="slider-btn"
                  id="prev-slide"
                  aria-label="Previous Testimonial"
                  onClick={handlePrevSlide}
                >
                  ←
                </button>
                <button
                  type="button"
                  className="slider-btn"
                  id="next-slide"
                  aria-label="Next Testimonial"
                  onClick={handleNextSlide}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION (EXCLUSIVE ACCORDION) */}
        <section id="faq" className="faq-section">
          <div className="container">
            <header className="section-header">
              <h2 className="section-title text-gradient">
                Frequently Asked Questions
              </h2>
              <p className="section-subtitle">
                Everything you need to know about our project delivery process.
              </p>
            </header>

            <div className="accordion-container">
              <details name="faq" className="glass-panel" open={true}>
                <summary>Will I get the complete source code?</summary>
                <div className="faq-content">
                  <p>
                    Yes. You receive full ownership and clean, well-documented
                    source code files along with setup scripts and instructions so
                    you can easily run the application on your computer.
                  </p>
                </div>
              </details>

              <details name="faq" className="glass-panel">
                <summary>How is the project documentation prepared?</summary>
                <div className="faq-content">
                  <p>
                    Our report documentation follows standard academic formats
                    including Introduction, Literature Survey, System Architecture
                    Diagrams, Database Schema, Testing Metrics, and Conclusion. It
                    is fully formatted and ready to submit to your university.
                  </p>
                </div>
              </details>

              <details name="faq" className="glass-panel">
                <summary>What if my supervisor requests changes?</summary>
                <div className="faq-content">
                  <p>
                    All plans come with modification periods. If your college
                    supervisor suggests changes to the project flow or
                    documentation style, we implement them based on the revision
                    quota in your selected package.
                  </p>
                </div>
              </details>

              <details name="faq" className="glass-panel">
                <summary>Are project books and presentation slides included in all packages?</summary>
                <div className="faq-content">
                  <p>
                    The base Prototype Code package (৳10,000) includes the complete working source code, setup guide, and basic system diagram. Full project books (40+ page IEEE report) and presentation slide decks are available as add-ons or bundled in our Complete Solution (৳15,000) and Full Bundle (৳20,000) packages.
                  </p>
                </div>
              </details>

              <details name="faq" className="glass-panel">
                <summary>Are these projects plagiarized?</summary>
                <div className="faq-content">
                  <p>
                    No. Each project is designed and custom-written from scratch
                    based on the unique requirements you provide in the submission
                    form. We do not recycle code structures.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="main-footer">
        <div className="container footer-content">
          <ul className="footer-links">
            <li>
              <a href="#features" className="footer-link">
                Categories
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="footer-link">
                Process
              </a>
            </li>
            <li>
              <a href="#pricing" className="footer-link">
                Pricing
              </a>
            </li>
            <li>
              <a href="/admin" className="footer-link" style={{ color: "var(--accent-cyan)", fontWeight: 600 }}>
                🔐 Admin Panel
              </a>
            </li>
          </ul>
          <div className="footer-logo" style={{ marginBottom: '0.75rem' }}>
            <img src="/logo-full.png" alt="Tong Solutions" className="footer-logo-image" />
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <a
              href="https://www.facebook.com/tongsolutions"
              target="_blank"
              rel="noopener noreferrer"
              className="social-facebook-link"
              aria-label="Visit Tong Solutions on Facebook"
            >
              <svg
                className="facebook-icon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Follow Us on Facebook</span>
            </a>
          </div>
          <p>
            &copy; 2026 Tong Solutions. Built with pride for engineering students.
          </p>
        </div>
      </footer>

      {/* NATIVE PROJECT REQUEST MODAL DIALOG */}
      <dialog
        ref={dialogRef}
        id="idea-dialog"
        aria-labelledby="dialog-title"
      >
        <div className="form-header">
          <h2 id="dialog-title">Submit Project Idea</h2>
          <button
            type="button"
            className="close-dialog-btn"
            id="close-dialog"
            aria-label="Close Form"
            onClick={closeModal}
          >
            ×
          </button>
        </div>

        {/* Form Steps Tracker */}
        {!isSubmitted && (
          <nav className="form-progress-bar" aria-label="Submission Progress">
            <div
              className={`progress-step ${
                activeStepIdx === 0 ? "active" : ""
              } ${activeStepIdx > 0 ? "complete" : ""}`}
              id="p-step-1"
            >
              1. Student Details
            </div>
            <div
              className={`progress-step ${
                activeStepIdx === 1 ? "active" : ""
              } ${activeStepIdx > 1 ? "complete" : ""}`}
              id="p-step-2"
            >
              2. Scope
            </div>
            <div
              className={`progress-step ${
                activeStepIdx === 2 ? "active" : ""
              } ${activeStepIdx > 2 ? "complete" : ""}`}
              id="p-step-3"
            >
              3. Requirements
            </div>
          </nav>
        )}

        {/* Form Container */}
        <form id="project-idea-form" className="form-body" noValidate onSubmit={(e) => e.preventDefault()}>
          {/* STEP 1: Personal Details */}
          {!isSubmitted && activeStepIdx === 0 && (
            <section
              className="form-step-content active"
              id="step-1"
              aria-label="Student Details"
            >
              <div className="form-group">
                <label htmlFor="student-name">
                  Full Name{" "}
                  <span style={{ color: "#ff6b6b" }} aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  type="text"
                  id="student-name"
                  name="name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  placeholder="John Doe"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                <span
                  className="validation-error"
                  id="name-error"
                  style={{ display: errors.name ? "block" : "none" }}
                >
                  {errors.name}
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="student-email">
                  Email Address{" "}
                  <span style={{ color: "#ff6b6b" }} aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  type="email"
                  id="student-email"
                  name="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="johndoe@example.com"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                <span
                  className="validation-error"
                  id="email-error"
                  style={{ display: errors.email ? "block" : "none" }}
                >
                  {errors.email}
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="student-phone">
                  Contact Number (BD Phone){" "}
                  <span style={{ color: "#ff6b6b" }} aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  type="tel"
                  id="student-phone"
                  name="phone"
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  placeholder="e.g. 01712345678"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                <span
                  className="validation-error"
                  id="phone-error"
                  style={{ display: errors.phone ? "block" : "none" }}
                >
                  {errors.phone}
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="student-uni">
                  University Name{" "}
                  <span style={{ color: "#ff6b6b" }} aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  type="text"
                  id="student-uni"
                  name="university"
                  className={`form-control ${
                    errors.university ? "is-invalid" : ""
                  }`}
                  placeholder="MIT"
                  required
                  value={formData.university}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                <span
                  className="validation-error"
                  id="uni-error"
                  style={{ display: errors.university ? "block" : "none" }}
                >
                  {errors.university}
                </span>
              </div>
            </section>
          )}

          {/* STEP 2: Project Scope */}
          {!isSubmitted && activeStepIdx === 1 && (
            <section
              className="form-step-content active"
              id="step-2"
              aria-label="Scope Details"
            >
              <div className="form-group">
                <label htmlFor="project-category">
                  Project Category{" "}
                  <span style={{ color: "#ff6b6b" }} aria-hidden="true">
                    *
                  </span>
                </label>
                <select
                  id="project-category"
                  name="category"
                  className={`form-control ${
                    errors.category ? "is-invalid" : ""
                  }`}
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                >
                  <option value="" disabled>
                    Select category...
                  </option>
                  <option value="web">Web Application</option>
                  <option value="mobile">Mobile Application</option>
                  <option value="ai-ml">AI &amp; Machine Learning</option>
                  <option value="iot">IoT &amp; Embedded Systems</option>
                  <option value="other">Other Domain</option>
                </select>
                <span
                  className="validation-error"
                  id="category-error"
                  style={{ display: errors.category ? "block" : "none" }}
                >
                  {errors.category}
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="project-title">
                  Suggested Project Title{" "}
                  <span style={{ color: "#ff6b6b" }} aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  type="text"
                  id="project-title"
                  name="title"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  placeholder="e.g. Smart Attendance System"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                <span
                  className="validation-error"
                  id="title-error"
                  style={{ display: errors.title ? "block" : "none" }}
                >
                  {errors.title}
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="project-timeline">
                  Target Timeline{" "}
                  <span style={{ color: "#ff6b6b" }} aria-hidden="true">
                    *
                  </span>
                </label>
                <select
                  id="project-timeline"
                  name="timeline"
                  className={`form-control ${
                    errors.timeline ? "is-invalid" : ""
                  }`}
                  required
                  value={formData.timeline}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                >
                  <option value="" disabled>
                    Select timeline...
                  </option>
                  <option value="1-month">1 Month (Urgent Prototype)</option>
                  <option value="2-months">
                    2 Months (Standard Submission)
                  </option>
                  <option value="3-months">
                    3+ Months (Complete Thesis Scope)
                  </option>
                </select>
                <span
                  className="validation-error"
                  id="timeline-error"
                  style={{ display: errors.timeline ? "block" : "none" }}
                >
                  {errors.timeline}
                </span>
              </div>
            </section>
          )}

          {/* STEP 3: Requirements & Budget */}
          {!isSubmitted && activeStepIdx === 2 && (
            <section
              className="form-step-content active"
              id="step-3"
              aria-label="Requirements Details"
            >
              <div className="form-group">
                <label htmlFor="project-requirements">
                  Detailed Project Requirements{" "}
                  <span style={{ color: "#ff6b6b" }} aria-hidden="true">
                    *
                  </span>
                </label>
                <textarea
                  id="project-requirements"
                  name="requirements"
                  className={`form-control ${
                    errors.requirements ? "is-invalid" : ""
                  }`}
                  rows={4}
                  placeholder="Explain the features, tech preferences, or modules your project needs..."
                  required
                  value={formData.requirements}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                <span className="form-help-text">
                  Provide as much detail as possible to get an accurate scope
                  analysis.
                </span>
                <span
                  className="validation-error"
                  id="requirements-error"
                  style={{ display: errors.requirements ? "block" : "none" }}
                >
                  {errors.requirements}
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="project-budget">
                  Approximate Budget Range (BDT / ৳):{" "}
                  <span className="range-output-val" id="budget-value">
                    ৳{formData.budget.toLocaleString()}
                  </span>
                </label>
                <input
                  type="range"
                  id="project-budget"
                  name="budget"
                  min="5000"
                  max="30000"
                  step="1000"
                  value={formData.budget}
                  style={{ width: "100%" }}
                  onChange={handleBudgetChange}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                  }}
                >
                  <span>৳5,000</span>
                  <span>৳15,000</span>
                  <span>৳30,000</span>
                </div>
              </div>
            </section>
          )}

          {/* SUCCESS SCREEN */}
          {isSubmitted && (
            <div
              className="success-screen"
              id="success-screen"
              style={{ display: "block" }}
            >
              <div className="success-icon" aria-hidden="true">
                ✓
              </div>
              <h3>Idea Submitted!</h3>
              <p>
                Thank you for submitting your project parameters. A technical
                consultant will review your specifications and contact you via
                your email address within 24 hours.
              </p>
              <button
                type="button"
                className="cta-button primary"
                id="btn-success-close"
                onClick={closeModal}
              >
                Done
              </button>
            </div>
          )}
        </form>

        {/* Form Controls Footer */}
        {!isSubmitted && (
          <div className="form-footer" id="dialog-footer">
            <button
              type="button"
              className="cta-button secondary"
              id="prev-btn"
              style={{ visibility: activeStepIdx === 0 ? "hidden" : "visible" }}
              onClick={handlePrevStep}
              disabled={isSubmitting}
            >
              Previous
            </button>
            <button
              type="button"
              className="cta-button primary"
              id="next-btn"
              onClick={handleNextStep}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : activeStepIdx === 2
                ? "Submit Proposal"
                : "Next Step"}
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
