/**
 * BRIENNE AI — Field Instrument landing page.
 * Aerospace editorial structure, visible safety states, asymmetric composition,
 * and an honest browser-only workflow demo that never impersonates desktop control.
 */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AmbientField } from "@/components/AmbientField";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  ArrowDownRight,
  BadgeCheck,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleStop,
  Command,
  Copy,
  Cpu,
  ExternalLink,
  FileText,
  FolderCog,
  GitBranch,
  LockKeyhole,
  Menu,
  MonitorUp,
  Radar,
  Settings2,
  ShieldCheck,
  Terminal,
  Volume2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

const ASSETS = {
  logo: "/manus-storage/brienne-orbital-shield-mark_eb6ea939.png",
  hero: "/manus-storage/brienne-hero-field-instrument_43ca2992.png",
  safety: "/manus-storage/brienne-safety-orbital-detail_fde5ef0b.png",
  constellation: "/manus-storage/brienne-system-constellation_eb5f2d46.png",
};

const REPOSITORY_URL = "https://github.com/JERRwan/genius-ai-master-prompt";
const STREAMLIT_URL = "https://share.streamlit.io/";

type DemoMode = "research" | "system" | "automation";

const demoModes: Record<
  DemoMode,
  {
    label: string;
    risk: "Low" | "Medium" | "High";
    prompt: string;
    intent: string;
    steps: string[];
    output: string;
  }
> = {
  research: {
    label: "Research brief",
    risk: "Low",
    prompt: "Compare the latest notes and prepare a concise research brief.",
    intent: "Research and summarization",
    steps: ["Collect approved local notes", "Extract themes and factual claims", "Draft a source-linked brief"],
    output: "A structured brief is ready for review. Nothing will be sent or stored externally.",
  },
  system: {
    label: "System status",
    risk: "Medium",
    prompt: "Inspect system health and recommend the next maintenance action.",
    intent: "Local status inspection",
    steps: ["Read permitted local metrics", "Summarize CPU, memory, and disk signals", "Prepare a recommended action for approval"],
    output: "A status report is staged. BRIENNE would ask before launching any remediation tool.",
  },
  automation: {
    label: "Automate intake",
    risk: "High",
    prompt: "Organize the latest project files into an approved workspace.",
    intent: "File organization",
    steps: ["List the proposed files and destinations", "Show a reversible move plan", "Wait for explicit human approval"],
    output: "The plan is intentionally paused. High-impact file actions require a human confirmation in the desktop app.",
  },
};

const capabilities = [
  {
    icon: BrainCircuit,
    eyebrow: "Local reasoning",
    title: "Ollama at the core",
    copy: "Use local models for a private assistant experience that can remain within your own perimeter.",
  },
  {
    icon: FolderCog,
    eyebrow: "Controlled action",
    title: "Plans before movement",
    copy: "File operations and desktop tasks are organized as visible, reviewable steps—not hidden side effects.",
  },
  {
    icon: Volume2,
    eyebrow: "Natural interface",
    title: "Voice when you want it",
    copy: "A conversational surface is paired with offline-friendly speech pathways and concise feedback.",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Human override",
    title: "Safety stays on screen",
    copy: "Permission, confirmation, auditability, and an emergency stop are product behaviours, not footnotes.",
  },
];

const setupSteps = [
  ["01", "Install the local engine", "Install Ollama on your Windows computer and select a local model."],
  ["02", "Prepare the workspace", "Create a Python environment, install the documented packages, and copy the configuration template."],
  ["03", "Run with visibility", "Launch BRIENNE locally, verify the Ollama connection, and keep Human Override enabled."],
];

