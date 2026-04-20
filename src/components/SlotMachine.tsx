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
  gain.gain.setValueAtTime(0.08 + (1 - progress) * 0.06, now);
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
    const d = i * 0.06;
    osc.frequency.setValueAtTime(freq, now + d);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12 - i * 0.03, now + d);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.55);
  });
}

function playClunk() {
  const ctx = ensureAudio();
  const now = ctx.currentTime;
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++)
    d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const flt = ctx.createBiquadFilter();
  flt.type = "lowpass";
  flt.frequency.setValueAtTime(600, now);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.15, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  src.connect(flt).connect(g).connect(ctx.destination);
  src.start(now);
  src.stop(now + 0.06);
}

const ITEM_HEIGHT = 80;
const FRICTION = 0.985;
const STOP_THRESHOLD = 1.5;
const LEVER_TRAVEL = 110;

export default function SlotMachine({ ideas, onLand }: SlotMachineProps) {
  const reelRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const leverRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const spinningRef = useRef(false);
  const lastIndexRef = useRef(-1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);

  useEffect(() => {
    if (!reelRef.current || !windowRef.current) return;
    const strip = reelRef.current;
    const winH = windowRef.current.offsetHeight;
    const items = shuffleArray(ideas).slice(0, 5);
    strip.innerHTML = "";
    items.forEach((idea) => {
      const div = document.createElement("div");
      div.className = "reel-item";
      div.textContent = idea.title;
      strip.appendChild(div);
    });
    const midIdx = 2;
    const offset = -(midIdx * ITEM_HEIGHT + ITEM_HEIGHT / 2 - winH / 2);
    strip.style.transform = `translateY(${offset}px)`;
    strip.classList.add("settled");
    const c = strip.children[midIdx] as HTMLElement;
    if (c) c.classList.add("landed");
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

      let simV = velocity,
        simD = 0;
      while (simV >= STOP_THRESHOLD) {
        simD += simV;
        simV *= FRICTION;
      }
      const LANDING_INDEX =
        Math.round((simD + winH / 2 - ITEM_HEIGHT / 2) / ITEM_HEIGHT) + 1;
      const REEL_COUNT = LANDING_INDEX + 3;

      let finalIdx: number;
      do {
        finalIdx = Math.floor(Math.random() * ideas.length);
      } while (finalIdx === lastIndexRef.current && ideas.length > 1);
      lastIndexRef.current = finalIdx;
      const finalIdea = ideas[finalIdx];

      let reel: Idea[] = [];
      while (reel.length < REEL_COUNT)
        reel = reel.concat(shuffleArray(ideas));
      reel = reel.slice(0, REEL_COUNT);
      reel[LANDING_INDEX] = finalIdea;

      const TARGET_Y = -(
        LANDING_INDEX * ITEM_HEIGHT +
        ITEM_HEIGHT / 2 -
        winH / 2
      );

      strip.innerHTML = "";
      strip.classList.remove("settled");
      strip.style.transform = "translateY(0px)";
      reel.forEach((idea, i) => {
        const div = document.createElement("div");
        div.className = "reel-item";
        div.textContent = idea.title;
        if (i === LANDING_INDEX) div.setAttribute("data-landing", "true");
        strip.appendChild(div);
      });

      function styleItems(y: number) {
        const vc = winH / 2;
        for (let i = 0; i < strip.children.length; i++) {
          const el = strip.children[i] as HTMLElement;
          const ic = i * ITEM_HEIGHT + ITEM_HEIGHT / 2 + y;
          const norm = Math.min(Math.abs(ic - vc) / (ITEM_HEIGHT * 1.5), 1);
          el.style.transform = `scale(${1.2 - norm * 0.35})`;
          el.style.opacity = `${1 - norm * 0.75}`;
        }
      }

      let pos = 0,
        vel = velocity,
        lastB = 0,
        lastT: number | null = null;

      function animate(ts: number) {
        if (lastT === null) lastT = ts;
        const dt = Math.min((ts - lastT) / 16.667, 3);
        lastT = ts;
        if (dt === 0) {
          animRef.current = requestAnimationFrame(animate);
          return;
        }
        pos += vel * dt;
        vel *= Math.pow(FRICTION, dt);
        strip.style.transform = `translateY(${-pos}px)`;
        styleItems(-pos);
        const b = Math.floor(pos / ITEM_HEIGHT);
        if (b > lastB) {
          playTick(Math.min(1 - vel / velocity, 0.95));
          lastB = b;
        }
        if (vel < STOP_THRESHOLD) {
          snapToTarget();
          return;
        }
        animRef.current = requestAnimationFrame(animate);
      }

      function snapToTarget() {
        const sY = -pos;
        const dist = TARGET_Y - sY;
        const t0 = performance.now();
        function springAnim(now: number) {
          const t = Math.min((now - t0) / 650, 1);
          const s = 1 - Math.exp(-7 * t) * Math.cos(5 * t);
          const y = sY + dist * s;
          strip.style.transform = `translateY(${y}px)`;
          styleItems(y);
          if (t < 1) {
            animRef.current = requestAnimationFrame(springAnim);
          } else {
            strip.style.transform = `translateY(${TARGET_Y}px)`;
            settle();
          }
        }
        animRef.current = requestAnimationFrame(springAnim);
      }

      function settle() {
        strip.classList.add("settled");
        const el = strip.querySelector('[data-landing="true"]') as HTMLElement;
        if (el) el.classList.add("landed");
        playLand();
        spinningRef.current = false;
        setIsSpinning(false);
        onLand(finalIdea);
      }

      animRef.current = requestAnimationFrame(animate);
    },
    [ideas, onLand]
  );

  // Vertical pull-down lever drag
  useEffect(() => {
    if (!leverRef.current) return;
    const lever: HTMLDivElement = leverRef.current;
    let dragging = false;
    let startY = 0;
    let pull = 0;

    function onDown(e: PointerEvent) {
      if (spinningRef.current) return;
      e.preventDefault();
      lever.setPointerCapture(e.pointerId);
      dragging = true;
      lever.classList.add("grabbing");
      lever.classList.remove("spring-back");
      lever.style.transition = "none";
      startY = e.clientY;
      pull = 0;
      ensureAudio();
    }
    function onMove(e: PointerEvent) {
      if (!dragging) return;
      pull = Math.min(Math.max(0, e.clientY - startY), LEVER_TRAVEL);
      lever.style.transform = `translate(-50%, -50%) translateY(${pull}px)`;
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      lever.classList.remove("grabbing");
      lever.classList.add("spring-back");
      lever.style.transform = "translate(-50%, -50%) translateY(0px)";
      if (pull > 8) {
        playClunk();
        spin(15 + (pull / LEVER_TRAVEL) * 40);
      }
      pull = 0;
    }

    lever.addEventListener("pointerdown", onDown);
    lever.addEventListener("pointermove", onMove);
    lever.addEventListener("pointerup", onUp);
    lever.addEventListener("pointercancel", onUp);
    return () => {
      lever.removeEventListener("pointerdown", onDown);
      lever.removeEventListener("pointermove", onMove);
      lever.removeEventListener("pointerup", onUp);
      lever.removeEventListener("pointercancel", onUp);
    };
  }, [spin]);

  return (
    <div className="flex flex-col items-center">
      <div className="reel-assembly">
        <div className="slot-machine-body">
          <div className="reel-window" ref={windowRef}>
            <div className="reel-strip" ref={reelRef} />
            <div className="reel-center-line" />
          </div>
        </div>

        {/* Vertical lever */}
        <div className="lever-container hidden sm:flex">
          <div className="lever-track" />
          <div
            className="lever-arm"
            ref={leverRef}
            style={{ transform: "translate(-50%, -50%) translateY(0px)" }}
          >
            {!hasSpun && <span className="lever-hint-text">↓ Pull</span>}
            <div className="lever-knob">
              <div className="lever-knob-grip" />
            </div>
            <div className="lever-shaft" />
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          if (!spinningRef.current) {
            playClunk();
            spin(30);
          }
        }}
        disabled={isSpinning}
        className="desktop-spin-btn hidden sm:block"
      >
        {hasSpun ? "🔄 Spin again" : "✨ Spin!"}
      </button>

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
