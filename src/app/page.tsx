"use client";

import { useState, useRef, useEffect } from "react";

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

export default function Home() {
  // Testimonial slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesCount = 3;

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
  const openModal = (packageName?: string) => {
    resetFormState();
    if (packageName) {
      setFormData((prev) => ({
        ...prev,
        requirements: `Selected package: ${packageName}.\n\nRequirements outline:\n`,
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

  // Simulated Submit with localStorage saving
  const submitProposal = () => {
    setIsSubmitting(true);
    setTimeout(() => {
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
    }, 1200);
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
                      "I was completely lost with my machine learning final
                      project. They built a superb facial recognition system and
                      helped me write a report that secured an A+ grade. Highly
                      recommended!"
                    </p>
                    <div className="student-info">
                      <div className="student-name">Alex Johnson</div>
                      <div className="student-details">
                        B.Tech CS Graduate | MIT
                      </div>
                    </div>
                  </div>
                </div>
                {/* Slide 2 */}
                <div className="slide">
                  <div className="glass-panel testimonial-card">
                    <p className="testimonial-text">
                      "The code was extremely clean and well-commented. The project
                      book documentation and presentation slides saved us weeks of
                      work. Superb experience."
                    </p>
                    <div className="student-info">
                      <div className="student-name">Sarah Rahman</div>
                      <div className="student-details">
                        Software Eng Graduate | Stanford University
                      </div>
                    </div>
                  </div>
                </div>
                {/* Slide 3 */}
                <div className="slide">
                  <div className="glass-panel testimonial-card">
                    <p className="testimonial-text">
                      "Our team's smart cloud analytics project was selected as
                      the best department project. We could not have done it
                      without the detailed system diagrams and clean
                      implementation."
                    </p>
                    <div className="student-info">
                      <div className="student-name">Daniel Kim</div>
                      <div className="student-details">IT Graduate | NUS</div>
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
          </ul>
          <div className="footer-logo" style={{ marginBottom: '1.25rem' }}>
            <img src="/logo-full.png" alt="Tong Solutions" className="footer-logo-image" />
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
