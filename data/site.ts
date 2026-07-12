/**
 * FUENTE ÚNICA DE VERDAD del negocio.
 * El propietario puede editar SOLO este archivo para actualizar
 * teléfonos, textos, servicios, etc. sin tocar los componentes.
 *
 * Los campos marcados con  // TODO(owner)  requieren confirmación
 * o información que aún no está disponible públicamente.
 */

export const site = {
  name: "Alternadores y Arrancadores Río Segundo",
  shortName: "Alternadores Río 2",
  legalName: "Taller y Repuestos Eléctricos Río Segundo",
  tagline: "Especialistas en Arranque y Generación",
  slogan: "Más de 30 años dándole vida a tu motor",
  description:
    "Venta y reparación de alternadores y arrancadores para vehículos livianos, pesados y maquinaria especializada. Más de 30 años de experiencia en Río Segundo, Alajuela.",
  yearsExperience: 30,

  // ── Contacto ──
  phones: [
    { label: "Taller", number: "2440-2131", tel: "+50624402131" },
    { label: "Celular / WhatsApp", number: "8392-7096", tel: "+50683927096" },
    { label: "Celular", number: "8939-1999", tel: "+50689391999" },
  ],
  whatsapp: {
    number: "50683927096",
    display: "8392-7096",
    defaultMessage:
      "Hola, vengo desde su página web y quiero información sobre alternadores/arrancadores.",
  },
  email: "tallerelectrico.rio2@hotmail.com",

  // ── Ubicación ──
  address: {
    line: "De Muflicentro Río Segundo, 300 metros sur",
    district: "Río Segundo",
    city: "Alajuela",
    country: "Costa Rica",
    // TODO(owner): confirmar coordenadas exactas para el mapa
    mapEmbed:
      "https://www.google.com/maps?q=R%C3%ADo%20Segundo%20Alajuela%20Costa%20Rica&output=embed",
    mapLink: "https://maps.google.com/?q=Río+Segundo+Alajuela+Costa+Rica",
  },

  // ── Horario ──
  // TODO(owner): confirmar horario real de atención. Valores tentativos:
  hours: [
    { day: "Lunes a Viernes", time: "8:00 a.m. – 5:00 p.m." },
    { day: "Sábado", time: "8:00 a.m. – 12:00 m.d." },
    { day: "Domingo", time: "Cerrado" },
  ],

  // ── Redes sociales ──
  social: {
    facebook: "https://www.facebook.com/TalleryRepuestoselectricosRio2/",
    instagram: "https://www.instagram.com/alternadoresyarrancadores_rio2",
    tiktok: "https://www.tiktok.com/@alternadoresarran",
  },
} as const;

export type Service = {
  slug: string;
  name: string;
  description: string;
  benefit: string;
  icon: "starter" | "alternator" | "repair" | "machinery" | "light";
};

export const services: Service[] = [
  {
    slug: "arrancadores-pesado",
    name: "Arrancadores Pesado y Maquinaria",
    description:
      "Arrancadores para camiones, buses, tractores y maquinaria industrial de alta exigencia.",
    benefit: "Potencia de arranque garantizada, incluso en trabajo pesado diario.",
    icon: "machinery",
  },
  {
    slug: "alternadores-pesado",
    name: "Alternadores Pesado y Maquinaria",
    description:
      "Alternadores de alto amperaje para flotas, agricultura, construcción y equipo especializado.",
    benefit: "Carga estable para todos los sistemas eléctricos de tu equipo.",
    icon: "machinery",
  },
  {
    slug: "alternadores-liviano",
    name: "Alternadores Liviano",
    description:
      "Alternadores para automóviles, pick-ups y vehículos de uso diario, nuevos y reconstruidos.",
    benefit: "Batería siempre cargada y sistema eléctrico sin fallas.",
    icon: "alternator",
  },
  {
    slug: "arrancadores-liviano",
    name: "Arrancadores Liviano",
    description:
      "Arrancadores para vehículos livianos de todas las marcas, con repuestos originales y alternativos.",
    benefit: "Que tu carro encienda a la primera, todos los días.",
    icon: "starter",
  },
  {
    slug: "reparacion",
    name: "Reparación de Alternadores y Arrancadores",
    description:
      "Diagnóstico, reparación y reconstrucción con banco de pruebas y garantía en el trabajo.",
    benefit: "Ahorra reparando en lugar de comprar nuevo, con calidad de taller.",
    icon: "repair",
  },
];

