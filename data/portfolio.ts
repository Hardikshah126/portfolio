// Single source of portfolio content. Everything here comes from the resume or
// the project repositories (READMEs, code, benchmarks) — keep it that way when editing.

export type Link = { label: string; href: string };

export type Metric = { value: string; label: string };

export type Experience = {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  summary: string;
  highlights: string[];
  metrics: Metric[];
  stack: string[];
};

export type ProjectVisual = "raft" | "credit" | "agents" | "guard" | "rag";

export type Project = {
  id: string;
  name: string;
  category: string;
  stack: string[];
  description: string[];
  metrics: Metric[];
  links: Link[];
  visual: ProjectVisual;
};

export type SkillGroup = {
  id: string;
  label: string;
  skills: { name: string; fx?: "graph" }[];
};

export type Achievement = {
  value: string;
  unit: string;
  title: string;
  detail: string;
  link?: Link;
};

export type Credential = { title: string; issuer: string; link?: Link };

export const profile = {
  name: "Hardik Shah",
  firstName: "Hardik",
  lastName: "Shah",
  title: "Full Stack Software Engineer",
  focus: ["AI", "Backend", "Full Stack"],
  location: "Chennai, India",
  coordinates: "13.08° N · 80.27° E",
  email: "hardikcodes01@gmail.com",
  github: "https://github.com/Hardikshah126",
  linkedin: "https://www.linkedin.com/in/hardik-shah-9b5a12254/",
  resume: "/resume/Hardik_Shah_Resume.pdf",
  about:
    "I'm a full stack software engineer in Chennai who builds across the whole system — typed Next.js interfaces, Go and Python backends, PostgreSQL schemas and LLM-powered workflows. I've implemented Raft consensus from scratch, built a multi-agent incident investigation system, and shipped an AI-assisted hiring platform end to end for a client's HR team. I care about clean architecture, tested code, and systems that keep working when parts of them fail.",
};

export const navLinks: Link[] = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const education = {
  school: "SRM Institute of Science and Technology",
  short: "SRMIST",
  location: "Chennai",
  degree: "B.Tech Computer Science (IoT)",
  period: "Aug 2023 — Jun 2027",
  gpa: "8.45",
  gpaScale: "10",
  coursework: [
    "Data Structures & Algorithms",
    "Object-Oriented Programming",
    "Operating Systems",
    "Database Systems",
    "Distributed Computing",
  ],
};

export const experience: Experience[] = [
  {
    id: "rotex",
    role: "Freelance Software Developer",
    company: "Rotex Manufacturers & Engineers Pvt. Ltd.",
    period: "Apr 2026 — Sept 2026",
    summary:
      "Built a full-stack, AI-assisted hiring platform and owned it end to end — from requirements with the client's HR team to deployment.",
    highlights: [
      "Developed the platform in Next.js, TypeScript, Tailwind CSS and PostgreSQL, integrating GPT-4o interview generation, Whisper transcription and AI content detection.",
      "Designed a 15-table schema with role-based access control and audit logging, structured as Route Handler → Zod validation → Service → Repository.",
      "Shaped features around feedback from recruiters using the platform daily.",
    ],
    metrics: [
      { value: "50%", label: "Less manual screening" },
      { value: "15", label: "Table schema" },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "GPT-4o", "Whisper", "Zod", "RBAC"],
  },
  {
    id: "upstagex",
    role: "AI Engineer Intern",
    company: "UpstageX Private Limited",
    period: "Aug 2026 — Sept 2026",
    summary:
      "Evaluated LLM configurations and prepared evaluation data for customer-support use cases.",
    highlights: [
      "Evaluated LLM configurations using the Anthropic API in Python, comparing outputs against expected results.",
      "Prepared and validated 100+ customer-support text samples for model evaluation, including cleaning and formatting.",
      "Supported AI/ML integration tasks in the team codebase, collaborating remotely through Git.",
    ],
    metrics: [{ value: "100+", label: "Samples validated" }],
    stack: ["Python", "Anthropic API", "LLM Evaluation", "Git"],
  },
  {
    id: "srmist",
    role: "Research Intern — Computer Vision",
    company: "SRMIST",
    location: "Chennai",
    period: "Jun 2025 — Jan 2026",
    summary:
      "Deployed an automatic number-plate recognition pipeline on edge hardware and co-authored a paper on the system.",
    highlights: [
      "Deployed an ANPR pipeline on Raspberry Pi 4 using OpenCV and Tesseract OCR across 1,000 test scenarios.",
      "Tuned detection algorithms and calibrated hardware.",
      "Co-authored a paper accepted for oral presentation at AICCoNS 2026 (AIP Conference Proceedings, Scopus indexed).",
    ],
    metrics: [
      { value: "94%", label: "Plate recognition" },
      { value: "99.2%", label: "Uptime · 60 days" },
    ],
    stack: ["Raspberry Pi 4", "OpenCV", "Tesseract OCR", "Computer Vision"],
  },
];

