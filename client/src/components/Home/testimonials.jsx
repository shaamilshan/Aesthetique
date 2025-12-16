import { useState, useEffect, useRef } from "react";

const testimonials = [
  {
    quote:
      "I've been using the AquaShield sunscreen daily — lightweight, non-greasy and doesn't pill under makeup. My skin feels protected and comfortable even after long sun exposure.",
    author: "Maya P.",
    rating: 5,
    bg: "bg-indigo-500 text-white",
  },
  {
    quote:
      "The RadiantBoost serum improved my skin texture within two weeks. It absorbs quickly and gives a nice glow without causing breakouts.",
    author: "Arjun S.",
    rating: 5,
    bg: "bg-white text-gray-900",
  },
  {
    quote:
      "Best sunscreen I've tried — broad spectrum protection that feels like a moisturizer. My tanning has reduced and my skin looks healthier.",
    author: "Leena K.",
    rating: 5,
    bg: "bg-lime-300 text-black",
  },
  {
    quote:
      "RadiantBoost serum layered well under sunscreen and makeup. My fine lines appear softened and my skin stays hydrated all day.",
    author: "Ibrahim T.",
    rating: 5,
    bg: "bg-black text-white",
  },
  {
    quote:
      "AquaShield is non-comedogenic and doesn't leave that white cast. Perfect for daily wear — lightweight and protective.",
    author: "Nina R.",
    rating: 5,
    bg: "bg-gray-100 text-gray-900",
  },
];

export default function TestimonialSection({ id }) {
  const [activeIndex, setActiveIndex] = useState(1); // center card active by default
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const resumeTimerRef = useRef(null);

  // positions for the stacked cards (left/top/rotation)
  const positions = [
    // raised top positions slightly to avoid clipping at the section top
    { left: "6%", top: "24%", rotate: -6, z: 10 },
    { left: "24%", top: "12%", rotate: -2, z: 20 },
    { left: "44%", top: "8%", rotate: 2, z: 30 },
    { left: "61%", top: "18%", rotate: 6, z: 20 },
    { left: "78%", top: "32%", rotate: 2, z: 10 },
  ];

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  // DRAG / SWIPE logic
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragDelta = useRef(0);
  const cardSpacing = 260; // px approximate width per card slot

  const handlePointerDown = (e) => {
    setPaused(true);
    setIsDragging(true);
    dragStartX.current = e.clientX ?? e.touches?.[0]?.clientX;
    dragDelta.current = 0;
    // add listeners on document for pointer move/up for better cross-element dragging
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    // also listen to cancel/touchend as a fallback
    document.addEventListener("pointercancel", handlePointerUp);
    document.addEventListener("touchend", handlePointerUp);
    document.addEventListener("touchcancel", handlePointerUp);
    // safety: in case an end event is missed, resume autoplay after 6s
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsDragging(false);
      setPaused(false);
      setTranslate(0);
    }, 6000);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX ?? e.touches?.[0]?.clientX;
    dragDelta.current = currentX - dragStartX.current;
    // no state update every pixel for perf; use ref and force re-render via small toggle
    setTranslate(dragDelta.current);
  };

  // transient translate state to re-render while dragging
  const [translate, setTranslate] = useState(0);

  const handlePointerUp = () => {
    setIsDragging(false);
    setPaused(false);
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
    document.removeEventListener("pointercancel", handlePointerUp);
    document.removeEventListener("touchend", handlePointerUp);
    document.removeEventListener("touchcancel", handlePointerUp);
    const dx = dragDelta.current;
    const deltaIndex = Math.round(-dx / cardSpacing);
    let next = activeIndex + deltaIndex;
    if (next < 0) next = 0;
    if (next >= testimonials.length) next = testimonials.length - 1;
    setTranslate(0);
    setActiveIndex(next);
    // clear resume safety timer
    clearTimeout(resumeTimerRef.current);
  };

  // keyboard support for accessibility
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setActiveIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setActiveIndex((i) => Math.min(testimonials.length - 1, i + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ensure timers are cleared on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(resumeTimerRef.current);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointercancel", handlePointerUp);
      document.removeEventListener("touchend", handlePointerUp);
      document.removeEventListener("touchcancel", handlePointerUp);
    };
  }, []);

  // responsive mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section id={id} className="py-16 w-full overflow-visible">
      {/* Title container centered */}
      <div className="max-w-6xl mx-auto px-4 text-center">
        <button
          className="inline-flex items-center rounded-full border border-black/20 px-6 py-2.5 text-sm font-medium text-black hover:bg-black hover:text-white transition-colors mb-6"
          type="button"
        >
          Rating & Reviews
        </button>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">Trusted by <span className="font-serif italic">people</span></h1>
      </div>

      {/* Full-width cards area */}
      {isMobile ? (
        // Mobile: single centered card with swipe support
        <div
          className="w-full px-4"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onPointerDown={handlePointerDown}
        >
          <div className="max-w-md mx-auto">
            <div className={`rounded-2xl p-6 shadow-xl ${testimonials[activeIndex].bg}`}>
              <div className="flex">
                <div className="flex">
                  {Array.from({ length: testimonials[activeIndex].rating }).map((_, s) => (
                    <svg key={s} className={`w-4 h-4 ${testimonials[activeIndex].bg.includes('bg-black') ? 'text-yellow-300' : 'text-yellow-400'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.95c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.448c-.785.57-1.84-.197-1.54-1.118l1.287-3.95a1 1 0 00-.364-1.118L2.643 9.377c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.95z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className={`mt-4 text-sm leading-relaxed ${testimonials[activeIndex].bg.includes('bg-black') ? 'text-gray-100' : ''}`}>
                {testimonials[activeIndex].quote}
              </p>
              <p className={`mt-6 font-semibold ${testimonials[activeIndex].bg.includes('bg-black') ? 'text-white' : 'text-gray-900'}`}>{testimonials[activeIndex].author}</p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="relative h-[420px] touch-none select-none overflow-visible"
          style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onPointerDown={handlePointerDown}
        >
          {testimonials.map((t, idx) => {
            const pos = positions[idx % positions.length];
            const offsetIndex = idx - activeIndex;
            const baseX = offsetIndex * (cardSpacing * 0.6); // overlap space
            const dragX = translate; // from drag
            const isActive = idx === activeIndex;
            return (
              <div
                key={idx}
                className={`absolute rounded-2xl p-6 md:p-8 shadow-2xl transform transition-all duration-500 ${t.bg}`}
                style={{
                  left: pos.left,
                  top: pos.top,
                  transform: `translateX(${baseX + dragX}px) rotate(${pos.rotate}deg) ${isActive ? 'scale(1.06) translateY(-12px)' : 'scale(0.96)'} `,
                  zIndex: isActive ? 50 : pos.z,
                  width: "320px",
                  overflow: 'visible',
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: t.rating }).map((_, s) => (
                        <svg key={s} className={`w-4 h-4 ${t.bg.includes('bg-black') ? 'text-yellow-300' : 'text-yellow-400'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.95c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.448c-.785.57-1.84-.197-1.54-1.118l1.287-3.95a1 1 0 00-.364-1.118L2.643 9.377c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.95z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                <p className={`mt-4 text-sm leading-relaxed ${t.bg.includes('bg-black') ? 'text-gray-100' : ''}`}>
                  {t.quote}
                </p>

                <p className={`mt-6 font-semibold ${t.bg.includes('bg-black') ? 'text-white' : 'text-gray-900'}`}>{t.author}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}