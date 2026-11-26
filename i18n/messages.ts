import es from "./es.json";
import en from "./en.json";
import type { Locale } from "./config";

export type Messages = typeof es;
export type MapNotice = "webgl" | "lost" | "tileFailure" | "importFailure";
export const messages: Record<Locale, Messages> = { es, en };
