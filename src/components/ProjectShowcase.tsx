import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Folder, ExternalLink, Github, Terminal, Cpu, Layers, Code2, CheckCircle2, ChevronRight, X, Sparkles } from "lucide-react";
import { Project } from "../data/portfolio";

// High-cohesion helper to calculate human-friendly relative dates
const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return "updated recently";
  try {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    if (diffMs < 0) return "Just now";
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return diffMins <= 1 ? "just now" : `updated ${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `updated ${diffHours}h ago`;
    } else if (diffDays < 30) {
      return `updated ${diffDays}d ago`;
    } else {
      const formatted = past.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
      return `updated ${formatted}`;
    }
  } catch (e) {
    return "updated recently";
  }
};

interface ProjectShowcaseProps {
  projects: Project[];
}

export default function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const [filter, setFilter] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "code">("details");

  const categories = ["All", "AI", "Research", "Frontend", "Web"];

  const filteredProjects = projects.filter((project) => {
    if (filter === "All") return true;
    return project.category.toLowerCase() === filter.toLowerCase() || 
           project.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()));
  });

  return (
    <div id="projects-section" className="relative z-10 my-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-zinc-900">
        <div>
          <h2 className="text-3xl font-display font-light tracking-tight text-white flex items-center gap-2 serif">
            <span className="text-orange-500 font-mono text-xl mr-1">// 01.</span>
            Selected <span className="italic">Works</span>
          </h2>
          <p className="text-zinc-400 mt-2 max-w-xl text-sm font-sans">
            Handcrafted interactive prototypes, generative AI solutions, and visual performance utilities built to push technology boundaries.
          </p>
        </div>

        {/* Categories Tab Pill Selector with Sliding spring momentum */}
        <div className="flex items-center gap-1 mt-6 md:mt-0 flex-wrap bg-[#0c0c0c]/80 border border-zinc-900/60 p-1.5 rounded-xl">
          {categories.map((cat) => {
            const isActive = filter === cat;
            return (
              <button
                id={`filter-btn-${cat.toLowerCase()}`}
                key={cat}
                onClick={() => setFilter(cat)}
                className="relative px-3.5 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer overflow-hidden outline-none"
              >
                <span className={`relative z-10 transition-colors duration-250 ${
                  isActive ? "text-orange-400 font-bold" : "text-zinc-500 hover:text-orange-300"
                }`}>
                  {cat}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-orange-950/40 border border-orange-500/30 rounded-lg pointer-events-none"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid with fluid layout transition states */}
      <motion.div 
        layout 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((p, idx) => (
            <motion.div
              layout
              id={`project-card-${p.id}`}
              key={p.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ 
                type: "spring", 
                stiffness: 240, 
                damping: 22,
                layout: { type: "spring", stiffness: 220, damping: 24 }
              }}
              whileHover={{ 
                y: -6, 
                scale: 1.02,
              }}
              className="group relative flex flex-col justify-between h-full rounded-xl border border-zinc-800/80 hover:border-orange-500/40 bg-[#121212]/35 p-6 hover:bg-[#141414] overflow-hidden cursor-pointer shadow-xl shadow-black/80 transition-all duration-300"
              onClick={() => {
                setSelectedProject(p);
                setActiveTab("details");
              }}
            >
              {/* Radial warm ambient light on hover states */}
              <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-orange-500/[0.02] group-hover:bg-orange-500/10 transition-colors duration-500 blur-2xl" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-850 group-hover:border-orange-500/30 transition-colors">
                    <Folder className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    {p.githubUrl && <Github className="w-4 h-4 hover:text-orange-500" />}
                    <ExternalLink className="w-4 h-4 hover:text-orange-500" />
                  </div>
                </div>

                {/* Header Metadata block with Pulsing Status Indicator */}
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-orange-450 bg-orange-950/20 border border-orange-900/40 px-2 py-0.5 rounded-md">
                    {p.category}
                  </span>
                  
                  {/* Dynamic Last Updated Metric */}
                  <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5 leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    {formatRelativeTime(p.updatedAt)}
                  </span>
                </div>

                <h3 className="text-lg font-display font-medium text-white group-hover:text-orange-300 transition-colors">
                  {p.title}
                </h3>

                <p className="text-zinc-400 text-xs leading-relaxed mt-2.5 line-clamp-3">
                  {p.description}
                </p>
              </div>

              <div>
                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {p.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] font-mono text-zinc-500 bg-zinc-900/50 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                  {p.tags.length > 3 && (
                    <span className="text-[10px] font-mono text-zinc-600 px-1 py-0.5">
                      +{p.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Bottom Trigger Indicator */}
                <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-zinc-900 group-hover:border-zinc-800 text-[11px] font-mono text-zinc-500 group-hover:text-orange-400 transition-all">
                  <span>View Technical Story</span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Expanded Story Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-800/80 bg-zinc-950 p-6 md:p-8 shadow-2xl shadow-orange-950/5"
            >
              {/* Floating Close Button */}
              <button
                id="close-modal-btn"
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="mb-6 mr-10">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <span className="text-xs uppercase font-mono text-orange-400 bg-orange-950/30 border border-orange-900/50 px-2.5 py-0.5 rounded">
                    {selectedProject.category}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-550 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-550 animate-pulse" />
                    {formatRelativeTime(selectedProject.updatedAt)}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-semibold text-white serif italic">
                  {selectedProject.title}
                </h2>
                <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Dynamic Performance Metrics */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-900/60 mb-6">
                {selectedProject.metrics.map((met, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                      {met.label}
                    </span>
                    <span className="text-sm md:text-lg font-mono font-medium text-orange-400 mt-0.5">
                      {met.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Story vs Code Tabs */}
              <div className="flex items-center border-b border-zinc-800 mb-6 font-mono text-xs">
                <button
                  id="tab-details"
                  onClick={() => setActiveTab("details")}
                  className={`pb-3.5 px-4 -mb-px flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === "details"
                      ? "border-b-2 border-orange-500 text-orange-400 font-medium"
                      : "text-zinc-500 hover:text-zinc-350"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  Engineering Details
                </button>
                {selectedProject.codeSnippet && (
                  <button
                    id="tab-code"
                    onClick={() => setActiveTab("code")}
                    className={`pb-3.5 px-4 -mb-px flex items-center gap-2 transition-all cursor-pointer ${
                      activeTab === "code"
                        ? "border-b-2 border-orange-500 text-orange-400 font-medium"
                        : "text-zinc-500 hover:text-zinc-350"
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    Interactive Code Sample
                  </button>
                )}
              </div>

              {/* Tab Contents */}
              <div className="min-h-[250px]">
                {activeTab === "details" ? (
                  <div className="space-y-6">
                    {/* The Backstory */}
                    <div>
                      <h4 className="text-xs uppercase font-mono text-zinc-400 tracking-wider mb-2 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-orange-400" />
                        The Technical Challenge & Backstory
                      </h4>
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        {selectedProject.story}
                      </p>
                    </div>

                    {/* Highlights */}
                    <div>
                      <h4 className="text-xs uppercase font-mono text-zinc-400 tracking-wider mb-2 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-orange-400" />
                        Architectural Highlights
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {selectedProject.keyFeatures.map((feat, idx) => (
                          <div key={idx} className="flex gap-2.5 text-xs text-zinc-400 bg-zinc-900/20 border border-zinc-900/60 p-3 rounded-lg">
                            <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Full Stack Tech list */}
                    <div>
                      <h4 className="text-xs uppercase font-mono text-zinc-500 tracking-wider mb-2">
                        Technology Blueprint
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((tag) => (
                          <span key={tag} className="text-xs font-mono bg-[#161616] text-zinc-300 border border-zinc-900 px-3 py-1 rounded-lg">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-orange-400 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 animate-pulse" />
                        Live Implementation Logic excerpt
                      </span>
                    </div>
                    <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-4 font-mono text-xs overflow-x-auto text-zinc-300 max-h-[350px]">
                      <pre className="whitespace-pre">{selectedProject.codeSnippet}</pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-zinc-900">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 font-mono text-xs flex items-center gap-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
                  >
                    <Github className="w-4 h-4" />
                    Source Code
                  </a>
                )}
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 font-mono text-xs flex items-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold shadow-md shadow-orange-500/10 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Launch Prototype
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
