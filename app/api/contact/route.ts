import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { site } from "@/data/site";

/**
 * Endpoint del formulario de contacto.
 *
 * - Valida los datos en el servidor (defensa en profundidad).
 * - Si hay credenciales SMTP configuradas (.env.local), envía el correo real.
 * - Si NO hay SMTP, registra el mensaje en consola y responde OK
 *   (útil en desarrollo y para no bloquear al usuario).
 *
 * Variables necesarias para el envío real:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, CONTACT_TO_EMAIL
 */

function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot: si viene relleno, es bot → fingimos éxito sin hacer nada
    if (body.company) return NextResponse.json({ ok: true });

    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const service = String(body.service ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (name.length < 2 || phone.replace(/\D/g, "").length < 8 || message.length < 10) {
      return NextResponse.json({ ok: false, error: "Datos inválidos." }, { status: 400 });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, CONTACT_TO_EMAIL } = process.env;
    const smtpReady = SMTP_HOST && SMTP_USER && SMTP_PASSWORD;

    if (!smtpReady) {
      // Modo desarrollo / sin credenciales: no se pierde el mensaje.
      console.log("[contacto] (SMTP no configurado)", {
        name,
        phone,
        email,
        service,
        message,
      });
      return NextResponse.json({ ok: true });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 587),
      secure: Number(SMTP_PORT ?? 587) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });

    await transporter.sendMail({
      from: `"Web ${site.shortName}" <${SMTP_USER}>`,
      to: CONTACT_TO_EMAIL ?? site.email,
      replyTo: email || undefined,
      subject: `Nuevo contacto desde la web: ${name}`,
      text:
        `Nombre: ${name}\n` +
        `Teléfono: ${phone}\n` +
        `Correo: ${email || "(no indicado)"}\n` +
        `Servicio de interés: ${service || "(no indicado)"}\n\n` +
        `Mensaje:\n${message}`,
      html:
        `<h2>Nuevo contacto desde la web</h2>` +
        `<p><strong>Nombre:</strong> ${esc(name)}</p>` +
        `<p><strong>Teléfono:</strong> ${esc(phone)}</p>` +
        `<p><strong>Correo:</strong> ${esc(email) || "(no indicado)"}</p>` +
        `<p><strong>Servicio de interés:</strong> ${esc(service) || "(no indicado)"}</p>` +
        `<p><strong>Mensaje:</strong><br>${esc(message).replace(/\n/g, "<br>")}</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contacto] error:", err);
    return NextResponse.json({ ok: false, error: "Error del servidor." }, { status: 500 });
  }
}
