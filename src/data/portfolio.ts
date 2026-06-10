export interface ContactLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: "AI" | "Web" | "Mobile" | "Research" | "Frontend" | "Other";
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  metrics: { label: string; value: string }[];
  keyFeatures: string[];
  story: string;
  codeSnippet?: string;
  updatedAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  proficiency: number; // 0 to 100
  category: "AI/ML" | "Frontend" | "Backend" | "Tools";
}

export interface PortfolioData {
  name: string;
  currentField: string;
  allFields: string[]; // List of fields the user is authorized for or can select
  bio: string;
  story: string;
  avatarUrl: string;
  contactLinks: ContactLink[];
  projects: Project[];
  skills: Skill[];
}

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  name: "Ashish Kumar Thyadi",
  currentField: "AI Engineer",
  allFields: ["AI Engineer", "Software Developer", "Full-Stack & ML Practitioner"],
  bio: "Motivated Software Engineer and AI practitioner with full-time product development experience, contributing to production-grade AI applications. Proficient in the complete SDLC, Python, machine learning, and full-stack development.",
  story: "Motivated Software Engineer and AI practitioner with 8+ months of full-time product development experience at Trigint Solutions. Proficient in the complete software development lifecycle (SDLC) — from requirement analysis and feasible design to coding, testing, documentation, and deployment. Skilled in Python, machine learning, and full-stack development. Demonstrated ability to debug, optimise, and deliver high-quality, error-free code in fast-paced, collaborative environments. Seeking to leverage technical depth and problem-solving acumen to drive software excellence.",
  avatarUrl: "", // Empty to trigger gorgeous generative style initial avatar or interactive placeholder
  contactLinks: [
    {
      id: "1",
      platform: "GitHub",
      url: "https://github.com/ashi3643",
      icon: "Github"
    },
    {
      id: "2",
      platform: "LinkedIn",
      url: "https://linkedin.com/in/ashish-kumar-thyadi-30b9b0267",
      icon: "Linkedin"
    },
    {
      id: "3",
      platform: "Email",
      url: "mailto:ashishthyadi@gmail.com",
      icon: "Mail"
    },
    {
      id: "4",
      platform: "Phone",
      url: "tel:+919347460365",
      icon: "Smartphone"
    }
  ],
  projects: [
    {
      id: "p1",
      title: "SIMI – AI Task Manager",
      description: "Production AI product at Trigint Solutions. Contributed to feature development, automated workflow design, UI integration and deployment pipelines.",
      category: "AI",
      tags: ["Python", "AI", "SDLC", "UI Integration", "Deployment pipelines"],
      githubUrl: "",
      liveUrl: "https://trigintsolutions.com/products/simi",
      metrics: [
        { label: "Status", value: "Production" },
        { label: "Role", value: "AI Junior Engineer" },
        { label: "Company", value: "Trigint Solutions" }
      ],
      keyFeatures: [
        "Feature development and automated workflow design",
        "Continuous monitoring of product modules",
        "Authored release notes and internal documentation for sprint cycles"
      ],
      story: "Contributed to SIMI — an AI-powered Task Manager product by developing, testing, and maintaining software modules. Ensured continuous monitoring of product modules and authored release notes and internal documentation for each sprint cycle.",
      updatedAt: "2026-06-10T00:00:00Z"
    },
    {
      id: "p2",
      title: "Xchainge (CommerceX) – AI Commerce Platform",
      description: "AI-driven e-commerce engine platform.",
      category: "AI",
      tags: ["Python", "AI", "Machine Learning", "E-commerce"],
      githubUrl: "",
      liveUrl: "https://trigintsolutions.com/products/commercex",
      metrics: [
        { label: "Status", value: "Production" },
        { label: "Role", value: "AI Junior Engineer" },
        { label: "Impact", value: "Zero functional regression" }
      ],
      keyFeatures: [
        "AI-driven e-commerce engine development",
        "Requirement gathering and module development",
        "Testing and quality assurance phases"
      ],
      story: "Contributed to the development of an AI-driven e-commerce engine, working across requirement gathering, module development, testing and quality assurance phases. Supported platform rebranding migration from CommerceX to Xchainge with zero functional regression.",
      updatedAt: "2026-06-10T00:00:00Z"
    },
    {
      id: "p3",
      title: "Secure File Storage System",
      description: "Full-stack secure file storage web application using a hybrid AES + RSA encryption scheme, ensuring end-to-end data protection.",
      category: "Web",
      tags: ["AES", "RSA", "Cryptography", "Full-Stack", "Security"],
      githubUrl: "",
      liveUrl: "",
      metrics: [
        { label: "Security", value: "AES + RSA Hybrid" },
        { label: "Vulnerability", value: "Zero output" }
      ],
      keyFeatures: [
        "Hybrid AES + RSA encryption scheme",
        "End-to-end data protection for file storage",
        "Zero-vulnerability output through systematic testing"
      ],
      story: "Designed and built a full-stack secure file storage web application using a hybrid AES + RSA encryption scheme, ensuring end-to-end data protection. Implemented operational feasibility analysis, designed security test cases, and validated zero-vulnerability output through systematic testing.",
      updatedAt: "2026-06-10T00:00:00Z"
    },
    {
      id: "p4",
      title: "AI Experimental Projects",
      description: "Developed 14+ repositories exploring diverse AI concepts using GitHub Copilot and Google AI Studio.",
      category: "Research",
      tags: ["Python", "Google AI Studio", "Copilot", "Generative AI"],
      githubUrl: "https://github.com/ashi3643",
      liveUrl: "",
      metrics: [
        { label: "Repositories", value: "14+" },
        { label: "Focus", value: "AI Automation" }
      ],
      keyFeatures: [
        "Diverse AI concepts exploration",
        "Novel automation ideas and intelligent application prototypes",
        "Iterative SDLC practices: ideation, coding, testing and documentation"
      ],
      story: "Developed 14+ repositories exploring diverse AI concepts using GitHub Copilot and Google AI Studio, including novel automation ideas and intelligent application prototypes. Applied iterative SDLC practices: ideation, coding, testing and documentation for each project.",
      updatedAt: "2026-06-10T00:00:00Z"
    }
  ],
  skills: [
    { id: "s1", name: "Python", proficiency: 95, category: "AI/ML" },
    { id: "s2", name: "Scikit-learn", proficiency: 90, category: "AI/ML" },
    { id: "s3", name: "TensorFlow/Keras", proficiency: 85, category: "AI/ML" },
    { id: "s4", name: "NLP", proficiency: 88, category: "AI/ML" },
    { id: "s5", name: "Pandas & NumPy", proficiency: 92, category: "AI/ML" },
    { id: "s6", name: "JavaScript", proficiency: 85, category: "Frontend" },
    { id: "s7", name: "React", proficiency: 75, category: "Frontend" },
    { id: "s8", name: "HTML & CSS", proficiency: 90, category: "Frontend" },
    { id: "s9", name: "Flask & REST APIs", proficiency: 88, category: "Backend" },
    { id: "s10", name: "SQL", proficiency: 85, category: "Backend" },
    { id: "s11", name: "AES / RSA Cryptography", proficiency: 80, category: "Tools" },
    { id: "s12", name: "Git & GitHub", proficiency: 92, category: "Tools" }
  ]
};
