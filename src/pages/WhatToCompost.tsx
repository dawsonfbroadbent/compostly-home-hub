import { useState, useEffect, useRef } from "react"; // Added useRef
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import whatToCompostImage from "@/assets/what-to-compost.jpg";

// ... (greens, browns, avoid, and steps arrays remain exactly the same as before)
const greens = [
  "Fruit & vegetable scraps",
  "Coffee grounds & tea bags",
  "Fresh grass clippings",
  "Plant trimmings",
  "Eggshells",
];

const browns = [
  "Dry leaves",
  "Cardboard & newspaper (shredded)",
  "Straw & hay",
  "Wood chips & sawdust",
  "Dryer lint (natural fibers)",
];

const avoid = [
  "Meat & fish scraps",
  "Dairy products",
  "Oils & grease",
  "Diseased plants",
  "Pet waste",
  "Treated wood",
];

const steps = [
  {
    title: "1. Layer It",
    desc: "Start with a layer of 'Browns' (like cardboard) at the bottom for airflow, then add your 'Greens' (food scraps) on top."
  },
  {
    title: "2. Cover Up",
    desc: "Every time you add kitchen scraps, cover them with a fresh layer of browns to prevent smells and fruit flies."
  },
  {
    title: "3. Keep it Damp",
    desc: "Your pile should feel like a wrung-out sponge. If it's too dry, add a little water; if it's too wet, add more browns."
  },
  {
    title: "4. Turn & Wait",
    desc: "Give it a stir once a week with a shovel to let it breathe. In a few months, you'll have 'Black Gold' for your garden!"
  }
];

// ... (proTips array remains the same)
const proTips = [
  "Aim for a 3:1 ratio of browns to greens for the perfect decomposition speed.",
  "Keep your compost moist like a wrung-out sponge — moisture is key for microbes!",
  "Turn your pile every week to introduce oxygen and prevent unpleasant odors.",
  "Crush eggshells before adding them to help them break down much faster.",
  "Avoid composting weeds that have gone to seed, or they might sprout in your garden later!"
];

const WhatToCompost = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to manage the timer

  // Function to reset the timer whenever the user manually interacts
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Auto-rotation logic with reset capability
  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setCurrentTip((prev) => (prev + 1) % proTips.length),
      5000 // 5 seconds
    );

    return () => {
      resetTimeout();
    };
  }, [currentTip]); // Re-run effect whenever currentTip changes

  const nextTip = () => {
    resetTimeout();
    setCurrentTip((prev) => (prev + 1) % proTips.length);
  };

  const prevTip = () => {
    resetTimeout();
    setCurrentTip((prev) => (prev - 1 + proTips.length) % proTips.length);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-display text-4xl font-bold text-center mb-4">What to Compost</h1>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          Knowing what to add — and what to avoid — makes composting easy and effective.
        </p>

        <img src={whatToCompostImage} alt="Compostable food scraps" className="rounded-xl mb-12 w-full max-h-72 object-cover shadow" />

        <div className="grid gap-8 md:grid-cols-3 mb-12">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-display text-xl font-semibold text-primary mb-3">🟢 Greens (Nitrogen)</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {greens.map((g) => <li key={g}>• {g}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-display text-xl font-semibold text-earth-brown mb-3">🟤 Browns (Carbon)</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {browns.map((b) => <li key={b}>• {b}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-display text-xl font-semibold text-destructive mb-3">🔴 Avoid</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {avoid.map((a) => <li key={a}>• {a}</li>)}
            </ul>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="font-display text-3xl font-bold text-center mb-8">Simple Steps to Start</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {steps.map((step) => (
              <div key={step.title} className="flex flex-col p-6 rounded-xl border bg-card/50">
                <h4 className="font-display text-lg font-bold mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* UPDATED SECTION: Smooth Sliding Pro Tip Carousel */}
        <div className="relative rounded-xl bg-primary/10 p-8 text-center min-h-[180px] flex flex-col justify-center overflow-hidden group">
          
          {/* 1. The "Window" container (overflow-hidden) */}
          <div className="relative w-full h-full overflow-hidden">
            
            {/* 2. The "Filmstrip" that slides (flex row) */}
            <div 
              className="flex transition-transform duration-700 ease-in-out h-full items-center" 
              style={{ transform: `translateX(-${currentTip * 100}%)` }}
            >
              {proTips.map((tip, index) => (
                /* 3. Each individual slide (width-full, flex-shrink-0) */
                <div key={index} className="w-full flex-shrink-0 px-12">
                  <h3 className="font-display text-xl font-semibold mb-3">Pro Tip</h3>
                  <p className="text-muted-foreground leading-relaxed text-balance">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons (now absolute-positioned) */}
          <button 
            onClick={prevTip} 
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary/10 hover:bg-primary/30 transition-colors z-10"
            aria-label="Previous tip"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>

          <button 
            onClick={nextTip} 
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary/10 hover:bg-primary/30 transition-colors z-10"
            aria-label="Next tip"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>
          
          {/* Visual dots to show progress */}
          <div className="flex justify-center gap-2 mt-6 z-10">
            {proTips.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTip(index)}
                className={`h-2 w-2 rounded-full transition-colors ${index === currentTip ? 'bg-primary' : 'bg-primary/20'}`}
                aria-label={`Go to tip ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatToCompost;