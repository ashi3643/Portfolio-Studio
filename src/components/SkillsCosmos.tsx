import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrainCircuit, Laptop, Server, Wrench, Sparkles, Flame, Search } from "lucide-react";
import { Skill } from "../data/portfolio";

interface SkillsCosmosProps {
  skills: Skill[];
}

export default function SkillsCosmos({ skills }: SkillsCosmosProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    { name: "All", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { name: "AI/ML", icon: <BrainCircuit className="w-3.5 h-3.5" /> },
    { name: "Frontend", icon: <Laptop className="w-3.5 h-3.5" /> },
    { name: "Backend", icon: <Server className="w-3.5 h-3.5" /> },
    { name: "Tools", icon: <Wrench className="w-3.5 h-3.5" /> },
  ];

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory = activeCategory === "All" || skill.category === activeCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate stats to show developer depth
  const activeFocus = filteredSkills.length > 0 
    ? filteredSkills.reduce((prev, current) => (prev.proficiency > current.proficiency) ? prev : current)
    : null;

  return (
    <div id="skills-section" className="relative z-10 my-16">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-4 border-b border-zinc-900">
        <div>
          <h2 className="text-3xl font-display font-light tracking-tight text-white flex items-center gap-2 serif">
            <span className="text-orange-500 font-mono text-xl mr-1">// 02.</span>
            Technical <span className="italic">Expertise</span>
          </h2>
          <p className="text-zinc-400 mt-2 max-w-xl text-sm font-sans">
            Tuning performance across modern styling platforms, managing core LLM parameters, and running full-stack integration pipelines.
          </p>
        </div>

        {/* Search & Stats Pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Quick search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
            <input
              id="skill-search"
              type="text"
              placeholder="Query technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 pl-9 pr-4 py-1.5 bg-zinc-950 border border-zinc-900 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-mono transition-colors"
            />
          </div>

          {activeFocus && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/40 border border-zinc-850 rounded-lg text-[11px] font-mono text-zinc-450">
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
              <span>Core Expert: <strong className="text-zinc-200">{activeFocus.name}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Category selector capsules */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6">
        {categories.map((cat) => (
          <button
            id={`skill-cat-${cat.name.replace("/", "-").toLowerCase()}`}
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono rounded-lg border transition-all shrink-0 cursor-pointer ${
              activeCategory === cat.name
                ? "bg-orange-950/40 border-orange-500/50 text-orange-400"
                : "bg-zinc-950/50 border-zinc-900 text-zinc-400 hover:text-orange-400 hover:border-zinc-800"
            }`}
          >
            {cat.icon}
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Grid view of capsule meters */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill, idx) => (
            <motion.div
              layout
              id={`skill-card-${skill.id}`}
              key={skill.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: idx * 0.02 }}
              className="group relative flex flex-col justify-between p-4 bg-[#121212]/35 border border-zinc-900 rounded-xl hover:border-orange-500/35 hover:bg-[#151515] transition-all overflow-hidden shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-zinc-200 group-hover:text-orange-400 transition-colors">
                  {skill.name}
                </span>
                <span className="text-[10px] uppercase font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">
                  {skill.category}
                </span>
              </div>

              <div>
                {/* Visual meter percentage bar */}
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-1">
                  <span>Proficiency Level</span>
                  <span>{skill.proficiency}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-910">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.proficiency}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.03 }}
                    className="h-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State query alert */}
      {filteredSkills.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-zinc-900 bg-zinc-950/50"
        >
          <span className="text-2xl">📡</span>
          <h4 className="text-zinc-300 font-mono text-sm mt-3 font-semibold">No skill modules matched</h4>
          <p className="text-zinc-500 text-xs mt-1 text-center max-w-xs leading-relaxed">
            Refine your query query string or select "All" to view the holistic skills list.
          </p>
        </motion.div>
      )}
    </div>
  );
}