// Order here is the order on the page; panel numbers are derived from it.
export const projects: Project[] = [
  {
    id: "agentguard",
    name: "AgentGuard",
    category: "Payment authorization for AI agents",
    stack: ["Python", "FastAPI", "Next.js", "PostgreSQL", "Razorpay", "MCP", "Groq"],
    description: [
      "An AI shopping assistant can ask to charge a card — a separate deterministic guard decides if it's allowed. Six checks, no AI, no network calls; if one fails, no money moves.",
      "Amounts are recomputed from live prices, races are stopped by a database lock, and external agents hit the same guard over MCP. Built for a buildathon on Razorpay test mode.",
    ],
    metrics: [
      { value: "632", label: "Automated tests" },
      { value: "15.5ms", label: "Median guard check" },
      { value: "0", label: "Duplicates · 1,104 races" },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Hardikshah126/agentguard-commerce" },
      { label: "Live", href: "https://agentguard-commerce.vercel.app/" },
    ],
    visual: "guard",
  },
  {
    id: "raft-lite",
    name: "raft-lite",
    category: "Distributed Consensus Engine",
    stack: ["Go", "Next.js"],
    description: [
      "The Raft consensus algorithm built from scratch in Go — leader election, log replication and crash recovery — validated across 1, 3 and 5-node clusters.",
      "A real-time Next.js dashboard monitors the cluster, showing leader changes, node status and log syncing as servers fail and recover.",
    ],
    metrics: [
      { value: "207", label: "Automated tests" },
      { value: "1·3·5", label: "Node clusters" },
    ],
    links: [{ label: "GitHub", href: "https://github.com/Hardikshah126/raft-lite" }],
    visual: "raft",
  },
  {
    id: "creditai",
    name: "CreditAI",
    category: "Credit Scoring System",
    stack: ["FastAPI", "XGBoost", "React"],
    description: [
      "Scores loan applicants by combining an XGBoost model with rules like income and debt-to-income ratio.",
      "Three user roles get controlled access to loan decisions through role-based REST APIs and a React dashboard.",
    ],
    metrics: [
      { value: "0.93", label: "ROC-AUC" },
      { value: "+11%", label: "vs. logistic regression" },
      { value: "3", label: "User roles" },
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Hardikshah126/creditai" },
      { label: "Live", href: "https://creditai-orcin.vercel.app/" },
    ],
    visual: "credit",
  },
  {
    id: "incident-commander",
    name: "Multi-Agent AI",
    category: "Incident Investigation System",
    stack: ["Python", "LangGraph", "Gemini", "Next.js"],
    description: [
      "Automates incident root-cause analysis with 8 AI agents investigating logs, metrics, deployments and more — producing 32 evidence records and 3 competing hypotheses per incident.",
      "A Next.js dashboard keeps engineers in the loop: fixes are approved before they run.",
    ],
    metrics: [
      { value: "8", label: "AI agents" },
      { value: "32", label: "Evidence records" },
      { value: "230+", label: "Tests · 0 failures" },
    ],
    links: [{ label: "GitHub", href: "https://github.com/Hardikshah126/ai-incident-commander" }],
    visual: "agents",
  },
  {
    id: "visrag",
    name: "VisRAG",
    category: "Multimodal RAG for PDFs",
    stack: ["Python", "FastAPI", "Qdrant", "CLIP", "Gemini", "React"],
    description: [
      "Upload a PDF and ask questions about it. VisRAG extracts text, tables (Camelot) and figures (PyMuPDF), embeds text with SentenceTransformers and figures with CLIP, and stores everything in Qdrant.",
      "Gemini answers only from the retrieved context, with page citations, while the supporting tables and figures appear inline in an evidence panel. Page-specific questions like “explain page 5” are filtered to that page.",
    ],
    metrics: [
      { value: "3", label: "Modalities indexed" },
      { value: "512-d", label: "CLIP figure vectors" },
    ],
    links: [{ label: "GitHub", href: "https://github.com/Hardikshah126/VisRAG" }],
    visual: "rag",
  },
];

