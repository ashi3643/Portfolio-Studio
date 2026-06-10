import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Settings, X, Sparkles, Plus, Trash2, Download, Upload, 
  RefreshCw, Check, AlertTriangle, Eye, EyeOff, LayoutTemplate 
} from "lucide-react";
import { PortfolioData, Project, Skill } from "../data/portfolio";

interface StudioControlPanelProps {
  portfolioData: PortfolioData;
  onUpdate: (data: PortfolioData) => void;
  onReset: () => void;
}

export default function StudioControlPanel({ 
  portfolioData, 
  onUpdate, 
  onReset 
}: StudioControlPanelProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(new URLSearchParams(window.location.search).get('admin') === 'true');
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "projects" | "skills" | "backup">("profile");
  
  // AI loader states
  const [isEnhancingStory, setIsEnhancingStory] = useState(false);
  const [isGeneratingProject, setIsGeneratingProject] = useState(false);
  const [aiStoryTone, setAiStoryTone] = useState("professional yet creative");
  const [aiStoryKeywords, setAiStoryKeywords] = useState("");
  const [aiPromptError, setAiPromptError] = useState<string | null>(null);

  // New Project Form state
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    category: "AI",
    tags: [],
    description: "",
    story: "",
    githubUrl: "",
    liveUrl: "",
    metrics: [{ label: "User adoption", value: "+12%" }],
    keyFeatures: ["Feature 1"]
  });

  // Current tags helper input
  const [tagsInput, setTagsInput] = useState("");

  // New Skill Form State
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    name: "",
    proficiency: 80,
    category: "AI/ML"
  });

  // Toast confirmation feedback
  const [saveIndicator, setSaveIndicator] = useState<string | null>(null);

  const triggerNotification = (msg: string) => {
    setSaveIndicator(msg);
    setTimeout(() => setSaveIndicator(null), 3000);
  };

  // 1. Profile / Story updates
  const handleProfileFieldChange = (field: keyof PortfolioData, value: any) => {
    const updated = { ...portfolioData, [field]: value };
    onUpdate(updated);
  };

  // AI Refine Story Call
  const handleAiRefineStory = async () => {
    setIsEnhancingStory(true);
    setAiPromptError(null);
    try {
      const response = await fetch("/api/ai/refine-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: portfolioData.name,
          rawStory: portfolioData.story,
          field: portfolioData.currentField,
          tone: aiStoryTone,
          keywords: aiStoryKeywords
        })
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("AI features are unavailable on static hosting (GitHub Pages) as they require a server backend. To use AI, run this inside the AI Studio Dev/Share environment or deploy to a Node.js dynamic host like Cloud Run.");
        }
        throw new Error(`Server returned error status ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Did not receive JSON response from server. AI features require an active Node.js server running.");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || result.details || "Gemini engine failed to respond.");
      }

      handleProfileFieldChange("story", result.refinedStory);
      triggerNotification("✨ Story enhanced with Gemini!");
    } catch (err: any) {
      console.error(err);
      setAiPromptError(err.message || "Connection timed out");
    } finally {
      setIsEnhancingStory(false);
    }
  };

  // AI Project Autocomplete Call
  const handleAiSuggestProject = async () => {
    if (!newProject.title) {
      setAiPromptError("Please provide a Project Title before activating AI Autocomplete.");
      return;
    }
    setIsGeneratingProject(true);
    setAiPromptError(null);
    try {
      const response = await fetch("/api/ai/suggest-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectTitle: newProject.title,
          category: newProject.category,
          tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean)
        })
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("AI features are unavailable on static hosting (GitHub Pages) as they require a server backend. To use AI, run this inside the AI Studio Dev/Share environment or deploy to a Node.js dynamic host like Cloud Run.");
        }
        throw new Error(`Server returned error status ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Did not receive JSON response from server. AI features require an active Node.js server running.");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to suggest project blueprint.");
      }

      const { description, metrics, keyFeatures, story } = result.data;
      setNewProject(prev => ({
        ...prev,
        description: description || prev.description,
        story: story || prev.story,
        metrics: metrics || prev.metrics,
        keyFeatures: keyFeatures || prev.keyFeatures
      }));
      triggerNotification("🪄 Project generated via AI!");
    } catch (err: any) {
      console.error(err);
      setAiPromptError(err.message || "Failed to prompt model");
    } finally {
      setIsGeneratingProject(false);
    }
  };

  // 2. Add Project
  const handleAddProject = () => {
    if (!newProject.title || !newProject.description) {
      setAiPromptError("Title and Description are required to commit project.");
      return;
    }
    const slugId = "p_" + Date.now();
    const finalTags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    const added: Project = {
      id: slugId,
      title: newProject.title,
      description: newProject.description,
      category: (newProject.category as any) || "AI",
      tags: finalTags.length > 0 ? finalTags : ["React", "AI"],
      githubUrl: newProject.githubUrl || "",
      liveUrl: newProject.liveUrl || "",
      metrics: newProject.metrics || [],
      keyFeatures: newProject.keyFeatures || [],
      story: newProject.story || "A custom prototype built by Ashish Kumar Thyadi.",
      codeSnippet: newProject.codeSnippet || "// Sample Source Layout\nexport default function module() {\n  return <div>Custom node code</div>;\n}",
      updatedAt: new Date().toISOString()
    };

    onUpdate({
      ...portfolioData,
      projects: [added, ...portfolioData.projects]
    });

    // Reset Form
    setNewProject({
      title: "",
      category: "AI",
      tags: [],
      description: "",
      story: "",
      githubUrl: "",
      liveUrl: "",
      metrics: [{ label: "User adoption", value: "+12%" }],
      keyFeatures: ["Feature 1"]
    });
    setTagsInput("");
    triggerNotification("🚀 Project committed successfully!");
  };

  // Delete Project
  const handleDeleteProject = (id: string) => {
    onUpdate({
      ...portfolioData,
      projects: portfolioData.projects.filter(p => p.id !== id)
    });
    triggerNotification("🗑️ Project deleted");
  };

  // 3. Add Skill
  const handleAddSkill = () => {
    if (!newSkill.name) return;
    const added: Skill = {
      id: "s_" + Date.now(),
      name: newSkill.name,
      proficiency: Number(newSkill.proficiency) || 80,
      category: (newSkill.category as any) || "AI/ML"
    };

    onUpdate({
      ...portfolioData,
      skills: [...portfolioData.skills, added]
    });

    setNewSkill({ name: "", proficiency: 80, category: "AI/ML" });
    triggerNotification("⚡ Skill mapped successfully!");
  };

  // Delete Skill
  const handleDeleteSkill = (id: string) => {
    onUpdate({
      ...portfolioData,
      skills: portfolioData.skills.filter(s => s.id !== id)
    });
    triggerNotification("🗑️ Skill deleted");
  };

  // 4. Portability: Export JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(portfolioData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `portfolio_config_ashish.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerNotification("💾 Exported file portfolio_config_ashish.json downloaded!");
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.name && parsed.projects && parsed.skills) {
          onUpdate(parsed);
          triggerNotification("📂 Portfolio parsed and updated!");
        } else {
          throw new Error("Missing required profile fields (name, projects, skills).");
        }
      } catch (err: any) {
        setAiPromptError("JSON parse error: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  if (!isAdmin) return null;

  return (
    <div id="studio-editor-layer">
      {/* Floating control trigger pill */}
      <button
        id="studio-toggle-btn"
        className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-orange-500 hover:bg-orange-400 text-black font-mono text-xs font-semibold flex items-center gap-2 shadow-lg shadow-orange-500/20 shadow-neutral-950 transition-all border border-orange-400 group cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Settings className="w-4 h-4 animate-spin-slow group-hover:rotate-45 transition-transform" />
        <span>Portfolio Studio</span>
        {isOpen ? <X className="w-3 h-3 ml-1" /> : <Eye className="w-3.5 h-3.5 ml-1 animate-pulse" />}
      </button>

      {/* Editor slide-out dashboard */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-y-0 right-0 z-40 w-full max-w-lg bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col justify-between">
            {/* Header */}
            <div className="p-6 border-b border-zinc-900 bg-zinc-950/90 backdrop-blur-md sticky top-0 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-mono font-semibold text-orange-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <LayoutTemplate className="w-4 h-4" />
                  Visual Config Studio
                </h3>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Tune Ashish's professional persona on-the-fly. Changes reflect in real-time.
                </p>
              </div>
              <button
                id="close-studio-btn"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub Tabs Selection */}
            <div className="flex border-b border-zinc-900 bg-zinc-950 font-mono text-[10px] uppercase">
              {(["profile", "projects", "skills", "backup"] as const).map((tab) => (
                <button
                  id={`studio-tab-${tab}`}
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={`flex-1 py-3 text-center transition-all cursor-pointer ${
                    activeSubTab === tab
                      ? "bg-zinc-900 text-orange-400 font-medium border-b border-orange-500"
                      : "text-zinc-500 hover:text-zinc-350"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Scrollable inputs panel */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {saveIndicator && (
                <div className="p-2.5 bg-emerald-950/30 border border-emerald-900 text-emerald-400 font-mono text-[10px] rounded-lg">
                  {saveIndicator}
                </div>
              )}

              {aiPromptError && (
                <div className="p-2.5 bg-red-950/30 border border-red-900 text-red-400 font-mono text-[10px] rounded-lg flex gap-2 items-center">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{aiPromptError}</span>
                </div>
              )}

              {/* 1. Profile Panel */}
              {activeSubTab === "profile" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Developer name</label>
                    <input
                      id="studio-input-name"
                      type="text"
                      value={portfolioData.name}
                      onChange={(e) => handleProfileFieldChange("name", e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Current Job Title / Field</label>
                    <input
                      id="studio-input-field"
                      type="text"
                      value={portfolioData.currentField}
                      onChange={(e) => handleProfileFieldChange("currentField", e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                      placeholder="e.g. AI Junior Developer"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <span className="text-[9px] font-mono text-zinc-600 block mr-1 mt-0.5">Quick Roles:</span>
                      {portfolioData.allFields.map(role => (
                        <button
                          key={role}
                          onClick={() => handleProfileFieldChange("currentField", role)}
                          className="px-1.5 py-0.5 text-[9px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800 rounded hover:text-white"
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Intro short Bio</label>
                    <textarea
                      id="studio-input-bio"
                      rows={2}
                      value={portfolioData.bio}
                      onChange={(e) => handleProfileFieldChange("bio", e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 focus:outline-none focus:border-orange-500 leading-relaxed font-sans"
                    />
                  </div>

                  {/* Story Text with Gemini integration */}
                  <div className="pt-2 border-t border-zinc-900">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-mono text-zinc-500 uppercase">My Story Narrative Transcript</label>
                      <span className="text-[10px] font-mono text-orange-400 font-medium">✨ Powered by Gemini</span>
                    </div>
                    <textarea
                      id="studio-input-story"
                      rows={6}
                      value={portfolioData.story}
                      onChange={(e) => handleProfileFieldChange("story", e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 focus:outline-none focus:border-orange-500 leading-relaxed font-sans"
                    />

                    {/* AI Configuration Box */}
                    <div className="mt-2.5 p-3 rounded-lg bg-zinc-900/40 border border-zinc-900 space-y-2.5">
                      <h4 className="text-[10px] font-mono text-zinc-400 uppercase flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                        AI Narrative Writer configuration
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[8px] font-mono text-zinc-500 uppercase mb-0.5">Tone style</label>
                          <select
                            id="ai-tone-select"
                            value={aiStoryTone}
                            onChange={(e) => setAiStoryTone(e.target.value)}
                            className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300 rounded font-mono"
                          >
                            <option value="professional yet creative">Prof & Creative</option>
                            <option value="highly technical & minimalist">Core Hacker</option>
                            <option value="academic, thorough and structural">Academic Tech</option>
                            <option value="visionary and modern startup style">Founders Pitch</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[8px] font-mono text-zinc-500 uppercase mb-0.5">Focus Keywords (opt)</label>
                          <input
                            id="ai-keywords-input"
                            type="text"
                            placeholder="e.g. agentic, reactive, css3"
                            value={aiStoryKeywords}
                            onChange={(e) => setAiStoryKeywords(e.target.value)}
                            className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300 rounded font-mono"
                          />
                        </div>
                      </div>

                      <button
                        id="run-ai-beautify"
                        onClick={handleAiRefineStory}
                        disabled={isEnhancingStory || !portfolioData.story}
                        className="w-full py-1.5 bg-orange-950/40 hover:bg-orange-900/60 border border-orange-500/30 text-orange-300 rounded font-mono text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isEnhancingStory ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>AI Reorganizing Narrative...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-orange-300" />
                            <span>Optimize Narrative For [{portfolioData.currentField}]</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Projects Panel */}
              {activeSubTab === "projects" && (
                <div className="space-y-6">
                  {/* Commited list */}
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Committed Ledger ({portfolioData.projects.length})</label>
                    <div className="space-y-2">
                      {portfolioData.projects.map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-2.5 bg-zinc-900/40 border border-zinc-900 rounded text-xs">
                          <div className="truncate pr-4">
                            <span className="font-semibold text-zinc-300 block truncate">{p.title}</span>
                            <span className="text-[10px] font-mono text-orange-400">{p.category}</span>
                          </div>
                          <button
                            id={`delete-project-${p.id}`}
                            onClick={() => handleDeleteProject(p.id)}
                            className="p-1 px-1.5 text-[10px] text-red-400 bg-red-950/20 border border-red-900/30 rounded hover:bg-red-950/60 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add New project Card form */}
                  <div className="pt-4 border-t border-zinc-900 space-y-3.5">
                    <h4 className="text-[11px] font-mono font-bold text-zinc-300 uppercase">Register New Project node</h4>
                    
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-1">Project Title Specification</label>
                      <input
                        id="new-proj-title"
                        type="text"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        placeholder="e.g. Smart Canvas Visualizer"
                        className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 mb-1">Category</label>
                        <select
                          id="new-proj-cat"
                          value={newProject.category}
                          onChange={(e) => setNewProject({ ...newProject, category: e.target.value as any })}
                          className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded font-mono"
                        >
                          <option value="AI">AI/ML Core</option>
                          <option value="Research">Research/Engine</option>
                          <option value="Frontend">Frontend Visual</option>
                          <option value="Web">Full Web App</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 mb-1">Technologies (comma-sep)</label>
                        <input
                          id="new-proj-tags"
                          type="text"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          placeholder="e.g. React, Gemini, motion"
                          className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-800 text-xs text-white rounded font-mono"
                        />
                      </div>
                    </div>

                    {/* AI Project Description Generator Trigger */}
                    <button
                      id="run-ai-generate-project"
                      onClick={handleAiSuggestProject}
                      disabled={isGeneratingProject || !newProject.title}
                      className="w-full py-1.5 bg-orange-950/40 hover:bg-orange-900/60 border border-orange-500/30 text-orange-300 rounded font-mono text-[10px] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingProject ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Generating Tech Story via Gemini...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Gemini AI: Complete Technical Details</span>
                        </>
                      )}
                    </button>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-1">Engaging Quick Pitch</label>
                      <input
                        id="new-proj-pitch"
                        type="text"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="1-sentence project hook..."
                        className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-1">Detailed Technical Backstory</label>
                      <textarea
                        id="new-proj-story"
                        rows={3}
                        value={newProject.story}
                        onChange={(e) => setNewProject({ ...newProject, story: e.target.value })}
                        placeholder="The challenge, your tech stack solution, and results..."
                        className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 leading-normal font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 mb-1">GitHub (Url)</label>
                        <input
                          id="new-proj-git"
                          type="text"
                          value={newProject.githubUrl}
                          onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-2 py-1 bg-zinc-900 border border-zinc-800 text-xs rounded font-mono text-zinc-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 mb-1">Live demo (Url)</label>
                        <input
                          id="new-proj-live"
                          type="text"
                          value={newProject.liveUrl}
                          onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-2 py-1 bg-zinc-900 border border-zinc-800 text-xs rounded font-mono text-zinc-400"
                        />
                      </div>
                    </div>

                    <button
                      id="save-new-project-btn"
                      onClick={handleAddProject}
                      className="w-full py-2 bg-orange-500 hover:bg-orange-400 text-black font-semibold font-mono text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      Commit Node to Cataloged Array
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Skills Panel */}
              {activeSubTab === "skills" && (
                <div className="space-y-6">
                  {/* Current Skills list list */}
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Capabilities Registry ({portfolioData.skills.length})</label>
                    <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                      {portfolioData.skills.map((s) => (
                        <div key={s.id} className="flex items-center justify-between p-2 bg-zinc-900/40 border border-zinc-900 rounded text-[11px]">
                          <span className="truncate pr-2 text-zinc-300 font-mono">{s.name} ({s.proficiency}%)</span>
                          <button
                            id={`delete-skill-${s.id}`}
                            onClick={() => handleDeleteSkill(s.id)}
                            className="text-red-400 font-mono hover:text-red-300 hover:bg-red-950/20 px-1 py-0.5 rounded"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Skill form */}
                  <div className="pt-4 border-t border-zinc-900 space-y-3.5">
                    <h4 className="text-[11px] font-mono font-bold text-zinc-300 uppercase">Map New Capability module</h4>
                    
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-1">Skill Name</label>
                      <input
                        id="new-skill-name"
                        type="text"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                        placeholder="e.g. PyCharm, Kubernetes"
                        className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 mb-1">Category</label>
                        <select
                          id="new-skill-cat"
                          value={newSkill.category}
                          onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as any })}
                          className="w-full px-2 py-1 bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded font-mono"
                        >
                          <option value="AI/ML">AI/ML Core</option>
                          <option value="Frontend">Frontend Visual</option>
                          <option value="Backend">Backend Server</option>
                          <option value="Tools">Developer Tools</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 mb-1">Proficiency Meter ({newSkill.proficiency}%)</label>
                        <input
                          id="new-skill-proficiency"
                          type="range"
                          min="30"
                          max="100"
                          value={newSkill.proficiency}
                          onChange={(e) => setNewSkill({ ...newSkill, proficiency: Number(e.target.value) })}
                          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500 mt-2.5"
                        />
                      </div>
                    </div>

                    <button
                      id="save-new-skill-btn"
                      onClick={handleAddSkill}
                      className="w-full py-1.5 bg-orange-500 hover:bg-orange-400 text-black font-semibold font-mono text-xs rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md mt-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Map Skill Module
                    </button>
                  </div>
                </div>
              )}

              {/* 4. Backup config portable file panel */}
              {activeSubTab === "backup" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[11px] font-mono font-bold text-zinc-200 uppercase mb-2">Commit Portability Config</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                      Export your entire portfolio state as a JSON package file. You can commit this file back in at any time or bundle it onto any static workspace repository (e.g., GitHub Pages!).
                    </p>

                    <button
                      id="export-config-btn"
                      onClick={handleExportJson}
                      className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded font-mono text-xs text-orange-400 hover:text-orange-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download [portfolio_config_ashish.json]</span>
                    </button>
                  </div>

                  <div className="pt-4 border-t border-zinc-900">
                    <h4 className="text-[11px] font-mono font-bold text-zinc-200 uppercase mb-2">Import Custom JSON State</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-4 font-sans">
                      Upload and restyle the workspace using an existing `portfolio_config_ashish.json` archive.
                    </p>

                    <div className="relative">
                      <input
                        id="import-config-file"
                        type="file"
                        accept=".json"
                        onChange={handleImportJson}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      />
                      <div className="w-full py-6 pr-4 border border-dashed border-zinc-800 focus-within:border-orange-500 hover:border-zinc-700 rounded-lg text-center flex flex-col justify-center items-center gap-1.5 text-zinc-400 text-xs">
                        <Upload className="w-6 h-6 text-zinc-500" />
                        <span className="font-mono text-[10px] text-zinc-500">Drag setup JSON or Click to Select Archive</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-900/60 flex items-center justify-between">
                    <div className="text-[11px] text-zinc-500">
                      Revert workspace edits
                    </div>
                    <button
                      id="factory-reset-btn"
                      onClick={() => {
                        onReset();
                        triggerNotification("🔄 Portfolio reverted to original defaults.");
                      }}
                      className="px-3 py-1 bg-red-950/20 text-red-400 hover:bg-neutral-900 border border-red-900/30 font-mono text-[10px] rounded hover:border-red-500 transition-colors cursor-pointer"
                    >
                      Revert Defaults
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Actions save feedback footer */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between font-mono text-[10px] text-zinc-500">
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live synchronizer active</span>
              </span>
              <span>v3.4.1 (Stable)</span>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
