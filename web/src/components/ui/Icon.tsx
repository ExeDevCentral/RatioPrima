import React from 'react';

export type IconName =
  | 'home'
  | 'map'
  | 'orbit'
  | 'flame'
  | 'compass'
  | 'cube'
  | 'scale'
  | 'frontier'
  | 'nexus'
  | 'trophy'
  | 'book'
  | 'target'
  | 'flask'
  | 'chart'
  | 'calendar'
  | 'check'
  | 'lock'
  | 'play'
  | 'arrow'
  | 'star'
  | 'bolt'
  | 'brain'
  | 'spark'
  | 'route'
  | 'flag'
  | 'crown'
  | 'seal'
  | 'laser'
  | 'close'
  | 'menu'
  | 'sound'
  | 'mute'
  | 'bulb'
  | 'refresh'
  | 'clock'
  | 'shield'
  | 'plus'
  | 'layers'
  | 'eye'
  | 'chevron';

const PATHS: Record<IconName, React.ReactNode> = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </>
  ),
  map: (
    <>
      <path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  orbit: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4.2" transform="rotate(-28 12 12)" />
      <circle cx="19.2" cy="8.2" r="1.1" />
    </>
  ),
  flame: (
    <>
      <path d="M12 22c4 0 7-2.8 7-6.7 0-3.2-2-5.4-4.2-8.1-.9 2-2.1 3-3.1 3.4.3-3.2-1-6-2.6-7.6-.4 4.2-4.1 6.8-4.1 11.9C5 19 8.3 22 12 22Z" />
      <path d="M12 22c1.9 0 3.2-1.4 3.2-3.2 0-1.8-1.2-2.8-2.3-4.3-.5 1.1-1.2 1.7-1.7 2-.1-1.4-.7-2.6-1.4-3.4-.3 2.1-2 3.3-2 5.7C7.8 20.5 9.7 22 12 22Z" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.6 8.4-2 5.2-5.2 2 2-5.2 5.2-2Z" />
      <path d="M12 3v1M12 20v1M3 12h1M20 12h1" />
    </>
  ),
  cube: (
    <>
      <path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z" />
      <path d="m3 7 9 5 9-5M12 12v10" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3v18M7 21h10M4 7h16" />
      <path d="M7 7 4 13h6L7 7ZM17 7l-3 6h6l-3-6Z" />
      <path d="M4 13a3 3 0 0 0 6 0M14 13a3 3 0 0 0 6 0" />
    </>
  ),
  frontier: (
    <>
      <path d="M3 18 9 7l4 7 3-4 5 8" />
      <path d="M3 21h18" />
      <circle cx="18" cy="8" r="2" />
    </>
  ),
  nexus: (
    <>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <circle cx="12" cy="18" r="2.2" />
      <path d="M8 7.2 15.8 17M16 7.2 8.2 17M8.2 6h7.6" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4" />
      <path d="M12 13v5M8 21h8M9 18h6" />
    </>
  ),
  book: (
    <>
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22V4.5Z" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M8 7h8M8 11h5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6M10 3v6l-5.2 9A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-3L14 9V3" />
      <path d="M7.5 15h9" />
    </>
  ),
  chart: (
    <>
      <path d="M3 21h18" />
      <path d="M6 17V9M11 17V5M16 17v-6M21 17v-9" />
      <path d="m5 7 5-3 5 4 6-5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </>
  ),
  check: <path d="m4 12 5 5L20 6" />,
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
    </>
  ),
  play: <path d="M7 4.5v15l13-7.5L7 4.5Z" />,
  arrow: <path d="M4 12h16M14 6l6 6-6 6" />,
  star: <path d="m12 3 2.7 5.7 6.3.9-4.6 4.4 1.1 6.2-5.5-2.9-5.5 2.9 1.1-6.2L3 9.6l6.3-.9L12 3Z" />,
  bolt: <path d="m13 2-9 12h6l-1 8 9-12h-6l1-8Z" />,
  brain: (
    <>
      <path d="M9.5 4.5A3 3 0 0 0 6 7a3 3 0 0 0-1 5.8A3 3 0 0 0 8 18a3 3 0 0 0 4 1.5V4.5a3 3 0 0 0-2.5 0Z" />
      <path d="M14.5 4.5A3 3 0 0 1 18 7a3 3 0 0 1 1 5.8A3 3 0 0 1 16 18a3 3 0 0 1-4 1.5" />
      <path d="M9 9.5h2M13 12.5h2" />
    </>
  ),
  spark: (
    <>
      <path d="M12 2v5M12 17v5M2 12h5M17 12h5" />
      <path d="m5 5 3.5 3.5M15.5 15.5 19 19M19 5l-3.5 3.5M8.5 15.5 5 19" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="19" r="2.5" />
      <circle cx="18" cy="5" r="2.5" />
      <path d="M8.5 19H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5" />
    </>
  ),
  flag: (
    <>
      <path d="M5 22V3M5 4h13l-2 4 2 4H5" />
    </>
  ),
  crown: <path d="M3 7l4 4 5-7 5 7 4-4v11H3V7Z" />,
  seal: (
    <>
      <path d="M12 2.5 20 7v6c0 4.5-3.4 7.6-8 9-4.6-1.4-8-4.5-8-9V7l8-4.5Z" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  laser: (
    <>
      <path d="M3 21 21 3" />
      <path d="M14 3h7v7" />
      <path d="M6 18h.01M9 15h.01M12 12h.01M15 9h.01" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  sound: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="M16 8a5 5 0 0 1 0 8M18.5 5.5a9 9 0 0 1 0 13" />
    </>
  ),
  mute: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="m16 9 5 6M21 9l-5 6" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3Z" />
    </>
  ),
  refresh: (
    <>
      <path d="M21 12a9 9 0 1 1-2.6-6.4" />
      <path d="M21 3v6h-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.5 20 7v6c0 4.5-3.4 7.6-8 9-4.6-1.4-8-4.5-8-9V7l8-4.5Z" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  layers: (
    <>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  chevron: <path d="m9 6 6 6-6 6" />
};

export default function Icon({
  name,
  size = 20,
  className,
  filled = false
}: {
  name: IconName;
  size?: number;
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
