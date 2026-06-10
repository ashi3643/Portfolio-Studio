import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  DEFAULT_PORTFOLIO_DATA, 
  PortfolioData 
} from "./data/portfolio";
import ParticleBackground from "./components/ParticleBackground";
import ProjectShowcase from "./components/ProjectShowcase";
import SkillsCosmos from "./components/SkillsCosmos";
import TerminalContact from "./components/TerminalContact";
import StudioControlPanel from "./components/StudioControlPanel";
import ResumeHub from "./components/ResumeHub";
import PhysicalLoader from "./components/PhysicalLoader";
import { 
  Sparkles, Cpu, Layers, Terminal, ArrowUpRight, 
  Activity, User, Code2, ArrowRight, Eye 
} from "lucide-react";

export default function App() {
  const [loading, setLoading] = useState(true);

  // Load initial portfolio configuration with localStorage durability
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(() => {
    const backupStr = localStorage.getItem("ashish_portfolio_data_v5");
    if (backupStr) {
      try {
        const parsed = JSON.parse(backupStr);
        if (parsed.name && parsed.projects) {
          return {
            ...DEFAULT_PORTFOLIO_DATA,
            ...parsed,
            projects: Array.isArray(parsed.projects) ? parsed.projects : DEFAULT_PORTFOLIO_DATA.projects,
            skills: Array.isArray(parsed.skills) ? parsed.skills : DEFAULT_PORTFOLIO_DATA.skills,
            allFields: Array.isArray(parsed.allFields) ? parsed.allFields : DEFAULT_PORTFOLIO_DATA.allFields,
          };
        }
      } catch (err) {
        console.warn("Stale local storage data, reverting to standard portfolio default state.");
      }
    }
    return DEFAULT_PORTFOLIO_DATA;
  });

  // Track the active Persona Emulator (toggles visual preset highlights)
  const [activePersona, setActivePersona] = useState<string>(portfolioData.currentField);

  // Keep activePersona sync'd if the user edits the main currentField directly in Studio Editor
  useEffect(() => {
    setActivePersona(portfolioData.currentField);
  }, [portfolioData.currentField]);

  // Ensure the page starts at the top on first load, avoiding browser scroll restoration into the contact section
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      if (window.location.hash === "#contact-section") {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }
  }, []);

  // Persist state updates
  const handleUpdatePortfolio = (newConfig: PortfolioData) => {
    setPortfolioData(newConfig);
    localStorage.setItem("ashish_portfolio_data_v5", JSON.stringify(newConfig));
  };

  // Revert defaults
  const handleRevertDefaults = () => {
    setPortfolioData(DEFAULT_PORTFOLIO_DATA);
    localStorage.setItem("ashish_portfolio_data_v5", JSON.stringify(DEFAULT_PORTFOLIO_DATA));
    setActivePersona(DEFAULT_PORTFOLIO_DATA.currentField);
  };

  // Inline dynamic story translation based on Persona
  const getPersonaAdaptedStory = () => {
    if (activePersona === portfolioData.currentField) {
      return portfolioData.story;
    }
    
    // Fallback simulation text demonstrating full multi-career versatility if they change fields!
    if (activePersona === "Creative Frontend Engineer") {
      return "Combining pure fluid layout math with extreme pixel optimization. When acting as a Creative Frontend Engineer, my focus shifts toward developing natural screen interactions, hardware-accelerated starfields, and clean styling layers. I prioritize fluid coordinate motion (motion/react), deep canvas-level rendering, and modular file systems that support solid 60 FPS interfaces across all responsive scopes.";
    }
    
    if (activePersona === "Full-Stack AI Architect") {
      return "Engineering core server routers, setting up robust pipeline middleware, and securing LLM model API tokens. As a Full-Stack AI Architect, I coordinate both high-society backend Express structures and rich client representations. I optimize multi-agentic reasoning streams, implement secured proxy routes to hide secrets, and configure modular deployment files that scale flawlessly.";
    }

    return portfolioData.story;
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden grid-mesh">
      {/* Dynamic Physics Loader Overlay */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="physical-quantum-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <PhysicalLoader onComplete={() => setLoading(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Background */}
      <ParticleBackground />

      {/* Floating Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-orange-600/5 glowing-orbs animate-pulse-slow" />
      <div className="absolute top-3/4 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-600/5 glowing-orbs animate-pulse-slow" style={{ animationDelay: "4s" }} />

      {/* Navigation Shell */}
      <header className="relative z-20 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-10 h-10 rounded-full border border-orange-500 flex items-center justify-center font-serif font-semibold text-sm text-orange-500 shadow-md shadow-orange-500/10">
              A
            </div>
            <div>
              <span className="font-display font-medium text-xs tracking-[0.2em] uppercase text-white block leading-none">
                {portfolioData.name}
              </span>
              <span className="text-[9px] font-mono text-zinc-500 mt-1 block tracking-wider uppercase leading-none">
                Node {portfolioData.currentField}
              </span>
            </div>
          </motion.div>

          {/* Nav Jumps */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-zinc-400 font-bold">
            <a href="#projects-section" className="hover:text-orange-500 transition-colors">
              <span className="text-orange-500/70 mr-0.5">// 01.</span> Projects
            </a>
            <a href="#skills-section" className="hover:text-orange-500 transition-colors">
              <span className="text-orange-500/70 mr-0.5">// 02.</span> Skills
            </a>
            <a href="#about-story-section" className="hover:text-orange-500 transition-colors">
              <span className="text-orange-500/70 mr-0.5">// 03.</span> Story
            </a>
            <a href="#resume-section" className="hover:text-orange-500 transition-colors">
              <span className="text-orange-500/70 mr-0.5">// 04.</span> Resume
            </a>
            <a href="#contact-section" className="hover:text-orange-500 transition-colors">
              <span className="text-orange-500/70 mr-0.5">// 05.</span> Terminal
            </a>
          </nav>

          {/* Control Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] uppercase font-mono text-zinc-400 bg-zinc-900 border border-zinc-900 px-2 py-1 rounded hidden sm:inline-block">
              PORT: 3000
            </span>
          </div>
        </div>
      </header>

      {/* Hero / Landing Stage */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-12">
        <motion.div 
          className="max-w-3xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
              }
            }
          }}
        >
          {/* Working Title Capsule */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
            }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-orange-950/20 border border-orange-500/30 rounded-full text-xs font-mono text-orange-300"
          >
            <Cpu className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>Currently working as of 2026: <strong className="text-white font-medium">{portfolioData.currentField}</strong></span>
          </motion.div>

          {/* Hero Heading name */}
          <motion.h1 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-display font-light tracking-tight text-white mt-6 leading-tight serif italic"
          >
            Ashish <br/>
            <span className="not-italic font-bold tracking-tight text-zinc-100 uppercase text-4xl sm:text-5xl md:text-6xl xl:text-7xl block mt-2">Kumar Thyadi</span>
          </motion.h1>

          {/* Subheading dynamic role highlight */}
          <motion.div
            id="role-marquee"
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
            }}
            className="text-2xl sm:text-3xl xl:text-4xl font-display font-light text-zinc-400 mt-4 flex items-center gap-2.5 flex-wrap serif"
          >
            <span className="italic">I synthesize</span>
            <span className="text-orange-500 font-semibold border-b border-orange-500/30 not-italic font-sans text-xl sm:text-2xl tracking-wide uppercase">
              {activePersona}
            </span>
            <span className="italic">experiences.</span>
          </motion.div>

          {/* Bio text */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
            }}
            className="text-zinc-400 text-sm sm:text-base leading-relaxed mt-6 max-w-xl font-sans"
          >
            {portfolioData.bio}
          </motion.p>

          {/* CTA Buttons row */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
            }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <a 
              href="#projects-section"
              className="px-5 py-2.5 text-xs font-mono font-bold rounded-lg bg-orange-500 hover:bg-orange-400 text-black shadow-lg shadow-orange-500/10 flex items-center gap-2 group transition-all"
            >
              <span>Review Achievements</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#contact-section"
              className="px-5 py-2.5 text-xs font-mono rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-750 transition-all flex items-center gap-2"
            >
              <Terminal className="w-4 h-4 text-orange-500" />
              <span>Establish Link</span>
            </a>
          </motion.div>

          {/* Interactive "Field Shift Emulator" Simulator */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="mt-14 p-5 rounded-xl border border-zinc-900 bg-[#121212]/30 relative overflow-hidden"
          >
            <div className="absolute -right-20 -bottom-20 w-44 h-44 rounded-full bg-orange-500/5 blur-xl" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs uppercase font-mono tracking-wider text-orange-500 flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  Showcase Field Shifter Emulator
                </h4>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-sm">
                  Click a role state to simulate how my portfolio values, bio, highlights, and filters adapt if I shift fields.
                </p>
              </div>

              {/* Persona Select custom buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {portfolioData.allFields.map((field) => (
                  <button
                    id={`persona-emulator-${field.replace(/\s+/g, "-").toLowerCase()}`}
                    key={field}
                    onClick={() => setActivePersona(field)}
                    className={`px-3 py-1.5 text-[10px] font-mono rounded-lg border transition-all cursor-pointer ${
                      activePersona === field
                        ? "bg-orange-950/40 border-orange-500 text-orange-400"
                        : "bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-350 hover:border-zinc-800"
                    }`}
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Main Container Components Column */}
      <main className="max-w-7xl mx-auto px-6 relative z-10 pb-24">
        
        {/* Project Gallery Module */}
        <ProjectShowcase projects={portfolioData.projects} />

        {/* Skills Metrix Cosmos */}
        <SkillsCosmos skills={portfolioData.skills} />

        {/* Dynamic Story Narrative Space */}
        <div id="about-story-section" className="my-16 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-zinc-800/60">
            <div>
              <h2 className="text-3xl font-display font-light tracking-tight text-white flex items-center gap-2 serif">
                <span className="text-orange-500 font-mono text-xl mr-1">// 03.</span>
                <span className="italic">My</span> Story
              </h2>
              <p className="text-zinc-400 mt-2 max-w-xl text-sm font-sans">
                The career trajectory and technical narrative defining my approach to development.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Visual Milestones timeline on left */}
            <div className="md:col-span-4 bg-[#121212]/30 border border-zinc-900 p-5 rounded-xl space-y-4 font-mono text-xs">
              <h4 className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">Historical Benchmarks</h4>
              
              <div className="relative border-l border-zinc-800 pl-4 ml-1 space-y-5 py-1">
                <div className="relative border-subtle">
                  <div className="absolute -left-[20.5px] top-1.5 w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-[10px] text-zinc-500">2026 - CURRENT</span>
                  <span className="font-semibold text-zinc-200 block text-xs mt-0.5">{portfolioData.currentField}</span>
                  <span className="text-[10px] text-zinc-500">Fine-tuning user interfaces & agent structures</span>
                </div>
                <div className="relative border-subtle">
                  <div className="absolute -left-[20.5px] top-1.5 w-2 h-2 rounded-full bg-zinc-800" />
                  <span className="text-[10px] text-zinc-500">2024 - 2025</span>
                  <span className="font-semibold text-zinc-300 block text-xs mt-0.5">Frontend Enthusiast</span>
                  <span className="text-[10px] text-zinc-500">Developing responsive React pages & micro sites</span>
                </div>
                <div className="relative border-subtle">
                  <div className="absolute -left-[20.5px] top-1.5 w-2 h-2 rounded-full bg-zinc-800" />
                  <span className="text-[10px] text-zinc-500">2022 - 2023</span>
                  <span className="font-semibold text-zinc-300 block text-xs mt-0.5">Computer Science Major</span>
                  <span className="text-[10px] text-zinc-500">Acquiring algorithms, structures, and CLI standards</span>
                </div>
              </div>
            </div>

            {/* Polished interactive story on right */}
            <div className="md:col-span-8 p-6 rounded-xl border border-zinc-800/60 bg-[#121212]/30 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-orange-500/5 blur-xl animate-pulse" />
              
              <div className="flex items-center gap-1.5 mb-4 text-[11px] font-mono text-orange-500">
                <User className="w-3.5 h-3.5" />
                <span>Persona State: [{activePersona}] Transcript</span>
              </div>

              {/* Rich text narration representation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePersona}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 text-zinc-300 text-sm leading-relaxed"
                >
                  <p className="indent-8 font-sans">
                    {getPersonaAdaptedStory()}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Quote Footer accent */}
              <div className="pt-5 mt-5 border-t border-zinc-900 border-dashed flex justify-between items-center text-[10px] font-mono text-zinc-500">
                <span>Ashish Kumar Thyadi</span>
                <span>Verified digital log //</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Hub Executive Module */}
        <ResumeHub portfolioData={portfolioData} />

        {/* Terminal Interactive Contact Module */}
        <TerminalContact />

      </main>

      {/* Futuristic footer credentials */}
      <footer className="relative z-10 border-t border-zinc-900/40 bg-black/40 py-8 text-center text-xs text-zinc-600 font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 Ashish Kumar Thyadi. All systems operational.</span>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/ashi3643" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-orange-400 transition-colors flex items-center gap-1"
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a 
              href="https://linkedin.com/in/ashish-kumar-thyadi-30b9b0267" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-orange-400 transition-colors flex items-center gap-1"
            >
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modular Studio Control drawer for direct customizations */}
      <StudioControlPanel 
        portfolioData={portfolioData}
        onUpdate={handleUpdatePortfolio}
        onReset={handleRevertDefaults}
      />
    </div>
  );
}
