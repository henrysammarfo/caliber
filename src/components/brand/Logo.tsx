import { Link } from "@tanstack/react-router";

export function CaliberMark({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <g transform="rotate(-30 12 12)">
        <circle cx="7.3" cy="3.2" r="1.45" />
        <rect x="5.5" y="4.7" width="3.6" height="14.6" rx="1.8" />
        <rect x="14.9" y="4.7" width="3.6" height="14.6" rx="1.8" />
        <circle cx="16.7" cy="20.8" r="1.45" />
      </g>
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="CALIBER"
      className={`inline-flex items-center gap-[9px] text-[15.5px] font-semibold tracking-[-0.03em] text-foreground ${className}`}
    >
      <CaliberMark />
      <span>
        CALIBER<span className="font-normal text-muted-ink">.xyz</span>
      </span>
    </Link>
  );
}
