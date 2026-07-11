"use client";

import { useEffect, useRef } from "react";

export default function FadeInSection({
  children,
  className = "",
  id,
  immediate = false,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (immediate) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );

    observer.observe(el);

    // Fallback: ensure above-the-fold content becomes visible even if observer misfires
    const fallback = window.setTimeout(() => {
      el.classList.add("is-visible");
    }, 100);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [immediate]);

  return (
    <section
      ref={ref}
      id={id}
      className={`fade-in-section ${immediate ? "is-visible" : ""} ${className}`}
    >
      {children}
    </section>
  );
}
