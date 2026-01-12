import { useState, useEffect, useRef } from "react";

const testimonials = [
  {
    quote:
      "I’ve tried countless serums, but nothing has made my skin look and feel as refreshed as the Hyaluronic Boost Serum. Within the first week, my skin felt noticeably plumper and so much more hydrated. The dry patches I struggled with for years have practically disappeared. It absorbs quickly, never feels sticky, and gives my skin this healthy, dewy glow that I thought only professionals could achieve. I genuinely look forward to using it every day—it’s become a non-negotiable part of my routine. Highly recommend for anyone who wants real, visible results!",
    author: "S. Patel",
    rating: 5,
    bg: "bg-indigo-600 text-white",
  },
  {
    quote:
      "Hydraluxé Serum has completely changed the way my skin behaves. I’ve always struggled with uneven tone and a bit of redness, but after adding this niacinamide-rich formula to my routine, my complexion looks so much more balanced and calm. I love how lightweight it feels—never greasy—and how quickly it absorbs. Within a short time, my skin started looking smoother, brighter, and just overall healthier.",
    author: "A. Verma",
    rating: 5,
    bg: "bg-white text-gray-900",
  },
  {
    quote:
      "This sunscreen has become my absolute favorite daily essential. My dry skin usually hates sunscreen, but this one changed everything. The creamy texture feels so nourishing, almost like a moisturizer and sunscreen in one. It gives my skin a soft, healthy-looking glow without any greasiness or white cast. I love knowing I’m getting reliable sun protection while my skin stays hydrated and comfortable all day. It truly lives up to its name!",
    author: "R. Kumar",
    rating: 5,
    bg: "bg-lime-300 text-black",
  },
  {
    quote:
      "My skin has been really tricky! I’ve always struggled to find a sunscreen that works for my oily, sensitive skin. Golden Glow CL Sunscreen feels incredibly lightweight, absorbs instantly, and leaves a soft matte finish that keeps my shine under control all day. The best part is that it never clogs my pores or causes irritation, which has been a constant problem with other sunscreens. It gives me the protection I need without the heaviness I hate. My skin looks fresh, balanced, and comfortable every time I use it.",
    author: "N. Roy",
    rating: 5,
    bg: "bg-gray-100 text-gray-900",
  },
];

