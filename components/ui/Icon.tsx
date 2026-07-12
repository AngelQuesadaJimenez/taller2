import type { SVGProps } from "react";

/**
 * Set de iconos SVG inline (sin dependencias externas).
 * Todos heredan `currentColor` y aceptan className.
 */

type IconName =
  | "starter"
  | "alternator"
  | "repair"
  | "machinery"
  | "light"
  | "trophy"
  | "truck"
  | "wrench"
  | "box"
  | "shield"
  | "heart"
  | "phone"
  | "whatsapp"
  | "mail"
  | "pin"
  | "clock"
  | "check"
  | "chevron"
  | "menu"
  | "close"
  | "spark"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "arrow";

const paths: Record<IconName, JSX.Element> = {
  spark: (
    <path d="M13 2L4.5 13.5H11l-1 8.5L20 10h-6.5L13 2z" />
  ),
  starter: (
    <>
      <circle cx="9" cy="12" r="6" />
      <path d="M15 9h5M15 15h5M17.5 9v6M9 9v6M6 12h6" />
    </>
  ),
  alternator: (
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 5v3M12 16v3M5 12h3M16 12h3M12 12l2.5-2.5" />
    </>
  ),
  repair: (
    <path d="M14.7 6.3a4 4 0 00-5.4 5.2L4 16.8 7.2 20l5.3-5.3a4 4 0 005.2-5.4l-2.6 2.6-2.2-.4-.4-2.2 2.2-2.6z" />
  ),
  machinery: (
    <>
      <path d="M3 17h11v-4l3-1V8h-4l-2 3H3z" />
      <circle cx="6.5" cy="18.5" r="1.8" />
      <circle cx="15" cy="18.5" r="1.8" />
    </>
  ),
  light: (
    <path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2A6 6 0 0012 3z" />
  ),
  trophy: (
    <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 01-10 0V4zM7 6H4v2a3 3 0 003 3M17 6h3v2a3 3 0 01-3 3" />
  ),
  truck: (
    <>
      <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  wrench: (
    <path d="M15 6a3.5 3.5 0 00-4.6 4.6l-6 6L6.4 18l6-6A3.5 3.5 0 0018 8l-2 2-2-2 2-2z" />
  ),
  box: (
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM4 7.5l8 4.5 8-4.5M12 12v9" />
  ),
  shield: <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zM9 12l2 2 4-4" />,
  heart: (
    <path d="M12 20s-7-4.3-7-9.3A3.7 3.7 0 0112 8a3.7 3.7 0 017 2.7c0 5-7 9.3-7 9.3z" />
  ),
  phone: (
    <path d="M4 5a2 2 0 012-2h2l2 5-2 1a11 11 0 005 5l1-2 5 2v2a2 2 0 01-2 2A16 16 0 014 5z" />
  ),
  whatsapp: (
    <path d="M20 12a8 8 0 01-11.8 7L4 20l1-4.1A8 8 0 1120 12zM9 8.5c-.3 0-.7.1-1 .5s-1 1-1 2.3 1.1 2.7 1.2 2.9c.2.2 2.1 3.4 5.3 4.6 2.6 1 3.1.8 3.7.8s1.8-.7 2-1.4c.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.7-.4l-2-1c-.3-.1-.5-.1-.7.2l-.7.9c-.2.2-.3.2-.6.1s-1.3-.5-2.4-1.5c-.9-.8-1.5-1.8-1.7-2.1s0-.4.1-.6l.5-.6c.2-.2.2-.4.3-.6s0-.4 0-.5l-.9-2.1c-.2-.5-.4-.4-.6-.4z" />
  ),
  mail: <path d="M3 6h18v12H3zM3 7l9 6 9-6" />,
  pin: (
    <>
      <path d="M12 21s-6-5.7-6-10a6 6 0 1112 0c0 4.3-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </>
  ),
  check: <path d="M5 12l5 5 9-11" />,
  chevron: <path d="M6 9l6 6 6-6" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  facebook: (
    <path d="M14 8h2V5h-2c-2 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.2l.8-3H14V8.6c0-.4.3-.6.7-.6z" />
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  tiktok: (
    <path d="M14 4v9.5a3 3 0 11-2.5-3V7A6 6 0 0014 13V9.5A5 5 0 0019 12V9a3.5 3.5 0 01-3-3.5V4h-2z" />
  ),
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export function Icon({ name, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
