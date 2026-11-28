"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { usePreferences } from "@/components/Preferences";
import { AppIcon } from "./AppIcon";
import { Button } from "./Button";
import { GlassPanel } from "./GlassPanel";
import "@/components/service-dialog.css";

export function ServiceModal({ title, emblem, footer, children, compact = false, onDismiss }: {
  title: string;
  emblem: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  compact?: boolean;
  onDismiss: () => void;
}) {
  const { t } = usePreferences();
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const backdropPressed = useRef(false);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!element.open) {
      element.showModal();
      close.current?.focus({ preventScroll: true });
    }

    const viewport = window.visualViewport;
    const body = content.current;
    if (!viewport || !body) return;
    let previousHeight = viewport.height;
    let scrollHeightBeforeResize: number | undefined;

    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => {
      if (scrollHeightBeforeResize === undefined || body.clientHeight >= scrollHeightBeforeResize) return;
      scrollHeightBeforeResize = undefined;
      const field = document.activeElement;
      if (!field?.matches("input, select, textarea") || !body.contains(field)) return;
      const controls = field.getBoundingClientRect();
      const visible = body.getBoundingClientRect();
      const padding = 8;
      if (controls.bottom > visible.bottom - padding) {
        body.scrollTop += controls.bottom - visible.bottom + padding;
      } else if (controls.top < visible.top + padding) {
        body.scrollTop -= visible.top - controls.top + padding;
      }
    });
    observer?.observe(body);

    function syncViewport() {
      if (!viewport || !element || !body) return;
      if (viewport.scale !== 1) {
        element.style.removeProperty("--dialog-visible-height");
        element.style.removeProperty("--dialog-visible-top");
        element.style.removeProperty("--dialog-visible-bottom");
        return;
      }
      if (viewport.height < previousHeight) scrollHeightBeforeResize = body.clientHeight;
      if (viewport.height > previousHeight) scrollHeightBeforeResize = undefined;
      previousHeight = viewport.height;
      element.style.setProperty("--dialog-visible-height", viewport.height + "px");
      element.style.setProperty("--dialog-visible-top", Math.max(0, viewport.offsetTop) + "px");
      element.style.setProperty("--dialog-visible-bottom",
        Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) + "px");

    }
    syncViewport();
    viewport.addEventListener("resize", syncViewport);
    viewport.addEventListener("scroll", syncViewport);
    return () => {
      observer?.disconnect();
      viewport.removeEventListener("resize", syncViewport);
      viewport.removeEventListener("scroll", syncViewport);
    };
  }, []);

  function dismiss() {
    const element = dialog.current;
    if (!element?.open || closing.current) return;
    closing.current = true;
    const finish = () => {
      if (!element.isConnected || !element.open) return;
      element.close();
      onDismiss();
    };
    element.dataset.closing = "";
    const transitions = element.getAnimations?.() ?? [];
    if (!transitions.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    // Keep the native dialog and its focus trap until the exit settles or is cancelled.
    void Promise.allSettled(transitions.map(transition => transition.finished)).then(finish);
  }

  return (
    <dialog ref={dialog} className={compact ? "service-dialog service-dialog--compact" : "service-dialog"}
      aria-modal="true" aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); dismiss(); }}
      onPointerDown={(event) => { backdropPressed.current = event.currentTarget === event.target; }}
      onPointerUp={(event) => { backdropPressed.current &&= event.currentTarget === event.target; }}
      onPointerCancel={() => { backdropPressed.current = false; }}
      onClick={(event) => {
        if (backdropPressed.current && event.currentTarget === event.target) dismiss();
        backdropPressed.current = false;
      }}>
      <GlassPanel variant="floating" className="service-dialog-frame">
        <header className="service-dialog-header">
          <h2 id={titleId}><span className="service-dialog-emblem" aria-hidden="true">{emblem}</span>{title}</h2>
          <Button ref={close} variant="secondary" size="icon" className="service-dialog-close" aria-label={t.serviceDetail.close}
            onClick={dismiss}><AppIcon icon={X} /></Button>
        </header>
        <div ref={content} className="service-dialog-scroll" tabIndex={0}>{children}</div>
        <footer className="service-dialog-footer">{footer}</footer>
      </GlassPanel>
    </dialog>
  );
}
