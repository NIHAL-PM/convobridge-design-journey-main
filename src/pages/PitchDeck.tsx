import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Globe, Zap, Shield, PhoneForwarded, Settings, MessageSquare, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  { id: "title", component: SlideTitle },
  { id: "problem", component: SlideProblem },
  { id: "solution", component: SlideSolution },
  { id: "product", component: SlideProduct },
  { id: "verticals", component: SlideVerticals },
  { id: "traction", component: SlideTraction },
  { id: "pricing", component: SlidePricing },
  { id: "roadmap", component: SlideRoadmap },
  { id: "competitive", component: SlideCompetitive },
  { id: "closing", component: SlideClosing },
];

export default function PitchDeck() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;
      if (e.deltaY > 50 && activeSlide < slides.length - 1) {
        setDirection(1);
        setActiveSlide(prev => prev + 1);
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 1000);
      } else if (e.deltaY < -50 && activeSlide > 0) {
        setDirection(-1);
        setActiveSlide(prev => prev - 1);
        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 1000);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        if (activeSlide < slides.length - 1) {
          setDirection(1);
          setActiveSlide(prev => prev + 1);
        }
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        if (activeSlide > 0) {
          setDirection(-1);
          setActiveSlide(prev => prev - 1);
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSlide, isScrolling]);

  const CurrentSlide = slides[activeSlide].component;

  return (
    <div className="h-screen w-full bg-black text-white font-sans overflow-hidden relative selection:bg-blue-500/30">
      <div className="absolute top-8 left-8 z-50 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]">
          C
        </div>
        <span className="font-bold text-xl tracking-tight">Convo<span className="text-blue-500">Bridge</span></span>
      </div>

      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > activeSlide ? 1 : -1);
              setActiveSlide(idx);
            }}
            className={`w-2 rounded-full transition-all duration-500 ${activeSlide === idx ? 'h-8 bg-blue-500' : 'h-2 bg-white/20 hover:bg-white/50'}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={activeSlide}
          custom={direction}
          initial={{ y: direction > 0 ? 100 : -100, opacity: 0, filter: 'blur(10px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: direction < 0 ? 100 : -100, opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full absolute inset-0 flex items-center justify-center p-12 md:p-24"
        >
          <CurrentSlide />
        </motion.div>
      </AnimatePresence>

      {activeSlide < slides.length - 1 && (
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 z-50"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      )}
    </div>
  );
}

// ---------------- Slides ----------------

function SlideTitle() {
  return (
    <div className="max-w-5xl w-full flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="mb-8 relative"
      >
        <div className="absolute inset-0 bg-blue-500 blur-[100px] opacity-30 rounded-full" />
        <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter relative z-10">
          Convo<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Bridge</span>
        </h1>
      </motion.div>
      <motion.p 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}
        className="text-2xl md:text-3xl text-white/70 font-light tracking-wide mb-12"
      >
        Democratizing Enterprise AI
      </motion.p>
      <motion.div 
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}
        className="flex gap-6 text-sm uppercase tracking-widest text-white/50 font-semibold"
      >
        <span>Seed Round</span>
        <span>•</span>
        <span>March 2026</span>
        <span>•</span>
        <span>contact@convobridge.in</span>
      </motion.div>
    </div>
  );
}

function SlideProblem() {
  return (
    <div className="max-w-6xl w-full">
      <p className="text-red-500 font-bold tracking-widest uppercase mb-4 text-sm">The Problem</p>
      <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tight">Global enterprise is bleeding.</h2>
      
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-red-500/10 border border-red-500/20 p-12 rounded-3xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 blur-[80px]" />
          <h3 className="text-7xl font-black text-red-500 mb-4 tracking-tighter">₹5,000 Cr<span className="text-3xl">/yr</span></h3>
          <p className="text-xl text-white/80 leading-relaxed font-light">
            Lost directly in the hospitality sector due to broken voice interactions. Agent attrition, mistranslation, and dropped handoffs compound into systemic failure.
          </p>
        </motion.div>

        <motion.div 
          initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}
          className="space-y-8"
        >
          <div className="flex gap-6 items-start">
            <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-red-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-2xl font-semibold mb-2">Unsupported Multilingual Load</h4>
              <p className="text-white/60 leading-relaxed">Contact center agents quit at record rates due to lack of tooling and relief. Every departure resets the cost clock, with no fix in sight.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SlideSolution() {
  const pillars = [
    { icon: Settings, title: "Connect", desc: "REST-API integration. No infrastructure replacement. Plug into any legacy stack in days." },
    { icon: Shield, title: "Configure", desc: "Domain-trained AI agents for hospitality and education. 95% accuracy out of the box." },
    { icon: Globe, title: "Converse", desc: "40+ natively modeled languages. Not translated - natively trained. Sub-300ms latency." },
    { icon: TrendingUp, title: "Convert", desc: "Every call logged, billed, and fed back into the model. A continuous improvement loop." }
  ];

  return (
    <div className="max-w-6xl w-full">
      <p className="text-blue-500 font-bold tracking-widest uppercase mb-4 text-sm">The Solution</p>
      <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tight">Four Pillars of Execution</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {pillars.map((pillar, i) => (
          <motion.div 
            key={i}
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }}
            className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-center gap-6 mb-4">
              <div className="h-16 w-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <pillar.icon className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold tracking-tight">0{i + 1} &nbsp; {pillar.title}</h3>
            </div>
            <p className="text-white/60 text-lg pl-22">{pillar.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SlideProduct() {
  return (
    <div className="max-w-6xl w-full">
      <p className="text-blue-500 font-bold tracking-widest uppercase mb-4 text-sm">Production-Ready</p>
      <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tight">The multilingual moat is live.</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="col-span-2 bg-gradient-to-br from-blue-900/40 to-black border border-blue-500/30 p-10 rounded-3xl relative overflow-hidden">
          <Globe className="absolute -right-10 -bottom-10 h-64 w-64 text-blue-500/10" />
          <h3 className="text-2xl font-bold mb-4">Native Voice Stack</h3>
          <p className="text-xl text-white/70 font-light leading-relaxed">40+ languages natively modeled. French, Arabic, Hindi, Malayalam and beyond. Not translated. Not synthesized from English.</p>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white/5 border border-white/10 p-10 rounded-3xl">
          <Zap className="h-10 w-10 text-yellow-400 mb-6" />
          <h3 className="text-2xl font-bold mb-4">Sub-300ms Latency</h3>
          <p className="text-white/60">Indistinguishable from human response time. Real-time speech-to-speech at scale.</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="bg-white/5 border border-white/10 p-10 rounded-3xl">
          <Shield className="h-10 w-10 text-green-400 mb-6" />
          <h3 className="text-2xl font-bold mb-4">Domain Fidelity</h3>
          <p className="text-white/60">95% accuracy in hospitality and education. Trained on vertical-specific dialogue.</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="col-span-2 bg-white/5 border border-white/10 p-10 rounded-3xl">
          <Settings className="h-10 w-10 text-purple-400 mb-6" />
          <h3 className="text-2xl font-bold mb-4">REST-API First</h3>
          <p className="text-white/60 text-lg">Plug into Salesforce, SAP, or a legacy PBX without a single infrastructure change.</p>
        </motion.div>
      </div>
    </div>
  );
}

function SlideVerticals() {
  return (
    <div className="max-w-6xl w-full">
      <p className="text-blue-500 font-bold tracking-widest uppercase mb-4 text-sm">Target Sectors</p>
      <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Two verticals.<br/>Precision-engineered.</h2>
      <p className="text-2xl text-white/60 font-light mb-16 max-w-3xl">Built for the sectors where language barriers cost the most. Deep integrations, domain accuracy, and live deployments.</p>
      
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="p-10 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10">
          <h3 className="text-3xl font-bold text-white mb-4">Hospitality</h3>
          <p className="text-white/70 text-lg mb-8">24/7 concierge AI in 40+ languages. Handles bookings, complaints, and room service natively.</p>
          <div className="inline-block px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold tracking-wide">Amadeus & Oracle PMS Native</div>
        </motion.div>

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="p-10 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10">
          <h3 className="text-3xl font-bold text-white mb-4">Education</h3>
          <p className="text-white/70 text-lg mb-8">Student inquiry handling in regional languages. 95% domain accuracy on curriculum and enrollment queries.</p>
          <div className="inline-block px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm font-bold tracking-wide">Live at Nilgiri College</div>
        </motion.div>
      </div>
    </div>
  );
}

function SlideTraction() {
  return (
    <div className="max-w-6xl w-full">
      <p className="text-blue-500 font-bold tracking-widest uppercase mb-4 text-sm">March 2026</p>
      <h2 className="text-5xl md:text-7xl font-bold mb-16 tracking-tight">Traction & Pipeline</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Status", value: "LIVE", sub: "Nilgiri College, Coimbatore", delay: 0.2 },
          { label: "Pipeline", value: "1 EOI", sub: "Received this month", delay: 0.3 },
          { label: "Onboarding", value: "₹50K", sub: "Contract value for integration", delay: 0.4 },
          { label: "Subscription", value: "₹9.9K/mo", sub: "Recurring revenue per account", delay: 0.5 },
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: item.delay }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between aspect-square"
          >
            <p className="text-white/50 font-medium uppercase tracking-wider text-sm">{item.label}</p>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">{item.value}</p>
              <p className="text-sm text-white/60">{item.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SlidePricing() {
  return (
    <div className="max-w-6xl w-full">
      <h2 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">Pricing</h2>
      <p className="text-2xl text-white/50 font-light mb-16">Built for compounding. Every tier unlocks the next.</p>
      
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="border-t border-white/20 pt-8">
          <h3 className="text-3xl font-bold mb-2">Setup</h3>
          <p className="text-white/50 mb-8 font-mono">₹50,000 one-time</p>
          <ul className="space-y-4 text-white/70">
            <li className="flex gap-3"><CheckCircle className="h-5 w-5 text-blue-500 shrink-0"/> Full platform integration</li>
            <li className="flex gap-3"><CheckCircle className="h-5 w-5 text-blue-500 shrink-0"/> Domain-specific model training</li>
            <li className="flex gap-3"><CheckCircle className="h-5 w-5 text-blue-500 shrink-0"/> Voice profile configuration</li>
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="border-t border-blue-500 pt-8 relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)]" />
          <h3 className="text-3xl font-bold mb-2">Subscription</h3>
          <p className="text-blue-400 mb-8 font-mono">₹9,999 / month</p>
          <ul className="space-y-4 text-white/70">
            <li className="flex gap-3"><CheckCircle className="h-5 w-5 text-blue-500 shrink-0"/> Full platform access</li>
            <li className="flex gap-3"><CheckCircle className="h-5 w-5 text-blue-500 shrink-0"/> Continuous model updates</li>
            <li className="flex gap-3"><CheckCircle className="h-5 w-5 text-blue-500 shrink-0"/> Predictable recurring base</li>
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="border-t border-white/20 pt-8">
          <h3 className="text-3xl font-bold mb-2">Usage</h3>
          <p className="text-white/50 mb-8 font-mono">₹10 per successful call</p>
          <ul className="space-y-4 text-white/70">
            <li className="flex gap-3"><CheckCircle className="h-5 w-5 text-blue-500 shrink-0"/> Pure upside, zero risk</li>
            <li className="flex gap-3"><CheckCircle className="h-5 w-5 text-blue-500 shrink-0"/> Zero charge on drop/failed</li>
            <li className="flex gap-3"><CheckCircle className="h-5 w-5 text-blue-500 shrink-0"/> Trust-aligned outcomes</li>
          </ul>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
        <p className="text-lg text-white/80">Projected ARR: <span className="text-white font-bold text-xl ml-2">₹1.2 Cr</span> (Year 1) &nbsp;→&nbsp; <span className="text-blue-400 font-bold text-xl ml-2">₹6 Cr+</span> (Year 2 with 10 clients)</p>
      </motion.div>
    </div>
  );
}

function SlideRoadmap() {
  const steps = [
    { time: "Phase 1 / Now", title: "Live Platform", details: ["Nilgiri College live", "First EOI received", "40+ language stack stable"] },
    { time: "Q2-Q3 2026", title: "Expansion", details: ["5 enterprise clients", "GCC entry (UAE, KSA)", "First recurring revenue"] },
    { time: "Q4 2026", title: "Compliance", details: ["GDPR & EU AI Act", "Sovereign AI readiness", "Infrastructure-light"] },
    { time: "Q1-Q2 2027", title: "Series A", details: ["₹1.2 Cr ARR achieved", "20+ enterprise clients", "Series A prep initiated"] },
  ];

  return (
    <div className="max-w-7xl w-full">
      <h2 className="text-5xl md:text-7xl font-bold mb-20 tracking-tight">From deployment to Series A.</h2>
      
      <div className="grid grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
            className="relative"
          >
            <div className="w-full h-[1px] bg-white/20 mb-8 absolute top-0 -left-4" />
            <div className="w-3 h-3 rounded-full bg-blue-500 absolute -top-[5px]" />
            <div className="pt-8 space-y-6">
              <div>
                <p className="text-blue-400 font-mono text-sm mb-2">{step.time}</p>
                <h3 className="text-2xl font-bold">{step.title}</h3>
              </div>
              <ul className="space-y-4">
                {step.details.map((desc, idx) => (
                  <li key={idx} className="text-white/60 text-sm leading-relaxed border-l-2 border-white/10 pl-4">{desc}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SlideCompetitive() {
  return (
    <div className="max-w-6xl w-full">
      <h2 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">Why ConvoBridge Wins</h2>
      <p className="text-2xl text-white/50 font-light mb-16">US-centric platforms were not built for this market.</p>
      
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="grid grid-cols-4 gap-4 p-6 border-b border-white/10 uppercase tracking-widest text-[10px] font-bold text-white/40">
          <div>Feature</div>
          <div className="text-blue-400">ConvoBridge</div>
          <div>Vapi</div>
          <div>Replicant</div>
        </div>
        
        {[
          { feature: "Language Coverage", cb: "40+ natively modeled", vapi: "Multiple supported", rep: "English + limited" },
          { feature: "Target Market", cb: "India, GCC, EU mid-market", vapi: "US Enterprise only", rep: "US Enterprise only" },
          { feature: "Pricing Model", cb: "₹9,999/mo + usage", vapi: "$300+/mo USD", rep: "Enterprise contract" },
          { feature: "Agent Latency", cb: "Sub-300ms Native", cbGlow: true, vapi: "800ms+", rep: "500ms+" }
        ].map((row, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
            key={i} className="grid grid-cols-4 gap-4 p-8 border-b border-white/5 items-center hover:bg-white/5 transition-colors"
          >
            <div className="font-medium text-white/80">{row.feature}</div>
            <div className={`font-bold ${row.cbGlow ? 'text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'text-white'}`}>
              ✓ {row.cb}
            </div>
            <div className="text-white/40 text-sm flex items-center gap-2"><XCircle className="h-4 w-4 shrink-0" /> {row.vapi}</div>
            <div className="text-white/40 text-sm flex items-center gap-2"><XCircle className="h-4 w-4 shrink-0" /> {row.rep}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SlideClosing() {
  return (
    <div className="max-w-6xl w-full grid md:grid-cols-2 gap-16 items-center">
      <div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl font-black mb-8 tracking-tighter"
        >
          Closing the<br />seed round.
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="inline-block p-6 rounded-3xl bg-blue-600/20 border border-blue-500/50"
        >
          <h3 className="text-7xl font-black text-blue-400 mb-2">₹50 Cr</h3>
          <p className="text-blue-300/70 font-mono uppercase tracking-widest text-sm">Target — March 2026</p>
        </motion.div>
      </div>

      <div className="space-y-12">
        <p className="text-sm font-bold tracking-widest uppercase text-white/30">Use of Funds</p>
        {[
          { title: "Engineering Depth", desc: "Expand core voice model team. Accelerate Arabic, Malayalam fine-tuning." },
          { title: "GCC Market Expansion", desc: "10 new enterprise contracts in UAE/KSA within 18 months." },
          { title: "Compliance Infrastructure", desc: "GDPR, EU AI Act certification. Sovereign AI layer setup." }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
            className="flex gap-6"
          >
            <div className="text-2xl font-black text-white/20">0{i + 1}</div>
            <div>
              <h4 className="text-2xl font-bold mb-2">{item.title}</h4>
              <p className="text-white/60 text-lg leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
