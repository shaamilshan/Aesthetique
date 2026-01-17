import React, { useEffect, useState, useRef } from "react";

const FilterArray = ({ list, handleClick }) => {
  const [activeStatusFilter, setActiveStatusFilter] = useState(list[0]);
  const containerRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;

    const onStart = (e) => {
      isDown = true;
      const p = e.touches ? e.touches[0] : e;
      startX = p.pageX;
      startY = p.pageY;
      scrollLeft = el.scrollLeft;
    };

    const onMove = (e) => {
      if (!isDown) return;
      const p = e.touches ? e.touches[0] : e;
      const dx = p.pageX - startX;
      const dy = p.pageY - startY;
      // If horizontal movement is dominant, consume and scroll horizontally
      if (Math.abs(dx) > Math.abs(dy)) {
        el.scrollLeft = scrollLeft - dx;
        // prevent vertical page scroll when swiping horizontally
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    const onEnd = () => {
      isDown = false;
    };

    // Prefer pointer events when available (unified pointer handling)
    if (window.PointerEvent) {
      el.addEventListener("pointerdown", onStart);
      // ensure pointermove isn't passive so we can preventDefault when horizontal swipe detected
      el.addEventListener("pointermove", onMove, { passive: false });
      el.addEventListener("pointerup", onEnd);
      el.addEventListener("pointercancel", onEnd);
      el.addEventListener("pointerleave", onEnd);
    } else {
  // Touch events
  // use passive: false on touchstart so we can call preventDefault in touchmove when needed
  el.addEventListener("touchstart", onStart, { passive: false });
  el.addEventListener("touchmove", onMove, { passive: false });
  el.addEventListener("touchend", onEnd);

  // Mouse events for desktop drag
  el.addEventListener("mousedown", onStart);
  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseup", onEnd);
  el.addEventListener("mouseleave", onEnd);
    }

    return () => {
      if (window.PointerEvent) {
        el.removeEventListener("pointerdown", onStart);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onEnd);
        el.removeEventListener("pointercancel", onEnd);
        el.removeEventListener("pointerleave", onEnd);
      } else {
          el.removeEventListener("touchstart", onStart);
          el.removeEventListener("touchmove", onMove);
          el.removeEventListener("touchend", onEnd);
          el.removeEventListener("mousedown", onStart);
          el.removeEventListener("mousemove", onMove);
          el.removeEventListener("mouseup", onEnd);
          el.removeEventListener("mouseleave", onEnd);
      }
    };
  }, []);

  // show/hide chevrons when overflow exists
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      setShowLeft(el.scrollLeft > 0);
      setShowRight(el.scrollWidth > el.clientWidth + el.scrollLeft + 1);
    };

    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollBy = (delta) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stat = params.get("status");
    if (stat) {
      setActiveStatusFilter(stat);
    }
  }, []);

  return (
    // Make the filter row horizontally scrollable on small screens and keep pills
    // from wrapping. On larger screens this behaves like a normal flex row.
    <div className="relative my-2">
      <div ref={containerRef} className="flex items-center gap-2 font-semibold bg-white text-gray-500 p-2 shadow rounded-md text-sm overflow-x-auto horizontal-scroll">
        {list.map((status) => (
        <p
          key={status}
          className={`whitespace-nowrap inline-block ${
            activeStatusFilter === status
              ? "bg-gray-100 rounded px-3 py-1 text-[#A53030] cursor-pointer"
              : "admin-status px-3 py-1"
          }`}
          onClick={() => {
            setActiveStatusFilter(status);
            handleClick("page", "");

            if (status === "all") {
              handleClick("status", "");
            } else {
              handleClick("status", status);
            }
          }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </p>
        ))}
      </div>

      {/* Left chevron */}
      {showLeft && (
        <button
          aria-label="scroll left"
          onClick={() => scrollBy(-120)}
          className="absolute left-1 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow md:hidden"
        >
          ‹
        </button>
      )}

      {/* Right chevron */}
      {showRight && (
        <button
          aria-label="scroll right"
          onClick={() => scrollBy(120)}
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow md:hidden"
        >
          ›
        </button>
      )}
    </div>
  );
};

export default FilterArray;
