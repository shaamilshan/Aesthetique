import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const OutsideTouchCloseComponent = ({ children, toggleVisibility, style }) => {
  const refForReference = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        refForReference.current &&
        !refForReference.current.contains(event.target)
      ) {
        toggleVisibility();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleVisibility]);

  // If the caller used 'absolute' placement classes, render as fixed in the portal
  // so the popup won't be clipped by parent containers with overflow:hidden.
  const portalClass = typeof style === 'string' ? style.replace(/\babsolute\b/g, 'fixed') : style;

  const content = (
    <div ref={refForReference} className={portalClass}>
      {children}
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(content, document.body);
  }

  return content;
};

export default OutsideTouchCloseComponent;
