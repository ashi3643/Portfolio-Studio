import React, { useState, useRef, useEffect } from "react";
import { Terminal, Copy, Check, Send, Sparkles, AlertCircle } from "lucide-react";

interface TerminalLine {
  text: string;
  type: "input" | "output" | "error" | "success" | "system";
}

export default function TerminalContact() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: "System Boot... Ashish Terminal Node v3.4.1 Online", type: "system" },
    { text: "Type 'help' to examine available CLI commands, or click capsules below.", type: "system" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [msgValue, setMsgValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<{ status: string; message: string } | null>(null);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  const commands = {
    help: "List available console prompts: help, about, skills, social, contact, clear",
    about: "Fetch brief professional history: AI Junior Developer centered on fully functional Web interface synthesis...",
    skills: "Scan active technologies: React, TypeScript, Gemini SDK, Node.js, Tailwind CSS, WebGL, motion",
    social: "Inspect communication nodes: GitHub (ashi3643), LinkedIn (ashishthyadi)",
    contact: "Display contact terminal payload: ashishthyadi@gmail.com",
    clear: "Wipe console buffers"
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    setLines((prev) => {
      const nextLines = [...prev, { text: `guest@ashish-cli:~$ ${cmd}`, type: "input" as const }];

      if (trimmed === "") {
        return nextLines;
      }

      switch (trimmed) {
        case "help":
          nextLines.push({ text: "=========================================", type: "system" });
          nextLines.push({ text: "  Ashish Command Interface Index", type: "success" });
          nextLines.push({ text: "=========================================", type: "system" });
          Object.keys(commands).forEach((key) => {
            nextLines.push({ text: `  - ${key}: ${commands[key as keyof typeof commands]}`, type: "output" });
          });
          break;
        case "about":
          nextLines.push({ text: "ABOUT ASHISH KUMAR THYADI:", type: "success" });
          nextLines.push({ text: "Currently specializing in AI models, fine-tuning structures, and custom developer frameworks. Active focus rests on high-cohesion, pixel-perfect user design representations and fluid layouts.", type: "output" });
          break;
        case "skills":
          nextLines.push({ text: "LOADED TECH STACK DIRECTORIES:", type: "success" });
          nextLines.push({ text: "  - FRONTEND: React, Vite, TS, Tailwind CSS, motion/react", type: "output" });
          nextLines.push({ text: "  - ARTIFICIAL INTELLIGENCE: Gemini API SDK Model deployment, Agentic workflows, Prompt structuring", type: "output" });
          nextLines.push({ text: "  - BACKEND: Express servers, REST architecture, Server-Sent Events", type: "output" });
          break;
        case "social":
          nextLines.push({ text: "SOCIAL PIPELINES AVAILABLE:", type: "success" });
          nextLines.push({ text: "  - GitHub: https://github.com/ashi3643", type: "output" });
          nextLines.push({ text: "  - LinkedIn: https://linkedin.com/in/ashish-kumar-thyadi-30b9b0267", type: "output" });
          break;
        case "contact":
          nextLines.push({ text: "DIRECT EMAIL NODE: ashishthyadi@gmail.com", type: "success" });
          break;
        case "clear":
          return [];
        default:
          nextLines.push({ 
            text: `Command not found: '${trimmed}'. Type 'help' to review catalog.`, 
            type: "error" 
          });
      }

      return nextLines;
    });

    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(inputValue);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("ashishthyadi@gmail.com");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValue || !msgValue) return;

    setIsSending(true);
    
    // Simulate interactive sending console logs recursively within terminal view!
    const consoleLogs = [
      { text: `Establishing link to ashishthyadi@gmail.com relay...`, type: "system" as const },
      { text: `Filtering package payloads... [PASS]`, type: "output" as const },
      { text: `Compiling message from [${emailValue}]`, type: "output" as const },
      { text: `Pushing secure SSL packet sequence... 100%`, type: "output" as const },
      { text: `Message successfully dispatched to Ashish!`, type: "success" as const }
    ];

    let count = 0;
    const interval = setInterval(() => {
      if (count < consoleLogs.length) {
        setLines((prev) => [...prev, consoleLogs[count]]);
        count++;
      } else {
        clearInterval(interval);
        setIsSending(false);
        setEmailValue("");
        setMsgValue("");
        setToast({ status: "success", message: "Your message has been dispatched successfully!" });
        setTimeout(() => setToast(null), 4000);
      }
    }, 450);
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <div id="contact-section" className="relative z-10 my-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-zinc-900">
        <div>
          <h2 className="text-3xl font-display font-light tracking-tight text-white flex items-center gap-2 serif">
            <span className="text-orange-500 font-mono text-xl mr-1">// 05.</span>
            Communication <span className="italic">Array</span>
          </h2>
          <p className="text-zinc-400 mt-2 max-w-xl text-sm font-sans">
            Execute direct terminal commands to interrogate my profiles, or submit a payload stream through the secure input card below.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* CLI Terminal Shell */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-zinc-900 bg-[#090909]/95 shadow-xl shadow-black/80 min-h-[380px] overflow-hidden">
          {/* Top Window Actions Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-950/80 border-b border-zinc-900 font-mono text-[11px] text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <span className="ml-1 text-zinc-500 font-medium">terminal_session_guest_sh</span>
            </div>
            <Terminal className="w-3.5 h-3.5 text-zinc-600" />
          </div>

          {/* Console readout screen */}
          <div className="flex-1 p-5 font-mono text-xs leading-relaxed overflow-y-auto max-h-[290px] h-[290px]">
            <div className="space-y-2 font-mono">
              {lines.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.type === "input"
                      ? "text-orange-450"
                      : line.type === "error"
                      ? "text-red-400"
                      : line.type === "success"
                      ? "text-orange-400 font-semibold"
                      : line.type === "system"
                      ? "text-zinc-500 italic"
                      : "text-zinc-300"
                  }
                >
                  <span className="whitespace-pre-wrap">{line.text}</span>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* Prompt quick links */}
          <div className="px-4 py-2 border-t border-zinc-950 bg-zinc-900/10 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono text-zinc-600 uppercase mr-1">CLI Presets:</span>
            {Object.keys(commands).map((cmd) => (
              <button
                id={`terminal-preset-${cmd}`}
                key={cmd}
                onClick={() => executeCommand(cmd)}
                className="text-[10px] font-mono bg-zinc-950 border border-zinc-900 text-orange-450 hover:text-orange-300 hover:border-zinc-800 px-2 py-0.5 rounded cursor-pointer"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Terminal Input Segment */}
          <div className="flex items-center gap-2 px-5 py-3 border-t border-zinc-900 bg-zinc-950/50 text-white font-mono text-xs">
            <span className="text-orange-500">guest@ashish-cli:~$</span>
            <input
              id="terminal-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Query help..."
              className="flex-1 bg-transparent border-none text-white focus:outline-none"
            />
            {inputValue === "" && <span className="terminal-cursor" />}
          </div>
        </div>

        {/* Secure Form Payload stream */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-xl border border-zinc-830/40 bg-[#121212]/30 relative overflow-hidden">
          <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-orange-500/5 blur-xl" />

          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-[10px] uppercase font-mono bg-orange-950/20 border border-orange-900/40 text-orange-400 px-2 py-0.5 rounded">
                SECURE RELAY
              </span>
              <h3 className="text-base font-display font-medium text-white">Direct Message Link</h3>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed mb-6 font-sans">
              Connect securely with me. Provide your credentials and message details, then watch the packet compilation sequence.
            </p>

            {toast && (
              <div className="mb-4 flex gap-2 p-3 bg-zinc-900 border border-emerald-900/60 text-emerald-400 rounded-lg text-xs font-mono">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{toast.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmitMessage} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wide mb-1">
                  Sender Identity (Email)
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 font-mono text-xs text-white rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wide mb-1">
                  Message Payload Body
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={msgValue}
                  onChange={(e) => setMsgValue(e.target.value)}
                  placeholder="Detail your inquiry or collaboration intent..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 font-mono text-xs text-white rounded-lg focus:outline-none focus:border-orange-500 transition-colors resize-none"
                />
              </div>

              <button
                id="submit-contact-btn"
                type="submit"
                disabled={isSending}
                className="w-full py-2 bg-orange-500 hover:bg-orange-400 text-black font-semibold py-2 text-xs font-mono rounded-lg transition-all flex items-center justify-center gap-2 relative shadow-md shadow-orange-500/10 cursor-pointer disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <span className="animate-spin text-xs">🌀</span>
                    <span>Compiling packets...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Dissect and Stream Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick email clipboard */}
          <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>Direct Email</span>
            <button
              id="copy-email-btn"
              onClick={copyEmail}
              className="flex items-center gap-1 text-orange-400 hover:text-orange-350 transition-colors cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 animate-pulse" />
                  <span>ashishthyadi@gmail.com</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
