import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, Printer, Briefcase, GraduationCap, Award, 
  Sparkles, Download, CheckCircle2, ChevronRight, Share2, Clipboard, Check
} from "lucide-react";
import { PortfolioData } from "../data/portfolio";

interface ResumeHubProps {
  portfolioData: PortfolioData;
}

export default function ResumeHub({ portfolioData }: ResumeHubProps) {
  const [activeTab, setActiveTab] = useState<"interactive" | "printable">("interactive");
  const [copiedLink, setCopiedLink] = useState(false);

  // Experience history state
  const experiences = [
    {
      role: "AI Junior Engineer",
      company: "Trigint Solutions (formerly SuperIntelliMachines)",
      period: "Oct 2025 - Present",
      description: "Participating actively in the end-to-end SDLC: from requirement analysis and feasible design to coding, testing, documenting, and deploying production-grade AI systems like SIMI and Xchainge.",
      highlights: [
        "Participate actively in the end-to-end SDLC: gathering client requirements, converting them to feasible software designs, developing features, executing test scenarios and preparing release-ready deployments.",
        "Contribute to SIMI — an AI-powered Task Manager product — and Xchainge (formerly CommerceX) — an AI-driven commerce platform — by developing, testing, and maintaining software modules.",
        "Design and execute test cases / usage scenarios to validate software behaviour and ensure 100% quality assurance compliance prior to every release.",
        "Perform root cause analysis (RCA) on system issues, identify performance bottlenecks and implement optimisations that improve throughput and system availability.",
        "Prepare detailed technical documentation including flowcharts, code comments, bug reports and status updates for cross-team review and client-facing communication.",
        "Utilise AI-assisted development tools (GitHub Copilot, Google AI Studio) to accelerate feature development, prototype novel ideas, and maintain error-free codebases."
      ]
    },
    {
      role: "Python Development Intern",
      company: "Devskill Hub",
      period: "Mar 2024 - Apr 2024",
      description: "Investigated and refactored legacy Python codebases, applying performance optimization techniques key to reducing operational latency.",
      highlights: [
        "Investigated and refactored legacy Python codebases, applying performance optimisation techniques that reduced overall execution time by 40%.",
        "Integrated third-party libraries and rewrote inefficient modules following software development best practices; validated improvements through automated test execution.",
        "Documented code changes and maintained a structured problem-resolution log in accordance with team processes."
      ]
    },
    {
      role: "Data Science & AI Intern",
      company: "YBI Foundation",
      period: "May 2024 - Jun 2024",
      description: "Analyzed model metrics, selected supervised machine learning algorithms, and implemented high-accuracy predictive solutions with comprehensive statistical reporting.",
      highlights: [
        "Analysed data requirements, selected appropriate supervised ML algorithms and developed predictive models achieving 92% classification accuracy.",
        "Visualised data insights and model performance metrics using Matplotlib and Pandas, producing clear client-ready reports.",
        "Conducted feasibility analysis for each modelling approach and documented findings, including recommendations for production deployment."
      ]
    }
  ];

  // Academics state
  const education = [
    {
      degree: "B.Tech – Computer Science & Engineering",
      institution: "Sanketika Vidya Parishad Engineering College, Visakhapatnam",
      period: "2021 - 2025",
      major: "Cumulative GPA: 7.52 | No Active Backlogs"
    }
  ];

  // Certifications list
  const certifications = [
    "AES / RSA Hybrid Cryptography Secure Storage",
    "Supervised ML Predictive Modeling (YBI Foundation)",
    "Full-Lifecycle Software Development (SDLC)",
    "Root Cause Analysis & Quality Assurance Testing"
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleCopyProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div id="resume-section" className="relative z-10 my-20 scroll-mt-20 print:p-0">
      {/* Header section - Hidden during print */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-zinc-900 print:hidden">
        <div>
          <h2 className="text-3xl font-display font-light tracking-tight text-white flex items-center gap-2 serif">
            <span className="text-orange-500 font-mono text-xl mr-1">// 04.</span>
            Curriculum <span className="italic">Vitae</span>
          </h2>
          <p className="text-zinc-400 mt-2 max-w-xl text-sm font-sans">
            A comprehensive overview of my professional experience, key academic milestones, and tailored technical capabilities.
          </p>
        </div>

        {/* View mode switcher tabs */}
        <div className="flex items-center gap-1.5 mt-6 md:mt-0 bg-[#0d0d0d] p-1 rounded-xl border border-zinc-900 shrink-0">
          <button
            id="resume-tab-interactive"
            onClick={() => setActiveTab("interactive")}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "interactive"
                ? "bg-orange-500 text-black font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Interactive View</span>
          </button>
          <button
            id="resume-tab-printable"
            onClick={() => setActiveTab("printable")}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "printable"
                ? "bg-orange-500 text-black font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Printable A4 Sheet</span>
          </button>
        </div>
      </div>

      {/* Main resume layout panel */}
      <div className="print:block">

        {/* Printable View - A4 Sheet representation on screen, and standard clean page outline for print */}
        {activeTab === "printable" ? (
          <div>
            {/* Action tools floating row - Hidden during print */}
            <div className="mb-6 flex flex-wrap gap-2.5 justify-end print:hidden">
              <button
                id="copy-profile-link"
                onClick={handleCopyProfile}
                className="px-4 py-2 text-xs font-mono rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    <span>Profile Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-orange-400" />
                    <span>Share Portfolio Link</span>
                  </>
                )}
              </button>
              <button
                id="trigger-print-btn"
                onClick={handlePrint}
                className="px-4 py-2 text-xs font-mono rounded-lg bg-orange-500 text-black hover:bg-orange-400 font-bold flex items-center gap-2 shadow-md shadow-orange-500/10 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export as PDF / Print Sheet</span>
              </button>
            </div>

            {/* Print tips block - Hidden during print */}
            <div className="mb-6 p-4 rounded-xl border border-zinc-900 bg-[#121212]/30 text-xs text-zinc-500 font-sans print:hidden">
              <span className="font-mono text-orange-500 font-semibold uppercase block mb-1">💡 Professional Printing Tip:</span>
              <span>
                To save as a pristine clean single-page PDF, select <strong className="text-zinc-400 font-medium">"Save as PDF"</strong> in your browser's print portal, set layout to <strong className="text-zinc-400 font-medium">Portrait</strong>, and toggle on <strong className="text-zinc-400 font-medium">"Background graphics"</strong> to retain subtle gray board linings and clean spacing indicators.
              </span>
            </div>

            {/* The actual resume sheet matching high-cohesion modern Swiss display rules */}
            <div className="w-full max-w-4xl mx-auto p-10 bg-white text-black border border-zinc-200 rounded-2xl shadow-xl min-h-[1100px] font-sans print:border-none print:shadow-none print:p-0 print:m-0 print:bg-white print:text-black">
              {/* Header section */}
              <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-zinc-900 pb-6 mb-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight uppercase text-zinc-900">
                    {portfolioData.name}
                  </h1>
                  <p className="text-sm font-semibold tracking-wider uppercase text-orange-600 mt-1">
                    {portfolioData.currentField}
                  </p>
                  <p className="text-xs text-zinc-500 mt-2 max-w-xl leading-relaxed italic">
                    {portfolioData.bio}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 text-right text-xs text-zinc-600 font-mono space-y-1.5 md:border-l md:border-zinc-200 md:pl-6">
                  <div className="font-semibold text-zinc-800">ashishthyadi@gmail.com</div>
                  <div>github.com/ashi3643</div>
                  <div>linkedin.com/in/ashish-kumar-thyadi-30b9b0267</div>
                  <div>India // UTC +5.5</div>
                </div>
              </div>

              {/* Grid split */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left column: Experience & Education */}
                <div className="md:col-span-8 space-y-8 border-r border-zinc-200 pr-4 print:border-r print:pr-4">
                  {/* Experience segment */}
                  <div>
                    <h3 className="text-sm uppercase font-bold tracking-widest text-zinc-800 border-b border-zinc-300 pb-2 mb-4 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-orange-600 shrink-0" />
                      Professional History
                    </h3>

                    <div className="space-y-6">
                      {experiences.map((exp, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between items-start flex-wrap gap-1">
                            <div>
                              <h4 className="text-sm font-bold text-zinc-950">{exp.role}</h4>
                              <p className="text-xs font-semibold text-zinc-600">{exp.company}</p>
                            </div>
                            <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                              {exp.period}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-600 leading-relaxed font-sans mt-1">
                            {exp.description}
                          </p>
                          <ul className="list-disc pl-4 text-xs text-zinc-600 space-y-1">
                            {exp.highlights.map((light, hIdx) => (
                              <li key={hIdx} className="leading-relaxed">{light}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Academics segment */}
                  <div>
                    <h3 className="text-sm uppercase font-bold tracking-widest text-zinc-800 border-b border-zinc-300 pb-2 mb-4 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-orange-600 shrink-0" />
                      Academic Qualifications
                    </h3>

                    <div className="space-y-4">
                      {education.map((edu, idx) => (
                        <div key={idx} className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <h4 className="text-xs font-bold text-zinc-950">{edu.degree}</h4>
                            <p className="text-xs text-zinc-600">{edu.institution} — <span className="italic text-[11px]">{edu.major}</span></p>
                          </div>
                          <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                            {edu.period}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right column: Technical skills, credentials, selected highlights */}
                <div className="md:col-span-4 space-y-8">
                  {/* Skills category weights */}
                  <div>
                    <h3 className="text-sm uppercase font-bold tracking-widest text-zinc-800 border-b border-zinc-300 pb-2 mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4 text-orange-600 shrink-0" />
                      Expertise Stack
                    </h3>

                    <div className="space-y-4">
                      {["AI/ML", "Frontend", "Backend", "Tools"].map((section) => {
                        const sectSkills = portfolioData.skills.filter(s => s.category === section || (section === 'AI/ML' && s.category === 'AI/ML'));
                        if (sectSkills.length === 0) return null;
                        return (
                          <div key={section} className="space-y-1.5">
                            <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider block">{section}</span>
                            <div className="flex flex-wrap gap-1.5">
                              {sectSkills.map((sk) => (
                                <span key={sk.id} className="text-[11px] bg-zinc-100 text-zinc-800 border border-zinc-200 px-2 py-0.5 rounded">
                                  {sk.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Portfolio Projects References */}
                  <div>
                    <h3 className="text-sm uppercase font-bold tracking-widest text-zinc-800 border-b border-zinc-300 pb-2 mb-4 flex items-center gap-2">
                      Featured Work
                    </h3>
                    <div className="space-y-3">
                      {portfolioData.projects.map((p) => (
                        <div key={p.id} className="text-xs space-y-1">
                          <span className="font-bold text-zinc-900 block">{p.title}</span>
                          <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">{p.description}</p>
                          <div className="flex gap-2 text-[10px] text-zinc-400">
                            <span>{p.category}</span>
                            <span>•</span>
                            <span className="font-mono">{p.metrics[0]?.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications list */}
                  <div>
                    <h3 className="text-sm uppercase font-bold tracking-widest text-zinc-800 border-b border-zinc-300 pb-2 mb-4 flex items-center gap-2">
                      Credentials
                    </h3>
                    <ul className="text-xs text-zinc-600 space-y-1.5 list-disc pl-4">
                      {certifications.map((cert, idx) => (
                        <li key={idx} className="leading-tight">{cert}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Printable footer */}
              <div className="border-t border-zinc-200 mt-10 pt-4 flex justify-between items-center text-[10px] text-zinc-400">
                <span>Ashish Kumar Thyadi — Resume Sheet</span>
                <span>Generated dynamically via AI Portfolio Studio</span>
              </div>
            </div>
          </div>
        ) : (
          /* Interactive layout using bento cards with responsive transition states */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Timeline Experience Cards */}
            <div className="lg:col-span-8 flex flex-col justify-between p-6 rounded-xl border border-zinc-900/60 bg-[#121212]/30 relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-orange-500/5 blur-xl pointer-events-none" />

              <div>
                <h3 className="text-base font-display font-medium text-white mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-orange-400 shrink-0" />
                  Experience & Practice History
                </h3>

                <div className="space-y-8 relative before:absolute before:inset-y-1 before:left-[17px] before:w-px before:bg-zinc-800/80">
                  {experiences.map((exp, idx) => (
                    <div key={idx} className="relative pl-10 group">
                      {/* Timeline dot */}
                      <div className="absolute left-[9px] top-1.5 w-[17px] h-[17px] rounded-full bg-black border border-zinc-800 flex items-center justify-center group-hover:border-orange-500/50 transition-colors z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <span className="text-xs font-mono font-semibold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850/40">
                          {exp.period}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-mono text-zinc-500">
                          {exp.company}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-white mt-1 group-hover:text-orange-400 transition-colors">
                        {exp.role}
                      </h4>

                      <p className="text-zinc-400 text-xs leading-relaxed mt-2.5 font-sans">
                        {exp.description}
                      </p>

                      <div className="grid grid-cols-1 gap-1.5 mt-3">
                        {exp.highlights.map((light, hidx) => (
                          <div key={hidx} className="flex gap-2 text-[11px] text-zinc-450 bg-[#161616]/40 border border-zinc-900/60 p-2.5 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                            <span>{light}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom stats callout */}
              <div className="mt-8 pt-5 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
                <span className="font-mono">Compiled professional tree array //</span>
                <span className="font-mono text-orange-400 font-semibold uppercase flex items-center gap-1.5 cursor-pointer hover:text-orange-350" onClick={() => setActiveTab("printable")}>
                  Open print preview
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Side column: Academic record, certifications, credentials cards */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Academics Card */}
              <div className="p-6 rounded-xl border border-zinc-900/60 bg-[#121212]/30 relative overflow-hidden flex-1">
                <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-orange-500/5 blur-xl pointer-events-none" />

                <h3 className="text-sm font-display font-medium text-white mb-4 flex items-center gap-2">
                  <GraduationCap className="w-4.5 h-4.5 text-orange-400" />
                  Academic Foundation
                </h3>

                <div className="space-y-4">
                  {education.map((edu, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                        <span>{edu.institution}</span>
                        <span>{edu.period}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-zinc-200">
                        {edu.degree}
                      </h4>
                      <p className="text-[11px] text-zinc-450 leading-relaxed font-sans">
                        {edu.major}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications and credentials Card */}
              <div className="p-6 rounded-xl border border-zinc-900/60 bg-[#121212]/30 relative overflow-hidden flex-1">
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-orange-500/5 blur-xl pointer-events-none" />

                <h3 className="text-sm font-display font-medium text-white mb-4 flex items-center gap-2">
                  <Award className="w-4.5 h-4.5 text-orange-400" />
                  Awards & Validated Badges
                </h3>

                <div className="space-y-2.5">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="flex gap-2 text-[11px] text-zinc-400 bg-zinc-950 border border-zinc-900 p-2.5 rounded-lg hover:border-orange-500/20 transition-all">
                      <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
