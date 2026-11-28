"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!reduced.matches) entry.target.setAttribute("data-entered", "");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    function stopPreviousEntrances() {
      if (reduced.matches) {
        document.querySelectorAll("[data-reveal][data-entered]").forEach(element => element.removeAttribute("data-entered"));
      }
    }
    reduced.addEventListener("change", stopPreviousEntrances);
    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", stopPreviousEntrances);
    };
  }, []);
  return null;
}
