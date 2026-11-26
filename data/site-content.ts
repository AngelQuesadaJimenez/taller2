import { photos } from "./photos";
import { AlternatorIcon, StarterIcon } from "./component-icons";

export const navigation = [
  { id: "inicio" },
  { id: "servicios" },
  { id: "repuestos" },
  { id: "proceso" },
  { id: "ubicacion" },
  { id: "contacto" },
] as const;

export const services = [
  {
    id: "alternator-sales", component: "alternador", icon: AlternatorIcon,
    image: photos.alternatorDetail, photoKey: "alternator",
  },
  {
    id: "starters", component: "arrancador", icon: StarterIcon,
    image: photos.starterDetail, photoKey: "starter",
  },
] as const;

export type Service = typeof services[number];

export const process = ["consulta", "revision", "atencion"] as const;