export const skills: SkillGroup[] = [
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "Python" },
      { name: "FastAPI" },
      { name: "Go" },
      { name: "Node.js" },
      { name: "Express" },
      { name: "TypeScript" },
      { name: "JavaScript" },
      { name: "REST API Design" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    skills: [{ name: "React.js" }, { name: "Next.js" }, { name: "Tailwind CSS" }],
  },
  {
    id: "databases",
    label: "Databases",
    skills: [
      { name: "PostgreSQL" },
      { name: "MySQL" },
      { name: "MongoDB" },
      { name: "Schema Design" },
      { name: "RBAC" },
    ],
  },
  {
    id: "ai",
    label: "AI / ML",
    skills: [
      { name: "LLM APIs", fx: "graph" },
      { name: "RAG", fx: "graph" },
      { name: "LangGraph", fx: "graph" },
      { name: "Whisper" },
      { name: "CLIP" },
      { name: "AI-assisted development" },
    ],
  },
  {
    id: "tools",
    label: "Tools / Cloud",
    skills: [
      { name: "Git" },
      { name: "Docker" },
      { name: "AWS" },
      { name: "S3" },
      { name: "IAM" },
      { name: "Unit Testing" },
      { name: "Integration Testing" },
    ],
  },
];

export const achievements: Achievement[] = [
  {
    value: "45",
    unit: "+",
    title: "Teams",
    detail:
      "Runner-up at Hackathon 9.0 (Hack2Skill) — a machine learning model that predicts likely diseases from patient-reported symptoms.",
  },
  {
    value: "200",
    unit: "+",
    title: "DSA problems",
    detail: "LeetCode 100 Days Badge — majority rated Medium / Hard.",
    link: { label: "LeetCode profile", href: "https://leetcode.com/u/7cbwtwLGeM/" },
  },
  {
    value: "94",
    unit: "%",
    title: "Plate recognition",
    detail: "ANPR system on Raspberry Pi 4, measured across 1,000 test scenarios.",
  },
  {
    value: "99.2",
    unit: "%",
    title: "Uptime",
    detail: "The same ANPR deployment, sustained over 60 days.",
  },
];

export const credentials: Credential[] = [
  {
    title: "SAP Certified — Back-End Developer — ABAP Cloud",
    issuer: "SAP",
    link: {
      label: "Badge",
      href: "https://www.credly.com/badges/6a2fbe51-10e4-40f1-957b-e5cc44b59858",
    },
  },
  { title: "AWS Cloud Foundations Certificate", issuer: "AWS" },
  {
    title: "Paper accepted for oral presentation — AICCoNS 2026",
    issuer: "AIP Conference Proceedings · Scopus indexed",
  },
];
