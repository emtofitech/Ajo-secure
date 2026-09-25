import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Reveals an element once it scrolls into view.
 *
 * Always call this unconditionally at the top level of a component —
 * never inside a loop or condition. Use <Reveal> when you need it in a list.
 */
export function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No observer support, or the user asked for less motion: show immediately.
    if (typeof IntersectionObserver === "undefined" || prefersReducedMotion()) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return {
    ref,
    visible,
    className: `reveal${visible ? " visible" : ""}`,
  };
}
