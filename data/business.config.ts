export type PaymentBrandImages = Readonly<Record<"light" | "dark", {
  src: `/brands/${string}`;
  width: number;
  height: number;
}>>;

const district = "Río Segundo";
const tradeName = "Alternadores y Arrancadores " + district;

export type Coordinates = readonly [latitude: number, longitude: number];

export interface Landmark {
  name: string;
  coordinates: Coordinates;
  source: string;
}

interface BusinessLocation {
  name: string;
  address: string;
  street: string;
  district: string;
  province: string;
  coordinates: Coordinates | null;
  propertyOutline: readonly Coordinates[];
  accessPath: readonly Coordinates[];
  entranceCoordinates: Coordinates | null;
  entranceGuide: readonly Coordinates[];
  googleMapsPlaceId: string | null;
  wazeUrl: string;
  areaCenter: Coordinates;
  landmarks: readonly Landmark[];
}

export const businessLocation: BusinessLocation = {
  name: tradeName,
  address: "Calle Arias, Río Segundo, Alajuela, Costa Rica",
  street: "Calle Arias",
  district,
  province: "Alajuela",
  // Predio señalado por el usuario en la captura, alineada con la ortofoto del IGN.
  coordinates: [10.002114, -84.182999],
  propertyOutline: [
    [10.002309, -84.183127],
    [10.002247, -84.182909],
    [10.001945, -84.182850],
    [10.001935, -84.183077],
    [10.002309, -84.183127],
  ],
  // Acceso indicado por el usuario. OpenStreetMap: vías 114913784 y 367369031.
  accessPath: [
    [10.004375, -84.182950],
    [10.0041602, -84.1829104],
    [10.0038706, -84.1828991],
    [10.003626, -84.1828942],
    [10.0033147, -84.182888],
    [10.0027193, -84.1828357],
    [10.002328, -84.1828092],
    [10.0022751, -84.1828088],
    [10.0022974, -84.1828994],
    [10.002331, -84.183003],
  ],
  entranceCoordinates: null,
  entranceGuide: [],
  googleMapsPlaceId: null,
  wazeUrl: "https://www.waze.com/es/live-map/directions/taller-y-repuestos-electricos-rio-segundo-calle-arias-2440-2131-rio-segundo%2C-alajuela?to=place.w.180748388.1807614952.7509681",
  // Vista del entorno, centrada en el Multicentro. Es independiente del destino.
  areaCenter: [10.00401, -84.18306],
  landmarks: [
    {
      name: "Multicentro Río Segundo",
      coordinates: [10.00401, -84.18306],
      source: "https://www.openstreetmap.org/way/392483721",
    },
  ],
};

const mobilePhone = { display: "8939-1999", tel: "+50689391999" } as const;
const landline = { display: "2440-2131", tel: "+50624402131" } as const;

export const business = {
  name: businessLocation.name,
  tradeName,
  shortName: "RS",
  phones: [mobilePhone, landline],
  voice: { mobile: mobilePhone, landline },
  whatsapp: {
    number: mobilePhone.tel.slice(1),
    display: mobilePhone.display,
  },
  whatsappSecondary: { number: "50683927096", display: "8392-7096" },
  payments: {
    methods: [
      { id: "sinpe", brand: {
        light: { src: "/brands/sinpe-movil.png", width: 567, height: 419 },
        dark: { src: "/brands/sinpe-movil-invertido.png", width: 650, height: 466 },
      } satisfies PaymentBrandImages },
      { id: "efectivo", icon: "banknote" },
      { id: "tarjeta", icon: "creditCard" },
      { id: "transferencia", icon: "landmark" },
      { id: "bac", brand: null, months: 3 },
    ],
  },
  socials: [
    { brand: "facebook", label: "Facebook", url: "https://www.facebook.com/TalleryRepuestoselectricosRio2/" },
    { brand: "instagram", label: "Instagram", url: "https://www.instagram.com/alternadoresyarrancadores_rio2/" },
  ],
  hours: [
    { id: "weekdays", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:00", closes: "17:00" },
    { id: "saturday", days: ["Saturday"], opens: "07:00", closes: "12:00" },
  ],
  website: process.env.NEXT_PUBLIC_SITE_URL || "https://www.alternadoresyarrancadoresrio2.com",
} as const;

export const mapTiles = {
  url: process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: process.env.NEXT_PUBLIC_MAP_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19,
};
