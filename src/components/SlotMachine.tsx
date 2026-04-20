"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import type { Idea } from "@/types/idea";

interface SlotMachineProps {
  ideas: Idea[];
  onLand: (idea: Idea) => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = arr.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Web Audio sound effects
let audioCtx: AudioContext | null = null;

function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playTick(progress: number) {
  const ctx = ensureAudio();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const freq = 1800 - progress * 900;
  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.04);
  const vol = 0.08 + (1 - progress) * 0.06;
  gain.gain.setValueAtTime(vol, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.06);
}

function playLand() {
  const ctx = ensureAudio();
  const now = ctx.currentTime;
  [880, 1320, 1760].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    const delay = i * 0.06;
    osc.frequency.setValueAtTime(freq, now + delay);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12 - i * 0.03, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.55);
  });
}

function playClunk() {
  const ctx = ensureAudio();
  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.05;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(600, now);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.06);
}

const ITEM_HEIGHT = 80;
const FRICTION = 0.985;
const STOP_THRESHOLD = 1.5;

export default function SlotMachine({ ideas, onLand }: SlotMachineProps) {
  const reelRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const armRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const spinningRef = useRef(false);
  const lastIndexRef = useRef(-1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);

  // Initialize reel with a few shuffled titles
  useEffect(() => {
    if (!reelRef.current || !windowRef.current) return;
    const strip = reelRef.current;
    const winH = windowRef.current.offsetHeight;
    const items = shuffleArray(ideas).slice(0, 3);
    strip.innerHTML = "";
    items.forEach((idea) => {
      const div = document.createElement("div");
      div.className = "reel-item";
      div.textContent = idea.title;
      strip.appendChild(div);
    });
    const midIdx = 1;
    const offset = -(midIdx * ITEM_HEIGHT + ITEM_HEIGHT / 2 - winH / 2);
    strip.style.transform = `translateY(${offset}px)`;
    strip.classList.add("settled");
    const centerItem = strip.children[midIdx] as HTMLElement;
    if (centerItem) centerItem.classList.add("landed");
  }, [ideas]);

  const spin = useCallback(
    (velocity: number) => {
      if (spinningRef.current || ideas.length === 0) return;
      spinningRef.current = true;
      setIsSpinning(true);
      setHasSpun(true);
      if (animRef.current) cancelAnimationFrame(animRef.current);

      const strip = reelRef.current!;
      const winH = windowRef.current!.offsetHeight;

      // Simulate physics to find natural stop distance
      let simVel = velocity;
      let simDist = 0;
      while (simVel >= STOP_THRESHOLD) {
        simDist += simVel;
        simVel *= FRICTION;
      }
      const centerAtStop = simDist + winH / 2;
      const naturalIndex = Math.round((centerAtStop - ITEM_HEIGHT / 2) / ITEM_HEIGHT);
      const LANDING_INDEX = naturalIndex + 1;
      const REEL_COUNT = LANDING_INDEX + 3;

      // Pick final idea
      let finalIdx: number;
      do {
        finalIdx = Math.floor(Math.random() * ideas.length);
      } while (finalIdx === lastIndexRef.current && ideas.length > 1);
      lastIndexRef.current = finalIdx;
      const finalIdea = ideas[finalIdx];

      // Build reel content
      let reelIdeas: Idea[] = [];
      while (reelIdeas.length < REEL_COUNT) {
        reelIdeas = reelIdeas.concat(shuffleArray(ideas));
      }
      reelIdeas = reelIdeas.slice(0, REEL_COUNT);
      reelIdeas[LANDING_INDEX] = finalIdea;

      const TARGET_Y = -(LANDING_INDEX * ITEM_HEIGHT + ITEM_HEIGHT / 2 - winH / 2);

      // Build DOM
      strip.innerHTML = "";
      strip.classList.remove("settled");
      strip.style.transform = "translateY(0px)";
      reelIdeas.forEach((idea, i) => {
        const div = document.createElement("div");
        div.className = "reel-item";
        div.textContent = idea.title;
        if (i === LANDING_INDEX) div.setAttribute("data-landing", "true");
        strip.appendChild(div);
      });

      function styleItems(y: number) {
        const viewCenter = winH / 2;
        const items = strip.children;
        for (let i = 0; i < items.length; i++) {
          const el = items[i] as HTMLElement;
          const itemCenter = i * ITEM_HEIGHT + ITEM_HEIGHT / 2 + y;
          const dist = Math.abs(itemCenter - viewCenter);
          const norm = Math.min(dist / ITEM_HEIGHT, 1);
          el.style.transform = `scale(${1.3 - norm * 0.3})`;
          el.style.opacity = `${1 - norm * 0.7}`;
        }
      }

      let pos = 0;
      let vel = velocity;
      let lastBoundary = 0;
      let lastTime: number | null = null;

      function animate(ts: number) {
        if (lastTime === null) lastTime = ts;
        const rawDt = (ts - lastTime) / 16.667;
        const dt = Math.min(rawDt, 3);
        lastTime = ts;
        if (dt === 0) {
          animRef.current = requestAnimationFrame(animate);
          return;
        }

        pos += vel * dt;
        vel *= Math.pow(FRICTION, dt);
        strip.style.transform = `translateY(${-pos}px)`;
        styleItems(-pos);

        const boundary = Math.floor(pos / ITEM_HEIGHT);
        if (boundary > lastBoundary) {
          playTick(Math.min(1 - vel / velocity, 0.95));
          lastBoundary = boundary;
        }

        if (vel < STOP_THRESHOLD) {
          snapToTarget();
          return;
        }
        animRef.current = requestAnimationFrame(animate);
      }

      function snapToTarget() {
        const startY = -pos;
        const distance = TARGET_Y - startY;
        const startTime = performance.now();
        const duration = 650;

        function springAnimate(now: number) {
          const elapsed = now - startTime;
          const t = Math.min(elapsed / duration, 1);
          const spring = 1 - Math.exp(-7 * t) * Math.cos(5 * t);
          const y = startY + distance * spring;
          strip.style.transform = `translateY(${y}px)`;
          styleItems(y);
          if (t < 1) {
            animRef.current = requestAnimationFrame(springAnimate);
          } else {
            strip.style.transform = `translateY(${TARGET_Y}px)`;
            onSettle();
          }
        }
        animRef.current = requestAnimationFrame(springAnimate);
      }

      function onSettle() {
        strip.classList.add("settled");
        const landing = strip.querySelector('[data-landing="true"]') as HTMLElement;
        if (landing) landing.classList.add("landed");
        playLand();
        spinningRef.current = false;
        setIsSpinning(false);
        onLand(finalIdea);
      }

      animRef.current = requestAnimationFrame(animate);
    },
    [ideas, onLand]
  );

  // Lever drag interaction
  useEffect(() => {
    if (!armRef.current) return;
    const armEl: HTMLDivElement = armRef.current;
    const knob = armEl.querySelector(".lever-knob") as HTMLElement;
    if (!knob) return;

    const MAX_ANGLE = 180;
    const DRAG_SENS = 280;
    let isDragging = false;
    let startY = 0;
    let currentAngle = 0;
    let hasMoved = false;

    function onDown(e: PointerEvent) {
      if (spinningRef.current) return;
      e.preventDefault();
      knob.setPointerCapture(e.pointerId);
      isDragging = true;
      hasMoved = false;
      armEl.classList.add("grabbing");
      armEl.classList.remove("hint", "spring-back");
      armEl.style.transition = "";
      startY = e.clientY;
      currentAngle = 0;
      ensureAudio();
    }

    function onMove(e: PointerEvent) {
      if (!isDragging) return;
      const deltaY = Math.max(0, e.clientY - startY);
      if (deltaY > 3) hasMoved = true;
      currentAngle = Math.min(deltaY * (MAX_ANGLE / DRAG_SENS), MAX_ANGLE);
      armEl.style.transform = `rotate(${currentAngle}deg)`;
    }

    function onUp() {
      if (!isDragging) return;
      isDragging = false;
      armEl.classList.remove("grabbing");
      const normalizedPull = currentAngle / MAX_ANGLE;
      armEl.classList.add("spring-back");
      armEl.style.transform = "rotate(0deg)";
      setTimeout(() => armEl.classList.remove("spring-back"), 600);

      if (hasMoved || currentAngle > 0) {
        playClunk();
        spin(20 + Math.min(normalizedPull, 1) * 35);
      } else {
        playClunk();
        spin(25);
      }
      currentAngle = 0;
      hasMoved = false;
    }

    knob.addEventListener("pointerdown", onDown);
    knob.addEventListener("pointermove", onMove);
    knob.addEventListener("pointerup", onUp);
    knob.addEventListener("pointercancel", onUp);

    // Hint animation on first load
    armEl.classList.add("hint");
    const onHintEnd = () => armEl.classList.remove("hint");
    armEl.addEventListener("animationend", onHintEnd, { once: true });

    return () => {
      knob.removeEventListener("pointerdown", onDown);
      knob.removeEventListener("pointermove", onMove);
      knob.removeEventListener("pointerup", onUp);
      knob.removeEventListener("pointercancel", onUp);
      armEl.removeEventListener("animationend", onHintEnd);
    };
  }, [spin]);

  return (
    <div className="flex flex-col items-center">
      {/* Reel assembly */}
      <div className="reel-assembly">
        {/* Reel window */}
        <div className="reel-window" ref={windowRef}>
          <div className="reel-strip" ref={reelRef} />
          <div className="reel-center-line" />
        </div>

        {/* Lever handle (desktop only) */}
        <div className="lever-handle hidden sm:block" aria-hidden="true">
          {!hasSpun && (
            <span className="lever-hint-text">← Pull</span>
          )}
          <div className="lever-arm" ref={armRef}>
            <div className="lever-knob">
              <div className="lever-knob-grip" />
            </div>
            <div className="lever-shaft" />
          </div>
          <div className="lever-pivot" />
        </div>
      </div>

      {/* Mobile spin button */}
      <button
        onClick={() => {
          if (!spinningRef.current) {
            playClunk();
            spin(30);
          }
        }}
        disabled={isSpinning}
        className="sm:hidden mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-accent-purple to-accent-cyan text-white font-mono font-bold text-lg disabled:opacity-50 transition-transform active:scale-95"
      >
        {hasSpun ? "🔄 Spin again!" : "✨ Spin!"}
      </button>
    </div>
  );
}
