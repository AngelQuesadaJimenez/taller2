"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { services } from "@/data/site";

type Status = "idle" | "loading" | "success" | "error";
type Errors = Partial<Record<"name" | "phone" | "email" | "message", string>>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  function validate(form: HTMLFormElement): Errors {
    const data = new FormData(form);
    const e: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (name.length < 2) e.name = "Ingresa tu nombre.";
    if (phone.replace(/\D/g, "").length < 8) e.phone = "Ingresa un teléfono válido.";
    if (email && !emailRe.test(email)) e.email = "Correo no válido.";
    if (message.length < 10) e.message = "Cuéntanos un poco más (mín. 10 caracteres).";
    return e;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;

    // Honeypot anti-spam
    if ((form.elements.namedItem("company") as HTMLInputElement)?.value) return;

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center rounded-2xl bg-brand-50 p-8 text-center"
      >
        <span className="grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-600">
          <Icon name="check" className="h-8 w-8" />
        </span>
        <h3 className="mt-4 font-heading text-xl font-bold text-brand-800">
          ¡Mensaje enviado!
        </h3>
        <p className="mt-2 text-brand-600">
          Gracias por escribirnos. Te contactaremos lo antes posible.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-outline mt-6"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  const inputBase =
    "w-full rounded-xl border bg-white px-4 py-3 text-brand-800 placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {/* Honeypot oculto */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre *" error={errors.name}>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Tu nombre"
            aria-invalid={!!errors.name}
            className={`${inputBase} ${errors.name ? "border-red-400" : "border-brand-200"}`}
          />
        </Field>
        <Field label="Teléfono / WhatsApp *" error={errors.phone}>
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="8888-8888"
            aria-invalid={!!errors.phone}
            className={`${inputBase} ${errors.phone ? "border-red-400" : "border-brand-200"}`}
          />
        </Field>
      </div>

      <Field label="Correo (opcional)" error={errors.email}>
        <input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="correo@ejemplo.com"
          aria-invalid={!!errors.email}
          className={`${inputBase} ${errors.email ? "border-red-400" : "border-brand-200"}`}
        />
      </Field>

      <Field label="¿Qué necesitas?">
        <select name="service" className={`${inputBase} border-brand-200`} defaultValue="">
          <option value="" disabled>
            Selecciona un servicio
          </option>
          {services.map((s) => (
            <option key={s.slug} value={s.name}>
              {s.name}
            </option>
          ))}
          <option value="Otro">Otro / No estoy seguro</option>
        </select>
      </Field>

      <Field label="Mensaje *" error={errors.message}>
        <textarea
          name="message"
          rows={4}
          required
          placeholder="Marca y modelo de tu vehículo o equipo, y qué problema presenta."
          aria-invalid={!!errors.message}
          className={`${inputBase} resize-none ${
            errors.message ? "border-red-400" : "border-brand-200"
          }`}
        />
      </Field>

      {status === "error" && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Ocurrió un error al enviar. Intenta de nuevo o escríbenos por WhatsApp.
        </p>
      )}

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
        {status === "loading" ? (
          <>
            <Spinner /> Enviando…
          </>
        ) : (
          <>
            Enviar mensaje
            <Icon name="arrow" className="h-5 w-5" />
          </>
        )}
      </button>
      <p className="text-center text-xs text-brand-400">
        Al enviar aceptas nuestro Aviso de Privacidad. No compartimos tus datos.
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-brand-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
      />
    </svg>
  );
}