// Marcas de vehículos y maquinaria con las que trabajan (tomadas del sitio actual)
export const brands = [
  "Toyota",
  "Nissan",
  "Honda",
  "Lexus",
  "Mercedes Benz",
  "Isuzu",
  "Hino",
  "Komatsu",
  "New Holland",
  "Land Cruiser",
];

export const whyChooseUs = [
  {
    title: "+30 años de experiencia",
    text: "Tres décadas resolviendo problemas de arranque y carga en la zona de Alajuela.",
    icon: "trophy",
  },
  {
    title: "Liviano, pesado y maquinaria",
    text: "Desde tu automóvil hasta tractores, montacargas y equipo industrial.",
    icon: "truck",
  },
  {
    title: "Venta y reparación",
    text: "Te vendemos la pieza nueva o reparamos la tuya. Tú eliges lo que más te conviene.",
    icon: "wrench",
  },
  {
    title: "Repuestos en existencia",
    text: "Amplio inventario de alternadores y arrancadores listos para entrega.",
    icon: "box",
  },
  {
    title: "Diagnóstico honesto",
    text: "Te decimos exactamente qué necesita tu equipo, sin cobros innecesarios.",
    icon: "shield",
  },
  {
    title: "Atención personalizada",
    text: "Trato directo y asesoría técnica de gente que conoce el oficio.",
    icon: "heart",
  },
];

export const process = [
  {
    step: 1,
    title: "Contáctanos",
    text: "Escríbenos por WhatsApp o llámanos con la marca y modelo de tu vehículo o equipo.",
  },
  {
    step: 2,
    title: "Diagnóstico",
    text: "Revisamos tu alternador o arrancador y te decimos si conviene repararlo o cambiarlo.",
  },
  {
    step: 3,
    title: "Cotización clara",
    text: "Te damos precio y tiempo de entrega antes de empezar cualquier trabajo.",
  },
  {
    step: 4,
    title: "Listo para rodar",
    text: "Probamos la pieza en banco y te entregamos tu equipo funcionando.",
  },
];

// ── Preguntas frecuentes ──
export const faqs = [
  {
    q: "¿Reparan o solo venden piezas nuevas?",
    a: "Hacemos ambas cosas. Reparamos y reconstruimos alternadores y arrancadores, y también vendemos piezas nuevas y reconstruidas. Te recomendamos la opción que más te convenga según el estado de tu equipo.",
  },
  {
    q: "¿Trabajan con maquinaria pesada e industrial?",
    a: "Sí. Atendemos vehículos livianos, pesados, agrícolas y maquinaria especializada como montacargas, tractores y equipo de construcción.",
  },
  {
    q: "¿Con cuáles marcas trabajan?",
    a: "Trabajamos con la mayoría de marcas del mercado: Toyota, Nissan, Honda, Lexus, Mercedes Benz, Isuzu, Hino, Komatsu, New Holland, entre otras.",
  },
  {
    q: "¿Dónde están ubicados?",
    a: "Estamos en Río Segundo, Alajuela, de Muflicentro Río Segundo 300 metros al sur.",
  },
  {
    q: "¿Cuánto cuesta reparar un alternador o arrancador?",
    a: "El precio depende de la marca, el modelo y el estado de la pieza. Escríbenos por WhatsApp con los datos de tu vehículo y te damos una cotización sin compromiso.", // TODO(owner): definir rango de precios si se desea publicar
  },
  {
    q: "¿Cuánto tardan en entregar el trabajo?",
    a: "Muchas reparaciones se entregan el mismo día. En casos que requieren repuestos específicos te indicamos el tiempo estimado al momento de la cotización.", // TODO(owner): confirmar tiempos
  },
  {
    q: "¿Ofrecen garantía?",
    a: "Sí, respaldamos nuestros trabajos y las piezas que vendemos. Consulta las condiciones específicas al momento de tu compra o reparación.", // TODO(owner): confirmar términos de garantía
  },
  {
    q: "¿Hacen envíos a otras zonas del país?",
    a: "Consúltanos por WhatsApp. Coordinamos el envío de repuestos según tu ubicación.", // TODO(owner): confirmar política de envíos
  },
];