function StatusDot({ className = "" }: { className?: string }) {
  return <span className={`inline-flex size-2 rounded-full ${className}`} aria-hidden="true" />;
}

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [mode, setMode] = useState<DemoMode>("research");
  const [request, setRequest] = useState(demoModes.research.prompt);
  const [running, setRunning] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const activeDemo = useMemo(() => demoModes[mode], [mode]);

  function selectMode(nextMode: DemoMode) {
    setMode(nextMode);
    setRequest(demoModes[nextMode].prompt);
    setRunning(false);
    setStopped(false);
  }

  function runDemo() {
    setStopped(false);
    setRunning(true);
  }

  function stopDemo() {
    setStopped(true);
    setRunning(false);
  }

  async function copyText(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1700);
    } catch {
      setCopied(null);
    }
  }

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-[#08101e] text-[#f4f1e9] selection:bg-[#ff6b3d] selection:text-[#08101e]">
      <AmbientField />
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08101e]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
          <a href="#top" className="group flex items-center gap-3" aria-label="BRIENNE AI home">
            <span className="grid size-10 place-items-center overflow-hidden rounded-full bg-[#ece8dc] ring-1 ring-white/15 transition-transform duration-200 group-hover:rotate-6">
              <img src={ASSETS.logo} alt="" className="size-9 object-contain" />
            </span>
            <span>
              <span className="block font-display text-[15px] font-semibold tracking-[0.18em] text-[#f6f4ef]">BRIENNE</span>
              <span className="block font-mono text-[9px] tracking-[0.19em] text-[#8ea1b8]">PERSONAL AI SYSTEM</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
            {[
              ["Capabilities", "#capabilities"],
              ["Live demo", "#demo"],
              ["AI chat", "/chat"],
              ["Setup", "#setup"],
              ["Resources", "#resources"],
            ].map(([label, href]) => (
              <a key={href} href={href} className="font-mono text-[11px] uppercase tracking-[0.13em] text-[#9bacbe] transition-colors hover:text-[#f4f1e9]">
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <Badge className="border border-[#ff6b3d]/45 bg-[#ff6b3d]/10 px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.1em] text-[#ff946f] hover:bg-[#ff6b3d]/10">
              <StatusDot className="mr-1.5 bg-[#ff6b3d]" /> HUMAN OVERRIDE ON
            </Badge>
            <Button asChild size="sm" className="rounded-full bg-[#f4f1e9] px-4 text-[#08101e] hover:bg-white">
              <a href="/chat">Open AI chat <ArrowDownRight className="ml-1.5 size-4" /></a>
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="text-[#f4f1e9] hover:bg-white/10 hover:text-white lg:hidden" onClick={() => setNavOpen((open) => !open)} aria-label="Toggle navigation">
            {navOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {navOpen && (
          <div className="border-t border-white/10 bg-[#0d1728] px-5 py-5 lg:hidden">
            <nav className="flex flex-col gap-4" aria-label="Mobile navigation">
              {[
                ["Capabilities", "#capabilities"],
                ["Live demo", "#demo"],
                ["AI chat", "/chat"],
                ["Setup", "#setup"],
                ["Resources", "#resources"],
              ].map(([label, href]) => (
                <a key={href} href={href} onClick={() => setNavOpen(false)} className="font-mono text-xs uppercase tracking-[0.14em] text-[#b7c4d2]">
                  {label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main id="top" className="relative z-10">
        <section className="relative isolate overflow-hidden border-b border-white/10">
          <AmbientField />
          <div className="absolute inset-0 -z-20 bg-[#08101e]" />
          <div className="absolute inset-y-0 right-0 -z-10 hidden w-[63%] overflow-hidden lg:block">
            <img src={ASSETS.hero} alt="Abstract BRIENNE orbital field instrument" className="size-full object-cover object-center opacity-95" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#08101e] via-[#08101e]/55 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08101e] via-transparent to-[#08101e]/20" />
          </div>
          <div className="absolute left-[49%] top-0 hidden h-full w-px bg-white/10 lg:block" />
          <div className="relative mx-auto grid min-h-[710px] max-w-[1440px] grid-cols-1 px-5 pb-16 pt-14 lg:grid-cols-12 lg:px-10 lg:pb-20 lg:pt-24">
            <div className="col-span-7 flex flex-col justify-between lg:pr-12">
              <div>
                <div className="mb-7 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#a8b8ca]">
                  <span className="flex items-center gap-2"><StatusDot className="bg-[#6ed7c3] shadow-[0_0_14px_#6ed7c3]" /> LOCAL-FIRST SYSTEM</span>
                  <span className="h-px w-10 bg-white/20" />
                  <span>WINDOWS / OLLAMA / PYTHON</span>
                </div>
                <h1 className="max-w-4xl font-display text-[clamp(3.4rem,7vw,7.2rem)] font-medium leading-[0.91] tracking-[-0.07em] text-[#f5f2ea]">
                  Intelligence that stays within <span className="text-[#b8c7d6]">your perimeter.</span>
                </h1>
                <p className="mt-8 max-w-xl text-lg leading-8 text-[#b7c4d2] sm:text-xl">
                  BRIENNE brings local reasoning, voice, organized workflows, and safety-first automation into one personal AI system—without hiding the plan from you.
                </p>
              </div>

              <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:items-center">
                <Button size="lg" className="group h-14 rounded-full bg-[#ff6b3d] px-6 text-base font-semibold text-[#08101e] hover:bg-[#ff8058]" onClick={() => document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" })}>
                  Inspect a live workflow <ChevronRight className="ml-2 size-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg" className="h-14 rounded-full border-white/20 bg-white/[0.035] px-6 text-base text-[#f5f2ea] hover:bg-white/10 hover:text-white" onClick={() => document.querySelector("#setup")?.scrollIntoView({ behavior: "smooth" })}>
                  <Terminal className="mr-2 size-4" /> View local setup
                </Button>
              </div>
            </div>

            <div className="col-span-5 mt-16 flex items-end lg:mt-0 lg:pl-10">
              <div className="w-full max-w-md border border-white/15 bg-[#0d1728]/72 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.28)] backdrop-blur-md lg:ml-auto">
                <div className="flex items-start justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8ea1b8]">Mission console</p>
                    <p className="mt-1 text-sm font-medium text-[#f4f1e9]">Ready to review</p>
                  </div>
                  <Badge className="rounded-sm border border-[#6ed7c3]/30 bg-[#6ed7c3]/10 font-mono text-[10px] font-medium tracking-[0.1em] text-[#86e6d2] hover:bg-[#6ed7c3]/10">SAFE MODE</Badge>
                </div>
                <div className="space-y-4 py-5">
                  {[
                    ["Reasoning engine", "LOCAL / OLLAMA", "bg-[#6ed7c3]"],
                    ["Action policy", "REVIEW REQUIRED", "bg-[#ff6b3d]"],
                    ["Audit trail", "ENABLED", "bg-[#81a9dd]"],
                  ].map(([label, value, color]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm text-[#aab9c9]">{label}</span>
                      <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] text-[#e3e9ef]"><StatusDot className={color} /> {value}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 border-t border-white/10 pt-4">
                  {[['APPROVE', 'human'], ['PLAN', 'visible'], ['STOP', 'instant']].map(([label, value]) => (
                    <div key={label} className="border-r border-white/10 last:border-none px-2 first:pl-0">
                      <p className="font-mono text-[10px] tracking-[0.12em] text-[#8193a7]">{label}</p>
                      <p className="mt-1 text-sm font-medium text-[#f4f1e9]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="relative mx-auto flex max-w-[1440px] items-center justify-between border-t border-white/10 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8294a8] lg:px-10">
            <span>BRIENNE / FIELD INSTRUMENT 01</span>
            <span className="hidden sm:block">YOUR WORKSPACE. YOUR APPROVAL.</span>
            <span className="flex items-center gap-2"><Radar className="size-3.5 text-[#ff6b3d]" /> NO BLACK-BOX ACTIONS</span>
          </div>
        </section>

        <section className="border-b border-[#26354a] bg-[#ece8dc] text-[#0c1726]" id="capabilities">
          <div className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5d6b7b]">01 / Built for visible control</p>
                <h2 className="mt-5 max-w-md font-display text-5xl font-medium leading-[0.94] tracking-[-0.055em] sm:text-6xl">Capable on purpose. Careful by design.</h2>
                <p className="mt-6 max-w-md text-lg leading-8 text-[#475464]">BRIENNE is designed around the parts of personal AI that matter after the demo ends: local reasoning, clear scope, visible intent, and a person who can always interrupt the system.</p>
              </div>
              <div className="grid gap-x-12 gap-y-0 border-t border-[#c7c2b5] lg:col-span-8 sm:grid-cols-2">
                {capabilities.map(({ icon: Icon, eyebrow, title, copy }, index) => (
                  <article key={title} className="group border-b border-[#c7c2b5] py-8 sm:py-9">
                    <div className="flex items-start justify-between">
                      <Icon className="size-6 text-[#ff6b3d]" strokeWidth={1.7} />
                      <span className="font-mono text-[11px] text-[#7a8792]">0{index + 1}</span>
                    </div>
                    <p className="mt-9 font-mono text-[10px] uppercase tracking-[0.14em] text-[#667587]">{eyebrow}</p>
                    <h3 className="mt-2 font-display text-2xl font-medium tracking-[-0.04em]">{title}</h3>
                    <p className="mt-3 max-w-sm leading-7 text-[#536170]">{copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#101d30] px-5 py-20 lg:px-10 lg:py-28">
          <div className="absolute inset-0 opacity-45">
            <img src={ASSETS.constellation} alt="Abstract constellation of protected local AI signals" className="size-full object-cover object-center" />
          </div>
          <div className="pointer-events-none absolute -right-12 top-1/2 hidden size-[470px] -translate-y-1/2 rounded-full border border-[#f4f1e9]/10 lg:grid lg:place-items-center">
            <div className="grid size-[350px] place-items-center rounded-full border border-[#f4f1e9]/10">
              <img src={ASSETS.logo} alt="" className="size-48 opacity-[0.13] grayscale" />
            </div>
          </div>
          <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Badge className="rounded-sm border border-[#ff6b3d]/40 bg-[#ff6b3d]/10 px-3 py-1 font-mono text-[10px] tracking-[0.12em] text-[#ff9a7a] hover:bg-[#ff6b3d]/10"><LockKeyhole className="mr-1.5 size-3" /> LOCAL-FIRST BY DEFAULT</Badge>
              <h2 className="mt-6 max-w-lg font-display text-5xl font-medium leading-[0.94] tracking-[-0.055em] text-[#f4f1e9] sm:text-6xl">A system that shows its work.</h2>
            </div>
            <div className="border-l-0 border-white/15 pl-0 lg:col-span-6 lg:col-start-7 lg:border-l lg:pl-14">
              <p className="max-w-xl text-xl leading-9 text-[#c1ccda]">Whether BRIENNE is drafting a brief, reading system health, or proposing a file operation, the relevant boundary stays explicit. The system can be useful without becoming opaque.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[['01', 'Scope first'], ['02', 'Review next'], ['03', 'Act only with approval']].map(([num, text]) => (
                  <div key={num} className="border-t border-white/25 pt-3">
                    <span className="font-mono text-[10px] tracking-[0.13em] text-[#ff9a7a]">{num}</span>
                    <p className="mt-2 text-sm text-[#e7ebf0]">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#08101e] px-5 py-20 lg:px-10 lg:py-28" id="demo">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid items-end gap-8 border-b border-white/15 pb-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8ea1b8]">02 / Inspect the workflow</p>
                <h2 className="mt-5 font-display text-5xl font-medium leading-[0.94] tracking-[-0.055em] text-[#f4f1e9] sm:text-6xl">Inspect the plan before the system moves.</h2>
              </div>
              <p className="max-w-md text-base leading-7 text-[#aebdcd] lg:col-span-4 lg:col-start-9">Choose a workflow, change the request, and inspect BRIENNE’s proposed steps. This demo runs only in your browser; it does not access files, Ollama, apps, or system data.</p>
            </div>

            <div className="mt-10 grid gap-0 lg:grid-cols-12">
              <aside className="border border-white/15 bg-[#0d1728] p-5 lg:col-span-3 lg:border-r-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8496aa]">Workflow presets</p>
                <div className="mt-4 space-y-2">
                  {(Object.keys(demoModes) as DemoMode[]).map((demoMode) => {
                    const item = demoModes[demoMode];
                    const active = mode === demoMode;
                    return (
                      <button key={demoMode} type="button" onClick={() => selectMode(demoMode)} className={`w-full border px-4 py-4 text-left transition-all duration-200 ${active ? "border-[#ff6b3d] bg-[#ff6b3d]/10" : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05]"}`}>
                        <span className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-[#f4f1e9]">{item.label}</span>
                          <span className={`font-mono text-[9px] uppercase tracking-[0.11em] ${item.risk === "High" ? "text-[#ff946f]" : item.risk === "Medium" ? "text-[#f0cc85]" : "text-[#7cddc9]"}`}>{item.risk}</span>
                        </span>
                        <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.09em] text-[#8192a6]">{item.intent}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.11em] text-[#8ea1b8]"><BadgeCheck className="size-3.5 text-[#6ed7c3]" /> Browser-safe simulation</p>
                </div>
              </aside>

              <div className="border border-white/15 bg-[#111d30] p-5 sm:p-7 lg:col-span-6 lg:border-r-0">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 place-items-center rounded-full bg-[#ff6b3d] text-[#08101e]"><Command className="size-4" /></span>
                    <div>
                      <p className="text-sm font-semibold text-[#f4f1e9]">BRIENNE workflow interpreter</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#8fa0b2]">Action plan / {activeDemo.risk.toLowerCase()} impact</p>
                    </div>
                  </div>
                  {running && !stopped && <Badge className="rounded-sm border border-[#6ed7c3]/30 bg-[#6ed7c3]/10 font-mono text-[10px] tracking-[0.1em] text-[#86e6d2] hover:bg-[#6ed7c3]/10"><StatusDot className="mr-1.5 animate-pulse bg-[#6ed7c3]" /> READY FOR REVIEW</Badge>}
                  {stopped && <Badge className="rounded-sm border border-[#ff6b3d]/35 bg-[#ff6b3d]/10 font-mono text-[10px] tracking-[0.1em] text-[#ff9a7a] hover:bg-[#ff6b3d]/10"><CircleStop className="mr-1.5 size-3" /> WORKFLOW HALTED</Badge>}
                </div>

                <label className="mt-7 block font-mono text-[10px] uppercase tracking-[0.13em] text-[#93a4b6]" htmlFor="request">Your request</label>
                <textarea id="request" value={request} onChange={(event) => setRequest(event.target.value)} className="mt-3 min-h-28 w-full resize-y border border-white/15 bg-[#08101e] p-4 text-base leading-7 text-[#edf0f3] outline-none transition-colors placeholder:text-[#69798d] focus:border-[#ff6b3d]" placeholder="Describe a task for the workflow preview..." />

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button onClick={runDemo} disabled={!request.trim()} className="rounded-full bg-[#ff6b3d] text-[#08101e] hover:bg-[#ff8058]"><Activity className="mr-2 size-4" /> Generate visible plan</Button>
                  <Button variant="outline" onClick={stopDemo} className="rounded-full border-[#ff6b3d]/45 bg-transparent text-[#ff9a7a] hover:bg-[#ff6b3d]/10 hover:text-[#ffb59f]"><CircleStop className="mr-2 size-4" /> Emergency stop</Button>
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#76879a]">No external call is made</span>
                </div>

                <div className={`mt-7 border p-5 transition-colors duration-300 ${stopped ? "border-[#ff6b3d]/35 bg-[#ff6b3d]/[0.06]" : running ? "border-[#6ed7c3]/30 bg-[#6ed7c3]/[0.04]" : "border-white/10 bg-[#0b1525]"}`}>
                  {!running && !stopped ? (
                    <p className="text-sm leading-7 text-[#9eafc0]">Select a workflow and generate a plan. The result will expose its intent, stages, and the approval boundary.</p>
                  ) : stopped ? (
                    <div className="flex gap-3"><CircleStop className="mt-1 size-5 shrink-0 text-[#ff7b54]" /><div><p className="font-medium text-[#f4f1e9]">Nothing moved.</p><p className="mt-1 text-sm leading-6 text-[#bd9b90]">The client-side preview has been halted. In the desktop product, the same control remains available for action workflows.</p></div></div>
                  ) : (
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#7cddc9]">Proposed plan / {activeDemo.intent}</p>
                        <Badge className="rounded-sm border border-white/15 bg-white/[0.05] font-mono text-[9px] tracking-[0.1em] text-[#c0cad5] hover:bg-white/[0.05]">{activeDemo.risk} IMPACT</Badge>
                      </div>
                      <ol className="mt-4 space-y-3">
                        {activeDemo.steps.map((step, index) => (
                          <li key={step} className="flex gap-3 text-sm leading-6 text-[#d7dee5]"><span className="grid size-5 shrink-0 place-items-center rounded-full border border-[#6ed7c3]/40 font-mono text-[9px] text-[#83dfce]">{index + 1}</span>{step}</li>
                        ))}
                      </ol>
                      <p className="mt-5 border-t border-white/10 pt-4 text-sm leading-6 text-[#adbdcc]">{activeDemo.output}</p>
                    </div>
                  )}
                </div>
              </div>

              <aside className="border border-white/15 bg-[#ece8dc] p-5 text-[#0b1726] lg:col-span-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#66717f]">Human control</p>
                <h3 className="mt-3 font-display text-3xl font-medium leading-[0.95] tracking-[-0.045em]">Always inside the loop.</h3>
                <div className="mt-7 space-y-4">
                  {[
                    [Check, "Visible intent", "The plan is legible before a task proceeds."],
                    [ShieldCheck, "Explicit approval", "Medium and high-impact desktop actions wait for you."],
                    [CircleStop, "Interruptible", "The stop control remains unmistakably available."],
                  ].map(([Icon, title, text]) => {
                    const IconComponent = Icon as typeof Check;
                    return <div key={title as string} className="border-t border-[#c5c0b3] pt-4"><IconComponent className="size-4 text-[#e8582d]" /><p className="mt-3 text-sm font-semibold">{title as string}</p><p className="mt-1 text-sm leading-6 text-[#546171]">{text as string}</p></div>;
                  })}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="border-y border-[#c7c2b5] bg-[#ece8dc] text-[#0b1726]" id="setup">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 lg:grid-cols-12 lg:px-10 lg:py-28">
            <div className="lg:col-span-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5e6c7b]">03 / Local deployment path</p>
              <h2 className="mt-5 max-w-xl font-display text-5xl font-medium leading-[0.94] tracking-[-0.055em] sm:text-6xl">Start locally. Keep the system close.</h2>
              <p className="mt-6 max-w-lg text-lg leading-8 text-[#4d5a68]">The desktop product is meant for your own Windows workspace. The public site explains the system, while the local installation handles Ollama, desktop controls, files, and voice.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild className="rounded-full bg-[#0b1726] text-[#f4f1e9] hover:bg-[#1d2b3d]"><a href={REPOSITORY_URL} target="_blank" rel="noreferrer"><GitBranch className="mr-2 size-4" /> Open GitHub package <ExternalLink className="ml-2 size-3.5" /></a></Button>
                <Button asChild variant="outline" className="rounded-full border-[#9ca7ae] bg-transparent text-[#0b1726] hover:bg-[#dcd8cd]"><a href={STREAMLIT_URL} target="_blank" rel="noreferrer"><MonitorUp className="mr-2 size-4" /> Open Streamlit</a></Button>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="grid overflow-hidden border border-[#bbb6aa] sm:grid-cols-[1fr_0.92fr]">
                <div className="p-6 sm:p-8">
                  {setupSteps.map(([number, title, copy]) => (
                    <div key={number} className="grid grid-cols-[42px_1fr] gap-4 border-b border-[#c7c2b5] py-5 first:pt-0 last:border-0 last:pb-0">
                      <span className="font-mono text-[11px] tracking-[0.1em] text-[#e8582d]">{number}</span>
                      <div><h3 className="font-display text-2xl font-medium tracking-[-0.035em]">{title}</h3><p className="mt-2 leading-7 text-[#596675]">{copy}</p></div>
                    </div>
                  ))}
                </div>
                <div className="relative min-h-[330px] overflow-hidden bg-[#122036]">
                  <img src={ASSETS.safety} alt="BRIENNE AI safety control detail" className="absolute inset-0 size-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#08101e] via-[#08101e]/75 to-transparent p-6 text-[#f4f1e9]">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#ff9a7a]">Approval is a feature</p>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-[#d6dce3]">Set the scope, inspect the plan, then decide what happens next.</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between gap-4 border border-[#bbb6aa] bg-[#e2ded3] p-3 pl-4">
                <code className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-xs text-[#334152]">ollama pull &lt;your-local-model&gt;</code>
                <Button variant="ghost" size="sm" className="shrink-0 rounded-sm text-[#0c1726] hover:bg-[#cfcabe]" onClick={() => copyText("ollama pull <your-local-model>", "ollama")}>{copied === "ollama" ? <><Check className="mr-1.5 size-3.5" /> Copied</> : <><Copy className="mr-1.5 size-3.5" /> Copy</>}</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0d1728] px-5 py-20 lg:px-10 lg:py-28" id="resources">
          <div className="relative mx-auto grid max-w-[1440px] gap-12 overflow-hidden border-y border-white/10 py-10 lg:grid-cols-12 lg:py-12">
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between font-mono text-[9px] tracking-[0.14em] text-white/20"><span>RSC / 00.01</span><span>COORDINATE 41° 07' N</span><span>ARCHIVE FRAME</span></div>
            <div className="pointer-events-none absolute bottom-0 left-[40%] hidden h-px w-[65%] bg-white/10 lg:block" />
            <div className="lg:col-span-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8ea1b8]">04 / Field notes & resources</p>
              <h2 className="mt-5 max-w-lg font-display text-5xl font-medium leading-[0.94] tracking-[-0.055em] text-[#f4f1e9] sm:text-6xl">Everything needed to inspect the system.</h2>
              <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#7f92a7]"><span className="h-px w-10 bg-[#ff6b3d]" /> READ BEFORE DEPLOYMENT</div>
            </div>
            <div className="grid gap-4 lg:col-span-7 sm:grid-cols-2">
              <Card className="group relative overflow-hidden rounded-none border-white/15 bg-white/[0.035] text-[#f4f1e9] shadow-none transition-colors hover:bg-white/[0.07]">
                <div className="absolute inset-y-0 left-0 w-1 bg-[#ff6b3d]" />
                <div className="absolute right-4 top-4 font-mono text-[9px] tracking-[0.12em] text-white/25">R-01</div>
                <CardContent className="relative p-6"><FileText className="size-6 text-[#ff8060]" /><p className="mt-12 font-mono text-[10px] uppercase tracking-[0.13em] text-[#8fa0b2]">Documentation package</p><h3 className="mt-2 font-display text-2xl tracking-[-0.035em]">Installation guide & manual</h3><p className="mt-3 leading-7 text-[#afbdcb]">Read the Windows, Python, Ollama, and safe-operation documentation before local setup.</p><div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4"><span className="font-mono text-[9px] tracking-[0.1em] text-[#ff9a7a]">REVIEW REQUIRED</span><a href={`${REPOSITORY_URL}/tree/main/brienne_ai`} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-[#f4f1e9] hover:text-[#ff9a7a]">Browse <ArrowDownRight className="ml-1.5 size-4" /></a></div></CardContent>
              </Card>
              <Card className="group relative overflow-hidden rounded-none border-white/15 bg-white/[0.035] text-[#f4f1e9] shadow-none transition-colors hover:bg-white/[0.07]">
                <div className="absolute inset-y-0 left-0 w-1 bg-[#6ed7c3]" />
                <div className="absolute right-4 top-4 font-mono text-[9px] tracking-[0.12em] text-white/25">R-02</div>
                <div className="pointer-events-none absolute -bottom-11 -right-10 size-40 rounded-full border border-white/[0.06]" />
                <CardContent className="relative p-6"><Cpu className="size-6 text-[#7cddc9]" /><p className="mt-12 font-mono text-[10px] uppercase tracking-[0.13em] text-[#8fa0b2]">Online companion</p><h3 className="mt-2 font-display text-2xl tracking-[-0.035em]">Streamlit documentation preview</h3><p className="mt-3 leading-7 text-[#afbdcb]">Use the separate Streamlit app for a browser-based documentation companion and local Ollama check.</p><div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4"><span className="font-mono text-[9px] tracking-[0.1em] text-[#7cddc9]">READ-ONLY LINK</span><a href={`${REPOSITORY_URL}/blob/main/brienne_streamlit_app.py`} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-[#f4f1e9] hover:text-[#7cddc9]">Inspect <ArrowDownRight className="ml-1.5 size-4" /></a></div></CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#08101e] px-5 py-8 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-7 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3"><span className="grid size-9 place-items-center overflow-hidden rounded-full bg-[#ece8dc]"><img src={ASSETS.logo} alt="" className="size-8 object-contain" /></span><span className="font-display text-sm tracking-[0.16em] text-[#f4f1e9]">BRIENNE</span></div>
          <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#7e90a5]">Intelligence. Voice. Automation. Under your control.</p>
          <div className="flex items-center gap-5 text-sm text-[#a6b5c4]"><a href={REPOSITORY_URL} target="_blank" rel="noreferrer" className="hover:text-[#f4f1e9]">GitHub</a><a href="#top" className="hover:text-[#f4f1e9]">Back to top</a></div>
        </div>
        <div className="mx-auto flex max-w-[1440px] justify-between pt-4 font-mono text-[9px] uppercase tracking-[0.13em] text-[#53667b]"><span>END OF FIELD NOTE / 04</span><span className="hidden sm:block">BRIENNE CORE · APPROVAL STATE: ON</span><span>© 2026</span></div>
      </footer>
    </div>
  );
}