export default function TestimonialSection({ id }) {
  const len = testimonials.length;
  const [activeIndex, setActiveIndex] = useState(0); // active testimonial index
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const resumeTimerRef = useRef(null);

  // positions for the stacked cards (left/top/rotation)
  const positions = [
    // nudged right so the left-most stacked card doesn't peek outside the section
    { left: "10%", top: "24%", rotate: -6, z: 10 },
    { left: "28%", top: "12%", rotate: -2, z: 20 },
    { left: "48%", top: "8%", rotate: 2, z: 30 },
    { left: "68%", top: "18%", rotate: 6, z: 20 },
    { left: "86%", top: "32%", rotate: 2, z: 10 },
  ];

  // (removed old interval-based activeIndex autoplay — replaced by JS-driven step marquee)

  // DRAG / SWIPE logic
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragDelta = useRef(0);
  const cardSpacing = 260; // px approximate width per card slot
  // make threshold proportional to card spacing for a more natural swipe feel
  const swipeThreshold = Math.round(cardSpacing / 2);

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
  // Move only one item per swipe: detect direction and threshold
  let deltaIndex = 0;
  // move one item if drag passes half-card width; otherwise snap back
  if (dx <= -swipeThreshold) deltaIndex = 1; // swipe left -> next
  else if (dx >= swipeThreshold) deltaIndex = -1; // swipe right -> prev
  let next = activeIndex + deltaIndex;
  // wrap next within [0, len)
  next = ((next % len) + len) % len;
  setTranslate(0);
  setActiveIndex(next);
    // clear resume safety timer
    clearTimeout(resumeTimerRef.current);
  };

  // keyboard support for accessibility
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setActiveIndex((i) => ((i - 1) % len + len) % len);
      if (e.key === "ArrowRight") setActiveIndex((i) => (i + 1) % len);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [len]);

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

  // JS-controlled step marquee (move one card per interval)
  const trackRef = useRef(null);
  const [stepIndex, setStepIndex] = useState(0);
  const stepIndexRef = useRef(0);
  const isResettingRef = useRef(false);
  const intervalRef = useRef(null);
  const stepInterval = 5000; // ms between steps
  const stepDuration = 600; // ms duration of the slide transition
  const cardWidth = 320;
  const gap = 36;
  const stepDistance = cardWidth + gap;

  // keep ref in sync
  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);

  // apply transform when stepIndex changes
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const px = -stepIndex * stepDistance;
    // if we're in the middle of a forced reset, skip transition
    if (isResettingRef.current) {
      track.style.transition = 'none';
      track.style.transform = `translateX(${px}px)`;
      // re-enable transition next frame
      requestAnimationFrame(() => {
        track.style.transition = `transform ${stepDuration}ms ease`;
      });
      return;
    }
    track.style.transition = `transform ${stepDuration}ms ease`;
    track.style.transform = `translateX(${px}px)`;
  }, [stepIndex]);

  // step interval (advance one slot every stepInterval ms)
  useEffect(() => {
    // don't run while paused or dragging
    if (paused || isDragging) return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setStepIndex((s) => s + 1);
    }, stepInterval);
    return () => clearInterval(intervalRef.current);
  }, [paused, isDragging]);

  // handle seamless loop reset when we reach the duplicated half
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    function onTransitionEnd(e) {
      if (e.propertyName !== 'transform') return;
      // when we've moved exactly `len` steps, we're at the duplicate start — reset to 0
      if (stepIndexRef.current >= len) {
        isResettingRef.current = true;
        // snap back without transition to step 0
        track.style.transition = 'none';
        track.style.transform = `translateX(0px)`;
        // update state to zero (this will also set ref via useEffect)
        setStepIndex(0);
        // restore transition on next frame and clear resetting flag
        requestAnimationFrame(() => {
          track.style.transition = `transform ${stepDuration}ms ease`;
          isResettingRef.current = false;
        });
      }
    }
    track.addEventListener('transitionend', onTransitionEnd);
    return () => track.removeEventListener('transitionend', onTransitionEnd);
  }, [len]);

  return (
  // allow vertical overflow so card tops/bottoms aren't clipped;
  // increase vertical padding so tall cards have room; left gradient removed per request
  <section id={id} className="pt-32 w-full overflow-visible" style={{ paddingBottom: 25 }}>
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
            {(() => {
              const idx = ((activeIndex % len) + len) % len;
              const t = testimonials[idx];
              return (
                <div className={`rounded-2xl p-6 shadow-md ${t.bg}`}>
                  <div className="flex">
                    <div className="flex">
                      {Array.from({ length: t.rating }).map((_, s) => (
                        <svg key={s} className={`w-4 h-4 ${t.bg.includes('bg-black') ? 'text-yellow-300' : 'text-yellow-400'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.95c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.448c-.785.57-1.84-.197-1.54-1.118l1.287-3.95a1 1 0 00-.364-1.118L2.643 9.377c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.95z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className={`mt-4 text-sm leading-relaxed ${t.bg.includes('bg-black') ? 'text-gray-100' : ''}`}>
                    {t.quote}
                  </p>
                  <p className={`mt-6 font-semibold ${t.bg.includes('bg-black') ? 'text-white' : 'text-gray-900'}`}>{t.author}</p>
                </div>
              );
            })()}
          </div>
        </div>
      ) : (
        <div
          className="relative min-h-[420px] md:h-[520px] touch-none select-none overflow-visible"
          style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* JS-driven step marquee: moves one card per interval (5s) with a smooth transition */}
          <div className="w-full overflow-hidden">
            <div
              ref={trackRef}
              className="testimonial-track"
              style={{ display: 'flex', gap: 36, alignItems: 'center', width: 'max-content', paddingTop: 20, transform: `translateX(${ -stepIndex * (cardWidth + gap) }px)` }}
            >
              {[...testimonials, ...testimonials].map((t, i) => {
                const pos = positions[i % positions.length];
                return (
                  <div key={`${i}-${t.author}`} className={`rounded-2xl p-6 md:p-8 shadow-lg ${t.bg}`} style={{ width: 320, transform: `rotate(${pos.rotate}deg)`, flex: '0 0 auto' }}>
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
          </div>
        </div>
      )}
    </section>
  );
}
