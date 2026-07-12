"use client";

import { useState } from "react";
import { faqs } from "@/data/site";
import { Icon } from "@/components/ui/Icon";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section bg-brand-50">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <span className="eyebrow">Preguntas frecuentes</span>
          <h2 className="h2">Resolvemos tus dudas</h2>
          <p className="mt-4 text-brand-600">
            ¿No encuentras tu respuesta? Escríbenos por WhatsApp y con gusto te ayudamos.
          </p>
        </div>

        <div className="divide-y divide-brand-200 rounded-2xl bg-white px-6 shadow-card">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="py-2">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                  >
                    <span className="font-heading text-base font-semibold text-brand-800">
                      {f.q}
                    </span>
                    <Icon
                      name="chevron"
                      className={`h-5 w-5 flex-none text-brand-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-4 text-brand-600">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
